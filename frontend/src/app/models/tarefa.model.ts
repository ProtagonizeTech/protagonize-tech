export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  status: 'Pendente' | 'Concluida';
  dataCriacao: string;
}

export interface TarefaPayload {
  id: number;
  titulo: string;
  descricao: string;
  status: 'Pendente' | 'Concluida';
}
