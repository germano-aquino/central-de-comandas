# Endpoints para Categoria de Serviços

## Tabela Service Categories

- id: Id da categoria
- name: Nome da categoria
- created_at: Data de criação
- updated_at: Data da última atualização

## Criação de categorias

### POST /api/v1/categories

- Usuário logado
- Feature `create:category`
- Corpo da requisição:
  - name: Depilação
- Retorno:
  - id: Id da categoria
  - name: Nome da categoria
  - created_at: Data de Criação
  - updated_at: Date de Atualização

## Listagem de Categorias

### GET /api/v1/categories

- Usuário logado
- Feature: `read:category`
- Retorno:
  - Lista de Categorias [
    - id: Id da categoria
    - name: Nome da categoria
    - created_at: Data de Criação
    - updated_at: Date de Atualização
      ]

## Edição de Categorias

### PATCH /api/v1/categories/[category_name]

- Usuário logado
- Feature: `edit:category`
- Corpo da requisição:
  - name: Depilação virilha
- Retorno:
  - id: Id da categoria
  - name: Nome da categoria
  - created_at: Data de Criação
  - updated_at: Date de Atualização

## Deleção de Categorias

### DELETE /api/v1/categories/[category_name]

- Usuário logado
- Feature: `delete:category`
- Retorno:
  - id: Id da categoria
  - name: Nome da categoria
  - created_at: Data de Criação
  - updated_at: Date de Atualização

### DELETE /api/v1/categories/

- Usuário logado
- Feature: `delete:category`
- Corpo da Requisição:
  - Lista de Id's de Categorias [category_id, ...]
- Retorno:
  - id: Id da categoria
  - name: Nome da categoria
  - created_at: Data de Criação
  - updated_at: Date de Atualização
