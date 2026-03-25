<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loadingInvoice && !currentInvoice" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading invoice...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!currentInvoice && !loadingInvoice" class="text-center py-12">
      <AlertTriangle class="h-12 w-12 mx-auto text-red-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Invoice not found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        The invoice could not be found or you don't have permission to edit it.
      </p>
      <div class="mt-6">
        <router-link
          to="/invoices"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Invoices
        </router-link>
      </div>
    </div>

    <!-- Main Form -->
    <form v-else @submit.prevent="submitUpdate" class="space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Invoice</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ currentInvoice?.invoice_number }}
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <router-link
            :to="`/invoices/${currentInvoice?.id}`"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          >
            <ArrowLeft class="h-5 w-5 mr-2" />
            Back to Invoice
          </router-link>
        </div>
      </div>

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
                disabled
                :class="[
                  'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
                  errors.client_id
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                ]"
              >
                <option value="">Select a client</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }}
                </option>
              </select>
              <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">Client cannot be changed after creation.</p>
            </div>

            <!-- Billing Month (read-only) -->
            <div>
              <label for="billing_month" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Billing Month
              </label>
              <input
                id="billing_month"
                v-model="form.billing_month"
                type="month"
                disabled
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">Billing month cannot be changed after creation.</p>
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

          <div v-if="form.items.length === 0" class="text-center py-8">
            <Package class="h-12 w-12 mx-auto text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No items added</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add at least one item to update the invoice.
            </p>
            <div class="mt-6">
              <button
                type="button"
                @click="addItem"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
              >
                <Plus class="h-5 w-5 mr-2" />
                Add Item
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
                        {{ selectedCurrency?.symbol ?? '' }} {{ formatCurrency(item.quantity * item.unit_price) }}
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
                {{ selectedCurrency?.symbol ?? '' }} {{ formatCurrency(subtotal) }}
              </span>
            </div>

            <div v-if="form.tax_rate > 0" class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ form.tax_label || 'Tax' }} ({{ form.tax_rate }}%):
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ selectedCurrency?.symbol ?? '' }} {{ formatCurrency(taxAmount) }}
              </span>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div class="flex justify-between">
                <span class="text-base font-medium text-gray-900 dark:text-white">Total:</span>
                <span class="text-base font-medium text-gray-900 dark:text-white">
                  {{ selectedCurrency?.symbol ?? '' }} {{ formatCurrency(total) }}
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
          :to="`/invoices/${currentInvoice?.id}`"
          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Cancel
        </router-link>

        <button
          type="submit"
          :disabled="saving || form.items.length === 0"
          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Loader2 v-if="saving" class="h-4 w-4 animate-spin mr-2" />
          {{ saving ? 'Saving...' : 'Update Invoice' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInvoiceStore } from '@/stores/InvoiceStore'
import { useClientStore } from '@/stores/ClientStore'
import { useListDataStore } from '@/stores/ListDataStore'
import { get } from '@/services/axios'
import type { InvoiceProject } from '@/Types/Invoice'
import { useNotifications } from '@/composables/useNotifications'
import {
  ArrowLeft,
  Plus,
  Package,
  Trash2,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const notifications = useNotifications()

const invoiceStore = useInvoiceStore()
const clientStore = useClientStore()
const listDataStore = useListDataStore()

const { currentInvoice, loading: loadingInvoice, saving, errors } = storeToRefs(invoiceStore)
const { clients } = storeToRefs(clientStore)
const { currencies, services: allServices } = storeToRefs(listDataStore)

const clientProjects = ref<InvoiceProject[]>([])
const showMoreDetails = ref(false)

// Services for the selected client (filtered from already-loaded allServices)
const clientServices = computed(() =>
  allServices.value.filter(s => s.client_id === Number(form.client_id))
)

const form = reactive({
  client_id: '' as string | number,
  project_id: '' as string | number,
  invoice_date: '',
  due_date: '',
  notes: '',
  currency_id: '' as string | number,
  calculation_type: 'multiply' as 'multiply' | 'divide',
  exchange_rate: 1.000000,
  tax_rate: 0,
  tax_label: '',
  billing_month: '',
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
  form.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
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
const populateForm = async () => {
  const invoice = currentInvoice.value
  if (!invoice) return

  form.client_id = invoice.client_id
  form.project_id = invoice.project_id ?? ''
  form.invoice_date = invoice.invoice_date
  form.due_date = invoice.due_date ?? ''
  form.notes = invoice.notes ?? ''
  form.currency_id = invoice.currency_id ?? invoice.currency?.id ?? ''
  form.calculation_type = (invoice as any).calculation_type ?? 'multiply'
  form.exchange_rate = invoice.exchange_rate
  form.tax_rate = invoice.tax_rate
  form.tax_label = invoice.tax_label ?? ''
  form.billing_month = invoice.billing_month ? invoice.billing_month.slice(0, 7) : ''
  form.items = (invoice.items ?? []).map(item => ({
    _mode: item.service_id ? 'service' : 'direct' as 'service' | 'direct',
    _showMore: false,
    service_id: item.service_id || '',
    title: (item as any).title || item.description || '',
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    service_period_start: item.service_period_start ?? '',
    service_period_end: item.service_period_end ?? '',
    notes: item.notes ?? ''
  }))

  if (form.client_id) {
    await fetchClientProjects()
  }
}

const onClientChange = async () => {
  form.project_id = ''
  clientProjects.value = []

  if (form.client_id) {
    await fetchClientProjects()
  }
}

const fetchClientProjects = async () => {
  try {
    const response = await get<InvoiceProject[]>(`/projects?client_id=${form.client_id}`)
    clientProjects.value = response.data.data ?? []
  } catch (error) {
    console.error('Failed to load client projects:', error)
  }
}

const onServiceSelect = (index: number, serviceId: string) => {
  if (!serviceId) return

  const service = clientServices.value.find(s => s.id === parseInt(serviceId))
  if (service) {
    form.items[index].title = service.title
    form.items[index].unit_price = service.total_amount
    form.items[index].quantity = 1
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

const formatCurrency = (amount: number): string =>
  amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const submitUpdate = async () => {
  if (!currentInvoice.value) return

  invoiceStore.clearErrors()

  const updated = await invoiceStore.updateInvoice(currentInvoice.value.id, {
    ...form,
    billing_month: form.billing_month ? `${form.billing_month}-01` : null,
    items: form.items.map(({ _mode, _showMore, ...item }) => ({
      ...item,
      unit_price_base_currency: null,
    })),
  })

  if (updated) {
    router.push(`/invoices/${updated.id}`)
  } else if (Object.keys(errors.value).length > 0) {
    notifications.error('Please check the form for errors', { title: 'Validation Error' })
  } else {
    notifications.error('Failed to update invoice', { title: 'Error' })
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    invoiceStore.fetchInvoice(Number(route.params.id)),
    clientStore.fetchClients(),
    listDataStore.getCurrencies(),
    listDataStore.getServices(),
  ])

  if (!currentInvoice.value) {
    notifications.error('Invoice not found', { title: 'Error' })
    router.push('/invoices')
    return
  }

  await populateForm()
})
</script>
