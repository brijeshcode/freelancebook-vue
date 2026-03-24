import { get, post, put, del } from '@/services/axios';
import type { Project, CreateProjectRequest, UpdateProjectRequest, ProjectFilters } from '@/Types/Project';
import type { Pagination } from '@/Types/Paginate';

export type { Project, CreateProjectRequest, UpdateProjectRequest, ProjectFilters };

export interface ProjectPaginatedResponse {
    data: Project[];
    pagination: Pagination;
}

class ProjectService {
    private readonly baseUrl = '/projects';

    /**
     * Get paginated list of projects
     */
    async getProjects(filters?: ProjectFilters): Promise<ProjectPaginatedResponse> {
        try {
            const params = this.buildQueryParams(filters);
            const url = params ? `${this.baseUrl}?${params}` : this.baseUrl;
            const response = await get<Project[]>(url, {
                loadingMessage: 'Loading projects...',
                showLoading: true,
            });

            return {
                data: response.data.data!,
                pagination: response.data.pagination!,
            };
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    /**
     * Get a single project by ID
     */
    async getProject(id: number): Promise<Project> {
        try {
            const response = await get<Project>(`${this.baseUrl}/${id}`, {
                loadingMessage: 'Loading project...',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error fetching project:', error);
            throw error;
        }
    }

    /**
     * Create a new project
     */
    async createProject(data: CreateProjectRequest): Promise<Project> {
        try {
            const response = await post<Project>(this.baseUrl, data, {
                loadingMessage: 'Creating project...',
                showSuccessNotification: true,
                successMessage: 'Project created successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    /**
     * Update an existing project
     */
    async updateProject(id: number, data: UpdateProjectRequest): Promise<Project> {
        try {
            const response = await put<Project>(`${this.baseUrl}/${id}`, data, {
                loadingMessage: 'Updating project...',
                showSuccessNotification: true,
                successMessage: 'Project updated successfully',
            });
            return response.data.data!;
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    }

    /**
     * Delete a project
     */
    async deleteProject(id: number): Promise<void> {
        try {
            await del(`${this.baseUrl}/${id}`, {
                loadingMessage: 'Deleting project...',
                showSuccessNotification: true,
                successMessage: 'Project deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }

    /**
     * Build query parameters from filters
     */
    private buildQueryParams(filters?: ProjectFilters): string {
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

export const projectService = new ProjectService();
export default projectService;
