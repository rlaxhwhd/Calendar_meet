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

  const isInRange = (date: Date) => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return dateOnly >= startOnly && dateOnly <= endOnly;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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
