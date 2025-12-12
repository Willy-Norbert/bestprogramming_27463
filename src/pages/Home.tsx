import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BookOpen, Building2, BarChart3 } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { SchoolTexture } from '@/components/SchoolTexture';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';
import { LogoWatermark } from '@/components/LogoWatermark';
import heroBg from '@/assets/herobg.jpg';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title="E-shuri - Smart Classroom Resource Booking System"
        description="Book classrooms and resources efficiently with E-shuri. Manage your academic space bookings with ease."
        keywords="classroom booking, resource management, academic scheduling"
      />
      
      <PublicHeader />
      <div className="relative min-h-screen">
        <LogoWatermark />
        

      {/* Hero Section */}
      <section 
        className="relative pb-16 px-4 md:px-8 overflow-hidden min-h-[600px] flex items-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <SchoolTexture />
        <div className="max-w-6xl mx-auto relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Smart <span className="text-brand-accent-a">Classroom</span>
                <br />
                <span className="text-brand-primary">Resource Booking</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Efficiently manage and book classrooms, labs, and resources for your academic institution. 
                Streamline your scheduling with our intuitive platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-brand-primary text-white hover:bg-brand-primary-dark">
                  <Link to="/auth/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-96 md:h-[500px] bg-transparent">
              <img 
                src="https://cdn.dribbble.com/userupload/23611876/file/original-2452578454b4419d264dd02daec30740.gif" 
                alt="Classroom Resource Booking" 
                className="w-full h-full object-contain mix-blend-multiply"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-card relative">
        <SchoolTexture />
        <div className="max-w-6xl mx-auto relative z-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-brand-accent-a">Features</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-brand-primary transition-colors">
              <CardHeader>
                <Calendar className="h-10 w-10 text-brand-primary mb-2" />
                <CardTitle>Booking Calendar</CardTitle>
                <CardDescription>
                  View and manage all your bookings in an intuitive calendar interface
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-brand-primary transition-colors">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-brand-primary mb-2" />
                <CardTitle>Resource Catalog</CardTitle>
                <CardDescription>
                  Browse available classrooms, labs, and equipment with detailed information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-brand-primary transition-colors">
              <CardHeader>
                <Building2 className="h-10 w-10 text-brand-primary mb-2" />
                <CardTitle>Room Management</CardTitle>
                <CardDescription>
                  Comprehensive room management with capacity, amenities, and availability tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-brand-primary transition-colors">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-brand-primary mb-2" />
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>
                  Generate usage reports and analytics to optimize resource allocation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-brand-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Get <span className="text-brand-accent-a">Started</span>?
          </h2>
          <p className="text-lg opacity-90">
            Join our platform and start booking resources efficiently today.
          </p>
          <Button asChild size="lg" variant="outline" className="bg-white text-brand-primary hover:bg-gray-100">
            <Link to="/auth/register">Create Account</Link>
          </Button>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
};

export default Home;

