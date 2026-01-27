import React from 'react';

interface VoteSegments {
  available: number;
  maybe: number;
}

interface CircularProgressProps {
  percentage?: number;
  segments?: VoteSegments;
  totalParticipants?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  className?: string;
}

// 투표 상태별 색상
const COLORS = {
  available: '#22c55e',  // 초록
  maybe: '#facc15',      // 노랑
};

export function CircularProgress({
  percentage,
  segments,
  totalParticipants = 0,
  size = 48,
  strokeWidth = 4,
  color = '#22c55e',
  backgroundColor = '#e5e7eb',
  children,
  className = '',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // 공통 SVG 래퍼
  const ProgressWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={className ? undefined : { width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full transform -rotate-90"
      >
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {children}
      </svg>
      {/* 중앙 컨텐츠 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );

  // 다중 세그먼트 모드 (투표 비율별 색상)
  if (segments && totalParticipants > 0) {
    const total = segments.available + segments.maybe;

    // 투표가 없으면 배경만 표시
    if (total === 0) {
      return <ProgressWrapper>{children}</ProgressWrapper>;
    }

    // 각 세그먼트의 비율 계산
    const availableRatio = segments.available / totalParticipants;
    const maybeRatio = segments.maybe / totalParticipants;

    const circumference = radius * 2 * Math.PI;
    const availableLength = circumference * availableRatio;
    const maybeLength = circumference * maybeRatio;

    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={className ? undefined : { width: size, height: size }}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full transform -rotate-90"
        >
          {/* 배경 원 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />
          {/* 가능 (초록) */}
          {segments.available > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={COLORS.available}
              strokeWidth={strokeWidth}
              strokeDasharray={`${availableLength} ${circumference - availableLength}`}
              strokeDashoffset={0}
              className="transition-all duration-300 ease-out"
            />
          )}
          {/* 애매 (노랑) */}
          {segments.maybe > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={COLORS.maybe}
              strokeWidth={strokeWidth}
              strokeDasharray={`${maybeLength} ${circumference - maybeLength}`}
              strokeDashoffset={-availableLength}
              className="transition-all duration-300 ease-out"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  }

  // 단일 퍼센트 모드
  const offset = circumference - ((percentage || 0) / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={className ? undefined : { width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full transform -rotate-90"
      >
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* 프로그레스 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
