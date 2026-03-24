import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import clientService from '@/services/System/ClientService';
import type {
    Client,
    CreateClientRequest,
    UpdateClientRequest,
    ClientFilters,
} from '@/services/System/ClientService';
import type { Pagination } from '@/Types/Paginate';

export const useClientStore = defineStore('client', () => {
    // State
    const clients = ref<Client[]>([]);
    const currentClient = ref<Client | null>(null);
    const pagination = ref<Pagination | null>(null);
    const loading = ref(false);
    const saving = ref(false);
    const deleting = ref(false);
    const errors = ref<Record<string, string[]>>({});

    const filters = reactive<ClientFilters>({
        search: '',
        status: '',
        per_page: 15,
        page: 1,
    });

    // Actions

    /**
     * Fetch paginated list of clients
     */
    const fetchClients = async (page = 1) => {
        loading.value = true;
        try {
            const result = await clientService.getClients({ ...filters, page });
            clients.value = result.data;
            pagination.value = result.pagination;
        } catch (error) {
            console.error('Error in fetchClients:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch a single client by ID
     */
    const fetchClient = async (id: number) => {
        loading.value = true;
        currentClient.value = null;
        try {
            currentClient.value = await clientService.getClient(id);
        } catch (error) {
            console.error('Error in fetchClient:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Create a new client — returns the created client or null on failure
     */
    const createClient = async (data: CreateClientRequest): Promise<Client | null> => {
        saving.value = true;
        errors.value = {};
        try {
            const client = await clientService.createClient(data);
            clients.value.unshift(client);
            return client;
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
     * Update an existing client — returns the updated client or null on failure
     */
    const updateClient = async (id: number, data: UpdateClientRequest): Promise<Client | null> => {
        saving.value = true;
        errors.value = {};
        try {
            const updated = await clientService.updateClient(id, data);
            // Sync into list if present
            const index = clients.value.findIndex(c => c.id === id);
            if (index !== -1) clients.value[index] = updated;
            if (currentClient.value?.id === id) currentClient.value = updated;
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
     * Delete a client by ID — returns true on success
     */
    const deleteClient = async (id: number): Promise<boolean> => {
        deleting.value = true;
        try {
            await clientService.deleteClient(id);
            clients.value = clients.value.filter(c => c.id !== id);
            if (currentClient.value?.id === id) currentClient.value = null;
            return true;
        } catch (error) {
            console.error('Error in deleteClient:', error);
            return false;
        } finally {
            deleting.value = false;
        }
    };

    /**
     * Update a single filter field and re-fetch from page 1
     */
    const setFilter = async <K extends keyof ClientFilters>(key: K, value: ClientFilters[K]) => {
        filters[key] = value;
        await fetchClients(1);
    };

    /**
     * Reset all filters to defaults
     */
    const resetFilters = async () => {
        filters.search = '';
        filters.status = '';
        filters.per_page = 15;
        filters.page = 1;
        await fetchClients(1);
    };

    /**
     * Clear validation errors
     */
    const clearErrors = () => {
        errors.value = {};
    };

    /**
     * Clear the currently loaded client
     */
    const clearCurrentClient = () => {
        currentClient.value = null;
    };

    return {
        // State
        clients,
        currentClient,
        pagination,
        loading,
        saving,
        deleting,
        errors,
        filters,
        // Actions
        fetchClients,
        fetchClient,
        createClient,
        updateClient,
        deleteClient,
        setFilter,
        resetFilters,
        clearErrors,
        clearCurrentClient,
    };
});
