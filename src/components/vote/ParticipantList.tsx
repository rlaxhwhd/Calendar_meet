import React, { useState } from 'react';
import { Vote, VoteStatus } from '@/types';
import { getColorByName } from '@/utils/color';
import { parseDate, formatKoreanDate } from '@/utils/date';

interface ParticipantListProps {
  votes: Vote[];
  hostNickname: string;
  showDetail?: boolean;
}

export function ParticipantList({ votes, hostNickname, showDetail = false }: ParticipantListProps) {
  const [isExpanded, setIsExpanded] = useState(showDetail);

  const getSelectionsByStatus = (selections: Record<string, VoteStatus>) => {
    const available: string[] = [];
    const maybe: string[] = [];

    Object.entries(selections).forEach(([date, status]) => {
      if (status === 'AVAILABLE') available.push(date);
      else if (status === 'MAYBE') maybe.push(date);
    });

    return {
      available: available.sort(),
      maybe: maybe.sort(),
    };
  };

  const formatDateList = (dates: string[]) => {
    return dates.map((d) => {
      const date = parseDate(d);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }).join(', ');
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3"
      >
        <h3 className="text-sm font-medium text-gray-700">
          참가자 ({votes.length}명)
        </h3>
        <span className="text-gray-400 text-sm">
          {isExpanded ? '접기' : '펼치기'}
        </span>
      </button>

      {!isExpanded ? (
        <div className="flex flex-wrap gap-2">
          {votes.map((vote) => (
            <div
              key={vote.nickname}
              className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-full"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getColorByName(vote.nickname) }}
              />
              <span className="text-sm text-gray-700">
                {vote.nickname}
                {vote.nickname === hostNickname && (
                  <span className="text-xs text-gray-400 ml-1">(방장)</span>
                )}
                {vote.isMe && (
                  <span className="text-xs text-primary-500 ml-1">(나)</span>
                )}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {votes.map((vote) => {
            const { available, maybe } = getSelectionsByStatus(vote.selections);
            return (
              <div
                key={vote.nickname}
                className="border border-gray-100 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getColorByName(vote.nickname) }}
                  />
                  <span className="font-medium text-gray-900">
                    {vote.nickname}
                  </span>
                  {vote.nickname === hostNickname && (
                    <span className="text-xs text-gray-400">(방장)</span>
                  )}
                  {vote.isMe && (
                    <span className="text-xs text-primary-500">(나)</span>
                  )}
                </div>

                {available.length > 0 && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="text-green-600 font-medium">가능:</span>{' '}
                    {formatDateList(available)}
                  </p>
                )}

                {maybe.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <span className="text-yellow-600 font-medium">애매:</span>{' '}
                    {formatDateList(maybe)}
                  </p>
                )}

                {available.length === 0 && maybe.length === 0 && (
                  <p className="text-sm text-gray-400">선택한 날짜 없음</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
