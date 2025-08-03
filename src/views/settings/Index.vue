<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Manage your freelancer profile and business settings
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Settings Form -->
    <form v-else @submit.prevent="updateSettings" class="space-y-8">
      
      <!-- Business Information -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Business Information
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Email
            </label>
            <input
              v-model="form.business_email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Phone
            </label>
            <input
              v-model="form.business_phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <input
              v-model="form.business_website"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tax Number
            </label>
            <input
              v-model="form.tax_number"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Address
          </label>
          <textarea
            v-model="form.business_address"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>
      </div>

      <!-- Invoice Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Invoice Settings
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Invoice Prefix
            </label>
            <input
              v-model="form.invoice_prefix"
              type="text"
              maxlength="10"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <p class="text-xs text-gray-500 mt-1">Preview: {{ form.invoice_prefix }}-2025-001</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Terms (Days)
            </label>
            <input
              v-model.number="form.invoice_due_days"
              type="number"
              min="1"
              max="365"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Base Currency
            </label>
            <select
              v-model="form.base_currency"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </div>
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Invoice Footer
          </label>
          <textarea
            v-model="form.invoice_footer"
            rows="3"
            maxlength="1000"
            placeholder="Add default footer text for all invoices..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>
      </div>

      <!-- Tax Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Tax Settings
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Tax Rate (%)
            </label>
            <input
              v-model.number="form.default_tax_rate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tax Label
            </label>
            <input
              v-model="form.default_tax_label"
              type="text"
              placeholder="e.g., VAT, GST, Sales Tax"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Notification Preferences
        </h2>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <input
              v-model="form.notification_preferences.email_notifications"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Notifications
            </label>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="form.notification_preferences.invoice_reminders"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Invoice Due Reminders
            </label>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="form.notification_preferences.payment_notifications"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Notifications
            </label>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="form.notification_preferences.renewal_alerts"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Service Renewal Alerts
            </label>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center pt-6">
        <button
          type="button"
          @click="resetInvoiceNumbering"
          class="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 border border-orange-300 hover:border-orange-400 rounded-md transition-colors"
          :disabled="updating"
        >
          Reset Invoice Numbers
        </button>
        
        <div class="space-x-3">
          <button
            type="button"
            @click="loadSettings"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            :disabled="updating"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            :disabled="updating"
          >
            {{ updating ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>
    </form>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
    >
      <p class="text-green-800 dark:text-green-200 text-sm">{{ successMessage }}</p>
    </div>

    <!-- Error Messages -->
    <div
      v-if="errorMessage"
      class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
    >
      <p class="text-red-800 dark:text-red-200 text-sm">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { get, put, post } from '@/services/axios' // Use your axios service functions

// Types
interface NotificationPreferences {
  invoice_reminders: boolean
  payment_notifications: boolean
  renewal_alerts: boolean
  email_notifications: boolean
}

interface SettingsForm {
  base_currency: string
  invoice_due_days: number
  invoice_prefix: string
  invoice_footer: string | null
  default_tax_rate: number
  default_tax_label: string | null
  tax_number: string | null
  business_address: string | null
  business_phone: string | null
  business_email: string | null
  business_website: string | null
  notification_preferences: NotificationPreferences
}

// Reactive state
const loading = ref(true)
const updating = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref<SettingsForm>({
  base_currency: 'USD',
  invoice_due_days: 30,
  invoice_prefix: 'INV',
  invoice_footer: null,
  default_tax_rate: 0,
  default_tax_label: null,
  tax_number: null,
  business_address: null,
  business_phone: null,
  business_email: null,
  business_website: null,
  notification_preferences: {
    invoice_reminders: true,
    payment_notifications: true,
    renewal_alerts: true,
    email_notifications: true
  }
})

// Methods
const loadSettings = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    const response = await get('/settings', {
      showLoading: false // Since we have our own loading state
    })
    
    if (response.data.data) {
      Object.assign(form.value, response.data.data)
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to load settings'
  } finally {
    loading.value = false
  }
}

const updateSettings = async () => {
  try {
    updating.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    const response = await put('/settings', form.value, {
      showLoading: false, // Since we have our own updating state
      showSuccessNotification: false, // We'll handle success message manually
      loadingMessage: 'Updating settings...'
    })
    
    successMessage.value = response.data.message || 'Settings updated successfully'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to update settings'
  } finally {
    updating.value = false
  }
}

const resetInvoiceNumbering = async () => {
  if (!confirm('Are you sure you want to reset invoice numbering? This will set the next invoice number to 1.')) {
    return
  }
  
  try {
    updating.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    const response = await post('/settings/reset-invoice-numbering', {}, {
      showLoading: false,
      showSuccessNotification: false,
      loadingMessage: 'Resetting invoice numbering...'
    })
    
    successMessage.value = response.data.message || 'Invoice numbering reset successfully'
    
    // Reload settings to get updated values
    await loadSettings()
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to reset invoice numbering'
  } finally {
    updating.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadSettings()
})
</script>