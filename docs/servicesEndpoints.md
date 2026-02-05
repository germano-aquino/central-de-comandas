# Endpoints para Serviço

## Tabela services

- id: Id do Serviço
- name: Nome do serviço
- price: Preço do serviço em centavos
- category_id: Id da categoria de serviço - opcional
- partner_ids: Lista de ids da profissional que realizou o serviço - opcional
- created_at: Data de criação
- updated_at: Data da última atualização

## Criação de Serviços

### POST /api/v1/services

- Usuário logado
- Feature `create:service`
- Corpo da requisição:
  - name: Nome do serviço
  - price: Preço do serviço em centavos
  - category_id: Id da categoria de serviço - opcional
  - partner_ids: Lista de ids da profissional que realizou o serviço - opcional
- Retorno:
  - id: Id do Serviço
  - name: Nome do serviço
  - price: Preço do serviço em centavos
  - category_id: Id da categoria de serviço - opcional
  - partner_ids: Lista de ids da profissional que realizou o serviço - opcional
  - created_at: Data de criação
  - updated_at: Data da última atualização

## Listagem de Serviços

### GET /api/v1/services

Lista todas as Serviços cadastradas.

- Usuário logado
- Feature: `read:service`
- Retorno:
  - Lista de Serviços [
    - id: Id do Serviço
    - name: Nome do serviço
    - price: Preço do serviço em centavos
    - category_id: Id da categoria de serviço - opcional
    - partner_ids: Lista de ids da profissional que realizou o serviço - opcional
    - created_at: Data de criação
    - updated_at: Data da última atualização
      ]

### GET /api/v1/services?category_name=

Lista todas as Serviços cadastradas.

- Usuário logado
- Feature: `read:service`
- Retorno:
  - Lista de Serviços Pertencentes a uma seção determinada: [
    - id: Id do Serviço
    - name: Nome do serviço
    - price: Preço do serviço em centavos
    - category_id: Id da categoria de serviço - opcional
    - partner_ids: Lista de ids da profissional que realizou o serviço - opcional
    - created_at: Data de criação
    - updated_at: Data da última atualização
      ]

## Edição de Serviços

### PATCH /api/v1/services

Edição da Serviço pelo `id` do serviço no corpo da requisição.

- Usuário logado
- Feature: `edit:service`
- Corpo da requisição:
  - id: id do serviço a ser editado
  - name: Nome do serviço
  - price: Preço do serviço em centavos
  - category_id: Id da categoria de serviço - opcional
  - partner_ids: Lista de ids da profissional que realizou o serviço - opcional
- Retorno:
  - id: Id do Serviço
  - name: Nome do serviço
  - price: Preço do serviço em centavos
  - category_id: Id da categoria de serviço - opcional
  - partner_ids: Lista de ids da profissional que realizou o serviço - opcional
  - created_at: Data de criação
  - updated_at: Data da última atualização

## Deleção de Serviços

### DELETE /api/v1/services/

Deleção de múltiplas Serviços definidas pelo `services_ids`

- Usuário logado
- Feature: `delete:service`
- Corpo da Requisição:
  - services_ids: Lista de Id's de Serviços [service_id, ...]
- Retorno:
  - Lista de Serviços Deletadas [
    - id: Id do Serviço
    - name: Nome do serviço
    - price: Preço do serviço em centavos
    - category_id: Id da categoria de serviço - opcional
    - partner_ids: Lista de ids da profissional que realizou o serviço - opcional
    - created_at: Data de criação
    - updated_at: Data da última atualização
      ]
