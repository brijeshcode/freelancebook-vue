<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ payment?.transaction_number || 'Loading...' }}
          </h1>
          <span
            v-if="payment"
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusClass(payment.status)"
          >
            {{ getStatusLabel(payment.status) }}
          </span>
          <span
            v-if="payment && payment.verified_at"
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          >
            Verified
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Payment details and transaction information
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
        <router-link
          to="/payments"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <ArrowLeft class="h-5 w-5 mr-2" />
          Back to Payments
        </router-link>
        
        <!-- Action Buttons -->
        <div v-if="payment" class="flex gap-2">
          <!-- Verify Payment -->
          <button
            v-if="['pending', 'completed'].includes(payment.status) && !payment.verified_at"
            @click="verifyPayment"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <CheckCircle class="h-5 w-5 mr-2" />
            Verify Payment
          </button>

          <!-- Download Receipt -->
          <button
            v-if="payment.receipt_attachments && payment.receipt_attachments.length > 0"
            @click="downloadReceipts"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Download class="h-5 w-5 mr-2" />
            Download Receipts
          </button>

          <!-- Edit -->
          <router-link
            v-if="payment.status === 'pending'"
            :to="`/payments/${payment.id}/edit`"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <Pencil class="h-5 w-5 mr-2" />
            Edit
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !payment" class="flex justify-center items-center py-12">
      <Loader2 class="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading payment...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <AlertTriangle class="h-12 w-12 mx-auto text-red-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Error loading payment</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
      <div class="mt-6">
        <button
          @click="fetchPayment"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Payment Content -->
    <div v-else-if="payment" class="space-y-6">
      <!-- Payment Header Info -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Client Information -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Client Information
            </h3>
            
            <div class="space-y-3">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ payment.client?.name || 'No client' }}
                  </div>
                  <div v-if="payment.client?.email" class="text-sm text-gray-500 dark:text-gray-400">
                    {{ payment.client.email }}
                  </div>
                </div>
              </div>
              
              <!-- Client Balance Info -->
              <div v-if="clientBalance" class="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div class="grid grid-cols-1 gap-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">Current Balance:</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(clientBalance.outstanding_balance) }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">Total Invoiced:</span>
                    <span class="text-gray-900 dark:text-white">
                      {{ formatCurrency(clientBalance.total_invoiced) }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">Total Paid:</span>
                    <span class="text-gray-900 dark:text-white">
                      {{ formatCurrency(clientBalance.total_paid) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Details -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Payment Details
            </h3>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Payment Date:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatDate(payment.payment_date) }}
                </span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Payment Method:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  <component :is="getPaymentMethodIcon(payment.payment_method)" class="h-4 w-4 mr-2" />
                  {{ getPaymentMethodLabel(payment.payment_method) }}
                </span>
              </div>
              
              <div v-if="payment.transaction_reference" class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Reference:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ payment.transaction_reference }}
                </span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Currency:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ payment.currency }}
                </span>
              </div>
              
              <div v-if="payment.exchange_rate !== 1" class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Exchange Rate:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ payment.exchange_rate }}
                </span>
              </div>

              <div v-if="payment.verified_at" class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Verified:</span>
                <span class="text-sm font-medium text-green-600 dark:text-green-400">
                  {{ formatDate(payment.verified_at) }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatDate(payment.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Amount -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Payment Amount
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Original Amount:</span>
                <span class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ payment.currency }} {{ formatCurrency(payment.amount) }}
                </span>
              </div>
              
              <div v-if="payment.exchange_rate !== 1" class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Base Currency:</span>
                <span class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(payment.amount_base_currency) }}
                </span>
              </div>
            </div>

            <div v-if="payment.exchange_rate !== 1" class="space-y-3">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                <span class="font-medium">Conversion:</span><br>
                {{ payment.currency }} {{ formatCurrency(payment.amount) }} × {{ payment.exchange_rate }} = {{ formatCurrency(payment.amount_base_currency) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Notes -->
      <div v-if="payment.notes" class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-3">
            Notes
          </h3>
          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {{ payment.notes }}
          </p>
        </div>
      </div>

      <!-- Receipt Attachments -->
      <div v-if="payment.receipt_attachments && payment.receipt_attachments.length > 0" class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Receipt Attachments
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="(attachment, index) in payment.receipt_attachments"
              :key="index"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <component 
                      :is="getFileIcon(attachment)" 
                      class="h-8 w-8 text-gray-400" 
                    />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ getFileName(attachment) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getFileExtension(attachment).toUpperCase() }}
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="viewFile(attachment)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                    title="View File"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    @click="downloadFile(attachment)"
                    class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors duration-200"
                    title="Download File"
                  >
                    <Download class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          
          <div class="flex flex-wrap gap-3">
            <!-- Create Another Payment -->
            <router-link
              :to="`/payments/create?client_id=${payment.client_id}`"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <Plus class="h-5 w-5 mr-2" />
              Record Another Payment
            </router-link>

            <!-- View Client -->
            <router-link
              :to="`/clients/${payment.client_id}`"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <User class="h-5 w-5 mr-2" />
              View Client
            </router-link>

            <!-- View Client Invoices -->
            <router-link
              :to="`/invoices?client_id=${payment.client_id}`"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <FileText class="h-5 w-5 mr-2" />
              Client Invoices
            </router-link>

            <!-- Delete (if pending) -->
            <button
              v-if="payment.status === 'pending'"
              @click="confirmDelete"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <Trash2 class="h-5 w-5 mr-2" />
              Delete Payment
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="showDeleteModal = false"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle class="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Delete Payment
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete payment "{{ payment?.transaction_number }}"? This action cannot be undone and will affect the client's balance.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="deletePayment"
              :disabled="deleting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Loader2 v-if="deleting" class="h-4 w-4 animate-spin mr-2" />
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowLeft,
  CheckCircle,
  Download,
  Pencil,
  User,
  Plus,
  FileText,
  Trash2,
  Eye,
  Loader2,
  AlertTriangle,
  Building,
  Wallet,
  CreditCard,
  Banknote,
  DollarSign,
  Bitcoin,
  File,
  FileImage,
  FileType
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const notifications = useNotifications()

