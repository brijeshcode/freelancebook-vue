import { defineStore } from 'pinia';
import { ref } from 'vue';
import listDataService from '@/services/System/ListDataService';
import type { ListCurrency, ListClient, ListProject, ListService } from '@/services/System/ListDataService';

export const useListDataStore = defineStore('listData', () => {

    // ── Internal reactive state (for template binding via storeToRefs) ──────
    const _currencies = ref<ListCurrency[]>([]);
    const _clients    = ref<ListClient[]>([]);
    const _projects   = ref<ListProject[]>([]);
    const _services   = ref<ListService[]>([]);

    // Track which clientId the scoped lists were last fetched for.
    // undefined = never fetched, null = fetched without a filter
    const _projectsClientId = ref<number | string | null | undefined>(undefined);
    const _servicesClientId = ref<number | string | null | undefined>(undefined);

    const loadingCurrencies = ref(false);
    const loadingClients    = ref(false);
    const loadingProjects   = ref(false);
    const loadingServices   = ref(false);

    // ── Smart async getters ──────────────────────────────────────────────────
    // Call like: `const list = await store.currencies()`
    // Re-uses cached data automatically. Pass `force = true` to bypass cache.

    const currencies = async (force = false): Promise<ListCurrency[]> => {
        if (!force && _currencies.value.length > 0) return _currencies.value;

        loadingCurrencies.value = true;
        try {
            _currencies.value = await listDataService.getCurrencies();
        } catch (error) {
            console.error('Error fetching currencies:', error);
        } finally {
            loadingCurrencies.value = false;
        }
        return _currencies.value;
    };

    const clients = async (force = false): Promise<ListClient[]> => {
        if (!force && _clients.value.length > 0) return _clients.value;

        loadingClients.value = true;
        try {
            _clients.value = await listDataService.getClients();
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            loadingClients.value = false;
        }
        return _clients.value;
    };

    /**
     * Returns projects for the given clientId (or all projects if omitted).
     * Cache is scoped per clientId — switching clientId triggers a fresh fetch.
     */
    const projects = async (clientId?: number | string, force = false): Promise<ListProject[]> => {
        const sameScope = _projectsClientId.value === (clientId ?? null);
        if (!force && sameScope && _projects.value.length > 0) return _projects.value;

        loadingProjects.value = true;
        try {
            _projects.value = await listDataService.getProjects(clientId);
            _projectsClientId.value = clientId ?? null;
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            loadingProjects.value = false;
        }
        return _projects.value;
    };

    /**
     * Returns services for the given clientId (or all services if omitted).
     * Cache is scoped per clientId — switching clientId triggers a fresh fetch.
     */
    const services = async (clientId?: number | string, force = false): Promise<ListService[]> => {
        const sameScope = _servicesClientId.value === (clientId ?? null);
        if (!force && sameScope && _services.value.length > 0) return _services.value;

        loadingServices.value = true;
        try {
            _services.value = await listDataService.getServices(clientId);
            _servicesClientId.value = clientId ?? null;
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            loadingServices.value = false;
        }
        return _services.value;
    };

    return {
        // Reactive refs — use with storeToRefs() for template binding
        currencies: _currencies,
        clients:    _clients,
        projects:   _projects,
        services:   _services,
        loadingCurrencies,
        loadingClients,
        loadingProjects,
        loadingServices,
        // Smart async getters — call these to load data
        getCurrencies: currencies,
        getClients:    clients,
        getProjects:   projects,
        getServices:   services,
    };
});
