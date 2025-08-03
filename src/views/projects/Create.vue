<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Project</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new project and track its progress from start to finish
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link
          to="/projects"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <ArrowLeft class="h-5 w-5 mr-2" />
          Back to Projects
        </router-link>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Essential project details and client assignment
          </p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Project Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Name *
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.name }"
                placeholder="Enter project name"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.name) ? errors.name[0] : errors.name }}
              </p>
            </div>

            <!-- Client Selection -->
            <div>
              <label for="client_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client *
              </label>
              <div class="relative">
                <select
                  id="client_id"
                  v-model="form.client_id"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.client_id }"
                >
                  <option value="">Select a client</option>
                  <option v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.name }} ({{ client.client_code }})
                  </option>
                </select>
                <div v-if="loadingClients" class="absolute right-3 top-2.5">
                  <Loader2 class="h-5 w-5 animate-spin text-gray-400" />
                </div>
              </div>
              <p v-if="errors.client_id" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.client_id) ? errors.client_id[0] : errors.client_id }}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Don't see your client? 
                <router-link to="/clients/create" class="text-blue-600 dark:text-blue-400 hover:underline">
                  Create a new client
                </router-link>
              </p>
            </div>

            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Status *
              </label>
              <select
                id="status"
                v-model="form.status"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.status }"
              >
                <option value="prospective">Prospective</option>
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <p v-if="errors.status" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.status) ? errors.status[0] : errors.status }}
              </p>
            </div>

            <!-- Estimated Hours -->
            <div>
              <label for="estimated_hours" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Hours
              </label>
              <input
                id="estimated_hours"
                v-model.number="form.estimated_hours"
                type="number"
                step="0.25"
                min="0"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.estimated_hours }"
                placeholder="0.00"
              />
              <p v-if="errors.estimated_hours" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.estimated_hours) ? errors.estimated_hours[0] : errors.estimated_hours }}
              </p>
            </div>
          </div>

          <!-- Project Details -->
          <div>
            <label for="project_details" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Details
            </label>
            <textarea
              id="project_details"
              v-model="form.project_details"
              rows="4"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.project_details }"
              placeholder="Describe the project scope, objectives, and deliverables..."
            ></textarea>
            <p v-if="errors.project_details" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ Array.isArray(errors.project_details) ? errors.project_details[0] : errors.project_details }}
            </p>
          </div>
        </div>
      </div>

      <!-- Budget Information Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Budget Information</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set project budget and payment tracking details
          </p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Budget Amount -->
            <div>
              <label for="budget" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Budget
              </label>
              <input
                id="budget"
                v-model.number="form.budget"
                type="number"
                step="0.01"
                min="0"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.budget }"
                placeholder="0.00"
              />
              <p v-if="errors.budget" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.budget) ? errors.budget[0] : errors.budget }}
              </p>
            </div>

            <!-- Budget Currency -->
            <div>
              <label for="budget_currency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget Currency
              </label>
              <select
                id="budget_currency"
                v-model="form.budget_currency"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.budget_currency }"
                :required="!!form.budget"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
              <p v-if="errors.budget_currency" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.budget_currency) ? errors.budget_currency[0] : errors.budget_currency }}
              </p>
            </div>

            <!-- Total Paid -->
            <div>
              <label for="total_paid" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount Already Paid
              </label>
              <input
                id="total_paid"
                v-model.number="form.total_paid"
                type="number"
                step="0.01"
                min="0"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.total_paid }"
                placeholder="0.00"
              />
              <p v-if="errors.total_paid" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.total_paid) ? errors.total_paid[0] : errors.total_paid }}
              </p>
            </div>

            <!-- Payment Currency -->
            <div>
              <label for="payment_currency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Currency
              </label>
              <select
                id="payment_currency"
                v-model="form.payment_currency"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.payment_currency }"
                :required="!!form.total_paid"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
              <p v-if="errors.payment_currency" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.payment_currency) ? errors.payment_currency[0] : errors.payment_currency }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Information Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Timeline Information</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set important dates for project planning and tracking
          </p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Start Date -->
            <div>
              <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                id="start_date"
                v-model="form.start_date"
                type="date"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.start_date }"
              />
              <p v-if="errors.start_date" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.start_date) ? errors.start_date[0] : errors.start_date }}
              </p>
            </div>

            <!-- End Date -->
            <div>
              <label for="end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                id="end_date"
                v-model="form.end_date"
                type="date"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.end_date }"
                :min="form.start_date"
              />
              <p v-if="errors.end_date" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.end_date) ? errors.end_date[0] : errors.end_date }}
              </p>
            </div>

            <!-- Deadline -->
            <div>
              <label for="deadline" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deadline
              </label>
              <input
                id="deadline"
                v-model="form.deadline"
                type="date"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.deadline }"
              />
              <p v-if="errors.deadline" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.deadline) ? errors.deadline[0] : errors.deadline }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Additional Information</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Internal notes and time tracking
          </p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <!-- Actual Hours -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="actual_hours" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Actual Hours Worked
              </label>
              <input
                id="actual_hours"
                v-model.number="form.actual_hours"
                type="number"
                step="0.25"
                min="0"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.actual_hours }"
                placeholder="0.00"
              />
              <p v-if="errors.actual_hours" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.actual_hours) ? errors.actual_hours[0] : errors.actual_hours }}
              </p>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Internal Notes
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.notes }"
              placeholder="Add any internal notes about this project..."
            ></textarea>
            <p v-if="errors.notes" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ Array.isArray(errors.notes) ? errors.notes[0] : errors.notes }}
            </p>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col sm:flex-row-reverse sm:space-x-reverse sm:space-x-3 space-y-3 sm:space-y-0">
        <button
          type="submit"
          :disabled="loading"
          class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Loader2 v-if="loading" class="h-5 w-5 animate-spin mr-2" />
          {{ loading ? 'Creating Project...' : 'Create Project' }}
        </button>
        <router-link
          to="/projects"
          class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowLeft,
  Loader2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const notifications = useNotifications()

