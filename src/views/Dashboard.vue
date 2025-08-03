<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's your business overview.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-2">
        <select
          v-model="selectedPeriod"
          @change="fetchDashboardData"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="365">Last year</option>
        </select>
        <button
          @click="fetchDashboardData"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 transition-colors duration-200"
        >
          <RefreshCw :class="['h-4 w-4 mr-2', loading && 'animate-spin']" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !dashboardData" class="flex justify-center items-center py-12">
      <Loader2 class="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading dashboard...</span>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Revenue -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <DollarSign class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Revenue
                  </dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(dashboardData?.metrics.total_revenue || 0) }}
                  </dd>
                  <dd class="text-sm text-green-600 dark:text-green-400" v-if="dashboardData?.metrics.revenue_growth">
                    +{{ dashboardData.metrics.revenue_growth }}% from last period
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Outstanding Balance -->
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
                    {{ formatCurrency(dashboardData?.metrics.outstanding_balance || 0) }}
                  </dd>
                  <dd class="text-sm text-gray-500 dark:text-gray-400">
                    {{ dashboardData?.metrics.overdue_invoices || 0 }} overdue invoices
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Clients -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Users class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Clients
                  </dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ dashboardData?.metrics.active_clients || 0 }}
                  </dd>
                  <dd class="text-sm text-gray-500 dark:text-gray-400">
                    {{ dashboardData?.metrics.total_clients || 0 }} total clients
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- This Month Revenue -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <TrendingUp class="h-6 w-6 text-purple-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    This Month
                  </dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(dashboardData?.metrics.this_month_revenue || 0) }}
                  </dd>
                  <dd class="text-sm text-gray-500 dark:text-gray-400">
                    {{ dashboardData?.metrics.this_month_invoices || 0 }} invoices sent
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Trend Chart -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Revenue Trend
            </h3>
            <div class="h-64">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Payment Status Chart -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Payment Status
            </h3>
            <div class="h-64">
              <canvas ref="paymentChart"></canvas>
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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <router-link
              to="/invoices/create"
              class="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              <FileText class="h-5 w-5 mr-2" />
              Create Invoice
            </router-link>
            
            <router-link
              to="/payments/create"
              class="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors duration-200"
            >
              <CreditCard class="h-5 w-5 mr-2" />
              Record Payment
            </router-link>
            
            <router-link
              to="/clients/create"
              class="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-200"
            >
              <UserPlus class="h-5 w-5 mr-2" />
              Add Client
            </router-link>
            
            <router-link
              to="/services/create"
              class="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 transition-colors duration-200"
            >
              <Settings class="h-5 w-5 mr-2" />
              Add Service
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recent Activity & Top Clients -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Invoices -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Recent Invoices
              </h3>
              <router-link
                to="/invoices"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
              >
                View all
              </router-link>
            </div>
            
            <div v-if="dashboardData?.recent_invoices?.length === 0" class="text-center py-6">
              <FileText class="h-8 w-8 mx-auto text-gray-400" />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No recent invoices</p>
            </div>
            
            <div v-else class="space-y-3">
              <div
                v-for="invoice in dashboardData?.recent_invoices"
                :key="invoice.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <FileText class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="ml-3">
                    <router-link
                      :to="`/invoices/${invoice.id}`"
                      class="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {{ invoice.invoice_number }}
                    </router-link>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ invoice.client?.name }} • {{ formatDate(invoice.invoice_date) }}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ invoice.currency }} {{ formatCurrency(invoice.total_amount) }}
                  </div>
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(invoice.status)"
                  >
                    {{ getStatusLabel(invoice.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Clients -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Top Clients
              </h3>
              <router-link
                to="/clients"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
              >
                View all
              </router-link>
            </div>
            
            <div v-if="dashboardData?.top_clients?.length === 0" class="text-center py-6">
              <Users class="h-8 w-8 mx-auto text-gray-400" />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No clients yet</p>
            </div>
            
            <div v-else class="space-y-3">
              <div
                v-for="client in dashboardData?.top_clients"
                :key="client.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div class="ml-3">
                    <router-link
                      :to="`/clients/${client.id}`"
                      class="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {{ client.name }}
                    </router-link>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ client.total_invoices }} invoices
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(client.total_revenue) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    Outstanding: {{ formatCurrency(client.outstanding_balance) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Due Dates -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Upcoming Due Dates
            </h3>
            <router-link
              to="/invoices?status=sent"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
            >
              View sent invoices
            </router-link>
          </div>
          
          <div v-if="dashboardData?.upcoming_dues?.length === 0" class="text-center py-6">
            <Calendar class="h-8 w-8 mx-auto text-gray-400" />
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No upcoming due dates</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
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
                    Due Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="invoice in dashboardData?.upcoming_dues"
                  :key="invoice.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <router-link
                      :to="`/invoices/${invoice.id}`"
                      class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      {{ invoice.invoice_number }}
                    </router-link>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ invoice.client?.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ invoice.currency }} {{ formatCurrency(invoice.total_amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span :class="getDueDateClass(invoice.due_date)">
                      {{ formatDate(invoice.due_date) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusClass(invoice.status)"
                    >
                      {{ getStatusLabel(invoice.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import Chart from 'chart.js/auto'
import {
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  RefreshCw,
  Loader2,
  FileText,
  CreditCard,
  UserPlus,
  Settings,
  User,
  Calendar
} from 'lucide-vue-next'

const notifications = useNotifications()

// Types
interface DashboardMetrics {
  total_revenue: number
  outstanding_balance: number
  active_clients: number
  total_clients: number
  this_month_revenue: number
  this_month_invoices: number
  overdue_invoices: number
  revenue_growth?: number
}

interface RecentInvoice {
  id: number
  invoice_number: string
  total_amount: number
  currency: string
  status: string
  invoice_date: string
  client: {
    name: string
  }
}

interface TopClient {
  id: number
  name: string
  total_revenue: number
  outstanding_balance: number
  total_invoices: number
}

interface UpcomingDue {
  id: number
  invoice_number: string
  total_amount: number
  currency: string
  due_date: string
  status: string
  client: {
    name: string
  }
}

interface DashboardData {
  metrics: DashboardMetrics
  recent_invoices: RecentInvoice[]
  top_clients: TopClient[]
  upcoming_dues: UpcomingDue[]
  revenue_chart: {
    labels: string[]
    data: number[]
  }
  payment_status_chart: {
    labels: string[]
    data: number[]
  }
}

// State
const loading = ref(false)
const dashboardData = ref<DashboardData | null>(null)
const selectedPeriod = ref(30)
const revenueChart = ref<HTMLCanvasElement>()
const paymentChart = ref<HTMLCanvasElement>()

let revenueChartInstance: Chart | null = null
let paymentChartInstance: Chart | null = null

// Methods
const fetchDashboardData = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/dashboard?period=${selectedPeriod.value}`)
    dashboardData.value = response.data.data
    
    // Update charts after data is loaded
    await nextTick()
    updateCharts()
  } catch (error: any) {
    notifications.error('Failed to load dashboard data', {
      title: 'Error'
    })
  } finally {
    loading.value = false
  }
}

const updateCharts = () => {
  if (!dashboardData.value) return
  
  // Revenue Chart
  if (revenueChart.value) {
    if (revenueChartInstance) {
      revenueChartInstance.destroy()
    }
    
    const ctx = revenueChart.value.getContext('2d')
    if (ctx) {
      revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dashboardData.value.revenue_chart.labels,
          datasets: [{
            label: 'Revenue',
            data: dashboardData.value.revenue_chart.data,
            borderColor: '#3B82F6',
            backgroundColor: '#3B82F6',
            tension: 0.4,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return formatCurrency(Number(value))
                }
              }
            }
          }
        }
      })
    }
  }
  
  // Payment Status Chart
  if (paymentChart.value) {
    if (paymentChartInstance) {
      paymentChartInstance.destroy()
    }
    
    const ctx = paymentChart.value.getContext('2d')
    if (ctx) {
      paymentChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: dashboardData.value.payment_status_chart.labels,
          datasets: [{
            data: dashboardData.value.payment_status_chart.data,
            backgroundColor: [
              '#10B981', // Green for paid
              '#F59E0B', // Yellow for pending
              '#EF4444', // Red for overdue
              '#6B7280'  // Gray for others
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }
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

const getDueDateClass = (dueDate: string): string => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'text-red-600 dark:text-red-400 font-medium' // Overdue
  } else if (diffDays <= 3) {
    return 'text-yellow-600 dark:text-yellow-400 font-medium' // Due soon
  } else {
    return 'text-gray-900 dark:text-white' // Normal
  }
}

// Lifecycle
onMounted(() => {
  fetchDashboardData()
})
</script>