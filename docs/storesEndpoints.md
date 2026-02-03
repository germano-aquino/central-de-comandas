# Endpoints para Lojas

## Tabela stores

- id: Id da loja
- name: Nome da loja
- created_at: Data de criação
- updated_at: Data da última atualização

## Criação de lojas

### POST /api/v1/stores

- Usuário logado
- Feature `create:store`
- Corpo da requisição:
  - name: Clube Depil 14 de Abril
- Retorno:
  - id: Id do loja
  - name: Nome do loja
  - created_at: Data de Criação
  - updated_at: Data de Atualização

## Listagem de Lojas

### GET /api/v1/store

- Usuário logado
- Feature: `read:store`
- Retorno:
  - Lista de Lojas [
    - id: Id do loja
    - name: Nome do loja
    - created_at: Data de Criação
    - updated_at: Data de Atualização
      ]

## Edição de Lojas

### PATCH /api/v1/store/[store_id]

- Usuário logado
- Feature: `edit:store`
- Corpo da requisição:
  - name: Debora
- Retorno:
  - id: Id do loja
  - name: Nome do loja
  - created_at: Data de Criação
  - updated_at: Data de Atualização

## Deleção de Lojas

### DELETE /api/v1/store/[store_id]

- Usuário logado
- Feature: `delete:store`
- Retorno:
  - id: Id do loja
  - name: Nome do loja
  - created_at: Data de Criação
  - updated_at: Data de Atualização

### DELETE /api/v1/store/

- Usuário logado
- Feature: `delete:store`
- Corpo da Requisição:
  - Lista de Id's de Lojas [store_id, ...]
- Retorno:
  - Lista de lojas deletados [
    - id: Id do loja
    - name: Nome do loja
    - created_at: Data de Criação
    - updated_at: Data de Atualização
      ]
