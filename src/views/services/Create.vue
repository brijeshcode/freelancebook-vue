<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Service</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new service for billing and recurring revenue management
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link
          to="/services"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <ArrowLeft class="h-5 w-5 mr-2" />
          Back to Services
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
            Essential service details and client assignment
          </p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Service Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Title *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.title }"
                placeholder="Enter service title"
              />
              <p v-if="errors.title" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.title) ? errors.title[0] : errors.title }}
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
                  @change="fetchProjects"
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

            <!-- Project Selection -->
            <div>
              <label for="project_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project (Optional)
              </label>
              <div class="relative">
                <select
                  id="project_id"
                  v-model="form.project_id"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.project_id }"
                  :disabled="!form.client_id || loadingProjects"
                >
                  <option value="">No specific project</option>
                  <option v-for="project in projects" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </option>
                </select>
                <div v-if="loadingProjects" class="absolute right-3 top-2.5">
                  <Loader2 class="h-5 w-5 animate-spin text-gray-400" />
                </div>
              </div>
              <p v-if="errors.project_id" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.project_id) ? errors.project_id[0] : errors.project_id }}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a client first to see available projects
              </p>
            </div>

            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Status *
              </label>
              <select
                id="status"
                v-model="form.status"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.status }"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending_approval">Pending Approval</option>
              </select>
              <p v-if="errors.status" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.status) ? errors.status[0] : errors.status }}
              </p>
            </div>
          </div>

          <!-- Service Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.description }"
              placeholder="Describe what this service includes..."
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ Array.isArray(errors.description) ? errors.description[0] : errors.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pricing Information Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Pricing Information</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set service pricing and tax configuration
          </p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Base Amount -->
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Amount *
              </label>
              <input
                id="amount"
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.amount }"
                placeholder="0.00"
                @input="calculateTotals"
              />
              <p v-if="errors.amount" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.amount) ? errors.amount[0] : errors.amount }}
              </p>
            </div>

            <!-- Currency -->
            <div>
              <label for="currency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency *
              </label>
              <select
                id="currency"
                v-model="form.currency"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.currency }"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
              <p v-if="errors.currency" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.currency) ? errors.currency[0] : errors.currency }}
              </p>
            </div>
          </div>

          <!-- Tax Configuration -->
          <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Tax Configuration</h4>
              <label class="flex items-center">
                <input
                  v-model="form.has_tax"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                  @change="calculateTotals"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Apply Tax</span>
              </label>
            </div>

            <div v-if="form.has_tax" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Tax Name -->
              <div>
                <label for="tax_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax Name
                </label>
                <input
                  id="tax_name"
                  v-model="form.tax_name"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.tax_name }"
                  placeholder="GST, VAT, Sales Tax"
                />
                <p v-if="errors.tax_name" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.tax_name) ? errors.tax_name[0] : errors.tax_name }}
                </p>
              </div>

              <!-- Tax Rate -->
              <div>
                <label for="tax_rate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  id="tax_rate"
                  v-model.number="form.tax_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.tax_rate }"
                  placeholder="18.00"
                  @input="calculateTotals"
                />
                <p v-if="errors.tax_rate" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.tax_rate) ? errors.tax_rate[0] : errors.tax_rate }}
                </p>
              </div>

              <!-- Tax Type -->
              <div>
                <label for="tax_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax Type
                </label>
                <select
                  id="tax_type"
                  v-model="form.tax_type"
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                  :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.tax_type }"
                  @change="calculateTotals"
                >
                  <option value="exclusive">Exclusive (added to amount)</option>
                  <option value="inclusive">Inclusive (included in amount)</option>
                </select>
                <p v-if="errors.tax_type" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ Array.isArray(errors.tax_type) ? errors.tax_type[0] : errors.tax_type }}
                </p>
              </div>
            </div>
          </div>

          <!-- Price Summary -->
          <div v-if="form.amount > 0" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Price Summary</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Base Amount:</span>
                <span class="text-gray-900 dark:text-white">{{ form.currency }} {{ formatCurrency(calculatedBaseAmount) }}</span>
              </div>
              <div v-if="form.has_tax && form.tax_rate > 0" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">
                  {{ form.tax_name || 'Tax' }} ({{ form.tax_rate }}%):
                </span>
                <span class="text-gray-900 dark:text-white">{{ form.currency }} {{ formatCurrency(calculatedTaxAmount) }}</span>
              </div>
              <div class="flex justify-between font-medium border-t border-gray-200 dark:border-gray-600 pt-2">
                <span class="text-gray-900 dark:text-white">Total Amount:</span>
                <span class="text-gray-900 dark:text-white">{{ form.currency }} {{ formatCurrency(calculatedTotalAmount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Billing Configuration Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Billing Configuration</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set billing frequency and scheduling
          </p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Billing Frequency -->
            <div>
              <label for="frequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Billing Frequency *
              </label>
              <select
                id="frequency"
                v-model="form.frequency"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.frequency }"
                @change="updateBillingDates"
              >
                <option value="one-time">One-time</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-yearly</option>
                <option value="yearly">Yearly</option>
              </select>
              <p v-if="errors.frequency" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.frequency) ? errors.frequency[0] : errors.frequency }}
              </p>
            </div>

            <!-- Start Date -->
            <div>
              <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date *
              </label>
              <input
                id="start_date"
                v-model="form.start_date"
                type="date"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.start_date }"
                @change="updateBillingDates"
              />
              <p v-if="errors.start_date" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.start_date) ? errors.start_date[0] : errors.start_date }}
              </p>
            </div>

            <!-- Next Billing Date (for recurring services) -->
            <div v-if="form.frequency !== 'one-time'">
              <label for="next_billing_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Next Billing Date
              </label>
              <input
                id="next_billing_date"
                v-model="form.next_billing_date"
                type="date"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.next_billing_date }"
              />
              <p v-if="errors.next_billing_date" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ Array.isArray(errors.next_billing_date) ? errors.next_billing_date[0] : errors.next_billing_date }}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Auto-calculated based on start date and frequency
              </p>
            </div>

            <!-- End Date (for finite recurring services) -->
            <div v-if="form.frequency !== 'one-time'">
              <label for="end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date (Optional)
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
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Leave empty for indefinite billing
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
            Tags and internal notes for service management
          </p>
        </div>
        <div class="px-6 py-4 space-y-6">
          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.tags }"
              placeholder="hosting, maintenance, design (comma-separated)"
              @input="updateTags"
            />
            <p v-if="errors.tags" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ Array.isArray(errors.tags) ? errors.tags[0] : errors.tags }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add tags separated by commas for better organization
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
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors duration-200"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.notes }"
              placeholder="Add any internal notes about this service..."
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
          {{ loading ? 'Creating Service...' : 'Create Service' }}
        </button>
        <router-link
          to="/services"
          class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
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

