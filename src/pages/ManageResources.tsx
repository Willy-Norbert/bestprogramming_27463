import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useNotification } from '@/hooks/use-notification';
import { FormField } from '@/components/FormField';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Resource } from '@/components/ResourceCard';

export const ManageResources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const { showError, showSuccess, NotificationComponent } = useNotification();
  
  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    location?: string;
    capacity?: string;
  }>({});

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: [] as string[],
    tags: [] as string[],
    images: [] as string[],
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await apiClient.get('/resources?all=true');
      setResources(response.data);
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', 'Failed to load resources');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateName = (value: string): string | null => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  };

  const validateLocation = (value: string): string | null => {
    if (!value.trim()) {
      return 'Location is required';
    }
    return null;
  };

  const validateCapacity = (value: string): string | null => {
    if (!value.trim()) {
      return 'Capacity is required';
    }
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      return 'Capacity must be at least 1';
    }
    return null;
  };

  const handleOpenDialog = (resource?: Resource) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        name: resource.name,
        location: resource.location,
        capacity: resource.capacity.toString(),
        amenities: resource.amenities || [],
        tags: resource.tags || [],
        images: resource.images || [],
      });
    } else {
      setEditingResource(null);
      setFormData({
        name: '',
        location: '',
        capacity: '',
        amenities: [],
        tags: [],
        images: [],
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateName(formData.name);
    const locationError = validateLocation(formData.location);
    const capacityError = validateCapacity(formData.capacity);

    const newErrors = {
      name: nameError || undefined,
      location: locationError || undefined,
      capacity: capacityError || undefined,
    };

    setErrors(newErrors);

    if (nameError || locationError || capacityError) {
      return;
    }

    try {
      const data = {
        ...formData,
        capacity: parseInt(formData.capacity),
      };

      if (editingResource) {
        await apiClient.put(`/resources/${editingResource.id}`, data);
        showSuccess(
          'Resource Updated!',
          'The resource has been updated successfully.',
        );
      } else {
        await apiClient.post('/resources', data);
        showSuccess(
          'Resource Created!',
          'The resource has been created successfully.',
        );
      }

      setIsDialogOpen(false);
      setErrors({});
      fetchResources();
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const serverErrors: any = {};
        error.response.data.errors.forEach((err: any) => {
          const field = err.param || err.field;
          if (field === 'name') serverErrors.name = err.msg || err.message;
          if (field === 'location') serverErrors.location = err.msg || err.message;
          if (field === 'capacity') serverErrors.capacity = err.msg || err.message;
        });
        setErrors(serverErrors);
        showError('Validation Error', 'Please check the form fields and correct the errors.');
      } else {
        showError('Error', error.response?.data?.message || 'Failed to save resource');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      await apiClient.delete(`/resources/${id}`);
      showSuccess('Resource Deleted!', 'The resource has been deleted successfully.');
      fetchResources();
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', error.response?.data?.message || 'Failed to delete resource');
      }
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()],
      });
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Resources</h1>
              <p className="text-muted-foreground">
                Create, edit, and delete classroom resources
              </p>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-brand-primary text-white hover:bg-brand-primary-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => (
                <Card key={resource.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>{resource.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(resource)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(resource.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{resource.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Capacity:</strong> {resource.capacity}
                      </p>
                      {resource.amenities && resource.amenities.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Amenities:</p>
                          <div className="flex flex-wrap gap-1">
                            {resource.amenities.slice(0, 3).map((amenity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingResource ? 'Edit Resource' : 'Create Resource'}
                </DialogTitle>
                <DialogDescription>
                  {editingResource
                    ? 'Update resource information'
                    : 'Add a new classroom or resource'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Name"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) {
                      setErrors({ ...errors, name: validateName(e.target.value) || undefined });
                    }
                  }}
                  onBlur={() => setErrors({ ...errors, name: validateName(formData.name) || undefined })}
                  required
                  error={errors.name}
                />

                <FormField
                  label="Location"
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    if (errors.location) {
                      setErrors({ ...errors, location: validateLocation(e.target.value) || undefined });
                    }
                  }}
                  onBlur={() => setErrors({ ...errors, location: validateLocation(formData.location) || undefined })}
                  required
                  error={errors.location}
                />

                <FormField
                  label="Capacity"
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => {
                    setFormData({ ...formData, capacity: e.target.value });
                    if (errors.capacity) {
                      setErrors({ ...errors, capacity: validateCapacity(e.target.value) || undefined });
                    }
                  }}
                  onBlur={() => setErrors({ ...errors, capacity: validateCapacity(formData.capacity) || undefined })}
                  required
                  error={errors.capacity}
                />

                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="flex gap-2">
                    <Input
                      value={amenityInput}
                      onChange={(e) => setAmenityInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addAmenity();
                        }
                      }}
                      placeholder="Add amenity"
                    />
                    <Button type="button" onClick={addAmenity}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(index)}
                          className="ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add tag"
                    />
                    <Button type="button" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-primary text-white hover:bg-brand-primary-dark">
                    {editingResource ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {NotificationComponent}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ManageResources;

