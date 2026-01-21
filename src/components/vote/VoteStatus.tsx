import React from 'react';
import { VoteStatus as VoteStatusType } from '@/types';

interface VoteStatusProps {
  currentStatus: VoteStatusType | null;
  onStatusChange: (status: VoteStatusType) => void;
}

const STATUS_OPTIONS: { status: VoteStatusType; label: string; icon: string; color: string }[] = [
  { status: 'AVAILABLE', label: '가능', icon: '✓', color: 'bg-green-500' },
  { status: 'MAYBE', label: '애매', icon: '△', color: 'bg-yellow-400' },
  { status: 'UNAVAILABLE', label: '불가', icon: '✕', color: 'bg-red-500' },
];

export function VoteStatusSelector({ currentStatus, onStatusChange }: VoteStatusProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-600 mb-3">투표 상태 선택</p>
      <div className="flex justify-center gap-4">
        {STATUS_OPTIONS.map(({ status, label, icon, color }) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={`
              flex flex-col items-center px-4 py-2 rounded-lg border-2 transition-all
              ${currentStatus === status
                ? `border-gray-900 ${color} text-white`
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-sm mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
