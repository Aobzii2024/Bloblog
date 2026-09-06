(() => {
  const config = window.__minimaTheme || {};
  const selectors = config.selectors || {};
  const events = config.events || {};

  const isRemoteImage = (image) => {
    try {
      return new URL(image.currentSrc || image.src, window.location.href).origin !== window.location.origin;
    } catch (error) {
      return false;
    }
  };

  const isNearInitialViewport = (image, index) => {
    if (index < 3) {
      return true;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const rect = image.getBoundingClientRect();
    return rect.top < viewportHeight * 1.6;
  };

  const optimizeImages = () => {
    const images = Array.from(document.querySelectorAll(selectors.image || 'img'));

    images.forEach((image, index) => {
      const shouldLoadEarly = isNearInitialViewport(image, index);

      image.decoding = 'async';

      if (isRemoteImage(image) && !image.hasAttribute('referrerpolicy')) {
        image.referrerPolicy = 'no-referrer';
      }

      if (shouldLoadEarly) {
        image.loading = 'eager';
        image.fetchPriority = index === 0 ? 'high' : 'auto';
        return;
      }

      if (!image.hasAttribute('loading')) {
        image.loading = 'lazy';
      }

      if (!image.hasAttribute('fetchpriority')) {
        image.fetchPriority = 'low';
      }
    });
  };

  const initMediaEnhancements = () => {
    optimizeImages();
  };

  document.addEventListener('DOMContentLoaded', initMediaEnhancements);
  document.addEventListener(events.pageReady || 'op:page-ready', initMediaEnhancements);
})();
