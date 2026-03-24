export interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
    next_page_url: string | null;
    prev_page_url: string | null;
    first_page_url: string;
    last_page_url: string;
}

export interface PaginatedResponse<T> {
    message: string;
    data: T[];
    pagination: Pagination;
}
