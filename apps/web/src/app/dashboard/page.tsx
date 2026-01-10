'use client';

import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  TrendingUp, AlertCircle, Plus, Calendar, Clock, Star, DollarSign
} from 'lucide-react';

// Demo data
const bookings = [
  { id: 1, service: "Domestic Cleaning", provider: "Sarah's Cleaning", date: "Mon, 15 Jan 2026", time: "9:00 AM - 12:00 PM", status: "confirmed", amount: 156 },
  { id: 2, service: "Community Transport", provider: "Mike's Transport", date: "Tue, 16 Jan 2026", time: "2:00 PM - 4:00 PM", status: "confirmed", amount: 130 },
];

const providers = [
  { id: '1', name: "Sarah's Cleaning", service: "Domestic Cleaning", rating: 4.9, initials: "SC" },
  { id: '2', name: "Green Thumb Gardens", service: "Yard Maintenance", rating: 4.7, initials: "GT" },
  { id: '3', name: "Mike's Transport", service: "Community Transport", rating: 4.8, initials: "MT" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout userName="Emma" userInitials="EM">
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
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
          <div>
            <div className="font-medium text-orange-800">Action Required</div>
            <div className="text-orange-700 text-sm">Please confirm your cleaning service from last week to process the invoice.</div>
          </div>
        </div>
        <Link
          href="/bookings"
          className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] transition-colors whitespace-nowrap"
        >
          Confirm Service
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-6">
        <Link
          href="/providers"
          className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]"
        >
          <Plus className="w-4 h-4" /> Book New Service
        </Link>
        <Link
          href="/bookings"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Calendar className="w-4 h-4" /> View All Bookings
        </Link>
      </div>

      {/* Upcoming Bookings */}
      <h2 className="text-lg font-semibold mb-4">Upcoming Bookings</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-xl p-5 border border-gray-200 border-l-4 border-l-[#2D5A4A]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold">{booking.service}</div>
                <div className="text-gray-600 text-sm">{booking.provider}</div>
              </div>
              <StatusBadge status={booking.status} size="sm" />
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {booking.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.time}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[#2D5A4A] font-medium">
                <DollarSign className="w-4 h-4" /> ${booking.amount}
              </span>
              <Link href="/bookings" className="text-sm text-[#2D5A4A] hover:underline">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Providers */}
      <h2 className="text-lg font-semibold mb-4">Your Providers</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {providers.map(provider => (
          <Link
            key={provider.id}
            href={`/providers/${provider.id}`}
            className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
          >
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
              <span className="text-[#2D5A4A] text-sm font-medium">Book Again →</span>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
