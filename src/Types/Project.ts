import type { CalculationType, Currency } from '@/Types/Currency';

export type ProjectStatus = 'prospective' | 'planned' | 'active' | 'completed' | 'on_hold' | 'cancelled';

export interface ProjectClient {
    id: number;
    name: string;
    client_code: string;
}

export interface ProjectFreelancer {
    id: number;
    name: string;
}

export interface Project {
    id: number;
    name: string;
    client_id: number | null;
    budget: number | null;
    currency_id: number | null;
    currency: Currency | null;
    exchange_rate: number | null;
    calculation_type: CalculationType;
    budget_base_currency: number | null;
    notes: string | null;
    project_details: string | null;
    start_date: string | null;
    end_date: string | null;
    deadline: string | null;
    estimated_hours: number | null;
    actual_hours: number;
    total_paid: number;
    total_paid_base_currency: number;
    status: ProjectStatus;
    budget_exceeded: boolean;
    remaining_budget: number | null;
    time_variance: number | null;
    client: ProjectClient | null;
    freelancer: ProjectFreelancer;
    created_at: string;
    updated_at: string;
}

export interface CreateProjectRequest {
    client_id: string | number;
    name: string;
    budget?: number | null;
    currency_id: string | number | null;
    exchange_rate?: number | null;
    calculation_type?: CalculationType;
    notes?: string | null;
    project_details?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    deadline?: string | null;
    estimated_hours?: number | null;
    status: ProjectStatus;
}

export interface UpdateProjectRequest extends CreateProjectRequest {}

export interface ProjectFilters {
    search?: string;
    status?: string;
    per_page?: number;
    page?: number;
}
