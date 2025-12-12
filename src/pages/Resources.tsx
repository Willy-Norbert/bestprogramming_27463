import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { ResourceCard, Resource } from '@/components/ResourceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api';
import { Search, Filter } from 'lucide-react';

export const Resources: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  useEffect(() => {
    fetchResources();
  }, [searchQuery, capacityFilter, tagFilter]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery) params.q = searchQuery;
      if (capacityFilter !== 'all') params.capacity = capacityFilter;
      if (tagFilter !== 'all') params.tags = tagFilter;

      const response = await apiClient.get('/resources', { params });
      setResources(response.data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBook = (resourceId: string) => {
    navigate(`/dashboard/quick-book?resourceId=${resourceId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Resources & Classrooms</h1>
          <p className="text-muted-foreground">
            Browse and book available classrooms, labs, and resources
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={capacityFilter} onValueChange={setCapacityFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Capacities</SelectItem>
              <SelectItem value="10">Up to 10</SelectItem>
              <SelectItem value="20">Up to 20</SelectItem>
              <SelectItem value="30">Up to 30</SelectItem>
              <SelectItem value="50">Up to 50</SelectItem>
              <SelectItem value="100">100+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="classroom">Classroom</SelectItem>
              <SelectItem value="lab">Laboratory</SelectItem>
              <SelectItem value="library">Library</SelectItem>
              <SelectItem value="auditorium">Auditorium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-12">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No resources found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onQuickBook={handleQuickBook}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Resources;

