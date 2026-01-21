import React from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface CalendarGridProps {
  children: React.ReactNode;
}

export function CalendarGrid({ children }: CalendarGridProps) {
  return (
    <div>
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`
              text-center text-sm font-medium py-2
              ${index === 0 ? 'text-red-500' : ''}
              ${index === 6 ? 'text-blue-500' : ''}
              ${index > 0 && index < 6 ? 'text-gray-600' : ''}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {children}
      </div>
    </div>
  );
}
