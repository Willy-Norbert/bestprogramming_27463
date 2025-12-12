import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useNotification } from '@/hooks/use-notification';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, X, Calendar, Clock, Users } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface BookingRequest {
  id: string;
  resourceId: string;
  resource: {
    id: string;
    name: string;
    location: string;
  };
  user: {
    id: string;
    name: string;
    username: string;
  };
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  attendeesCount: number;
  notes?: string;
  createdAt: string;
}

export const BookingRequests: React.FC = () => {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await apiClient.get('/bookings?status=pending&all=true');
      setRequests(response.data);
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', 'Failed to load booking requests');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiClient.patch(`/bookings/${id}`, { status: 'confirmed' });
      showSuccess('Booking Approved!', 'The booking has been approved successfully.');
      fetchRequests();
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', error.response?.data?.message || 'Failed to approve booking');
      }
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiClient.patch(`/bookings/${id}`, { status: 'cancelled' });
      showSuccess('Booking Rejected!', 'The booking has been rejected.');
      fetchRequests();
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', error.response?.data?.message || 'Failed to reject booking');
      }
    }
  };

  const handleBulkApprove = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => apiClient.patch(`/bookings/${id}`, { status: 'confirmed' })));
      showSuccess('Bookings Approved!', `${ids.length} booking(s) have been approved successfully.`);
      fetchRequests();
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', 'Failed to approve bookings');
      }
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Booking Requests</h1>
              <p className="text-muted-foreground">
                Review and approve pending booking requests
              </p>
            </div>
            {requests.length > 0 && (
              <Button
                onClick={() => handleBulkApprove(requests.map((r) => r.id))}
                className="bg-brand-primary text-white hover:bg-brand-primary-dark"
              >
                Approve All
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : requests.length === 0 ? (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No pending booking requests</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{request.resource.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Requested by {request.user.name} ({request.user.username})
                        </CardDescription>
                      </div>
                      <Badge className="bg-yellow-500 text-white">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(parseISO(request.startTime), 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(parseISO(request.startTime), 'HH:mm')} -{' '}
                          {format(parseISO(request.endTime), 'HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{request.attendeesCount} attendees</span>
                      </div>
                    </div>

                    {request.notes && (
                      <div className="mb-4 p-3 bg-muted border-2 border-border">
                        <p className="text-sm">{request.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-500 text-white hover:bg-green-600"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(request.id)}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        {NotificationComponent}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default BookingRequests;

