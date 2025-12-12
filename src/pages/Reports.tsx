import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api';
import { useNotification } from '@/hooks/use-notification';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BarChart3, Download, Calendar } from 'lucide-react';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

interface ReportData {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  resourceUsage: Array<{
    resourceId: string;
    resourceName: string;
    bookingCount: number;
  }>;
  timeRangeUsage: Array<{
    period: string;
    count: number;
  }>;
}

export const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const { showError, showSuccess, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchReport();
  }, [timeRange]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      let from: Date;
      const to = new Date();

      switch (timeRange) {
        case 'week':
          from = subWeeks(to, 1);
          break;
        case 'month':
          from = subMonths(to, 1);
          break;
        case '3months':
          from = subMonths(to, 3);
          break;
        default:
          from = subWeeks(to, 1);
      }

      const response = await apiClient.get('/reports/usage', {
        params: {
          from: from.toISOString(),
          to: to.toISOString(),
        },
      });

      setReportData(response.data);
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', 'Failed to load report data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await apiClient.get('/reports/usage', {
        params: {
          from: subWeeks(new Date(), 1).toISOString(),
          to: new Date().toISOString(),
          format: 'csv',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `usage-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showSuccess('Report Exported!', 'The report has been exported successfully.');
    } catch (error: any) {
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', 'Failed to export report');
      }
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                View usage statistics and generate reports
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading report data...</div>
          ) : reportData ? (
            <>
              {/* Summary Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.totalBookings}</div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {reportData.confirmedBookings}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {reportData.pendingBookings}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {reportData.cancelledBookings}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resource Usage */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                  <CardDescription>Most booked resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.resourceUsage.map((item) => (
                      <div key={item.resourceId} className="flex items-center justify-between">
                        <span className="font-medium">{item.resourceName}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted">
                            <div
                              className="h-2 bg-brand-primary"
                              style={{
                                width: `${(item.bookingCount / reportData.totalBookings) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold w-12 text-right">
                            {item.bookingCount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No report data available</p>
              </CardContent>
            </Card>
          )}
        </div>
        {NotificationComponent}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Reports;

