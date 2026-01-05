# Endpoints para Seção das Comandas

## Tabela Command Sections

- id: Id da seção
- name: Nome da seção
- type: Tipo da seção ["service", "form"]
- created_at: Data de criação
- updated_at: Data da última atualização

## Criação de Seções

### POST /api/v1/sections

- Usuário logado
- Feature `create:section`
- Corpo da requisição:
  - name: Depilação
  - type: `service` | `form`
- Retorno:
  - id: Id da seção
  - name: Nome da seção
  - created_at: Data de Criação
  - updated_at: Date de Atualização

## Listagem de Seções

### GET /api/v1/sections

Lista todas as seções cadastradas.

- Usuário logado
- Feature: `read:section`
- Retorno:
  - Lista de Seções [
    - id: Id da seção
    - name: Nome da seção
    - type: `service` | `form`
    - created_at: Data de Criação
    - updated_at: Date de Atualização
      ]

## Edição de Seções

### PATCH /api/v1/sections/[section_name]

Listagem da seção cujo o campo `name` seja igual ao `section_name`.

- Usuário logado
- Feature: `edit:section`
- Corpo da requisição:
  - name: Depilação virilha
- Retorno:
  - id: Id da seção
  - name: Nome da seção
  - type: `service` | `form`
  - created_at: Data de Criação
  - updated_at: Date de Atualização

## Deleção de Seções

### DELETE /api/v1/sections/[section_name]

Deleção da seção cujo o campo `name` seja igual ao `section_name`.

- Usuário logado
- Feature: `delete:section`
- Retorno:
  - id: Id da seção
  - name: Nome da seção
  - type: `service` | `form`
  - created_at: Data de Criação
  - updated_at: Date de Atualização

### DELETE /api/v1/sections/

Deleção de múltiplas seções definidas pelo `section_ids`

- Usuário logado
- Feature: `delete:section`
- Corpo da Requisição:
  - section_ids: Lista de Id's de Seções [section_id, ...]
- Retorno:
  - id: Id da seção
  - name: Nome da seção
  - type: `service` | `form`
  - created_at: Data de Criação
  - updated_at: Date de Atualização
