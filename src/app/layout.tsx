"use client";
import "./globals.css";
import React, { useEffect, useState } from "react";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  // const [swReady, setSwReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 로드 시 한 번 실행

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // PWA Service Worker 등록
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const register = async () => {
        try {
          const reg = await navigator.serviceWorker.register('/service-worker.js');
          // 업데이트 있으면 즉시 적용
          if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            if (!installing) return;
            installing.addEventListener('statechange', () => {
              if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          });
        } catch (e) {
          console.warn('SW register failed', e);
        }
      };
      register();
    }
  }, []);
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <title>나라를 맞춰라!</title>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {!isMobile && (
          <>
            {/* 좌측 고정 광고 */}
            <div style={{
              position: 'fixed',
              left: 10,
              top: 30,
              height: '100vh',
              width: 160,
              display: 'flex',
              alignItems: 'flex-start',
              zIndex: 1000,
              pointerEvents: 'auto',
            }}>
              <ins className="kakao_ad_area"
                style={{ display: 'block', width: 160, height: 600 }}
                data-ad-unit="DAN-bfX7OroVvKW5PFfx"
                data-ad-width="160"
                data-ad-height="600"
              ></ins>
              <Script src="//t1.daumcdn.net/kas/static/ba.min.js" strategy="afterInteractive" />
            </div>
            {/* 우측 고정 광고 */}
            <div style={{
              position: 'fixed',
              right: 16,
              top: 30,
              height: '100vh',
              width: 160,
              display: 'flex',
              alignItems: 'flex-start',
              zIndex: 1000,
              pointerEvents: 'auto',
            }}>
              <ins className="kakao_ad_area"
                style={{ display: 'block', width: 160, height: 600 }}
                data-ad-unit="DAN-HT9NtJg0Tm0FYqXF"
                data-ad-width="160"
                data-ad-height="600"
              ></ins>
              <Script src="//t1.daumcdn.net/kas/static/ba.min.js" strategy="afterInteractive" />
            </div>
          </>
        )}
        {/* 메인 컨텐츠 */}
        {children}
      </body>
    </html>
  );
}