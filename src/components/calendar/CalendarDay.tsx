import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { DayProps, Event } from '@/types/calendar';

const categoryColors = {
  work: 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
  personal: 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200',
  other: 'bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
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
        'h-24 sm:h-28 md:h-32 p-2 transition-all duration-200 border-t dark:border-gray-700',
        {
          'bg-blue-50 dark:bg-blue-900/20': isSelected,
          'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50': !isSelected,
          'shadow-inner': isOver,
          'opacity-50': !isCurrentMonth,
        }
      )}
      onClick={() => onSelectDate(date)}
    >
      <div className="flex justify-between items-start">
        <span
          className={cn('text-sm font-medium', {
            'text-gray-900 dark:text-gray-100': isCurrentMonth,
            'text-gray-400 dark:text-gray-500': !isCurrentMonth,
            'bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-full w-6 h-6 flex items-center justify-center': isToday,
          })}
        >
          {format(date, 'd')}
        </span>
        {dayEvents.length > 0 && (
          <div className="flex items-center gap-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
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

