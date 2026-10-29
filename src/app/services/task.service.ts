import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse, TaskRequest, TaskResponse } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8080/api/tasks';

    getTasks(page: number = 0, size: number = 10, sort: string = 'createdAt,desc'): Observable<PagedResponse<TaskResponse>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<PagedResponse<TaskResponse>>(this.apiUrl, { params });
    }

    createTask(task: TaskRequest): Observable<TaskResponse> {
        return this.http.post<TaskResponse>(this.apiUrl, task);
    }
}