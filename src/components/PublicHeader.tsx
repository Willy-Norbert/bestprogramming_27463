import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from './Logo';
import { AboutModal } from './AboutModal';
import { Search, User, Menu, X } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      {/* Top Bar */}
      <div className="bg-black text-white text-xs py-2">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span>Welcome to E-shuri!</span>
              <button 
                onClick={() => setIsAboutModalOpen(true)}
                className="hover:underline cursor-pointer bg-transparent border-none text-white text-xs"
              >
                Learn More
              </button>
              <Link to="/auth/register" className="hover:underline">Join Now</Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              ) : (
                <Link to="/auth/register" className="hover:underline">Get Started</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Social Media Icons (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="#" className="text-foreground hover:text-brand-primary transition-colors" aria-label="Facebook">
                <span className="text-sm font-semibold">f</span>
              </a>
              <a href="#" className="text-foreground hover:text-brand-primary transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="#" className="text-foreground hover:text-brand-primary transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center lg:flex-none lg:justify-start">
              <Logo showText={false} size="md" />
            </div>

            {/* Right: Navigation & Icons */}
            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                <Link 
                  to="/" 
                  className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors"
                >
                  HOME
                </Link>
                {user ? (
                  <>
                    <Link 
                      to="/dashboard/resources" 
                      className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors"
                    >
                      RESOURCES
                    </Link>
                    <Link 
                      to="/dashboard/bookings" 
                      className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors"
                    >
                      BOOKINGS
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/auth/login" 
                      className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors"
                    >
                      SIGN IN
                    </Link>
                    <Link 
                      to="/auth/register" 
                      className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors"
                    >
                      SIGN UP
                    </Link>
                  </>
                )}
              </nav>

              {/* Utility Icons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 hover:bg-accent transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                {user ? (
                  <Link
                    to="/dashboard/settings"
                    className="p-2 hover:bg-accent transition-colors"
                    aria-label="Account"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link
                    to="/auth/login"
                    className="p-2 hover:bg-accent transition-colors"
                    aria-label="Account"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}
                
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 hover:bg-accent transition-colors"
                  aria-label="Menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar (when open) */}
          {isSearchOpen && (
            <div className="border-t border-border py-4">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-2 border border-border focus:outline-none focus:border-brand-primary"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-border py-4">
              <nav className="flex flex-col gap-4">
                <Link 
                  to="/" 
                  className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  HOME
                </Link>
                {user ? (
                  <>
                    <Link 
                      to="/dashboard/resources" 
                      className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      RESOURCES
                    </Link>
                    <Link 
                      to="/dashboard/bookings" 
                      className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      MY BOOKINGS
                    </Link>
                    <button
                      onClick={async () => {
                        await logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors text-left"
                    >
                      SIGN OUT
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/auth/login" 
                      className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      SIGN IN
                    </Link>
                    <Link 
                      to="/auth/register" 
                      className="text-sm font-medium uppercase text-foreground hover:text-brand-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      SIGN UP
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </header>
  );
};

