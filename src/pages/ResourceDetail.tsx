import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Clock, CheckCircle2, X } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Resource } from '@/components/ResourceCard';
import { BookingModal } from '@/components/BookingModal';
import { CalendarView } from '@/components/CalendarView';
import { useNotification } from '@/hooks/use-notification';

export const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, NotificationComponent } = useNotification();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResource();
    }
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await apiClient.get(`/resources/${id}`);
      setResource(response.data);
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', 'Failed to load resource details');
      }
      navigate('/dashboard/resources');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!resource) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Resource not found</p>
          <Button onClick={() => navigate('/dashboard/resources')} className="mt-4">
            Back to Resources
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/resources')}
          className="mb-4"
        >
          ← Back to Resources
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resource Images */}
          <Card className="border-2">
            <CardContent className="p-0">
              {resource.images && resource.images.length > 0 ? (
                <div className="relative h-96 bg-muted">
                  <img
                    src={resource.images[0]}
                    alt={resource.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-96 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No Image Available</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resource Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{resource.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{resource.location}</span>
                  </div>
                </div>
                <Badge
                  variant={resource.available ? 'default' : 'secondary'}
                  className={resource.available ? 'bg-green-500' : 'bg-gray-500'}
                >
                  {resource.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Capacity</div>
                    <div className="font-semibold">{resource.capacity} people</div>
                  </div>
                </div>
              </div>

              {resource.amenities && resource.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {resource.tags && resource.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => setIsBookingModalOpen(true)}
                disabled={!resource.available}
                className="w-full bg-brand-primary text-white hover:bg-brand-primary-dark"
                size="lg"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book This Resource
              </Button>
            </div>
          </div>
        </div>

        {/* Availability Calendar */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Availability Calendar</CardTitle>
            <CardDescription>View available time slots for this resource</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarView resourceId={id!} onSlotSelect={(slot) => {
              setIsBookingModalOpen(true);
              // TODO: Pre-fill booking modal with selected slot
            }} />
          </CardContent>
        </Card>
      </div>

      {isBookingModalOpen && (
        <BookingModal
          resourceId={id!}
          resource={resource}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={() => {
            setIsBookingModalOpen(false);
            toast({
              title: 'Success',
              description: 'Booking created successfully',
            });
            fetchResource(); // Refresh to show updated availability
          }}
        />
      )}
      {NotificationComponent}
    </DashboardLayout>
  );
};

export default ResourceDetail;

