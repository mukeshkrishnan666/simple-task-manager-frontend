import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card class="task-form-card" appearance="outlined">
      <mat-card-header>
        <mat-icon mat-card-avatar color="primary">add_task</mat-icon>
        <mat-card-title>Create New Task</mat-card-title>
        <mat-card-subtitle>Enter task details to store in database</mat-card-subtitle>
      </mat-card-header>

      <mat-progress-bar *ngIf="isSubmitting" mode="indeterminate"></mat-progress-bar>

      <mat-card-content>
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Task Title</mat-label>
            <input matInput formControlName="title" placeholder="e.g., Implement authentication" maxlength="255">
            <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
              Title is required and cannot be empty.
            </mat-error>
            <mat-error *ngIf="taskForm.get('title')?.hasError('maxlength')">
              Title cannot exceed 255 characters.
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description (Optional)</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Provide extra details..." maxlength="1000"></textarea>
            <mat-hint align="end">{{ taskForm.get('description')?.value?.length || 0 }}/1000</mat-hint>
            <mat-error *ngIf="taskForm.get('description')?.hasError('maxlength')">
              Description cannot exceed 1000 characters.
            </mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="onReset()" [disabled]="isSubmitting">
              Reset
            </button>
            <button mat-flat-button color="primary" type="submit" [disabled]="taskForm.invalid || isSubmitting">
              <mat-icon>save</mat-icon>
              Save Task
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .task-form-card {
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(149, 157, 165, 0.15) !important;
      border: none !important;
      padding: 16px 24px;
      background-color: #ffffff;
    }
    mat-card-header {
      margin-bottom: 20px;
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
    .full-width {
      width: 100%;
      margin-top: 8px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    button[mat-flat-button] {
      border-radius: 8px;
      padding: 0 28px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  `]
})
export class TaskFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly snackBar = inject(MatSnackBar);

  // Grab a reference to the form directive from the HTML
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  @Output() taskCreated = new EventEmitter<void>();

  isSubmitting = false;

  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(1000)]]
  });

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.isSubmitting = true;
    this.taskService.createTask(this.taskForm.value).subscribe({
      next: () => {
        this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });

        // This fully clears the validation UI state and the values
        this.formDirective.resetForm();

        this.isSubmitting = false;
        this.taskCreated.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.title || err.error?.error || 'Failed to create task';
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      }
    });
  }

  onReset(): void {
    this.formDirective.resetForm();
  }
}