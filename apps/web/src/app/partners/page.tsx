'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Search, MapPin, Star, Phone, Mail, Globe, Filter, Heart, Brain,
  Activity, Eye, Ear, Users, Baby, ChevronRight, ExternalLink
} from 'lucide-react';

// Demo NDIS partner providers - Allied Health
const partnerCategories = [
  { id: 'psychology', name: 'Psychology', icon: Brain, color: 'bg-purple-100 text-purple-600' },
  { id: 'physio', name: 'Physiotherapy', icon: Activity, color: 'bg-blue-100 text-blue-600' },
  { id: 'ot', name: 'Occupational Therapy', icon: Heart, color: 'bg-green-100 text-green-600' },
  { id: 'speech', name: 'Speech Pathology', icon: Ear, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'dietetics', name: 'Dietetics', icon: Activity, color: 'bg-orange-100 text-orange-600' },
  { id: 'podiatry', name: 'Podiatry', icon: Activity, color: 'bg-red-100 text-red-600' },
  { id: 'exercise', name: 'Exercise Physiology', icon: Activity, color: 'bg-teal-100 text-teal-600' },
  { id: 'behaviour', name: 'Behaviour Support', icon: Users, color: 'bg-indigo-100 text-indigo-600' },
];

const partners = [
  // Psychology
  { id: '1', name: 'Melbourne Mind Psychology', category: 'psychology', services: ['Individual Therapy', 'PTSD Support', 'Anxiety Management'], location: 'Melbourne VIC', suburb: 'Carlton', postcode: '3053', rating: 4.9, reviews: 156, phone: '03 9123 4567', email: 'info@melbournemind.com.au', website: 'www.melbournemind.com.au', ndisRegistered: true, available: true },
  { id: '2', name: 'Clarity Psychology Services', category: 'psychology', services: ['ASD Assessment', 'Family Therapy', 'CBT'], location: 'Melbourne VIC', suburb: 'Richmond', postcode: '3121', rating: 4.8, reviews: 89, phone: '03 9234 5678', email: 'hello@claritypsych.com.au', website: 'www.claritypsych.com.au', ndisRegistered: true, available: true },

  // Physiotherapy
  { id: '3', name: 'Active Life Physio', category: 'physio', services: ['Neurological Rehab', 'Hydrotherapy', 'Home Visits'], location: 'Melbourne VIC', suburb: 'South Yarra', postcode: '3141', rating: 4.7, reviews: 234, phone: '03 9345 6789', email: 'book@activelifephysio.com.au', website: 'www.activelifephysio.com.au', ndisRegistered: true, available: true },
  { id: '4', name: 'City Physiotherapy', category: 'physio', services: ['Sports Injuries', 'Post-Surgery Rehab', 'Chronic Pain'], location: 'Melbourne VIC', suburb: 'CBD', postcode: '3000', rating: 4.6, reviews: 178, phone: '03 9456 7890', email: 'info@cityphysio.com.au', website: 'www.cityphysio.com.au', ndisRegistered: true, available: false },

  // Occupational Therapy
  { id: '5', name: 'Enable OT Services', category: 'ot', services: ['Home Modifications', 'AT Assessment', 'Daily Living Skills'], location: 'Melbourne VIC', suburb: 'Brunswick', postcode: '3056', rating: 4.9, reviews: 112, phone: '03 9567 8901', email: 'support@enableot.com.au', website: 'www.enableot.com.au', ndisRegistered: true, available: true },

  // Speech Pathology
  { id: '6', name: 'Clear Speech Pathology', category: 'speech', services: ['Speech Therapy', 'Swallowing Assessment', 'AAC'], location: 'Melbourne VIC', suburb: 'Hawthorn', postcode: '3122', rating: 4.8, reviews: 95, phone: '03 9678 9012', email: 'enquiries@clearspeech.com.au', website: 'www.clearspeech.com.au', ndisRegistered: true, available: true },

  // Dietetics
  { id: '7', name: 'Nutrition Plus Dietitians', category: 'dietetics', services: ['Meal Planning', 'Weight Management', 'Tube Feeding Support'], location: 'Melbourne VIC', suburb: 'Prahran', postcode: '3181', rating: 4.7, reviews: 67, phone: '03 9789 0123', email: 'hello@nutritionplus.com.au', website: 'www.nutritionplus.com.au', ndisRegistered: true, available: true },

  // Exercise Physiology
  { id: '8', name: 'Move Well Exercise Physiology', category: 'exercise', services: ['Chronic Disease Management', 'Strength Training', 'Cardiac Rehab'], location: 'Melbourne VIC', suburb: 'Fitzroy', postcode: '3065', rating: 4.9, reviews: 145, phone: '03 9890 1234', email: 'info@movewell.com.au', website: 'www.movewell.com.au', ndisRegistered: true, available: true },

  // Behaviour Support
  { id: '9', name: 'Positive Behaviour Solutions', category: 'behaviour', services: ['Behaviour Support Plans', 'Restrictive Practice Review', 'Family Support'], location: 'Melbourne VIC', suburb: 'Collingwood', postcode: '3066', rating: 4.8, reviews: 78, phone: '03 9901 2345', email: 'support@positivebehaviour.com.au', website: 'www.positivebehaviour.com.au', ndisRegistered: true, available: true },
];

