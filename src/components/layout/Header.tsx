import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightElement?: React.ReactNode;
}

export function Header({
  title = '일정 맞춤',
  showBack = false,
  backHref = '/',
  rightElement,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <Link href={backHref} className="text-gray-600 mr-3">
              ←
            </Link>
          )}
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>

        {rightElement && (
          <div className="flex items-center gap-2">
            {rightElement}
          </div>
        )}
      </div>
    </header>
  );
}
