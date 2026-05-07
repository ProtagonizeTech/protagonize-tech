import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa.model';
import { FormularioTarefaComponent } from '../formulario-tarefa/formulario-tarefa.component';

@Component({
  selector: 'app-lista-tarefas',
  standalone: true,
  imports: [CommonModule, FormularioTarefaComponent],
  template: `
    <div class="tarefas-container">
      <h2>Lista de Tarefas</h2>
      <button class="btn-add" (click)="showForm = !showForm" [disabled]="loading">
        {{ showForm ? 'Cancelar' : 'Adicionar Tarefa' }}
      </button>

      <div *ngIf="loading" class="loading">
        Carregando...
      </div>

      <app-formulario-tarefa
        *ngIf="showForm"
        [tarefa]="selectedTarefa"
        (save)="onSave($event)"
        (cancel)="onCancel()">
      </app-formulario-tarefa>

      <table class="tarefas-table" *ngIf="tarefas.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Status</th>
            <th>Data Criação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let tarefa of tarefas" [class.concluida]="tarefa.status === 'Concluída'">
            <td>{{ tarefa.id }}</td>
            <td>{{ tarefa.titulo }}</td>
            <td>{{ tarefa.descricao }}</td>
            <td>
              <span class="status-badge" [class]="tarefa.status.toLowerCase().replace(' ', '-')">
                {{ tarefa.status }}
              </span>
            </td>
            <td>{{ tarefa.dataCriacao | date:'dd/MM/yyyy HH:mm' }}</td>
            <td>
              <button class="btn-edit" (click)="editTarefa(tarefa)">Editar</button>
              <button class="btn-delete" (click)="deleteTarefa(tarefa.id!)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="tarefas.length === 0">Nenhuma tarefa encontrada.</p>
    </div>
  `,
  styles: [`
    .tarefas-container {
      margin-top: 20px;
    }
    .btn-add {
      background-color: #4CAF50;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 20px;
    }
    .btn-add:hover:not(:disabled) {
      background-color: #45a049;
    }
    .btn-add:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    .loading {
      text-align: center;
      padding: 20px;
      font-style: italic;
      color: #666;
    }
    .tarefas-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .tarefas-table th, .tarefas-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .tarefas-table th {
      background-color: #f2f2f2;
    }
    .btn-edit {
      background-color: #2196F3;
      color: white;
      border: none;
      padding: 5px 10px;
      margin-right: 5px;
      cursor: pointer;
      border-radius: 3px;
    }
    .btn-delete {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 3px;
    }
    .btn-edit:hover {
      background-color: #0b7dda;
    }
    .btn-delete:hover {
      background-color: #da190b;
    }
    .concluida {
      background-color: #f0f8f0;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.9em;
      font-weight: bold;
      text-transform: uppercase;
    }
    .status-badge.pendente {
      background-color: #fff3cd;
      color: #856404;
    }
    .status-badge.concluída {
      background-color: #d4edda;
      color: #155724;
    }
  `]
})
export class ListaTarefasComponent implements OnInit {
  tarefas: Tarefa[] = [];
  showForm = false;
  selectedTarefa: Tarefa | null = null;
  loading = false;

  constructor(private tarefaService: TarefaService) {}

  ngOnInit(): void {
    this.loadTarefas();
  }

  loadTarefas(): void {
    this.loading = true;
    this.tarefaService.getAll().subscribe({
      next: (data) => {
        this.tarefas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.loading = false;
        alert('Erro ao carregar tarefas. Verifique se a API está rodando.');
      }
    });
  }

  editTarefa(tarefa: Tarefa): void {
    this.selectedTarefa = { ...tarefa };
    this.showForm = true;
  }

  deleteTarefa(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.loading = true;
      this.tarefaService.delete(id).subscribe({
        next: () => {
          this.loadTarefas();
          alert('Tarefa excluída com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao excluir tarefa:', error);
          this.loading = false;
          alert('Erro ao excluir tarefa.');
        }
      });
    }
  }

  onSave(tarefa: Tarefa): void {
    this.loading = true;
    if (tarefa.id) {
      this.tarefaService.update(tarefa.id, tarefa).subscribe({
        next: () => {
          this.loadTarefas();
          this.onCancel();
          alert('Tarefa atualizada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao atualizar tarefa:', error);
          this.loading = false;
          alert('Erro ao atualizar tarefa.');
        }
      });
    } else {
      this.tarefaService.create(tarefa).subscribe({
        next: () => {
          this.loadTarefas();
          this.onCancel();
          alert('Tarefa criada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao criar tarefa:', error);
          this.loading = false;
          alert('Erro ao criar tarefa.');
        }
      });
    }
  }

  onCancel(): void {
    this.showForm = false;
    this.selectedTarefa = null;
  }
}