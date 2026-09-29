// ============================================================================

(function initAvatarOnlyAccountButtonV4() {
    if (window.__AVATAR_ONLY_ACCOUNT_BUTTON_V4_READY__) return;
    window.__AVATAR_ONLY_ACCOUNT_BUTTON_V4_READY__ = true;

    function injectAvatarButtonStylesV4() {
        if (document.getElementById('avatarOnlyAccountButtonV4Styles')) return;

        const style = document.createElement('style');
        style.id = 'avatarOnlyAccountButtonV4Styles';
        style.textContent = `
            #btn-login-google.avatar-only-account-v4{
                width:36px !important;
                min-width:36px !important;
                height:36px !important;
                min-height:36px !important;
                padding:0 !important;
                border-radius:50% !important;
                display:inline-grid !important;
                place-items:center !important;
                overflow:hidden !important;
                flex:0 0 36px !important;
                gap:0 !important;
                line-height:1 !important;
            }

            #btn-login-google.avatar-only-account-v4 img{
                width:100% !important;
                height:100% !important;
                object-fit:cover !important;
                border-radius:50% !important;
                display:block !important;
                border:0 !important;
                margin:0 !important;
                padding:0 !important;
            }

            #btn-login-google.avatar-only-account-v4 .account-avatar-fallback-v4{
                width:100%;
                height:100%;
                display:grid;
                place-items:center;
                border-radius:50%;
                font-size:13px;
                font-weight:800;
                background:color-mix(in srgb, currentColor 10%, transparent);
            }

            #btn-login-google.avatar-only-account-v4 .account-toolbar-name-v2,
            #btn-login-google.avatar-only-account-v4 > span:not(.account-avatar-fallback-v4){
                display:none !important;
            }
        `;
        document.head.appendChild(style);
    }

    function getEffectiveToolbarAvatarV4() {
        try {
            if (typeof getCustomAvatar === 'function') {
                const custom = getCustomAvatar();
                if (custom) return custom;
            }
        } catch (_) {}

        return googleAccountProfile?.picture || '';
    }

    function renderAvatarOnlyAccountButtonV4() {
        injectAvatarButtonStylesV4();

        const btn = document.getElementById('btn-login-google');
        if (!btn) return;

        const connected = typeof isGoogleConnected === 'function' && isGoogleConnected();

        if (!connected) {
            btn.classList.remove('avatar-only-account-v4');
            return;
        }

        btn.classList.add('avatar-only-account-v4');
        btn.removeAttribute('title');
        btn.setAttribute('aria-label', googleAccountProfile?.email ? `Current account: ${googleAccountProfile.email}` : 'Current account');

        const avatarUrl = getEffectiveToolbarAvatarV4();

        if (avatarUrl) {
            btn.innerHTML = `<img src="${escapeHTML(avatarUrl)}" alt="Current account">`;
        } else {
            const label = googleAccountProfile?.name || googleAccountProfile?.email || 'G';
            const initial = String(label).trim().charAt(0).toUpperCase() || 'G';
            btn.innerHTML = `<span class="account-avatar-fallback-v4">${escapeHTML(initial)}</span>`;
        }
    }

    // Re-apply after the base account UI refreshes.
    const updateGoogleAccountUIV4 = updateGoogleAccountUI;
    updateGoogleAccountUI = function() {
        const result = updateGoogleAccountUIV4.apply(this, arguments);
        setTimeout(renderAvatarOnlyAccountButtonV4, 0);
        return result;
    };

    // Re-apply after opening Current account as well.
    const openAccountPanelV4 = openAccountPanel;
    openAccountPanel = function() {
        const result = openAccountPanelV4.apply(this, arguments);
        setTimeout(renderAvatarOnlyAccountButtonV4, 0);
        return result;
    };

    // V3 exposes these helpers. Wrap them so the toolbar avatar changes immediately.
    if (typeof window.changeAccountAvatar === 'function') {
        const changeAvatarV4 = window.changeAccountAvatar;
        window.changeAccountAvatar = async function() {
            const result = await changeAvatarV4.apply(this, arguments);
            setTimeout(renderAvatarOnlyAccountButtonV4, 50);
            return result;
        };
    }

    if (typeof window.resetAccountAvatarToGoogle === 'function') {
        const resetAvatarV4 = window.resetAccountAvatarToGoogle;
        window.resetAccountAvatarToGoogle = function() {
            const result = resetAvatarV4.apply(this, arguments);
            setTimeout(renderAvatarOnlyAccountButtonV4, 0);
            return result;
        };
    }

    // Also watch the avatar shown inside the account modal.
    // When V3 replaces its src after a file is selected, mirror that change to the toolbar.
    function observeAccountAvatarV4() {
        const avatar = document.getElementById('accountAvatar');
        if (!avatar || avatar.__avatarObserverV4) return;

        avatar.__avatarObserverV4 = true;

        const observer = new MutationObserver(() => {
            renderAvatarOnlyAccountButtonV4();
        });

        observer.observe(avatar, {
            attributes:true,
            attributeFilter:['src','style']
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        injectAvatarButtonStylesV4();
        observeAccountAvatarV4();
        setTimeout(renderAvatarOnlyAccountButtonV4, 0);
    });

    window.addEventListener('load', () => {
        let tries = 0;

        const timer = setInterval(() => {
            tries++;
            observeAccountAvatarV4();
            renderAvatarOnlyAccountButtonV4();

            if (
                (typeof isGoogleConnected === 'function' && isGoogleConnected()) ||
                tries >= 40
            ) {
                clearInterval(timer);
            }
        }, 250);
    });

    window.addEventListener('storage', event => {
        if (String(event.key || '').startsWith('workspace_custom_avatar_v')) {
            setTimeout(renderAvatarOnlyAccountButtonV4, 0);
        }
    });

    // Public refresh helper for troubleshooting.
    window.refreshAccountAvatarButton = renderAvatarOnlyAccountButtonV4;
})();
// ============================================================================
// AUTO DRIVE SAVE V5 — PROFESSIONAL HEADER PROFILE BUTTON
// Fixes:
// - Custom avatar on Current account always mirrors to the header button
// - Moves Account out of the Export/Import toolbar into the hero header, beside date
// - Professional circular profile control with status dot + hover/focus states
// - Uses the actually displayed Current account avatar as the first source of truth
// ============================================================================

(function initProfessionalHeaderProfileV5() {
    if (window.__PRO_HEADER_PROFILE_V5_READY__) return;
    window.__PRO_HEADER_PROFILE_V5_READY__ = true;

    const CUSTOM_AVATAR_PREFIX = 'workspace_custom_avatar_v1_';

    function injectProfileHeaderStylesV5() {
        if (document.getElementById('profileHeaderV5Styles')) return;

        const style = document.createElement('style');
        style.id = 'profileHeaderV5Styles';
        style.textContent = `
            .hero-meta-v12.profile-meta-v5{
                display:flex !important;
                align-items:center !important;
                justify-content:flex-end !important;
                gap:12px !important;
            }

            #btn-login-google.profile-header-btn-v5{
                position:relative !important;
                width:40px !important;
                min-width:40px !important;
                height:40px !important;
                min-height:40px !important;
                padding:0 !important;
                margin:0 !important;
                display:grid !important;
                place-items:center !important;
                flex:0 0 40px !important;
                border-radius:50% !important;
                overflow:visible !important;
                border:1px solid color-mix(in srgb, currentColor 14%, transparent) !important;
                background:color-mix(in srgb, var(--bg-primary, #fff) 92%, transparent) !important;
                box-shadow:
                    0 1px 2px rgba(0,0,0,.05),
                    0 4px 14px rgba(0,0,0,.08) !important;
                transition:
                    transform .16s ease,
                    box-shadow .16s ease,
                    border-color .16s ease !important;
                cursor:pointer !important;
            }

            #btn-login-google.profile-header-btn-v5:hover{
                transform:translateY(-1px) !important;
                border-color:color-mix(in srgb, currentColor 24%, transparent) !important;
                box-shadow:
                    0 2px 4px rgba(0,0,0,.06),
                    0 8px 20px rgba(0,0,0,.12) !important;
            }

            #btn-login-google.profile-header-btn-v5:active{
                transform:translateY(0) scale(.97) !important;
            }

            #btn-login-google.profile-header-btn-v5:focus-visible{
                outline:3px solid color-mix(in srgb, currentColor 16%, transparent) !important;
                outline-offset:3px !important;
            }

            #btn-login-google.profile-header-btn-v5 .profile-avatar-v5{
                width:34px !important;
                height:34px !important;
                display:block !important;
                border-radius:50% !important;
                object-fit:cover !important;
                border:0 !important;
                padding:0 !important;
                margin:0 !important;
                pointer-events:none !important;
            }

            #btn-login-google.profile-header-btn-v5 .profile-fallback-v5{
                width:34px !important;
                height:34px !important;
                border-radius:50% !important;
                display:grid !important;
                place-items:center !important;
                font-size:12px !important;
                font-weight:800 !important;
                letter-spacing:.01em !important;
                pointer-events:none !important;
                background:color-mix(in srgb, currentColor 9%, transparent) !important;
            }

            #btn-login-google.profile-header-btn-v5 .profile-status-v5{
                position:absolute !important;
                right:-1px !important;
                bottom:-1px !important;
                width:11px !important;
                height:11px !important;
                border-radius:50% !important;
                border:2px solid var(--bg-primary, #fff) !important;
                background:#22c55e !important;
                box-shadow:0 1px 4px rgba(0,0,0,.18) !important;
                pointer-events:none !important;
            }

            #btn-login-google.profile-header-btn-v5.profile-offline-v5 .profile-status-v5{
                background:#f59e0b !important;
            }

            #btn-login-google.profile-header-btn-v5.profile-disconnected-v5 .profile-status-v5{
                display:none !important;
            }

            /* V4 rules are intentionally superseded here. */
            #btn-login-google.profile-header-btn-v5 .account-toolbar-name-v2,
            #btn-login-google.profile-header-btn-v5 .account-toolbar-avatar-v2,
            #btn-login-google.profile-header-btn-v5 .account-avatar-fallback-v4{
                display:none !important;
            }

            @media (max-width:700px){
                .hero-meta-v12.profile-meta-v5{
                    gap:9px !important;
                }

                #btn-login-google.profile-header-btn-v5{
                    width:38px !important;
                    min-width:38px !important;
                    height:38px !important;
                    min-height:38px !important;
                    flex-basis:38px !important;
                }

                #btn-login-google.profile-header-btn-v5 .profile-avatar-v5,
                #btn-login-google.profile-header-btn-v5 .profile-fallback-v5{
                    width:32px !important;
                    height:32px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function profileIdentityKeyV5() {
        return String(
            googleAccountProfile?.id ||
            googleAccountProfile?.email ||
            'default'
        ).toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
    }

    function readCustomAvatarDirectV5() {
        // Exact key used by V3.
        try {
            const exact = localStorage.getItem(CUSTOM_AVATAR_PREFIX + profileIdentityKeyV5());
            if (exact) return exact;
        } catch (_) {}

        // Fallback for an account profile whose id/email became available later than avatar setup.
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CUSTOM_AVATAR_PREFIX)) keys.push(key);
            }

            if (keys.length === 1) {
                return localStorage.getItem(keys[0]) || '';
            }
        } catch (_) {}

        return '';
    }

    function displayedAccountAvatarV5() {
        const modalAvatar = document.getElementById('accountAvatar');
        if (
            modalAvatar &&
            modalAvatar.style.display !== 'none' &&
            modalAvatar.getAttribute('src')
        ) {
            return modalAvatar.getAttribute('src');
        }

        return '';
    }

    function currentProfileAvatarV5() {
        // 1. Avatar actually rendered in Current account.
        const displayed = displayedAccountAvatarV5();
        if (displayed) return displayed;

        // 2. Custom avatar stored by V3.
        const custom = readCustomAvatarDirectV5();
        if (custom) return custom;

        // 3. Google profile photo.
        return googleAccountProfile?.picture || '';
    }

    function moveAccountButtonToHeaderV5() {
        injectProfileHeaderStylesV5();

        const btn = document.getElementById('btn-login-google');
        const heroMeta = document.querySelector('.hero-meta-v12');
        if (!btn || !heroMeta) return false;

        heroMeta.classList.add('profile-meta-v5');

        // Keep date first, avatar second.
        if (btn.parentElement !== heroMeta) {
            heroMeta.appendChild(btn);
        } else if (heroMeta.lastElementChild !== btn) {
            heroMeta.appendChild(btn);
        }

        btn.classList.remove('avatar-only-account-v4', 'account-connected-v2');
        btn.classList.add('profile-header-btn-v5');

        return true;
    }

    function renderProfessionalProfileV5() {
        if (!moveAccountButtonToHeaderV5()) return;

        const btn = document.getElementById('btn-login-google');
        if (!btn) return;

        const connected =
            typeof isGoogleConnected === 'function' &&
            isGoogleConnected();

        const avatar = connected ? currentProfileAvatarV5() : '';
        const label =
            googleAccountProfile?.name ||
            googleAccountProfile?.email ||
            'Account';

        btn.classList.toggle('profile-offline-v5', connected && !navigator.onLine);
        btn.classList.toggle('profile-disconnected-v5', !connected);

        btn.title = connected
            ? `${label}${googleAccountProfile?.email && googleAccountProfile.email !== label ? ` · ${googleAccountProfile.email}` : ''}`
            : 'Connect Google account';

        btn.setAttribute(
            'aria-label',
            connected ? `Current account: ${label}` : 'Connect Google account'
        );

        if (connected && avatar) {
            btn.innerHTML = `
                <img class="profile-avatar-v5" src="${escapeHTML(avatar)}" alt="">
                <span class="profile-status-v5" aria-hidden="true"></span>
            `;
            return;
        }

        if (connected) {
            const initial = String(label).trim().charAt(0).toUpperCase() || 'G';
            btn.innerHTML = `
                <span class="profile-fallback-v5">${escapeHTML(initial)}</span>
                <span class="profile-status-v5" aria-hidden="true"></span>
            `;
            return;
        }

        btn.innerHTML = `
            <span class="profile-fallback-v5">👤</span>
            <span class="profile-status-v5" aria-hidden="true"></span>
        `;
    }

    function installAvatarMirrorObserverV5() {
        const avatar = document.getElementById('accountAvatar');
        if (!avatar || avatar.__profileMirrorObserverV5) return;

        avatar.__profileMirrorObserverV5 = true;

        const observer = new MutationObserver(() => {
            // MutationObserver runs after V3 has already put the new avatar into Current account.
            // Therefore the header mirrors the exact same src instead of recomputing from Google.
            requestAnimationFrame(renderProfessionalProfileV5);
        });

        observer.observe(avatar, {
            attributes:true,
            attributeFilter:['src', 'style', 'class']
        });
    }

    function installAvatarStorageMirrorV5() {
        window.addEventListener('storage', event => {
            if (!event.key || !event.key.startsWith(CUSTOM_AVATAR_PREFIX)) return;
            requestAnimationFrame(renderProfessionalProfileV5);
        });
    }

    // Base account rendering can overwrite the button repeatedly.
    // V5 always gets the last render.
    const updateGoogleAccountUIV5 = updateGoogleAccountUI;
    updateGoogleAccountUI = function() {
        const result = updateGoogleAccountUIV5.apply(this, arguments);

        setTimeout(() => {
            installAvatarMirrorObserverV5();
            renderProfessionalProfileV5();
        }, 0);

        return result;
    };

    const openAccountPanelV5 = openAccountPanel;
    openAccountPanel = function() {
        const result = openAccountPanelV5.apply(this, arguments);

        setTimeout(() => {
            installAvatarMirrorObserverV5();
            renderProfessionalProfileV5();
        }, 0);

        return result;
    };

    // V3's avatar buttons call local helper functions directly, so wrapping the public helper
    // isn't enough. The observer above catches the actual <img src> mutation. As a second
    // guarantee, watch clicks in the account avatar action area and refresh shortly afterward.
    document.addEventListener('change', event => {
        if (event.target?.id === 'accountAvatarFileV3') {
            setTimeout(renderProfessionalProfileV5, 50);
            setTimeout(renderProfessionalProfileV5, 250);
            setTimeout(renderProfessionalProfileV5, 700);
        }
    });

    document.addEventListener('click', event => {
        const target = event.target?.closest?.(
            '#accountAvatarChangeV3, #accountAvatarEditBubbleV3, #accountAvatarResetV3'
        );

        if (!target) return;

        setTimeout(renderProfessionalProfileV5, 50);
        setTimeout(renderProfessionalProfileV5, 300);
    });

    window.addEventListener('online', () => {
        setTimeout(renderProfessionalProfileV5, 0);
    });

    window.addEventListener('offline', () => {
        setTimeout(renderProfessionalProfileV5, 0);
    });

    document.addEventListener('DOMContentLoaded', () => {
        injectProfileHeaderStylesV5();
        moveAccountButtonToHeaderV5();
        installAvatarMirrorObserverV5();
        renderProfessionalProfileV5();
    });

    window.addEventListener('load', () => {
        let attempts = 0;

        const timer = setInterval(() => {
            attempts++;
            moveAccountButtonToHeaderV5();
            installAvatarMirrorObserverV5();
            renderProfessionalProfileV5();

            if (
                (
                    typeof isGoogleConnected === 'function' &&
                    isGoogleConnected() &&
                    googleAccountProfile
                ) ||
                attempts >= 40
            ) {
                clearInterval(timer);
            }
        }, 250);
    });

    // Public helper for manual testing:
    // refreshHeaderProfileAvatar()
    window.refreshHeaderProfileAvatar = renderProfessionalProfileV5;
})();
// ============================================================================
// UI FIX V6