// Types
interface Client {
  id: number
  name: string
  client_code: string
}

// State
const loading = ref(false)
const loadingClients = ref(false)
const errors = ref<Record<string, string[]>>({})
const clients = ref<Client[]>([])

// Form data
const form = reactive({
  client_id: '',
  name: '',
  budget: null as number | null,
  budget_currency: 'USD',
  notes: '',
  project_details: '',
  start_date: '',
  end_date: '',
  deadline: '',
  estimated_hours: null as number | null,
  actual_hours: 0,
  total_paid: 0,
  payment_currency: 'USD',
  status: 'planned' as 'prospective' | 'planned' | 'active' | 'completed' | 'on_hold' | 'cancelled'
})

// Methods
const fetchClients = async () => {
  loadingClients.value = true
  try {
    const response = await axios.get('/clients')
    clients.value = response.data.data
    
    // Pre-select client if passed via query parameter
    if (route.query.client_id) {
      form.client_id = route.query.client_id.toString()
    }
  } catch (error: any) {
    notifications.error('Failed to load clients', {
      title: 'Error'
    })
  } finally {
    loadingClients.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    // Prepare data - clean up empty values
    const data = { ...form }
    
    // Convert empty strings to null for optional fields
    if (!data.budget) data.budget = null
    if (!data.estimated_hours) data.estimated_hours = null
    if (!data.start_date) data.start_date = null
    if (!data.end_date) data.end_date = null
    if (!data.deadline) data.deadline = null
    if (!data.notes) data.notes = null
    if (!data.project_details) data.project_details = null

    const response = await axios.post('/projects', data)
    
    notifications.success('Project created successfully', {
      title: 'Success'
    })

    // Redirect to the project details page
    router.push(`/projects/${response.data.data.id}`)
    
  } catch (error: any) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      // Handle validation errors
      errors.value = error.response.data.errors
      notifications.error('Please fix the form errors and try again', {
        title: 'Validation Error'
      })
    } else {
      notifications.error('Failed to create project', {
        title: 'Error'
      })
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchClients()
})
</script>