export default function PartnersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || partner.category === selectedCategory;
    const matchesLocation = !locationFilter || partner.postcode.startsWith(locationFilter) || partner.suburb.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesAvailability = !showAvailableOnly || partner.available;
    return matchesSearch && matchesCategory && matchesLocation && matchesAvailability;
  });

  const getCategoryInfo = (categoryId: string) => {
    return partnerCategories.find(c => c.id === categoryId);
  };

  return (
    <DashboardLayout userName="Emma" userInitials="EM">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">NDIS Partners & Allied Health</h1>
          <p className="text-gray-600">Find registered NDIS providers in your area</p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-[#2D5A4A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Services
          </button>
          {partnerCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-[#2D5A4A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Postcode or suburb"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="w-4 h-4 text-[#2D5A4A] rounded"
              />
              <span className="text-sm text-gray-600">Available now</span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredPartners.length} providers
          {selectedCategory && ` in ${getCategoryInfo(selectedCategory)?.name}`}
          {locationFilter && ` near "${locationFilter}"`}
        </div>

        {/* Partners Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPartners.map((partner) => {
            const category = getCategoryInfo(partner.category);
            return (
              <div
                key={partner.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${category?.color}`}>
                      {category && <category.icon className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{partner.name}</h3>
                        {partner.ndisRegistered && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                            NDIS
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{category?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{partner.rating}</span>
                    <span className="text-sm text-gray-500">({partner.reviews})</span>
                  </div>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {partner.services.map((service, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {service}
                    </span>
                  ))}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  {partner.suburb}, {partner.postcode}
                </div>

                {/* Contact */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <a href={`tel:${partner.phone}`} className="flex items-center gap-1 text-[#2D5A4A] hover:underline">
                    <Phone className="w-4 h-4" />
                    {partner.phone}
                  </a>
                  <a href={`https://${partner.website}`} target="_blank" rel="noopener" className="flex items-center gap-1 text-[#2D5A4A] hover:underline">
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={`mailto:${partner.email}`}
                    className="flex-1 py-2 text-center bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] font-medium"
                  >
                    Contact
                  </a>
                  <button className="flex-1 py-2 text-center border border-[#2D5A4A] text-[#2D5A4A] rounded-lg hover:bg-[#E8F0ED] font-medium">
                    Save
                  </button>
                </div>

                {!partner.available && (
                  <div className="mt-3 text-center text-sm text-gray-500">
                    Currently not accepting new clients
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredPartners.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No providers found matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); setLocationFilter(''); }}
              className="mt-2 text-[#2D5A4A] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">About NDIS Partners</h3>
          <p className="text-blue-800 text-sm">
            All providers listed here are registered with the NDIS and can provide services under your plan.
            Contact them directly to discuss your needs and check availability. Always verify their registration
            at the <a href="https://www.ndis.gov.au/providers/find-registered-provider" target="_blank" rel="noopener" className="underline">NDIS Provider Finder</a>.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
