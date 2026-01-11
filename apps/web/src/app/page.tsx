'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight, Shield, DollarSign, CheckCircle, Home, Search, Calendar,
  FileText, Settings, Bell, User, MapPin, Star, Clock, Phone, Menu, X,
  ChevronRight, TrendingUp, AlertCircle, CheckCircle2, Truck, Sparkles,
  Trees, LogOut, CreditCard, HelpCircle, Plus, Filter, ChevronDown,
  Users, Briefcase, Heart, Calculator, ClipboardList
} from 'lucide-react';

// Demo data
const providers = [
  { id: 1, name: "Sarah's Cleaning", service: "Domestic Cleaning", location: "Melbourne VIC", rate: 52, ndisCap: 62.17, rating: 4.9, reviews: 127, score: 92, initials: "SC", available: true },
  { id: 2, name: "Green Thumb Gardens", service: "Yard Maintenance", location: "Sydney NSW", rate: 58, ndisCap: 62.17, rating: 4.7, reviews: 89, score: 78, initials: "GT", available: true },
  { id: 3, name: "Mike's Transport", service: "Community Transport", location: "Brisbane QLD", rate: 65, ndisCap: 72.50, rating: 4.8, reviews: 156, score: 82, initials: "MT", available: true },
  { id: 4, name: "Crystal Clean Co", service: "Domestic Cleaning", location: "Perth WA", rate: 60, ndisCap: 62.17, rating: 4.6, reviews: 72, score: 65, initials: "CC", available: false },
  { id: 5, name: "Easy Ride Transport", service: "Community Transport", location: "Adelaide SA", rate: 55, ndisCap: 72.50, rating: 4.9, reviews: 203, score: 95, initials: "ER", available: true },
  { id: 6, name: "Garden Pros", service: "Yard Maintenance", location: "Hobart TAS", rate: 50, ndisCap: 62.17, rating: 4.5, reviews: 45, score: 88, initials: "GP", available: true },
];

const bookings = [
  { id: 1, service: "Domestic Cleaning", provider: "Sarah's Cleaning", date: "Mon, 15 Jan 2026", time: "9:00 AM - 12:00 PM", status: "confirmed", amount: 156 },
  { id: 2, service: "Community Transport", provider: "Mike's Transport", date: "Tue, 16 Jan 2026", time: "2:00 PM - 4:00 PM", status: "confirmed", amount: 130 },
  { id: 3, service: "Yard Maintenance", provider: "Green Thumb Gardens", date: "Wed, 17 Jan 2026", time: "10:00 AM - 1:00 PM", status: "pending", amount: 174 },
  { id: 4, service: "Domestic Cleaning", provider: "Sarah's Cleaning", date: "Fri, 12 Jan 2026", time: "9:00 AM - 11:00 AM", status: "needs_confirmation", amount: 104 },
];

const providerJobs = [
  { id: 1, participant: "Emma Johnson", service: "Domestic Cleaning", date: "Today", time: "9:00 AM", address: "123 Smith Street, Melbourne VIC", status: "in_progress", duration: "2h 15m" },
  { id: 2, participant: "James Wilson", service: "Domestic Cleaning", date: "Today", time: "2:00 PM", address: "45 Queen Road, Melbourne VIC", status: "upcoming" },
  { id: 3, participant: "Sarah Brown", service: "Domestic Cleaning", date: "Tomorrow", time: "10:00 AM", address: "78 King Avenue, Melbourne VIC", status: "upcoming" },
];

