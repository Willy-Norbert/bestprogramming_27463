import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Resource {
  id: string;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
  images: string[];
  tags: string[];
  available?: boolean;
}

interface ResourceCardProps {
  resource: Resource;
  onQuickBook?: (resourceId: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onQuickBook }) => {
  return (
    <Card className="border-2 hover:border-brand-primary transition-all hover:shadow-lg">
      <div className="relative h-48 bg-muted overflow-hidden">
        {resource.images && resource.images.length > 0 ? (
          <img
            src={resource.images[0]}
            alt={resource.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant={resource.available ? 'default' : 'secondary'}
            className={cn(
              resource.available
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
            )}
          >
            {resource.available ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl">{resource.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {resource.location}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{resource.capacity} capacity</span>
          </div>
        </div>

        {resource.amenities && resource.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resource.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {resource.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resource.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/dashboard/resources/${resource.id}`}>View Details</Link>
          </Button>
          {resource.available && (
            <Button
              onClick={() => onQuickBook?.(resource.id)}
              className="flex-1 bg-brand-primary text-white hover:bg-brand-primary-dark"
            >
              Quick Book
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

