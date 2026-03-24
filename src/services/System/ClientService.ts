import { get, post, put, del } from '@/services/axios';
import type { Client, CreateClientRequest, UpdateClientRequest, ClientFilters } from '@/Types/Client';
import type { Pagination } from '@/Types/Paginate';

export type { Client, CreateClientRequest, UpdateClientRequest, ClientFilters };

export interface ClientPaginatedResponse {
    data: Client[];
    pagination: Pagination;
}

class ClientService {
    private readonly baseUrl = '/clients';

    /**
     * Get paginated list of clients
     */
    async getClients(filters?: ClientFilters): Promise<ClientPaginatedResponse> {
        try {
            const params = this.buildQueryParams(filters);
            const url = params ? `${this.baseUrl}?${params}` : this.baseUrl;
            const response = await get<Client[]>(url, {
                loadingMessage: 'Loading clients...',
                showLoading: true,
            });

            return {
                data: response.data.data!,
                pagination: response.data.pagination!,
            };
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    }

    /**
     * Get a single client by ID
     */
    async getClient(id: number): Promise<Client> {
        try {
            const response = await get<Client>(`${this.baseUrl}/${id}`, {
                loadingMessage: 'Loading client...',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error fetching client:', error);
            throw error;
        }
    }

    /**
     * Create a new client
     */
    async createClient(data: CreateClientRequest): Promise<Client> {
        try {
            const response = await post<Client>(`${this.baseUrl}/store`, data, {
                loadingMessage: 'Creating client...',
                showSuccessNotification: true,
                successMessage: 'Client created successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    }

    /**
     * Update an existing client
     */
    async updateClient(id: number, data: UpdateClientRequest): Promise<Client> {
        try {
            const response = await put<Client>(`${this.baseUrl}/${id}`, data, {
                loadingMessage: 'Updating client...',
                showSuccessNotification: true,
                successMessage: 'Client updated successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error updating client:', error);
            throw error;
        }
    }

    /**
     * Delete a client
     */
    async deleteClient(id: number): Promise<void> {
        try {
            await del(`${this.baseUrl}/${id}`, {
                loadingMessage: 'Deleting client...',
                showSuccessNotification: true,
                successMessage: 'Client deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting client:', error);
            throw error;
        }
    }

    /**
     * Build query parameters from filters
     */
    private buildQueryParams(filters?: ClientFilters): string {
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

export const clientService = new ClientService();
export default clientService;
