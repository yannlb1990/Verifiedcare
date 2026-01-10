'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FairPriceScore from '@/components/ui/FairPriceScore';
import BookNowModal from '@/components/ui/BookNowModal';
import { Search, MapPin, Star, Filter } from 'lucide-react';

// Demo data
const providers = [
  { id: '1', name: "Sarah's Cleaning", service: "Domestic Cleaning", location: "Melbourne VIC", rate: 52, ndisCap: 62.17, rating: 4.9, reviews: 127, score: 92, initials: "SC", available: true, description: "Professional cleaning services with 5+ years experience. Specializing in NDIS participants." },
  { id: '2', name: "Green Thumb Gardens", service: "Yard Maintenance", location: "Sydney NSW", rate: 58, ndisCap: 62.17, rating: 4.7, reviews: 89, score: 78, initials: "GT", available: true, description: "Expert gardening and yard maintenance. Fully insured and police checked." },
  { id: '3', name: "Mike's Transport", service: "Community Transport", location: "Brisbane QLD", rate: 65, ndisCap: 72.50, rating: 4.8, reviews: 156, score: 82, initials: "MT", available: true, description: "Safe and reliable transport for all your community access needs." },
  { id: '4', name: "Crystal Clean Co", service: "Domestic Cleaning", location: "Perth WA", rate: 60, ndisCap: 62.17, rating: 4.6, reviews: 72, score: 65, initials: "CC", available: false, description: "Thorough cleaning with attention to detail. NDIS registered provider." },
  { id: '5', name: "Easy Ride Transport", service: "Community Transport", location: "Adelaide SA", rate: 55, ndisCap: 72.50, rating: 4.9, reviews: 203, score: 95, initials: "ER", available: true, description: "Friendly and punctual transport service. Wheelchair accessible vehicles." },
  { id: '6', name: "Garden Pros", service: "Yard Maintenance", location: "Hobart TAS", rate: 50, ndisCap: 62.17, rating: 4.5, reviews: 45, score: 88, initials: "GP", available: true, description: "Complete garden care including mowing, pruning, and seasonal maintenance." },
];

export default function ProvidersPage() {
  const [selectedService, setSelectedService] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingProvider, setBookingProvider] = useState<typeof providers[0] | null>(null);

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = selectedService === 'all' || provider.service.toLowerCase().includes(selectedService);
    const matchesLocation = selectedLocation === 'all' || provider.location.includes(selectedLocation);
    return matchesSearch && matchesService && matchesLocation;
  });

  return (
    <DashboardLayout userName="Emma" userInitials="EM">
      <h1 className="text-2xl font-bold mb-6">Find Providers</h1>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A] focus:border-transparent"
          />
        </div>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
        >
          <option value="all">All Services</option>
          <option value="cleaning">Domestic Cleaning</option>
          <option value="transport">Community Transport</option>
          <option value="yard">Yard Maintenance</option>
        </select>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
        >
          <option value="all">All Locations</option>
          <option value="VIC">VIC</option>
          <option value="NSW">NSW</option>
          <option value="QLD">QLD</option>
          <option value="SA">SA</option>
          <option value="WA">WA</option>
          <option value="TAS">TAS</option>
          <option value="NT">NT</option>
          <option value="ACT">ACT</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E]">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button className="px-3 py-1 bg-[#E8F0ED] text-[#2D5A4A] rounded-full text-sm font-medium">Under NDIS Cap</button>
        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">Available This Week</button>
        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">4+ Stars</button>
        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">Fair Score 80+</button>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredProviders.map(provider => (
          <div key={provider.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] font-semibold text-lg flex-shrink-0">
                {provider.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-lg">{provider.name}</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span>
                </div>
                <div className="text-gray-600 text-sm">{provider.service}</div>
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                  <MapPin className="w-4 h-4" /> {provider.location}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-gray-500 text-sm">({provider.reviews})</span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    ${provider.rate}/hr <span className="text-gray-400">(Cap: ${provider.ndisCap})</span>
                  </div>
                </div>
              </div>
              <FairPriceScore score={provider.score} />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setBookingProvider(provider)}
                className="flex-1 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] transition-colors font-medium"
              >
                Book Now
              </button>
              <Link
                href={`/providers/${provider.id}`}
                className="flex-1 py-2 border border-[#2D5A4A] text-[#2D5A4A] rounded-lg hover:bg-[#E8F0ED] transition-colors font-medium text-center"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No providers found matching your criteria.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedService('all'); setSelectedLocation('all'); }}
            className="mt-2 text-[#2D5A4A] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Book Now Modal */}
      {bookingProvider && (
        <BookNowModal
          provider={bookingProvider}
          onClose={() => setBookingProvider(null)}
        />
      )}
    </DashboardLayout>
  );
}
