'use client';

import { useState } from 'react';
import { X, Calendar, Clock, MapPin, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  service: string;
  rate: number;
  ndisCap: number;
  initials: string;
  services?: { name: string; rate: number; duration: string }[];
}

interface BookNowModalProps {
  provider: Provider;
  onClose: () => void;
}

export default function BookNowModal({ provider, onClose }: BookNowModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: provider.services?.[0]?.name || provider.service,
    date: '',
    time: '',
    duration: '2',
    address: '',
    suburb: '',
    state: 'VIC',
    postcode: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const selectedService = provider.services?.find(s => s.name === formData.serviceType);
  const hourlyRate = selectedService?.rate || provider.rate;
  const estimatedCost = hourlyRate * parseInt(formData.duration || '0');
  const platformFee = estimatedCost * 0.05;
  const total = estimatedCost + platformFee;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const label = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
      slots.push({ value: time, label });
    }
    return slots;
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Request Sent!</h2>
          <p className="text-gray-600 mb-6">
            Your booking request has been sent to {provider.name}. They will confirm within 24 hours.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Service</span>
              <span className="font-medium">{formData.serviceType}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">{new Date(formData.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Time</span>
              <span className="font-medium">{formData.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Total</span>
              <span className="font-bold text-[#2D5A4A]">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] font-medium"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold">Book {provider.name}</h2>
            <p className="text-gray-600 text-sm">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-[#2D5A4A]' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Select Service & Time</h3>

              {/* Service Type */}
              {provider.services && provider.services.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  >
                    {provider.services.map((service) => (
                      <option key={service.name} value={service.name}>
                        {service.name} - ${service.rate}/hr
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" /> Preferred Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" /> Preferred Time
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                >
                  <option value="">Select a time</option>
                  {generateTimeSlots().map((slot) => (
                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration (hours)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="5">5 hours</option>
                  <option value="6">6 hours</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Service Location</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" /> Street Address
                </label>
                <input
                  type="text"
                  placeholder="123 Example Street"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suburb</label>
                  <input
                    type="text"
                    placeholder="Melbourne"
                    value={formData.suburb}
                    onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                  >
                    <option value="VIC">VIC</option>
                    <option value="NSW">NSW</option>
                    <option value="QLD">QLD</option>
                    <option value="SA">SA</option>
                    <option value="WA">WA</option>
                    <option value="TAS">TAS</option>
                    <option value="NT">NT</option>
                    <option value="ACT">ACT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                <input
                  type="text"
                  placeholder="3000"
                  maxLength={4}
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  placeholder="Any special requirements or access instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Review & Confirm</h3>

              {/* Provider Card */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] font-semibold">
                  {provider.initials}
                </div>
                <div>
                  <div className="font-semibold">{provider.name}</div>
                  <div className="text-sm text-gray-600">{formData.serviceType}</div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Date
                  </span>
                  <span className="font-medium">
                    {formData.date ? new Date(formData.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }) : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Time
                  </span>
                  <span className="font-medium">{formData.time || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{formData.duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </span>
                  <span className="font-medium text-right">
                    {formData.address ? `${formData.address}, ${formData.suburb}` : '-'}
                  </span>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-[#E8F0ED] rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Service ({formData.duration} hrs × ${hourlyRate}/hr)</span>
                  <span className="font-medium">${estimatedCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee (5%)</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#2D5A4A]/20">
                  <span className="font-semibold">Estimated Total</span>
                  <span className="font-bold text-xl text-[#2D5A4A]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* NDIS Notice */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">NDIS Funded Service</p>
                  <p>This service will be billed to your NDIS plan. The final amount may vary based on actual service duration.</p>
                </div>
              </div>

              {/* Confirmation Notice */}
              <div className="text-sm text-gray-600 text-center">
                By confirming, you agree to our Terms of Service. The provider will confirm your booking within 24 hours.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (!formData.date || !formData.time)) ||
                (step === 2 && (!formData.address || !formData.suburb || !formData.postcode))
              }
              className="flex-1 py-3 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] font-medium disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
