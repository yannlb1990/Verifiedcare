'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ArrowLeft, Plus, Trash2, Calculator, Download, Save, User,
  Home, Car, Utensils, Shirt, Bath, ChevronDown, ChevronUp, Info
} from 'lucide-react';

// NDIS Support Categories and Items (simplified for demo)
const supportCategories = [
  {
    id: 'daily_living',
    name: 'Assistance with Daily Living',
    icon: Home,
    items: [
      { id: 'personal_care', name: 'Personal Care/Hygiene', unit: 'hour', rate: 62.17 },
      { id: 'meal_prep', name: 'Meal Preparation', unit: 'hour', rate: 62.17 },
      { id: 'household_tasks', name: 'Household Tasks', unit: 'hour', rate: 62.17 },
      { id: 'community_nursing', name: 'Community Nursing', unit: 'hour', rate: 85.00 },
    ],
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: Car,
    items: [
      { id: 'transport_personal', name: 'Transport - Personal Activities', unit: 'hour', rate: 72.50 },
      { id: 'transport_employment', name: 'Transport - Employment', unit: 'hour', rate: 72.50 },
      { id: 'taxi_subsidy', name: 'Taxi/Rideshare Subsidy', unit: 'trip', rate: 50.00 },
    ],
  },
  {
    id: 'social_community',
    name: 'Social & Community Participation',
    icon: Utensils,
    items: [
      { id: 'community_access', name: 'Community Access', unit: 'hour', rate: 62.17 },
      { id: 'group_activities', name: 'Group-Based Activities', unit: 'hour', rate: 25.00 },
      { id: 'social_skills', name: 'Development of Social Skills', unit: 'hour', rate: 65.00 },
    ],
  },
  {
    id: 'equipment',
    name: 'Assistive Technology',
    icon: Shirt,
    items: [
      { id: 'low_cost_at', name: 'Low Cost AT (up to $1,500)', unit: 'item', rate: 1500.00 },
      { id: 'mid_cost_at', name: 'Mid Cost AT ($1,500 - $15,000)', unit: 'item', rate: 15000.00 },
      { id: 'at_assessment', name: 'AT Assessment', unit: 'assessment', rate: 350.00 },
    ],
  },
  {
    id: 'home_mods',
    name: 'Home Modifications',
    icon: Bath,
    items: [
      { id: 'minor_mods', name: 'Minor Home Modifications', unit: 'item', rate: 10000.00 },
      { id: 'major_mods', name: 'Major Home Modifications', unit: 'item', rate: 50000.00 },
      { id: 'ot_assessment', name: 'OT Home Assessment', unit: 'assessment', rate: 450.00 },
    ],
  },
];

interface EstimationItem {
  id: string;
  categoryId: string;
  itemId: string;
  name: string;
  unit: string;
  rate: number;
  quantity: number;
  frequency: 'weekly' | 'fortnightly' | 'monthly' | 'yearly' | 'one-off';
  notes: string;
}

export default function EstimationToolPage() {
  const [clientName, setClientName] = useState('');
  const [planDuration, setPlanDuration] = useState(12); // months
  const [items, setItems] = useState<EstimationItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['daily_living']);

  const addItem = (categoryId: string, item: any) => {
    const newItem: EstimationItem = {
      id: `${Date.now()}`,
      categoryId,
      itemId: item.id,
      name: item.name,
      unit: item.unit,
      rate: item.rate,
      quantity: 1,
      frequency: 'weekly',
      notes: '',
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<EstimationItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateItemTotal = (item: EstimationItem) => {
    const frequencyMultiplier: Record<string, number> = {
      'weekly': 52,
      'fortnightly': 26,
      'monthly': 12,
      'yearly': 1,
      'one-off': 1,
    };
    const yearlyAmount = item.rate * item.quantity * frequencyMultiplier[item.frequency];
    return yearlyAmount * (planDuration / 12);
  };

  const totalEstimate = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <DashboardLayout userType="ot" userName="Dr. Smith" userInitials="DS">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <Link href="/ot/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2D5A4A] mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">NDIS Plan Estimation Tool</h1>
            <p className="text-gray-600">Create funding estimates for participant plans</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
              <Save className="w-4 h-4" /> Save Estimate
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Panel - Support Categories */}
          <div className="md:col-span-2 space-y-4">
            {/* Client Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#2D5A4A]" /> Participant Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Participant Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter participant name"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Duration (months)</label>
                  <select
                    value={planDuration}
                    onChange={(e) => setPlanDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  >
                    <option value={12}>12 months</option>
                    <option value={24}>24 months</option>
                    <option value={36}>36 months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Support Categories */}
            <div className="space-y-3">
              {supportCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E8F0ED] rounded-lg flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-[#2D5A4A]" />
                      </div>
                      <span className="font-semibold">{category.name}</span>
                    </div>
                    {expandedCategories.includes(category.id)
                      ? <ChevronUp className="w-5 h-5 text-gray-400" />
                      : <ChevronDown className="w-5 h-5 text-gray-400" />
                    }
                  </button>

                  {expandedCategories.includes(category.id) && (
                    <div className="border-t border-gray-200 p-4">
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                          >
                            <div>
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-gray-500">
                                ${item.rate.toFixed(2)} / {item.unit}
                              </div>
                            </div>
                            <button
                              onClick={() => addItem(category.id, item)}
                              className="p-2 text-[#2D5A4A] hover:bg-[#E8F0ED] rounded-lg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Estimate Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 sticky top-24">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#2D5A4A]" /> Estimate Summary
                </h2>
              </div>

              {items.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Add support items to build your estimate</p>
                </div>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto">
                  <div className="p-4 space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-sm">{item.name}</div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <label className="text-xs text-gray-500">Qty</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Frequency</label>
                            <select
                              value={item.frequency}
                              onChange={(e) => updateItem(item.id, { frequency: e.target.value as any })}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                            >
                              <option value="weekly">Weekly</option>
                              <option value="fortnightly">Fortnightly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                              <option value="one-off">One-off</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-gray-500">{planDuration} months</span>
                          <span className="font-medium text-[#2D5A4A]">
                            ${calculateItemTotal(item).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="p-4 border-t border-gray-200 bg-[#E8F0ED]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Total Estimate</span>
                  <span className="text-2xl font-bold text-[#2D5A4A]">
                    ${totalEstimate.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  For {planDuration} month plan
                </div>
              </div>

              {/* Info Notice */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    This is an estimate only. Actual NDIS funding may vary based on individual
                    circumstances and plan approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
