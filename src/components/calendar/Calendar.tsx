import React from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { DateCell } from './DateCell';
import { VoteStatus } from '@/types';
import { formatDate } from '@/utils/date';

interface CalendarProps {
  startDate: Date;
  endDate: Date;
  mySelections: Record<string, VoteStatus>;
  allDates?: Record<string, { available: number; maybe: number; unavailable: number }>;
  totalParticipants?: number;
  onDateClick: (date: Date) => void;
  disabled?: boolean;
}

export function Calendar({
  startDate,
  endDate,
  mySelections,
  allDates = {},
  totalParticipants = 0,
  onDateClick,
  disabled = false,
}: CalendarProps) {
  const {
    daysInMonth,
    isInRange,
    isCurrentMonth,
    isToday,
    goToPreviousMonth,
    goToNextMonth,
    formatMonthYear,
  } = useCalendar(startDate, endDate);

  const getVotePercentage = (date: Date): number => {
    if (totalParticipants === 0) return 0;
    const dateStr = formatDate(date);
    const counts = allDates[dateStr];
    if (!counts) return 0;
    // available은 100%, maybe는 50%로 계산
    return ((counts.available + counts.maybe * 0.5) / totalParticipants) * 100;
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <CalendarHeader
        monthYear={formatMonthYear()}
        onPrevMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
      />

      <CalendarGrid>
        {daysInMonth.map((date, index) => {
          const dateStr = formatDate(date);
          return (
            <DateCell
              key={index}
              date={date}
              isInRange={isInRange(date)}
              isToday={isToday(date)}
              isCurrentMonth={isCurrentMonth(date)}
              voteStatus={mySelections[dateStr] || null}
              votePercentage={getVotePercentage(date)}
              onClick={() => onDateClick(date)}
              disabled={disabled}
            />
          );
        })}
      </CalendarGrid>
    </div>
  );
}
