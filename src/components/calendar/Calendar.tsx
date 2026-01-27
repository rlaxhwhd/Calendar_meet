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
  allDates?: Record<string, { available: number; maybe: number }>;
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

  const getVoteSegments = (date: Date) => {
    const dateStr = formatDate(date);
    const counts = allDates[dateStr];
    if (!counts) return { available: 0, maybe: 0 };
    return counts;
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
              key={dateStr}
              date={date}
              isInRange={isInRange(date)}
              isToday={isToday(date)}
              isCurrentMonth={isCurrentMonth(date)}
              voteStatus={mySelections[dateStr] || null}
              voteSegments={getVoteSegments(date)}
              totalParticipants={totalParticipants}
              onClick={() => onDateClick(date)}
              disabled={disabled}
            />
          );
        })}
      </CalendarGrid>
    </div>
  );
}
