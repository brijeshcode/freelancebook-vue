import type { Currency, CalculationType } from '@/Types/Currency';
import type { InvoiceItem, CreateInvoiceItemRequest } from '@/Types/InvoiceItem';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceClient {
    id: number;
    name: string;
    email?: string;
}

export interface InvoiceProject {
    id: number;
    name: string;
    client_id?: number;
}

export interface Invoice {
    id: number;
    invoice_number: string;
    client_id: number;
    project_id: number | null;
    freelancer_id: number;
    invoice_date: string;
    due_date: string | null;
    notes: string | null;
    status: InvoiceStatus;
    exchange_rate: number;
    currency_id: number | null;
    currency: Currency | null;
    calculation_type: CalculationType;
    subtotal: number;
    subtotal_base_currency: number;
    tax_amount: number;
    tax_amount_base_currency: number;
    total_amount: number;
    total_amount_base_currency: number;
    tax_rate: number;
    tax_label: string | null;
    billing_month: string | null;
    sent_at: string | null;
    client: InvoiceClient | null;
    project: InvoiceProject | null;
    items?: InvoiceItem[];
    created_at: string;
    updated_at: string;
}

export interface CreateInvoiceRequest {
    client_id: string | number;
    project_id?: string | number | null;
    invoice_date: string;
    due_date?: string | null;
    notes?: string | null;
    currency_id: string | number | null;
    exchange_rate: number;
    calculation_type?: CalculationType;
    tax_rate: number;
    tax_label?: string | null;
    billing_month?: string | null;
    items: CreateInvoiceItemRequest[];
}

export interface UpdateInvoiceRequest extends CreateInvoiceRequest {}

export interface InvoiceFilters {
    search?: string;
    status?: string;
    client_id?: string | number;
    date_from?: string;
    billing_month?: string;
    per_page?: number;
    page?: number;
}
