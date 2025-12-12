import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { useNotification } from '@/hooks/use-notification';
import { FileText, Calendar, User, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditLog {
  id: string;
  action: string;
  actorUserId: {
    id: string;
    name: string;
    username: string;
  } | null;
  targetType: string;
  targetId?: string;
  meta: {
    method?: string;
    path?: string;
    statusCode?: number;
  };
  timestamp: string;
}

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>('all');
  const { showError, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchLogs();
  }, [searchQuery, actionFilter, targetTypeFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery) params.q = searchQuery;
      if (actionFilter !== 'all') params.action = actionFilter;
      if (targetTypeFilter !== 'all') params.targetType = targetTypeFilter;

      const response = await apiClient.get('/audit-logs', { params });
      setLogs(response.data);
    } catch (error: any) {
      console.error('Failed to fetch audit logs:', error);
      if (!error.response) {
        showError('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } else {
        showError('Error', error.response?.data?.message || 'Failed to load audit logs');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('create') || action.includes('Create')) return 'default';
    if (action.includes('update') || action.includes('Update')) return 'secondary';
    if (action.includes('delete') || action.includes('Delete')) return 'destructive';
    return 'outline';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-2">
            View system activity and user actions
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter audit logs by action, target type, or search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                </SelectContent>
              </Select>
              <Select value={targetTypeFilter} onValueChange={setTargetTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Target Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                  <SelectItem value="booking">Booking</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchLogs} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        {loading ? (
          <div className="text-center py-12">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No audit logs found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <Card key={log.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.action}
                        </Badge>
                        {log.targetType && (
                          <Badge variant="outline">{log.targetType}</Badge>
                        )}
                        {log.meta?.statusCode && (
                          <Badge variant={log.meta.statusCode < 400 ? 'default' : 'destructive'}>
                            {log.meta.statusCode}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>
                            {log.actorUserId ? (log.actorUserId.name || log.actorUserId.username || 'Unknown') : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                        {log.meta?.method && log.meta?.path && (
                          <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4" />
                            <span className="font-mono text-xs">
                              {log.meta.method} {log.meta.path}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {NotificationComponent}
    </DashboardLayout>
  );
};

export default AuditLogs;

