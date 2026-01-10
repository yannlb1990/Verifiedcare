'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Users, Briefcase, ArrowRight, ArrowLeft, Mail, Lock,
  Phone, Eye, EyeOff, CheckCircle
} from 'lucide-react';

type UserRole = 'participant' | 'family' | 'ot' | 'provider';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: any;
  features: string[];
}

const roleOptions: RoleOption[] = [
  {
    id: 'participant',
    title: 'NDIS Participant',
    description: 'I receive NDIS support and want to find providers',
    icon: User,
    features: ['Find and book providers', 'Track your budget', 'Manage bookings', 'View invoices'],
  },
  {
    id: 'family',
    title: 'Family / Carer',
    description: 'I help manage care for an NDIS participant',
    icon: Users,
    features: ['Manage multiple participants', 'Book on their behalf', 'View all bookings', 'Track spending'],
  },
  {
    id: 'ot',
    title: 'Occupational Therapist',
    description: 'I assess and support NDIS participants',
    icon: Briefcase,
    features: ['Estimation tool for assessments', 'Client calendar management', 'Follow-up tracking', 'Progress reports'],
  },
  {
    id: 'provider',
    title: 'Service Provider',
    description: 'I provide services to NDIS participants',
    icon: Briefcase,
    features: ['List your services', 'Manage bookings', 'GPS check-in/out', 'Invoice generation'],
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Family-specific
    relationship: '',
    // OT-specific
    ahpraNumber: '',
    businessName: '',
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    // Redirect based on role
    if (selectedRole === 'family') {
      router.push('/family/dashboard');
    } else if (selectedRole === 'ot') {
      router.push('/ot/dashboard');
    } else if (selectedRole === 'provider') {
      router.push('/provider-portal');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#2D5A4A] text-white p-6">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-[#2D5A4A] font-bold text-sm">
              VC
            </div>
            <span className="text-lg font-semibold">Verified Care</span>
          </Link>
          <h1 className="text-2xl font-bold">Create Your Account</h1>
          <p className="text-white/80">Step {step} of 3</p>
          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">How will you use Verified Care?</h2>
              <p className="text-gray-600 mb-6">Select the option that best describes you</p>

              <div className="grid md:grid-cols-2 gap-4">
                {roleOptions.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedRole === role.id
                        ? 'border-[#2D5A4A] bg-[#E8F0ED]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedRole === role.id ? 'bg-[#2D5A4A] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <role.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{role.title}</div>
                        <div className="text-sm text-gray-600">{role.description}</div>
                      </div>
                      {selectedRole === role.id && (
                        <CheckCircle className="w-5 h-5 text-[#2D5A4A]" />
                      )}
                    </div>
                    {selectedRole === role.id && (
                      <div className="mt-3 pt-3 border-t border-[#2D5A4A]/20">
                        <ul className="text-sm text-gray-600 space-y-1">
                          {role.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-[#2D5A4A]" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Link href="/" className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedRole}
                  className="px-6 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Details</h2>
              <p className="text-gray-600 mb-6">Tell us a bit about yourself</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                      placeholder="Emma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                      placeholder="Johnson"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    placeholder="emma@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    placeholder="0412 345 678"
                  />
                </div>

                {/* Role-specific fields */}
                {selectedRole === 'family' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship to Participant
                    </label>
                    <select
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    >
                      <option value="">Select relationship</option>
                      <option value="parent">Parent</option>
                      <option value="spouse">Spouse/Partner</option>
                      <option value="child">Adult Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="guardian">Legal Guardian</option>
                      <option value="other">Other Carer</option>
                    </select>
                  </div>
                )}

                {selectedRole === 'ot' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        AHPRA Registration Number
                      </label>
                      <input
                        type="text"
                        value={formData.ahpraNumber}
                        onChange={(e) => setFormData({ ...formData, ahpraNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                        placeholder="OCC0001234567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Practice/Business Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                        placeholder="ABC Occupational Therapy"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.firstName || !formData.lastName || !formData.email}
                  className="px-6 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Set Your Password</h2>
              <p className="text-gray-600 mb-6">Choose a secure password for your account</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Lock className="w-4 h-4 inline mr-1" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A] pr-10"
                      placeholder="Create a strong password"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]"
                    placeholder="Confirm your password"
                  />
                </div>

                {/* Password requirements */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Password requirements:</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                      <CheckCircle className="w-4 h-4" /> At least 8 characters
                    </li>
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <CheckCircle className="w-4 h-4" /> One uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                      <CheckCircle className="w-4 h-4" /> One number
                    </li>
                    <li className={`flex items-center gap-2 ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-600' : ''}`}>
                      <CheckCircle className="w-4 h-4" /> Passwords match
                    </li>
                  </ul>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-[#2D5A4A] hover:underline">Terms of Service</a>{' '}
                    and{' '}
                    <a href="#" className="text-[#2D5A4A] hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setStep(2)}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || formData.password !== formData.confirmPassword || formData.password.length < 8}
                  className="px-6 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#2D5A4A] font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
