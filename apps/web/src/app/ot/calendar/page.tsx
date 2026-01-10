'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ChevronLeft, ChevronRight, Plus, Filter, User, MapPin, Clock,
  Video, Home as HomeIcon, Building, X
} from 'lucide-react';

// Demo data for appointments
const appointments = [
  { id: 1, date: '2026-01-15', time: '09:00', endTime: '10:30', client: 'Emma Johnson', clientId: '1', type: 'Assessment', location: 'Home Visit', address: '123 Example St, Melbourne', color: 'blue' },
  { id: 2, date: '2026-01-15', time: '11:00', endTime: '12:00', client: 'Michael Chen', clientId: '2', type: 'Follow-up', location: 'Clinic', address: 'Suite 5, Medical Centre', color: 'green' },
  { id: 3, date: '2026-01-15', time: '14:00', endTime: '15:00', client: 'Sarah Williams', clientId: '3', type: 'Review', location: 'Video Call', address: '', color: 'purple' },
  { id: 4, date: '2026-01-16', time: '10:00', endTime: '11:30', client: 'James Brown', clientId: '4', type: 'Assessment', location: 'Home Visit', address: '456 Sample Ave, Melbourne', color: 'blue' },
  { id: 5, date: '2026-01-17', time: '09:30', endTime: '10:30', client: 'Emma Johnson', clientId: '1', type: 'Follow-up', location: 'Clinic', address: 'Suite 5, Medical Centre', color: 'green' },
  { id: 6, date: '2026-01-17', time: '13:00', endTime: '14:00', client: 'Lisa Taylor', clientId: '5', type: 'Initial Consult', location: 'Video Call', address: '', color: 'orange' },
];

const clients = [
  { id: '1', name: 'Emma Johnson', initials: 'EJ' },
  { id: '2', name: 'Michael Chen', initials: 'MC' },
  { id: '3', name: 'Sarah Williams', initials: 'SW' },
  { id: '4', name: 'James Brown', initials: 'JB' },
  { id: '5', name: 'Lisa Taylor', initials: 'LT' },
];

export default function OTCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 15)); // Jan 15, 2026
  const [view, setView] = useState<'week' | 'day'>('week');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return appointments.filter(apt => {
      const matchesDate = apt.date === dateStr;
      const matchesClient = !selectedClient || apt.clientId === selectedClient;
      return matchesDate && matchesClient;
    });
  };

  const getLocationIcon = (location: string) => {
    if (location.includes('Video')) return Video;
    if (location.includes('Home')) return HomeIcon;
    return Building;
  };

  const getTypeColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
      orange: 'bg-orange-100 border-orange-300 text-orange-800',
    };
    return colors[color] || colors.blue;
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM

  return (
    <DashboardLayout userType="ot" userName="Dr. Smith" userInitials="DS">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-gray-600">Manage your appointments and schedule</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedClient || ''}
            onChange={(e) => setSelectedClient(e.target.value || null)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
          >
            <option value="">All Clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowNewAppointment(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]"
          >
            <Plus className="w-4 h-4" /> New Appointment
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {weekDays[0].toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-lg text-sm ${view === 'week' ? 'bg-[#2D5A4A] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 rounded-lg text-sm ${view === 'day' ? 'bg-[#2D5A4A] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Day
            </button>
          </div>
        </div>

        {/* Week View */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-2 text-center text-sm text-gray-500"></div>
              {weekDays.map((day, idx) => {
                const isToday = formatDate(day) === formatDate(new Date(2026, 0, 15));
                return (
                  <div
                    key={idx}
                    className={`p-2 text-center border-l border-gray-200 ${isToday ? 'bg-[#E8F0ED]' : ''}`}
                  >
                    <div className="text-sm text-gray-500">
                      {day.toLocaleDateString('en-AU', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg font-semibold ${isToday ? 'text-[#2D5A4A]' : ''}`}>
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            <div className="relative">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
                  <div className="p-2 text-sm text-gray-500 text-right pr-4">
                    {hour}:00
                  </div>
                  {weekDays.map((day, dayIdx) => {
                    const dayAppts = getAppointmentsForDate(day).filter(
                      apt => parseInt(apt.time.split(':')[0]) === hour
                    );
                    return (
                      <div
                        key={dayIdx}
                        className="border-l border-gray-200 min-h-[60px] relative p-1"
                      >
                        {dayAppts.map((apt) => (
                          <div
                            key={apt.id}
                            className={`p-2 rounded-lg border text-xs mb-1 cursor-pointer hover:shadow-md transition-shadow ${getTypeColor(apt.color)}`}
                          >
                            <div className="font-medium">{apt.client}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {apt.time} - {apt.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              {(() => {
                                const Icon = getLocationIcon(apt.location);
                                return <Icon className="w-3 h-3" />;
                              })()}
                              {apt.location}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold mb-4">This Week's Appointments</h2>
        <div className="space-y-3">
          {appointments
            .filter(apt => {
              const aptDate = new Date(apt.date);
              return aptDate >= weekDays[0] && aptDate <= weekDays[6];
            })
            .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
            .map((apt) => {
              const Icon = getLocationIcon(apt.location);
              return (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white font-medium">
                      {clients.find(c => c.id === apt.clientId)?.initials}
                    </div>
                    <div>
                      <div className="font-medium">{apt.client}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(apt.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                        {' • '}{apt.time} - {apt.endTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getTypeColor(apt.color)}`}>
                        {apt.type}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Icon className="w-3 h-3" /> {apt.location}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">New Appointment</h2>
              <button onClick={() => setShowNewAppointment(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option value="">Select client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input type="time" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input type="time" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>Assessment</option>
                  <option>Follow-up</option>
                  <option>Review</option>
                  <option>Initial Consult</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>Home Visit</option>
                  <option>Clinic</option>
                  <option>Video Call</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowNewAppointment(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
                Create Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