interface Project {
  id: number
  name: string
}

// State
const loading = ref(false)
const loadingClients = ref(false)
const loadingProjects = ref(false)
const clients = ref<Client[]>([])
const projects = ref<Project[]>([])
const errors = ref<Record<string, string[]>>({})
const tagsInput = ref('')

// Form data
const form = reactive({
  client_id: '',
  project_id: '',
  title: '',
  description: '',
  amount: null as number | null,
  currency: 'INR',
  has_tax: false,
  tax_name: '',
  tax_rate: 0,
  tax_type: 'exclusive' as 'inclusive' | 'exclusive',
  frequency: 'one-time' as 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly',
  start_date: '',
  next_billing_date: '',
  end_date: '',
  status: 'draft' as 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'pending_approval',
  is_active: true,
  tags: [] as string[],
  notes: ''
})

// Computed
const calculatedBaseAmount = computed(() => {
  if (!form.amount || !form.has_tax) return form.amount || 0
  
  if (form.tax_type === 'inclusive' && form.tax_rate > 0) {
    // If tax is inclusive, calculate base amount by removing tax
    return form.amount / (1 + form.tax_rate / 100)
  }
  
  return form.amount
})

const calculatedTaxAmount = computed(() => {
  if (!form.has_tax || !form.tax_rate || !form.amount) return 0
  
  if (form.tax_type === 'inclusive') {
    // Tax is already included in the amount
    return form.amount - calculatedBaseAmount.value
  } else {
    // Tax is added to the base amount
    return (form.amount * form.tax_rate) / 100
  }
})

