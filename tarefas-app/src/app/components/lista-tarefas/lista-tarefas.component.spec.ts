import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ListaTarefasComponent } from './lista-tarefas.component';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa.model';
import { FormularioTarefaComponent } from '../formulario-tarefa/formulario-tarefa.component';

describe('ListaTarefasComponent', () => {
  let component: ListaTarefasComponent;
  let fixture: ComponentFixture<ListaTarefasComponent>;
  let tarefaServiceSpy: jasmine.SpyObj<TarefaService>;

  const mockTarefas: Tarefa[] = [
    { id: 1, titulo: 'Tarefa 1', descricao: 'Descrição 1', status: 'Pendente', dataCriacao: '2024-01-01' },
    { id: 2, titulo: 'Tarefa 2', descricao: 'Descrição 2', status: 'Concluída', dataCriacao: '2024-01-02' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TarefaService', ['getAll', 'delete', 'create', 'update']);

    await TestBed.configureTestingModule({
      imports: [ListaTarefasComponent, FormularioTarefaComponent],
      providers: [
        { provide: TarefaService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaTarefasComponent);
    component = fixture.componentInstance;
    tarefaServiceSpy = TestBed.inject(TarefaService) as jasmine.SpyObj<TarefaService>;
  });

  it('should create', () => {
    tarefaServiceSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load tarefas on init', () => {
      tarefaServiceSpy.getAll.and.returnValue(of(mockTarefas));

      fixture.detectChanges();

      expect(tarefaServiceSpy.getAll).toHaveBeenCalled();
      expect(component.tarefas).toEqual(mockTarefas);
    });

    it('should handle error when loading tarefas', () => {
      spyOn(console, 'error');
      tarefaServiceSpy.getAll.and.returnValue(throwError(() => new Error('API Error')));

      fixture.detectChanges();

      expect(console.error).toHaveBeenCalledWith('Erro ao carregar tarefas:', jasmine.any(Error));
    });
  });

  describe('editTarefa', () => {
    beforeEach(() => {
      tarefaServiceSpy.getAll.and.returnValue(of(mockTarefas));
      fixture.detectChanges();
    });

    it('should set selectedTarefa and show form', () => {
      const tarefa = mockTarefas[0];

      component.editTarefa(tarefa);

      expect(component.selectedTarefa).toEqual(tarefa);
      expect(component.showForm).toBeTrue();
    });
  });

  describe('deleteTarefa', () => {
    beforeEach(() => {
      tarefaServiceSpy.getAll.and.returnValue(of(mockTarefas));
      fixture.detectChanges();
    });

    it('should delete tarefa when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      tarefaServiceSpy.delete.and.returnValue(of(void 0));
      tarefaServiceSpy.getAll.and.returnValue(of([mockTarefas[1]])); // Return remaining tarefa

      component.deleteTarefa(1);

      expect(tarefaServiceSpy.delete).toHaveBeenCalledWith(1);
      expect(tarefaServiceSpy.getAll).toHaveBeenCalledTimes(2); // Initial load + after delete
    });

    it('should not delete tarefa when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteTarefa(1);

      expect(tarefaServiceSpy.delete).not.toHaveBeenCalled();
    });

    it('should handle delete error', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(console, 'error');
      tarefaServiceSpy.delete.and.returnValue(throwError(() => new Error('Delete Error')));

      component.deleteTarefa(1);

      expect(console.error).toHaveBeenCalledWith('Erro ao excluir tarefa:', jasmine.any(Error));
    });
  });

  describe('onSave', () => {
    beforeEach(() => {
      tarefaServiceSpy.getAll.and.returnValue(of(mockTarefas));
      fixture.detectChanges();
    });

    it('should update existing tarefa', () => {
      const updatedTarefa: Tarefa = { ...mockTarefas[0], titulo: 'Tarefa Atualizada' };
      spyOn(component, 'onCancel');
      tarefaServiceSpy.getAll.and.returnValue(of([updatedTarefa, mockTarefas[1]]));

      component.onSave(updatedTarefa);

      expect(tarefaServiceSpy.getAll).toHaveBeenCalledTimes(2);
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should create new tarefa', () => {
      const newTarefa: Tarefa = { titulo: 'Nova Tarefa', descricao: 'Descrição', status: 'Pendente' };
      spyOn(component, 'onCancel');
      tarefaServiceSpy.getAll.and.returnValue(of([...mockTarefas, { ...newTarefa, id: 3 }]));

      component.onSave(newTarefa);

      expect(tarefaServiceSpy.getAll).toHaveBeenCalledTimes(2);
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should handle update error', () => {
      const updatedTarefa: Tarefa = { ...mockTarefas[0], titulo: 'Tarefa Atualizada' };
      spyOn(console, 'error');
      tarefaServiceSpy.getAll.and.returnValue(throwError(() => new Error('Update Error')));

      component.onSave(updatedTarefa);

      expect(console.error).toHaveBeenCalledWith('Erro ao atualizar tarefa:', jasmine.any(Error));
    });

    it('should handle create error', () => {
      const newTarefa: Tarefa = { titulo: 'Nova Tarefa', descricao: 'Descrição', status: 'Pendente' };
      spyOn(console, 'error');
      tarefaServiceSpy.getAll.and.returnValue(throwError(() => new Error('Create Error')));

      component.onSave(newTarefa);

      expect(console.error).toHaveBeenCalledWith('Erro ao criar tarefa:', jasmine.any(Error));
    });
  });

  describe('onCancel', () => {
    it('should reset form state', () => {
      component.showForm = true;
      component.selectedTarefa = mockTarefas[0];

      component.onCancel();

      expect(component.showForm).toBeFalse();
      expect(component.selectedTarefa).toBeNull();
    });
  });

  describe('Template', () => {
    beforeEach(() => {
      tarefaServiceSpy.getAll.and.returnValue(of(mockTarefas));
      fixture.detectChanges();
    });

    it('should display tarefas in table', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const tableRows = compiled.querySelectorAll('tbody tr');

      expect(tableRows.length).toBe(2);
      expect(tableRows[0].textContent).toContain('Tarefa 1');
      expect(tableRows[1].textContent).toContain('Tarefa 2');
    });

    it('should show "no tasks" message when empty', () => {
      tarefaServiceSpy.getAll.and.returnValue(of([]));
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Nenhuma tarefa encontrada');
    });

    it('should show form when showForm is true', () => {
      component.showForm = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const formElement = compiled.querySelector('app-formulario-tarefa');
      expect(formElement).toBeTruthy();
    });
  });
});