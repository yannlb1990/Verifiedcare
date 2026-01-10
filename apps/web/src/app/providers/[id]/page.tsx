'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FairPriceScore from '@/components/ui/FairPriceScore';
import BookNowModal from '@/components/ui/BookNowModal';
import {
  ArrowLeft, MapPin, Star, Clock, Shield, Phone, Mail,
  Calendar, CheckCircle, Award, FileText, MessageCircle
} from 'lucide-react';

// Demo data - in real app this would come from API
const providersData: Record<string, any> = {
  '1': {
    id: '1',
    name: "Sarah's Cleaning",
    service: "Domestic Cleaning",
    location: "Melbourne VIC",
    address: "Serving Melbourne Metropolitan Area",
    rate: 52,
    ndisCap: 62.17,
    rating: 4.9,
    reviews: 127,
    score: 92,
    initials: "SC",
    available: true,
    description: "Professional cleaning services with 5+ years experience. Specializing in NDIS participants with a focus on quality and reliability.",
    about: "Hi, I'm Sarah! I've been providing cleaning services for NDIS participants for over 5 years. I understand the unique needs of each client and tailor my services accordingly. My approach is thorough, respectful, and always focused on making your home a comfortable space.",
    services: [
      { name: "Regular House Cleaning", rate: 52, duration: "2-3 hours" },
      { name: "Deep Cleaning", rate: 62, duration: "4-6 hours" },
      { name: "Kitchen & Bathroom Focus", rate: 52, duration: "2 hours" },
      { name: "Laundry & Ironing", rate: 48, duration: "1-2 hours" },
    ],
    verifications: [
      { name: "NDIS Registered", verified: true, date: "Valid until Dec 2026" },
      { name: "Police Check", verified: true, date: "Cleared Jan 2025" },
      { name: "NDIS Worker Screening", verified: true, date: "Valid until Mar 2027" },
      { name: "Public Liability Insurance", verified: true, date: "$20M coverage" },
      { name: "ABN Verified", verified: true, date: "ABN: 12 345 678 901" },
    ],
    availability: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 3:00 PM",
      saturday: "By appointment",
      sunday: "Not available",
    },
    reviewsList: [
      { id: 1, author: "Emma J.", rating: 5, date: "Dec 2025", text: "Sarah is fantastic! Always on time, thorough, and so friendly. My home has never been cleaner." },
      { id: 2, author: "Michael R.", rating: 5, date: "Nov 2025", text: "Very professional and respectful of my needs. Highly recommend for NDIS participants." },
      { id: 3, author: "Lisa T.", rating: 4, date: "Nov 2025", text: "Great service overall. Very reliable and does a wonderful job." },
    ],
    responseTime: "Usually responds within 2 hours",
    completedJobs: 342,
    memberSince: "March 2021",
  },
  '2': {
    id: '2',
    name: "Green Thumb Gardens",
    service: "Yard Maintenance",
    location: "Sydney NSW",
    address: "Serving Sydney Metropolitan Area",
    rate: 58,
    ndisCap: 62.17,
    rating: 4.7,
    reviews: 89,
    score: 78,
    initials: "GT",
    available: true,
    description: "Expert gardening and yard maintenance. Fully insured and police checked.",
    about: "Green Thumb Gardens is a family-owned business dedicated to helping NDIS participants maintain beautiful outdoor spaces. We bring our own equipment and take pride in leaving your yard looking its best.",
    services: [
      { name: "Lawn Mowing", rate: 50, duration: "1-2 hours" },
      { name: "Garden Maintenance", rate: 58, duration: "2-3 hours" },
      { name: "Hedge Trimming", rate: 60, duration: "1-2 hours" },
      { name: "Seasonal Clean-up", rate: 65, duration: "3-4 hours" },
    ],
    verifications: [
      { name: "NDIS Registered", verified: true, date: "Valid until Nov 2026" },
      { name: "Police Check", verified: true, date: "Cleared Feb 2025" },
      { name: "NDIS Worker Screening", verified: true, date: "Valid until Jun 2027" },
      { name: "Public Liability Insurance", verified: true, date: "$10M coverage" },
      { name: "ABN Verified", verified: true, date: "ABN: 98 765 432 109" },
    ],
    availability: {
      monday: "7:00 AM - 4:00 PM",
      tuesday: "7:00 AM - 4:00 PM",
      wednesday: "7:00 AM - 4:00 PM",
      thursday: "7:00 AM - 4:00 PM",
      friday: "7:00 AM - 2:00 PM",
      saturday: "8:00 AM - 12:00 PM",
      sunday: "Not available",
    },
    reviewsList: [
      { id: 1, author: "David K.", rating: 5, date: "Dec 2025", text: "Excellent work on my garden! They really care about doing a good job." },
      { id: 2, author: "Susan M.", rating: 4, date: "Nov 2025", text: "Good service, always professional and tidy." },
    ],
    responseTime: "Usually responds within 4 hours",
    completedJobs: 198,
    memberSince: "August 2022",
  },
};

