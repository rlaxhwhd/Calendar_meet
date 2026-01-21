// 참가자 색상 배열
const PARTICIPANT_COLORS = [
  '#22c55e', // 초록
  '#3b82f6', // 파랑
  '#f59e0b', // 주황
  '#ec4899', // 분홍
  '#8b5cf6', // 보라
  '#14b8a6', // 청록
  '#f43f5e', // 빨강
  '#6366f1', // 인디고
];

// 참가자 인덱스에 따른 색상 반환
export function getParticipantColor(index: number): string {
  return PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length];
}

// 문자열 해시를 기반으로 색상 반환 (닉네임 기반)
export function getColorByName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PARTICIPANT_COLORS.length;
  return PARTICIPANT_COLORS[index];
}

// 투표 상태에 따른 색상 반환
export function getVoteStatusColor(status: 'AVAILABLE' | 'MAYBE' | 'UNAVAILABLE'): string {
  switch (status) {
    case 'AVAILABLE':
      return '#22c55e';
    case 'MAYBE':
      return '#facc15';
    case 'UNAVAILABLE':
      return '#ef4444';
    default:
      return '#9ca3af';
  }
}

// 퍼센트에 따른 색상 반환 (그라데이션)
export function getPercentageColor(percentage: number): string {
  if (percentage >= 80) return '#22c55e';
  if (percentage >= 60) return '#84cc16';
  if (percentage >= 40) return '#facc15';
  if (percentage >= 20) return '#fb923c';
  return '#ef4444';
}
