import React from 'react';
import { DateSummary } from '@/types';
import { formatKoreanDate, parseDate } from '@/utils/date';

interface VoteSummaryProps {
  topDates: DateSummary[];
  totalParticipants: number;
}

export function VoteSummary({ topDates, totalParticipants }: VoteSummaryProps) {
  if (topDates.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <p className="text-center text-gray-500">아직 투표가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">🏆 BEST 날짜</h3>

      <div className="space-y-3">
        {topDates.map((item, index) => {
          const date = parseDate(item.date);
          const percentage = totalParticipants > 0
            ? Math.round((item.availableCount / totalParticipants) * 100)
            : 0;

          return (
            <div
              key={item.date}
              className="border border-gray-100 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {index === 0 && <span className="text-yellow-500">🥇</span>}
                  {index === 1 && <span className="text-gray-400">🥈</span>}
                  {index === 2 && <span className="text-amber-600">🥉</span>}
                  <span className="font-medium text-gray-900">
                    {formatKoreanDate(date)}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {item.availableCount}/{totalParticipants}명
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {item.participants.length > 0 && (
                <p className="text-xs text-gray-500 truncate">
                  {item.participants.slice(0, 4).join(', ')}
                  {item.participants.length > 4 && ` 외 ${item.participants.length - 4}명`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
