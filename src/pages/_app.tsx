import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Kakao SDK 초기화
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      if (kakaoKey) {
        window.Kakao.init(kakaoKey);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>일정 맞춤 - 모두가 되는 날, 쉽게 찾기</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
