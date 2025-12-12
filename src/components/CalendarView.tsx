import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { apiClient } from '@/lib/api';
import { format, isSameDay, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface CalendarViewProps {
  resourceId: string;
  onSlotSelect?: (slot: { date: Date; startTime: string; endTime: string }) => void;
  selectedDate?: Date;
}

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  resourceId,
  onSlotSelect,
  selectedDate,
}) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) {
      fetchBookings();
    }
  }, [date, resourceId]);

  const fetchBookings = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      const response = await apiClient.get(`/resources/${resourceId}/availability`, {
        params: {
          from: startOfMonth.toISOString(),
          to: endOfMonth.toISOString(),
        },
      });

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = parseISO(booking.startTime);
      return isSameDay(bookingDate, date) && booking.status !== 'cancelled';
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const isSlotBooked = (slot: string) => {
    if (!date) return false;
    const dayBookings = getBookingsForDate(date);
    return dayBookings.some((booking) => {
      const start = format(parseISO(booking.startTime), 'HH:mm');
      const end = format(parseISO(booking.endTime), 'HH:mm');
      return slot >= start && slot < end;
    });
  };

  const handleSlotClick = (slot: string) => {
    if (!date || isSlotBooked(slot)) return;

    const [hour, minute] = slot.split(':').map(Number);
    const endHour = minute === 30 ? hour + 1 : hour;
    const endMinute = minute === 30 ? 0 : 30;
    const endSlot = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    onSlotSelect?.({
      date,
      startTime: slot,
      endTime: endSlot,
    });
  };

  return (
    <div className="space-y-6">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="mx-auto"
      />

      {date && (
        <Card className="border-2">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">
              Available Slots for {format(date, 'PPP')}
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((slot) => {
                const booked = isSlotBooked(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => handleSlotClick(slot)}
                    disabled={booked}
                    className={`
                      p-2 text-sm border-2 transition-colors
                      ${booked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                        : 'hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer border-border'
                      }
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300" />
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-border hover:border-brand-primary" />
                <span>Available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

