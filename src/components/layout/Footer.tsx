import React from 'react';

export function Footer() {
  return (
    <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-100">
      <p>© {new Date().getFullYear()} 일정 맞춤</p>
    </footer>
  );
}
