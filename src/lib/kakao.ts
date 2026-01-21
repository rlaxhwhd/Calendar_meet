declare global {
  interface Window {
    Kakao: any;
  }
}

interface ShareOptions {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

export function shareKakao({ title, description, url, imageUrl }: ShareOptions) {
  if (typeof window === 'undefined' || !window.Kakao) {
    console.error('Kakao SDK가 로드되지 않았습니다.');
    return;
  }

  if (!window.Kakao.isInitialized()) {
    console.error('Kakao SDK가 초기화되지 않았습니다.');
    return;
  }

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description,
      imageUrl: imageUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: '투표하러 가기',
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  });
}
