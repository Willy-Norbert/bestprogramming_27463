import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SchoolTexture } from '@/components/SchoolTexture';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Shield, 
  Zap, 
  Globe,
  Building2,
  BarChart3,
  GraduationCap,
  UserCog,
  Settings
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-2">
        <DialogHeader className="text-left">
          <DialogTitle className="text-4xl md:text-5xl font-bold">
            About <span className="text-brand-accent-a">E-shuri</span>
          </DialogTitle>
          <DialogDescription className="text-lg mt-2">
            Smart Classroom Resource Booking System
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 relative mt-6">
          <SchoolTexture />
          <div className="relative z-10 space-y-8">
            {/* Mission Section */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                Our <span className="text-brand-accent-a">Mission</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                E-shuri revolutionizes how educational institutions manage and allocate classroom resources. 
                We provide a comprehensive, user-friendly platform that streamlines the booking process, 
                making it easier for students, teachers, and administrators to access and manage academic spaces efficiently.
              </p>
            </section>

            {/* Features Section */}
            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Key <span className="text-brand-accent-a">Features</span>
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2 hover:border-brand-primary transition-colors">
                  <CardHeader>
                    <Calendar className="h-10 w-10 text-brand-primary mb-2" />
                    <CardTitle>Smart Booking</CardTitle>
                    <CardDescription>
                      Intuitive calendar interface for easy scheduling and conflict management
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-brand-primary transition-colors">
                  <CardHeader>
                    <Building2 className="h-10 w-10 text-brand-primary mb-2" />
                    <CardTitle>Resource Management</CardTitle>
                    <CardDescription>
                      Comprehensive catalog of classrooms, labs, and equipment with detailed information
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-brand-primary transition-colors">
                  <CardHeader>
                    <Shield className="h-10 w-10 text-brand-primary mb-2" />
                    <CardTitle>Secure Access</CardTitle>
                    <CardDescription>
                      Role-based access control for students, staff, and administrators
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-brand-primary transition-colors">
                  <CardHeader>
                    <BarChart3 className="h-10 w-10 text-brand-primary mb-2" />
                    <CardTitle>Analytics & Reports</CardTitle>
                    <CardDescription>
                      Detailed usage reports and analytics to optimize resource allocation
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </section>

            {/* Who We Serve Section */}
            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Who We <span className="text-brand-accent-a">Serve</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-2 hover:border-brand-primary transition-colors">
                  <CardHeader>
                    <GraduationCap className="h-10 w-10 text-brand-primary mb-2" />
                    <CardTitle>Students</CardTitle>
                    <CardDescription>
                      Book study rooms, labs, and classrooms for group projects and activities
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-brand-primary transition-colors">
                  <CardHeader>
                    <UserCog className="h-10 w-10 text-brand-primary mb-2" />
                    <CardTitle>Teachers & Staff</CardTitle>
                    <CardDescription>
                      Reserve classrooms and resources for classes, workshops, and meetings
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-brand-primary transition-colors">
                  <CardHeader>
                    <Settings className="h-10 w-10 text-brand-primary mb-2" />
                    <CardTitle>Administrators</CardTitle>
                    <CardDescription>
                      Manage resources, approve bookings, and generate usage reports
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </section>

            {/* Technology Section */}
            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Built With <span className="text-brand-accent-a">Modern Technology</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                E-shuri is built using cutting-edge web technologies to ensure reliability, security, and excellent user experience.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-2 hover:border-brand-primary transition-colors">
                  <CardHeader>
                    <Zap className="h-10 w-10 text-brand-primary mb-2" />
                    <CardTitle>React + TypeScript</CardTitle>
                    <CardDescription>
                      Modern, type-safe frontend framework for exceptional user experience
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-brand-primary transition-colors">
                  <CardHeader>
                    <Globe className="h-10 w-10 text-brand-primary mb-2" />
                    <CardTitle>Node.js + Express</CardTitle>
                    <CardDescription>
                      Robust, scalable backend infrastructure for reliable performance
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-brand-primary transition-colors">
                  <CardHeader>
                    <BookOpen className="h-10 w-10 text-brand-primary mb-2" />
                    <CardTitle>MongoDB</CardTitle>
                    <CardDescription>
                      Flexible, scalable database solution for growing institutions
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </section>

            {/* Security Section */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                Security & <span className="text-brand-accent-a">Privacy</span>
              </h3>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Shield className="h-8 w-8 text-brand-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground leading-relaxed">
                        We take security seriously. E-shuri uses industry-standard authentication and 
                        encryption to protect your data. All user information is securely stored and 
                        access is controlled through role-based permissions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* CTA Section */}
            <section className="pt-6 border-t-2 border-border">
              <div className="bg-brand-primary text-white p-8 text-center space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold">
                  Ready to Get <span className="text-brand-accent-a">Started</span>?
                </h3>
                <p className="text-lg opacity-90">
                  Join our platform and start booking resources efficiently today.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={onClose} 
                    variant="outline" 
                    size="lg"
                    className="bg-white text-brand-primary hover:bg-gray-100"
                  >
                    Close
                  </Button>
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-white text-brand-primary hover:bg-gray-100"
                    onClick={onClose}
                  >
                    <Link to="/auth/register">Create Account</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
