# 📋 Gerenciador de Tarefas — Desafio Técnico Avanade

Aplicação web full-stack para **cadastro e gerenciamento de tarefas**, desenvolvida como parte do Bootcamp Web Front (Angular + ASP.NET) da Avanade.

---

## 🧱 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Front-end | Angular 17+ |
| Back-end | ASP.NET Core Web API (.NET 8, C#) |
| Banco de dados | SQL Server |
| ORM | Entity Framework Core |
| Comunicação | REST API (JSON) |
| **Testes** | **Jasmine + Karma** |

---

## 📁 Estrutura do Projeto

```
/
├── TarefasAPI/                  # Back-end ASP.NET Core
│   ├── Controllers/
│   │   └── TarefasController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Models/
│   │   └── Tarefa.cs
│   ├── Migrations/
│   ├── appsettings.json
│   └── Program.cs
│
└── tarefas-app/                 # Front-end Angular
    └── src/
        └── app/
            ├── models/
            │   └── tarefa.model.ts
            ├── services/
            │   ├── tarefa.service.ts
            │   └── tarefa.service.spec.ts          # 🧪 Testes do service
            ├── components/
            │   ├── lista-tarefas/
            │   │   ├── lista-tarefas.component.ts
            │   │   ├── lista-tarefas.component.html
            │   │   ├── lista-tarefas.component.css
            │   │   └── lista-tarefas.component.spec.ts # 🧪 Testes do componente
            │   └── formulario-tarefa/
            │       ├── formulario-tarefa.component.ts
            │       ├── formulario-tarefa.component.html
            │       ├── formulario-tarefa.component.css
            │       └── formulario-tarefa.component.spec.ts # 🧪 Testes do componente
            ├── app.component.ts
            ├── app.component.spec.ts                # 🧪 Testes do app component
            ├── app.config.ts
            └── app.routes.ts
```

---

## ⚙️ Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) e npm
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`
- [SQL Server](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads) (Express é suficiente)
- [Entity Framework Core CLI](https://learn.microsoft.com/pt-br/ef/core/cli/dotnet): `dotnet tool install --global dotnet-ef`
- **Google Chrome** (para execução dos testes automatizados)

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

---

### 2. Back-end — ASP.NET Core Web API

#### 2.1. Configure a string de conexão

Abra o arquivo `TarefasAPI/appsettings.json` e ajuste a connection string com os dados do seu SQL Server:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=TarefasDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> **Dica:** Se estiver usando autenticação por usuário e senha (SQL Auth), use:
> `Server=localhost;Database=TarefasDB;User Id=seu_usuario;Password=sua_senha;TrustServerCertificate=True;`

#### 2.2. Execute as Migrations para criar o banco de dados

```bash
cd TarefasAPI
dotnet ef database update
```

Isso cria automaticamente o banco `TarefasDB` e a tabela `Tarefas` no SQL Server.

#### 2.3. Rode a API

```bash
dotnet run
```

A API estará disponível em `https://localhost:7xxx` (a porta exata é exibida no terminal).

> Acesse `https://localhost:7xxx/swagger` para visualizar e testar os endpoints pela interface do Swagger.

---

### 3. Front-end — Angular

#### 3.1. Instale as dependências

```bash
cd tarefas-app
npm install
```

#### 3.2. Configure a URL da API

No arquivo `src/app/services/tarefa.service.ts`, ajuste a URL base para a porta correta da sua API:

```typescript
private apiUrl = 'https://localhost:7xxx/api/tarefas';
```

#### 3.3. Rode o projeto Angular

```bash
ng serve
```

O front-end estará disponível em `http://localhost:4200`.

---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/tarefas` | Lista todas as tarefas |
| `GET` | `/api/tarefas/{id}` | Busca uma tarefa pelo ID |
| `POST` | `/api/tarefas` | Cria uma nova tarefa |
| `PUT` | `/api/tarefas/{id}` | Atualiza uma tarefa existente |
| `DELETE` | `/api/tarefas/{id}` | Remove uma tarefa |

### Exemplo de payload (POST / PUT)

```json
{
  "titulo": "Estudar Angular",
  "descricao": "Revisar diretivas e componentes",
  "status": "Pendente"
}
```

### Exemplo de resposta (GET)

```json
[
  {
    "id": 1,
    "titulo": "Estudar Angular",
    "descricao": "Revisar diretivas e componentes",
    "status": "Pendente",
    "dataCriacao": "2025-04-09T14:30:00"
  }
]
```

> Os valores aceitos para o campo `status` são: `"Pendente"` e `"Concluída"`.

---

## 🗄️ Modelo de dados

### Tabela: `Tarefas`

| Campo | Tipo | Descrição |
|---|---|---|
| `Id` | `int` | Chave primária, auto-incremento |
| `Titulo` | `nvarchar` | Título da tarefa |
| `Descricao` | `nvarchar` | Descrição detalhada |
| `Status` | `nvarchar` | `"Pendente"` ou `"Concluída"` |
| `DataCriacao` | `datetime2` | Preenchida automaticamente pelo back-end |

---

## ✅ Funcionalidades

- [x] Listar todas as tarefas
- [x] Criar nova tarefa
- [x] Editar tarefa existente
- [x] Excluir tarefa
- [x] Persistência no SQL Server via Entity Framework Core
- [x] Integração Angular ↔ API via HttpClient
- [x] CORS configurado para comunicação local
- [x] **Testes automatizados unitários (Jasmine/Karma)**

---

## 🧪 Testes Automatizados

O projeto inclui uma suíte completa de testes unitários usando **Jasmine** e **Karma** para garantir a qualidade e confiabilidade do código.

### 📁 Estrutura dos Testes

```
tarefas-app/src/app/
├── app.component.spec.ts                    # Testes do componente principal
├── services/
│   └── tarefa.service.spec.ts              # Testes do serviço TarefaService
└── components/
    ├── lista-tarefas/
    │   └── lista-tarefas.component.spec.ts # Testes do componente ListaTarefas
    └── formulario-tarefa/
        └── formulario-tarefa.component.spec.ts # Testes do componente FormularioTarefa
```

### 🚀 Como executar os testes

#### Opção 1: Terminal (recomendado para CI/CD)
```bash
cd tarefas-app

# Executar todos os testes em modo watch (desenvolvimento)
ng test

# Executar testes uma vez (sem watch mode)
ng test --watch=false

# Executar testes em modo headless (CI/CD)
ng test --watch=false --browsers=ChromeHeadless

# Executar testes com relatório de cobertura
ng test --code-coverage
```

#### Opção 2: Scripts do package.json
```bash
cd tarefas-app
npm test
```

#### Opção 3: Interface Visual (VS Code)
- Abra qualquer arquivo `.spec.ts`
- Clique no botão ▶️ "Run Tests" acima dos blocos `describe`
- Visualize os resultados no painel "Test Results"

### 📊 O que é testado

#### TarefaService (`tarefa.service.spec.ts`)
- ✅ Criação do serviço
- ✅ Método `getAll()` - busca todas as tarefas
- ✅ Método `getById()` - busca tarefa por ID
- ✅ Método `create()` - criação de nova tarefa
- ✅ Método `update()` - atualização de tarefa existente
- ✅ Método `delete()` - exclusão de tarefa
- ✅ Tratamento de erros de rede

#### ListaTarefasComponent (`lista-tarefas.component.spec.ts`)
- ✅ Criação e inicialização do componente
- ✅ Carregamento automático de tarefas no `ngOnInit`
- ✅ Edição de tarefa (abertura do formulário)
- ✅ Exclusão de tarefa com confirmação
- ✅ Criação de nova tarefa via formulário
- ✅ Atualização de tarefa existente
- ✅ Tratamento de erros (carregamento, exclusão, criação, atualização)
- ✅ Interações com template (exibição de tabela, botões)

#### FormularioTarefaComponent (`formulario-tarefa.component.spec.ts`)
- ✅ Criação do componente
- ✅ Inicialização para criação (formulário vazio)
- ✅ Inicialização para edição (dados preenchidos)
- ✅ Validação de formulário (campos obrigatórios)
- ✅ Emissão de eventos `save` e `cancel`
- ✅ Reset do formulário
- ✅ Interações com template (binding, validação visual)

#### AppComponent (`app.component.spec.ts`)
- ✅ Criação do componente principal
- ✅ Renderização do título da aplicação
- ✅ Inclusão do componente ListaTarefas
- ✅ Renderização do router outlet

### 🎯 Cobertura de Testes

Para gerar relatório de cobertura:
```bash
cd tarefas-app
ng test --code-coverage
```

O relatório será gerado em `tarefas-app/coverage/` e pode ser aberto no browser:
- `tarefas-app/coverage/index.html`

### 🔧 Configuração dos Testes

Os testes utilizam:
- **Jasmine**: Framework de testes
- **Karma**: Executor de testes no browser
- **HttpClientTestingModule**: Para mockar requisições HTTP
- **TestBed**: Para configuração de módulos de teste
- **Spies**: Para mockar dependências e verificar chamadas

---

## 🧪 Testando a API

### Opção 1 — Swagger (recomendado)

Acesse `https://localhost:7xxx/swagger` no browser com a API rodando.

### Opção 2 — curl

```bash
# Listar tarefas
curl -X GET https://localhost:7xxx/api/tarefas -k

# Criar tarefa
curl -X POST https://localhost:7xxx/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Nova Tarefa","descricao":"Descrição aqui","status":"Pendente"}' -k

# Atualizar tarefa
curl -X PUT https://localhost:7xxx/api/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{"id":1,"titulo":"Tarefa Editada","descricao":"Nova descrição","status":"Concluída"}' -k

# Deletar tarefa
curl -X DELETE https://localhost:7xxx/api/tarefas/1 -k
```

### Opção 3 — Postman

Importe os endpoints manualmente ou use a collection exportada do Swagger (disponível em `/swagger/v1/swagger.json`).

---

## 🛠️ Comandos úteis

```bash
# Back-end (.NET)
# Criar nova migration (após alterar o modelo)
dotnet ef migrations add NomeDaMigration

# Aplicar migrations pendentes
dotnet ef database update

# Reverter para uma migration anterior
dotnet ef database update NomeDaMigrationAnterior

# Front-end (Angular)
# Gerar novo componente Angular
ng generate component components/nome-do-componente

# Gerar novo service Angular
ng generate service services/nome-do-service

# Build de produção Angular
ng build --configuration production

# Testes automatizados
# Executar testes em modo desenvolvimento (watch)
ng test

# Executar testes uma vez
ng test --watch=false

# Executar testes em modo headless (CI/CD)
ng test --watch=false --browsers=ChromeHeadless

# Executar testes com relatório de cobertura
ng test --code-coverage
```

---

## ⚠️ Possíveis problemas

**Erro de CORS ao chamar a API pelo Angular**
> Verifique se a política de CORS no `Program.cs` está configurada com a origem `http://localhost:4200`.

**Erro de certificado HTTPS no desenvolvimento**
> Rode `dotnet dev-certs https --trust` para confiar no certificado de desenvolvimento do .NET.

**Erro ao rodar `dotnet ef database update`**
> Certifique-se de que o SQL Server está rodando e que a connection string em `appsettings.json` está correta.

**`ng` não reconhecido no terminal**
> Instale o Angular CLI globalmente: `npm install -g @angular/cli`

**Testes falhando com erro de HttpClient**
> Certifique-se de que `HttpClientTestingModule` está importado nos testes que usam serviços HTTP.

**Chrome não encontrado nos testes**
> Instale o Chrome ou use `--browsers=ChromeHeadless` para executar testes sem interface gráfica.

---

## 🎯 Qualidade de Código

### ✅ Padrões Implementados

- **Testes Unitários**: Cobertura completa dos serviços e componentes
- **TypeScript Strict Mode**: Configurado para maior segurança de tipos
- **Componentes Standalone**: Arquitetura moderna do Angular
- **Tratamento de Erros**: Implementado em todas as operações HTTP
- **Validação de Formulários**: Campos obrigatórios e feedback visual
- **Separação de Responsabilidades**: Services, Components e Models bem definidos

### 📈 Métricas de Qualidade

- **Build**: ✅ Compilação sem erros
- **Testes**: 41+ casos de teste implementados
- **Linting**: Configurado com ESLint
- **Type Safety**: TypeScript com configurações rigorosas

---

## 👤 Autor

Desenvolvido por **[Wellington Rodrigues de Oliveira]** como parte do processo seletivo Bootcamp Web Front — Avanade.

> Este projeto contou com apoio de uma IA (Calude.AI & Copilot) para assistência na implementação e criação dos testes automatizados.
