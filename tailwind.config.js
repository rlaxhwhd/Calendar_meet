/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - 브랜드 컬러
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        // 투표 상태 색상
        vote: {
          available: '#22c55e',
          maybe: '#facc15',
          unavailable: '#ef4444',
        },
        // 참가자 색상
        participant: {
          1: '#22c55e',
          2: '#3b82f6',
          3: '#f59e0b',
          4: '#ec4899',
          5: '#8b5cf6',
          6: '#14b8a6',
          7: '#f43f5e',
          8: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
