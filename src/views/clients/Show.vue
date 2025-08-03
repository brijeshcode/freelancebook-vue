<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading client details...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="client" class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div class="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Building2 v-if="client.type === 'company'" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <User v-else class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ client.name }}</h1>
            <div class="flex items-center space-x-2 mt-1">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ client.client_code }}</span>
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(client.status)"
              >
                {{ client.status }}
              </span>
            </div>
            <p v-if="client.contact_person" class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Contact: {{ client.contact_person }}
            </p>
          </div>
        </div>

        <div class="mt-4 lg:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            @click="addProject"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <Plus class="h-5 w-5 mr-2" />
            Add Project
          </button>
          <router-link
            :to="`/clients/${client.id}/edit`"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <Pencil class="h-5 w-5 mr-2" />
            Edit Client
          </router-link>
          <router-link
            to="/clients"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <ArrowLeft class="h-5 w-5 mr-2" />
            Back to Clients
          </router-link>
        </div>
      </div>

      <!-- Financial Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <DollarSign class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Billed</dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    ${{ formatCurrency(client.financial.total_billed) }}
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
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Received</dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    ${{ formatCurrency(client.financial.total_received) }}
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
                <AlertCircle 
                  :class="client.financial.current_balance > 0 ? 'text-red-400' : 'text-green-400'" 
                  class="h-6 w-6" 
                />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Current Balance</dt>
                  <dd 
                    class="text-lg font-medium"
                    :class="client.financial.current_balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                  >
                    ${{ formatCurrency(client.financial.current_balance) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Client Information Tabs -->
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
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Client Type</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white capitalize flex items-center">
                      <Building2 v-if="client.type === 'company'" class="h-4 w-4 mr-1" />
                      <User v-else class="h-4 w-4 mr-1" />
                      {{ client.type }}
                    </dd>
                  </div>
                  <div v-if="client.contact_person">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ client.contact_person }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                    <dd class="mt-1">
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusClass(client.status)"
                      >
                        {{ client.status }}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(client.created_at) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(client.updated_at) }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Contact Information -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <dl class="space-y-3">
                  <div v-if="client.email">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      <a :href="`mailto:${client.email}`" class="text-blue-600 dark:text-blue-400 hover:underline">
                        {{ client.email }}
                      </a>
                    </dd>
                  </div>
                  <div v-if="client.phone">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      <a :href="`tel:${client.phone}`" class="text-blue-600 dark:text-blue-400 hover:underline">
                        {{ client.phone }}
                      </a>
                    </dd>
                  </div>
                  <div v-if="client.website">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Website</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      <a :href="client.website" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        {{ client.website }}
                        <ExternalLink class="h-4 w-4 ml-1" />
                      </a>
                    </dd>
                  </div>
                  <div v-if="hasAddress">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-line">{{ fullAddress }}</dd>
                  </div>
                  <div v-if="client.tax_number">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tax Number</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ client.tax_number }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Notes Section -->
            <div v-if="client.notes" class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Internal Notes</h3>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ client.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Projects Tab -->
          <div v-else-if="activeTab === 'projects'">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Projects</h3>
              <button
                @click="addProject"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                <Plus class="h-4 w-4 mr-2" />
                Add Project
              </button>
            </div>

            <!-- Projects List Placeholder -->
            <div class="text-center py-12">
              <Folder class="h-12 w-12 mx-auto text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects yet</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create your first project for this client to get started.
              </p>
              <div class="mt-6">
                <button
                  @click="addProject"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors duration-200"
                >
                  <Plus class="h-4 w-4 mr-2" />
                  Add First Project
                </button>
              </div>
            </div>
          </div>

          <!-- Invoices Tab -->
          <div v-else-if="activeTab === 'invoices'">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Invoices</h3>
              <router-link
                to="/invoices/create"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                <FileText class="h-4 w-4 mr-2" />
                Create Invoice
              </router-link>
            </div>

            <!-- Invoices List Placeholder -->
            <div class="text-center py-12">
              <FileText class="h-12 w-12 mx-auto text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices yet</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create your first invoice for this client.
              </p>
              <div class="mt-6">
                <router-link
                  to="/invoices/create"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
                >
                  <FileText class="h-4 w-4 mr-2" />
                  Create First Invoice
                </router-link>
              </div>
            </div>
          </div>

          <!-- Activity Tab -->
          <div v-else-if="activeTab === 'activity'">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            
            <!-- Activity Timeline Placeholder -->
            <div class="text-center py-12">
              <Clock class="h-12 w-12 mx-auto text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No activity yet</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Client activity will appear here as you work together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <AlertTriangle class="h-12 w-12 mx-auto text-red-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Failed to load client</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        The client could not be found or you don't have permission to view it.
      </p>
      <div class="mt-6">
        <router-link
          to="/clients"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          Back to Clients
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowLeft,
  Building2,
  User,
  Pencil,
  Plus,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Info,
  Folder,
  FileText,
  Clock,
  ExternalLink,
  Eye,
  Loader2,
  AlertTriangle
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const notifications = useNotifications()

// Types
interface Client {
  id: number
  name: string
  type: 'individual' | 'company'
  contact_person: string | null
  client_code: string
  email: string | null
  phone: string | null
  website: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  postal_code: string | null
  tax_number: string | null
  notes: string | null
  status: 'active' | 'inactive' | 'archived'
  billing_preferences: any
  financial: {
    total_billed: number
    total_received: number
    current_balance: number
  }
  created_at: string
  updated_at: string
}

// State
const loading = ref(true)
const client = ref<Client | null>(null)
const activeTab = ref('details')

// Tabs configuration
const tabs = [
  { id: 'details', name: 'Details', icon: Info },
  { id: 'projects', name: 'Projects', icon: Folder },
  { id: 'invoices', name: 'Invoices', icon: FileText },
  { id: 'activity', name: 'Activity', icon: Clock }
]

// Computed
const hasAddress = computed(() => {
  if (!client.value) return false
  return !!(client.value.address || client.value.city || client.value.state || client.value.country || client.value.postal_code)
})

const fullAddress = computed(() => {
  if (!client.value) return ''
  
  const parts = []
  if (client.value.address) parts.push(client.value.address)
  
  const cityStateZip = [client.value.city, client.value.state, client.value.postal_code]
    .filter(Boolean)
    .join(', ')
  if (cityStateZip) parts.push(cityStateZip)
  
  if (client.value.country) parts.push(client.value.country)
  
  return parts.join('\n')
})

// Methods
const fetchClient = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/clients/${route.params.id}`)
    client.value = response.data.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      notifications.error('Client not found', {
        title: 'Error'
      })
      router.push('/clients')
    } else if (error.response?.status === 403) {
      notifications.error('You do not have permission to view this client', {
        title: 'Access Denied'
      })
      router.push('/clients')
    } else {
      notifications.error('Failed to load client details', {
        title: 'Error'
      })
    }
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

const getStatusClass = (status: string): string => {
  const classes = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    inactive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
  return classes[status as keyof typeof classes] || classes.active
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const addProject = () => {
  if (!client.value) return
  router.push({
    path: '/projects/create',
    query: { client_id: client.value.id.toString() }
  })
}

// Lifecycle
onMounted(() => {
  fetchClient()
})
</script>