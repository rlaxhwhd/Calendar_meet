import React from 'react';
import { shareKakao } from '@/lib/kakao';

interface KakaoShareButtonProps {
  title: string;
  roomId: string;
}

export function KakaoShareButton({ title, roomId }: KakaoShareButtonProps) {
  const handleShare = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const url = `${baseUrl}/${roomId}`;

    shareKakao({
      title: `📅 ${title}`,
      description: '일정 투표에 참여해주세요!',
      url,
    });
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.477 3 2 6.463 2 10.729c0 2.725 1.837 5.125 4.594 6.48-.153.55-.986 3.535-1.022 3.77 0 0-.02.166.088.23.107.064.232.014.232.014.306-.043 3.553-2.313 4.118-2.71.649.098 1.32.149 2.003.149 5.514 0 9.987-3.463 9.987-7.733S17.514 3 12 3z" />
      </svg>
      카카오톡 공유
    </button>
  );
}
