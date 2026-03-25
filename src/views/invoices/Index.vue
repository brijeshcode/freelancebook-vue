<template>
  <div class="space-y-6 min-w-0 overflow-x-hidden">
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
      <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
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

        <!-- Billing Month -->
        <div>
          <label for="billing-month" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Billing Month
          </label>
          <input
            id="billing-month"
            v-model="filters.billing_month"
            type="month"
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

        <!-- Clear Filters -->
        <div v-if="hasActiveFilters" class="flex items-end">
          <button
            @click="invoiceStore.resetFilters()"
            class="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <X class="h-4 w-4 mr-1.5" />
            Clear Filters
          </button>
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
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
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
                Invoice Month
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
                    {{ invoice.currency?.symbol }} {{ formatCurrency(invoice.total_amount) }}
                  </div>
                  <div v-if="invoice.tax_amount > 0" class="text-gray-500 dark:text-gray-400">
                    Tax: {{ invoice.currency?.symbol }} {{ formatCurrency(invoice.tax_amount) }}
                  </div>
                  <div class="text-gray-500 dark:text-gray-400">
                    Base Total: {{ formatCurrency(invoice.total_amount_base_currency) }}
                  </div>
                </div>
              </td>

              <!-- Invoice Month -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ invoice.billing_month ? new Date(invoice.billing_month).toLocaleString('en-US', { month: 'long', year: 'numeric' }) : '—' }}
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
                  <InvoiceStatusDropdown
                    :invoice-id="invoice.id"
                    :status="invoice.status"
                  />
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

                  <!-- Print Preview -->
                  <router-link
                    :to="`/invoices/${invoice.id}/print`"
                    class="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                    title="Print Invoice"
                  >
                    <Printer class="h-4 w-4" />
                  </router-link>

                  <!-- Edit -->
                  <router-link
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInvoiceStore } from '@/stores/InvoiceStore'
import { useClientStore } from '@/stores/ClientStore'
import { useNotifications } from '@/composables/useNotifications'
import {
  Plus,
  Search,
  FileText,
  Eye,
  Pencil,
  Printer,
  Trash2,
  Send,
  Download,
  Copy,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  DollarSign,
  Clock,
  X
} from 'lucide-vue-next'
import type { Invoice } from '@/services/System/InvoiceService'
import InvoiceStatusDropdown from '@/Components/InvoiceStatusDropdown.vue'

const router = useRouter()
const notifications = useNotifications()

const invoiceStore = useInvoiceStore()
const clientStore = useClientStore()

const { invoices, pagination, stats, loading, deleting, filters } = storeToRefs(invoiceStore)
const { clients } = storeToRefs(clientStore)

const hasActiveFilters = computed(() =>
  !!(filters.value.search || filters.value.status || filters.value.client_id || filters.value.date_from || filters.value.billing_month)
)

// Local UI state
const showDeleteModal = ref(false)
const invoiceToDelete = ref<Invoice | null>(null)
const searchTimeout = ref<number | null>(null)

// Methods
const fetchInvoices = () => {
  invoiceStore.fetchInvoices(1)
  invoiceStore.fetchStats()
}

const debounceSearch = () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    invoiceStore.fetchInvoices(1)
    invoiceStore.fetchStats()
  }, 300)
}

const changePage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.last_page) {
    invoiceStore.fetchInvoices(page)
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


const isOverdue = (invoice: Invoice): boolean => {
  if (!invoice.due_date || invoice.status === 'paid' || invoice.status === 'cancelled') return false
  return new Date(invoice.due_date) < new Date()
}

const markAsSent = async (invoice: Invoice) => {
  const updated = await invoiceStore.markAsSent(invoice.id)
  if (updated) {
    notifications.success('Invoice marked as sent successfully', { title: 'Success' })
    await invoiceStore.fetchStats()
  } else {
    notifications.error('Failed to mark invoice as sent', { title: 'Error' })
  }
}

const downloadPDF = async (invoice: Invoice) => {
  try {
    await invoiceStore.downloadPDF(invoice.id, invoice.invoice_number)
    notifications.success('Invoice PDF downloaded successfully', { title: 'Success' })
  } catch {
    notifications.error('Failed to download invoice PDF', { title: 'Error' })
  }
}

const copyInvoice = (invoice: Invoice) => {
  router.push(`/invoices/create?copy=${invoice.id}`)
}

const confirmDelete = (invoice: Invoice) => {
  invoiceToDelete.value = invoice
  showDeleteModal.value = true
}

const deleteInvoice = async () => {
  if (!invoiceToDelete.value) return

  const success = await invoiceStore.deleteInvoice(invoiceToDelete.value.id)
  if (success) {
    notifications.success('Invoice deleted successfully', { title: 'Success' })
    showDeleteModal.value = false
    invoiceToDelete.value = null
    await invoiceStore.fetchStats()
  } else {
    notifications.error('Failed to delete invoice', { title: 'Error' })
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    invoiceStore.fetchInvoices(),
    clientStore.fetchClients(),
    invoiceStore.fetchStats(),
  ])
})
</script>