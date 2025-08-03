<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Payment {{ payment?.transaction_number || '' }}
          </h1>
          <span
            v-if="payment"
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusClass(payment.status)"
          >
            {{ getStatusLabel(payment.status) }}
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update payment details and transaction information
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-2">
        <router-link
          :to="payment ? `/payments/${payment.id}` : '/payments'"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <ArrowLeft class="h-5 w-5 mr-2" />
          {{ payment ? 'Back to Payment' : 'Back to Payments' }}
        </router-link>
        
        <!-- View Payment Button -->
        <router-link
          v-if="payment"
          :to="`/payments/${payment.id}`"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <Eye class="h-5 w-5 mr-2" />
          View Payment
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="initialLoading" class="flex justify-center items-center py-12">
      <Loader2 class="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading payment...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="text-center py-12">
      <AlertTriangle class="h-12 w-12 mx-auto text-red-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Error loading payment</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ loadError }}</p>
      <div class="mt-6">
        <button
          @click="fetchPayment"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Client Balance Info (if client selected) -->
    <div v-else-if="payment && form.client_id && clientBalance" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div class="flex items-center">
        <Info class="h-5 w-5 text-blue-400 mr-3" />
        <div class="flex-1">
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
            Client Outstanding Balance
          </h3>
          <div class="mt-1 flex items-center space-x-4">
            <span class="text-sm text-blue-700 dark:text-blue-300">
              Current Balance: <span class="font-semibold">{{ formatCurrency(clientBalance.outstanding_balance) }}</span>
            </span>
            <span class="text-sm text-blue-700 dark:text-blue-300">
              Total Invoiced: {{ formatCurrency(clientBalance.total_invoiced) }}
            </span>
            <span class="text-sm text-blue-700 dark:text-blue-300">
              Total Paid: {{ formatCurrency(clientBalance.total_paid) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Form -->
    <form v-else-if="payment" @submit.prevent="updatePayment" class="space-y-6">
      <!-- Payment Details Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Payment Details
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

            <!-- Amount -->
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Amount <span class="text-red-500">*</span>
              </label>
              <input
                id="amount"
                v-model="form.amount"
                type="number"
                step="0.01"
                min="0.01"
                :class="[
                  'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                  errors.amount 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                ]"
                placeholder="0.00"
                @input="calculateBaseAmount"
              />
              <p v-if="errors.amount" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.amount[0] }}
              </p>
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
                @change="calculateBaseAmount"
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
                @input="calculateBaseAmount"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Rate to convert to your base currency
              </p>
              <p v-if="errors.exchange_rate" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.exchange_rate[0] }}
              </p>
            </div>

            <!-- Payment Date -->
            <div>
              <label for="payment_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Date <span class="text-red-500">*</span>
              </label>
              <input
                id="payment_date"
                v-model="form.payment_date"
                type="date"
                :max="today"
                :class="[
                  'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                  errors.payment_date 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                ]"
              />
              <p v-if="errors.payment_date" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.payment_date[0] }}
              </p>
            </div>

            <!-- Payment Method -->
            <div>
              <label for="payment_method" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method <span class="text-red-500">*</span>
              </label>
              <select
                id="payment_method"
                v-model="form.payment_method"
                :class="[
                  'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                  errors.payment_method 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                ]"
              >
                <option value="">Select payment method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="western_union">Western Union</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="other">Other</option>
              </select>
              <p v-if="errors.payment_method" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.payment_method[0] }}
              </p>
            </div>

            <!-- Transaction Reference -->
            <div class="md:col-span-2">
              <label for="transaction_reference" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transaction Reference (Optional)
              </label>
              <input
                id="transaction_reference"
                v-model="form.transaction_reference"
                type="text"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                placeholder="Bank reference, PayPal transaction ID, etc."
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Any reference number or ID associated with this payment
              </p>
            </div>

            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Status
              </label>
              <select
                id="status"
                v-model="form.status"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Set as "Completed" if payment is confirmed, "Pending" if awaiting confirmation
              </p>
            </div>

            <!-- Base Currency Amount (Calculated) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount in Base Currency
              </label>
              <div class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white sm:text-sm">
                {{ formatCurrency(baseAmount) }}
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Automatically calculated based on amount and exchange rate
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
              placeholder="Additional notes about this payment..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- File Attachments Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Receipt Attachments
          </h3>
          
          <div class="space-y-4">
            <!-- Existing Files -->
            <div v-if="existingFiles.length > 0">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Current Files:</h4>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in existingFiles"
                  :key="`existing-${index}`"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div class="flex items-center">
                    <component :is="getFileIcon(file)" class="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ getFileName(file) }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        Existing file
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      type="button"
                      @click="viewFile(file)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                      title="View File"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      @click="removeExistingFile(index)"
                      class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                      title="Remove File"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- File Upload Area -->
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
              <input
                ref="fileInput"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                class="hidden"
                @change="handleFileUpload"
              />
              <Upload class="h-12 w-12 mx-auto text-gray-400" />
              <div class="mt-4">
                <button
                  type="button"
                  @click="$refs.fileInput?.click()"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Upload class="h-5 w-5 mr-2" />
                  Add More Receipt Files
                </button>
              </div>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF, PDF up to 10MB each
              </p>
            </div>

            <!-- New Uploaded Files List -->
            <div v-if="newFiles.length > 0" class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">New Files to Upload:</h4>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in newFiles"
                  :key="`new-${index}`"
                  class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <div class="flex items-center">
                    <Paperclip class="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ file.name }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatFileSize(file.size) }} - New file
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeNewFile(index)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    <X class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Summary Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Payment Summary
          </h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Payment Amount:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ form.currency }} {{ formatCurrency(form.amount || 0) }}
              </span>
            </div>
            
            <div v-if="form.exchange_rate !== 1" class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Exchange Rate:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ form.exchange_rate }}
              </span>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div class="flex justify-between">
                <span class="text-base font-medium text-gray-900 dark:text-white">Base Currency Amount:</span>
                <span class="text-base font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(baseAmount) }}
                </span>
              </div>
            </div>

            <div v-if="clientBalance && form.status === 'completed'" class="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">New Client Balance:</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(clientBalance.outstanding_balance - baseAmount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <router-link
          :to="`/payments/${payment.id}`"
          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Cancel
        </router-link>
        
        <button
          type="submit"
          :disabled="loading || !form.client_id || !form.amount"
          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Loader2 v-if="loading" class="h-4 w-4 animate-spin mr-2" />
          {{ loading ? 'Updating...' : 'Update Payment' }}
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
  Eye,
  Info,
  Upload,
  Paperclip,
  X,
  Loader2,
  AlertTriangle,
  File,
  FileImage,
  FileType
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

interface ClientBalance {
  outstanding_balance: number
  total_invoiced: number
  total_paid: number
}

interface Payment {
  id: number
  transaction_number: string
  client_id: number
  amount: number
  currency: string
  exchange_rate: number
  payment_date: string
  payment_method: string
  transaction_reference: string | null
  notes: string | null
  status: string
  receipt_attachments: string[] | null
}

// State
const loading = ref(false)
const initialLoading = ref(true)
const loadError = ref('')
const payment = ref<Payment | null>(null)
const clients = ref<Client[]>([])
const clientBalance = ref<ClientBalance | null>(null)
const errors = ref<Record<string, string[]>>({})
const existingFiles = ref<string[]>([])
const newFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement>()

const today = new Date().toISOString().split('T')[0]

const form = reactive({
  client_id: '',
  amount: 0,
  currency: '',
  exchange_rate: 1.000000,
  payment_date: '',
  payment_method: '',
  transaction_reference: '',
  notes: '',
  status: '',
  receipt_attachments: [] as string[]
})

// Computed
const baseAmount = computed(() => {
  return (form.amount || 0) * form.exchange_rate
})

// Methods
const fetchPayment = async () => {
  initialLoading.value = true
  loadError.value = ''
  
  try {
    const response = await axios.get(`/payments/${route.params.id}`)
    payment.value = response.data.data
    
    // Populate form with payment data
    form.client_id = payment.value.client_id.toString()
    form.amount = payment.value.amount
    form.currency = payment.value.currency
    form.exchange_rate = payment.value.exchange_rate
    form.payment_date = payment.value.payment_date
    form.payment_method = payment.value.payment_method
    form.transaction_reference = payment.value.transaction_reference || ''
    form.notes = payment.value.notes || ''
    form.status = payment.value.status
    
    // Handle existing files
    existingFiles.value = payment.value.receipt_attachments || []
    
    // Load related data
    await Promise.all([
      fetchClients(),
      onClientChange()
    ])
    
  } catch (err: any) {
    if (err.response?.status === 404) {
      loadError.value = 'Payment not found'
    } else {
      loadError.value = 'Failed to load payment'
    }
  } finally {
    initialLoading.value = false
  }
}

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
  clientBalance.value = null
  
  if (form.client_id) {
    await fetchClientBalance()
  }
}

