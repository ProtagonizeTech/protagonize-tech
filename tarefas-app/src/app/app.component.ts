import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListaTarefasComponent } from './components/lista-tarefas/lista-tarefas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ListaTarefasComponent],
  template: `
    <div class="container">
      <header class="app-header">
        <h1>🚀 Gerenciador de Tarefas</h1>
        <p class="subtitle">Desafio Técnico Avanade - Bootcamp</p>
      </header>
      <app-lista-tarefas></app-lista-tarefas>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .app-header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .app-header h1 {
      margin: 0;
      font-size: 2.5em;
      font-weight: 300;
    }
    .subtitle {
      margin: 10px 0 0 0;
      font-size: 1.1em;
      opacity: 0.9;
      font-weight: 300;
    }
  `]
})
export class AppComponent {
  title = 'tarefas-app';
}