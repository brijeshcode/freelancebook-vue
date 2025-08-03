<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading service details...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="service" class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div class="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Settings class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ service.title }}</h1>
            <div class="flex items-center space-x-2 mt-1">
              <span class="text-sm text-gray-500 dark:text-gray-400">Service #{{ service.id }}</span>
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(service.status)"
              >
                {{ getStatusLabel(service.status) }}
              </span>
              <span
                v-if="!service.is_active"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
              >
                Inactive
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              <span v-if="service.client">{{ service.client.name }}</span>
              <span v-if="service.project"> • {{ service.project.name }}</span>
              <span class="capitalize"> • {{ service.frequency.replace('-', ' ') }}</span>
            </p>
          </div>
        </div>

        <div class="mt-4 lg:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            @click="toggleActiveStatus"
            :class="service.is_active 
              ? 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800' 
              : 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <component :is="service.is_active ? Pause : Play" class="h-5 w-5 mr-2" />
            {{ service.is_active ? 'Deactivate' : 'Activate' }}
          </button>
          <router-link
            :to="`/services/${service.id}/edit`"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <Pencil class="h-5 w-5 mr-2" />
            Edit Service
          </router-link>
          <router-link
            to="/services"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <ArrowLeft class="h-5 w-5 mr-2" />
            Back to Services
          </router-link>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Base Amount Card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <DollarSign class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Base Amount</dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ service.currency }} {{ formatCurrency(service.base_amount) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Tax Amount Card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Receipt class="h-6 w-6 text-yellow-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {{ service.has_tax ? `${service.tax_name || 'Tax'} (${service.tax_rate}%)` : 'Tax' }}
                  </dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ service.has_tax 
                      ? `${service.currency} ${formatCurrency(service.tax_amount)}` 
                      : 'Not applicable' 
                    }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Amount Card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CreditCard class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Amount</dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ service.currency }} {{ formatCurrency(service.total_amount) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Billing Frequency Card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Calendar class="h-6 w-6 text-purple-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Billing</dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white capitalize">
                    {{ service.frequency.replace('-', ' ') }}
                  </dd>
                  <dd v-if="service.billing_count > 0" class="text-xs text-gray-500 dark:text-gray-400">
                    Billed {{ service.billing_count }} times
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Information Tabs -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
              :class="activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'"
            >
              <component :is="tab.icon" class="h-5 w-5 inline mr-2" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Details Tab -->
          <div v-if="activeTab === 'details'">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Basic Information -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                <dl class="space-y-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Service Status</dt>
                    <dd class="mt-1 flex items-center space-x-2">
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusClass(service.status)"
                      >
                        {{ getStatusLabel(service.status) }}
                      </span>
                      <span
                        v-if="!service.is_active"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                      >
                        Inactive
                      </span>
                    </dd>
                  </div>
                  <div v-if="service.client">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Client</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      <router-link 
                        :to="`/clients/${service.client.id}`"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {{ service.client.name }}
                      </router-link>
                    </dd>
                  </div>
                  <div v-if="service.project">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Project</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      <router-link 
                        :to="`/projects/${service.project.id}`"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {{ service.project.name }}
                      </router-link>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(service.created_at) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(service.updated_at) }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Pricing Information -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Pricing Breakdown</h3>
                <dl class="space-y-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Base Amount</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ service.currency }} {{ formatCurrency(service.base_amount) }}
                    </dd>
                  </div>
                  <div v-if="service.has_tax">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {{ service.tax_name }} ({{ service.tax_rate }}% {{ service.tax_type }})
                    </dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ service.currency }} {{ formatCurrency(service.tax_amount) }}
                    </dd>
                  </div>
                  <div class="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</dt>
                    <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {{ service.currency }} {{ formatCurrency(service.total_amount) }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Billing Schedule -->
            <div class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Billing Schedule</h3>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Frequency</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                    {{ service.frequency.replace('-', ' ') }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDate(service.start_date) }}
                  </dd>
                </div>
                <div v-if="service.next_billing_date">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Next Billing</dt>
                  <dd class="mt-1 text-sm" :class="isOverdue() ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'">
                    {{ formatDate(service.next_billing_date) }}
                    <span v-if="isOverdue()" class="ml-1 text-xs font-semibold">OVERDUE</span>
                  </dd>
                </div>
                <div v-if="service.end_date">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDate(service.end_date) }}
                  </dd>
                </div>
              </div>

              <!-- Billing Statistics -->
              <div v-if="service.billing_count > 0" class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Times Billed</dt>
                  <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {{ service.billing_count }}
                  </dd>
                </div>
                <div v-if="service.last_billed_at">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Billed</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDate(service.last_billed_at) }}
                  </dd>
                </div>
              </div>

              <!-- Overdue Warning -->
              <div v-if="isOverdue()" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div class="flex">
                  <AlertTriangle class="h-5 w-5 text-red-400" />
                  <div class="ml-3">
                    <p class="text-sm text-red-800 dark:text-red-400">
                      <strong>Billing Overdue:</strong> This service's next billing date has passed.
                    </p>
                    <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                      Consider creating an invoice or updating the billing schedule.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Service Description -->
            <div v-if="service.description" class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Service Description</h3>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ service.description }}</p>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="service.tags && service.tags.length > 0" class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in service.tags"
                  :key="tag"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="service.notes" class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Internal Notes</h3>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ service.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Invoices Tab -->
          <div v-else-if="activeTab === 'invoices'">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Service Invoices</h3>
              <router-link
                :to="{ path: '/invoices/create', query: { service_id: service.id } }"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                <FileText class="h-4 w-4 mr-2" />
                Create Invoice
              </router-link>
            </div>

            <!-- Invoices Placeholder -->
            <div class="text-center py-12">
              <FileText class="h-12 w-12 mx-auto text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Invoices will be listed here</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Invoice integration with service details coming soon.
              </p>
            </div>
          </div>

          <!-- History Tab -->
          <div v-else-if="activeTab === 'history'">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Billing History</h3>
            
            <!-- History Timeline Placeholder -->
            <div class="text-center py-12">
              <Clock class="h-12 w-12 mx-auto text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {{ service.billing_count > 0 ? 'Detailed billing history coming soon' : 'No billing history yet' }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ service.billing_count > 0 
                  ? `This service has been billed ${service.billing_count} times.`
                  : 'Billing history will appear here once invoices are created.'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <AlertTriangle class="h-12 w-12 mx-auto text-red-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Failed to load service</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        The service could not be found or you don't have permission to view it.
      </p>
      <div class="mt-6">
        <router-link
          to="/services"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          Back to Services
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowLeft,
  Settings,
  Pencil,
  Pause,
  Play,
  DollarSign,
  Receipt,
  CreditCard,
  Calendar,
  Clock,
  FileText,
  Info,
  AlertTriangle,
  Loader2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const notifications = useNotifications()

