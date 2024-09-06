import { useState } from 'react';

const useCalendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // Janeiro é 0

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const getMonthName = () => {
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long' }).toUpperCase();
  };

  return { year, month, nextMonth, prevMonth, getMonthName };
};

export default useCalendar;
