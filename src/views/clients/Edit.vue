<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading client details...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="client" class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Client</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update {{ client.name }}'s information and preferences
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <router-link
            :to="`/clients/${client.id}`"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <Eye class="h-5 w-5 mr-2" />
            View Client
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

      <!-- Client Code Display -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Building2 v-if="client.type === 'company'" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <User v-else class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
              Client Code: {{ client.client_code }}
            </p>
            <p class="text-sm text-blue-600 dark:text-blue-300">
              Created on {{ formatDate(client.created_at) }}
            </p>
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
              Essential client details and type information
            </p>
          </div>
          <div class="px-6 py-4 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Client Type -->
              <div class="md:col-span-2">
                <label class="text-base font-medium text-gray-900 dark:text-white">Client Type</label>
                <p class="text-sm text-gray-500 dark:text-gray-400">Choose the type of client</p>
                <fieldset class="mt-4">
                  <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                    <div class="flex items-center">
                      <input
                        id="type-company"
                        v-model="form.type"
                        name="type"
                        type="radio"
                        value="company"
                        class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                      />
                      <label for="type-company" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Building2 class="inline h-4 w-4 mr-1" />
                        Company
                      </label>
                    </div>
                    <div class="flex items-center">
                      <input
                        id="type-individual"
                        v-model="form.type"
                        name="type"
                        type="radio"
                        value="individual"
                        class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                      />
                      <label for="type-individual" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        <User class="inline h-4 w-4 mr-1" />
                        Individual
                      </label>
                    </div>
                  </div>
                </fieldset>
                <p v-if="errors.type" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.type) ? errors.type[0] : errors.type }}
                </p>
              </div>

              <!-- Client Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ form.type === 'company' ? 'Company Name' : 'Full Name' }} *
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.name }"
                  :placeholder="form.type === 'company' ? 'Enter company name' : 'Enter full name'"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.name) ? errors.name[0] : errors.name }}
                </p>
              </div>

              <!-- Contact Person (only for companies) -->
              <div v-if="form.type === 'company'">
                <label for="contact_person" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Person
                </label>
                <input
                  id="contact_person"
                  v-model="form.contact_person"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.contact_person }"
                  placeholder="Enter main contact person"
                />
                <p v-if="errors.contact_person" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.contact_person) ? errors.contact_person[0] : errors.contact_person }}
                </p>
              </div>

              <!-- Status -->
              <div :class="form.type === 'individual' ? 'md:col-start-2' : ''">
                <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  v-model="form.status"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.status }"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
                <p v-if="errors.status" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.status) ? errors.status[0] : errors.status }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information Card -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              How to reach your client
            </p>
          </div>
          <div class="px-6 py-4 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email }"
                  placeholder="client@example.com"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.email) ? errors.email[0] : errors.email }}
                </p>
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.phone }"
                  placeholder="+1 (555) 123-4567"
                />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.phone) ? errors.phone[0] : errors.phone }}
                </p>
              </div>

              <!-- Website -->
              <div class="md:col-span-2">
                <label for="website" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  id="website"
                  v-model="form.website"
                  type="url"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.website }"
                  placeholder="https://www.example.com"
                />
                <p v-if="errors.website" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.website) ? errors.website[0] : errors.website }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Address Information Card -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Address Information</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Client's physical location details
            </p>
          </div>
          <div class="px-6 py-4 space-y-6">
            <!-- Address -->
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Street Address
              </label>
              <textarea
                id="address"
                v-model="form.address"
                rows="2"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.address }"
                placeholder="Enter street address"
              ></textarea>
              <p v-if="errors.address" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.address) ? errors.address[0] : errors.address }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- City -->
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  id="city"
                  v-model="form.city"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.city }"
                  placeholder="Enter city"
                />
                <p v-if="errors.city" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.city) ? errors.city[0] : errors.city }}
                </p>
              </div>

              <!-- State -->
              <div>
                <label for="state" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State/Province
                </label>
                <input
                  id="state"
                  v-model="form.state"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.state }"
                  placeholder="Enter state"
                />
                <p v-if="errors.state" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.state) ? errors.state[0] : errors.state }}
                </p>
              </div>

              <!-- Postal Code -->
              <div>
                <label for="postal_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Postal Code
                </label>
                <input
                  id="postal_code"
                  v-model="form.postal_code"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.postal_code }"
                  placeholder="12345"
                />
                <p v-if="errors.postal_code" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.postal_code) ? errors.postal_code[0] : errors.postal_code }}
                </p>
              </div>

              <!-- Country -->
              <div>
                <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  v-model="form.country"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.country }"
                  placeholder="Enter country"
                />
                <p v-if="errors.country" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.country) ? errors.country[0] : errors.country }}
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
              Business details and internal notes
            </p>
          </div>
          <div class="px-6 py-4 space-y-6">
            <!-- Tax Number -->
            <div>
              <label for="tax_number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tax Number / VAT ID
              </label>
              <input
                id="tax_number"
                v-model="form.tax_number"
                type="text"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.tax_number }"
                placeholder="Enter tax number or VAT ID"
              />
              <p v-if="errors.tax_number" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.tax_number) ? errors.tax_number[0] : errors.tax_number }}
              </p>
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
                placeholder="Add any internal notes about this client..."
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
            {{ loading ? 'Updating Client...' : 'Update Client' }}
          </button>
          <router-link
            :to="`/clients/${client.id}`"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowLeft,
  Building2,
  User,
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
const initialLoading = ref(true)
const loading = ref(false)
const client = ref<Client | null>(null)
const errors = ref<Record<string, string[]>>({})
const originalData = ref<any>({})

