<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading project details...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="project" class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div class="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Folder class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ project.name }}</h1>
            <div class="flex items-center space-x-2 mt-1">
              <span class="text-sm text-gray-500 dark:text-gray-400">Project #{{ project.id }}</span>
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(project.status)"
              >
                {{ getStatusLabel(project.status) }}
              </span>
            </div>
            <p v-if="project.client" class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Client: {{ project.client.name }} ({{ project.client.client_code }})
            </p>
          </div>
        </div>

        <div class="mt-4 lg:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            @click="trackTime"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <Clock class="h-5 w-5 mr-2" />
            Track Time
          </button>
          <router-link
            :to="`/projects/${project.id}/edit`"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <Pencil class="h-5 w-5 mr-2" />
            Edit Project
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

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Budget Card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <DollarSign class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {{ project.budget ? 'Project Budget' : 'Budget' }}
                  </dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ project.budget 
                      ? `${project.budget_currency} ${formatCurrency(project.budget)}` 
                      : 'Not set' 
                    }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Payments Card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CreditCard class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Paid</dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ project.payment_currency }} {{ formatCurrency(project.total_paid) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Hours Card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Clock class="h-6 w-6 text-purple-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Time Worked</dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ project.actual_hours }}h
                    <span v-if="project.estimated_hours" class="text-sm text-gray-500 dark:text-gray-400">
                      / {{ project.estimated_hours }}h
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <TrendingUp class="h-6 w-6 text-indigo-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Progress</dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ getProgressPercentage() }}%
                  </dd>
                  <div class="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300"
                      :class="getProgressBarClass()"
                      :style="{ width: `${Math.min(getProgressPercentage(), 100)}%` }"
                    ></div>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Information Tabs -->
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
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Project Status</dt>
                    <dd class="mt-1">
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusClass(project.status)"
                      >
                        {{ getStatusLabel(project.status) }}
                      </span>
                    </dd>
                  </div>
                  <div v-if="project.client">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Client</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      <router-link 
                        :to="`/clients/${project.client.id}`"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {{ project.client.name }} ({{ project.client.client_code }})
                      </router-link>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(project.created_at) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(project.updated_at) }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Financial Information -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Financial Information</h3>
                <dl class="space-y-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ project.budget 
                        ? `${project.budget_currency} ${formatCurrency(project.budget)}` 
                        : 'No budget set' 
                      }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Paid</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ project.payment_currency }} {{ formatCurrency(project.total_paid) }}
                    </dd>
                  </div>
                  <div v-if="project.budget">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining Budget</dt>
                    <dd class="mt-1 text-sm" :class="getRemainingBudgetClass()">
                      {{ project.budget_currency }} {{ formatCurrency(project.remaining_budget || 0) }}
                    </dd>
                  </div>
                  <div v-if="project.budget_exceeded" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div class="flex">
                      <AlertTriangle class="h-5 w-5 text-red-400" />
                      <div class="ml-3">
                        <p class="text-sm text-red-800 dark:text-red-400">
                          Project is over budget!
                        </p>
                      </div>
                    </div>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Timeline Information -->
            <div class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Timeline</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-if="project.start_date">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(project.start_date) }}</dd>
                </div>
                <div v-if="project.deadline">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline</dt>
                  <dd class="mt-1 text-sm" :class="isOverdue() ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'">
                    {{ formatDate(project.deadline) }}
                    <span v-if="isOverdue()" class="ml-2 text-xs font-semibold text-red-600 dark:text-red-400">
                      OVERDUE
                    </span>
                  </dd>
                </div>
                <div v-if="project.end_date">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(project.end_date) }}</dd>
                </div>
              </div>
            </div>

            <!-- Time Tracking -->
            <div class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Time Tracking</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Hours</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ project.estimated_hours || 'Not set' }}{{ project.estimated_hours ? 'h' : '' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Actual Hours</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ project.actual_hours }}h</dd>
                </div>
                <div v-if="project.estimated_hours && project.time_variance !== null">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Time Variance</dt>
                  <dd class="mt-1 text-sm" :class="getTimeVarianceClass()">
                    {{ project.time_variance > 0 ? '+' : '' }}{{ project.time_variance.toFixed(2) }}h
                    <span class="text-xs">
                      ({{ project.time_variance > 0 ? 'Over' : 'Under' }} estimate)
                    </span>
                  </dd>
                </div>
              </div>
            </div>

            <!-- Project Details -->
            <div v-if="project.project_details" class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Project Details</h3>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ project.project_details }}</p>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="project.notes" class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Internal Notes</h3>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ project.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Services Tab -->
          <div v-else-if="activeTab === 'services'">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Project Services</h3>
              <router-link
                :to="{ path: '/services/create', query: { project_id: project.id } }"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                <Plus class="h-4 w-4 mr-2" />
                Add Service
              </router-link>
            </div>

            <!-- Services Placeholder -->
            <div class="text-center py-12">
              <Settings class="h-12 w-12 mx-auto text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Services will be listed here</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Service integration with project details coming soon.
              </p>
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
                Project activity will appear here as you work on it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <AlertTriangle class="h-12 w-12 mx-auto text-red-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Failed to load project</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        The project could not be found or you don't have permission to view it.
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowLeft,
  Folder,
  Pencil,
  Clock,
  DollarSign,
  CreditCard,
  TrendingUp,
  Plus,
  Info,
  Settings,
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
  budget_exceeded: boolean
  remaining_budget: number | null
  time_variance: number | null
  client: Client | null
  freelancer: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

