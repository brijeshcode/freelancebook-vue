<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage client payments
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link
          to="/payments/create"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <Plus class="h-5 w-5 mr-2" />
          Record Payment
        </router-link>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Payments
          </label>
          <div class="relative">
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Search by transaction number..."
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
            @change="fetchPayments"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <!-- Payment Method Filter -->
        <div>
          <label for="payment_method" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Method
          </label>
          <select
            id="payment_method"
            v-model="filters.payment_method"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
            @change="fetchPayments"
          >
            <option value="">All Methods</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
            <option value="western_union">Western Union</option>
            <option value="cash">Cash</option>
            <option value="check">Check</option>
            <option value="crypto">Crypto</option>
            <option value="other">Other</option>
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
            @change="fetchPayments"
          >
            <option value="">All Clients</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
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
            @change="fetchPayments"
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
              <CreditCard class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Payments
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ stats.total_payments }}
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
                  Total Received
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(stats.total_received) }}
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
                  Pending Amount
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(stats.pending_amount) }}
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
              <TrendingUp class="h-6 w-6 text-blue-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  This Month
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(stats.this_month) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading payments...</p>
      </div>

      <div v-else-if="payments.length === 0" class="p-8 text-center">
        <CreditCard class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No payments found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ filters.search ? 'Try adjusting your search criteria.' : 'Get started by recording your first payment.' }}
        </p>
        <div v-if="!filters.search" class="mt-6">
          <router-link
            to="/payments/create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            <Plus class="h-5 w-5 mr-2" />
            Record Your First Payment
          </router-link>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Payment
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Method & Date
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
            <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <!-- Payment Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CreditCard class="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ payment.transaction_number }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      ID: {{ payment.id }}
                      <span v-if="payment.transaction_reference" class="ml-2">
                        • Ref: {{ payment.transaction_reference }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Client Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ payment.client?.name || 'No client' }}
                </div>
                <div v-if="payment.client?.email" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ payment.client.email }}
                </div>
              </td>

              <!-- Amount -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <div class="text-gray-900 dark:text-white font-medium">
                    {{ payment.currency }} {{ formatCurrency(payment.amount) }}
                  </div>
                  <div v-if="payment.exchange_rate !== 1" class="text-gray-500 dark:text-gray-400">
                    Base: {{ formatCurrency(payment.amount_base_currency) }}
                  </div>
                  <div v-if="payment.exchange_rate !== 1" class="text-gray-500 dark:text-gray-400 text-xs">
                    Rate: {{ payment.exchange_rate }}
                  </div>
                </div>
              </td>

              <!-- Method & Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <div class="text-gray-900 dark:text-white flex items-center">
                    <component :is="getPaymentMethodIcon(payment.payment_method)" class="h-4 w-4 mr-2" />
                    {{ getPaymentMethodLabel(payment.payment_method) }}
                  </div>
                  <div class="text-gray-500 dark:text-gray-400">
                    {{ formatDate(payment.payment_date) }}
                  </div>
                  <div v-if="payment.verified_at" class="text-green-600 dark:text-green-400 text-xs">
                    Verified: {{ formatDate(payment.verified_at) }}
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col space-y-1">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(payment.status)"
                  >
                    {{ getStatusLabel(payment.status) }}
                  </span>
                  <span
                    v-if="payment.verified_at"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  >
                    Verified
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <!-- View -->
                  <router-link
                    :to="`/payments/${payment.id}`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                    title="View Payment"
                  >
                    <Eye class="h-4 w-4" />
                  </router-link>

                  <!-- Verify (only for pending/completed payments not yet verified) -->
                  <button
                    v-if="['pending', 'completed'].includes(payment.status) && !payment.verified_at"
                    @click="verifyPayment(payment)"
                    class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors duration-200"
                    title="Verify Payment"
                  >
                    <CheckCircle class="h-4 w-4" />
                  </button>

                  <!-- Edit (only for pending payments) -->
                  <router-link
                    v-if="payment.status === 'pending'"
                    :to="`/payments/${payment.id}/edit`"
                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200"
                    title="Edit Payment"
                  >
                    <Pencil class="h-4 w-4" />
                  </router-link>

                  <!-- View Client -->
                  <router-link
                    :to="`/clients/${payment.client_id}`"
                    class="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors duration-200"
                    title="View Client"
                  >
                    <User class="h-4 w-4" />
                  </router-link>

                  <!-- Delete (only for pending payments) -->
                  <button
                    v-if="payment.status === 'pending'"
                    @click="confirmDelete(payment)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                    title="Delete Payment"
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
                Delete Payment
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete payment "{{ paymentToDelete?.transaction_number }}"? This action cannot be undone and will affect the client's balance.
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  Plus,
  Search,
  CreditCard,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  DollarSign,
  Clock,
  TrendingUp,
  Banknote,
  Smartphone,
  Building,
  Wallet,
  Bitcoin
} from 'lucide-vue-next'

const router = useRouter()
const notifications = useNotifications()

// Types
interface Client {
  id: number
  name: string
  email?: string
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
  total_payments: number
  total_received: number
  pending_amount: number
  this_month: number
}

// State
const loading = ref(false)
const deleting = ref(false)
const payments = ref<Payment[]>([])
const clients = ref<Client[]>([])
const pagination = ref<Pagination | null>(null)
const showDeleteModal = ref(false)
const paymentToDelete = ref<Payment | null>(null)
const searchTimeout = ref<number | null>(null)

const stats = ref<Stats>({
  total_payments: 0,
  total_received: 0,
  pending_amount: 0,
  this_month: 0
})

const filters = reactive({
  search: '',
  status: '',
  payment_method: '',
  client_id: '',
  per_page: 15
})

// Methods
const fetchPayments = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: filters.per_page.toString()
    })

    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.payment_method) params.append('payment_method', filters.payment_method)
    if (filters.client_id) params.append('client_id', filters.client_id)

    const response = await axios.get(`/payments?${params}`)
    payments.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error: any) {
    notifications.error('Failed to load payments', {
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
    const response = await axios.get('/payments/stats')
    stats.value = response.data.data
  } catch (error: any) {
    console.error('Failed to load payment stats:', error)
  }
}

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    fetchPayments(1)
  }, 300)
}

const changePage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.last_page) {
    fetchPayments(page)
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
    crypto: 'Crypto',
    other: 'Other'
  }
  return labels[method as keyof typeof labels] || method
}

const verifyPayment = async (payment: Payment) => {
  try {
    const response = await axios.patch(`/payments/${payment.id}/verify`)
    
    // Update the payment in the list
    const index = payments.value.findIndex(p => p.id === payment.id)
    if (index !== -1) {
      payments.value[index] = response.data.data
    }
    
    notifications.success('Payment verified successfully', {
      title: 'Success'
    })
    
    // Refresh stats
    await fetchStats()
  } catch (error: any) {
    notifications.error('Failed to verify payment', {
      title: 'Error'
    })
  }
}

const confirmDelete = (payment: Payment) => {
  paymentToDelete.value = payment
  showDeleteModal.value = true
}

const deletePayment = async () => {
  if (!paymentToDelete.value) return

  deleting.value = true
  try {
    await axios.delete(`/payments/${paymentToDelete.value.id}`)
    notifications.success('Payment deleted successfully', {
      title: 'Success'
    })
    showDeleteModal.value = false
    paymentToDelete.value = null
    await fetchPayments(pagination.value?.current_page || 1)
    await fetchStats()
  } catch (error: any) {
    notifications.error('Failed to delete payment', {
      title: 'Error'
    })
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchPayments(),
    fetchClients(),
    fetchStats()
  ])
})
</script>