<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ invoice?.invoice_number || 'Loading...' }}
          </h1>
          <span
            v-if="invoice"
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusClass(invoice.status)"
          >
            {{ getStatusLabel(invoice.status) }}
          </span>
          <span
            v-if="invoice && isOverdue(invoice)"
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          >
            Overdue
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Invoice details and line items
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
        <router-link
          to="/invoices"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <ArrowLeft class="h-5 w-5 mr-2" />
          Back to Invoices
        </router-link>
        
        <!-- Action Buttons -->
        <div v-if="invoice" class="flex gap-2">
          <!-- Mark as Sent -->
          <button
            v-if="invoice.status === 'draft'"
            @click="markAsSent"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send class="h-5 w-5 mr-2" />
            Mark as Sent
          </button>

          <!-- Download PDF -->
          <button
            @click="downloadPDF"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Download class="h-5 w-5 mr-2" />
            Download PDF
          </button>

          <!-- Edit -->
          <router-link
            v-if="['draft', 'sent'].includes(invoice.status)"
            :to="`/invoices/${invoice.id}/edit`"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <Pencil class="h-5 w-5 mr-2" />
            Edit
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !invoice" class="flex justify-center items-center py-12">
      <Loader2 class="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading invoice...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <AlertTriangle class="h-12 w-12 mx-auto text-red-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Error loading invoice</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
      <div class="mt-6">
        <button
          @click="fetchInvoice"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Invoice Content -->
    <div v-else-if="invoice" class="space-y-6">
      <!-- Invoice Header Info -->
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
                    {{ invoice.client?.name || 'No client' }}
                  </div>
                  <div v-if="invoice.client?.email" class="text-sm text-gray-500 dark:text-gray-400">
                    {{ invoice.client.email }}
                  </div>
                </div>
              </div>
              
              <div v-if="invoice.project" class="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div class="flex items-center">
                  <Folder class="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      Project: {{ invoice.project.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Details -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Invoice Details
            </h3>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Invoice Date:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatDate(invoice.invoice_date) }}
                </span>
              </div>
              
              <div v-if="invoice.due_date" class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Due Date:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatDate(invoice.due_date) }}
                </span>
              </div>
              
              <div v-if="invoice.sent_at" class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Sent Date:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatDate(invoice.sent_at) }}
                </span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Currency:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ invoice.currency }}
                </span>
              </div>
              
              <div v-if="invoice.exchange_rate !== 1" class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Exchange Rate:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ invoice.exchange_rate }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatDate(invoice.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Notes -->
      <div v-if="invoice.notes" class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-3">
            Notes
          </h3>
          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {{ invoice.notes }}
          </p>
        </div>
      </div>

      <!-- Invoice Items -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Invoice Items
          </h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="item in invoice.items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-6 py-4">
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ item.description }}
                      </div>
                      <div v-if="item.service_period_start && item.service_period_end" class="text-sm text-gray-500 dark:text-gray-400">
                        Service Period: {{ formatDate(item.service_period_start) }} - {{ formatDate(item.service_period_end) }}
                      </div>
                      <div v-if="item.notes" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {{ item.notes }}
                      </div>
                      <div v-if="item.service" class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Service: {{ item.service.title }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                    {{ item.quantity }}
                  </td>
                  <td class="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                    {{ invoice.currency }} {{ formatCurrency(item.unit_price) }}
                  </td>
                  <td class="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {{ invoice.currency }} {{ formatCurrency(item.total_price) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Invoice Summary -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Invoice Summary
          </h3>
          
          <div class="max-w-sm ml-auto space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Subtotal:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ invoice.currency }} {{ formatCurrency(invoice.subtotal) }}
              </span>
            </div>
            
            <div v-if="invoice.tax_amount > 0" class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ invoice.tax_label || 'Tax' }} ({{ invoice.tax_rate }}%):
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ invoice.currency }} {{ formatCurrency(invoice.tax_amount) }}
              </span>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div class="flex justify-between">
                <span class="text-base font-medium text-gray-900 dark:text-white">Total:</span>
                <span class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ invoice.currency }} {{ formatCurrency(invoice.total_amount) }}
                </span>
              </div>
            </div>

            <div v-if="invoice.exchange_rate !== 1" class="text-sm text-gray-500 dark:text-gray-400 text-right">
              Base Currency: {{ formatCurrency(invoice.total_amount_base_currency) }}
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
            <!-- Copy Invoice -->
            <router-link
              :to="`/invoices/create?copy=${invoice.id}`"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <Copy class="h-5 w-5 mr-2" />
              Copy Invoice
            </router-link>

            <!-- Record Payment -->
            <router-link
              :to="`/payments/create?client_id=${invoice.client_id}`"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <CreditCard class="h-5 w-5 mr-2" />
              Record Payment
            </router-link>

            <!-- View Client -->
            <router-link
              :to="`/clients/${invoice.client_id}`"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <User class="h-5 w-5 mr-2" />
              View Client
            </router-link>

            <!-- Delete (if draft) -->
            <button
              v-if="invoice.status === 'draft'"
              @click="confirmDelete"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              <Trash2 class="h-5 w-5 mr-2" />
              Delete Invoice
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
                Delete Invoice
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete invoice "{{ invoice?.invoice_number }}"? This action cannot be undone and will remove the amount from the client's balance.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="deleteInvoice"
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
  Send,
  Download,
  Pencil,
  Copy,
  CreditCard,
  User,
  Folder,
  Trash2,
  Loader2,
  AlertTriangle
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

