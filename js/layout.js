/**
 * ================================================================
 * ALMOST WON — Shared Layout Injector
 * js/layout.js
 * Injects the header, sidebar, modals, and bottom tab bar
 * into every page. Call injectLayout(activePage) once per page.
 * ================================================================
 */

'use strict';

/**
 * Returns the HTML string for the shared top header.
 */
function getHeaderHTML() {
  return `
  <header class="top-header" role="banner">
    <div class="header-left">
      <button class="sidebar-toggle" id="sidebarToggle" data-i18n-aria="navHome" aria-label="Toggle sidebar navigation">
        <i class="bx bx-menu" aria-hidden="true"></i>
      </button>
      <a href="index.html" class="app-logo" aria-label="ALMOST WON — Home">
        <i class="bx bx-coin-stack logo-icon" aria-hidden="true"></i>
        <span class="logo-text" data-i18n="appName">Almost Won</span>
      </a>
    </div>
    <div class="header-center">
      <span class="edu-badge" role="status">
        <span class="pulse-dot" aria-hidden="true"></span>
        <span data-i18n="eduBadge">EDUCATIONAL ONLY</span>
      </span>
    </div>
    <div class="header-right">
      <div class="lang-switcher-header">
        <i class="bx bx-globe" aria-hidden="true"></i>
        <select class="lang-select" aria-label="Select language">
          <option value="en">EN</option>
          <option value="id">ID</option>
        </select>
      </div>
      <div class="header-balance" aria-live="polite" aria-label="Current virtual balance">
        <span class="balance-label" data-i18n="balanceLabel">Balance</span>
        <span class="balance-amount" id="headerBalance">$10,000</span>
      </div>
    </div>
  </header>`;
}

/**
 * Returns the HTML string for the shared sidebar navigation.
 * @param {string} activePage - page key: 'home','wallet','simulation','statistics','learn','withdraw','settings'
 */
function getSidebarHTML(activePage) {
  const pages = [
    { key: 'home',       href: 'index.html',      icon: 'bx-home-alt-2',   labelKey: 'navHome'     },
    { key: 'wallet',     href: 'wallet.html',      icon: 'bx-wallet-alt',   labelKey: 'navWallet'   },
    { key: 'simulation', href: 'simulation.html',  icon: 'bx-joystick',     labelKey: 'navSimulate' },
    { key: 'statistics', href: 'statistics.html',  icon: 'bx-bar-chart-alt-2', labelKey: 'navStats' },
    { key: 'learn',      href: 'learn.html',       icon: 'bx-book-open',    labelKey: 'navLearn'    },
    { key: 'withdraw',   href: 'withdraw.html',    icon: 'bx-money-withdraw', labelKey: 'navWithdraw' },
    { key: 'settings',   href: 'settings.html',    icon: 'bx-cog',          labelKey: 'navSettings' },
  ];

  const items = pages.map(p => `
    <li class="nav-item">
      <a href="${p.href}" class="nav-btn${activePage === p.key ? ' active' : ''}"
         data-i18n-aria="${p.labelKey}" aria-label="${p.labelKey}" aria-current="${activePage === p.key ? 'page' : 'false'}">
        <i class="bx ${p.icon} nav-icon" aria-hidden="true"></i>
        <span class="nav-label" data-i18n="${p.labelKey}">${p.labelKey}</span>
      </a>
    </li>`).join('');

  return `
  <aside class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
    <nav class="sidebar-nav">
      <ul class="nav-list" role="list">${items}</ul>
    </nav>
    <div class="sidebar-footer">
      <span class="version-label" data-i18n="version">v1.0.0-edu</span>
    </div>
  </aside>`;
}

/**
 * Returns the HTML string for the shared bottom tab bar (mobile).
 * @param {string} activePage
 */
function getTabBarHTML(activePage) {
  const tabs = [
    { key: 'home',       href: 'index.html',     icon: 'bx-home-alt-2',      labelKey: 'navHome'     },
    { key: 'wallet',     href: 'wallet.html',    icon: 'bx-wallet-alt',      labelKey: 'navWallet'   },
    { key: 'simulation', href: 'simulation.html', icon: 'bx-joystick',       labelKey: 'navSimulate' },
    { key: 'learn',      href: 'learn.html',     icon: 'bx-book-open',       labelKey: 'navLearn'    },
    { key: 'settings',   href: 'settings.html',  icon: 'bx-cog',             labelKey: 'navSettings' },
  ];

  const items = tabs.map(t => `
    <a href="${t.href}" class="tab-btn${activePage === t.key ? ' active' : ''}"
       aria-label="${t.labelKey}" aria-current="${activePage === t.key ? 'page' : 'false'}">
      <i class="bx ${t.icon} tab-icon" aria-hidden="true"></i>
      <span class="tab-label" data-i18n="${t.labelKey}">${t.labelKey}</span>
    </a>`).join('');

  return `<nav class="bottom-tab-bar" role="navigation" aria-label="Mobile navigation">${items}</nav>`;
}

/**
 * Returns the HTML for shared modals (confirm + toast container).
 * The game modal and withdraw modal are page-specific.
 */
function getSharedModalsHTML() {
  return `
  <!-- Confirmation Modal -->
  <div class="modal-overlay hidden" id="confirmModal" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
    <div class="modal-box modal-box-sm">
      <div class="modal-icon"><i class="bx bx-error-circle" aria-hidden="true"></i></div>
      <h2 class="modal-title" id="confirmModalTitle" data-i18n="confirmTitle">Are you sure?</h2>
      <p class="modal-body" id="confirmModalBody" data-i18n="confirmBody">This action cannot be undone.</p>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="confirmModalCancel" data-i18n="confirmCancel">Cancel</button>
        <button class="btn btn-danger" id="confirmModalConfirm" data-i18n="confirmConfirm">Confirm</button>
      </div>
    </div>
  </div>

  <!-- Toast Container -->
  <div class="toast-container" id="toastContainer" role="region" aria-label="Notifications" aria-live="polite"></div>`;
}

/**
 * Inject header, sidebar, modals and tab bar into the page.
 * Expects the following elements to already exist in the HTML:
 *   #headerMount, #sidebarMount, #tabBarMount, #modalsMount
 *
 * @param {string} activePage - the current page key
 */
function injectLayout(activePage) {
  const hm = document.getElementById('headerMount');
  const sm = document.getElementById('sidebarMount');
  const tm = document.getElementById('tabBarMount');
  const mm = document.getElementById('modalsMount');

  if (hm) hm.innerHTML = getHeaderHTML();
  if (sm) sm.innerHTML = getSidebarHTML(activePage);
  if (tm) tm.innerHTML = getTabBarHTML(activePage);
  if (mm) mm.innerHTML = getSharedModalsHTML();
}
