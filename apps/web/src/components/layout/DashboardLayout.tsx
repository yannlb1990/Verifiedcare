'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {
  Home, Search, Calendar, FileText, Settings, Bell, LogOut, User,
  Users, Heart, Briefcase
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  userType?: 'participant' | 'provider' | 'family' | 'ot';
  userName?: string;
  userInitials?: string;
}

const participantNavItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/providers', icon: Search, label: 'Find Providers' },
  { href: '/bookings', icon: Calendar, label: 'My Bookings' },
  { href: '/invoices', icon: FileText, label: 'Invoices' },
  { href: '/partners', icon: Heart, label: 'Partners' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const providerNavItems = [
  { href: '/provider-portal', icon: Home, label: 'Dashboard' },
  { href: '/provider-portal/jobs', icon: Calendar, label: 'Jobs' },
  { href: '/provider-portal/earnings', icon: FileText, label: 'Earnings' },
  { href: '/provider-portal/documents', icon: Briefcase, label: 'Documents' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const familyNavItems = [
  { href: '/family/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/family/participants', icon: Users, label: 'Participants' },
  { href: '/providers', icon: Search, label: 'Find Providers' },
  { href: '/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/invoices', icon: FileText, label: 'Invoices' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const otNavItems = [
  { href: '/ot/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/ot/participants', icon: Users, label: 'Participants' },
  { href: '/ot/estimation', icon: Briefcase, label: 'Estimation Tool' },
  { href: '/ot/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/ot/follow-ups', icon: Heart, label: 'Follow-ups' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout({
  children,
  userType = 'participant',
  userName = 'User',
  userInitials = 'U',
}: DashboardLayoutProps) {
  const pathname = usePathname();

  const navItems =
    userType === 'provider' ? providerNavItems :
    userType === 'family' ? familyNavItems :
    userType === 'ot' ? otNavItems :
    participantNavItems;

  const mobileNavItems = navItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#2D5A4A] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              VC
            </div>
            <span className="text-lg font-semibold">Verified Care</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#E8F0ED] text-[#2D5A4A] font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link
              href="/settings"
              className="w-10 h-10 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white font-medium"
            >
              {userInitials}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto pb-24 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around z-50">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 ${
                  isActive ? 'text-[#2D5A4A]' : 'text-gray-500'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
