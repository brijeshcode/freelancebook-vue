<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your invoices and billing
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link
          to="/invoices/create"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <Plus class="h-5 w-5 mr-2" />
          Create Invoice
        </router-link>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Invoices
          </label>
          <div class="relative">
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Search by invoice number..."
              class="block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
              @input="debounceSearch"
            />
            <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            v-model="filters.status"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
            @change="fetchInvoices"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Client Filter -->
        <div>
          <label for="client" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Client
          </label>
          <select
            id="client"
            v-model="filters.client_id"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
            @change="fetchInvoices"
          >
            <option value="">All Clients</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
        </div>

        <!-- Date Range -->
        <div>
          <label for="date-from" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From Date
          </label>
          <input
            id="date-from"
            v-model="filters.date_from"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
            @change="fetchInvoices"
          />
        </div>

        <!-- Per Page -->
        <div>
          <label for="per-page" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Per Page
          </label>
          <select
            id="per-page"
            v-model="filters.per_page"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
            @change="fetchInvoices"
          >
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <FileText class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Invoices
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ stats.total_invoices }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DollarSign class="h-6 w-6 text-green-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Billed
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(stats.total_billed) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Clock class="h-6 w-6 text-yellow-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Outstanding Balance
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(stats.outstanding_balance) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <AlertTriangle class="h-6 w-6 text-red-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Overdue
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ stats.overdue_invoices }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invoices Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading invoices...</p>
      </div>

      <div v-else-if="invoices.length === 0" class="p-8 text-center">
        <FileText class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ filters.search ? 'Try adjusting your search criteria.' : 'Get started by creating your first invoice.' }}
        </p>
        <div v-if="!filters.search" class="mt-6">
          <router-link
            to="/invoices/create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            <Plus class="h-5 w-5 mr-2" />
            Create Your First Invoice
          </router-link>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Invoice
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Dates
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <!-- Invoice Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FileText class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ invoice.invoice_number }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      ID: {{ invoice.id }}
                      <span v-if="invoice.project">
                        • {{ invoice.project.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Client Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ invoice.client?.name || 'No client' }}
                </div>
                <div v-if="invoice.client?.email" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ invoice.client.email }}
                </div>
              </td>

              <!-- Amount -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <div class="text-gray-900 dark:text-white font-medium">
                    {{ invoice.currency }} {{ formatCurrency(invoice.total_amount) }}
                  </div>
                  <div v-if="invoice.tax_amount > 0" class="text-gray-500 dark:text-gray-400">
                    Tax: {{ invoice.currency }} {{ formatCurrency(invoice.tax_amount) }}
                  </div>
                  <div class="text-gray-500 dark:text-gray-400">
                    Subtotal: {{ invoice.currency }} {{ formatCurrency(invoice.subtotal) }}
                  </div>
                </div>
              </td>

              <!-- Dates -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <div class="text-gray-900 dark:text-white">
                    Issued: {{ formatDate(invoice.invoice_date) }}
                  </div>
                  <div v-if="invoice.due_date" class="text-gray-500 dark:text-gray-400">
                    Due: {{ formatDate(invoice.due_date) }}
                  </div>
                  <div v-if="invoice.sent_at" class="text-gray-500 dark:text-gray-400">
                    Sent: {{ formatDate(invoice.sent_at) }}
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col space-y-1">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(invoice.status)"
                  >
                    {{ getStatusLabel(invoice.status) }}
                  </span>
                  <span
                    v-if="isOverdue(invoice)"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  >
                    Overdue
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <!-- View -->
                  <router-link
                    :to="`/invoices/${invoice.id}`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                    title="View Invoice"
                  >
                    <Eye class="h-4 w-4" />
                  </router-link>

                  <!-- Mark as Sent (only for draft invoices) -->
                  <button
                    v-if="invoice.status === 'draft'"
                    @click="markAsSent(invoice)"
                    class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors duration-200"
                    title="Mark as Sent"
                  >
                    <Send class="h-4 w-4" />
                  </button>

                  <!-- Download PDF -->
                  <button
                    @click="downloadPDF(invoice)"
                    class="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors duration-200"
                    title="Download PDF"
                  >
                    <Download class="h-4 w-4" />
                  </button>

                  <!-- Edit (only for draft and sent invoices) -->
                  <router-link
                   
                    :to="`/invoices/${invoice.id}/edit`"
                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200"
                    title="Edit Invoice"
                  >
                    <Pencil class="h-4 w-4" />
                  </router-link>

                  <!-- Edit (only for draft and sent invoices) -->
                  <router-link
                    v-if="['draft', 'sent'].includes(invoice.status)"
                    :to="`/invoices/${invoice.id}/edit`"
                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200"
                    title="Edit Invoice"
                  >
                    <Pencil class="h-4 w-4" />
                  </router-link>

                  <!-- Copy -->
                  <button
                    @click="copyInvoice(invoice)"
                    class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 transition-colors duration-200"
                    title="Copy Invoice"
                  >
                    <Copy class="h-4 w-4" />
                  </button>

                  <!-- Delete (only for draft invoices) -->
                  <button
                    v-if="invoice.status === 'draft'"
                    @click="confirmDelete(invoice)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                    title="Delete Invoice"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.total > 0" class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page <= 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page >= pagination.last_page"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing
                <span class="font-medium">{{ pagination.from }}</span>
                to
                <span class="font-medium">{{ pagination.to }}</span>
                of
                <span class="font-medium">{{ pagination.total }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="changePage(pagination.current_page - 1)"
                  :disabled="pagination.current_page <= 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button
                  @click="changePage(pagination.current_page + 1)"
                  :disabled="pagination.current_page >= pagination.last_page"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
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
                  Are you sure you want to delete invoice "{{ invoiceToDelete?.invoice_number }}"? This action cannot be undone.
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  Plus,
  Search,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Send,
  Download,
  Copy,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  DollarSign,
  Clock
} from 'lucide-vue-next'

