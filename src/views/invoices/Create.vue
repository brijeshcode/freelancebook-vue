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
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Client Selection -->
            <div>
              <label for="client_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                @change="() => onClientChange()"
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
              <label for="project_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project
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

            <!-- Currency -->
            <div>
              <label for="currency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency <span class="text-red-500">*</span>
              </label>
              <select
                id="currency"
                v-model="form.currency_id"
                :class="[
                  'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200',
                  errors.currency_id
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                ]"
              >
                <option value="">Select currency</option>
                <option v-for="c in currencies" :key="c.id" :value="c.id">
                  {{ c.code }} - {{ c.name }}
                </option>
              </select>
              <p v-if="errors.currency_id" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.currency_id[0] }}
              </p>
            </div>

            <!-- Invoice Date -->
            <div>
              <label for="invoice_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <label for="due_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                id="due_date"
                v-model="form.due_date"
                type="date"
                :min="form.invoice_date"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
              />
            </div>

            <!-- Billing Month -->
            <div>
              <label for="billing_month" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Billing Month <span class="text-red-500">*</span>
              </label>
              <input
                id="billing_month"
                v-model="form.billing_month"
                type="month"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
              />
            </div>

            <!-- Exchange Rate -->
            <div>
              <label for="exchange_rate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <p v-if="errors.exchange_rate" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.exchange_rate[0] }}
              </p>
            </div>

            <!-- Notes -->
            <div class="sm:col-span-2">
              <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                v-model="form.notes"
                rows="2"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200"
                placeholder="Additional notes for this invoice..."
              ></textarea>
            </div>
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
      <div v-if="form.client_id" class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Invoice Items
              </h3>
              <label class="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  v-model="showMoreDetails"
                  @change="toggleAllMoreDetails"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                toggle More details
              </label>
            </div>
            <button
              type="button"
              @click="addItem"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              <Plus class="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>

          <div v-if="loadingActiveSystems" class="text-center py-8">
            <Loader2 class="h-8 w-8 mx-auto text-blue-500 animate-spin" />
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading active systems...</p>
          </div>

          <div v-else-if="form.items.length === 0" class="text-center py-8">
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

          <div v-else class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th class="pb-2 pr-2 w-6">#</th>
                  <th class="pb-2 pr-2 w-28">Mode</th>
                  <th class="pb-2 pr-2">Service / Title</th>
                  <th class="pb-2 pr-2 w-20">Qty</th>
                  <th class="pb-2 pr-2 w-28">Unit Price</th>
                  <th class="pb-2 pr-2 w-36 text-right">Total</th>
                  <th class="pb-2 w-12"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <template v-for="(item, index) in form.items" :key="index">
                  <tr class="align-middle">
                    <td class="py-2 pr-2 text-gray-500 dark:text-gray-400">{{ index + 1 }}</td>
                    <td class="py-2 pr-2">
                      <div class="inline-flex rounded border border-gray-300 dark:border-gray-600 overflow-hidden text-xs font-medium">
                        <button
                          type="button"
                          @click="setItemMode(index, 'service')"
                          :class="item._mode === 'service' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'"
                          class="px-2 py-1 transition-colors"
                        >Svc</button>
                        <button
                          type="button"
                          @click="setItemMode(index, 'direct')"
                          :class="item._mode === 'direct' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'"
                          class="px-2 py-1 transition-colors border-l border-gray-300 dark:border-gray-600"
                        >Direct</button>
                      </div>
                    </td>
                    <td class="py-2 pr-2">
                      <select
                        v-if="item._mode === 'service'"
                        v-model="item.service_id"
                        :disabled="!form.client_id || clientServices.length === 0"
                        class="block w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        @change="onServiceSelect(index, item.service_id)"
                      >
                        <option value="">Select a service</option>
                        <option v-for="service in clientServices" :key="service.id" :value="service.id">
                          {{ service.title }}
                        </option>
                      </select>
                      <div v-else>
                        <input
                          v-model="item.title"
                          type="text"
                          :class="[
                            'block w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors',
                            errors[`items.${index}.title`] ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                          ]"
                          placeholder="Item title"
                        />
                        <p v-if="errors[`items.${index}.title`]" class="mt-0.5 text-xs text-red-600 dark:text-red-400">
                          {{ errors[`items.${index}.title`][0] }}
                        </p>
                      </div>
                    </td>
                    <td class="py-2 pr-2">
                      <input
                        v-model="item.quantity"
                        type="number"
                        min="1"
                        :class="[
                          'block w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors',
                          errors[`items.${index}.quantity`] ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        ]"
                        @input="calculateTotals"
                      />
                    </td>
                    <td class="py-2 pr-2">
                      <input
                        v-model="item.unit_price"
                        type="number"
                        step="0.01"
                        min="0"
                        :class="[
                          'block w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors',
                          errors[`items.${index}.unit_price`] ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        ]"
                        @input="calculateTotals"
                      />
                    </td>
                    <td class="py-2 pr-2">
                      <div class="px-2 py-1.5 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white text-right whitespace-nowrap">
                        {{ selectedCurrency?.code ?? '' }} {{ formatCurrency(item.quantity * item.unit_price) }}
                      </div>
                    </td>
                    <td class="py-2">
                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          @click="item._showMore = !item._showMore"
                          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                          :title="item._showMore ? 'Hide details' : 'Show details'"
                        >
                          <ChevronDown v-if="!item._showMore" class="h-4 w-4" />
                          <ChevronUp v-else class="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          @click="removeItem(index)"
                          class="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <!-- More details row -->
                  <tr v-if="item._showMore">
                    <td colspan="7" class="pb-3 pt-0">
                      <div class="space-y-2 bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 border border-gray-100 dark:border-gray-700">
                        <div>
                          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                          <input
                            v-model="item.description"
                            type="text"
                            class="block w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
                            placeholder="Optional description"
                          />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                          <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Period Start</label>
                            <input
                              v-model="item.service_period_start"
                              type="date"
                              class="block w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
                            />
                          </div>
                          <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Period End</label>
                            <input
                              v-model="item.service_period_end"
                              type="date"
                              :min="item.service_period_start"
                              class="block w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                          <textarea
                            v-model="item.notes"
                            rows="2"
                            class="block w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
                            placeholder="Additional notes for this item"
                          ></textarea>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
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
                {{ selectedCurrency?.code ?? '' }} {{ formatCurrency(subtotal) }}
              </span>
            </div>
            
            <div v-if="form.tax_rate > 0" class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ form.tax_label || 'Tax' }} ({{ form.tax_rate }}%):
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ selectedCurrency?.code ?? '' }} {{ formatCurrency(taxAmount) }}
              </span>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div class="flex justify-between">
                <span class="text-base font-medium text-gray-900 dark:text-white">Total:</span>
                <span class="text-base font-medium text-gray-900 dark:text-white">
                  {{ selectedCurrency?.code ?? '' }} {{ formatCurrency(total) }}
                </span>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Base Currency Total:</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(totalBaseCurrency) }}
              </span>
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInvoiceStore } from '@/stores/InvoiceStore'
import { useClientStore } from '@/stores/ClientStore'
import { useListDataStore } from '@/stores/ListDataStore'
import { get } from '@/services/axios'
import type { InvoiceProject } from '@/Types/Invoice'
import { useNotifications } from '@/composables/useNotifications'
import { useFetchActiveSystem } from '@/services/System/FetchActiveService'
import {
  ArrowLeft,
  Plus,
  Package,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const notifications = useNotifications()

const invoiceStore = useInvoiceStore()
const clientStore = useClientStore()
const listDataStore = useListDataStore()

// Alias saving → loading to keep template unchanged
const { saving: loading, errors } = storeToRefs(invoiceStore)
const { clients } = storeToRefs(clientStore)
const { currencies, services: allServices } = storeToRefs(listDataStore)

const { activeSystemList, activeSystems, loadingActiveSystems } = useFetchActiveSystem()

const SPECIAL_CLIENT_ID = Number(import.meta.env.VITE_SPECIAL_CLIENT_ID)

// Local state
const clientProjects = ref<InvoiceProject[]>([])
const showMoreDetails = ref(false)

const isSpecialClient = computed(() => Number(form.client_id) === SPECIAL_CLIENT_ID)

// Services for the selected client (filtered from already-loaded allServices)
const clientServices = computed(() =>
  allServices.value.filter(s => s.client_id === Number(form.client_id))
)

const form = reactive({
  client_id: '',
  project_id: '',
  invoice_date: new Date().toISOString().split('T')[0],
  due_date: '',
  notes: '',
  currency_id: '' as string | number,
  calculation_type: 'multiply' as 'multiply' | 'divide',
  exchange_rate: 1.000000,
  tax_rate: 0,
  tax_label: '',
  billing_month: new Date().toISOString().slice(0, 7),
  items: [] as Array<{
    _mode: 'service' | 'direct'
    _showMore: boolean
    service_id: string
    title: string
    description: string | null
    quantity: number
    unit_price: number
    service_period_start: string
    service_period_end: string
    notes: string
  }>
})

// Computed
const subtotal = computed(() =>
  form.items.reduce((total, item) => total + item.quantity * item.unit_price, 0)
)

const taxAmount = computed(() => subtotal.value * (form.tax_rate / 100))

const total = computed(() => subtotal.value + taxAmount.value)

const totalBaseCurrency = computed(() =>
  form.calculation_type === 'divide'
    ? (form.exchange_rate ? total.value / form.exchange_rate : 0)
    : total.value * form.exchange_rate
)

const selectedCurrency = computed(() =>
  currencies.value.find(c => c.id === Number(form.currency_id)) ?? null
)

// Methods
const onClientChange = async (autoPopulate = true) => {
  form.project_id = ''
  form.items = []
  clientProjects.value = []

  if (form.client_id) {
    await fetchClientProjects()
    if (autoPopulate) {
      if (isSpecialClient.value) {
        await populateFromActiveSystems()
      } else {
        autoPopulateItems()
      }
    }
  }
}

const populateFromActiveSystems = async () => {
  if (!form.billing_month) return

  const [year, month] = form.billing_month.split('-').map(Number)
  const daysInMonth = 30
  const mm = String(month).padStart(2, '0')
  const dd = String(new Date(year, month, 0).getDate()).padStart(2, '0')

  await activeSystems(month, year)

  const maintenanceServices = clientServices.value.filter(s => s.tags?.includes('maintenance'))
  const fixedServices = clientServices.value.filter(s => {
    if (!s.tags?.includes('fixed')) return false
    if (!s.next_billing_date) return false
    const d = new Date(s.next_billing_date)
    const nYear = d.getFullYear()
    const nMonth = d.getMonth() + 1
    const monthDiff = (year - nYear) * 12 + (month - nMonth)
    switch (s.frequency) {
      case 'monthly':     return true
      case 'yearly':      return monthDiff % 12 === 0
      case 'quarterly':   return monthDiff % 3 === 0
      case 'half-yearly': return monthDiff % 6 === 0
      case 'one-time':    return nYear === year && nMonth === month
      default:            return false
    }
  })

  // Fixed-price services (hosting, domain, email, etc.) — include directly
  const otherItems = fixedServices.map(service => ({
    _mode: 'service' as const,
    _showMore: false,
    service_id: String(service.id),
    title: service.title,
    description: service.description,
    quantity: 1,
    unit_price: Number(service.amount),
    service_period_start: `${year}-${mm}-01`,
    service_period_end: `${year}-${mm}-${dd}`,
    notes: '',
  }))

  // Maintenance services — match against active systems API and apply billing rule
  const maintenanceItems = activeSystemList.value
    .filter(system => system.invoices > 0)
    .map(system => {
      const service = maintenanceServices.find(s => s.metadata?.link === system.url)
      if (!service) return null

      const isFullMonth = system.invoices >= 15
      const unitPrice = isFullMonth
        ? Number(service.amount)
        : Math.ceil(Number(service.amount) / daysInMonth)
      const quantity = isFullMonth ? 1 : system.invoices

      return {
        _mode: 'service' as const,
        _showMore: false,
        service_id: String(service.id),
        title: service.title,
        description: service.description,
        quantity,
        unit_price: unitPrice,
        service_period_start: `${year}-${mm}-01`,
        service_period_end: `${year}-${mm}-${dd}`,
        notes: `Invoices: ${system.invoices} | Expenses: ${system.expenses}`,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  form.items = [...otherItems, ...maintenanceItems].sort((a, b) => (b.unit_price * b.quantity) - (a.unit_price * a.quantity))
}

watch(() => form.billing_month, async (newVal) => {
  if (!isSpecialClient.value || !newVal) return
  await populateFromActiveSystems()
})

const fetchClientProjects = async () => {
  try {
    const response = await get<InvoiceProject[]>(`/projects?client_id=${form.client_id}`)
    clientProjects.value = response.data.data ?? []
  } catch (error) {
    console.error('Failed to load client projects:', error)
  }
}

const autoPopulateItems = () => {
  let year: number, month: number // month is 1-based

  if (form.billing_month) {
    const [y, m] = form.billing_month.split('-').map(Number)
    year = y
    month = m
  } else {
    const now = new Date()
    year = now.getFullYear()
    month = now.getMonth() + 1
  }

  const mm = String(month).padStart(2, '0')
  const monthStart = `${year}-${mm}-01`
  const monthEnd = new Date(year, month, 0).toISOString().split('T')[0]

  const dueThisMonth = clientServices.value.filter(s => {
    if (!s.next_billing_date) return false
    const d = new Date(s.next_billing_date)
    const nYear = d.getFullYear()
    const nMonth = d.getMonth() + 1
    const monthDiff = (year - nYear) * 12 + (month - nMonth)

    switch (s.frequency) {
      case 'monthly':    return true
      case 'yearly':     return monthDiff % 12 === 0
      case 'quarterly':  return monthDiff % 3 === 0
      case 'half-yearly': return monthDiff % 6 === 0
      case 'one-time':   return nYear === year && nMonth === month
      default:           return false
    }
  })

  form.items = [...dueThisMonth].sort((a, b) => Number(b.amount) - Number(a.amount)).map(service => ({
    _mode: 'service' as const,
    _showMore: false,
    service_id: String(service.id),
    title: service.title,
    description: null,
    quantity: 1,
    unit_price: service.amount,
    service_period_start: monthStart,
    service_period_end: monthEnd,
    notes: '',
  }))
}

const onServiceSelect = (index: number, serviceId: string) => {
  if (!serviceId) return

  const service = clientServices.value.find(s => s.id === parseInt(serviceId))
  if (service) {
    form.items[index].title = service.title
    // form.items[index].unit_price = service.total_amount
    form.items[index].unit_price = service.amount
    form.items[index].quantity = 1

    // currency_id is set by the user via the currency dropdown
  }
}

const toggleAllMoreDetails = () => {
  form.items.forEach(item => { item._showMore = showMoreDetails.value })
}

const addItem = () => {
  form.items.push({
    _mode: 'service',
    _showMore: false,
    service_id: '',
    title: '',
    description: null,
    quantity: 1,
    unit_price: 0,
    service_period_start: '',
    service_period_end: '',
    notes: ''
  })
}

const setItemMode = (index: number, mode: 'service' | 'direct') => {
  form.items[index]._mode = mode
  form.items[index].service_id = ''
  form.items[index].title = ''
}

const removeItem = (index: number) => {
  form.items.splice(index, 1)
}

const calculateTotals = () => {
  // Computed properties update automatically
}

const formatCurrency = (amount: number): string =>
  amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const createInvoice = async () => {
  invoiceStore.clearErrors()

  const invoice = await invoiceStore.createInvoice({
    ...form,
    billing_month: form.billing_month ? `${form.billing_month}-01` : null,
    items: form.items.map(({ _mode, _showMore, ...item }) => ({
      ...item,
      unit_price_base_currency: null,
    })),
  })

  if (invoice) {
    router.push(`/invoices/${invoice.id}`)
  } else if (Object.keys(errors.value).length > 0) {
    notifications.error('Please check the form for errors', { title: 'Validation Error' })
  } else {
    notifications.error('Failed to create invoice', { title: 'Error' })
  }
}

const loadInvoiceForCopy = async (invoiceId: string) => {
  await invoiceStore.fetchInvoice(Number(invoiceId))
  const invoice = invoiceStore.currentInvoice

  if (!invoice) {
    notifications.error('Failed to copy invoice', { title: 'Error' })
    return
  }

  form.client_id = String(invoice.client_id)
  form.project_id = invoice.project_id ? String(invoice.project_id) : ''
  form.invoice_date = new Date().toISOString().split('T')[0]
  form.due_date = ''
  form.notes = invoice.notes ?? ''
  form.currency_id = invoice.currency_id ?? ''
  form.exchange_rate = invoice.exchange_rate
  form.tax_rate = invoice.tax_rate
  form.tax_label = invoice.tax_label ?? ''
  form.billing_month = invoice.billing_month ? invoice.billing_month.slice(0, 7) : new Date().toISOString().slice(0, 7)

  form.items = (invoice.items ?? []).map(item => ({
    _mode: item.service_id ? 'service' : 'direct' as 'service' | 'direct',
    _showMore: false,
    service_id: item.service_id || '',
    title: item.title || '',
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    service_period_start: '',
    service_period_end: '',
    notes: item.notes || ''
  }))

  if (form.client_id) await onClientChange(false)

  notifications.success('Invoice copied successfully', { title: 'Success' })
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    clientStore.fetchClients(),
    listDataStore.getCurrencies(),
    listDataStore.getServices(),
  ])

  const copyId = route.query.copy as string
  if (copyId) await loadInvoiceForCopy(copyId)
})
</script>