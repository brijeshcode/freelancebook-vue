<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Invoice</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new invoice for your client
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link
          to="/invoices"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <ArrowLeft class="h-5 w-5 mr-2" />
          Back to Invoices
        </router-link>
      </div>
    </div>

    <!-- Main Form -->
    <form @submit.prevent="createInvoice" class="space-y-6">
      <!-- Invoice Details Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Invoice Details
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Client Selection -->
            <div>
              <label for="client_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client <span class="text-red-500">*</span>
              </label>
              <select
                id="client_id"
                v-model="form.client_id"
                :class="[
                  'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                  errors.client_id 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                ]"
                @change="onClientChange"
              >
                <option value="">Select a client</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }}
                </option>
              </select>
              <p v-if="errors.client_id" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.client_id[0] }}
              </p>
            </div>

            <!-- Project Selection -->
            <div>
              <label for="project_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project (Optional)
              </label>
              <select
                id="project_id"
                v-model="form.project_id"
                :disabled="!form.client_id || clientProjects.length === 0"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">No project</option>
                <option v-for="project in clientProjects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
            </div>

            <!-- Invoice Date -->
            <div>
              <label for="invoice_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Invoice Date <span class="text-red-500">*</span>
              </label>
              <input
                id="invoice_date"
                v-model="form.invoice_date"
                type="date"
                :class="[
                  'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                  errors.invoice_date 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                ]"
              />
              <p v-if="errors.invoice_date" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.invoice_date[0] }}
              </p>
            </div>

            <!-- Due Date -->
            <div>
              <label for="due_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date (Optional)
              </label>
              <input
                id="due_date"
                v-model="form.due_date"
                type="date"
                :min="form.invoice_date"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
              />
            </div>

            <!-- Currency -->
            <div>
              <label for="currency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency <span class="text-red-500">*</span>
              </label>
              <select
                id="currency"
                v-model="form.currency"
                :class="[
                  'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                  errors.currency 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                ]"
              >
                <option value="">Select currency</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
              <p v-if="errors.currency" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.currency[0] }}
              </p>
            </div>

            <!-- Exchange Rate -->
            <div>
              <label for="exchange_rate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exchange Rate <span class="text-red-500">*</span>
              </label>
              <input
                id="exchange_rate"
                v-model="form.exchange_rate"
                type="number"
                step="0.000001"
                min="0.000001"
                max="9999.999999"
                :class="[
                  'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                  errors.exchange_rate 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                ]"
                placeholder="1.000000"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Rate to convert to your base currency
              </p>
              <p v-if="errors.exchange_rate" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.exchange_rate[0] }}
              </p>
            </div>
          </div>

          <!-- Notes -->
          <div class="mt-6">
            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
              placeholder="Additional notes for this invoice..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Tax Configuration Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Tax Configuration
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tax Rate -->
            <div>
              <label for="tax_rate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tax Rate (%)
              </label>
              <input
                id="tax_rate"
                v-model="form.tax_rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                placeholder="0.00"
                @input="calculateTotals"
              />
            </div>

            <!-- Tax Label -->
            <div>
              <label for="tax_label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tax Label
              </label>
              <input
                id="tax_label"
                v-model="form.tax_label"
                type="text"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                placeholder="e.g., VAT, GST, Sales Tax"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Items Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Invoice Items
            </h3>
            <button
              type="button"
              @click="addItem"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              <Plus class="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>

          <div v-if="form.items.length === 0" class="text-center py-8">
            <Package class="h-12 w-12 mx-auto text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No items added</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add at least one item to create the invoice.
            </p>
            <div class="mt-6">
              <button
                type="button"
                @click="addItem"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
              >
                <Plus class="h-5 w-5 mr-2" />
                Add Your First Item
              </button>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  Item {{ index + 1 }}
                </h4>
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Service Selection -->
                <div class="lg:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service (Optional)
                  </label>
                  <select
                    v-model="item.service_id"
                    :disabled="!form.client_id || clientServices.length === 0"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    @change="onServiceSelect(index, item.service_id)"
                  >
                    <option value="">Select a service</option>
                    <option v-for="service in clientServices" :key="service.id" :value="service.id">
                      {{ service.title }} ({{ service.currency }} {{ formatCurrency(service.total_amount) }})
                    </option>
                  </select>
                </div>

                <!-- Quantity -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="item.quantity"
                    type="number"
                    min="1"
                    :class="[
                      'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                      errors[`items.${index}.quantity`] 
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    ]"
                    @input="calculateTotals"
                  />
                  <p v-if="errors[`items.${index}.quantity`]" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ errors[`items.${index}.quantity`][0] }}
                  </p>
                </div>

                <!-- Unit Price -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit Price <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="item.unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    :class="[
                      'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                      errors[`items.${index}.unit_price`] 
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    ]"
                    @input="calculateTotals"
                  />
                  <p v-if="errors[`items.${index}.unit_price`]" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ errors[`items.${index}.unit_price`][0] }}
                  </p>
                </div>
              </div>

              <!-- Description -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="item.description"
                  type="text"
                  :class="[
                    'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                    errors[`items.${index}.description`] 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  placeholder="Description of the service or product"
                />
                <p v-if="errors[`items.${index}.description`]" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ errors[`items.${index}.description`][0] }}
                </p>
              </div>

              <!-- Service Period (Optional) -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service Period Start
                  </label>
                  <input
                    v-model="item.service_period_start"
                    type="date"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service Period End
                  </label>
                  <input
                    v-model="item.service_period_end"
                    type="date"
                    :min="item.service_period_start"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                  />
                </div>
              </div>

              <!-- Notes -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Item Notes
                </label>
                <textarea
                  v-model="item.notes"
                  rows="2"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                  placeholder="Additional notes for this item"
                ></textarea>
              </div>

              <!-- Item Total -->
              <div class="mt-4 text-right">
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  Item Total: {{ form.currency }} {{ formatCurrency(item.quantity * item.unit_price) }}
                </span>
              </div>
            </div>
          </div>

          <p v-if="errors.items" class="mt-2 text-sm text-red-600 dark:text-red-400">
            {{ errors.items[0] }}
          </p>
        </div>
      </div>

      <!-- Invoice Summary Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Invoice Summary
          </h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Subtotal:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ form.currency }} {{ formatCurrency(subtotal) }}
              </span>
            </div>
            
            <div v-if="form.tax_rate > 0" class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ form.tax_label || 'Tax' }} ({{ form.tax_rate }}%):
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ form.currency }} {{ formatCurrency(taxAmount) }}
              </span>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div class="flex justify-between">
                <span class="text-base font-medium text-gray-900 dark:text-white">Total:</span>
                <span class="text-base font-medium text-gray-900 dark:text-white">
                  {{ form.currency }} {{ formatCurrency(total) }}
                </span>
              </div>
            </div>

            <div v-if="form.exchange_rate !== 1" class="text-sm text-gray-500 dark:text-gray-400">
              Base Currency: {{ formatCurrency(total * form.exchange_rate) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <router-link
          to="/invoices"
          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Cancel
        </router-link>
        
        <button
          type="submit"
          :disabled="loading || form.items.length === 0"
          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Loader2 v-if="loading" class="h-4 w-4 animate-spin mr-2" />
          {{ loading ? 'Creating...' : 'Create Invoice' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowLeft,
  Plus,
  Package,
  Trash2,
  Loader2
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const notifications = useNotifications()

// Types
interface Client {
  id: number
  name: string
  email?: string
}

interface Project {
  id: number
  name: string
  client_id: number
}

interface Service {
  id: number
  title: string
  currency: string
  total_amount: number
  client_id: number
  project_id: number | null
}

interface InvoiceItem {
  service_id: string
  description: string
  quantity: number
  unit_price: number
  service_period_start: string
  service_period_end: string
  notes: string
}

// State
const loading = ref(false)
const clients = ref<Client[]>([])
const clientProjects = ref<Project[]>([])
const clientServices = ref<Service[]>([])
const errors = ref<Record<string, string[]>>({})

const form = reactive({
  client_id: '',
  project_id: '',
  invoice_date: new Date().toISOString().split('T')[0],
  due_date: '',
  notes: '',
  currency: 'USD',
  exchange_rate: 1.000000,
  tax_rate: 0,
  tax_label: '',
  items: [] as InvoiceItem[]
})

// Computed
const subtotal = computed(() => {
  return form.items.reduce((total, item) => {
    return total + (item.quantity * item.unit_price)
  }, 0)
})

const taxAmount = computed(() => {
  return subtotal.value * (form.tax_rate / 100)
})

const total = computed(() => {
  return subtotal.value + taxAmount.value
})

// Methods
const fetchClients = async () => {
  try {
    const response = await axios.get('/clients')
    clients.value = response.data.data
  } catch (error: any) {
    notifications.error('Failed to load clients', {
      title: 'Error'
    })
  }
}

const onClientChange = async () => {
  form.project_id = ''
  clientProjects.value = []
  clientServices.value = []
  
  if (form.client_id) {
    await Promise.all([
      fetchClientProjects(),
      fetchClientServices()
    ])
  }
}

const fetchClientProjects = async () => {
  try {
    const response = await axios.get(`/projects?client_id=${form.client_id}`)
    clientProjects.value = response.data.data
  } catch (error: any) {
    console.error('Failed to load client projects:', error)
  }
}

const fetchClientServices = async () => {
  try {
    const response = await axios.get(`/services?client_id=${form.client_id}`)
    clientServices.value = response.data.data
  } catch (error: any) {
    console.error('Failed to load client services:', error)
  }
}

const onServiceSelect = async (index: number, serviceId: string) => {
  if (!serviceId) return
  
  const service = clientServices.value.find(s => s.id === parseInt(serviceId))
  if (service) {
    form.items[index].description = service.title
    form.items[index].unit_price = service.total_amount
    form.items[index].quantity = 1
    
    // Set currency if not already set
    if (!form.currency) {
      form.currency = service.currency
    }
    
    calculateTotals()
  }
}

const addItem = () => {
  form.items.push({
    service_id: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    service_period_start: '',
    service_period_end: '',
    notes: ''
  })
}

const removeItem = (index: number) => {
  form.items.splice(index, 1)
  calculateTotals()
}

const calculateTotals = () => {
  // This is reactive, so the computed properties will update automatically
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const createInvoice = async () => {
  loading.value = true
  errors.value = {}
  
  try {
    const response = await axios.post('/invoices', form)
    
    notifications.success('Invoice created successfully', {
      title: 'Success'
    })
    
    router.push(`/invoices/${response.data.data.id}`)
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
      notifications.error('Please check the form for errors', {
        title: 'Validation Error'
      })
    } else {
      notifications.error('Failed to create invoice', {
        title: 'Error'
      })
    }
  } finally {
    loading.value = false
  }
}

const loadInvoiceForCopy = async (invoiceId: string) => {
  try {
    const response = await axios.get(`/invoices/${invoiceId}`)
    const invoice = response.data.data
    
    // Copy invoice data but reset certain fields
    form.client_id = invoice.client_id
    form.project_id = invoice.project_id
    form.invoice_date = new Date().toISOString().split('T')[0]
    form.due_date = ''
    form.notes = invoice.notes
    form.currency = invoice.currency
    form.exchange_rate = invoice.exchange_rate
    form.tax_rate = invoice.tax_rate
    form.tax_label = invoice.tax_label
    
    // Copy items
    form.items = invoice.items.map((item: any) => ({
      service_id: item.service_id || '',
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      service_period_start: '',
      service_period_end: '',
      notes: item.notes || ''
    }))
    
    // Load client data
    if (form.client_id) {
      await onClientChange()
    }
    
    notifications.success('Invoice copied successfully', {
      title: 'Success'
    })
  } catch (error: any) {
    notifications.error('Failed to copy invoice', {
      title: 'Error'
    })
  }
}

// Lifecycle
onMounted(async () => {
  await fetchClients()
  
  // Add initial item
  addItem()
  
  // Check if copying from existing invoice
  const copyId = route.query.copy as string
  if (copyId) {
    await loadInvoiceForCopy(copyId)
  }
})
</script>