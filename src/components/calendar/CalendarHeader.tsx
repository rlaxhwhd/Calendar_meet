import React from 'react';

interface CalendarHeaderProps {
  monthYear: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarHeader({ monthYear, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        type="button"
        onClick={onPrevMonth}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="이전 달"
      >
        <span className="text-gray-600">◀</span>
      </button>

      <h2 className="text-lg font-semibold text-gray-900">{monthYear}</h2>

      <button
        type="button"
        onClick={onNextMonth}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="다음 달"
      >
        <span className="text-gray-600">▶</span>
      </button>
    </div>
  );
}
