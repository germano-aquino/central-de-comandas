# Endpoints para Pergunta

## Tabela Questions

- id: Id da Pergunta
- statement: Pergunta
- type: Tipo de Resposta ["multiple-options", "discursive", "both"]
- options: [varchar()]
- option_marked: varchar()
- answer: varchar()
- section_id: Id da seção que a pergunta pertence
- created_at: Data de criação
- updated_at: Data da última atualização

## Criação de Perguntas

### POST /api/v1/questions

- Usuário logado
- Feature `create:question`
- Corpo da requisição:
  - statement: Pergunta por extenso
  - type: ["multiple-options", "discursive", "both"]
  - options: [Sim, Não]
  - option_marked: Sim
  - answer: Resposta descritiva
  - section_id: uuid da section pai da pergunta
- Retorno:
  - id: Id da Pergunta
  - statement: Pergunta por extenso
  - type: ["multiple-options", "discursive", "both"]
  - options: [Sim, Não]
  - option_marked: Sim
  - answer: Resposta descritiva
  - section_id: uuid da section pai da pergunta
  - created_at: Data de Criação
  - updated_at: Date de Atualização

## Listagem de Perguntas

### GET /api/v1/questions

Lista todas as Perguntas cadastradas.

- Usuário logado
- Feature: `read:question`
- Retorno:
  - Lista de Perguntas [
    - id: Id da Pergunta
    - statement: Pergunta por extenso
    - type: ["multiple-options", "discursive", "both"]
    - options: [Sim, Não]
    - option_marked: Sim
    - answer: Resposta descritiva
    - section_id: uuid da section pai da pergunta
    - created_at: Data de Criação
    - updated_at: Date de Atualização
      ]

### GET /api/v1/questions?section_name=

Lista todas as Perguntas cadastradas.

- Usuário logado
- Feature: `read:question`
- Retorno:
  - Lista de Perguntas Pertencentes a uma seção determinada: [
    - id: Id da Pergunta
    - statement: Pergunta por extenso
    - type: ["multiple-options", "discursive", "both"]
    - options: [Sim, Não]
    - option_marked: Sim
    - answer: Resposta descritiva
    - section_id: uuid da section pai da pergunta
    - created_at: Data de Criação
    - updated_at: Date de Atualização
      ]

## Edição de Perguntas

### PATCH /api/v1/questions

Edição da Pergunta pelo `id` da pergunta no corpo da requisição.

- Usuário logado
- Feature: `edit:question`
- Corpo da requisição:
  - id: Id da Pergunta
  - statement: Pergunta por extenso
  - type: ["multiple-options", "discursive", "both"]
  - options: [Sim, Não]
  - option_marked: Sim
  - answer: Resposta descritiva
  - section_id: uuid da section pai da pergunta
- Retorno:
  - id: Id da Pergunta
  - statement: Pergunta por extenso
  - type: ["multiple-options", "discursive", "both"]
  - options: [Sim, Não]
  - option_marked: Sim
  - answer: Resposta descritiva
  - section_id: uuid da section pai da pergunta
  - created_at: Data de Criação
  - updated_at: Date de Atualização

## Deleção de Perguntas

### DELETE /api/v1/questions/

Deleção da Pergunta pelo `id` da pergunta no corpo da requisição.

- Usuário logado
- Feature: `delete:question`
- Retorno:
  - id: Id da Pergunta
  - statement: Pergunta por extenso
  - type: ["multiple-options", "discursive", "both"]
  - options: [Sim, Não]
  - option_marked: Sim
  - answer: Resposta descritiva
  - section_id: uuid da section pai da pergunta
  - created_at: Data de Criação
  - updated_at: Date de Atualização

### DELETE /api/v1/questions/

Deleção de múltiplas Perguntas definidas pelo `section_ids`

- Usuário logado
- Feature: `delete:question`
- Corpo da Requisição:
  - section_ids: Lista de Id's de Perguntas [question_id, ...]
- Retorno:
  - Lista de Perguntas Deletadas [
    - id: Id da Pergunta
    - statement: Pergunta por extenso
    - type: ["multiple-options", "discursive", "both"]
    - options: [Sim, Não]
    - option_marked: Sim
    - answer: Resposta descritiva
    - section_id: uuid da section pai da pergunta
    - created_at: Data de Criação
    - updated_at: Date de Atualização
      ]
