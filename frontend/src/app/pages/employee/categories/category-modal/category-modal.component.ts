import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Category, CategoryService } from '../../../../core/category.service';
import { ModalContainerComponent } from '../../../../components/modal-container/modal-container.component';

/**
 * Mesmo modal para criar e editar: `category` nulo e insercao, preenchido e
 * edicao. Duas telas quase identicas divergem na validacao mais cedo ou mais
 * tarde, entao o formulario e um so.
 */
@Component({
  imports: [ModalContainerComponent, ReactiveFormsModule],
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
})
export class CategoryModalComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);

  @Input() category: Category | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Category>();

  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  get name() {
    return this.form.controls.name;
  }

  ngOnInit() {
    if (this.category) {
      this.form.setValue({ name: this.category.name });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.getRawValue().name.trim();
    this.saving.set(true);
    this.errorMessage.set('');

    const request$ = this.category
        ? this.categoryService.update(this.category.id, name)
        : this.categoryService.create(name);

    request$.subscribe({
      next: (category) => {
        this.saving.set(false);
        this.saved.emit(category);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.errorMessage.set(this.translateError(err));
      },
    });
  }

  private translateError(err: HttpErrorResponse): string {
    if (err.status === 409) return 'Já existe uma categoria com esse nome.';
    if (err.status === 400) return err.error?.detail ?? 'Dados inválidos.';
    if (err.status === 0) return 'Não foi possível conectar ao servidor.';
    return 'Erro ao salvar a categoria. Tente novamente.';
  }
}
