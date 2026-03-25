<template>
  <div class="inline-block" ref="containerRef">
    <button
      type="button"
      @click="toggle"
      :disabled="loading"
      class="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full transition-opacity"
      :class="statusClass"
    >
      <Loader2 v-if="loading" class="h-3 w-3 animate-spin" />
      {{ statusLabel }}
      <ChevronDown class="h-3 w-3" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        ref="dropdownRef"
        :style="dropdownStyle"
        class="fixed z-[9999] w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1"
      >
        <button
          v-for="s in otherStatuses"
          :key="s"
          type="button"
          @click="select(s)"
          class="w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="getStatusTextClass(s)"
        >
          {{ labels[s] }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Loader2 } from 'lucide-vue-next'
import { useInvoiceStore } from '@/stores/InvoiceStore'
import type { InvoiceStatus } from '@/services/System/InvoiceService'

const props = defineProps<{
  invoiceId: number
  status: InvoiceStatus
}>()

const emit = defineEmits<{
  updated: [status: InvoiceStatus]
}>()

const invoiceStore = useInvoiceStore()

const open = ref(false)
const loading = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref({ top: '0px', left: '0px' })

const allStatuses: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue', 'cancelled']

const labels: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

const statusBgClass: Record<InvoiceStatus, string> = {
  draft:     'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  sent:      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  paid:      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  overdue:   'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  cancelled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
}

const statusTextClass: Record<InvoiceStatus, string> = {
  draft:     'text-gray-700 dark:text-gray-300',
  sent:      'text-blue-700 dark:text-blue-400',
  paid:      'text-green-700 dark:text-green-400',
  overdue:   'text-red-700 dark:text-red-400',
  cancelled: 'text-yellow-700 dark:text-yellow-400',
}

const statusClass = computed(() => statusBgClass[props.status])
const statusLabel = computed(() => labels[props.status])
const otherStatuses = computed(() => allStatuses.filter(s => s !== props.status))

const getStatusTextClass = (s: InvoiceStatus) => statusTextClass[s]

const toggle = () => {
  if (!open.value && containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    dropdownStyle.value = {
      top: `${rect.bottom + window.scrollY + 4}px`,
      left: `${rect.left + window.scrollX}px`,
    }
  }
  open.value = !open.value
}

const select = async (status: InvoiceStatus) => {
  open.value = false
  loading.value = true
  const updated = await invoiceStore.changeStatus(props.invoiceId, status)
  loading.value = false
  if (updated) emit('updated', updated.status)
}

const onClickOutside = (e: MouseEvent) => {
  const target = e.target as Node
  if (
    containerRef.value && !containerRef.value.contains(target) &&
    dropdownRef.value && !dropdownRef.value.contains(target)
  ) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>
