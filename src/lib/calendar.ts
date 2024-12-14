import { Event } from '@/types/calendar';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from 'date-fns';

export function generateCalendarDays(date: Date): Date[] {
  const startOfTheSelectedMonth = startOfMonth(date);
  const endOfTheSelectedMonth = endOfMonth(date);
  const startDate = startOfWeek(startOfTheSelectedMonth);
  const endDate = endOfWeek(endOfTheSelectedMonth);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.filter(day => {
    if (isSameMonth(day, date)) return true;
    if (day < startOfTheSelectedMonth) return true;
    // Only show days from next month if they're needed to complete the week
    const dayOfWeek = day.getDay();
    if (day > endOfTheSelectedMonth && dayOfWeek !== 0) return true;
    return false;
  });
}

export function hasEventOverlap(
  startTime: string,
  endTime: string,
  date: string,
  events: Event[],
  excludeEventId?: string
): boolean {
  const eventsOnDay = events.filter(
    (event) => event.date === date && event.id !== excludeEventId
  );

  return eventsOnDay.some((event) => (
    (startTime >= event.startTime && startTime < event.endTime) ||
    (endTime > event.startTime && endTime <= event.endTime) ||
    (startTime <= event.startTime && endTime >= event.endTime)
  ));
}