// State
const loading = ref(true)
const project = ref<Project | null>(null)
const activeTab = ref('details')

// Tabs configuration
const tabs = [
  { id: 'details', name: 'Details', icon: Info },
  { id: 'services', name: 'Services', icon: Settings },
  { id: 'activity', name: 'Activity', icon: Clock }
]

// Methods
const fetchProject = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/projects/${route.params.id}`)
    project.value = response.data.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      notifications.error('Project not found', {
        title: 'Error'
      })
      router.push('/projects')
    } else if (error.response?.status === 403) {
      notifications.error('You do not have permission to view this project', {
        title: 'Access Denied'
      })
      router.push('/projects')
    } else {
      notifications.error('Failed to load project details', {
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

const getProgressPercentage = (): number => {
  if (!project.value) return 0
  
  // Calculate progress based on status
  const statusProgress = {
    prospective: 0,
    planned: 10,
    active: 50,
    on_hold: 50,
    completed: 100,
    cancelled: 0
  }
  
  return statusProgress[project.value.status] || 0
}

const getProgressBarClass = (): string => {
  const percentage = getProgressPercentage()
  if (percentage === 0) return 'bg-gray-400'
  if (percentage < 30) return 'bg-red-500'
  if (percentage < 70) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getRemainingBudgetClass = (): string => {
  if (!project.value?.remaining_budget) return 'text-gray-900 dark:text-white'
  return project.value.remaining_budget < 0 
    ? 'text-red-600 dark:text-red-400' 
    : 'text-green-600 dark:text-green-400'
}

const getTimeVarianceClass = (): string => {
  if (!project.value?.time_variance) return 'text-gray-900 dark:text-white'
  return project.value.time_variance > 0 
    ? 'text-red-600 dark:text-red-400' 
    : 'text-green-600 dark:text-green-400'
}

const isOverdue = (): boolean => {
  if (!project.value?.deadline || project.value.status === 'completed' || project.value.status === 'cancelled') {
    return false
  }
  return new Date(project.value.deadline) < new Date()
}

const trackTime = () => {
  // Placeholder for time tracking functionality
  notifications.info('Time tracking feature coming soon!', {
    title: 'Feature Preview'
  })
}

// Lifecycle
onMounted(() => {
  fetchProject()
})
</script>