import { useState, useMemo } from 'react';

export function useCalendar(startDate: Date, endDate: Date) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  });

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];

    // 첫 주의 빈 공간 (일요일 시작)
    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startDayOfWeek + i + 1);
      days.push(prevDate);
    }

    // 현재 월의 날짜들
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    // 마지막 주의 빈 공간
    const endDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - endDayOfWeek; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }, [currentMonth]);

  // 날짜 비교를 위한 헬퍼 (시간 제외)
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  };

  const isInRange = (date: Date) => {
    // 타임스탬프로 비교 (시간 00:00:00 설정된 Date 객체라고 가정하거나, 날짜만 비교)
    // 성능을 위해 간단한 타임스탬프 비교로 변경
    return date >= startDate && date <= endDate;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatMonthYear = () => {
    return `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;
  };

  return {
    currentMonth,
    daysInMonth,
    isInRange,
    isCurrentMonth,
    isToday,
    goToPreviousMonth,
    goToNextMonth,
    formatMonthYear,
  };
}
