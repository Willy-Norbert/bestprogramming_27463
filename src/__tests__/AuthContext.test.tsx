import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import React from 'react';

// Mock API client
vi.mock('../lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should provide auth context', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      username: 'testuser',
      role: 'student' as const,
      active: true,
    };

    (apiClient.get as any).mockResolvedValue({ data: mockUser });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      username: 'testuser',
      role: 'student' as const,
      active: true,
    };

    const mockResponse = {
      data: {
        user: mockUser,
        token: 'test-token',
      },
    };

    (apiClient.get as any).mockResolvedValue({ data: null });
    (apiClient.post as any).mockResolvedValue(mockResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.login('testuser', 'password123');
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('should handle logout', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      username: 'testuser',
      role: 'student' as const,
      active: true,
    };

    (apiClient.get as any).mockResolvedValue({ data: mockUser });
    (apiClient.post as any).mockResolvedValue({});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    localStorage.setItem('auth_token', 'test-token');
    
    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });

    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});

