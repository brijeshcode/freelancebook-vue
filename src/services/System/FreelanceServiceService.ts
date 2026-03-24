import { get, post, put, patch, del } from '@/services/axios';
import type { Service, CreateServiceRequest, UpdateServiceRequest, ServiceFilters } from '@/Types/Service';
import type { Pagination } from '@/Types/Paginate';

export type { Service as FreelanceService, CreateServiceRequest as CreateFreelanceServiceRequest, UpdateServiceRequest as UpdateFreelanceServiceRequest, ServiceFilters as FreelanceServiceFilters };

export interface FreelanceServicePaginatedResponse {
    data: Service[];
    pagination: Pagination;
}

class FreelanceServiceService {
    private readonly baseUrl = '/services';

    /**
     * Get paginated list of services
     */
    async getServices(filters?: ServiceFilters): Promise<FreelanceServicePaginatedResponse> {
        try {
            const params = this.buildQueryParams(filters);
            const url = params ? `${this.baseUrl}?${params}` : this.baseUrl;
            const response = await get<Service[]>(url, {
                loadingMessage: 'Loading services...',
                showLoading: true,
            });

            return {
                data: response.data.data!,
                pagination: response.data.pagination!,
            };
        } catch (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
    }

    /**
     * Get a single service by ID
     */
    async getService(id: number): Promise<Service> {
        try {
            const response = await get<Service>(`${this.baseUrl}/${id}`, {
                loadingMessage: 'Loading service...',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error fetching service:', error);
            throw error;
        }
    }

    /**
     * Create a new service
     */
    async createService(data: CreateServiceRequest): Promise<Service> {
        try {
            const response = await post<Service>(this.baseUrl, data, {
                loadingMessage: 'Creating service...',
                showSuccessNotification: true,
                successMessage: 'Service created successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error creating service:', error);
            throw error;
        }
    }

    /**
     * Update an existing service
     */
    async updateService(id: number, data: UpdateServiceRequest): Promise<Service> {
        try {
            const response = await put<Service>(`${this.baseUrl}/${id}`, data, {
                loadingMessage: 'Updating service...',
                showSuccessNotification: true,
                successMessage: 'Service updated successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    }

    /**
     * Delete a service
     */
    async deleteService(id: number): Promise<void> {
        try {
            await del(`${this.baseUrl}/${id}`, {
                loadingMessage: 'Deleting service...',
                showSuccessNotification: true,
                successMessage: 'Service deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    }

    /**
     * Toggle service active/inactive status
     */
    async toggleStatus(id: number): Promise<Service> {
        try {
            const response = await patch<Service>(`${this.baseUrl}/${id}/toggle-status`, {}, {
                loadingMessage: 'Updating service status...',
                showSuccessNotification: true,
                successMessage: 'Service status updated',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error toggling service status:', error);
            throw error;
        }
    }

    /**
     * Build query parameters from filters
     */
    private buildQueryParams(filters?: ServiceFilters): string {
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

export const freelanceServiceService = new FreelanceServiceService();
export default freelanceServiceService;
