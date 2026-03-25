<template>
  <div>
    <!-- Toolbar (screen only) -->
    <div class="print:hidden mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <router-link
          :to="`/invoices/${invoice?.id}`"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft class="h-4 w-4 mr-2" />
          Back
        </router-link>
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Print Preview</h1>
      </div>
      <button
        @click="printInvoice"
        class="inline-flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
      >
        <Printer class="h-4 w-4 mr-2" />
        Print
      </button>
    </div>

    <!-- Toggle Controls (screen only) -->
    <div v-if="invoice" class="print:hidden mb-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Print Options</h2>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <label v-for="opt in toggleOptions" :key="opt.key" class="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            v-model="opt.enabled"
            class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ opt.label }}</span>
        </label>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading && !invoice" class="flex justify-center items-center py-24">
      <Loader2 class="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-16">
      <AlertTriangle class="h-12 w-12 mx-auto text-red-400" />
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
    </div>

    <!-- Invoice Document -->
    <div
      v-else-if="invoice"
      id="invoice-print"
      class="bg-white shadow-xl rounded-xl max-w-3xl mx-auto overflow-hidden print:shadow-none print:rounded-none print:max-w-none print:overflow-visible"
    >
      <!-- Accent Header Bar -->
      <div class="bg-slate-800 px-10 py-8 flex items-start justify-between">
        <div>
          <h1 class="text-4xl font-extrabold text-white tracking-widest">INVOICE</h1>
          <p class="mt-1 text-slate-300 text-sm font-mono tracking-wide">{{ invoice.invoice_number }}</p>
        </div>
        <div class="text-right">
          <div v-if="show('paymentStatus')" class="mb-3">
            <span
              class="inline-flex px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border"
              :class="getStatusBadgeClass(invoice.status)"
            >
              {{ getStatusLabel(invoice.status) }}
            </span>
          </div>
          <div v-if="invoice.billing_month" class="text-slate-200 font-semibold text-base">
            {{ new Date(invoice.billing_month).toLocaleString('en-US', { month: 'long', year: 'numeric' }) }}
          </div>
          <div v-if="invoice.due_date" class="text-slate-400 text-xs mt-1">
            Due: <span :class="isOverdue(invoice) ? 'text-red-400 font-semibold' : 'text-slate-300'">{{ formatDate(invoice.due_date) }}</span>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="px-10 py-8">

        <!-- Billed To + Invoice Meta -->
        <div class="grid grid-cols-2 gap-8 mb-10">
          <!-- Billed To -->
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
            <p class="text-lg font-bold text-slate-800">{{ invoice.client?.name ?? '—' }}</p>
            <p v-if="invoice.client?.email" class="text-sm text-slate-500 mt-0.5">{{ invoice.client.email }}</p>
            <p v-if="invoice.project" class="text-sm text-slate-400 mt-1.5">
              <span class="font-medium text-slate-600">{{ invoice.project.name }}</span>
            </p>
          </div>

          <!-- Invoice Meta -->
          <div class="bg-slate-50 rounded-lg px-5 py-4 space-y-2">
            <div v-if="show('invoiceDate')" class="flex justify-between items-center text-sm">
              <span class="text-slate-400 font-medium">Invoice Date</span>
              <span class="text-slate-700 font-semibold">{{ formatDate(invoice.invoice_date) }}</span>
            </div>
            <div v-if="show('itemCount')" class="flex justify-between items-center text-sm">
              <span class="text-slate-400 font-medium">Total Items</span>
              <span class="text-slate-700 font-semibold">{{ invoice.items?.length ?? 0 }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-400 font-medium">Currency</span>
              <span class="text-slate-700 font-semibold">{{ invoice.currency?.code ?? '—' }} ({{ invoice.currency?.symbol ?? '' }})</span>
            </div>
            <div v-if="show('exchangeRate') && invoice.exchange_rate !== 1" class="flex justify-between items-center text-sm">
              <span class="text-slate-400 font-medium">Exchange Rate</span>
              <span class="text-slate-700 font-semibold">{{ Number(invoice.exchange_rate).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table class="w-full text-sm mb-8">
          <thead>
            <tr class="bg-slate-800 text-white">
              <th class="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 rounded-tl-md">Description</th>
              <th v-if="show('qty')" class="text-center text-xs font-semibold uppercase tracking-wider px-4 py-3 w-20">Qty</th>
              <th v-if="show('unitPrice')" class="text-right text-xs font-semibold uppercase tracking-wider px-4 py-3 w-28">Unit Price</th>
              <th class="text-right text-xs font-semibold uppercase tracking-wider px-4 py-3 w-28 rounded-tr-md">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in invoice.items"
              :key="item.id"
              :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50'"
            >
              <td class="px-4 py-3 border-b border-slate-100">
                <p v-if="show('title')" class="font-semibold text-slate-800">{{ item.title }}</p>
                <p v-if="show('description') && item.description" class="text-slate-500 text-xs mt-0.5">{{ item.description }}</p>
                <p
                  v-if="show('dateRange') && item.service_period_start && item.service_period_end"
                  class="text-slate-400 text-xs mt-0.5"
                >
                  {{ formatDate(item.service_period_start) }} – {{ formatDate(item.service_period_end) }}
                </p>
                <p v-if="show('itemNotes') && item.notes" class="text-slate-400 text-xs mt-0.5 italic">{{ item.notes }}</p>
              </td>
              <td v-if="show('qty')" class="px-4 py-3 text-center text-slate-600 border-b border-slate-100">{{ item.quantity }}</td>
              <td v-if="show('unitPrice')" class="px-4 py-3 text-right text-slate-600 border-b border-slate-100">
                {{ currencySymbol }}{{ formatCurrency(item.unit_price) }}
              </td>
              <td class="px-4 py-3 text-right font-semibold text-slate-800 border-b border-slate-100">
                {{ currencySymbol }}{{ formatCurrency(item.total_price ?? item.unit_price * item.quantity) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div class="flex justify-end mb-8">
          <div class="w-72">
            <div class="space-y-2 mb-3">
              <div class="flex justify-between text-sm px-4">
                <span class="text-slate-500">Subtotal</span>
                <span class="text-slate-700 font-medium">{{ currencySymbol }}{{ formatCurrency(invoice.subtotal) }}</span>
              </div>
              <div v-if="invoice.tax_amount > 0" class="flex justify-between text-sm px-4">
                <span class="text-slate-500">{{ invoice.tax_label || 'Tax' }} ({{ invoice.tax_rate }}%)</span>
                <span class="text-slate-700 font-medium">{{ currencySymbol }}{{ formatCurrency(invoice.tax_amount) }}</span>
              </div>
            </div>
            <!-- Total Row -->
            <div class="bg-slate-800 rounded-lg px-4 py-3 flex justify-between items-center">
              <span class="text-white font-bold text-sm uppercase tracking-wider">Total</span>
              <span class="text-white font-extrabold text-xl">{{ currencySymbol }}{{ formatCurrency(invoice.total_amount) }}</span>
            </div>
            <div v-if="show('baseCurrency') && invoice.exchange_rate !== 1" class="flex justify-between text-xs text-slate-400 mt-2 px-4">
              <span>Base Currency Total</span>
              <span>{{ formatCurrency(invoice.total_amount_base_currency) }}</span>
            </div>
          </div>
        </div>

        <!-- Invoice Notes -->
        <div v-if="show('invoiceNotes') && invoice.notes" class="bg-slate-50 rounded-lg px-5 py-4 border-l-4 border-slate-300">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Notes</p>
          <p class="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{{ invoice.notes }}</p>
        </div>

      </div>

      <!-- Footer Bar -->
      <div class="bg-slate-100 px-10 py-3 flex items-center justify-between">
        <span class="text-xs text-slate-400 font-mono">{{ invoice.invoice_number }}</span>
        <span v-if="invoice.billing_month" class="text-xs text-slate-400">
          {{ new Date(invoice.billing_month).toLocaleString('en-US', { month: 'long', year: 'numeric' }) }}
        </span>
        <span class="text-xs text-slate-400">{{ invoice.client?.name ?? '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInvoiceStore } from '@/stores/InvoiceStore'
import type { Invoice } from '@/Types/Invoice'
import { ArrowLeft, Printer, Loader2, AlertTriangle } from 'lucide-vue-next'

const route = useRoute()
const invoiceStore = useInvoiceStore()
const { currentInvoice: invoice, loading } = storeToRefs(invoiceStore)

const error = ref('')

// Toggle options — key matches what show() checks
const toggleOptions = reactive([
  { key: 'title',         label: 'Item Title',          enabled: true  },
  { key: 'description',   label: 'Description',         enabled: false  },
  { key: 'itemNotes',     label: 'Item Notes',          enabled: false },
  { key: 'dateRange',     label: 'Date Range',          enabled: false },
  { key: 'qty',           label: 'Quantity',            enabled: true },
  { key: 'itemCount',     label: 'Item Count',          enabled: true  },
  { key: 'invoiceDate',   label: 'Invoice Date',        enabled: false },
  { key: 'paymentStatus', label: 'Payment Status',      enabled: false  },
  { key: 'unitPrice',     label: 'Unit Price',          enabled: false },
  { key: 'exchangeRate',  label: 'Exchange Rate',       enabled: false },
  { key: 'baseCurrency',  label: 'Base Currency Total', enabled: false },
  { key: 'invoiceNotes', label: 'Invoice Notes',        enabled: false },
])

const show = (key: string): boolean =>
  toggleOptions.find(o => o.key === key)?.enabled ?? false

const currencySymbol = computed(() => invoice.value?.currency?.symbol ?? '')

const fetchInvoice = async () => {
  error.value = ''
  await invoiceStore.fetchInvoice(Number(route.params.id))
  if (!invoice.value) error.value = 'Invoice not found'
}

const formatCurrency = (amount: number): string =>
  amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

const getStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    draft: 'bg-slate-600 text-slate-100 border-slate-500',
    sent: 'bg-blue-600 text-blue-100 border-blue-500',
    paid: 'bg-green-600 text-green-100 border-green-500',
    overdue: 'bg-red-600 text-red-100 border-red-500',
    cancelled: 'bg-yellow-600 text-yellow-100 border-yellow-500',
  }
  return classes[status] ?? classes.draft
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    draft: 'Draft', sent: 'Sent', paid: 'Paid', overdue: 'Overdue', cancelled: 'Cancelled',
  }
  return labels[status] ?? status
}

const isOverdue = (inv: Invoice): boolean => {
  if (!inv.due_date || inv.status === 'paid' || inv.status === 'cancelled') return false
  return new Date(inv.due_date) < new Date()
}

const printTitle = computed(() => {
  const inv = invoice.value
  if (!inv) return 'Invoice'
  const d = new Date(inv.invoice_date)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const month = d.toLocaleString('en-US', { month: 'long' })
  const yyyy = d.getFullYear()
  const client = inv.client?.name?.toLowerCase().replace(/\s+/g, '-') ?? 'invoice'
  return `${mm}-${month}-${yyyy}-${client}`
})

const printInvoice = () => {
  const el = document.getElementById('invoice-print')
  if (!el) return

  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return

  // Collect all stylesheet links from the current page
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(s => s.outerHTML)
    .join('\n')

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${printTitle.value}</title>
  ${styles}
  <style>
    @page { size: A4; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 0; font-family: sans-serif; background: white; }
  </style>
</head>
<body>${el.innerHTML}</body>
</html>`)
  win.document.close()
  win.onload = () => {
    win.focus()
    win.print()
    win.close()
  }
}

onMounted(fetchInvoice)
</script>
