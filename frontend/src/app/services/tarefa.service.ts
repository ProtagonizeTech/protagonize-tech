import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa, TarefaPayload } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:5001/api/tarefas';

  listar(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  criar(payload: TarefaPayload): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.apiUrl, payload);
  }

  atualizar(payload: TarefaPayload): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${payload.id}`, payload);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
