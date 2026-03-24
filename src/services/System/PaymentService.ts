import { get, post, put, patch, del } from '@/services/axios';
import api from '@/services/axios';
import type { Payment, CreatePaymentRequest, UpdatePaymentRequest, PaymentFilters, PaymentClientBalance, PaymentStats } from '@/Types/Payment';
import type { Pagination } from '@/Types/Paginate';

export type { Payment, CreatePaymentRequest, UpdatePaymentRequest, PaymentFilters, PaymentClientBalance, PaymentStats };

export interface PaymentPaginatedResponse {
    data: Payment[];
    pagination: Pagination;
}

class PaymentService {
    private readonly baseUrl = '/payments';

    /**
     * Get paginated list of payments
     */
    async getPayments(filters?: PaymentFilters): Promise<PaymentPaginatedResponse> {
        try {
            const params = this.buildQueryParams(filters);
            const url = params ? `${this.baseUrl}?${params}` : this.baseUrl;
            const response = await get<Payment[]>(url, {
                loadingMessage: 'Loading payments...',
                showLoading: true,
            });

            return {
                data: response.data.data!,
                pagination: response.data.pagination!,
            };
        } catch (error) {
            console.error('Error fetching payments:', error);
            throw error;
        }
    }

    /**
     * Get a single payment by ID
     */
    async getPayment(id: number): Promise<Payment> {
        try {
            const response = await get<Payment>(`${this.baseUrl}/${id}`, {
                loadingMessage: 'Loading payment...',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error fetching payment:', error);
            throw error;
        }
    }

    /**
     * Create a new payment
     */
    async createPayment(data: CreatePaymentRequest): Promise<Payment> {
        try {
            const response = await post<Payment>(this.baseUrl, data, {
                loadingMessage: 'Recording payment...',
                showSuccessNotification: true,
                successMessage: 'Payment recorded successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    }

    /**
     * Update an existing payment
     */
    async updatePayment(id: number, data: UpdatePaymentRequest): Promise<Payment> {
        try {
            const response = await put<Payment>(`${this.baseUrl}/${id}`, data, {
                loadingMessage: 'Updating payment...',
                showSuccessNotification: true,
                successMessage: 'Payment updated successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error updating payment:', error);
            throw error;
        }
    }

    /**
     * Delete a payment
     */
    async deletePayment(id: number): Promise<void> {
        try {
            await del(`${this.baseUrl}/${id}`, {
                loadingMessage: 'Deleting payment...',
                showSuccessNotification: true,
                successMessage: 'Payment deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting payment:', error);
            throw error;
        }
    }

    /**
     * Verify a payment (PATCH /payments/:id/verify)
     */
    async verifyPayment(id: number): Promise<Payment> {
        try {
            const response = await patch<Payment>(`${this.baseUrl}/${id}/verify`, {}, {
                loadingMessage: 'Verifying payment...',
                showSuccessNotification: true,
                successMessage: 'Payment verified successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    }

    /**
     * Upload receipt files — returns the stored file paths
     */
    async uploadReceipts(files: File[]): Promise<string[]> {
        try {
            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            const response = await api.post(`${this.baseUrl}/upload-receipts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.file_paths ?? [];
        } catch (error) {
            console.error('Error uploading receipts:', error);
            throw error;
        }
    }

    /**
     * View a receipt file — returns a Blob for in-browser preview
     */
    async viewFile(path: string): Promise<Blob> {
        try {
            const response = await api.get(
                `${this.baseUrl}/view-file?path=${encodeURIComponent(path)}`,
                { responseType: 'blob' }
            );
            return response.data;
        } catch (error) {
            console.error('Error viewing file:', error);
            throw error;
        }
    }

    /**
     * Download a receipt file — returns a Blob for forced download
     */
    async downloadFile(path: string): Promise<Blob> {
        try {
            const response = await api.get(
                `${this.baseUrl}/download-file?path=${encodeURIComponent(path)}`,
                { responseType: 'blob' }
            );
            return response.data;
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    }

    /**
     * Get payment statistics
     */
    async getStats(): Promise<PaymentStats> {
        try {
            const response = await get<PaymentStats>(`${this.baseUrl}/stats`, {
                loadingMessage: 'Loading payment statistics...',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error fetching payment stats:', error);
            throw error;
        }
    }

    /**
     * Get outstanding balance for a client
     */
    async getClientBalance(clientId: number): Promise<PaymentClientBalance> {
        try {
            const response = await get<PaymentClientBalance>(`/clients/${clientId}/balance`);
            return response.data.data!;
        } catch (error) {
            console.error('Error fetching client balance:', error);
            throw error;
        }
    }

    /**
     * Build query parameters from filters
     */
    private buildQueryParams(filters?: Record<string, any>): string {
        if (!filters) return '';

        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, String(value));
            }
        });

        return params.toString();
    }
}

export const paymentService = new PaymentService();
export default paymentService;
