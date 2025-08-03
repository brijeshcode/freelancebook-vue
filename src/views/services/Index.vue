<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your services and recurring billing
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link
          to="/services/create"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <Plus class="h-5 w-5 mr-2" />
          Add Service
        </router-link>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Services
          </label>
          <div class="relative">
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Search by title..."
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
            @change="fetchServices"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending_approval">Pending Approval</option>
          </select>
        </div>

        <!-- Frequency Filter -->
        <div>
          <label for="frequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Frequency
          </label>
          <select
            id="frequency"
            v-model="filters.frequency"
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
            @change="fetchServices"
          >
            <option value="">All Frequencies</option>
            <option value="one-time">One-time</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half-yearly">Half-yearly</option>
            <option value="yearly">Yearly</option>
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
            @change="fetchServices"
          >
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Services Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading services...</p>
      </div>

      <div v-else-if="services.length === 0" class="p-8 text-center">
        <Settings class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No services found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ filters.search ? 'Try adjusting your search criteria.' : 'Get started by creating your first service.' }}
        </p>
        <div v-if="!filters.search" class="mt-6">
          <router-link
            to="/services/create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            <Plus class="h-5 w-5 mr-2" />
            Add Your First Service
          </router-link>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Service
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client/Project
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Pricing
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Billing
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
            <tr v-for="service in services" :key="service.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <!-- Service Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Settings class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ service.title }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      ID: {{ service.id }}
                      <span v-if="service.has_tax" class="ml-2">
                        • {{ service.tax_name }} {{ service.tax_rate }}%
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Client/Project Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ service.client?.name || 'No client' }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ service.project?.name || 'No project' }}
                </div>
              </td>

              <!-- Pricing -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <div class="text-gray-900 dark:text-white">
                    {{ service.currency }} {{ formatCurrency(service.base_amount) }}
                  </div>
                  <div v-if="service.has_tax" class="text-gray-500 dark:text-gray-400">
                    Total: {{ service.currency }} {{ formatCurrency(service.total_amount) }}
                  </div>
                </div>
              </td>

              <!-- Billing -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <div class="text-gray-900 dark:text-white capitalize">
                    {{ service.frequency.replace('-', ' ') }}
                  </div>
                  <div v-if="service.next_billing_date" class="text-gray-500 dark:text-gray-400">
                    Next: {{ formatDate(service.next_billing_date) }}
                  </div>
                  <div v-if="service.billing_count > 0" class="text-gray-500 dark:text-gray-400">
                    Billed {{ service.billing_count }} times
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col space-y-1">
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
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <!-- View -->
                  <router-link
                    :to="`/services/${service.id}`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                    title="View Service"
                  >
                    <Eye class="h-4 w-4" />
                  </router-link>

                  <!-- Toggle Active Status -->
                  <button
                    @click="toggleStatus(service)"
                    :class="service.is_active 
                      ? 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300' 
                      : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'"
                    class="transition-colors duration-200"
                    :title="service.is_active ? 'Deactivate Service' : 'Activate Service'"
                  >
                    <component :is="service.is_active ? Pause : Play" class="h-4 w-4" />
                  </button>

                  <!-- Edit -->
                  <router-link
                    :to="`/services/${service.id}/edit`"
                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200"
                    title="Edit Service"
                  >
                    <Pencil class="h-4 w-4" />
                  </router-link>

                  <!-- Delete -->
                  <button
                    @click="confirmDelete(service)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                    title="Delete Service"
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
                Delete Service
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete "{{ serviceToDelete?.title }}"? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="deleteService"
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
  Settings,
  Eye,
  Pencil,
  Trash2,
  Pause,
  Play,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-vue-next'

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

// State
const loading = ref(false)
const deleting = ref(false)
const services = ref<Service[]>([])
const pagination = ref<Pagination | null>(null)
const showDeleteModal = ref(false)
const serviceToDelete = ref<Service | null>(null)
const searchTimeout = ref<number | null>(null)

const filters = reactive({
  search: '',
  status: '',
  frequency: '',
  per_page: 15
})

// Methods
const fetchServices = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: filters.per_page.toString()
    })

    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.frequency) params.append('frequency', filters.frequency)

    const response = await axios.get(`/services?${params}`)
    services.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error: any) {
    notifications.error('Failed to load services', {
      title: 'Error'
    })
  } finally {
    loading.value = false
  }
}

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    fetchServices(1)
  }, 300)
}

const changePage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.last_page) {
    fetchServices(page)
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

const toggleStatus = async (service: Service) => {
  try {
    const response = await axios.patch(`/services/${service.id}/toggle-status`)
    
    // Update the service in the list
    const index = services.value.findIndex(s => s.id === service.id)
    if (index !== -1) {
      services.value[index] = response.data.data
    }
    
    notifications.success(
      `Service ${response.data.data.is_active ? 'activated' : 'deactivated'} successfully`,
      { title: 'Success' }
    )
  } catch (error: any) {
    notifications.error('Failed to toggle service status', {
      title: 'Error'
    })
  }
}

const confirmDelete = (service: Service) => {
  serviceToDelete.value = service
  showDeleteModal.value = true
}

const deleteService = async () => {
  if (!serviceToDelete.value) return

  deleting.value = true
  try {
    await axios.delete(`/services/${serviceToDelete.value.id}`)
    notifications.success('Service deleted successfully', {
      title: 'Success'
    })
    showDeleteModal.value = false
    serviceToDelete.value = null
    await fetchServices(pagination.value?.current_page || 1)
  } catch (error: any) {
    notifications.error('Failed to delete service', {
      title: 'Error'
    })
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchServices()
})
</script>