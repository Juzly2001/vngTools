(() => {
  'use strict';

  if (window.GHTKTools?.__runtimeVersion === '1.0.0') return;

  const native = {
    addEventListener: EventTarget.prototype.addEventListener,
    removeEventListener: EventTarget.prototype.removeEventListener,
    appendChild: Node.prototype.appendChild,
    insertBefore: Node.prototype.insertBefore,
    append: Element.prototype.append,
    prepend: Element.prototype.prepend,
    setTimeout: window.setTimeout,
    clearTimeout: window.clearTimeout,
    setInterval: window.setInterval,
    clearInterval: window.clearInterval,
  };

  const modules = new Map();
  let active = null;

  function makeState(id) {
    return {
      id,
      enabled: false,
      listeners: [],
      listenerMap: new WeakMap(),
      nodes: new Set(),
      timeouts: new Set(),
      intervals: new Set(),
      init: null,
      cleanup: null,
      meta: {},
      error: null,
    };
  }

  function state(id) {
    if (!modules.has(id)) modules.set(id, makeState(id));
    return modules.get(id);
  }

  function withContext(mod, fn, thisArg, args = []) {
    const previous = active;
    active = mod;
    try { return fn.apply(thisArg, args); }
    finally { active = previous; }
  }

  EventTarget.prototype.addEventListener = function(type, listener, options) {
    const mod = active;
    if (!mod || !listener) return native.addEventListener.call(this, type, listener, options);

    let wrapped;
    if (typeof listener === 'function') {
      wrapped = function(...args) { return withContext(mod, listener, this, args); };
    } else if (typeof listener?.handleEvent === 'function') {
      wrapped = { handleEvent: (...args) => withContext(mod, listener.handleEvent, listener, args) };
    } else {
      return native.addEventListener.call(this, type, listener, options);
    }

    let targetMap = mod.listenerMap.get(this);
    if (!targetMap) {
      targetMap = new Map();
      mod.listenerMap.set(this, targetMap);
    }
    const capture = options === true || !!options?.capture;
    const key = `${type}::${capture ? 1 : 0}`;
    if (!targetMap.has(key)) targetMap.set(key, new Map());
    targetMap.get(key).set(listener, wrapped);
    mod.listeners.push({ target: this, type, original: listener, wrapped, options });
    return native.addEventListener.call(this, type, wrapped, options);
  };

  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    const capture = options === true || !!options?.capture;
    const key = `${type}::${capture ? 1 : 0}`;
    for (const mod of modules.values()) {
      const wrapped = mod.listenerMap.get(this)?.get(key)?.get(listener);
      if (wrapped) {
        mod.listenerMap.get(this).get(key).delete(listener);
        return native.removeEventListener.call(this, type, wrapped, options);
      }
    }
    return native.removeEventListener.call(this, type, listener, options);
  };

  function trackNode(node) {
    if (active && node?.nodeType) active.nodes.add(node);
  }

  Node.prototype.appendChild = function(child) {
    const result = native.appendChild.call(this, child);
    trackNode(child);
    return result;
  };
  Node.prototype.insertBefore = function(child, ref) {
    const result = native.insertBefore.call(this, child, ref);
    trackNode(child);
    return result;
  };
  Element.prototype.append = function(...items) {
    const result = native.append.apply(this, items);
    items.forEach(trackNode);
    return result;
  };
  Element.prototype.prepend = function(...items) {
    const result = native.prepend.apply(this, items);
    items.forEach(trackNode);
    return result;
  };

  window.setTimeout = function(handler, timeout, ...args) {
    const mod = active;
    if (!mod) return native.setTimeout.call(window, handler, timeout, ...args);
    let id;
    const wrapped = typeof handler === 'function'
      ? (...cbArgs) => {
          mod.timeouts.delete(id);
          return withContext(mod, handler, window, cbArgs);
        }
      : handler;
    id = native.setTimeout.call(window, wrapped, timeout, ...args);
    mod.timeouts.add(id);
    return id;
  };

  window.clearTimeout = function(id) {
    modules.forEach(m => m.timeouts.delete(id));
    return native.clearTimeout.call(window, id);
  };

  window.setInterval = function(handler, timeout, ...args) {
    const mod = active;
    if (!mod) return native.setInterval.call(window, handler, timeout, ...args);
    const wrapped = typeof handler === 'function'
      ? (...cbArgs) => withContext(mod, handler, window, cbArgs)
      : handler;
    const id = native.setInterval.call(window, wrapped, timeout, ...args);
    mod.intervals.add(id);
    return id;
  };

  window.clearInterval = function(id) {
    modules.forEach(m => m.intervals.delete(id));
    return native.clearInterval.call(window, id);
  };

  const api = {
    __runtimeVersion: '1.0.0',

    register(id, config) {
      const mod = state(id);
      mod.init = config.start || config.run || null;
      mod.cleanup = config.stop || null;
      mod.meta = { ...config };
      delete mod.meta.start;
      delete mod.meta.stop;
      delete mod.meta.run;
      return api;
    },

    start(id) {
      const mod = state(id);
      if (mod.enabled) return true;
      if (typeof mod.init !== 'function') throw new Error(`Tool ${id} chưa được đăng ký`);
      mod.error = null;
      try {
        withContext(mod, mod.init, window);
        mod.enabled = true;
        window.dispatchEvent(new CustomEvent('ghtk-tools:change', { detail: { id, enabled: true } }));
        return true;
      } catch (error) {
        mod.error = error;
        console.error(`[GHTKTools] Không thể bật ${id}`, error);
        api.stop(id);
        return false;
      }
    },

    stop(id) {
      const mod = state(id);
      try {
        if (typeof mod.cleanup === 'function') withContext(mod, mod.cleanup, window);
      } catch (error) {
        console.warn(`[GHTKTools] cleanup riêng của ${id} lỗi`, error);
      }

      mod.listeners.splice(0).forEach(({ target, type, wrapped, options }) => {
        try { native.removeEventListener.call(target, type, wrapped, options); } catch (_) {}
      });
      mod.timeouts.forEach(t => { try { native.clearTimeout.call(window, t); } catch (_) {} });
      mod.intervals.forEach(t => { try { native.clearInterval.call(window, t); } catch (_) {} });
      mod.timeouts.clear();
      mod.intervals.clear();

      [...mod.nodes].reverse().forEach(node => {
        try { if (node?.isConnected) node.remove(); } catch (_) {}
      });
      mod.nodes.clear();
      mod.listenerMap = new WeakMap();
      mod.enabled = false;
      window.dispatchEvent(new CustomEvent('ghtk-tools:change', { detail: { id, enabled: false } }));
      return true;
    },

    run(id) {
      const mod = state(id);
      if (typeof mod.init !== 'function') throw new Error(`Tool ${id} chưa được đăng ký`);
      return withContext(mod, mod.init, window);
    },

    isEnabled(id) { return !!state(id).enabled; },
    getMeta(id) { return { ...state(id).meta }; },
    getError(id) { return state(id).error; },
    list() { return [...modules.keys()]; },
  };

  window.GHTKTools = api;
})();
