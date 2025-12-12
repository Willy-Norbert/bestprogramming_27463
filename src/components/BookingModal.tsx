import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api';
import { useNotification } from '@/hooks/use-notification';
import { FormField } from '@/components/FormField';
import { FormFieldTextarea } from '@/components/FormFieldTextarea';
import { Resource } from './ResourceCard';
import { format } from 'date-fns';
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface BookingModalProps {
  resourceId: string;
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date;
  initialStartTime?: string;
  initialEndTime?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  resourceId,
  resource,
  isOpen,
  onClose,
  onSuccess,
  initialDate,
  initialStartTime,
  initialEndTime,
}) => {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [startTime, setStartTime] = useState(initialStartTime || '09:00');
  const [endTime, setEndTime] = useState(initialEndTime || '10:00');
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { showError, showSuccess, NotificationComponent } = useNotification();
  
  // Validation errors
  const [errors, setErrors] = useState<{
    date?: string;
    startTime?: string;
    endTime?: string;
    attendeesCount?: string;
  }>({});

  useEffect(() => {
    if (date && isOpen) {
      fetchAvailability();
    }
  }, [date, isOpen]);

  const fetchAvailability = async () => {
    if (!date) return;

    try {
      const from = new Date(date);
      from.setHours(0, 0, 0, 0);
      const to = new Date(date);
      to.setHours(23, 59, 59, 999);

      const response = await apiClient.get(`/resources/${resourceId}/availability`, {
        params: {
          from: from.toISOString(),
          to: to.toISOString(),
        },
      });

      setAvailableSlots(response.data.availableSlots || []);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const validateDate = (value: Date | undefined): string | null => {
    if (!value) {
      return 'Please select a date';
    }
    if (value < new Date()) {
      return 'Cannot book in the past';
    }
    return null;
  };

  const validateTime = (value: string, field: 'startTime' | 'endTime'): string | null => {
    if (!value) {
      return `Please select ${field === 'startTime' ? 'start' : 'end'} time`;
    }
    return null;
  };

  const validateAttendees = (value: number): string | null => {
    if (value < 1) {
      return 'Attendees count must be at least 1';
    }
    if (value > resource.capacity) {
      return `Attendees cannot exceed capacity of ${resource.capacity}`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const dateError = validateDate(date);
    const startTimeError = validateTime(startTime, 'startTime');
    const endTimeError = validateTime(endTime, 'endTime');
    const attendeesError = validateAttendees(attendeesCount);

    const newErrors = {
      date: dateError || undefined,
      startTime: startTimeError || undefined,
      endTime: endTimeError || undefined,
      attendeesCount: attendeesError || undefined,
    };

    setErrors(newErrors);

    // Check time logic
    if (date && startTime && endTime) {
      const startDateTime = new Date(date);
      const [startHour, startMinute] = startTime.split(':').map(Number);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(date);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      if (endDateTime <= startDateTime) {
        setErrors({ ...newErrors, endTime: 'End time must be after start time' });
        return;
      }
    }

    // If there are validation errors, don't submit
    if (dateError || startTimeError || endTimeError || attendeesError) {
      return;
    }

    const startDateTime = new Date(date!);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(date!);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    setLoading(true);

    try {
      await apiClient.post('/bookings', {
        resourceId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        attendeesCount,
        notes: notes.trim() || undefined,
      });

      showSuccess(
        'Booking Created!',
        'Your booking has been created successfully.',
        {
          primary: {
            label: 'OK',
            onClick: () => {
              onSuccess();
              onClose();
            },
          },
        }
      );
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else if (error.response?.status === 409) {
        showError('Booking Conflict', error.response.data.message || 'This time slot is already booked. Please choose a different time.');
      } else {
        showError('Booking Failed', error.response?.data?.message || 'Failed to create booking. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {resource.name}</DialogTitle>
          <DialogDescription>
            Select date and time for your booking
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                    errors.date && 'border-destructive'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    if (errors.date) {
                      setErrors({ ...errors, date: validateDate(selectedDate) || undefined });
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.date}</span>
              </div>
            )}
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Select 
                value={startTime} 
                onValueChange={(value) => {
                  setStartTime(value);
                  if (errors.startTime) {
                    setErrors({ ...errors, startTime: validateTime(value, 'startTime') || undefined });
                  }
                }}
              >
                <SelectTrigger className={errors.startTime ? 'border-destructive' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.startTime && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.startTime}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Select 
                value={endTime} 
                onValueChange={(value) => {
                  setEndTime(value);
                  if (errors.endTime) {
                    setErrors({ ...errors, endTime: validateTime(value, 'endTime') || undefined });
                  }
                }}
              >
                <SelectTrigger className={errors.endTime ? 'border-destructive' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.endTime && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.endTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Attendees */}
          <FormField
            label="Number of Attendees"
            id="attendees"
            type="number"
            value={attendeesCount.toString()}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setAttendeesCount(value);
              if (errors.attendeesCount) {
                setErrors({ ...errors, attendeesCount: validateAttendees(value) || undefined });
              }
            }}
            onBlur={() => setErrors({ ...errors, attendeesCount: validateAttendees(attendeesCount) || undefined })}
            required
            error={errors.attendeesCount}
          />
          {!errors.attendeesCount && (
            <p className="text-xs text-muted-foreground">
              Maximum capacity: {resource.capacity}
            </p>
          )}

          {/* Notes */}
          <FormFieldTextarea
            label="Notes (Optional)"
            id="notes"
            placeholder="Add any additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !date}
              className="bg-brand-primary text-white hover:bg-brand-primary-dark"
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
      {NotificationComponent}
    </Dialog>
  );
};

