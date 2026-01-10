'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import { Plus, Calendar, Clock, DollarSign, MapPin, CheckCircle, X } from 'lucide-react';

// Demo data
const bookings = [
  { id: 1, service: "Domestic Cleaning", provider: "Sarah's Cleaning", providerInitials: "SC", date: "Mon, 15 Jan 2026", time: "9:00 AM - 12:00 PM", address: "123 Example St, Melbourne VIC", status: "confirmed", amount: 156 },
  { id: 2, service: "Community Transport", provider: "Mike's Transport", providerInitials: "MT", date: "Tue, 16 Jan 2026", time: "2:00 PM - 4:00 PM", address: "Pickup: 123 Example St", status: "confirmed", amount: 130 },
  { id: 3, service: "Yard Maintenance", provider: "Green Thumb Gardens", providerInitials: "GT", date: "Wed, 17 Jan 2026", time: "10:00 AM - 1:00 PM", address: "123 Example St, Melbourne VIC", status: "pending", amount: 174 },
  { id: 4, service: "Domestic Cleaning", provider: "Sarah's Cleaning", providerInitials: "SC", date: "Fri, 12 Jan 2026", time: "9:00 AM - 11:00 AM", address: "123 Example St, Melbourne VIC", status: "needs_confirmation", amount: 104 },
  { id: 5, service: "Community Transport", provider: "Easy Ride Transport", providerInitials: "ER", date: "Mon, 8 Jan 2026", time: "10:00 AM - 12:00 PM", address: "Medical Centre, City VIC", status: "completed", amount: 110 },
  { id: 6, service: "Domestic Cleaning", provider: "Sarah's Cleaning", providerInitials: "SC", date: "Fri, 5 Jan 2026", time: "9:00 AM - 12:00 PM", address: "123 Example St, Melbourne VIC", status: "completed", amount: 156 },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') return ['confirmed', 'pending', 'needs_confirmation'].includes(booking.status);
    if (activeTab === 'past') return booking.status === 'completed';
    return booking.status === 'cancelled';
  });

  const handleConfirmService = (booking: typeof bookings[0]) => {
    setSelectedBooking(booking);
    setShowConfirmModal(true);
  };

  const confirmService = () => {
    if (selectedBooking) {
      setConfirmingId(selectedBooking.id);
      setTimeout(() => {
        setConfirmingId(null);
        setShowConfirmModal(false);
        setSelectedBooking(null);
      }, 1500);
    }
  };

  return (
    <DashboardLayout userName="Emma" userInitials="EM">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Link
          href="/providers"
          className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]"
        >
          <Plus className="w-4 h-4" /> New Booking
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-1 font-medium ${activeTab === 'upcoming' ? 'text-[#2D5A4A] border-b-2 border-[#2D5A4A]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Upcoming ({bookings.filter(b => ['confirmed', 'pending', 'needs_confirmation'].includes(b.status)).length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 px-1 font-medium ${activeTab === 'past' ? 'text-[#2D5A4A] border-b-2 border-[#2D5A4A]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Past ({bookings.filter(b => b.status === 'completed').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 px-1 font-medium ${activeTab === 'cancelled' ? 'text-[#2D5A4A] border-b-2 border-[#2D5A4A]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Cancelled
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map(booking => (
          <div
            key={booking.id}
            className={`bg-white rounded-xl p-5 border border-gray-200 border-l-4 ${
              booking.status === 'needs_confirmation' ? 'border-l-orange-500' :
              booking.status === 'pending' ? 'border-l-yellow-500' :
              booking.status === 'completed' ? 'border-l-green-500' : 'border-l-[#2D5A4A]'
            } hover:shadow-md transition-shadow`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] font-semibold flex-shrink-0">
                  {booking.providerInitials}
                </div>
                <div>
                  <div className="font-semibold text-lg">{booking.service}</div>
                  <div className="text-gray-600">{booking.provider}</div>
                  <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {booking.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4" /> {booking.address}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={booking.status} />
                <div className="text-xl font-bold text-[#2D5A4A]">${booking.amount}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {booking.status === 'needs_confirmation' && (
                <button
                  onClick={() => handleConfirmService(booking)}
                  disabled={confirmingId === booking.id}
                  className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] disabled:bg-gray-400"
                >
                  {confirmingId === booking.id ? 'Confirming...' : 'Confirm Service'}
                </button>
              )}
              {booking.status === 'pending' && (
                <button className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
                  Confirm Booking
                </button>
              )}
              {booking.status === 'confirmed' && (
                <>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                    Cancel
                  </button>
                </>
              )}
              {booking.status === 'completed' && (
                <>
                  <Link
                    href={`/providers/${booking.providerInitials === 'SC' ? '1' : '2'}`}
                    className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]"
                  >
                    Book Again
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Leave Review
                  </button>
                </>
              )}
              <button className="px-4 py-2 text-[#2D5A4A] hover:underline ml-auto">
                View Details
              </button>
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No {activeTab} bookings.</p>
            {activeTab === 'upcoming' && (
              <Link
                href="/providers"
                className="mt-4 inline-block text-[#2D5A4A] hover:underline"
              >
                Find a provider to book a service
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Confirm Service Modal */}
      {showConfirmModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Confirm Service Completion</h2>
              <button onClick={() => setShowConfirmModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="font-semibold">{selectedBooking.service}</div>
              <div className="text-gray-600">{selectedBooking.provider}</div>
              <div className="text-sm text-gray-500 mt-2">{selectedBooking.date} • {selectedBooking.time}</div>
            </div>

            <p className="text-gray-600 mb-6">
              By confirming, you acknowledge that this service was completed as expected. This will allow the provider to generate an invoice.
            </p>

            <div className="space-y-3">
              <button
                onClick={confirmService}
                disabled={confirmingId !== null}
                className="w-full py-3 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] font-medium flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                {confirmingId !== null ? (
                  'Confirming...'
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Yes, Service Was Completed
                  </>
                )}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Report an Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
