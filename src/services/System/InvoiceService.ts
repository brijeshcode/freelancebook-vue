import { get, post, put, patch, del } from '@/services/axios';
import api from '@/services/axios';
import type { Invoice, InvoiceStatus, CreateInvoiceRequest, UpdateInvoiceRequest, InvoiceFilters } from '@/Types/Invoice';
import type { Pagination } from '@/Types/Paginate';

export type { Invoice, InvoiceStatus, CreateInvoiceRequest, UpdateInvoiceRequest, InvoiceFilters };

export interface InvoicePaginatedResponse {
    data: Invoice[];
    pagination: Pagination;
}

export interface InvoiceStats {
    total_invoices: number;
    total_billed: number;
    outstanding_balance: number;
    overdue_invoices: number;
}

class InvoiceService {
    private readonly baseUrl = '/invoices';

    /**
     * Get paginated list of invoices
     */
    async getInvoices(filters?: InvoiceFilters): Promise<InvoicePaginatedResponse> {
        try {
            const params = this.buildQueryParams(filters);
            const url = params ? `${this.baseUrl}?${params}` : this.baseUrl;
            const response = await get<Invoice[]>(url, {
                loadingMessage: 'Loading invoices...',
                showLoading: true,
            });

            return {
                data: response.data.data!,
                pagination: response.data.pagination!,
            };
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw error;
        }
    }

    /**
     * Get a single invoice by ID
     */
    async getInvoice(id: number): Promise<Invoice> {
        try {
            const response = await get<Invoice>(`${this.baseUrl}/${id}`, {
                loadingMessage: 'Loading invoice...',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error fetching invoice:', error);
            throw error;
        }
    }

    /**
     * Create a new invoice
     */
    async createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
        try {
            const response = await post<Invoice>(this.baseUrl, data, {
                loadingMessage: 'Creating invoice...',
                showSuccessNotification: true,
                successMessage: 'Invoice created successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    }

    /**
     * Update an existing invoice
     */
    async updateInvoice(id: number, data: UpdateInvoiceRequest): Promise<Invoice> {
        try {
            const response = await put<Invoice>(`${this.baseUrl}/${id}`, data, {
                loadingMessage: 'Updating invoice...',
                showSuccessNotification: true,
                successMessage: 'Invoice updated successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error updating invoice:', error);
            throw error;
        }
    }

    /**
     * Delete an invoice
     */
    async deleteInvoice(id: number): Promise<void> {
        try {
            await del(`${this.baseUrl}/${id}`, {
                loadingMessage: 'Deleting invoice...',
                showSuccessNotification: true,
                successMessage: 'Invoice deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting invoice:', error);
            throw error;
        }
    }

    /**
     * Mark an invoice as sent
     */
    async markAsSent(id: number): Promise<Invoice> {
        try {
            const response = await patch<Invoice>(`${this.baseUrl}/${id}/mark-as-sent`, {}, {
                loadingMessage: 'Marking invoice as sent...',
                showSuccessNotification: true,
                successMessage: 'Invoice marked as sent',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error marking invoice as sent:', error);
            throw error;
        }
    }

    /**
     * Change invoice status
     */
    async changeStatus(id: number, status: InvoiceStatus): Promise<Invoice> {
        try {
            const response = await patch<Invoice>(`${this.baseUrl}/${id}/status`, { status }, {
                loadingMessage: 'Updating invoice status...',
                showSuccessNotification: true,
                successMessage: 'Invoice status updated successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error changing invoice status:', error);
            throw error;
        }
    }

    /**
     * Download invoice as PDF (returns a Blob)
     */
    async downloadPDF(id: number): Promise<Blob> {
        try {
            const response = await api.get(`${this.baseUrl}/${id}/pdf`, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            console.error('Error downloading invoice PDF:', error);
            throw error;
        }
    }

    /**
     * Get invoice statistics
     */
    async getStats(filters?: Pick<InvoiceFilters, 'client_id' | 'date_from'>): Promise<InvoiceStats> {
        try {
            const params = this.buildQueryParams(filters);
            const url = params ? `${this.baseUrl}/stats?${params}` : `${this.baseUrl}/stats`;
            const response = await get<InvoiceStats>(url, {
                loadingMessage: 'Loading invoice statistics...',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error fetching invoice statistics:', error);
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

export const invoiceService = new InvoiceService();
export default invoiceService;
