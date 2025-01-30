import { useCallback } from 'react';

export function useDateOperations() {
    const addDays = useCallback((date, days) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate.toISOString().split('T')[0];
    }, []);
  return { addDays };
}
