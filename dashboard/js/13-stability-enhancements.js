// Non-invasive stability layer. No changes to persisted schemas or Google Drive APIs.
(() => {
  'use strict';
  // Only dashboard content imagery is deferred; toolbar/account imagery remains eager.
  const root = document.getElementById('groupsContainer');
  if (root) {
    const prepare = node => {
      if (node.nodeType !== 1) return;
      const images = node.matches?.('img') ? [node] : node.querySelectorAll?.('img');
      if (!images) return;
      for (const img of images) {
        if (!img.hasAttribute('loading')) img.loading = 'lazy';
        if (!img.hasAttribute('decoding')) img.decoding = 'async';
      }
    };
    prepare(root);
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) prepare(node);
    });
    observer.observe(root, {childList:true, subtree:true});
    window.addEventListener('pagehide', () => observer.disconnect(), {once:true});
  }
  // Capture diagnostic details without altering login, data, or interrupting the UI.
  const recent = [];
  function record(kind, value) {
    recent.push({kind, at:new Date().toISOString(), message:String(value || 'Unknown error').slice(0,500)});
    if (recent.length > 20) recent.shift();
  }
  window.addEventListener('error', event => record('error', event.message));
  window.addEventListener('unhandledrejection', event => record('promise', event.reason?.message || event.reason));
  window.__dashboardDiagnostics = () => recent.map(entry => ({...entry}));
})();
