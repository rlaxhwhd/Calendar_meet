import React, { useState } from 'react';

interface LinkCopyButtonProps {
  roomId: string;
}

export function LinkCopyButton({ roomId }: LinkCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const url = `${baseUrl}/${roomId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // 폴백: 구형 브라우저 대응
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
    >
      {copied ? (
        <>
          <span>✓</span>
          복사됨
        </>
      ) : (
        <>
          <span>🔗</span>
          링크 복사
        </>
      )}
    </button>
  );
}
