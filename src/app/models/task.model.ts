export interface TaskRequest {
    title: string;
    description?: string;
}

export interface TaskResponse {
    id: number;
    title: string;
    description?: string;
    createdAt: string;
}

export interface PageMetadata {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

export interface PagedResponse<T> {
    content: T[];
    page: PageMetadata;
}