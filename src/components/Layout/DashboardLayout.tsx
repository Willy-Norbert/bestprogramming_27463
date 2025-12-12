import React, { useState, ReactNode } from 'react';
import { AppBar } from './AppBar';
import { Sidebar } from './Sidebar';
import { LogoWatermark } from '../LogoWatermark';
import { SchoolTexture } from '../SchoolTexture';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SchoolTexture />
      <AppBar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 md:ml-64 min-h-[calc(100vh-4rem)] p-4 md:p-6 relative">
          <LogoWatermark />
          {children}
        </main>
      </div>
    </div>
  );
};