// Default provider for IDs not in our demo data
const defaultProvider = {
  id: '0',
  name: "Provider",
  service: "Service",
  location: "Australia",
  address: "Service Area",
  rate: 55,
  ndisCap: 62.17,
  rating: 4.5,
  reviews: 50,
  score: 80,
  initials: "P",
  available: true,
  description: "Quality NDIS services.",
  about: "Professional NDIS provider.",
  services: [{ name: "Standard Service", rate: 55, duration: "2 hours" }],
  verifications: [{ name: "NDIS Registered", verified: true, date: "Valid" }],
  availability: { monday: "9:00 AM - 5:00 PM" },
  reviewsList: [],
  responseTime: "Usually responds within 24 hours",
  completedJobs: 100,
  memberSince: "2024",
};

export default function ProviderProfilePage() {
  const params = useParams();
  const providerId = params.id as string;
  const provider = providersData[providerId] || { ...defaultProvider, id: providerId };
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');

  return (
    <DashboardLayout userName="Emma" userInitials="EM">
      {/* Back Button */}
      <Link
        href="/providers"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2D5A4A] mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Providers
      </Link>

      {/* Provider Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] font-bold text-2xl flex-shrink-0 mx-auto md:mx-0">
            {provider.initials}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{provider.name}</h1>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium inline-flex items-center gap-1 mx-auto md:mx-0 w-fit">
                <Shield className="w-3 h-3" /> Verified Provider
              </span>
            </div>
            <p className="text-gray-600 mb-2">{provider.service}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {provider.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                {provider.rating} ({provider.reviews} reviews)
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {provider.responseTime}
              </span>
            </div>
          </div>

          {/* Fair Price Score & Actions */}
          <div className="flex flex-col items-center gap-4">
            <FairPriceScore score={provider.score} size="lg" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2D5A4A]">${provider.rate}/hr</div>
              <div className="text-sm text-gray-500">NDIS Cap: ${provider.ndisCap}/hr</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex-1 py-3 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" /> Book Now
          </button>
          <button className="flex-1 py-3 border border-[#2D5A4A] text-[#2D5A4A] rounded-lg hover:bg-[#E8F0ED] transition-colors font-medium flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" /> Send Message
          </button>
          <button className="py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" /> Call
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#2D5A4A]">{provider.completedJobs}</div>
          <div className="text-gray-600 text-sm">Jobs Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#2D5A4A]">{provider.rating}</div>
          <div className="text-gray-600 text-sm">Average Rating</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#2D5A4A]">{provider.reviews}</div>
          <div className="text-gray-600 text-sm">Reviews</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#2D5A4A]">{provider.memberSince.split(' ')[1] || provider.memberSince}</div>
          <div className="text-gray-600 text-sm">Member Since</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-3 px-1 font-medium ${activeTab === 'about' ? 'text-[#2D5A4A] border-b-2 border-[#2D5A4A]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-1 font-medium ${activeTab === 'services' ? 'text-[#2D5A4A] border-b-2 border-[#2D5A4A]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Services & Pricing
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-1 font-medium ${activeTab === 'reviews' ? 'text-[#2D5A4A] border-b-2 border-[#2D5A4A]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Reviews
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'about' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* About */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">About</h2>
            <p className="text-gray-600">{provider.about}</p>
          </div>

          {/* Verifications */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#2D5A4A]" /> Verifications
            </h2>
            <div className="space-y-3">
              {provider.verifications.map((v: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{v.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{v.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2D5A4A]" /> Availability
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(provider.availability).map(([day, hours]: [string, any]) => (
                <div key={day} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium capitalize">{day}</div>
                  <div className="text-sm text-gray-600">{hours}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Services & Pricing</h2>
          <div className="space-y-4">
            {provider.services.map((service: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                <div>
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-500">Typical duration: {service.duration}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[#2D5A4A]">${service.rate}/hr</div>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="text-sm text-[#2D5A4A] hover:underline"
                  >
                    Book this service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {/* Rating Summary */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#2D5A4A]">{provider.rating}</div>
                <div className="flex items-center gap-1 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(provider.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <div className="text-gray-500 text-sm mt-1">{provider.reviews} reviews</div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {provider.reviewsList.map((review: any) => (
            <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] font-medium">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{review.author}</div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.text}</p>
            </div>
          ))}

          {provider.reviewsList.length === 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center text-gray-500">
              No reviews yet for this provider.
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <BookNowModal
          provider={provider}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
