'use client'

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { EventDialog } from '@/components/calendar/EventDialog';
import { EventList } from '@/components/calendar/EventList';
import { generateCalendarDays, hasEventOverlap } from '@/lib/calendar';
import { exportToCSV, exportToJSON } from '@/lib/export';
import { Event, EventFormData } from '@/types/calendar';
import {
  add,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  sub,
} from 'date-fns';
import { useEffect, useState } from 'react';

function App() {
  const { theme, setTheme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEventListOpen, setIsEventListOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const calendarDays = generateCalendarDays(currentDate);

  const handlePreviousMonth = () => {
    setCurrentDate((date) => sub(date, { months: 1 }));
  };

  const handleNextMonth = () => {
    setCurrentDate((date) => add(date, { months: 1 }));
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    const eventDate = format(date, 'yyyy-MM-dd');
    const eventsForDay = events.filter(event => event.date === eventDate);
    
    if (eventsForDay.length === 0) {
      setIsEventDialogOpen(true);
    } else {
      setIsEventListOpen(true);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    toast({
      title: 'Event deleted',
      description: 'The event has been successfully deleted.',
    });
  };

  const handleSaveEvent = (data: EventFormData) => {
    const eventDate = format(selectedDate, 'yyyy-MM-dd');

    if (data.startTime >= data.endTime) {
      toast({
        title: 'Invalid time range',
        description: 'End time must be after start time.',
        variant: 'destructive',
      });
      return;
    }

    if (
      hasEventOverlap(
        data.startTime,
        data.endTime,
        eventDate,
        events,
        selectedEvent?.id
      )
    ) {
      toast({
        title: 'Time conflict',
        description: 'This time slot overlaps with an existing event.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedEvent) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                ...data,
              }
            : event
        )
      );
      toast({
        title: 'Event updated',
        description: 'The event has been successfully updated.',
      });
    } else {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        ...data,
        date: eventDate,
      };
      setEvents((prev) => [...prev, newEvent]);
      toast({
        title: 'Event created',
        description: 'The new event has been successfully created.',
      });
    }
  };

  const handleDrop = (date: Date, eventId: string) => {
    const newDate = format(date, 'yyyy-MM-dd');
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              date: newDate,
            }
          : event
      )
    );
    toast({
      title: 'Event moved',
      description: `Event moved to ${format(date, 'PP')}.`,
    });
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      exportToJSON(events, currentDate);
    } else {
      exportToCSV(events, currentDate);
    }
    toast({
      title: 'Export complete',
      description: `Calendar events exported as ${format.toUpperCase()}.`,
    });
  };

  const filteredEvents = events.filter((event) => {
    const term = searchTerm.toLowerCase();
    return (
      event.title.toLowerCase().includes(term) ||
      event.description?.toLowerCase().includes(term)
    );
  });

  // Precompute the boolean values for isCurrentMonth, isToday, isSelected
  const isCurrentMonthValue = (date: Date) => isSameMonth(date, currentDate);
  const isTodayValue = (date: Date) => isToday(date);
  const isSelectedValue = (date: Date) => isSameDay(date, selectedDate);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DndProvider backend={HTML5Backend}>
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6">
              <CalendarHeader
                currentDate={currentDate}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddEvent={handleAddEvent}
                onExport={handleExport}
              />

              <CalendarGrid
                days={calendarDays}
                dayProps={{
                  isCurrentMonth: isCurrentMonthValue(selectedDate),
                  isToday: isTodayValue(selectedDate),
                  isSelected: isSelectedValue(selectedDate),
                  events: filteredEvents,
                  onSelectDate: handleSelectDate,
                  onDrop: handleDrop,
                }}
              />
            </div>
          </div>

          <EventDialog
            isOpen={isEventDialogOpen}
            onClose={() => setIsEventDialogOpen(false)}
            onSave={handleSaveEvent}
            selectedDate={selectedDate}
            event={selectedEvent}
          />

          <EventList
            isOpen={isEventListOpen}
            onClose={() => setIsEventListOpen(false)}
            selectedDate={selectedDate}
            events={filteredEvents}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />

          <Toaster />
        </div>
      </DndProvider>
    </div>
  );
}

export default App;

