export type ClientType = 'individual' | 'company';
export type ClientStatus = 'active' | 'inactive' | 'archived';

export interface ClientFinancial {
    total_billed: number;
    total_received: number;
    current_balance: number;
}

export interface Client {
    id: number;
    name: string;
    type: ClientType;
    contact_person: string | null;
    client_code: string;
    email: string | null;
    phone: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postal_code: string | null;
    tax_number: string | null;
    notes: string | null;
    status: ClientStatus;
    billing_preferences: Record<string, any> | null;
    financial: ClientFinancial;
    created_at: string;
    updated_at: string;
}

export interface CreateClientRequest {
    name: string;
    type: ClientType;
    contact_person?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postal_code?: string | null;
    tax_number?: string | null;
    notes?: string | null;
    status: ClientStatus;
}

export interface UpdateClientRequest extends CreateClientRequest {}

export interface ClientFilters {
    search?: string;
    status?: string;
    per_page?: number;
    page?: number;
}
