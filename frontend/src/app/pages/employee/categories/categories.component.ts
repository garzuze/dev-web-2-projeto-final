import { Component, OnInit, inject, signal } from '@angular/core';

import { Category, CategoryService } from '../../../core/category.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../services/notification.service';
import { NotificationType } from '../../../models/notification.model';
import { CategoryModalComponent } from './category-modal/category-modal.component';

@Component({
  imports: [ConfirmDialogComponent, CategoryModalComponent],
  selector: 'app-categories',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly notifications = inject(NotificationService);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);

  /** Aberto com editing=null e criacao; com editing preenchido e edicao. */
  isFormOpen = false;
  editing: Category | null = null;

  removing: Category | null = null;
  isRemoving = false;

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loading.set(true);
    this.categoryService.list().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notifications.showNotification(
          'Nao foi possivel carregar as categorias.',
          NotificationType.error,
        );
      },
    });
  }

  onNew() {
    this.editing = null;
    this.isFormOpen = true;
  }

  onEdit(category: Category) {
    this.editing = category;
    this.isFormOpen = true;
  }

  onFormCancel() {
    this.isFormOpen = false;
  }

  onSaved(saved: Category) {
    const wasEditing = this.editing !== null;
    this.isFormOpen = false;
    this.notifications.showNotification(
      wasEditing ? `Categoria "${saved.name}" atualizada.` : `Categoria "${saved.name}" criada.`,
      NotificationType.success,
    );
    this.reload();
  }

  onRemove(category: Category) {
    this.removing = category;
  }

  onCancelRemove() {
    this.removing = null;
  }

  onConfirmRemove() {
    if (!this.removing) return;

    const target = this.removing;
    this.isRemoving = true;
    this.categoryService.deactivate(target.id).subscribe({
      next: () => {
        this.isRemoving = false;
        this.removing = null;
        this.notifications.showNotification(
          `Categoria "${target.name}" removida.`,
          NotificationType.success,
        );
        this.reload();
      },
      error: () => {
        this.isRemoving = false;
        this.removing = null;
        this.notifications.showNotification(
          'Nao foi possivel remover a categoria.',
          NotificationType.error,
        );
      },
    });
  }
}
