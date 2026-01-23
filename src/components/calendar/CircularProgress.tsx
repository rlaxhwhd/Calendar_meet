import React from 'react';

interface VoteSegments {
  available: number;
  maybe: number;
  unavailable: number;
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
  unavailable: '#ef4444', // 빨강
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

  // 다중 세그먼트 모드 (투표 비율별 색상)
  if (segments && totalParticipants > 0) {
    const total = segments.available + segments.maybe + segments.unavailable;
    if (total === 0) {
      // 투표가 없으면 빈 원
      return (
        <div
          className={`relative inline-flex items-center justify-center ${className}`}
          style={className ? undefined : { width: size, height: size }}
        >
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full transform -rotate-90"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {children}
          </div>
        </div>
      );
    }

    // 각 세그먼트의 비율 계산
    const availableRatio = segments.available / totalParticipants;
    const maybeRatio = segments.maybe / totalParticipants;

    // 세그먼트별 호의 길이
    const availableLength = circumference * availableRatio;
    const maybeLength = circumference * maybeRatio;

    // 시작 위치 (offset)
    const availableOffset = 0;
    const maybeOffset = availableLength;

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
              strokeDashoffset={-availableOffset}
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
              strokeDashoffset={-maybeOffset}
              className="transition-all duration-300 ease-out"
            />
          )}
        </svg>
        {/* 중앙 컨텐츠 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  }

  // 단일 퍼센트 모드 (기존 방식)
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
      {/* 중앙 컨텐츠 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
