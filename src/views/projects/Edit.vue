<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading project details...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="project" class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update "{{ project.name }}" details and progress
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <router-link
            :to="`/projects/${project.id}`"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <Eye class="h-5 w-5 mr-2" />
            View Project
          </router-link>
          <router-link
            to="/projects"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <ArrowLeft class="h-5 w-5 mr-2" />
            Back to Projects
          </router-link>
        </div>
      </div>

      <!-- Project Info Banner -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Folder class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Project ID: {{ project.id }}
              </p>
              <p class="text-sm text-blue-600 dark:text-blue-300">
                Client: {{ project.client?.name || 'No client assigned' }} • Created {{ formatDate(project.created_at) }}
              </p>
            </div>
          </div>
          <div>
            <span
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="getStatusClass(project.status)"
            >
              {{ getStatusLabel(project.status) }}
            </span>
          </div>
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
              Update project budget and payment tracking details
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
                  Total Amount Paid
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
              Update important dates for project planning and tracking
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

        <!-- Time Tracking & Notes Card -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Time Tracking & Notes</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update time worked and internal project notes
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
                <p v-if="form.estimated_hours && form.actual_hours" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ form.actual_hours > form.estimated_hours ? 'Over estimate by' : 'Under estimate by' }}
                  {{ Math.abs(form.actual_hours - form.estimated_hours).toFixed(2) }} hours
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
            :disabled="loading || !hasChanges"
            class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Loader2 v-if="loading" class="h-5 w-5 animate-spin mr-2" />
            {{ loading ? 'Updating Project...' : 'Update Project' }}
          </button>
          <router-link
            :to="`/projects/${project.id}`"
            class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <AlertTriangle class="h-12 w-12 mx-auto text-red-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Failed to load project</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        The project could not be found or you don't have permission to edit it.
      </p>
      <div class="mt-6">
        <router-link
          to="/projects"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          Back to Projects
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowLeft,
  Eye,
  Folder,
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
  client_code: string
}

interface Project {
  id: number
  name: string
  budget: number | null
  budget_currency: string
  notes: string | null
  project_details: string | null
  start_date: string | null
  end_date: string | null
  deadline: string | null
  estimated_hours: number | null
  actual_hours: number
  total_paid: number
  payment_currency: string
  status: 'prospective' | 'planned' | 'active' | 'completed' | 'on_hold' | 'cancelled'
  client: Client | null
  freelancer: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

// State
const initialLoading = ref(true)
const loading = ref(false)
const loadingClients = ref(false)
const project = ref<Project | null>(null)
const clients = ref<Client[]>([])
const errors = ref<Record<string, string[]>>({})
const originalData = ref<any>({})

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

// Computed
const hasChanges = computed(() => {
  return JSON.stringify(form) !== JSON.stringify(originalData.value)
})

// Methods
const fetchProject = async () => {
  initialLoading.value = true
  try {
    const response = await axios.get(`/projects/${route.params.id}`)
    project.value = response.data.data
    
    // Populate form with project data
    populateForm(project.value)
    
  } catch (error: any) {
    if (error.response?.status === 404) {
      notifications.error('Project not found', {
        title: 'Error'
      })
    } else if (error.response?.status === 403) {
      notifications.error('You do not have permission to edit this project', {
        title: 'Access Denied'
      })
    } else {
      notifications.error('Failed to load project details', {
        title: 'Error'
      })
    }
  } finally {
    initialLoading.value = false
  }
}

const fetchClients = async () => {
  loadingClients.value = true
  try {
    const response = await axios.get('/clients')
    clients.value = response.data.data
  } catch (error: any) {
    notifications.error('Failed to load clients', {
      title: 'Error'
    })
  } finally {
    loadingClients.value = false
  }
}

const populateForm = (projectData: Project) => {
  form.client_id = projectData.client?.id?.toString() || ''
  form.name = projectData.name
  form.budget = projectData.budget
  form.budget_currency = projectData.budget_currency
  form.notes = projectData.notes || ''
  form.project_details = projectData.project_details || ''
  form.start_date = projectData.start_date || ''
  form.end_date = projectData.end_date || ''
  form.deadline = projectData.deadline || ''
  form.estimated_hours = projectData.estimated_hours
  form.actual_hours = projectData.actual_hours
  form.total_paid = projectData.total_paid
  form.payment_currency = projectData.payment_currency
  form.status = projectData.status

  // Store original data for comparison
  originalData.value = { ...form }
}

const handleSubmit = async () => {
  if (!hasChanges.value) {
    notifications.info('No changes detected', {
      title: 'Info'
    })
    return
  }

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

    const response = await axios.put(`/projects/${route.params.id}`, data)
    
    notifications.success('Project updated successfully', {
      title: 'Success'
    })

    // Update the project data and original form data
    project.value = response.data.data
    populateForm(project.value)
    
  } catch (error: any) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      // Handle validation errors
      errors.value = error.response.data.errors
      notifications.error('Please fix the form errors and try again', {
        title: 'Validation Error'
      })
    } else if (error.response?.status === 404) {
      notifications.error('Project not found', {
        title: 'Error'
      })
      router.push('/projects')
    } else if (error.response?.status === 403) {
      notifications.error('You do not have permission to edit this project', {
        title: 'Access Denied'
      })
    } else {
      notifications.error('Failed to update project', {
        title: 'Error'
      })
    }
  } finally {
    loading.value = false
  }
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
    prospective: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    planned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }
  return classes[status as keyof typeof classes] || classes.planned
}

const getStatusLabel = (status: string): string => {
  const labels = {
    prospective: 'Prospective',
    planned: 'Planned',
    active: 'Active',
    completed: 'Completed',
    on_hold: 'On Hold',
    cancelled: 'Cancelled'
  }
  return labels[status as keyof typeof labels] || status
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchProject(),
    fetchClients()
  ])
})
</script>