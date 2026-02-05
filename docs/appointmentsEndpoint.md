# Endpoints para Atendimentos

## Tabela appointments

- id: Id de atendimento
- store_id: Id da loja em que o atendimento foi realizado
- client_id: Id da Cliente que foi atendida
- question_ids: Lista dos ids das perguntas respondidas pelo cliente [od1, id2, ...]
- service_ids: Lista dos serviços
- payment_method: ['dinheiro', 'credito', 'debito', 'pix', 'pacote']
- created_at: Data de criação
- updated_at: Data da última atualização

## Criação de atendimento

### POST /api/v1/appointments

- Usuário logado
- Feature `create:appointment`
- Corpo da requisição:
  - store_id: uuid da loja
  - client_id: uuid do cliente
  - question_ids: lista de uuid das perguntas respondidas
  - service_ids: lista de uuid dos serviços prestados
  - payment_method: método de pagamento utilizado
- Retorno:
  - id: Id de atendimento
  - store_id: Id da loja em que o atendimento foi realizado
  - client_id: Id da Cliente que foi atendida
  - partner_ids: Lista de ids das parceiras que realizaram o atendimento [id1, id2, ...]
  - question_ids: Lista dos ids das perguntas respondidas pelo cliente [od1, id2, ...]
  - service_ids: Lista dos serviços
  - payment_method: ['dinheiro', 'credito', 'debito', 'pix', 'pacote']
  - created_at: Data de criação
  - updated_at: Data da última atualização

## Listagem de Atendimentos

### GET /api/v1/appointments

- Usuário logado
- Feature: `read:appointment`
- Retorno:
  - Lista de Lojas [
    - id: Id de atendimento
    - store_id: Id da loja em que o atendimento foi realizado
    - client_id: Id da Cliente que foi atendida
    - partner_ids: Lista de ids das parceiras que realizaram o atendimento [id1, id2, ...]
    - question_ids: Lista dos ids das perguntas respondidas pelo cliente [od1, id2, ...]
    - service_ids: Lista dos serviços
    - payment_method: ['dinheiro', 'credito', 'debito', 'pix', 'pacote']
    - created_at: Data de criação
    - updated_at: Data da última atualização
      ]

## Edição de Atendimentos

### PATCH /api/v1/appointments

- Usuário logado
- Feature: `edit:appointment`
- Corpo da requisição:
  - id: uuid do atendimento a ser editado
  - store_id: uuid da loja
  - client_id: uuid do cliente
  - question_ids: lista de uuid das perguntas respondidas
  - service_ids: lista de uuid dos serviços prestados
  - payment_method: método de pagamento utilizado
- Retorno:
  - id: Id de atendimento
  - store_id: Id da loja em que o atendimento foi realizado
  - client_id: Id da Cliente que foi atendida
  - partner_ids: Lista de ids das parceiras que realizaram o atendimento [id1, id2, ...]
  - question_ids: Lista dos ids das perguntas respondidas pelo cliente [od1, id2, ...]
  - service_ids: Lista dos serviços
  - payment_method: ['dinheiro', 'credito', 'debito', 'pix', 'pacote']
  - created_at: Data de criação
  - updated_at: Data da última atualização

## Deleção de Atendimento

### DELETE /api/v1/appointments/

- Usuário logado
- Feature: `delete:appointment`
- Corpo da Requisição:
  - Lista de Id's de Lojas [appointment_id1, ...]
- Retorno:
  - Lista de lojas deletados [
    - id: Id de atendimento
    - store_id: Id da loja em que o atendimento foi realizado
    - client_id: Id da Cliente que foi atendida
    - partner_ids: Lista de ids das parceiras que realizaram o atendimento [id1, id2, ...]
    - question_ids: Lista dos ids das perguntas respondidas pelo cliente [od1, id2, ...]
    - service_ids: Lista dos serviços
    - payment_method: ['dinheiro', 'credito', 'debito', 'pix', 'pacote']
    - created_at: Data de criação
    - updated_at: Data da última atualização
      ]
