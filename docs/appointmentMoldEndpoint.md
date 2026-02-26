# Endpoints para Atendimentos

## Tabela appointment_molds

- id: Id do molde de comanda
- store_ids: Lista dos ids das lojas as quais usarão o molde para gerar a comanda
- section_ids: Lista dos ids das seções de perguntas
- question_ids: Lista dos ids das perguntas a serem respondidas pelo cliente [od1, id2, ...]
- category_ids: Lista dos ids das categorias de seviços
- service_ids: Lista dos ids dos serviços
- created_at: Data de criação
- updated_at: Data da última atualização

## Criação do molde de atendimento

### POST /api/v1/molds

- Usuário logado
- Feature `create:mold`
- Corpo da requisição:
  - store_ids: lista de uuids da loja
  - section_ids: Lista dos ids das seções de perguntas
  - question_ids: lista de uuids das perguntas a serem respondidas
  - category_ids: Lista dos ids das categorias de seviços
  - service_ids: lista de uuids dos serviços prestados
- Retorno:
  - id: Id do molde
  - question_ids: Lista dos ids das perguntas respondidas pelo cliente [id1, id2, ...]
  - service_ids: Lista dos serviços
  - created_at: Data de criação
  - updated_at: Data da última atualização

## Listagem de Atendimentos

### GET /api/v1/molds

- Usuário logado
- Feature: `read:mold`
- Retorno:
  - Lista de Moldes de Comandas [
    - id: Id do molde
    - store_ids: Id da loja que utiliza esse molde como padrão
    - question_ids: Lista dos ids das perguntas a serem respondidas pelo cliente
    - service_ids: Lista dos serviços
    - created_at: Data de criação
    - updated_at: Data da última atualização
      ]

## Edição de Atendimentos

### PATCH /api/v1/molds

- Usuário logado
- Feature: `edit:mold`
- Corpo da requisição:
  - id: uuid do molde a ser editado
  - store_ids: lista de uuids da loja que utilizam este molde como padrão
  - question_ids: lista de uuid das perguntas respondidas
  - service_ids: lista de uuid dos serviços prestados
- Retorno:
  - id: Id do molde
  - store_ids: lista de Ids das lojas que utilizam este molde como padrão
  - question_ids: Lista dos ids das perguntas respondidas pelo cliente [od1, id2, ...]
  - service_ids: Lista dos serviços
  - created_at: Data de criação
  - updated_at: Data da última atualização

## Deleção de Atendimento

### DELETE /api/v1/molds/

- Usuário logado
- Feature: `delete:mold`
- Corpo da Requisição:
  - Lista de Id's dos moldes
- Retorno:
  - Lista dos moldes deletados [
    - id: Id do molde
    - store_ids: Ids das lojas que utilizam este molde como padrão
    - question_ids: Lista dos ids das perguntas respondidas pelo cliente [od1, id2, ...]
    - service_ids: Lista dos serviços
    - created_at: Data de criação
    - updated_at: Data da última atualização
      ]
