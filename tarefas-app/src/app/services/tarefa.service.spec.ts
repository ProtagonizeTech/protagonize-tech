import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TarefaService } from './tarefa.service';
import { Tarefa } from '../models/tarefa.model';

describe('TarefaService', () => {
  let service: TarefaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TarefaService]
    });
    service = TestBed.inject(TarefaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an Observable<Tarefa[]>', () => {
      const mockTarefas: Tarefa[] = [
        { id: 1, titulo: 'Tarefa 1', descricao: 'Descrição 1', status: 'Pendente', dataCriacao: '2024-01-01' },
        { id: 2, titulo: 'Tarefa 2', descricao: 'Descrição 2', status: 'Concluída', dataCriacao: '2024-01-02' }
      ];

      service.getAll().subscribe(tarefas => {
        expect(tarefas).toEqual(mockTarefas);
      });

      const req = httpMock.expectOne('https://localhost:7073/api/tarefas');
      expect(req.request.method).toBe('GET');
      req.flush(mockTarefas);
    });

    it('should handle error', () => {
      service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => expect(error).toBeTruthy()
      });

      const req = httpMock.expectOne('https://localhost:7073/api/tarefas');
      req.error(new ErrorEvent('network error'));
    });
  });

  describe('getById', () => {
    it('should return an Observable<Tarefa>', () => {
      const mockTarefa: Tarefa = { id: 1, titulo: 'Tarefa 1', descricao: 'Descrição 1', status: 'Pendente' };

      service.getById(1).subscribe(tarefa => {
        expect(tarefa).toEqual(mockTarefa);
      });

      const req = httpMock.expectOne('https://localhost:7073/api/tarefas/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockTarefa);
    });
  });

  describe('create', () => {
    it('should return an Observable<Tarefa>', () => {
      const newTarefa: Tarefa = { titulo: 'Nova Tarefa', descricao: 'Descrição', status: 'Pendente' };
      const createdTarefa: Tarefa = { ...newTarefa, id: 3 };

      service.create(newTarefa).subscribe(tarefa => {
        expect(tarefa).toEqual(createdTarefa);
      });

      const req = httpMock.expectOne('https://localhost:7073/api/tarefas');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTarefa);
      req.flush(createdTarefa);
    });
  });

  describe('update', () => {
    it('should return an Observable<void>', () => {
      const updatedTarefa: Tarefa = { id: 1, titulo: 'Tarefa Atualizada', descricao: 'Descrição atualizada', status: 'Concluída' };

      service.update(1, updatedTarefa).subscribe(() => {
        expect(true).toBeTruthy(); // Just check that it completes
      });

      const req = httpMock.expectOne('https://localhost:7073/api/tarefas/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedTarefa);
      req.flush(null);
    });
  });

  describe('delete', () => {
    it('should return an Observable<void>', () => {
      service.delete(1).subscribe(() => {
        expect(true).toBeTruthy();
      });

      const req = httpMock.expectOne('https://localhost:7073/api/tarefas/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});