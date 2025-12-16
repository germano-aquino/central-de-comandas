# Endpoints para serviços

## Tabela Services

- id: Id do serviço
- name: Nome do serviço
- price: Valor do serviço em centavos
- category_id: Id da categoria a qual o serviço pertence
- created_at: Data de criação
- updated_at: Data da última atualização

## Criação de serviços

### POST /api/v1/services

- Usuário logado
- Feature `create:service`
- Corpo da requisição:
  - name: Depilação virilha
  - categoryId: Id da categoria (opicional)
  - price: Valor do serviço em centavos
- Retorno:
  - id: Id do serviço
  - name: Nome do serviço
  - category_id: Id da categoria || null
  - price: Valor do serviço em centavos
  - created_at: Data de Criação
  - updated_at: Date de Atualização

## Listagem de Serviços

### GET /api/v1/services

- Usuário logado
- Feature: `read:service`
- Retorno:
  - Lista de serviços [
    - id: Id do serviço
    - name: Nome do serviço
    - category_id: Id da categoria
    - price: Valor do serviço em centavos
    - created_at: Data de Criação
    - updated_at: Date de Atualização
      ]

### GET /api/v1/services/[service_name]

- Usuário logado
- Feature: `read:service`
- Retorno:
  - id: Id do serviço
  - name: Nome do serviço
  - category_id: Id da categoria || null
  - price: Valor do serviço em centavos
  - created_at: Data de Criação
  - updated_at: Date de Atualização

## Edição de Serviços

### PATCH /api/v1/services/[service_name]

- Usuário logado
- Feature: `edit:service`
- Corpo da requisição:
  - name: Depilação virilha (opcional)
  - categoryId: Id da categoria (opcional)
  - price: Valor do serviço em centavos (opcional)
- Retorno:
  - id: Id do serviço
  - name: Nome do serviço
  - category_id: Id da categoria || null
  - price: Valor do serviço em centavos
  - created_at: Data de Criação
  - updated_at: Date de Atualização

## Deleção de Serviços

### DELETE /api/v1/services/[service_name]

- Usuário logado
- Feature: `delete:service`
- Retorno:
  - id: Id do serviço
  - name: Nome do serviço
  - category_id: Id da categoria || null
  - price: Valor do serviço em centavos
  - created_at: Data de Criação
  - updated_at: Date de Atualização

### DELETE /api/v1/services/

- Usuário logado
- Feature: `delete:service`
- Corpo da Requisição:
  - Lista de Id's de serviços [service_id, ...]
- Retorno:
  - id: Id do serviço
  - name: Nome do serviço
  - category_id: Id da categoria || null
  - price: Valor do serviço em centavos
  - created_at: Data de Criação
  - updated_at: Date de Atualização
