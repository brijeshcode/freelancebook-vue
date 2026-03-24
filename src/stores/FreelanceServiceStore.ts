import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import freelanceServiceService from '@/services/System/FreelanceServiceService';
import type {
    FreelanceService,
    CreateFreelanceServiceRequest,
    UpdateFreelanceServiceRequest,
    FreelanceServiceFilters,
} from '@/services/System/FreelanceServiceService';
import type { Pagination } from '@/Types/Paginate';

export const useFreelanceServiceStore = defineStore('freelanceService', () => {
    // State
    const services = ref<FreelanceService[]>([]);
    const currentService = ref<FreelanceService | null>(null);
    const pagination = ref<Pagination | null>(null);
    const loading = ref(false);
    const saving = ref(false);
    const deleting = ref(false);
    const errors = ref<Record<string, string[]>>({});

    const filters = reactive<FreelanceServiceFilters>({
        search: '',
        client_id: '',
        status: '',
        frequency: '',
        per_page: 15,
        page: 1,
    });

    // Actions

    /**
     * Fetch paginated list of services
     */
    const fetchServices = async (page = 1) => {
        loading.value = true;
        try {
            const result = await freelanceServiceService.getServices({ ...filters, page });
            services.value = result.data;
            pagination.value = result.pagination;
        } catch (error) {
            console.error('Error in fetchServices:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch a single service by ID
     */
    const fetchService = async (id: number) => {
        loading.value = true;
        currentService.value = null;
        try {
            currentService.value = await freelanceServiceService.getService(id);
        } catch (error) {
            console.error('Error in fetchService:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Create a new service — returns the created service or null on failure
     */
    const createService = async (data: CreateFreelanceServiceRequest): Promise<FreelanceService | null> => {
        saving.value = true;
        errors.value = {};
        try {
            const service = await freelanceServiceService.createService(data);
            services.value.unshift(service);
            return service;
        } catch (error: any) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                errors.value = error.response.data.errors;
            }
            return null;
        } finally {
            saving.value = false;
        }
    };

    /**
     * Update an existing service — returns the updated service or null on failure
     */
    const updateService = async (id: number, data: UpdateFreelanceServiceRequest): Promise<FreelanceService | null> => {
        saving.value = true;
        errors.value = {};
        try {
            const updated = await freelanceServiceService.updateService(id, data);
            const index = services.value.findIndex(s => s.id === id);
            if (index !== -1) services.value[index] = updated;
            if (currentService.value?.id === id) currentService.value = updated;
            return updated;
        } catch (error: any) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                errors.value = error.response.data.errors;
            }
            return null;
        } finally {
            saving.value = false;
        }
    };

    /**
     * Delete a service by ID — returns true on success
     */
    const deleteService = async (id: number): Promise<boolean> => {
        deleting.value = true;
        try {
            await freelanceServiceService.deleteService(id);
            services.value = services.value.filter(s => s.id !== id);
            if (currentService.value?.id === id) currentService.value = null;
            return true;
        } catch (error) {
            console.error('Error in deleteService:', error);
            return false;
        } finally {
            deleting.value = false;
        }
    };

    /**
     * Toggle a service active/inactive and sync back into state
     */
    const toggleStatus = async (id: number): Promise<FreelanceService | null> => {
        try {
            const updated = await freelanceServiceService.toggleStatus(id);
            const index = services.value.findIndex(s => s.id === id);
            if (index !== -1) services.value[index] = updated;
            if (currentService.value?.id === id) currentService.value = updated;
            return updated;
        } catch (error) {
            console.error('Error in toggleStatus:', error);
            return null;
        }
    };

    /**
     * Update a single filter field and re-fetch from page 1
     */
    const setFilter = async <K extends keyof FreelanceServiceFilters>(key: K, value: FreelanceServiceFilters[K]) => {
        filters[key] = value;
        await fetchServices(1);
    };

    /**
     * Reset all filters to defaults
     */
    const resetFilters = async () => {
        filters.search = '';
        filters.client_id = '';
        filters.status = '';
        filters.frequency = '';
        filters.per_page = 15;
        filters.page = 1;
        await fetchServices(1);
    };

    /**
     * Clear validation errors
     */
    const clearErrors = () => {
        errors.value = {};
    };

    /**
     * Clear the currently loaded service
     */
    const clearCurrentService = () => {
        currentService.value = null;
    };

    return {
        // State
        services,
        currentService,
        pagination,
        loading,
        saving,
        deleting,
        errors,
        filters,
        // Actions
        fetchServices,
        fetchService,
        createService,
        updateService,
        deleteService,
        toggleStatus,
        setFilter,
        resetFilters,
        clearErrors,
        clearCurrentService,
    };
});
