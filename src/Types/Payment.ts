import type { CalculationType, Currency } from '@/Types/Currency'; 

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'bank_transfer' | 'paypal' | 'stripe' | 'western_union' | 'cash' | 'check' | 'crypto' | 'other';

export interface PaymentClient {
    id: number;
    name: string;
    email?: string;
}

export interface PaymentClientBalance {
    outstanding_balance: number;
    total_invoiced: number;
    total_paid: number;
}

export interface PaymentStats {
    total_payments: number;
    total_received: number;
    pending_amount: number;
    this_month: number;
}

export interface Payment {
    id: number;
    transaction_number: string;
    client_id: number;
    freelancer_id: number;
    amount: number;
    exchange_rate: number;
    currency_id: number | null;
    currency: Currency | null;
    calculation_type: CalculationType;
    amount_base_currency: number;
    payment_date: string;
    payment_method: PaymentMethod;
    transaction_reference: string | null;
    notes: string | null;
    status: PaymentStatus;
    verified_at: string | null;
    verified_by: number | null;
    receipt_attachments: string[] | null;
    client: PaymentClient | null;
    created_at: string;
    updated_at: string;
}

export interface CreatePaymentRequest {
    client_id: string | number;
    amount: number;
    currency_id: string | number | null;
    exchange_rate: number;
    calculation_type?: CalculationType;
    payment_date: string;
    payment_method: PaymentMethod;
    transaction_reference?: string | null;
    notes?: string | null;
    status: PaymentStatus;
    receipt_attachments?: string[] | null;
}

export interface UpdatePaymentRequest extends CreatePaymentRequest {}

export interface PaymentFilters {
    search?: string;
    status?: string;
    payment_method?: string;
    client_id?: string | number;
    per_page?: number;
    page?: number;
}
