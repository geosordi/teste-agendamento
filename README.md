# API de Agendamento Médico

API serverless para **buscar agendas de médicos** e **registrar agendamentos de pacientes**, construída com **Node.js + TypeScript + Serverless Framework + AWS Lambda + API Gateway**.

Os dados são **mockados em memória** (sem banco de dados real), conforme o escopo do teste.

---

## Requisitos

- **Node.js 20 ou superior** (a versão está fixada em [`.nvmrc`](./.nvmrc))
- **Yarn** (gerenciador de pacotes usado no projeto)

Se você usa [nvm](https://github.com/nvm-sh/nvm), basta rodar na raiz do projeto:

```bash
nvm use
```

---

## Como rodar localmente

```bash
# 1. Instalar as dependências
yarn install

# 2. Subir a API localmente (serverless-offline simula o API Gateway + Lambda)
yarn start
```

A API sobe em **http://localhost:3000** e os endpoints ficam sob o prefixo do stage (`/dev`):

- `GET  http://localhost:3000/dev/agendas`
- `POST http://localhost:3000/dev/agendamento`

---

## Endpoints

### 1) `GET /agendas` — Buscar agendas e horários dos médicos

**Requisição:**

```bash
curl http://localhost:3000/dev/agendas
```

**Resposta `200 OK`:**

```json
{
  "medicos": [
    {
      "id": 1,
      "nome": "Dr. Joao Silva",
      "especialidade": "Cardiologista",
      "horarios_disponiveis": ["2026-06-10 09:00", "2026-06-10 10:00", "2026-06-10 11:00"]
    },
    {
      "id": 2,
      "nome": "Dra. Maria Souza",
      "especialidade": "Dermatologista",
      "horarios_disponiveis": ["2026-06-11 14:00", "2026-06-11 15:00"]
    }
  ]
}
```

### 2) `POST /agendamento` — Registrar o agendamento de um paciente

**Requisição:**

```bash
curl -X POST http://localhost:3000/dev/agendamento \
  -H "Content-Type: application/json" \
  -d '{
    "agendamento": {
      "medico_id": 1,
      "paciente": "Carlos Almeida",
      "data_horario": "2026-06-10 09:00"
    }
  }'
```

**Resposta `201 Created`:**

```json
{
  "mensagem": "Agendamento realizado com sucesso",
  "agendamento": {
    "id": "uuid-gerado",
    "medico": "Dr. Joao Silva",
    "paciente": "Carlos Almeida",
    "data_horario": "2026-06-10 09:00"
  }
}
```

**Possíveis erros:**

| Situação                                   | Status | Corpo                                                             |
| ------------------------------------------ | ------ | ----------------------------------------------------------------- |
| Payload inválido (campos faltando/errados) | `400`  | `{ "erro": "Payload invalido", "mensagem": "..." }`               |
| Médico não encontrado (`medico_id`)        | `404`  | `{ "erro": "Medico nao encontrado", "mensagem": "..." }`          |
| Horário já ocupado / indisponível          | `409`  | `{ "erro": "Horario indisponivel", "mensagem": "O horario ..." }` |

> O controle de conflito é feito **em memória**: ao registrar um agendamento, o horário é removido da lista de disponíveis do médico. Uma segunda tentativa no mesmo horário retorna `409`.

---

## Testes, Lint e Tipagem

```bash
# Testes unitários + integração (Jest) + cobertura de todo o código (mínimo exigido: 90%)
yarn test

# Checagem de tipos (TypeScript, sem gerar arquivos)
yarn typecheck

# Análise estática (ESLint)
yarn lint

# Formatação (Prettier)
yarn format
```

---

## Depuração no VS Code

O projeto já vem com [`.vscode/launch.json`](./.vscode/launch.json). Abra a aba **Run and Debug** (`Ctrl+Shift+D`) e escolha:

- **Debug: API (Serverless Offline)** — sobe a API com breakpoints no código TypeScript (sourcemaps habilitados).

---

## Deploy na AWS

Pré-requisitos: [credenciais da AWS configuradas](https://www.serverless.com/framework/docs/providers/aws/guide/credentials) (`aws configure` ou variáveis de ambiente).

```bash
# Deploy para o stage padrão (dev)
yarn deploy

# Deploy para outro stage (ex: produção)
yarn deploy --stage prod
```

Ao final, o Serverless Framework exibe as URLs públicas dos endpoints no API Gateway.

---

## Estrutura de pastas

```
src/
├── domain/                 # Núcleo do negócio (não conhece Lambda/HTTP)
│   ├── entities/           # Tipos: Medico, Agendamento
│   └── errors/             # Erros de negócio TIPADOS (400/404/409)
├── repositories/           # Abstração (interface) + implementação mock em memória
├── services/               # Casos de uso (regras de negócio)
├── decorators/             # Decorators: validação, logging e erros HTTP
├── controllers/            # Orquestram service + aplicam os decorators
├── handlers/               # Funções Lambda "finas" (entrada da AWS)
├── shared/                 # Helpers de HTTP e validador (Joi)
└── container.ts            # Composition root (injeção de dependências)

tests/
├── helpers/                # Utilitários compartilhados pelos testes (ex: make-event)
├── integration/            # 6 testes de integração (fluxos completos)
└── unit/                   # 29 testes unitários (cada camada isolada)
    ├── controllers/
    ├── decorators/
    ├── handlers/
    ├── repositories/
    ├── services/
    └── shared/
```

## Tecnologias

- **Node.js 20** / **TypeScript** (tipagem estrita, sem `any`)
- **Serverless Framework 3** + **serverless-offline** + **serverless-esbuild**
- **Joi** para validação de payload
- **Jest** para testes unitários
- **ESLint** + **Prettier**