const router = useRouter()
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
  created_at: string
  updated_at: string
}

interface Pagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
  has_more_pages: boolean
  next_page_url: string | null
  prev_page_url: string | null
  first_page_url: string
  last_page_url: string
}

interface Stats {
  total_invoices: number
  total_billed: number
  outstanding_balance: number
  overdue_invoices: number
}

// State
const loading = ref(false)
const deleting = ref(false)
const invoices = ref<Invoice[]>([])
const clients = ref<Client[]>([])
const pagination = ref<Pagination | null>(null)
const showDeleteModal = ref(false)
const invoiceToDelete = ref<Invoice | null>(null)
const searchTimeout = ref<number | null>(null)

const stats = ref<Stats>({
  total_invoices: 0,
  total_billed: 0,
  outstanding_balance: 0,
  overdue_invoices: 0
})

const filters = reactive({
  search: '',
  status: '',
  client_id: '',
  date_from: '',
  per_page: 15
})

// Methods
const fetchInvoices = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: filters.per_page.toString()
    })

    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.client_id) params.append('client_id', filters.client_id)
    if (filters.date_from) params.append('date_from', filters.date_from)

    const response = await axios.get(`/invoices?${params}`)
    invoices.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error: any) {
    notifications.error('Failed to load invoices', {
      title: 'Error'
    })
  } finally {
    loading.value = false
  }
}

const fetchClients = async () => {
  try {
    const response = await axios.get('/clients')
    clients.value = response.data.data
  } catch (error: any) {
    console.error('Failed to load clients:', error)
  }
}

const fetchStats = async () => {
  try {
    const response = await axios.get('/invoices/stats')
    stats.value = response.data.data
  } catch (error: any) {
    console.error('Failed to load stats:', error)
  }
}

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    fetchInvoices(1)
  }, 300)
}

const changePage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.last_page) {
    fetchInvoices(page)
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

const markAsSent = async (invoice: Invoice) => {
  try {
    const response = await axios.patch(`/invoices/${invoice.id}/mark-as-sent`)
    
    // Update the invoice in the list
    const index = invoices.value.findIndex(i => i.id === invoice.id)
    if (index !== -1) {
      invoices.value[index] = response.data.data
    }
    
    notifications.success('Invoice marked as sent successfully', {
      title: 'Success'
    })
    
    // Refresh stats
    await fetchStats()
  } catch (error: any) {
    notifications.error('Failed to mark invoice as sent', {
      title: 'Error'
    })
  }
}

const downloadPDF = async (invoice: Invoice) => {
  try {
    const response = await axios.get(`/invoices/${invoice.id}/pdf`, {
      responseType: 'blob'
    })
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${invoice.invoice_number}.pdf`)
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

const copyInvoice = async (invoice: Invoice) => {
  try {
    router.push(`/invoices/create?copy=${invoice.id}`)
  } catch (error: any) {
    notifications.error('Failed to copy invoice', {
      title: 'Error'
    })
  }
}

const confirmDelete = (invoice: Invoice) => {
  invoiceToDelete.value = invoice
  showDeleteModal.value = true
}

const deleteInvoice = async () => {
  if (!invoiceToDelete.value) return

  deleting.value = true
  try {
    await axios.delete(`/invoices/${invoiceToDelete.value.id}`)
    notifications.success('Invoice deleted successfully', {
      title: 'Success'
    })
    showDeleteModal.value = false
    invoiceToDelete.value = null
    await fetchInvoices(pagination.value?.current_page || 1)
    await fetchStats()
  } catch (error: any) {
    notifications.error('Failed to delete invoice', {
      title: 'Error'
    })
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchInvoices(),
    fetchClients(),
    fetchStats()
  ])
})
</script>