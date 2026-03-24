import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import invoiceService from '@/services/System/InvoiceService';
import type {
    Invoice,
    CreateInvoiceRequest,
    UpdateInvoiceRequest,
    InvoiceFilters, 
    InvoiceStats,
} from '@/services/System/InvoiceService';
import type { Pagination } from '@/Types/Paginate';

export const useInvoiceStore = defineStore('invoice', () => {
    // State
    const invoices = ref<Invoice[]>([]);
    const currentInvoice = ref<Invoice | null>(null);
    const pagination = ref<Pagination | null>(null);
    const stats = ref<InvoiceStats>({
        total_invoices: 0,
        total_billed: 0,
        outstanding_balance: 0,
        overdue_invoices: 0,
    });
    const loading = ref(false);
    const saving = ref(false);
    const deleting = ref(false);
    const errors = ref<Record<string, string[]>>({});

    const filters = reactive<InvoiceFilters>({
        search: '',
        status: '',
        client_id: '',
        date_from: '',
        per_page: 15,
        page: 1,
    });

    // Actions

    /**
     * Fetch paginated list of invoices
     */
    const fetchInvoices = async (page = 1) => {
        loading.value = true;
        try {
            const result = await invoiceService.getInvoices({ ...filters, page });
            invoices.value = result.data;
            pagination.value = result.pagination;
        } catch (error) {
            console.error('Error in fetchInvoices:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch a single invoice by ID
     */
    const fetchInvoice = async (id: number) => {
        loading.value = true;
        currentInvoice.value = null;
        try {
            currentInvoice.value = await invoiceService.getInvoice(id);
        } catch (error) {
            console.error('Error in fetchInvoice:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch invoice statistics
     */
    const fetchStats = async () => {
        try {
            stats.value = await invoiceService.getStats({
                client_id: filters.client_id,
                date_from: filters.date_from,
            });
        } catch (error) {
            console.error('Error in fetchStats:', error);
        }
    };

    /**
     * Create a new invoice — returns the created invoice or null on failure
     */
    const createInvoice = async (data: CreateInvoiceRequest): Promise<Invoice | null> => {
        saving.value = true;
        errors.value = {};
        try {
            const invoice = await invoiceService.createInvoice(data);
            invoices.value.unshift(invoice);
            return invoice;
        } catch (error: any) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                errors.value = error.response.data.errors;
            }
            return null;
        } finally {
            saving.value = false;
        }
    };

    /**
     * Update an existing invoice — returns the updated invoice or null on failure
     */
    const updateInvoice = async (id: number, data: UpdateInvoiceRequest): Promise<Invoice | null> => {
        saving.value = true;
        errors.value = {};
        try {
            const updated = await invoiceService.updateInvoice(id, data);
            const index = invoices.value.findIndex(i => i.id === id);
            if (index !== -1) invoices.value[index] = updated;
            if (currentInvoice.value?.id === id) currentInvoice.value = updated;
            return updated;
        } catch (error: any) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                errors.value = error.response.data.errors;
            }
            return null;
        } finally {
            saving.value = false;
        }
    };

    /**
     * Delete an invoice by ID — returns true on success
     */
    const deleteInvoice = async (id: number): Promise<boolean> => {
        deleting.value = true;
        try {
            await invoiceService.deleteInvoice(id);
            invoices.value = invoices.value.filter(i => i.id !== id);
            if (currentInvoice.value?.id === id) currentInvoice.value = null;
            return true;
        } catch (error) {
            console.error('Error in deleteInvoice:', error);
            return false;
        } finally {
            deleting.value = false;
        }
    };

    /**
     * Mark an invoice as sent and sync it back into state
     */
    const markAsSent = async (id: number): Promise<Invoice | null> => {
        try {
            const updated = await invoiceService.markAsSent(id);
            const index = invoices.value.findIndex(i => i.id === id);
            if (index !== -1) invoices.value[index] = updated;
            if (currentInvoice.value?.id === id) currentInvoice.value = updated;
            return updated;
        } catch (error) {
            console.error('Error in markAsSent:', error);
            return null;
        }
    };

    /**
     * Download invoice PDF — triggers browser download
     */
    const downloadPDF = async (id: number, invoiceNumber: string) => {
        try {
            const blob = await invoiceService.downloadPDF(id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${invoiceNumber}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error in downloadPDF:', error);
        }
    };

    /**
     * Update a single filter field and re-fetch from page 1
     */
    const setFilter = async <K extends keyof InvoiceFilters>(key: K, value: InvoiceFilters[K]) => {
        filters[key] = value;
        await fetchInvoices(1);
    };

    /**
     * Reset all filters to defaults
     */
    const resetFilters = async () => {
        filters.search = '';
        filters.status = '';
        filters.client_id = '';
        filters.date_from = '';
        filters.per_page = 15;
        filters.page = 1;
        await fetchInvoices(1);
    };

    /**
     * Clear validation errors
     */
    const clearErrors = () => {
        errors.value = {};
    };

    /**
     * Clear the currently loaded invoice
     */
    const clearCurrentInvoice = () => {
        currentInvoice.value = null;
    };

    return {
        // State
        invoices,
        currentInvoice,
        pagination,
        stats,
        loading,
        saving,
        deleting,
        errors,
        filters,
        // Actions
        fetchInvoices,
        fetchInvoice,
        fetchStats,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        markAsSent,
        downloadPDF,
        setFilter,
        resetFilters,
        clearErrors,
        clearCurrentInvoice,
    };
});
