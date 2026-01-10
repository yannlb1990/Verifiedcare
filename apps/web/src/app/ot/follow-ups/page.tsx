'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  CheckCircle, Circle, Clock, AlertTriangle, Filter, Plus, X,
  Calendar, User, ChevronDown, MoreVertical, Edit, Trash2
} from 'lucide-react';

interface FollowUp {
  id: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  task: string;
  description?: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue';
  category: string;
  createdAt: string;
}

const followUps: FollowUp[] = [
  { id: '1', clientId: '1', clientName: 'Emma Johnson', clientInitials: 'EJ', task: 'Equipment recommendation report', description: 'Complete AT assessment report and submit recommendations', dueDate: '2026-01-15', priority: 'high', status: 'pending', category: 'Report', createdAt: '2026-01-10' },
  { id: '2', clientId: '3', clientName: 'Sarah Williams', clientInitials: 'SW', task: 'Home modification assessment', description: 'Bathroom and kitchen accessibility review', dueDate: '2026-01-16', priority: 'medium', status: 'pending', category: 'Assessment', createdAt: '2026-01-08' },
  { id: '3', clientId: '3', clientName: 'Sarah Williams', clientInitials: 'SW', task: 'Update functional goals', description: 'Review and update NDIS plan goals based on progress', dueDate: '2026-01-18', priority: 'low', status: 'pending', category: 'Planning', createdAt: '2026-01-05' },
  { id: '4', clientId: '4', clientName: 'James Brown', clientInitials: 'JB', task: 'Annual plan review preparation', description: 'Prepare documentation for upcoming plan review meeting', dueDate: '2026-01-20', priority: 'medium', status: 'pending', category: 'Planning', createdAt: '2026-01-12' },
  { id: '5', clientId: '2', clientName: 'Michael Chen', clientInitials: 'MC', task: 'Follow-up phone call', description: 'Check in on mobility aid usage', dueDate: '2026-01-14', priority: 'low', status: 'overdue', category: 'Follow-up', createdAt: '2026-01-07' },
  { id: '6', clientId: '1', clientName: 'Emma Johnson', clientInitials: 'EJ', task: 'Send referral to physio', description: 'Completed', dueDate: '2026-01-10', priority: 'medium', status: 'completed', category: 'Referral', createdAt: '2026-01-03' },
];

const categories = ['All', 'Report', 'Assessment', 'Planning', 'Follow-up', 'Referral'];

export default function FollowUpsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showNewTask, setShowNewTask] = useState(false);
  const [tasks, setTasks] = useState(followUps);

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filter === 'all' || task.status === filter;
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by status (pending/overdue first), then by due date, then by priority
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (a.status !== 'overdue' && b.status === 'overdue') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'overdue': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const stats = {
    total: tasks.filter(t => t.status !== 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    dueToday: tasks.filter(t => t.dueDate === '2026-01-15' && t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <DashboardLayout userType="ot" userName="Dr. Smith" userInitials="DS">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Follow-ups & Tasks</h1>
          <p className="text-gray-600">Track your pending tasks and follow-ups</p>
        </div>
        <button
          onClick={() => setShowNewTask(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]"
        >
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-[#2D5A4A]">{stats.total}</div>
          <div className="text-sm text-gray-600">Open Tasks</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">{stats.dueToday}</div>
          <div className="text-sm text-gray-600">Due Today</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            {(['all', 'pending', 'overdue', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                  filter === f
                    ? 'bg-[#2D5A4A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {sortedTasks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No tasks found matching your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 hover:bg-gray-50 ${task.status === 'completed' ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {getStatusIcon(task.status)}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                          {task.task}
                        </div>
                        {task.description && (
                          <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <User className="w-4 h-4" />
                            {task.clientName}
                          </div>
                          <div className={`flex items-center gap-1 text-sm ${
                            task.status === 'overdue' ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            <Calendar className="w-4 h-4" />
                            {new Date(task.dueDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {task.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] text-xs font-medium">
                          {task.clientInitials}
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">New Task</h2>
              <button onClick={() => setShowNewTask(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option value="">Select client</option>
                  <option value="1">Emma Johnson</option>
                  <option value="2">Michael Chen</option>
                  <option value="3">Sarah Williams</option>
                  <option value="4">James Brown</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Add details..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowNewTask(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
