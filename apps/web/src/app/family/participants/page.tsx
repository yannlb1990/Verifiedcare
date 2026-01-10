'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Users, Plus, Search, DollarSign, Calendar, ChevronRight,
  MoreVertical, Edit, Trash2, UserPlus, X, CheckCircle
} from 'lucide-react';

const participants = [
  {
    id: '1',
    name: 'Emma Johnson',
    relationship: 'Daughter',
    initials: 'EJ',
    ndisNumber: '431234567',
    email: 'emma.j@email.com',
    phone: '0412 345 678',
    address: '123 Example St, Melbourne VIC 3000',
    budgetTotal: 25000,
    budgetUsed: 12450,
    planStartDate: '2025-07-01',
    planEndDate: '2026-06-30',
    upcomingBookings: 3,
    completedServices: 24,
    status: 'active',
  },
  {
    id: '2',
    name: 'Michael Johnson',
    relationship: 'Son',
    initials: 'MJ',
    ndisNumber: '431234568',
    email: 'michael.j@email.com',
    phone: '0412 345 679',
    address: '456 Sample Ave, Melbourne VIC 3001',
    budgetTotal: 18000,
    budgetUsed: 5200,
    planStartDate: '2025-09-01',
    planEndDate: '2026-08-31',
    upcomingBookings: 1,
    completedServices: 8,
    status: 'active',
  },
];

export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    relationship: '',
    ndisNumber: '',
    email: '',
    phone: '',
  });

  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ndisNumber.includes(searchQuery)
  );

  return (
    <DashboardLayout userType="family" userName="Sarah" userInitials="SJ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Participants</h1>
          <p className="text-gray-600">Manage the NDIS participants you care for</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]"
        >
          <UserPlus className="w-4 h-4" /> Add Participant
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or NDIS number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
          />
        </div>
      </div>

      {/* Participants Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredParticipants.map((participant) => (
          <div key={participant.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {participant.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{participant.name}</h3>
                    <p className="text-gray-600 text-sm">{participant.relationship}</p>
                    <p className="text-gray-500 text-sm">NDIS: {participant.ndisNumber}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Budget Used</span>
                <span className="text-sm font-medium">
                  ${participant.budgetUsed.toLocaleString()} / ${participant.budgetTotal.toLocaleString()}
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2D5A4A] rounded-full"
                  style={{ width: `${(participant.budgetUsed / participant.budgetTotal) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                ${(participant.budgetTotal - participant.budgetUsed).toLocaleString()} remaining
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-[#2D5A4A]">{participant.upcomingBookings}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-[#2D5A4A]">{participant.completedServices}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <Link
                href={`/family/participants/${participant.id}`}
                className="flex-1 py-2 text-center bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] font-medium"
              >
                View Details
              </Link>
              <Link
                href="/providers"
                className="flex-1 py-2 text-center border border-[#2D5A4A] text-[#2D5A4A] rounded-lg hover:bg-[#E8F0ED] font-medium"
              >
                Book Service
              </Link>
            </div>
          </div>
        ))}

        {/* Add Participant Card */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-gray-500 hover:border-[#2D5A4A] hover:text-[#2D5A4A] transition-colors min-h-[300px]"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <div className="font-semibold text-lg">Add New Participant</div>
          <div className="text-sm mt-1">Link another NDIS participant to your account</div>
        </button>
      </div>

      {/* Add Participant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Participant</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  placeholder="Enter participant's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <select
                  value={newParticipant.relationship}
                  onChange={(e) => setNewParticipant({ ...newParticipant, relationship: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                >
                  <option value="">Select relationship</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="spouse">Spouse/Partner</option>
                  <option value="sibling">Sibling</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NDIS Number</label>
                <input
                  type="text"
                  value={newParticipant.ndisNumber}
                  onChange={(e) => setNewParticipant({ ...newParticipant, ndisNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  placeholder="e.g., 431234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={newParticipant.email}
                  onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  placeholder="participant@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  value={newParticipant.phone}
                  onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  placeholder="0412 345 678"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                <div className="font-medium mb-1">Verification Required</div>
                <p>
                  After adding, the participant (or their existing account holder) will need to approve
                  your access request.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle add participant
                  setShowAddModal(false);
                }}
                className="flex-1 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] font-medium"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
