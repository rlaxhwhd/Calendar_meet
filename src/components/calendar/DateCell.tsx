import React from 'react';
import { CircularProgress } from './CircularProgress';
import { getVoteStatusColor } from '@/utils/color';
import { VoteStatus } from '@/types';

interface VoteSegments {
  available: number;
  maybe: number;
  unavailable: number;
}

interface DateCellProps {
  date: Date;
  isInRange: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  voteStatus: VoteStatus | null;
  voteSegments: VoteSegments;
  totalParticipants: number;
  onClick: () => void;
  disabled?: boolean;
}

export function DateCell({
  date,
  isInRange,
  isToday,
  isCurrentMonth,
  voteStatus,
  voteSegments,
  totalParticipants,
  onClick,
  disabled = false,
}: DateCellProps) {
  const day = date.getDate();

  const isClickable = isInRange && !disabled;

  const getStatusColor = () => {
    if (!voteStatus) return '#e5e7eb';
    return getVoteStatusColor(voteStatus);
  };

  const getStatusIcon = () => {
    if (!voteStatus) return null;
    switch (voteStatus) {
      case 'AVAILABLE':
        return '✓';
      case 'MAYBE':
        return '?';
      case 'UNAVAILABLE':
        return '✕';
    }
  };

  // 선택 상태에 따른 배경색
  const getBackgroundColor = () => {
    if (!voteStatus) return '';
    switch (voteStatus) {
      case 'AVAILABLE':
        return 'bg-green-100 border-2 border-green-400';
      case 'MAYBE':
        return 'bg-yellow-100 border-2 border-yellow-400';
      case 'UNAVAILABLE':
        return 'bg-red-100 border-2 border-red-400';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`
        relative flex items-center justify-center p-0.5 sm:p-1 rounded-lg transition-all
        ${isClickable ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100' : 'cursor-default'}
        ${!isCurrentMonth ? 'opacity-30' : ''}
        ${!isInRange ? 'opacity-30' : ''}
        ${voteStatus ? getBackgroundColor() : ''}
      `}
    >
      {/* 모바일: 36px, sm: 40px, md: 48px */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12">
        <CircularProgress
          segments={voteSegments}
          totalParticipants={totalParticipants}
          size={48}
          strokeWidth={3}
          backgroundColor={isInRange ? '#e5e7eb' : '#f3f4f6'}
          className="w-full h-full"
        >
          <div className="flex flex-col items-center">
            <span
              className={`
                text-xs sm:text-sm font-medium
                ${isToday ? 'text-primary-500' : 'text-gray-700'}
                ${!isInRange ? 'text-gray-400' : ''}
                ${voteStatus ? 'font-bold' : ''}
              `}
            >
              {day}
            </span>
            {voteStatus && (
              <span
                className="text-[10px] sm:text-xs font-bold leading-none"
                style={{ color: getStatusColor() }}
              >
                {getStatusIcon()}
              </span>
            )}
          </div>
        </CircularProgress>
      </div>
    </button>
  );
}
