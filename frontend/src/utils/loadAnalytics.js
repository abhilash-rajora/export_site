export const loadGoogleAnalytics = (consent = { analytics: false }) => {
  if (typeof window === 'undefined') return;
  if (window.gtagLoaded) return;

  // 🔥 prevent duplicate script
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    window.gtagLoaded = true;
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-GCXWTH90ZT';
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;

  gtag('js', new Date());

  gtag('consent', 'default', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
  });

  gtag('config', 'G-GCXWTH90ZT');

  window.gtagLoaded = true;
};