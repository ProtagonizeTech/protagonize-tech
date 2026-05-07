import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private apiUrl = 'http://localhost:5243/api/tarefas'; // ajuste a porta

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  getById(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.apiUrl}/${id}`);
  }

  create(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.apiUrl, tarefa);
  }

  update(id: number, tarefa: Tarefa): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, tarefa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}