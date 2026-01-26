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

// 공통 래퍼 컴포넌트
interface WrapperProps {
  size: number;
  className: string;
  children: React.ReactNode;
  centerContent?: React.ReactNode;
}

function CircularWrapper({ size, className, children, centerContent }: WrapperProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={className ? undefined : { width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full transform -rotate-90"
      >
        {children}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {centerContent}
      </div>
    </div>
  );
}

// 배경 원 컴포넌트
interface BackgroundCircleProps {
  size: number;
  radius: number;
  strokeWidth: number;
  backgroundColor: string;
}

function BackgroundCircle({ size, radius, strokeWidth, backgroundColor }: BackgroundCircleProps) {
  return (
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke={backgroundColor}
      strokeWidth={strokeWidth}
    />
  );
}

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
    const total = segments.available + segments.maybe;

    if (total === 0) {
      return (
        <CircularWrapper size={size} className={className} centerContent={children}>
          <BackgroundCircle
            size={size}
            radius={radius}
            strokeWidth={strokeWidth}
            backgroundColor={backgroundColor}
          />
        </CircularWrapper>
      );
    }

    const availableRatio = segments.available / totalParticipants;
    const maybeRatio = segments.maybe / totalParticipants;
    const availableLength = circumference * availableRatio;
    const maybeLength = circumference * maybeRatio;

    return (
      <CircularWrapper size={size} className={className} centerContent={children}>
        <BackgroundCircle
          size={size}
          radius={radius}
          strokeWidth={strokeWidth}
          backgroundColor={backgroundColor}
        />
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
      </CircularWrapper>
    );
  }

  // 단일 퍼센트 모드
  const offset = circumference - ((percentage || 0) / 100) * circumference;

  return (
    <CircularWrapper size={size} className={className} centerContent={children}>
      <BackgroundCircle
        size={size}
        radius={radius}
        strokeWidth={strokeWidth}
        backgroundColor={backgroundColor}
      />
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
    </CircularWrapper>
  );
}
