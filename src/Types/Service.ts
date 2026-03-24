import type { CalculationType, Currency } from '@/Types/Currency';

export type ServiceStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'pending_approval';
export type ServiceFrequency = 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export interface ServiceClient {
    id: number;
    name: string;
    client_code?: string;
}

export interface ServiceProject {
    id: number;
    name: string;
}

export interface Service {
    id: number;
    client_id: number;
    project_id: number | null;
    title: string;
    description: string | null;
    amount: number;
    currency_id: number | null;
    currency: Currency | null;
    exchange_rate: number | null;
    calculation_type: CalculationType;
    amount_base_currency: number | null;
    has_tax: boolean;
    tax_name: string | null;
    tax_rate: number;
    tax_type: 'inclusive' | 'exclusive';
    frequency: ServiceFrequency;
    start_date: string;
    next_billing_date: string | null;
    end_date: string | null;
    status: ServiceStatus;
    is_active: boolean;
    billing_count: number;
    last_billed_at: string | null;
    tags: string[] | null;
    notes: string | null;
    metadata: { link?: string } | null;
    base_amount: number;
    tax_amount: number;
    total_amount: number;
    client: ServiceClient | null;
    project: ServiceProject | null;
    created_at: string;
    updated_at: string;
}

export interface CreateServiceRequest {
    client_id: string | number;
    project_id?: string | number | null;
    title: string;
    description?: string | null;
    amount: number | null;
    currency_id: string | number | null;
    exchange_rate?: number | null;
    calculation_type?: CalculationType;
    has_tax: boolean;
    tax_name?: string | null;
    tax_rate?: number;
    tax_type?: 'inclusive' | 'exclusive';
    frequency: ServiceFrequency;
    start_date: string;
    next_billing_date?: string | null;
    end_date?: string | null;
    status: ServiceStatus;
    is_active?: boolean;
    tags?: string[] | null;
    notes?: string | null;
}

export interface UpdateServiceRequest extends CreateServiceRequest {}

export interface ServiceFilters {
    search?: string;
    client_id?: string | number;
    status?: string;
    frequency?: string;
    per_page?: number;
    page?: number;
}