// Form data
const form = reactive({
  name: '',
  type: 'company' as 'individual' | 'company',
  contact_person: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  tax_number: '',
  notes: '',
  status: 'active' as 'active' | 'inactive' | 'archived'
})

// Computed
const hasChanges = computed(() => {
  return JSON.stringify(form) !== JSON.stringify(originalData.value)
})

// Methods
const fetchClient = async () => {
  initialLoading.value = true
  try {
    const response = await axios.get(`/clients/${route.params.id}`)
    client.value = response.data.data
    
    // Populate form with client data
    populateForm(client.value)
    
  } catch (error: any) {
    if (error.response?.status === 404) {
      notifications.error('Client not found', {
        title: 'Error'
      })
    } else if (error.response?.status === 403) {
      notifications.error('You do not have permission to edit this client', {
        title: 'Access Denied'
      })
    } else {
      notifications.error('Failed to load client details', {
        title: 'Error'
      })
    }
  } finally {
    initialLoading.value = false
  }
}

const populateForm = (clientData: Client) => {
  form.name = clientData.name
  form.type = clientData.type
  form.contact_person = clientData.contact_person || ''
  form.email = clientData.email || ''
  form.phone = clientData.phone || ''
  form.website = clientData.website || ''
  form.address = clientData.address || ''
  form.city = clientData.city || ''
  form.state = clientData.state || ''
  form.country = clientData.country || ''
  form.postal_code = clientData.postal_code || ''
  form.tax_number = clientData.tax_number || ''
  form.notes = clientData.notes || ''
  form.status = clientData.status

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
    // Prepare data - remove contact_person if type is individual
    const data = { ...form }
    if (data.type === 'individual') {
      data.contact_person = ''
    }

    const response = await axios.put(`/clients/${route.params.id}`, data)
    
    notifications.success('Client updated successfully', {
      title: 'Success'
    })

    // Update the client data and original form data
    client.value = response.data.data
    populateForm(client.value)
    
  } catch (error: any) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      // Handle validation errors
      errors.value = error.response.data.errors
      notifications.error('Please fix the form errors and try again', {
        title: 'Validation Error'
      })
    } else if (error.response?.status === 404) {
      notifications.error('Client not found', {
        title: 'Error'
      })
      router.push('/clients')
    } else if (error.response?.status === 403) {
      notifications.error('You do not have permission to edit this client', {
        title: 'Access Denied'
      })
    } else {
      notifications.error('Failed to update client', {
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

// Lifecycle
onMounted(() => {
  fetchClient()
})

</script>