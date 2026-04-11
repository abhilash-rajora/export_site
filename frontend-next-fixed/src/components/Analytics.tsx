"use client";

import Script from "next/script";

export default function Analytics({ consent }: { consent: { analytics: boolean } }) {
  if (!consent.analytics) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-GCXWTH90ZT"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          gtag('consent', 'default', {
            analytics_storage: 'granted'
            });

          gtag('js', new Date());
          gtag('config', 'G-GCXWTH90ZT');
        `}
      </Script>
    </>
  );
}