import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import projectService from '@/services/System/ProjectService';
import type {
    Project,
    CreateProjectRequest,
    UpdateProjectRequest,
    ProjectFilters, 
} from '@/services/System/ProjectService';
import type { Pagination } from '@/Types/Paginate';

export const useProjectStore = defineStore('project', () => {
    // State
    const projects = ref<Project[]>([]);
    const currentProject = ref<Project | null>(null);
    const pagination = ref<Pagination | null>(null);
    const loading = ref(false);
    const saving = ref(false);
    const deleting = ref(false);
    const errors = ref<Record<string, string[]>>({});

    const filters = reactive<ProjectFilters>({
        search: '',
        status: '',
        per_page: 15,
        page: 1,
    });

    // Actions

    /**
     * Fetch paginated list of projects
     */
    const fetchProjects = async (page = 1) => {
        loading.value = true;
        try {
            const result = await projectService.getProjects({ ...filters, page });
            projects.value = result.data;
            pagination.value = result.pagination;
        } catch (error) {
            console.error('Error in fetchProjects:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch a single project by ID
     */
    const fetchProject = async (id: number) => {
        loading.value = true;
        currentProject.value = null;
        try {
            currentProject.value = await projectService.getProject(id);
        } catch (error) {
            console.error('Error in fetchProject:', error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Create a new project — returns the created project or null on failure
     */
    const createProject = async (data: CreateProjectRequest): Promise<Project | null> => {
        saving.value = true;
        errors.value = {};
        try {
            const project = await projectService.createProject(data);
            projects.value.unshift(project);
            return project;
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
     * Update an existing project — returns the updated project or null on failure
     */
    const updateProject = async (id: number, data: UpdateProjectRequest): Promise<Project | null> => {
        saving.value = true;
        errors.value = {};
        try {
            const updated = await projectService.updateProject(id, data);
            const index = projects.value.findIndex(p => p.id === id);
            if (index !== -1) projects.value[index] = updated;
            if (currentProject.value?.id === id) currentProject.value = updated;
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
     * Delete a project by ID — returns true on success
     */
    const deleteProject = async (id: number): Promise<boolean> => {
        deleting.value = true;
        try {
            await projectService.deleteProject(id);
            projects.value = projects.value.filter(p => p.id !== id);
            if (currentProject.value?.id === id) currentProject.value = null;
            return true;
        } catch (error) {
            console.error('Error in deleteProject:', error);
            return false;
        } finally {
            deleting.value = false;
        }
    };

    /**
     * Update a single filter field and re-fetch from page 1
     */
    const setFilter = async <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => {
        filters[key] = value;
        await fetchProjects(1);
    };

    /**
     * Reset all filters to defaults
     */
    const resetFilters = async () => {
        filters.search = '';
        filters.status = '';
        filters.per_page = 15;
        filters.page = 1;
        await fetchProjects(1);
    };

    /**
     * Clear validation errors
     */
    const clearErrors = () => {
        errors.value = {};
    };

    /**
     * Clear the currently loaded project
     */
    const clearCurrentProject = () => {
        currentProject.value = null;
    };

    return {
        // State
        projects,
        currentProject,
        pagination,
        loading,
        saving,
        deleting,
        errors,
        filters,
        // Actions
        fetchProjects,
        fetchProject,
        createProject,
        updateProject,
        deleteProject,
        setFilter,
        resetFilters,
        clearErrors,
        clearCurrentProject,
    };
});
