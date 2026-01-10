'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  Users, Plus, Calendar, Clock, DollarSign, TrendingUp, AlertCircle,
  User, ChevronRight, Star, Bell
} from 'lucide-react';

// Demo data - participants managed by this family member
const participants = [
  {
    id: '1',
    name: 'Emma Johnson',
    relationship: 'Daughter',
    initials: 'EJ',
    ndisNumber: '431234567',
    budgetTotal: 25000,
    budgetUsed: 12450,
    upcomingBookings: 3,
    needsAction: 1,
    lastActivity: '2 hours ago',
  },
  {
    id: '2',
    name: 'Michael Johnson',
    relationship: 'Son',
    initials: 'MJ',
    ndisNumber: '431234568',
    budgetTotal: 18000,
    budgetUsed: 5200,
    upcomingBookings: 1,
    needsAction: 0,
    lastActivity: 'Yesterday',
  },
];

const recentBookings = [
  { id: 1, participant: 'Emma', service: "Domestic Cleaning", provider: "Sarah's Cleaning", date: "Mon, 15 Jan", status: "confirmed" },
  { id: 2, participant: 'Emma', service: "Community Transport", provider: "Mike's Transport", date: "Tue, 16 Jan", status: "confirmed" },
  { id: 3, participant: 'Michael', service: "Yard Maintenance", provider: "Green Thumb", date: "Wed, 17 Jan", status: "pending" },
  { id: 4, participant: 'Emma', service: "Domestic Cleaning", provider: "Sarah's Cleaning", date: "Fri, 12 Jan", status: "needs_confirmation" },
];

export default function FamilyDashboardPage() {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  const totalBudget = participants.reduce((sum, p) => sum + p.budgetTotal, 0);
  const totalUsed = participants.reduce((sum, p) => sum + p.budgetUsed, 0);
  const totalUpcoming = participants.reduce((sum, p) => sum + p.upcomingBookings, 0);
  const totalNeedsAction = participants.reduce((sum, p) => sum + p.needsAction, 0);

  const filteredBookings = selectedParticipant
    ? recentBookings.filter(b => b.participant.toLowerCase() === participants.find(p => p.id === selectedParticipant)?.name.split(' ')[0].toLowerCase())
    : recentBookings;

  return (
    <DashboardLayout userType="family" userName="Sarah" userInitials="SJ">
      {/* Family Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#E8F0ED] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#2D5A4A]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#2D5A4A]">{participants.length}</div>
          <div className="text-gray-600 text-sm">Participants</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="text-3xl font-bold text-[#2D5A4A]">${(totalBudget - totalUsed).toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Total Budget Remaining</div>
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <TrendingUp className="w-4 h-4" /> {Math.round(((totalBudget - totalUsed) / totalBudget) * 100)}% available
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="text-3xl font-bold text-[#2D5A4A]">{totalUpcoming}</div>
          <div className="text-gray-600 text-sm">Upcoming Bookings</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="text-3xl font-bold text-[#E07850]">{totalNeedsAction}</div>
          <div className="text-gray-600 text-sm">Needs Action</div>
        </div>
      </div>

      {/* Action Required Alert */}
      {totalNeedsAction > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
            <div>
              <div className="font-medium text-orange-800">Action Required</div>
              <div className="text-orange-700 text-sm">
                {totalNeedsAction} service(s) need confirmation across your participants.
              </div>
            </div>
          </div>
          <Link
            href="/bookings"
            className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] transition-colors whitespace-nowrap"
          >
            Review Now
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Participants List */}
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Participants</h2>
            <button className="p-2 text-[#2D5A4A] hover:bg-[#E8F0ED] rounded-lg">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* All Participants filter */}
            <button
              onClick={() => setSelectedParticipant(null)}
              className={`w-full p-4 rounded-xl border text-left transition-colors ${
                !selectedParticipant
                  ? 'border-[#2D5A4A] bg-[#E8F0ED]'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">All Participants</div>
                  <div className="text-sm text-gray-500">{participants.length} people</div>
                </div>
              </div>
            </button>

            {participants.map((participant) => (
              <button
                key={participant.id}
                onClick={() => setSelectedParticipant(participant.id)}
                className={`w-full p-4 rounded-xl border text-left transition-colors ${
                  selectedParticipant === participant.id
                    ? 'border-[#2D5A4A] bg-[#E8F0ED]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white font-medium">
                      {participant.initials}
                    </div>
                    <div>
                      <div className="font-medium">{participant.name}</div>
                      <div className="text-sm text-gray-500">{participant.relationship}</div>
                    </div>
                  </div>
                  {participant.needsAction > 0 && (
                    <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center">
                      {participant.needsAction}
                    </span>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Budget remaining</span>
                    <span className="font-medium text-[#2D5A4A]">
                      ${(participant.budgetTotal - participant.budgetUsed).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-[#2D5A4A] rounded-full"
                      style={{ width: `${(participant.budgetUsed / participant.budgetTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}

            {/* Add Participant Button */}
            <button className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-[#2D5A4A] hover:text-[#2D5A4A] flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Participant
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Quick Actions */}
          <div className="flex gap-3 mb-6">
            <Link
              href="/providers"
              className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]"
            >
              <Plus className="w-4 h-4" /> Book Service
            </Link>
            <Link
              href="/bookings"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Calendar className="w-4 h-4" /> View All Bookings
            </Link>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold">
                {selectedParticipant
                  ? `${participants.find(p => p.id === selectedParticipant)?.name}'s Bookings`
                  : 'All Recent Bookings'}
              </h2>
              <Link href="/bookings" className="text-sm text-[#2D5A4A] hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] text-sm font-medium">
                      {booking.participant.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{booking.service}</div>
                      <div className="text-sm text-gray-500">
                        {booking.provider} • {booking.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={booking.status} size="sm" />
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Participant Detail (when selected) */}
          {selectedParticipant && (
            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
              {(() => {
                const participant = participants.find(p => p.id === selectedParticipant);
                if (!participant) return null;
                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {participant.initials}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{participant.name}</h2>
                          <p className="text-gray-600">{participant.relationship} • NDIS: {participant.ndisNumber}</p>
                        </div>
                      </div>
                      <Link
                        href={`/family/participants/${participant.id}`}
                        className="px-4 py-2 border border-[#2D5A4A] text-[#2D5A4A] rounded-lg hover:bg-[#E8F0ED]"
                      >
                        View Profile
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-[#2D5A4A]">
                          ${(participant.budgetTotal - participant.budgetUsed).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Budget Remaining</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-[#2D5A4A]">{participant.upcomingBookings}</div>
                        <div className="text-sm text-gray-600">Upcoming</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-600">{participant.lastActivity}</div>
                        <div className="text-sm text-gray-600">Last Activity</div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
