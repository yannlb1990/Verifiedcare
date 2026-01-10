'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import { FileText, Download, Eye, Search, Filter, Calendar, DollarSign, ChevronRight } from 'lucide-react';

// Demo data
const invoices = [
  {
    id: 'INV-202601-0001',
    provider: "Sarah's Cleaning",
    providerInitials: 'SC',
    service: 'Domestic Cleaning',
    date: '2026-01-12',
    dueDate: '2026-01-26',
    amount: 109.20,
    gst: 10.38,
    total: 119.58,
    status: 'paid',
    paidDate: '2026-01-15',
  },
  {
    id: 'INV-202601-0002',
    provider: "Mike's Transport",
    providerInitials: 'MT',
    service: 'Community Transport',
    date: '2026-01-14',
    dueDate: '2026-01-28',
    amount: 136.50,
    gst: 12.96,
    total: 149.46,
    status: 'sent',
    paidDate: null,
  },
  {
    id: 'INV-202601-0003',
    provider: "Green Thumb Gardens",
    providerInitials: 'GT',
    service: 'Yard Maintenance',
    date: '2026-01-08',
    dueDate: '2026-01-22',
    amount: 183.40,
    gst: 17.42,
    total: 200.82,
    status: 'overdue',
    paidDate: null,
  },
  {
    id: 'INV-202512-0015',
    provider: "Sarah's Cleaning",
    providerInitials: 'SC',
    service: 'Domestic Cleaning',
    date: '2025-12-18',
    dueDate: '2026-01-01',
    amount: 163.80,
    gst: 15.56,
    total: 179.36,
    status: 'paid',
    paidDate: '2025-12-28',
  },
  {
    id: 'INV-202512-0012',
    provider: "Easy Ride Transport",
    providerInitials: 'ER',
    service: 'Community Transport',
    date: '2025-12-10',
    dueDate: '2025-12-24',
    amount: 115.50,
    gst: 10.97,
    total: 126.47,
    status: 'paid',
    paidDate: '2025-12-20',
  },
];

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'pending' && ['sent', 'overdue'].includes(invoice.status)) ||
      (activeTab === 'paid' && invoice.status === 'paid');
    return matchesSearch && matchesTab;
  });

  const totalPending = invoices
    .filter(i => ['sent', 'overdue'].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0);

  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <DashboardLayout userName="Emma" userInitials="EM">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A4A] w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-600 text-sm">Total Invoices</span>
          </div>
          <div className="text-2xl font-bold">{invoices.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-gray-600 text-sm">Pending</span>
          </div>
          <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-gray-600 text-sm">Overdue</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {invoices.filter(i => i.status === 'overdue').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-600 text-sm">Paid (YTD)</span>
          </div>
          <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-1 font-medium ${activeTab === 'all' ? 'text-[#2D5A4A] border-b-2 border-[#2D5A4A]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          All Invoices
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-1 font-medium ${activeTab === 'pending' ? 'text-[#2D5A4A] border-b-2 border-[#2D5A4A]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Pending Payment
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`pb-3 px-1 font-medium ${activeTab === 'paid' ? 'text-[#2D5A4A] border-b-2 border-[#2D5A4A]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Paid
        </button>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.map(invoice => (
          <div
            key={invoice.id}
            className={`bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${
              invoice.status === 'overdue' ? 'border-l-4 border-l-red-500' :
              invoice.status === 'sent' ? 'border-l-4 border-l-yellow-500' :
              'border-l-4 border-l-green-500'
            }`}
            onClick={() => setSelectedInvoice(invoice)}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E8F0ED] rounded-full flex items-center justify-center text-[#2D5A4A] font-semibold">
                  {invoice.providerInitials}
                </div>
                <div>
                  <div className="font-semibold">{invoice.id}</div>
                  <div className="text-gray-600 text-sm">{invoice.provider} - {invoice.service}</div>
                  <div className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(invoice.date).toLocaleDateString('en-AU')}
                    {invoice.status !== 'paid' && (
                      <span className="ml-2">Due: {new Date(invoice.dueDate).toLocaleDateString('en-AU')}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold">${invoice.total.toFixed(2)}</div>
                  <div className="text-gray-500 text-sm">inc. GST</div>
                </div>
                <StatusBadge status={invoice.status} />
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {invoice.status !== 'paid' && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="px-4 py-2 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] text-sm font-medium"
                >
                  Pay Now
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No invoices found.</p>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Invoice {selectedInvoice.id}</h2>
                <p className="text-gray-600">{selectedInvoice.provider}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg mb-6 ${
                selectedInvoice.status === 'paid' ? 'bg-green-50' :
                selectedInvoice.status === 'overdue' ? 'bg-red-50' : 'bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <StatusBadge status={selectedInvoice.status} />
                    {selectedInvoice.status === 'paid' && selectedInvoice.paidDate && (
                      <p className="text-sm text-green-700 mt-1">
                        Paid on {new Date(selectedInvoice.paidDate).toLocaleDateString('en-AU')}
                      </p>
                    )}
                    {selectedInvoice.status === 'overdue' && (
                      <p className="text-sm text-red-700 mt-1">
                        Was due on {new Date(selectedInvoice.dueDate).toLocaleDateString('en-AU')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${selectedInvoice.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500">Invoice Date</div>
                  <div className="font-medium">{new Date(selectedInvoice.date).toLocaleDateString('en-AU')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Due Date</div>
                  <div className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString('en-AU')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Service</div>
                  <div className="font-medium">{selectedInvoice.service}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Provider</div>
                  <div className="font-medium">{selectedInvoice.provider}</div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">Cost Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Amount</span>
                    <span>${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (10%)</span>
                    <span>${selectedInvoice.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                    <span>Total</span>
                    <span>${selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedInvoice.status !== 'paid' && (
                  <button className="flex-1 py-3 bg-[#2D5A4A] text-white rounded-lg hover:bg-[#1B4D3E] font-medium">
                    Pay Now
                  </button>
                )}
                <button className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Download PDF
                </button>
                <button className="py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// Add missing import
function Clock(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}