type View = 'landing' | 'dashboard' | 'search' | 'bookings' | 'provider-portal' | 'booking-detail';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);

  const getFairScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-700';
    if (score >= 70) return 'bg-teal-100 text-teal-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'needs_confirmation': return 'bg-orange-100 text-orange-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'upcoming': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'needs_confirmation': return 'Needs Confirmation';
      case 'in_progress': return 'In Progress';
      case 'upcoming': return 'Upcoming';
      default: return status;
    }
  };

  // Landing Page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#F5F2ED]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-[#2D5A4A] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  VC
                </div>
                <span className="text-lg font-semibold text-gray-900">Verified Care</span>
              </div>

              <nav className="hidden md:flex items-center gap-8">
                <button onClick={() => setCurrentView('search')} className="text-gray-600 hover:text-[#2D5A4A] transition-colors">
                  Find Providers
                </button>
                <a href="#how-it-works" className="text-gray-600 hover:text-[#2D5A4A] transition-colors">
                  How It Works
                </a>
                <a href="#services" className="text-gray-600 hover:text-[#2D5A4A] transition-colors">
                  Services
                </a>
                <a href="#portals" className="text-gray-600 hover:text-[#2D5A4A] transition-colors">
                  Portals
                </a>
              </nav>

              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-4 py-2 text-[#2D5A4A] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Participant Login
                </button>
                <button
                  onClick={() => setCurrentView('provider-portal')}
                  className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] transition-colors"
                >
                  Provider Portal
                </button>
              </div>

              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
              <button onClick={() => { setCurrentView('search'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-600">Find Providers</button>
              <button onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-600">Participant Login</button>
              <button onClick={() => { setCurrentView('provider-portal'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-600">Provider Portal</button>
            </div>
          )}
        </header>

        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-[#E8F0ED] to-[#F5F2ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Fair Pricing for <span className="text-[#2D5A4A]">NDIS Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Connect with verified providers for domestic cleaning, community transport, and yard maintenance.
              See real prices, not hidden gaps.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentView('search')}
                className="flex items-center gap-2 px-6 py-3 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] transition-colors text-lg"
              >
                Find a Provider <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentView('provider-portal')}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#2D5A4A] text-[#2D5A4A] rounded-lg hover:bg-[#2D5A4A] hover:text-white transition-colors text-lg"
              >
                I'm a Provider
              </button>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-16 bg-white" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Verified Care?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#F5F2ED] rounded-xl p-8">
                <div className="w-14 h-14 bg-[#2D5A4A] rounded-xl flex items-center justify-center mb-6">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Fair Price Score</h3>
                <p className="text-gray-600">
                  See exactly how provider rates compare to NDIS caps. Our unique scoring system helps you find the best value.
                </p>
              </div>
              <div className="bg-[#F5F2ED] rounded-xl p-8">
                <div className="w-14 h-14 bg-[#2D5A4A] rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verified Providers</h3>
                <p className="text-gray-600">
                  Every provider is verified with insurance, police checks, and NDIS worker screening. Your safety is our priority.
                </p>
              </div>
              <div className="bg-[#F5F2ED] rounded-xl p-8">
                <div className="w-14 h-14 bg-[#2D5A4A] rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Dual Confirmation</h3>
                <p className="text-gray-600">
                  Both you and the provider confirm service completion before invoicing. No surprises, complete peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-[#2D5A4A] transition-colors cursor-pointer" onClick={() => setCurrentView('search')}>
                <div className="text-5xl mb-6"><Sparkles className="w-12 h-12 text-[#E07850]" /></div>
                <h3 className="text-xl font-semibold mb-3">Domestic Cleaning</h3>
                <p className="text-gray-600 mb-4">Regular cleaning, deep cleaning, and household assistance from verified cleaners.</p>
                <p className="text-[#2D5A4A] font-semibold">From $45/hour</p>
              </div>
              <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-[#2D5A4A] transition-colors cursor-pointer" onClick={() => setCurrentView('search')}>
                <div className="text-5xl mb-6"><Truck className="w-12 h-12 text-[#E07850]" /></div>
                <h3 className="text-xl font-semibold mb-3">Community Transport</h3>
                <p className="text-gray-600 mb-4">Safe, reliable transport to appointments, shopping, and social activities.</p>
                <p className="text-[#2D5A4A] font-semibold">From $50/hour</p>
              </div>
              <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-[#2D5A4A] transition-colors cursor-pointer" onClick={() => setCurrentView('search')}>
                <div className="text-5xl mb-6"><Trees className="w-12 h-12 text-[#E07850]" /></div>
                <h3 className="text-xl font-semibold mb-3">Yard Maintenance</h3>
                <p className="text-gray-600 mb-4">Lawn mowing, gardening, and outdoor maintenance from trusted providers.</p>
                <p className="text-[#2D5A4A] font-semibold">From $48/hour</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-[#2D5A4A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-white/80">Verified Providers</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">4.8</div>
                <div className="text-white/80">Average Rating</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">23%</div>
                <div className="text-white/80">Avg. Savings</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-white/80">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Access Portals */}
        <section className="py-16 bg-white" id="portals">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Access Your Portal</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Choose your role to access the features designed for you
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Participant Portal */}
              <Link href="/dashboard" className="group bg-[#F5F2ED] rounded-xl p-6 border-2 border-transparent hover:border-[#2D5A4A] transition-all">
                <div className="w-14 h-14 bg-[#2D5A4A] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Participant</h3>
                <p className="text-gray-600 text-sm mb-4">Find providers, manage bookings, and track your NDIS budget.</p>
                <div className="flex items-center text-[#2D5A4A] font-medium">
                  Go to Dashboard <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              {/* Family/Carer Portal */}
              <Link href="/family/dashboard" className="group bg-[#F5F2ED] rounded-xl p-6 border-2 border-transparent hover:border-[#2D5A4A] transition-all">
                <div className="w-14 h-14 bg-[#E07850] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Family / Carer</h3>
                <p className="text-gray-600 text-sm mb-4">Manage multiple participants and oversee their care services.</p>
                <div className="flex items-center text-[#2D5A4A] font-medium">
                  Family Dashboard <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              {/* OT Portal */}
              <Link href="/ot/dashboard" className="group bg-[#F5F2ED] rounded-xl p-6 border-2 border-transparent hover:border-[#2D5A4A] transition-all">
                <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">OT / Therapist</h3>
                <p className="text-gray-600 text-sm mb-4">Client management, NDIS estimation tool, and scheduling.</p>
                <div className="flex items-center text-[#2D5A4A] font-medium">
                  OT Dashboard <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              {/* Provider Portal */}
              <Link href="/providers" className="group bg-[#F5F2ED] rounded-xl p-6 border-2 border-transparent hover:border-[#2D5A4A] transition-all">
                <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Provider</h3>
                <p className="text-gray-600 text-sm mb-4">Manage jobs, track time, and handle invoicing.</p>
                <div className="flex items-center text-[#2D5A4A] font-medium">
                  Provider Portal <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-center mb-6">Quick Links</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/partners" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#E8F0ED] transition-colors">
                  <Heart className="w-4 h-4 text-[#2D5A4A]" />
                  <span>Partners Directory</span>
                </Link>
                <Link href="/ot/estimation" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#E8F0ED] transition-colors">
                  <Calculator className="w-4 h-4 text-[#2D5A4A]" />
                  <span>NDIS Estimation Tool</span>
                </Link>
                <Link href="/invoices" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#E8F0ED] transition-colors">
                  <FileText className="w-4 h-4 text-[#2D5A4A]" />
                  <span>Invoices</span>
                </Link>
                <Link href="/bookings" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#E8F0ED] transition-colors">
                  <Calendar className="w-4 h-4 text-[#2D5A4A]" />
                  <span>My Bookings</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#E8F0ED] transition-colors">
                  <Settings className="w-4 h-4 text-[#2D5A4A]" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#F5F2ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8">Join thousands of NDIS participants finding fair-priced, quality care.</p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E07850] text-white rounded-lg hover:bg-[#C96040] transition-colors text-lg"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1B4D3E] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#2D5A4A] font-bold text-sm">VC</div>
                  <span className="font-semibold">Verified Care</span>
                </div>
                <p className="text-white/70 text-sm">Connecting NDIS participants with verified providers at fair prices.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Participants</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><button onClick={() => setCurrentView('search')} className="hover:text-white">Find Providers</button></li>
                  <li><a href="#" className="hover:text-white">How It Works</a></li>
                  <li><a href="#" className="hover:text-white">NDIS Guide</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Providers</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><button onClick={() => setCurrentView('provider-portal')} className="hover:text-white">Provider Portal</button></li>
                  <li><a href="#" className="hover:text-white">Requirements</a></li>
                  <li><a href="#" className="hover:text-white">Platform Fees</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><a href="#" className="hover:text-white">Help Centre</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
              2026 Verified Care. All rights reserved. Built with care for the NDIS community.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Dashboard (Participant View)
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#2D5A4A] rounded-lg flex items-center justify-center text-white font-bold text-sm">VC</div>
              <span className="text-lg font-semibold">Verified Care</span>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#E8F0ED] text-[#2D5A4A] font-medium">
              <Home className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => setCurrentView('search')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <Search className="w-5 h-5" /> Find Providers
            </button>
            <button onClick={() => setCurrentView('bookings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <Calendar className="w-5 h-5" /> My Bookings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <FileText className="w-5 h-5" /> Invoices
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <Settings className="w-5 h-5" /> Settings
            </button>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button onClick={() => setCurrentView('landing')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Emma!</h1>
              <p className="text-gray-600">Here's what's happening with your services</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white font-medium">
                EM
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-6 overflow-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-3xl font-bold text-[#2D5A4A]">$2,450</div>
                <div className="text-gray-600 text-sm mt-1">Budget Remaining</div>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" /> 12% saved
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-3xl font-bold text-[#2D5A4A]">3</div>
                <div className="text-gray-600 text-sm mt-1">Upcoming Bookings</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-3xl font-bold text-[#E07850]">1</div>
                <div className="text-gray-600 text-sm mt-1">Needs Confirmation</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-3xl font-bold text-[#2D5A4A]">85</div>
                <div className="text-gray-600 text-sm mt-1">Avg Fair Price Score</div>
              </div>
            </div>

            {/* Action Required Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                <div>
                  <div className="font-medium text-orange-800">Action Required</div>
                  <div className="text-orange-700 text-sm">Please confirm your cleaning service from last week to process the invoice.</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] transition-colors">
                Confirm Service
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 mb-6">
              <button onClick={() => setCurrentView('search')} className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
                <Plus className="w-4 h-4" /> Book New Service
              </button>
              <button onClick={() => setCurrentView('bookings')} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Calendar className="w-4 h-4" /> View All Bookings
              </button>
            </div>

            {/* Upcoming Bookings */}
            <h2 className="text-lg font-semibold mb-4">Upcoming Bookings</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {bookings.filter(b => b.status !== 'needs_confirmation').slice(0, 2).map(booking => (
                <div key={booking.id} className="bg-white rounded-xl p-5 border border-gray-200 border-l-4 border-l-[#2D5A4A]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold">{booking.service}</div>
                      <div className="text-gray-600 text-sm">{booking.provider}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {booking.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Providers */}
            <h2 className="text-lg font-semibold mb-4">Your Providers</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {providers.slice(0, 3).map(provider => (
                <div key={provider.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] font-semibold">
                      {provider.initials}
                    </div>
                    <div>
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-sm text-gray-600">{provider.service}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-gray-900">{provider.rating}</span>
                    </div>
                    <button className="text-[#2D5A4A] text-sm font-medium hover:underline">Book Again</button>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
            <button className="flex flex-col items-center gap-1 text-[#2D5A4A]">
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </button>
            <button onClick={() => setCurrentView('search')} className="flex flex-col items-center gap-1 text-gray-500">
              <Search className="w-5 h-5" />
              <span className="text-xs">Search</span>
            </button>
            <button onClick={() => setCurrentView('bookings')} className="flex flex-col items-center gap-1 text-gray-500">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Bookings</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500">
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </button>
          </nav>
        </div>
      </div>
    );
  }

  // Provider Search
  if (currentView === 'search') {
    return (
      <div className="min-h-screen bg-[#F5F2ED]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2">
                <div className="w-9 h-9 bg-[#2D5A4A] rounded-lg flex items-center justify-center text-white font-bold text-sm">VC</div>
                <span className="text-lg font-semibold hidden sm:block">Verified Care</span>
              </button>
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentView('bookings')} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentView('dashboard')} className="w-9 h-9 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white font-medium text-sm">
                  EM
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold mb-6">Find Providers</h1>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A] focus:border-transparent"
              />
            </div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
            >
              <option value="all">All Services</option>
              <option value="cleaning">Domestic Cleaning</option>
              <option value="transport">Community Transport</option>
              <option value="yard">Yard Maintenance</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]">
              <option>All Locations</option>
              <option>VIC</option>
              <option>NSW</option>
              <option>QLD</option>
              <option>SA</option>
              <option>WA</option>
              <option>TAS</option>
              <option>NT</option>
              <option>ACT</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button className="px-3 py-1 bg-[#E8F0ED] text-[#2D5A4A] rounded-full text-sm font-medium">Under NDIS Cap</button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Available This Week</button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">4+ Stars</button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Fair Score 80+</button>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-4">
            {providers.map(provider => (
              <div key={provider.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] font-semibold text-lg flex-shrink-0">
                    {provider.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg">{provider.name}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span>
                    </div>
                    <div className="text-gray-600 text-sm">{provider.service}</div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin className="w-4 h-4" /> {provider.location}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-gray-500 text-sm">({provider.reviews})</span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        ${provider.rate}/hr <span className="text-gray-400">(Cap: ${provider.ndisCap})</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl ${getFairScoreColor(provider.score)}`}>
                    <span className="text-2xl font-bold">{provider.score}</span>
                    <span className="text-xs uppercase tracking-wide">Fair Price</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] transition-colors font-medium">
                    Book Now
                  </button>
                  <button className="flex-1 py-2 border border-[#2D5A4A] text-[#2D5A4A] rounded-lg hover:bg-[#E8F0ED] transition-colors font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
          <button onClick={() => setCurrentView('dashboard')} className="flex flex-col items-center gap-1 text-gray-500">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#2D5A4A]">
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </button>
          <button onClick={() => setCurrentView('bookings')} className="flex flex-col items-center gap-1 text-gray-500">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Bookings</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </nav>
      </div>
    );
  }

  // Bookings
  if (currentView === 'bookings') {
    return (
      <div className="min-h-screen bg-[#F5F2ED]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2">
                <div className="w-9 h-9 bg-[#2D5A4A] rounded-lg flex items-center justify-center text-white font-bold text-sm">VC</div>
                <span className="text-lg font-semibold hidden sm:block">Verified Care</span>
              </button>
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentView('search')} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Search className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentView('dashboard')} className="w-9 h-9 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white font-medium text-sm">
                  EM
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Bookings</h1>
            <button onClick={() => setCurrentView('search')} className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
              <Plus className="w-4 h-4" /> New Booking
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button className="pb-3 px-1 text-[#2D5A4A] font-medium border-b-2 border-[#2D5A4A]">Upcoming</button>
            <button className="pb-3 px-1 text-gray-500 hover:text-gray-700">Past</button>
            <button className="pb-3 px-1 text-gray-500 hover:text-gray-700">Cancelled</button>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {bookings.map(booking => (
              <div
                key={booking.id}
                className={`bg-white rounded-xl p-5 border border-gray-200 border-l-4 ${
                  booking.status === 'needs_confirmation' ? 'border-l-orange-500' :
                  booking.status === 'pending' ? 'border-l-yellow-500' : 'border-l-[#2D5A4A]'
                } hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">{booking.service}</div>
                    <div className="text-gray-600">{booking.provider}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {booking.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.time}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${booking.amount}</span>
                </div>
                <div className="flex gap-2">
                  {booking.status === 'needs_confirmation' && (
                    <button className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
                      Confirm Service
                    </button>
                  )}
                  {booking.status === 'confirmed' && (
                    <>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Reschedule</button>
                      <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">Cancel</button>
                    </>
                  )}
                  {booking.status === 'pending' && (
                    <button className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
                      Confirm Booking
                    </button>
                  )}
                  <button className="px-4 py-2 text-[#2D5A4A] hover:underline ml-auto">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
          <button onClick={() => setCurrentView('dashboard')} className="flex flex-col items-center gap-1 text-gray-500">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => setCurrentView('search')} className="flex flex-col items-center gap-1 text-gray-500">
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#2D5A4A]">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Bookings</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </nav>
      </div>
    );
  }

  // Provider Portal
  if (currentView === 'provider-portal') {
    return (
      <div className="min-h-screen bg-[#F5F2ED]">
        {/* Provider Header */}
        <header className="bg-[#2D5A4A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-[#2D5A4A] font-bold text-sm">VC</div>
                <span className="text-lg font-semibold">Provider Portal</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/10 rounded-lg">
                  <Bell className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentView('landing')} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-medium text-sm">
                  SC
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
          {/* Provider Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-3xl font-bold text-[#2D5A4A]">$1,245</div>
              <div className="text-gray-600 text-sm mt-1">This Week</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-3xl font-bold text-[#2D5A4A]">12</div>
              <div className="text-gray-600 text-sm mt-1">Jobs Completed</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-3xl font-bold text-[#2D5A4A]">4.9</div>
              <div className="text-gray-600 text-sm mt-1">Rating</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-3xl font-bold text-green-600">92</div>
              <div className="text-gray-600 text-sm mt-1">Fair Price Score</div>
            </div>
          </div>

          {/* Current Job */}
          <h2 className="text-lg font-semibold mb-4">Current Job</h2>
          <div className="bg-white rounded-xl p-6 border-2 border-[#2D5A4A] mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">In Progress</span>
              </div>
              <div className="text-2xl font-mono font-bold text-[#2D5A4A]">01:45:23</div>
            </div>
            <div className="mb-4">
              <div className="text-xl font-semibold">Domestic Cleaning</div>
              <div className="text-gray-600">Emma Johnson</div>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
              <span>123 Smith Street, Melbourne VIC 3000</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-[#E07850] text-white rounded-lg hover:bg-[#C96040] font-medium flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" /> Check Out
              </button>
              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Phone className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-3">GPS verification required within 50m of service location</p>
          </div>

          {/* Today's Jobs */}
          <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
          <div className="space-y-4 mb-6">
            {providerJobs.map(job => (
              <div key={job.id} className={`bg-white rounded-xl p-5 border border-gray-200 ${job.status === 'in_progress' ? 'border-l-4 border-l-blue-500' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold">{job.service}</div>
                    <div className="text-gray-600">{job.participant}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                    {getStatusText(job.status)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.address}</span>
                </div>
                {job.status === 'upcoming' && (
                  <button className="w-full py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] font-medium">
                    Check In
                  </button>
                )}
                {job.status === 'in_progress' && (
                  <div className="text-sm text-blue-600 font-medium">Duration: {job.duration}</div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow text-left">
              <CreditCard className="w-6 h-6 text-[#2D5A4A] mb-3" />
              <div className="font-medium">Earnings</div>
              <div className="text-sm text-gray-600">View payouts</div>
            </button>
            <button className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow text-left">
              <FileText className="w-6 h-6 text-[#2D5A4A] mb-3" />
              <div className="font-medium">Documents</div>
              <div className="text-sm text-gray-600">Upload & verify</div>
            </button>
            <button className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow text-left">
              <Calendar className="w-6 h-6 text-[#2D5A4A] mb-3" />
              <div className="font-medium">Availability</div>
              <div className="text-sm text-gray-600">Set schedule</div>
            </button>
            <button className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow text-left">
              <HelpCircle className="w-6 h-6 text-[#2D5A4A] mb-3" />
              <div className="font-medium">Support</div>
              <div className="text-sm text-gray-600">Get help</div>
            </button>
          </div>
        </main>

        {/* Provider Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
          <button className="flex flex-col items-center gap-1 text-[#2D5A4A]">
            <Home className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Jobs</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <CreditCard className="w-5 h-5" />
            <span className="text-xs">Earnings</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <FileText className="w-5 h-5" />
            <span className="text-xs">Docs</span>
          </button>
        </nav>
      </div>
    );
  }

  return null;
}
