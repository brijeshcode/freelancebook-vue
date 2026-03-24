import { get } from '@/services/axios';

// Lean types for dropdown use — not full resource shapes

export interface ListCurrency {
    id: number;
    code: string;
    name: string;
    symbol: string;
    decimal_places: number;
    is_active: boolean;
}

export interface ListClient {
    id: number;
    name: string;
    client_code: string;
    email: string | null;
    status: 'active' | 'inactive' | 'archived';
}

export interface ListProject {
    id: number;
    name: string;
    client_id: number;
    status: string;
}

export interface ListService {
    id: number;
    title: string;
    description: string | null;
    client_id: number;
    project_id: number | null;
    currency: ListCurrency;
    amount: number;
    total_amount: number;
    frequency: string;
    status: string;
    next_billing_date: string | null;
    tags: string[] | null;
    metadata: { link?: string } | null;
}

class ListDataService {
    private readonly base = '/lists';

    /**
     * All active currencies for currency dropdowns
     */
    async getCurrencies(): Promise<ListCurrency[]> {
        const response = await get<ListCurrency[]>(`${this.base}/currencies`);
        return response.data.data!;
    }

    /**
     * All clients for client dropdowns
     */
    async getClients(): Promise<ListClient[]> {
        const response = await get<ListClient[]>(`${this.base}/clients`);
        return response.data.data!;
    }

    /**
     * Projects — optionally filtered by client
     */
    async getProjects(clientId?: number | string): Promise<ListProject[]> {
        const url = clientId
            ? `${this.base}/projects?client_id=${clientId}`
            : `${this.base}/projects`;
        const response = await get<ListProject[]>(url);
        return response.data.data!;
    }

    /**
     * Services — optionally filtered by client
     */
    async getServices(clientId?: number | string): Promise<ListService[]> {
        const url = clientId
            ? `${this.base}/services?client_id=${clientId}`
            : `${this.base}/services`;
        const response = await get<ListService[]>(url);
        return response.data.data!;
    }
}

export const listDataService = new ListDataService();
export default listDataService;
