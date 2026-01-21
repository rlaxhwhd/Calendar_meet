// 날짜를 YYYY-MM-DD 형식으로 변환
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// YYYY-MM-DD 문자열을 Date 객체로 변환
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// 한국어 요일 반환
export function getDayName(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}

// 한국어 날짜 포맷 (1월 15일 (월))
export function formatKoreanDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = getDayName(date);
  return `${month}월 ${day}일 (${dayName})`;
}

// 두 날짜 사이의 일수 계산
export function getDaysBetween(start: Date, end: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((end.getTime() - start.getTime()) / oneDay));
}

// 날짜 범위 내의 모든 날짜 반환
export function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// 오늘 날짜인지 확인
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// 과거 날짜인지 확인
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}
