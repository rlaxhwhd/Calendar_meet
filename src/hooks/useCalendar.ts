import { useState, useMemo, useCallback } from 'react';

// 날짜를 타임스탬프로 변환 (시간 제외)
const getDateTimestamp = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

// 오늘 날짜 캐싱
const getTodayTimestamp = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
};

export function useCalendar(startDate: Date, endDate: Date) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  });

  // 시작/종료 날짜 타임스탬프 캐싱
  const startTimestamp = useMemo(() => getDateTimestamp(startDate), [startDate]);
  const endTimestamp = useMemo(() => getDateTimestamp(endDate), [endDate]);
  const todayTimestamp = useMemo(() => getTodayTimestamp(), []);

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

  const isInRange = useCallback((date: Date) => {
    const dateTimestamp = getDateTimestamp(date);
    return dateTimestamp >= startTimestamp && dateTimestamp <= endTimestamp;
  }, [startTimestamp, endTimestamp]);

  const isCurrentMonth = useCallback((date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  }, [currentMonth]);

  const isToday = useCallback((date: Date) => {
    return getDateTimestamp(date) === todayTimestamp;
  }, [todayTimestamp]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const formatMonthYear = useCallback(() => {
    return `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;
  }, [currentMonth]);

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
