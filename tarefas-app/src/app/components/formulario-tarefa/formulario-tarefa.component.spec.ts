import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FormularioTarefaComponent } from './formulario-tarefa.component';
import { Tarefa } from '../../models/tarefa.model';

describe('FormularioTarefaComponent', () => {
  let component: FormularioTarefaComponent;
  let fixture: ComponentFixture<FormularioTarefaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioTarefaComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioTarefaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should set formData when tarefa is provided', () => {
      const tarefa: Tarefa = {
        id: 1,
        titulo: 'Tarefa Existente',
        descricao: 'Descrição existente',
        status: 'Em Andamento',
        dataCriacao: '2024-01-01'
      };

      component.tarefa = tarefa;
      component.ngOnChanges({
        tarefa: {
          currentValue: tarefa,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      expect(component.formData).toEqual(tarefa);
    });

    it('should reset form when tarefa is null', () => {
      component.formData = {
        id: 1,
        titulo: 'Modified',
        descricao: 'Modified',
        status: 'Concluída'
      };

      component.tarefa = null;
      component.ngOnChanges({
        tarefa: {
          currentValue: null,
          previousValue: { id: 1, titulo: 'Old', descricao: 'Old', status: 'Pendente' },
          firstChange: false,
          isFirstChange: () => false
        }
      });

      expect(component.formData).toEqual({
        titulo: '',
        descricao: '',
        status: 'Pendente'
      });
    });
  });

  describe('onSubmit', () => {
    it('should emit save event with valid form data', () => {
      spyOn(component.save, 'emit');

      component.formData = {
        titulo: 'Nova Tarefa',
        descricao: 'Descrição válida',
        status: 'Pendente'
      };

      component.onSubmit();

      expect(component.save.emit).toHaveBeenCalledWith({
        titulo: 'Nova Tarefa',
        descricao: 'Descrição válida',
        status: 'Pendente'
      });
    });

    it('should not emit save event with invalid form data', () => {
      spyOn(component.save, 'emit');

      component.formData = {
        titulo: '',
        descricao: 'Descrição válida',
        status: 'Pendente'
      };

      component.onSubmit();

      expect(component.save.emit).not.toHaveBeenCalled();
    });

    it('should not emit save event with empty descricao', () => {
      spyOn(component.save, 'emit');

      component.formData = {
        titulo: 'Título válido',
        descricao: '',
        status: 'Pendente'
      };

      component.onSubmit();

      expect(component.save.emit).not.toHaveBeenCalled();
    });

    it('should not emit save event with empty status', () => {
      spyOn(component.save, 'emit');

      component.formData = {
        titulo: 'Título válido',
        descricao: 'Descrição válida',
        status: ''
      };

      component.onSubmit();

      expect(component.save.emit).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should emit cancel event', () => {
      spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('resetForm', () => {
    it('should reset formData to default values', () => {
      component.formData = {
        id: 1,
        titulo: 'Modified',
        descricao: 'Modified',
        status: 'Concluída'
      };

      (component as any).resetForm();

      expect(component.formData).toEqual({
        titulo: '',
        descricao: '',
        status: 'Pendente'
      });
    });
  });

  describe('Template', () => {
    it('should display "Nova Tarefa" when no tarefa is provided', () => {
      component.tarefa = null;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Nova Tarefa');
    });

    it('should display "Editar Tarefa" when tarefa is provided', () => {
      component.tarefa = { id: 1, titulo: 'Test', descricao: 'Test', status: 'Pendente' };
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Editar Tarefa');
    });

    it('should bind form data to inputs', async () => {
      component.formData = {
        titulo: 'Test Title',
        descricao: 'Test Description',
        status: 'Em Andamento'
      };
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const tituloInput = compiled.querySelector('input[name="titulo"]') as HTMLInputElement;
      const descricaoTextarea = compiled.querySelector('textarea[name="descricao"]') as HTMLTextAreaElement;
      const statusSelect = compiled.querySelector('select[name="status"]') as HTMLSelectElement;

      expect(tituloInput.value).toBe('Test Title');
      expect(descricaoTextarea.value).toBe('Test Description');
      expect(statusSelect.value).toBe('Em Andamento');
    });

    it('should show validation errors for invalid form', () => {
      component.formData = { titulo: '', descricao: '', status: '' };
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

      // The button should be disabled when form is invalid
      expect(submitButton.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', async () => {
      component.formData = {
        titulo: 'Valid Title',
        descricao: 'Valid Description',
        status: 'Pendente'
      };
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

      expect(submitButton.disabled).toBeFalsy();
    });
  });
});