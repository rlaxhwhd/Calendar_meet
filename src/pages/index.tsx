import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// 원형 프로그레스 (도넛 차트) 컴포넌트
const CircularProgress = ({ percentage, size = 44, strokeWidth = 4 }: { percentage: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* 프로그레스 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        {/* 그라데이션 정의 */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      {/* 중앙 퍼센트 텍스트 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-gray-700">{percentage}%</span>
      </div>
    </div>
  );
};

// 장식용 미니 캘린더 컴포넌트
const DecorativeCalendar = ({
  month,
  year,
  style,
  opacity = 0.3,
  scale = 1,
  rotate = 0
}: {
  month: number;
  year: number;
  style: React.CSSProperties;
  opacity?: number;
  scale?: number;
  rotate?: number;
}) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dates: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    dates.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i);
  }

  const highlightedDates = [8, 15, 16, 22, 23, 24];

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        ...style,
        opacity,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-3 w-48">
        <div className="text-center mb-2">
          <span className="text-gray-700 font-semibold text-xs">
            {year}년 {month + 1}월
          </span>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {days.map((day, i) => (
            <div
              key={day}
              className={`text-center text-[8px] font-medium ${
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {dates.map((date, i) => (
            <div
              key={i}
              className={`
                aspect-square flex items-center justify-center text-[8px] rounded-full
                ${date ? 'text-gray-600' : ''}
                ${date && highlightedDates.includes(date)
                  ? 'bg-green-400 text-white font-medium'
                  : ''
                }
              `}
            >
              {date}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 플로팅 도형
const FloatingShape = ({ type, style, color, size = 40 }: { type: string; style: React.CSSProperties; color: string; size?: number }) => {
  if (type === 'circle') {
    return (
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ ...style, width: size, height: size, background: color }}
      />
    );
  }
  if (type === 'ring') {
    return (
      <div
        className="absolute rounded-full pointer-events-none border-4"
        style={{ ...style, width: size, height: size, borderColor: color }}
      />
    );
  }
  return null;
};

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // 참가자 데이터
  const participants = [
    { name: '김', color: 'bg-green-400' },
    { name: '최', color: 'bg-blue-400' },
    { name: '박', color: 'bg-purple-400' },
  ];

  const handleCodeJoin = () => {
    const code = prompt('방 코드를 입력하세요');
    if (code) {
      router.push(`/${code}`);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100 relative overflow-hidden">

      {/* 배경 장식 레이어 */}
      <div className="absolute inset-0 overflow-hidden">

        <DecorativeCalendar
          month={currentMonth}
          year={currentYear}
          opacity={0.2}
          scale={1.2}
          rotate={12}
          style={{ top: '-10px', right: '-20px' }}
        />

        <DecorativeCalendar
          month={(currentMonth + 1) % 12}
          year={currentYear}
          opacity={0.15}
          scale={1}
          rotate={-8}
          style={{ bottom: '40px', left: '-30px' }}
        />

        <DecorativeCalendar
          month={(currentMonth + 2) % 12}
          year={currentYear}
          opacity={0.1}
          scale={0.8}
          rotate={5}
          style={{ top: '45%', right: '-50px' }}
        />

        <FloatingShape
          type="circle"
          color="rgba(34, 197, 94, 0.15)"
          size={100}
          style={{ top: '12%', left: '5%' }}
        />
        <FloatingShape
          type="ring"
          color="rgba(34, 197, 94, 0.12)"
          size={60}
          style={{ top: '20%', right: '20%' }}
        />
        <FloatingShape
          type="circle"
          color="rgba(59, 130, 246, 0.08)"
          size={50}
          style={{ bottom: '30%', left: '8%' }}
        />
        <FloatingShape
          type="ring"
          color="rgba(251, 191, 36, 0.15)"
          size={80}
          style={{ bottom: '15%', right: '5%' }}
        />
        <FloatingShape
          type="circle"
          color="rgba(167, 139, 250, 0.12)"
          size={35}
          style={{ top: '55%', left: '15%' }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,255,255,0.5) 100%)'
          }}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">

        {/* 로고 & 타이틀 */}
        <div
          className={`text-center mb-8 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-5">
            <span className="text-3xl">📅</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-1.5">
            일정 맞춤
          </h1>

          <p className="text-gray-500">
            모두가 되는 날, 쉽게 찾기
          </p>
        </div>

        {/* 기능 미리보기 카드 */}
        <div
          className={`w-full max-w-xs mb-6 transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
            <div className="flex items-center justify-between">
              {/* 왼쪽: 참가자 아바타 + 텍스트 */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {participants.map((p, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center text-white text-xs font-medium border-2 border-white`}
                    >
                      {p.name}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-[10px] font-medium border-2 border-white">
                    +5
                  </div>
                </div>
                <span className="text-sm text-gray-600">8명이 투표 중</span>
              </div>

              {/* 오른쪽: 원형 프로그레스 */}
              <CircularProgress percentage={mounted ? 75 : 0} size={48} strokeWidth={5} />
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div
          className={`w-full max-w-xs space-y-2.5 transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/create"
            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            새 일정 만들기
          </Link>

          <button
            onClick={handleCodeJoin}
            className="w-full py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            코드로 참여하기
          </button>
        </div>

        {/* 하단 특징 */}
        <div
          className={`mt-8 flex items-center gap-4 text-xs text-gray-400 transition-all duration-700 delay-500 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>가입 없이</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>링크 공유</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>무료</span>
          </div>
        </div>
      </div>
    </div>
  );
}