// Types
interface Client {
  id: number
  name: string
  email?: string
}

interface ClientBalance {
  outstanding_balance: number
  total_invoiced: number
  total_paid: number
}

interface Payment {
  id: number
  transaction_number: string
  client_id: number
  freelancer_id: number
  amount: number
  currency: string
  exchange_rate: number
  amount_base_currency: number
  payment_date: string
  payment_method: 'bank_transfer' | 'paypal' | 'stripe' | 'western_union' | 'cash' | 'check' | 'crypto' | 'other'
  transaction_reference: string | null
  notes: string | null
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  verified_at: string | null
  verified_by: number | null
  receipt_attachments: string[] | null
  client: Client | null
  created_at: string
  updated_at: string
}

// State
const loading = ref(false)
const deleting = ref(false)
const payment = ref<Payment | null>(null)
const clientBalance = ref<ClientBalance | null>(null)
const error = ref<string>('')
const showDeleteModal = ref(false)

// Methods
const fetchPayment = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.get(`/payments/${route.params.id}`)
    payment.value = response.data.data
    
    // Fetch client balance
    if (payment.value.client_id) {
      await fetchClientBalance()
    }
  } catch (err: any) {
    if (err.response?.status === 404) {
      error.value = 'Payment not found'
    } else {
      error.value = 'Failed to load payment'
    }
    notifications.error(error.value, {
      title: 'Error'
    })
  } finally {
    loading.value = false
  }
}

const fetchClientBalance = async () => {
  try {
    const response = await axios.get(`/clients/${payment.value?.client_id}/balance`)
    clientBalance.value = response.data.data
  } catch (error: any) {
    console.error('Failed to load client balance:', error)
  }
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string): string => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const getStatusLabel = (status: string): string => {
  const labels = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded'
  }
  return labels[status as keyof typeof labels] || status
}

const getPaymentMethodIcon = (method: string) => {
  const icons = {
    bank_transfer: Building,
    paypal: Wallet,
    stripe: CreditCard,
    western_union: Banknote,
    cash: DollarSign,
    check: Banknote,
    crypto: Bitcoin,
    other: Wallet
  }
  return icons[method as keyof typeof icons] || Wallet
}

const getPaymentMethodLabel = (method: string): string => {
  const labels = {
    bank_transfer: 'Bank Transfer',
    paypal: 'PayPal',
    stripe: 'Stripe',
    western_union: 'Western Union',
    cash: 'Cash',
    check: 'Check',
    crypto: 'Cryptocurrency',
    other: 'Other'
  }
  return labels[method as keyof typeof labels] || method
}

const getFileIcon = (filename: string) => {
  const extension = getFileExtension(filename).toLowerCase()
  
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return FileImage
  } else if (extension === 'pdf') {
    return FileType
  } else {
    return File
  }
}

const getFileName = (filepath: string): string => {
  return filepath.split('/').pop() || filepath
}

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop() || ''
}

const verifyPayment = async () => {
  if (!payment.value) return
  
  loading.value = true
  try {
    const response = await axios.patch(`/payments/${payment.value.id}/verify`)
    payment.value = response.data.data
    
    notifications.success('Payment verified successfully', {
      title: 'Success'
    })
    
    // Refresh client balance
    await fetchClientBalance()
  } catch (error: any) {
    notifications.error('Failed to verify payment', {
      title: 'Error'
    })
  } finally {
    loading.value = false
  }
}

const downloadReceipts = async () => {
  if (!payment.value?.receipt_attachments?.length) return
  
  try {
    for (const attachment of payment.value.receipt_attachments) {
      await downloadFile(attachment)
    }
    
    notifications.success('All receipts downloaded successfully', {
      title: 'Success'
    })
  } catch (error: any) {
    notifications.error('Failed to download receipts', {
      title: 'Error'
    })
  }
}

const viewFile = async (filepath: string) => {
  try {
    const response = await axios.get(`/payments/view-file?path=${encodeURIComponent(filepath)}`, {
      responseType: 'blob'
    })
    
    // Create blob URL and open in new tab
    const url = window.URL.createObjectURL(new Blob([response.data]))
    window.open(url, '_blank')
    window.URL.revokeObjectURL(url)
  } catch (error: any) {
    notifications.error('Failed to view file', {
      title: 'Error'
    })
  }
}

const downloadFile = async (filepath: string) => {
  try {
    const response = await axios.get(`/payments/download-file?path=${encodeURIComponent(filepath)}`, {
      responseType: 'blob'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', getFileName(filepath))
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error: any) {
    notifications.error('Failed to download file', {
      title: 'Error'
    })
  }
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const deletePayment = async () => {
  if (!payment.value) return

  deleting.value = true
  try {
    await axios.delete(`/payments/${payment.value.id}`)
    notifications.success('Payment deleted successfully', {
      title: 'Success'
    })
    router.push('/payments')
  } catch (error: any) {
    notifications.error('Failed to delete payment', {
      title: 'Error'
    })
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchPayment()
})
</script>