import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskResponse } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card appearance="outlined" class="task-list-card">
      <mat-card-header>
        <mat-icon mat-card-avatar color="primary">view_list</mat-icon>
        <mat-card-title>Task Backlog</mat-card-title>
        <mat-card-subtitle>All persisted items from backend</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content class="table-content-wrapper">
        <!-- Loading Overlay -->
        <div class="loading-shade" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="tasks" class="full-width-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef> ID </th>
              <td mat-cell *matCellDef="let task"> #{{ task.id }} </td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef> Title </th>
              <td mat-cell *matCellDef="let task" class="font-medium"> {{ task.title }} </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef> Description </th>
              <td mat-cell *matCellDef="let task" class="description-cell" [title]="task.description">
                {{ task.description || '—' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef> Created At </th>
              <td mat-cell *matCellDef="let task">
                {{ task.createdAt | date:'MMM d, y, h:mm a' }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell empty-state" [attr.colspan]="displayedColumns.length">
                <div *ngIf="!isLoading">
                  <mat-icon class="empty-icon">inbox</mat-icon>
                  <p>No tasks found. Create one above.</p>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <mat-paginator
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 25]"
          (page)="onPageChange($event)"
          aria-label="Select task page"
          [disabled]="isLoading">
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .task-list-card {
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(149, 157, 165, 0.15) !important;
      border: none !important;
      padding: 16px 24px;
      background-color: #ffffff;
    }
    mat-card-header {
      margin-bottom: 16px;
    }
    .mat-mdc-card-title {
      font-size: 1.4rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }
    .mat-mdc-card-subtitle {
      color: #6b7280;
      font-size: 0.95rem;
    }
    .table-content-wrapper {
      position: relative; /* Required for the loading overlay to position correctly */
    }
    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.7);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }
    .table-container {
      overflow-x: auto;
      margin-top: 24px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }
    .full-width-table {
      width: 100%;
    }
    th.mat-header-cell {
      background-color: #f9fafb;
      color: #374151;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
    td.mat-cell {
      padding: 16px;
      color: #4b5563;
    }
    .mat-mdc-row:hover {
      background-color: #f3f4f6 !important;
      transition: background-color 0.2s ease;
    }
    .font-medium {
      font-weight: 600;
      color: #111827 !important;
    }
    .description-cell {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #6b7280 !important;
    }
    .empty-state {
      text-align: center;
      padding: 64px 0;
      color: #9ca3af;
    }
    .empty-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      opacity: 0.4;
      margin-bottom: 16px;
    }
  `]
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'title', 'description', 'createdAt'];
  tasks: TaskResponse[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  isLoading = true; // Added loading state

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true; // Show spinner
    this.taskService.getTasks(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.tasks = res.content;
        this.totalElements = res.page.totalElements;
        this.isLoading = false; // Hide spinner
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Unable to load tasks from server', 'Close', { duration: 4000 });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTasks();
  }
}