const calculatedTotalAmount = computed(() => {
  if (!form.amount) return 0
  
  if (!form.has_tax || !form.tax_rate) return form.amount
  
  if (form.tax_type === 'inclusive') {
    return form.amount
  } else {
    return form.amount + calculatedTaxAmount.value
  }
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
      await fetchProjects()
    }
  } catch (error: any) {
    notifications.error('Failed to load clients', {
      title: 'Error'
    })
  } finally {
    loadingClients.value = false
  }
}

const fetchProjects = async () => {
  if (!form.client_id) {
    projects.value = []
    form.project_id = ''
    return
  }
  
  loadingProjects.value = true
  try {
    const response = await axios.get(`/projects?client_id=${form.client_id}`)
    projects.value = response.data.data || []
    
    // Pre-select project if passed via query parameter
    if (route.query.project_id && projects.value.some(p => p.id.toString() === route.query.project_id)) {
      form.project_id = route.query.project_id.toString()
    }
  } catch (error: any) {
    notifications.error('Failed to load projects', {
      title: 'Error'
    })
  } finally {
    loadingProjects.value = false
  }
}

const updateBillingDates = () => {
  if (form.frequency === 'one-time' || !form.start_date) {
    form.next_billing_date = ''
    return
  }
  
  const startDate = new Date(form.start_date)
  let nextBillingDate = new Date(startDate)
  
  switch (form.frequency) {
    case 'weekly':
      nextBillingDate.setDate(startDate.getDate() + 7)
      break
    case 'monthly':
      nextBillingDate.setMonth(startDate.getMonth() + 1)
      break
    case 'quarterly':
      nextBillingDate.setMonth(startDate.getMonth() + 3)
      break
    case 'half-yearly':
      nextBillingDate.setMonth(startDate.getMonth() + 6)
      break
    case 'yearly':
      nextBillingDate.setFullYear(startDate.getFullYear() + 1)
      break
  }
  
  form.next_billing_date = nextBillingDate.toISOString().split('T')[0]
}

const updateTags = () => {
  form.tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

const calculateTotals = () => {
  // This is handled by computed properties
  // Just trigger reactivity
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    // Prepare data - clean up empty values
    const data = { ...form }
    
    // Convert empty strings to null for optional fields
    if (!data.project_id) data.project_id = null
    if (!data.description) data.description = null
    if (!data.end_date) data.end_date = null
    if (!data.notes) data.notes = null
    
    // Handle tax fields
    if (!data.has_tax) {
      data.tax_name = null
      data.tax_rate = 0
    }
    
    // Handle recurring billing fields
    if (data.frequency === 'one-time') {
      data.next_billing_date = null
    } else if (!data.next_billing_date) {
      data.next_billing_date = null
    }
    
    // Handle tags
    if (data.tags.length === 0) {
      data.tags = null
    }

    const response = await axios.post('/services', data)
    
    notifications.success('Service created successfully', {
      title: 'Success'
    })

    // Redirect to the service details page
    router.push(`/services/${response.data.data.id}`)
    
  } catch (error: any) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      // Handle validation errors
      errors.value = error.response.data.errors
      notifications.error('Please fix the form errors and try again', {
        title: 'Validation Error'
      })
    } else {
      notifications.error('Failed to create service', {
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
  
  // Set default start date to today
  if (!form.start_date) {
    form.start_date = new Date().toISOString().split('T')[0]
    updateBillingDates()
  }
})

// Watchers
watch(() => form.start_date, updateBillingDates)
watch(() => form.frequency, updateBillingDates)
</script>