import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { apiClient } from '@/lib/api';
import { useNotification } from '@/hooks/use-notification';
import { FormField } from '@/components/FormField';
import { FormFieldTextarea } from '@/components/FormFieldTextarea';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Users, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Resource } from '@/components/ResourceCard';

export const QuickBook: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showError, showSuccess, NotificationComponent } = useNotification();
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [attendeesCount, setAttendeesCount] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<{
    resourceId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    attendeesCount?: string;
  }>({});

  // Get resourceId from URL params if present
  useEffect(() => {
    const resourceId = searchParams.get('resourceId');
    if (resourceId) {
      setSelectedResourceId(resourceId);
    }
  }, [searchParams]);

  // Fetch resources
  useEffect(() => {
    fetchResources();
  }, []);

  // Fetch selected resource details
  useEffect(() => {
    if (selectedResourceId) {
      fetchResourceDetails(selectedResourceId);
    } else {
      setSelectedResource(null);
    }
  }, [selectedResourceId]);

  const fetchResources = async () => {
    try {
      const response = await apiClient.get('/resources');
      setResources(response.data || []);
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', 'Failed to load resources');
      }
    }
  };

  const fetchResourceDetails = async (resourceId: string) => {
    try {
      const response = await apiClient.get(`/resources/${resourceId}`);
      setSelectedResource(response.data);
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', 'Failed to load resource details');
      }
    }
  };

  const validateResourceId = (value: string): string | null => {
    if (!value) {
      return 'Please select a resource';
    }
    return null;
  };

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
    if (selectedResource && value > selectedResource.capacity) {
      return `Attendees count (${value}) exceeds resource capacity (${selectedResource.capacity})`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const resourceError = validateResourceId(selectedResourceId);
    const dateError = validateDate(date);
    const startTimeError = validateTime(startTime, 'startTime');
    const endTimeError = validateTime(endTime, 'endTime');
    const attendeesError = validateAttendees(attendeesCount);

    const newErrors = {
      resourceId: resourceError || undefined,
      date: dateError || undefined,
      startTime: startTimeError || undefined,
      endTime: endTimeError || undefined,
      attendeesCount: attendeesError || undefined,
    };

    setErrors(newErrors);

    // Check time logic
    if (date && startTime && endTime) {
      const startDateTime = new Date(date);
      const [startHours, startMinutes] = startTime.split(':');
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

      const endDateTime = new Date(date);
      const [endHours, endMinutes] = endTime.split(':');
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      if (endDateTime <= startDateTime) {
        setErrors({ ...newErrors, endTime: 'End time must be after start time' });
        return;
      }
    }

    // If there are validation errors, don't submit
    if (resourceError || dateError || startTimeError || endTimeError || attendeesError) {
      return;
    }

    // Combine date and time
    const startDateTime = new Date(date!);
    const [startHours, startMinutes] = startTime.split(':');
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

    const endDateTime = new Date(date!);
    const [endHours, endMinutes] = endTime.split(':');
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

    setSubmitting(true);

    try {
      await apiClient.post('/bookings', {
        resourceId: selectedResourceId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        attendeesCount,
        notes: notes.trim() || undefined,
      });

      showSuccess(
        'Booking Created!',
        'Your booking has been created successfully. You can view it in your bookings page.',
        {
          primary: {
            label: 'View Bookings',
            onClick: () => navigate('/dashboard/bookings'),
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
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Quick Book</h1>
          <p className="text-muted-foreground">
            Quickly create a new booking for a resource
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Resource Selection</CardTitle>
              <CardDescription>Choose the resource you want to book</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resource">Resource / Classroom</Label>
                <Select 
                  value={selectedResourceId} 
                  onValueChange={(value) => {
                    setSelectedResourceId(value);
                    if (errors.resourceId) {
                      setErrors({ ...errors, resourceId: validateResourceId(value) || undefined });
                    }
                  }}
                >
                  <SelectTrigger id="resource" className={errors.resourceId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {resources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.id}>
                        {resource.name} - {resource.location} ({resource.capacity} capacity)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.resourceId && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <span>{errors.resourceId}</span>
                  </div>
                )}
              </div>

              {selectedResource && (
                <div className="p-4 bg-muted border-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedResource.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Capacity: {selectedResource.capacity} people</span>
                  </div>
                  {selectedResource.amenities && selectedResource.amenities.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Amenities: </span>
                      <span className="text-sm text-muted-foreground">
                        {selectedResource.amenities.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Date & Time</CardTitle>
              <CardDescription>When do you need this resource?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    <span>{errors.date}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Start Time"
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    if (errors.startTime) {
                      setErrors({ ...errors, startTime: validateTime(e.target.value, 'startTime') || undefined });
                    }
                  }}
                  onBlur={() => setErrors({ ...errors, startTime: validateTime(startTime, 'startTime') || undefined })}
                  required
                  error={errors.startTime}
                />
                <FormField
                  label="End Time"
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    if (errors.endTime) {
                      setErrors({ ...errors, endTime: validateTime(e.target.value, 'endTime') || undefined });
                    }
                  }}
                  onBlur={() => setErrors({ ...errors, endTime: validateTime(endTime, 'endTime') || undefined })}
                  required
                  error={errors.endTime}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Additional information about your booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              {selectedResource && !errors.attendeesCount && (
                <p className="text-xs text-muted-foreground">
                  Maximum capacity: {selectedResource.capacity} people
                </p>
              )}

              <FormFieldTextarea
                label="Notes (Optional)"
                id="notes"
                placeholder="Add any additional notes or requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/resources')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !selectedResourceId || !date || !startTime || !endTime}
              className="bg-brand-primary text-white hover:bg-brand-primary-dark"
            >
              {submitting ? 'Creating Booking...' : 'Create Booking'}
            </Button>
          </div>
        </form>
      </div>
      {NotificationComponent}
    </DashboardLayout>
  );
};

export default QuickBook;

