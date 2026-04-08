import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Tarefa, TarefaPayload } from './models/tarefa.model';
import { TarefaService } from './services/tarefa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly tarefaService = inject(TarefaService);

  tarefas: Tarefa[] = [];
  filtroStatus = 'Todos';
  carregando = false;
  salvando = false;
  editandoId: number | null = null;
  mensagem = '';
  erro = '';

  readonly formulario = this.formBuilder.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(120)]],
    descricao: ['', [Validators.maxLength(500)]],
    status: ['Pendente' as 'Pendente' | 'Concluida', Validators.required]
  });

  constructor() {
    this.carregarTarefas();
  }

  get tarefasFiltradas(): Tarefa[] {
    if (this.filtroStatus === 'Todos') {
      return this.tarefas;
    }

    return this.tarefas.filter((tarefa) => tarefa.status === this.filtroStatus);
  }

  carregarTarefas(): void {
    this.carregando = true;
    this.erro = '';

    this.tarefaService
      .listar()
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (tarefas) => {
          this.tarefas = tarefas;
        },
        error: () => {
          this.erro = 'Não foi possível carregar as tarefas.';
        }
      });
  }

  salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.mensagem = '';
    this.erro = '';

    const payload: TarefaPayload = {
      id: this.editandoId ?? 0,
      ...this.formulario.getRawValue()
    };

    const requisicao = this.editandoId
      ? this.tarefaService.atualizar(payload)
      : this.tarefaService.criar(payload);

    requisicao
      .pipe(finalize(() => (this.salvando = false)))
      .subscribe({
        next: () => {
          this.mensagem = this.editandoId
            ? 'Tarefa atualizada com sucesso.'
            : 'Tarefa criada com sucesso.';
          this.cancelarEdicao();
          this.carregarTarefas();
        },
        error: () => {
          this.erro = 'Não foi possível salvar a tarefa.';
        }
      });
  }

  editar(tarefa: Tarefa): void {
    this.editandoId = tarefa.id;
    this.mensagem = '';
    this.erro = '';
    this.formulario.setValue({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      status: tarefa.status
    });
  }

  excluir(tarefa: Tarefa): void {
    const confirmou = window.confirm(`Deseja excluir a tarefa "${tarefa.titulo}"?`);
    if (!confirmou) {
      return;
    }

    this.mensagem = '';
    this.erro = '';

    this.tarefaService.excluir(tarefa.id).subscribe({
      next: () => {
        this.mensagem = 'Tarefa excluída com sucesso.';
        if (this.editandoId === tarefa.id) {
          this.cancelarEdicao();
        }
        this.carregarTarefas();
      },
      error: () => {
        this.erro = 'Não foi possível excluir a tarefa.';
      }
    });
  }

  cancelarEdicao(): void {
    this.editandoId = null;
    this.formulario.reset({
      titulo: '',
      descricao: '',
      status: 'Pendente'
    });
  }
}
