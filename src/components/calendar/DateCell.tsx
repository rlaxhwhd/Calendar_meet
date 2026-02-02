import React from 'react';
import { CircularProgress } from './CircularProgress';
import { getVoteStatusColor } from '@/utils/color';
import { VoteStatus } from '@/types';

interface VoteSegments {
  available: number;
  maybe: number;
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

// 상태별 아이콘 매핑 (컴포넌트 외부로 이동)
const STATUS_ICONS: Record<VoteStatus, string> = {
  AVAILABLE: '✓',
  MAYBE: '?',
};

// 상태별 배경색 매핑 (ring 사용으로 흔들림 방지)
const STATUS_BACKGROUNDS: Record<VoteStatus, string> = {
  AVAILABLE: 'bg-green-100 ring-2 ring-green-400 ring-inset',
  MAYBE: 'bg-yellow-100 ring-2 ring-yellow-400 ring-inset',
};

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
  const statusColor = voteStatus ? getVoteStatusColor(voteStatus) : '#e5e7eb';
  const statusIcon = voteStatus ? STATUS_ICONS[voteStatus] : null;
  const backgroundColor = voteStatus ? STATUS_BACKGROUNDS[voteStatus] : '';

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
        ${backgroundColor}
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
            {statusIcon && (
              <span
                className="text-[10px] sm:text-xs font-bold leading-none"
                style={{ color: statusColor }}
              >
                {statusIcon}
              </span>
            )}
          </div>
        </CircularProgress>
      </div>
    </button>
  );
}
