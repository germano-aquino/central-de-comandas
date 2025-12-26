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

Cração de um serviço.

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

Lista todos os serviços cadastrados.

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

Listagem do serviço cujo campo `name` seja igual ao `service_name`.

- Usuário logado
- Feature: `read:service`
- Retorno:
  - id: Id do serviço
  - name: Nome do serviço
  - category_id: Id da categoria || null
  - price: Valor do serviço em centavos
  - created_at: Data de Criação
  - updated_at: Date de Atualização

### GET /api/v1/services/[category_name]

Listagem de todos os serviços cujo o `category_id` corresponda à categoria com `name` igual ao `category_name`

- Usuário logado
- Feature: `read:service`
- Retorno:
  - Lista de serviços por categoria: [
    - id: Id do serviço
    - name: Nome do serviço
    - category_id: Id da categoria || null
    - price: Valor do serviço em centavos
    - created_at: Data de Criação
    - updated_at: Date de Atualização
      ]

## Edição de Serviços

### PATCH /api/v1/services/[service_name]

Edição do serviço cujo o campo `name` seja igual ao `service_name`.

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

  ### PATCH /api/v1/services/

Edição dos múltiplos serviços listados no `service_ids`.

- Usuário logado
- Feature: `edit:service`
- Corpo da requisição:
  - service_ids: Array de Id's de serviços [service_id, ...]
  - name: Depilação virilha (opcional)
  - categoryId: Id da categoria (opcional)
  - price: Valor do serviço em centavos (opcional)
- Retorno:
  - Lista de serviços editados: [
    - id: Id do serviço
    - name: Nome do serviço
    - category_id: Id da categoria || null
    - price: Valor do serviço em centavos
    - created_at: Data de Criação
    - updated_at: Date de Atualização
      ]

## Deleção de Serviços

### DELETE /api/v1/services/[service_name]

Deleção do serviço cujo o campo `name` seja igual ao `service_name`.

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

Deleção dos múltiplos serviços listados no `service_ids`.

- Usuário logado
- Feature: `delete:service`
- Corpo da Requisição:
  - service_ids: Array de Id's de serviços [service_id, ...]
- Retorno:
  - Lista de serviços deletados: [
    - id: Id do serviço
    - name: Nome do serviço
    - category_id: Id da categoria || null
    - price: Valor do serviço em centavos
    - created_at: Data de Criação
    - updated_at: Date de Atualização
      ]
