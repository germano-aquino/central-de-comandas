# Endpoints para Clientes

## Tabela Clients

- id: Id do cliente
- name: Nome do cliente
- phone: Número do celular do cliente
- created_at: Data de criação
- updated_at: Data da última atualização

## Criação de clientes

### POST /api/v1/clients

- Usuário logado
- Feature `create:client`
- Corpo da requisição:
  - name: Debora
  - phone: +55 91 987654321
- Retorno:
  - id: Id do cliente
  - name: Nome do cliente
  - phone: Número do celular do cliente
  - created_at: Data de Criação
  - updated_at: Data de Atualização

## Listagem de Clientes

### GET /api/v1/client

- Usuário logado
- Feature: `read:client`
- Filtro: Nome e Número de Celular query params
- Retorno:
  - Lista de Clientes [
    - id: Id do cliente
    - name: Nome do cliente
    - phone: Número do celular do cliente
    - created_at: Data de Criação
    - updated_at: Data de Atualização
      ]

## Edição de Clientes

### PATCH /api/v1/client/[client_id]

- Usuário logado
- Feature: `edit:client`
- Corpo da requisição:
  - name: Debora
  - phone: +55 91 987654321
- Retorno:
  - id: Id do cliente
  - name: Nome do cliente
  - phone: Número do celular do cliente
  - created_at: Data de Criação
  - updated_at: Data de Atualização

## Deleção de Clientes

### DELETE /api/v1/client/[client_id]

- Usuário logado
- Feature: `delete:client`
- Retorno:
  - id: Id do cliente
  - name: Nome do cliente
  - phone: Número do celular do cliente
  - created_at: Data de Criação
  - updated_at: Data de Atualização

### DELETE /api/v1/client/

- Usuário logado
- Feature: `delete:client`
- Corpo da Requisição:
  - Lista de Id's de Clientes [client_id, ...]
- Retorno:
  - Lista de clientes deletados [
    - id: Id do cliente
    - name: Nome do cliente
    - phone: Número do celular do cliente
    - created_at: Data de Criação
    - updated_at: Data de Atualização
      ]
