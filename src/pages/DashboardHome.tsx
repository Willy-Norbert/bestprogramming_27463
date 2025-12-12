import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { useEffect, useState } from 'react';

interface DashboardStats {
  upcomingBookings: number;
  availableRooms: number;
  pendingApprovals: number;
  totalBookings: number;
}

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingBookings: 0,
    availableRooms: 0,
    pendingApprovals: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's an overview of your bookings and resources.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
              <p className="text-xs text-muted-foreground">Scheduled for this week</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableRooms}</div>
              <p className="text-xs text-muted-foreground">Currently available</p>
            </CardContent>
          </Card>

          {user?.role === 'admin' && (
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">Awaiting your review</p>
              </CardContent>
            </Card>
          )}

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                to="/dashboard/resources"
                className="block p-3 border-2 hover:border-brand-primary transition-colors"
              >
                <div className="font-medium">Browse Resources</div>
                <div className="text-sm text-muted-foreground">View available classrooms and equipment</div>
              </Link>
              <Link
                to="/dashboard/bookings"
                className="block p-3 border-2 hover:border-brand-primary transition-colors"
              >
                <div className="font-medium">My Bookings</div>
                <div className="text-sm text-muted-foreground">Manage your existing bookings</div>
              </Link>
            </CardContent>
          </Card>

          {user?.role === 'admin' && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Management tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  to="/dashboard/booking-requests"
                  className="block p-3 border-2 hover:border-brand-primary transition-colors"
                >
                  <div className="font-medium">Review Requests</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.pendingApprovals} booking requests pending
                  </div>
                </Link>
                <Link
                  to="/dashboard/manage-resources"
                  className="block p-3 border-2 hover:border-brand-primary transition-colors"
                >
                  <div className="font-medium">Manage Resources</div>
                  <div className="text-sm text-muted-foreground">Add or edit classrooms and equipment</div>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;

