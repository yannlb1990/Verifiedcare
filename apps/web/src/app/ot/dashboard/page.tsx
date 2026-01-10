'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  Users, Calendar, ClipboardList, Clock, TrendingUp, AlertCircle,
  ChevronRight, Plus, FileText, CheckCircle, Bell
} from 'lucide-react';

// Demo data
const clients = [
  { id: '1', name: 'Emma Johnson', initials: 'EJ', nextAppointment: 'Today, 10:00 AM', lastSeen: '2 weeks ago', status: 'active', pendingFollowUps: 1 },
  { id: '2', name: 'Michael Chen', initials: 'MC', nextAppointment: 'Tomorrow, 2:00 PM', lastSeen: '1 week ago', status: 'active', pendingFollowUps: 0 },
  { id: '3', name: 'Sarah Williams', initials: 'SW', nextAppointment: 'Thu, 11:00 AM', lastSeen: '3 days ago', status: 'active', pendingFollowUps: 2 },
  { id: '4', name: 'James Brown', initials: 'JB', nextAppointment: 'Next Monday', lastSeen: '1 month ago', status: 'review', pendingFollowUps: 1 },
];

const todayAppointments = [
  { id: 1, client: 'Emma Johnson', clientInitials: 'EJ', time: '10:00 AM - 11:30 AM', type: 'Assessment', location: 'Home Visit', status: 'upcoming' },
  { id: 2, client: 'John Smith', clientInitials: 'JS', time: '1:00 PM - 2:00 PM', type: 'Follow-up', location: 'Clinic', status: 'upcoming' },
  { id: 3, client: 'Mary Davis', clientInitials: 'MD', time: '3:30 PM - 4:30 PM', type: 'Review', location: 'Video Call', status: 'upcoming' },
];

const pendingFollowUps = [
  { id: 1, client: 'Emma Johnson', task: 'Equipment recommendation report', dueDate: 'Due today', priority: 'high' },
  { id: 2, client: 'Sarah Williams', task: 'Home modification assessment', dueDate: 'Due tomorrow', priority: 'medium' },
  { id: 3, client: 'Sarah Williams', task: 'Update functional goals', dueDate: 'Due in 3 days', priority: 'low' },
  { id: 4, client: 'James Brown', task: 'Annual plan review preparation', dueDate: 'Due in 5 days', priority: 'medium' },
];

export default function OTDashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const todayAppointmentCount = todayAppointments.length;
  const pendingCount = pendingFollowUps.length;

  return (
    <DashboardLayout userType="ot" userName="Dr. Smith" userInitials="DS">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#E8F0ED] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#2D5A4A]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#2D5A4A]">{totalClients}</div>
          <div className="text-gray-600 text-sm">Active Clients</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="text-3xl font-bold text-[#2D5A4A]">{todayAppointmentCount}</div>
          <div className="text-gray-600 text-sm">Today's Appointments</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="text-3xl font-bold text-[#E07850]">{pendingCount}</div>
          <div className="text-gray-600 text-sm">Pending Follow-ups</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="text-3xl font-bold text-[#2D5A4A]">12</div>
          <div className="text-gray-600 text-sm">Assessments This Month</div>
        </div>
      </div>

      {/* Urgent Follow-ups Alert */}
      {pendingFollowUps.filter(f => f.priority === 'high').length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
            <div>
              <div className="font-medium text-orange-800">Urgent Follow-ups</div>
              <div className="text-orange-700 text-sm">
                You have {pendingFollowUps.filter(f => f.priority === 'high').length} high-priority task(s) due today.
              </div>
            </div>
          </div>
          <Link
            href="/ot/follow-ups"
            className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] whitespace-nowrap"
          >
            View Tasks
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/ot/estimation"
          className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]"
        >
          <ClipboardList className="w-4 h-4" /> New Estimation
        </Link>
        <Link
          href="/ot/calendar"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Calendar className="w-4 h-4" /> View Calendar
        </Link>
        <Link
          href="/ot/participants"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Users className="w-4 h-4" /> All Clients
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold">Today's Schedule</h2>
              <Link href="/ot/calendar" className="text-sm text-[#2D5A4A] hover:underline">
                Full Calendar
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] font-medium">
                      {apt.clientInitials}
                    </div>
                    <div>
                      <div className="font-medium">{apt.client}</div>
                      <div className="text-sm text-gray-500">
                        {apt.time} • {apt.type}
                      </div>
                      <div className="text-sm text-gray-400">{apt.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {apt.type}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
              {todayAppointments.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No appointments scheduled for today.
                </div>
              )}
            </div>
          </div>

          {/* Recent Clients */}
          <div className="bg-white rounded-xl border border-gray-200 mt-6 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold">Recent Clients</h2>
              <Link href="/ot/participants" className="text-sm text-[#2D5A4A] hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {clients.slice(0, 4).map((client) => (
                <Link
                  key={client.id}
                  href={`/ot/participants/${client.id}`}
                  className="p-4 hover:bg-gray-50 flex items-center justify-between block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white font-medium">
                      {client.initials}
                    </div>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-gray-500">
                        Next: {client.nextAppointment}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {client.pendingFollowUps > 0 && (
                      <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center">
                        {client.pendingFollowUps}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold">Follow-ups</h2>
              <Link href="/ot/follow-ups" className="text-sm text-[#2D5A4A] hover:underline">
                View All
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {pendingFollowUps.map((followUp) => (
                <div
                  key={followUp.id}
                  className={`p-3 rounded-lg border ${
                    followUp.priority === 'high'
                      ? 'border-red-200 bg-red-50'
                      : followUp.priority === 'medium'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm">{followUp.task}</div>
                      <div className="text-xs text-gray-500 mt-1">{followUp.client}</div>
                    </div>
                    <button className="p-1 hover:bg-white rounded">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className={`text-xs mt-2 ${
                    followUp.priority === 'high' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {followUp.dueDate}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button className="w-full py-2 text-[#2D5A4A] hover:bg-[#E8F0ED] rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Follow-up
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 mt-6 p-4">
            <h3 className="font-semibold mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Assessments</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Follow-ups</span>
                <span className="font-medium">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Reports</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">New Clients</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