// Types
interface Client {
  id: number
  name: string
}

interface Project {
  id: number
  name: string
}

interface Service {
  id: number
  client_id: number
  project_id: number | null
  title: string
  description: string | null
  amount: number
  currency: string
  has_tax: boolean
  tax_name: string | null
  tax_rate: number
  tax_type: 'inclusive' | 'exclusive'
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly'
  start_date: string
  next_billing_date: string | null
  end_date: string | null
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'pending_approval'
  is_active: boolean
  billing_count: number
  last_billed_at: string | null
  tags: string[] | null
  notes: string | null
  base_amount: number
  tax_amount: number
  total_amount: number
  client: Client | null
  project: Project | null
  created_at: string
  updated_at: string
}

// State
const loading = ref(true)
const service = ref<Service | null>(null)
const activeTab = ref('details')

// Tabs configuration
const tabs = [
  { id: 'details', name: 'Details', icon: Info },
  { id: 'invoices', name: 'Invoices', icon: FileText },
  { id: 'history', name: 'History', icon: Clock }
]

// Methods
const fetchService = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/services/${route.params.id}`)
    service.value = response.data.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      notifications.error('Service not found', {
        title: 'Error'
      })
      router.push('/services')
    } else if (error.response?.status === 403) {
      notifications.error('You do not have permission to view this service', {
        title: 'Access Denied'
      })
      router.push('/services')
    } else {
      notifications.error('Failed to load service details', {
        title: 'Error'
      })
    }
  } finally {
    loading.value = false
  }
}

const toggleActiveStatus = async () => {
  if (!service.value) return

  try {
    const response = await axios.patch(`/services/${service.value.id}/toggle-status`)
    service.value = response.data.data
    
    notifications.success(
      `Service ${service.value.is_active ? 'activated' : 'deactivated'} successfully`,
      { title: 'Success' }
    )
  } catch (error: any) {
    notifications.error('Failed to toggle service status', {
      title: 'Error'
    })
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
    month: 'long',
    day: 'numeric'
  })
}

const getStatusClass = (status: string): string => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    pending_approval: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  }
  return classes[status as keyof typeof classes] || classes.draft
}

const getStatusLabel = (status: string): string => {
  const labels = {
    draft: 'Draft',
    active: 'Active',
    paused: 'Paused',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pending_approval: 'Pending Approval'
  }
  return labels[status as keyof typeof labels] || status
}

const isOverdue = (): boolean => {
  if (!service.value?.next_billing_date || 
      service.value.status === 'completed' || 
      service.value.status === 'cancelled' ||
      !service.value.is_active) {
    return false
  }
  return new Date(service.value.next_billing_date) < new Date()
}

// Lifecycle
onMounted(() => {
  fetchService()
})
</script>