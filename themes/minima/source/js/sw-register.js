/* Service Worker registration.

Opt-in at the browser level: only registers on localhost or https, silently
no-ops anywhere else. Never throws into the page.
*/
(() => {
  if (!('serviceWorker' in navigator)) return;

  // SW only runs on a secure context.
  if (!window.isSecureContext) return;

  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .catch(() => { /* private browsing, unsupported browser, offline - all fine */ });
})();