const fetchClientBalance = async () => {
  try {
    const response = await axios.get(`/clients/${form.client_id}/balance`)
    clientBalance.value = response.data.data
  } catch (error: any) {
    console.error('Failed to load client balance:', error)
  }
}

const calculateBaseAmount = () => {
  // This is reactive, so the computed property will update automatically
}

const getFileIcon = (filename: string) => {
  const extension = getFileExtension(filename).toLowerCase()
  
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return FileImage
  } else if (extension === 'pdf') {
    return FileType
  } else {
    return File
  }
}

const getFileName = (filepath: string): string => {
  return filepath.split('/').pop() || filepath
}

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop() || ''
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        notifications.error(`File ${file.name} is too large. Maximum size is 10MB.`, {
          title: 'File Upload Error'
        })
        continue
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        notifications.error(`File ${file.name} is not a supported format.`, {
          title: 'File Upload Error'
        })
        continue
      }
      
      newFiles.value.push(file)
    }
  }
  
  // Reset the input
  if (target) {
    target.value = ''
  }
}

const removeExistingFile = (index: number) => {
  existingFiles.value.splice(index, 1)
}

const removeNewFile = (index: number) => {
  newFiles.value.splice(index, 1)
}

const viewFile = async (filepath: string) => {
  try {
    const response = await axios.get(`/payments/view-file?path=${encodeURIComponent(filepath)}`, {
      responseType: 'blob'
    })
    
    // Create blob URL and open in new tab
    const url = window.URL.createObjectURL(new Blob([response.data]))
    window.open(url, '_blank')
    window.URL.revokeObjectURL(url)
  } catch (error: any) {
    notifications.error('Failed to view file', {
      title: 'Error'
    })
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getStatusClass = (status: string): string => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const getStatusLabel = (status: string): string => {
  const labels = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded'
  }
  return labels[status as keyof typeof labels] || status
}

const uploadNewFiles = async (): Promise<string[]> => {
  if (newFiles.value.length === 0) return []
  
  const formData = new FormData()
  newFiles.value.forEach((file, index) => {
    formData.append(`files[${index}]`, file)
  })
  
  try {
    const response = await axios.post('/payments/upload-receipts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.file_paths || []
  } catch (error: any) {
    notifications.error('Failed to upload receipt files', {
      title: 'Upload Error'
    })
    return []
  }
}

const updatePayment = async () => {
  loading.value = true
  errors.value = {}
  
  try {
    // Upload new files if any
    let newFilePaths: string[] = []
    if (newFiles.value.length > 0) {
      newFilePaths = await uploadNewFiles()
    }
    
    // Combine existing files with new files
    form.receipt_attachments = [...existingFiles.value, ...newFilePaths]
    
    const response = await axios.put(`/payments/${route.params.id}`, form)
    
    notifications.success('Payment updated successfully', {
      title: 'Success'
    })
    
    router.push(`/payments/${response.data.data.id}`)
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
      notifications.error('Please check the form for errors', {
        title: 'Validation Error'
      })
    } else {
      notifications.error('Failed to update payment', {
        title: 'Error'
      })
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await fetchPayment()
})
</script>