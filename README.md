# Desafio Tecnico - Gerenciador de Tarefas

Aplicacao full stack para cadastro e gerenciamento de tarefas com:

- Angular no front-end
- ASP.NET Core Web API no back-end
- SQL Server como banco de dados
- Entity Framework Core para persistencia

## Estrutura do projeto

```text
PROTAGONIZE/
|-- backend/TaskManager.Api
|-- frontend
|-- PROTAGONIZE.sln
```

## Funcionalidades

- Listar tarefas
- Buscar tarefa por ID
- Criar tarefa
- Editar tarefa
- Excluir tarefa
- Filtrar tarefas por status
- Validacao basica no formulario
- Mensagens simples de sucesso e erro

## Pre-requisitos

- .NET SDK 8.0 ou superior
- SQL Server
- Node.js 20+ ou 22+

## Back-end com dotnet CLI

1. Ajuste a connection string em `backend/TaskManager.Api/appsettings.json` se necessario.
2. Na raiz do repositorio, restaure a solucao:

```powershell
dotnet restore PROTAGONIZE.sln
```

3. Restaure a ferramenta local do Entity Framework:

```powershell
dotnet tool restore
```

4. Gere o banco aplicando as migrations:

```powershell
dotnet ef database update --project backend/TaskManager.Api --startup-project backend/TaskManager.Api
```

5. Compile a solucao:

```powershell
dotnet build PROTAGONIZE.sln
```

6. Execute a API:

```powershell
dotnet run --project backend/TaskManager.Api
```

Em ambiente de desenvolvimento, a API sobe com Swagger em `https://localhost:5001/swagger` e tambem tenta aplicar as migrations automaticamente na inicializacao.

## Front-end

1. Entre na pasta do front-end:

```powershell
cd frontend
```

2. Instale as dependencias:

```powershell
npm install
```

3. Rode a aplicacao Angular:

```powershell
npm start
```

4. Acesse:

```text
http://localhost:4200
```

## Observacoes importantes

- O servico Angular aponta para `https://localhost:5001/api/tarefas`.
- Se a porta da API mudar, ajuste essa URL em `frontend/src/app/services/tarefa.service.ts`.
- O status aceito pela API e `Pendente` ou `Concluida`.
- O campo `DataCriacao` e definido automaticamente no back-end.

## Endpoints da API

- `GET /api/tarefas`
- `GET /api/tarefas/{id}`
- `POST /api/tarefas`
- `PUT /api/tarefas/{id}`
- `DELETE /api/tarefas/{id}`

## Exemplo de payload

```json
{
  "id": 0,
  "titulo": "Estudar ASP.NET Core",
  "descricao": "Implementar o CRUD de tarefas",
  "status": "Pendente"
}
```
