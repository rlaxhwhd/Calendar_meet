import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MobileLayoutProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightElement?: React.ReactNode;
  showFooter?: boolean;
  children: React.ReactNode;
}

export function MobileLayout({
  title,
  showBack = false,
  backHref,
  rightElement,
  showFooter = false,
  children,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        title={title}
        showBack={showBack}
        backHref={backHref}
        rightElement={rightElement}
      />

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
