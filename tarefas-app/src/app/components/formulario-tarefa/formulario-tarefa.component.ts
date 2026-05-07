import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarefa } from '../../models/tarefa.model';

@Component({
  selector: 'app-formulario-tarefa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <h3>{{ tarefa?.id ? 'Editar Tarefa' : 'Nova Tarefa' }}</h3>
      <form (ngSubmit)="onSubmit()" #tarefaForm="ngForm">
        <div class="form-group">
          <label for="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            [(ngModel)]="formData.titulo"
            required
            #titulo="ngModel">
          <div *ngIf="titulo.invalid && titulo.touched" class="error">
            Título é obrigatório.
          </div>
        </div>

        <div class="form-group">
          <label for="descricao">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            [(ngModel)]="formData.descricao"
            required
            #descricao="ngModel">
          </textarea>
          <div *ngIf="descricao.invalid && descricao.touched" class="error">
            Descrição é obrigatória.
          </div>
        </div>

        <div class="form-group">
          <label for="status">Status:</label>
          <select
            id="status"
            name="status"
            [(ngModel)]="formData.status"
            required
            #status="ngModel">
            <option value="Pendente">Pendente</option>
            <option value="Concluída">Concluída</option>
          </select>
          <div *ngIf="status.invalid && status.touched" class="error">
            Status é obrigatório.
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="tarefaForm.invalid" class="btn-save">
            {{ tarefa?.id ? 'Atualizar' : 'Salvar' }}
          </button>
          <button type="button" (click)="onCancel()" class="btn-cancel">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      border: 1px solid #ddd;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input, textarea, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    textarea {
      height: 100px;
      resize: vertical;
    }
    .error {
      color: red;
      font-size: 0.9em;
      margin-top: 5px;
    }
    .form-actions {
      margin-top: 20px;
    }
    .btn-save {
      background-color: #4CAF50;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }
    .btn-save:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    .btn-cancel {
      background-color: #f44336;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-save:hover:not(:disabled) {
      background-color: #45a049;
    }
    .btn-cancel:hover {
      background-color: #da190b;
    }
  `]
})
export class FormularioTarefaComponent implements OnChanges {
  @Input() tarefa: Tarefa | null = null;
  @Output() save = new EventEmitter<Tarefa>();
  @Output() cancel = new EventEmitter<void>();

  formData: Tarefa = {
    titulo: '',
    descricao: '',
    status: 'Pendente'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tarefa'] && this.tarefa) {
      this.formData = { ...this.tarefa };
    } else if (!this.tarefa) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    if (this.formData.titulo.trim() && this.formData.descricao.trim() && this.formData.status) {
      this.save.emit({ ...this.formData });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private resetForm(): void {
    this.formData = {
      titulo: '',
      descricao: '',
      status: 'Pendente'
    };
  }
}