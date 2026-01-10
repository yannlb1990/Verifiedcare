'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  User, Bell, Shield, CreditCard, MapPin, Phone, Mail, Lock,
  Eye, EyeOff, Check, ChevronRight, Save, Camera
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'payment' | 'ndis'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  // Form states
  const [profile, setProfile] = useState({
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@example.com',
    phone: '0412 345 678',
    address: '123 Example Street',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailInvoices: true,
    emailMarketing: false,
    smsBookings: true,
    smsReminders: true,
    pushNotifications: true,
  });

  const [ndisSettings, setNdisSettings] = useState({
    ndisNumber: '431234567',
    planManager: 'Self-managed',
    planStartDate: '2025-07-01',
    planEndDate: '2026-06-30',
    totalBudget: 25000,
    usedBudget: 12450,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'ndis', label: 'NDIS Plan', icon: Shield },
  ];

  return (
    <DashboardLayout userName="Emma" userInitials="EM">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Success Message */}
      {savedMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <Check className="w-5 h-5" />
          {savedMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-100 last:border-0 ${
                  activeTab === tab.id
                    ? 'bg-[#E8F0ED] text-[#2D5A4A] font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-[#2D5A4A] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  EM
                </div>
                <div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Change Photo
                  </button>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" /> Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" /> Street Address
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suburb</label>
                  <input
                    type="text"
                    value={profile.suburb}
                    onChange={(e) => setProfile({ ...profile, suburb: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    >
                      <option>VIC</option>
                      <option>NSW</option>
                      <option>QLD</option>
                      <option>SA</option>
                      <option>WA</option>
                      <option>TAS</option>
                      <option>NT</option>
                      <option>ACT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                    <input
                      type="text"
                      value={profile.postcode}
                      onChange={(e) => setProfile({ ...profile, postcode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] flex items-center gap-2 disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#2D5A4A]" /> Email Notifications
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <div className="font-medium">Booking Updates</div>
                        <div className="text-sm text-gray-500">Receive emails about booking confirmations and changes</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailBookings}
                        onChange={(e) => setNotifications({ ...notifications, emailBookings: e.target.checked })}
                        className="w-5 h-5 text-[#2D5A4A] rounded focus:ring-[#2D5A4A]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <div className="font-medium">Invoice Notifications</div>
                        <div className="text-sm text-gray-500">Receive emails about new invoices and payment reminders</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailInvoices}
                        onChange={(e) => setNotifications({ ...notifications, emailInvoices: e.target.checked })}
                        className="w-5 h-5 text-[#2D5A4A] rounded focus:ring-[#2D5A4A]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <div className="font-medium">Marketing & Tips</div>
                        <div className="text-sm text-gray-500">Receive helpful tips and platform updates</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailMarketing}
                        onChange={(e) => setNotifications({ ...notifications, emailMarketing: e.target.checked })}
                        className="w-5 h-5 text-[#2D5A4A] rounded focus:ring-[#2D5A4A]"
                      />
                    </label>
                  </div>
                </div>

                {/* SMS Notifications */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#2D5A4A]" /> SMS Notifications
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <div className="font-medium">Booking Confirmations</div>
                        <div className="text-sm text-gray-500">Receive SMS when bookings are confirmed</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.smsBookings}
                        onChange={(e) => setNotifications({ ...notifications, smsBookings: e.target.checked })}
                        className="w-5 h-5 text-[#2D5A4A] rounded focus:ring-[#2D5A4A]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <div className="font-medium">Service Reminders</div>
                        <div className="text-sm text-gray-500">Receive SMS reminders before scheduled services</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.smsReminders}
                        onChange={(e) => setNotifications({ ...notifications, smsReminders: e.target.checked })}
                        className="w-5 h-5 text-[#2D5A4A] rounded focus:ring-[#2D5A4A]"
                      />
                    </label>
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#2D5A4A]" /> Push Notifications
                  </h3>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <div className="font-medium">Enable Push Notifications</div>
                      <div className="text-sm text-gray-500">Receive real-time notifications on your device</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                      className="w-5 h-5 text-[#2D5A4A] rounded focus:ring-[#2D5A4A]"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] flex items-center gap-2 disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    />
                  </div>
                  <button className="px-6 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Two-Factor Authentication</h2>
                <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                <button className="px-4 py-2 border border-[#2D5A4A] text-[#2D5A4A] rounded-lg hover:bg-[#E8F0ED]">
                  Enable 2FA
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h2>
                <p className="text-gray-600 mb-4">Permanently delete your account and all associated data</p>
                <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">Payment Methods</h2>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <div className="font-medium">•••• •••• •••• 4242</div>
                        <div className="text-sm text-gray-500">Expires 12/27</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Default</span>
                  </div>
                  <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#2D5A4A] hover:text-[#2D5A4A]">
                    + Add Payment Method
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
                <p className="text-gray-600">Same as profile address</p>
                <button className="mt-4 text-[#2D5A4A] hover:underline">Change billing address</button>
              </div>
            </div>
          )}

          {/* NDIS Tab */}
          {activeTab === 'ndis' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">NDIS Plan Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NDIS Number</label>
                    <input
                      type="text"
                      value={ndisSettings.ndisNumber}
                      onChange={(e) => setNdisSettings({ ...ndisSettings, ndisNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan Management</label>
                    <select
                      value={ndisSettings.planManager}
                      onChange={(e) => setNdisSettings({ ...ndisSettings, planManager: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    >
                      <option>Self-managed</option>
                      <option>Plan-managed</option>
                      <option>NDIA-managed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan Start Date</label>
                    <input
                      type="date"
                      value={ndisSettings.planStartDate}
                      onChange={(e) => setNdisSettings({ ...ndisSettings, planStartDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan End Date</label>
                    <input
                      type="date"
                      value={ndisSettings.planEndDate}
                      onChange={(e) => setNdisSettings({ ...ndisSettings, planEndDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">Budget Overview</h2>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Used: ${ndisSettings.usedBudget.toLocaleString()}</span>
                    <span className="text-gray-600">Total: ${ndisSettings.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2D5A4A] rounded-full"
                      style={{ width: `${(ndisSettings.usedBudget / ndisSettings.totalBudget) * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    ${(ndisSettings.totalBudget - ndisSettings.usedBudget).toLocaleString()} remaining
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  This is an estimate based on your recorded services. Actual budget may vary.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] flex items-center gap-2 disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
