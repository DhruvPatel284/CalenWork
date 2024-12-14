import { DayProps } from '@/types/calendar'
import { CalendarDay } from './CalendarDay'
import { cn } from '@/lib/utils'
import { isToday } from 'date-fns'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarGridProps {
  days: Date[]
  dayProps: Omit<DayProps, 'date'>
}

export function CalendarGrid({ days, dayProps }: CalendarGridProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900/50">
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-3 py-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x divide-y divide-gray-200 dark:divide-gray-800">
        {days.map((date) => (
          <div
            key={date.toISOString()}
            className={cn(
              "min-h-[120px] transition-colors",
              isToday(date) && "bg-blue-50/50 dark:bg-blue-950/20"
            )}
          >
            <CalendarDay
              key={date.toISOString()}
              date={date}
              {...dayProps}
              isToday={isToday(date)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

