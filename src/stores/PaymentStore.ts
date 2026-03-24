import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import paymentService from '@/services/System/PaymentService';
import type {
    Payment,
    CreatePaymentRequest,
    UpdatePaymentRequest,
    PaymentFilters, 
    PaymentStats,
    PaymentClientBalance,
} from '@/services/System/PaymentService';
import type { Pagination } from '@/Types/Paginate';

export const usePaymentStore = defineStore('payment', () => {
    // State
    const payments = ref<Payment[]>([]);
    const currentPayment = ref<Payment | null>(null);
    const pagination = ref<Pagination | null>(null);
    const stats = ref<PaymentStats>({
        total_payments: 0,
        total_received: 0,
        pending_amount: 0,
        this_month: 0,
    });
    const clientBalance = ref<PaymentClientBalance | null>(null);
    const loading = ref(false);
    const saving = ref(false);
    const deleting = ref(false);
    const errors = ref<Record<string, string[]>>({});

    const filters = reactive<PaymentFilters>({
        search: '',
        status: '',
        payment_method: '',
        client_id: '',
        per_page: 15,
        page: 1,
    });

    // Actions

    /**
     * Fetch paginated list of payments
     */
    const fetchPayments = async (page = 1) => {
        loading.value = true;
        try {
            const result = await paymentService.getPayments({ ...filters, page });
            payments.value = result.data;
            pagination.value = result.pagination;
        } catch (error) {
            console.error('Error in fetchPayments:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch a single payment by ID
     */
    const fetchPayment = async (id: number) => {
        loading.value = true;
        currentPayment.value = null;
        try {
            currentPayment.value = await paymentService.getPayment(id);
        } catch (error) {
            console.error('Error in fetchPayment:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch payment statistics
     */
    const fetchStats = async () => {
        try {
            stats.value = await paymentService.getStats();
        } catch (error) {
            console.error('Error in fetchStats:', error);
        }
    };

    /**
     * Fetch outstanding balance for a client
     */
    const fetchClientBalance = async (clientId: number) => {
        clientBalance.value = null;
        try {
            clientBalance.value = await paymentService.getClientBalance(clientId);
        } catch (error) {
            console.error('Error in fetchClientBalance:', error);
        }
    };

    /**
     * Create a new payment — returns the created payment or null on failure
     */
    const createPayment = async (data: CreatePaymentRequest): Promise<Payment | null> => {
        saving.value = true;
        errors.value = {};
        try {
            const payment = await paymentService.createPayment(data);
            payments.value.unshift(payment);
            return payment;
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
     * Update an existing payment — returns the updated payment or null on failure
     */
    const updatePayment = async (id: number, data: UpdatePaymentRequest): Promise<Payment | null> => {
        saving.value = true;
        errors.value = {};
        try {
            const updated = await paymentService.updatePayment(id, data);
            const index = payments.value.findIndex(p => p.id === id);
            if (index !== -1) payments.value[index] = updated;
            if (currentPayment.value?.id === id) currentPayment.value = updated;
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
     * Delete a payment by ID — returns true on success
     */
    const deletePayment = async (id: number): Promise<boolean> => {
        deleting.value = true;
        try {
            await paymentService.deletePayment(id);
            payments.value = payments.value.filter(p => p.id !== id);
            if (currentPayment.value?.id === id) currentPayment.value = null;
            return true;
        } catch (error) {
            console.error('Error in deletePayment:', error);
            return false;
        } finally {
            deleting.value = false;
        }
    };

    /**
     * Verify a payment and sync it back into state
     */
    const verifyPayment = async (id: number): Promise<Payment | null> => {
        try {
            const updated = await paymentService.verifyPayment(id);
            const index = payments.value.findIndex(p => p.id === id);
            if (index !== -1) payments.value[index] = updated;
            if (currentPayment.value?.id === id) currentPayment.value = updated;
            return updated;
        } catch (error) {
            console.error('Error in verifyPayment:', error);
            return null;
        }
    };

    /**
     * Upload receipt files — returns stored file paths
     */
    const uploadReceipts = async (files: File[]): Promise<string[]> => {
        try {
            return await paymentService.uploadReceipts(files);
        } catch (error) {
            console.error('Error in uploadReceipts:', error);
            return [];
        }
    };

    /**
     * Open a receipt file in a new browser tab
     */
    const viewFile = async (path: string) => {
        try {
            const blob = await paymentService.viewFile(path);
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error in viewFile:', error);
        }
    };

    /**
     * Trigger browser download for a receipt file
     */
    const downloadFile = async (path: string) => {
        try {
            const blob = await paymentService.downloadFile(path);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = path.split('/').pop() ?? 'receipt';
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error in downloadFile:', error);
        }
    };

    /**
     * Update a single filter field and re-fetch from page 1
     */
    const setFilter = async <K extends keyof PaymentFilters>(key: K, value: PaymentFilters[K]) => {
        filters[key] = value;
        await fetchPayments(1);
    };

    /**
     * Reset all filters to defaults
     */
    const resetFilters = async () => {
        filters.search = '';
        filters.status = '';
        filters.payment_method = '';
        filters.client_id = '';
        filters.per_page = 15;
        filters.page = 1;
        await fetchPayments(1);
    };

    /**
     * Clear validation errors
     */
    const clearErrors = () => {
        errors.value = {};
    };

    /**
     * Clear the currently loaded payment
     */
    const clearCurrentPayment = () => {
        currentPayment.value = null;
    };

    /**
     * Clear the loaded client balance
     */
    const clearClientBalance = () => {
        clientBalance.value = null;
    };

    return {
        // State
        payments,
        currentPayment,
        pagination,
        stats,
        clientBalance,
        loading,
        saving,
        deleting,
        errors,
        filters,
        // Actions
        fetchPayments,
        fetchPayment,
        fetchStats,
        fetchClientBalance,
        createPayment,
        updatePayment,
        deletePayment,
        verifyPayment,
        uploadReceipts,
        viewFile,
        downloadFile,
        setFilter,
        resetFilters,
        clearErrors,
        clearCurrentPayment,
        clearClientBalance,
    };
});
