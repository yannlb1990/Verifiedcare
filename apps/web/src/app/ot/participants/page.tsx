'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Search, Plus, Calendar, Clock, ChevronRight, Filter, User,
  FileText, AlertCircle
} from 'lucide-react';

const clients = [
  {
    id: '1',
    name: 'Emma Johnson',
    initials: 'EJ',
    ndisNumber: '431234567',
    age: 32,
    condition: 'Multiple Sclerosis',
    lastSeen: '2 weeks ago',
    nextAppointment: 'Today, 10:00 AM',
    status: 'active',
    pendingTasks: 1,
    totalAppointments: 12,
    planEndDate: '2026-06-30',
  },
  {
    id: '2',
    name: 'Michael Chen',
    initials: 'MC',
    ndisNumber: '431234568',
    age: 45,
    condition: 'Stroke Recovery',
    lastSeen: '1 week ago',
    nextAppointment: 'Tomorrow, 2:00 PM',
    status: 'active',
    pendingTasks: 0,
    totalAppointments: 8,
    planEndDate: '2026-08-31',
  },
  {
    id: '3',
    name: 'Sarah Williams',
    initials: 'SW',
    ndisNumber: '431234569',
    age: 28,
    condition: 'Cerebral Palsy',
    lastSeen: '3 days ago',
    nextAppointment: 'Thu, 11:00 AM',
    status: 'active',
    pendingTasks: 2,
    totalAppointments: 15,
    planEndDate: '2026-03-15',
  },
  {
    id: '4',
    name: 'James Brown',
    initials: 'JB',
    ndisNumber: '431234570',
    age: 55,
    condition: 'Spinal Cord Injury',
    lastSeen: '1 month ago',
    nextAppointment: 'Next Monday',
    status: 'review',
    pendingTasks: 1,
    totalAppointments: 6,
    planEndDate: '2026-02-28',
  },
  {
    id: '5',
    name: 'Lisa Taylor',
    initials: 'LT',
    ndisNumber: '431234571',
    age: 40,
    condition: 'Acquired Brain Injury',
    lastSeen: 'New client',
    nextAppointment: 'Wed, 1:00 PM',
    status: 'new',
    pendingTasks: 0,
    totalAppointments: 0,
    planEndDate: '2027-01-15',
  },
];

export default function OTParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'review' | 'new'>('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.ndisNumber.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'new': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isPlanEndingSoon = (planEndDate: string) => {
    const endDate = new Date(planEndDate);
    const today = new Date('2026-01-15');
    const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilEnd <= 60;
  };

  return (
    <DashboardLayout userType="ot" userName="Dr. Smith" userInitials="DS">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-600">Manage your NDIS participant caseload</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or NDIS number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'review', 'new'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                  statusFilter === status
                    ? 'bg-[#2D5A4A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-[#2D5A4A]">{clients.length}</div>
          <div className="text-sm text-gray-600">Total Clients</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{clients.filter(c => c.status === 'active').length}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{clients.filter(c => isPlanEndingSoon(c.planEndDate)).length}</div>
          <div className="text-sm text-gray-600">Plan Review Due</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{clients.filter(c => c.status === 'new').length}</div>
          <div className="text-sm text-gray-600">New Clients</div>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No clients found matching your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredClients.map((client) => (
              <Link
                key={client.id}
                href={`/ot/participants/${client.id}`}
                className="p-4 hover:bg-gray-50 flex items-center justify-between block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white font-bold">
                    {client.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{client.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusBadge(client.status)}`}>
                        {client.status}
                      </span>
                      {client.pendingTasks > 0 && (
                        <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center">
                          {client.pendingTasks}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {client.condition} • {client.age} years
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Next: {client.nextAppointment}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last seen: {client.lastSeen}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isPlanEndingSoon(client.planEndDate) && (
                    <div className="flex items-center gap-1 text-yellow-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Plan review due
                    </div>
                  )}
                  <div className="text-right hidden md:block">
                    <div className="text-sm text-gray-500">NDIS</div>
                    <div className="font-medium">{client.ndisNumber}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
