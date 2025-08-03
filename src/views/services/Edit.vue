<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="initialLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading service details...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="service" class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Service</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update "{{ service.title }}" details and configuration
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <router-link
            :to="`/services/${service.id}`"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <Eye class="h-5 w-5 mr-2" />
            View Service
          </router-link>
          <router-link
            to="/services"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <ArrowLeft class="h-5 w-5 mr-2" />
            Back to Services
          </router-link>
        </div>
      </div>

      <!-- Service Info Banner -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Settings class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Service ID: {{ service.id }} • {{ service.frequency.charAt(0).toUpperCase() + service.frequency.slice(1).replace('-', ' ') }}
              </p>
              <p class="text-sm text-blue-600 dark:text-blue-300">
                {{ service.client?.name || 'No client' }}
                <span v-if="service.project"> • {{ service.project.name }}</span>
                • Created {{ formatDate(service.created_at) }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
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

              <!-- Active Status -->
              <div class="flex items-center">
                <label class="flex items-center">
                  <input
                    v-model="form.is_active"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Service is Active</span>
                </label>
                <p class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  (Controls billing availability)
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
              Update service pricing and tax configuration
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
              Update billing frequency and scheduling
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
                  Can be manually adjusted or auto-calculated
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

            <!-- Billing History Info -->
            <div v-if="service.billing_count > 0" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div class="flex">
                <Clock class="h-5 w-5 text-yellow-400" />
                <div class="ml-3">
                  <p class="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Billing History:</strong> This service has been billed {{ service.billing_count }} time{{ service.billing_count !== 1 ? 's' : '' }}.
                    <span v-if="service.last_billed_at">
                      Last billed on {{ formatDate(service.last_billed_at) }}.
                    </span>
                  </p>
                  <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Changes to billing frequency will affect future billing cycles only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information Card -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Additional Information</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update tags and internal notes for service management
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
            :disabled="loading || !hasChanges"
            class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Loader2 v-if="loading" class="h-5 w-5 animate-spin mr-2" />
            {{ loading ? 'Updating Service...' : 'Update Service' }}
          </button>
          <router-link
            :to="`/services/${service.id}`"
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
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Failed to load service</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        The service could not be found or you don't have permission to edit it.
      </p>
      <div class="mt-6">
        <router-link
          to="/services"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          Back to Services
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/axios'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowLeft,
  Eye,
  Settings,
  Clock,
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
  client: Client | null
  project: Project | null
  created_at: string
  updated_at: string
}

// State
const initialLoading = ref(true)
const loading = ref(false)
const loadingClients = ref(false)
const loadingProjects = ref(false)
const service = ref<Service | null>(null)
const clients = ref<Client[]>([])
const projects = ref<Project[]>([])
const errors = ref<Record<string, string[]>>({})
const originalData = ref<any>({})
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
const hasChanges = computed(() => {
  return JSON.stringify(form) !== JSON.stringify(originalData.value)
})

const calculatedBaseAmount = computed(() => {
  if (!form.amount || !form.has_tax) return form.amount || 0
  
  if (form.tax_type === 'inclusive' && form.tax_rate > 0) {
    return form.amount / (1 + form.tax_rate / 100)
  }
  
  return form.amount
})

const calculatedTaxAmount = computed(() => {
  if (!form.has_tax || !form.tax_rate || !form.amount) return 0
  
  if (form.tax_type === 'inclusive') {
    return form.amount - calculatedBaseAmount.value
  } else {
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
const fetchService = async () => {
  initialLoading.value = true
  try {
    const response = await axios.get(`/services/${route.params.id}`)
    service.value = response.data.data
    
    // Populate form with service data
    populateForm(service.value)
    
  } catch (error: any) {
    if (error.response?.status === 404) {
      notifications.error('Service not found', {
        title: 'Error'
      })
    } else if (error.response?.status === 403) {
      notifications.error('You do not have permission to edit this service', {
        title: 'Access Denied'
      })
    } else {
      notifications.error('Failed to load service details', {
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

const fetchProjects = async () => {
  if (!form.client_id) {
    projects.value = []
    return
  }
  
  loadingProjects.value = true
  try {
    const response = await axios.get(`/projects?client_id=${form.client_id}`)
    projects.value = response.data.data || []
  } catch (error: any) {
    notifications.error('Failed to load projects', {
      title: 'Error'
    })
  } finally {
    loadingProjects.value = false
  }
}

const populateForm = (serviceData: Service) => {
  form.client_id = serviceData.client_id?.toString() || ''
  form.project_id = serviceData.project_id?.toString() || ''
  form.title = serviceData.title
  form.description = serviceData.description || ''
  form.amount = serviceData.amount
  form.currency = serviceData.currency
  form.has_tax = serviceData.has_tax
  form.tax_name = serviceData.tax_name || ''
  form.tax_rate = serviceData.tax_rate
  form.tax_type = serviceData.tax_type
  form.frequency = serviceData.frequency
  form.start_date = serviceData.start_date
  form.next_billing_date = serviceData.next_billing_date || ''
  form.end_date = serviceData.end_date || ''
  form.status = serviceData.status
  form.is_active = serviceData.is_active
  form.tags = serviceData.tags || []
  form.notes = serviceData.notes || ''

  // Update tags input
  tagsInput.value = form.tags.join(', ')

  // Store original data for comparison
  originalData.value = { ...form }
}

const updateBillingDates = () => {
  if (form.frequency === 'one-time' || !form.start_date) {
    form.next_billing_date = ''
    return
  }
  
  // Only auto-calculate if next_billing_date is empty
  if (form.next_billing_date) return
  
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
  // Handled by computed properties
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

    const response = await axios.put(`/services/${route.params.id}`, data)
    
    notifications.success('Service updated successfully', {
      title: 'Success'
    })

    // Update the service data and original form data
    service.value = response.data.data
    populateForm(service.value)
    
  } catch (error: any) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      errors.value = error.response.data.errors
      notifications.error('Please fix the form errors and try again', {
        title: 'Validation Error'
      })
    } else if (error.response?.status === 404) {
      notifications.error('Service not found', {
        title: 'Error'
      })
      router.push('/services')
    } else if (error.response?.status === 403) {
      notifications.error('You do not have permission to edit this service', {
        title: 'Access Denied'
      })
    } else {
      notifications.error('Failed to update service', {
        title: 'Error'
      })
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchService(),
    fetchClients()
  ])
  
  // Fetch projects after service is loaded
  if (service.value?.client_id) {
    await fetchProjects()
  }
})

// Watchers
watch(() => form.start_date, updateBillingDates)
watch(() => form.frequency, updateBillingDates)
</script>