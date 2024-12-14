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
    <div className="rounded-lg border bg-background shadow-sm">
      <div className="grid grid-cols-7 border-b">
        {WEEKDAYS.map((day) => (
          <div key={day} className="p-3 text-center">
            <span className="text-xs font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x divide-y">
        {days.map((date) => (
          <div
            key={date.toISOString()}
            className={cn(
              "min-h-[120px] p-2 transition-colors hover:bg-muted/50",
              isToday(date) && "bg-accent/50"
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

