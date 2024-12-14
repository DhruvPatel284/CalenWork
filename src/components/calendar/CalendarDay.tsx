import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { DayProps, Event } from '@/types/calendar';

const categoryColors = {
  work: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
  personal: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
  other: 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100',
};

export const CalendarDay: React.FC<DayProps> = ({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  onSelectDate,
  onDrop,
}) => {
  const dayEvents = events.filter(
    (event) => event.date === format(date, 'yyyy-MM-dd')
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'event',
    drop: (item: { id: string }) => onDrop(date, item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cn(
        'h-full p-2 transition-all duration-200',
        {
          'bg-gray-50/80 dark:bg-gray-900/50': isSelected,
          'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/30': !isSelected,
          'shadow-inner': isOver,
          'opacity-40': !isCurrentMonth,
        }
      )}
      onClick={() => onSelectDate(date)}
    >
      <div className="flex justify-between items-start">
        <span
          className={cn('inline-flex items-center justify-center text-sm font-medium w-7 h-7 rounded-full', {
            'text-gray-900 dark:text-gray-100': isCurrentMonth,
            'text-gray-400 dark:text-gray-500': !isCurrentMonth,
            'bg-black text-white dark:bg-white dark:text-black': isToday,
          })}
        >
          {format(date, 'd')}
        </span>
        {dayEvents.length > 0 && (
          <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
            <Calendar className="h-3 w-3" />
            <span className="text-[10px]">{dayEvents.length}</span>
          </div>
        )}
      </div>
      <div className="mt-2 space-y-1">
        {dayEvents.slice(0, 2).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {dayEvents.length > 2 && (
          <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
            +{dayEvents.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
};

function EventCard({ event }: { event: Event }) {
  return (
    <div
      className={cn(
        'text-xs p-1 rounded truncate',
        categoryColors[event.category]
      )}
    >
      {event.title}
    </div>
  );
}