interface Project {
  id: number
  name: string
}

interface Service {
  id: number
  title: string
}

interface InvoiceItem {
  id: number
  description: string
  quantity: number
  unit_price: number
  total_price: number
  service_period_start?: string
  service_period_end?: string
  notes?: string
  service?: Service
}

interface Invoice {
  id: number
  invoice_number: string
  client_id: number
  project_id: number | null
  freelancer_id: number
  invoice_date: string
  due_date: string | null
  notes: string | null
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  currency: string
  exchange_rate: number
  subtotal: number
  tax_amount: number
  total_amount: number
  total_amount_base_currency: number
  tax_rate: number
  tax_label: string | null
  sent_at: string | null
  client: Client | null
  project: Project | null
  items: InvoiceItem[]
  created_at: string
  updated_at: string
}

// State
const loading = ref(false)
const deleting = ref(false)
const invoice = ref<Invoice | null>(null)
const error = ref<string>('')
const showDeleteModal = ref(false)

// Methods
const fetchInvoice = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.get(`/invoices/${route.params.id}`)
    invoice.value = response.data.data
  } catch (err: any) {
    if (err.response?.status === 404) {
      error.value = 'Invoice not found'
    } else {
      error.value = 'Failed to load invoice'
    }
    notifications.error(error.value, {
      title: 'Error'
    })
  } finally {
    loading.value = false
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
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    cancelled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  }
  return classes[status as keyof typeof classes] || classes.draft
}

const getStatusLabel = (status: string): string => {
  const labels = {
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled'
  }
  return labels[status as keyof typeof labels] || status
}

const isOverdue = (invoice: Invoice): boolean => {
  if (!invoice.due_date || invoice.status === 'paid' || invoice.status === 'cancelled') {
    return false
  }
  return new Date(invoice.due_date) < new Date() && invoice.status !== 'paid'
}

const markAsSent = async () => {
  if (!invoice.value) return
  
  loading.value = true
  try {
    const response = await axios.patch(`/invoices/${invoice.value.id}/mark-as-sent`)
    invoice.value = response.data.data
    
    notifications.success('Invoice marked as sent successfully', {
      title: 'Success'
    })
  } catch (error: any) {
    notifications.error('Failed to mark invoice as sent', {
      title: 'Error'
    })
  } finally {
    loading.value = false
  }
}

const downloadPDF = async () => {
  if (!invoice.value) return
  
  try {
    const response = await axios.get(`/invoices/${invoice.value.id}/pdf`, {
      responseType: 'blob'
    })
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${invoice.value.invoice_number}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    notifications.success('Invoice PDF downloaded successfully', {
      title: 'Success'
    })
  } catch (error: any) {
    notifications.error('Failed to download invoice PDF', {
      title: 'Error'
    })
  }
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const deleteInvoice = async () => {
  if (!invoice.value) return

  deleting.value = true
  try {
    await axios.delete(`/invoices/${invoice.value.id}`)
    notifications.success('Invoice deleted successfully', {
      title: 'Success'
    })
    router.push('/invoices')
  } catch (error: any) {
    notifications.error('Failed to delete invoice', {
      title: 'Error'
    })
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchInvoice()
})
</script>