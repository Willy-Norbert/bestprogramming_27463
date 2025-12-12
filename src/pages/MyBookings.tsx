import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useNotification } from '@/hooks/use-notification';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, Users, X, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { BookingModal } from '@/components/BookingModal';
import { Resource } from '@/components/ResourceCard';

interface Booking {
  id: string;
  resourceId: string;
  resource: Resource;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  attendeesCount: number;
  notes?: string;
  createdAt: string;
}

export const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const { showError, showSuccess, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await apiClient.get('/bookings');
      setBookings(response.data);
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', 'Failed to load bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await apiClient.patch(`/bookings/${bookingId}`, {
        status: 'cancelled',
      });

      showSuccess('Booking Cancelled!', 'Your booking has been cancelled successfully.');
      fetchBookings();
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const handleReschedule = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsRescheduleModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const isPastBooking = (endTime: string) => {
    return parseISO(endTime) < new Date();
  };

  const canCancel = (booking: Booking) => {
    if (booking.status === 'cancelled') return false;
    const startTime = parseISO(booking.startTime);
    const hoursUntilStart = (startTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    return hoursUntilStart >= 24; // Can cancel if more than 24 hours before start
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading bookings...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your classroom and resource bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You don't have any bookings yet</p>
              <Button asChild className="bg-brand-primary text-white hover:bg-brand-primary-dark">
                <a href="/dashboard/resources">Browse Resources</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{booking.resource.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {booking.resource.location}
                      </CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(parseISO(booking.startTime), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(parseISO(booking.startTime), 'HH:mm')} -{' '}
                        {format(parseISO(booking.endTime), 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.attendeesCount} attendees</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-muted border-2 border-border">
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}

                  {isPastBooking(booking.endTime) && (
                    <Badge variant="outline" className="mb-4">
                      Past Booking
                    </Badge>
                  )}

                  <div className="flex gap-2">
                    {canCancel(booking) && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this booking? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancel(booking.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Cancel Booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        {!isPastBooking(booking.endTime) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReschedule(booking)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Reschedule
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {isRescheduleModalOpen && selectedBooking && (
        <BookingModal
          resourceId={selectedBooking.resourceId}
          resource={selectedBooking.resource}
          isOpen={isRescheduleModalOpen}
          onClose={() => {
            setIsRescheduleModalOpen(false);
            setSelectedBooking(null);
          }}
          onSuccess={() => {
            setIsRescheduleModalOpen(false);
            setSelectedBooking(null);
            fetchBookings();
            toast({
              title: 'Success',
              description: 'Booking rescheduled successfully',
            });
          }}
          initialDate={parseISO(selectedBooking.startTime)}
          initialStartTime={format(parseISO(selectedBooking.startTime), 'HH:mm')}
          initialEndTime={format(parseISO(selectedBooking.endTime), 'HH:mm')}
        />
      )}
      {NotificationComponent}
    </DashboardLayout>
  );
};

export default MyBookings;

