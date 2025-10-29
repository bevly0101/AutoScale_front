# Explicação da Tabela `Notifications` para Implementação de Funcionalidades

A tabela `Notifications` foi projetada para ser o **registro central de todos os eventos notáveis** que ocorrem no seu aplicativo e que precisam ser comunicados a um usuário específico.

## Estrutura e Propósito dos Campos

A tabela armazena a informação essencial sobre a notificação, quem a recebeu, quem a causou e se ela já foi visualizada.

| Campo | Tipo de Dado | Propósito no Aplicativo |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Identificador único da notificação. Usado para referenciar a notificação (ex: marcar como lida). |
| `recipient_id` | `UUID` (FK para `Users.id`) | **O usuário que DEVE ver esta notificação.** Este é o campo principal para filtrar notificações. |
| `sender_id` | `UUID` (FK para `Users.id`, opcional) | **O usuário que causou o evento.** (Ex: o usuário que enviou a mensagem). É opcional porque algumas notificações são geradas pelo sistema. |
| `type` | `VARCHAR(50)` | **A chave para a lógica do aplicativo.** Define a natureza do evento (ex: `new_message`, `channel_mention`, `user_joined`). |
| `message` | `TEXT` | O texto curto e direto que será exibido ao usuário (ex: "João te mencionou no canal #geral"). |
| `is_read` | `BOOLEAN` | Indica se o usuário já visualizou a notificação (`TRUE` = lida, `FALSE` = não lida). |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Data e hora em que a notificação foi gerada. Usado para ordenação (as mais recentes primeiro). |

## Como Usar a Tabela para Implementar Funcionalidades

A funcionalidade de notificação em seu aplicativo será dividida em três operações principais: **Criação**, **Leitura/Exibição** e **Atualização de Status**.

### 1. Criação de Notificações (INSERT)

Sempre que um evento notável ocorrer no seu sistema, você deve inserir um novo registro na tabela `Notifications`.

**Cenário de Exemplo: Novo Usuário Mencionado em um Canal**

1.  **Evento:** Usuário A envia uma mensagem no canal X e menciona o Usuário B.
2.  **Ação do Backend:** Seu código de backend deve identificar o `recipient_id` (Usuário B) e criar a notificação.

| Coluna | Valor a Inserir |
| :--- | :--- |
| `recipient_id` | ID do Usuário B |
| `sender_id` | ID do Usuário A |
| `type` | `'channel_mention'` |
| `message` | `'[Nome do Usuário A] te mencionou no canal [Nome do Canal]'` |
| `is_read` | `FALSE` (Padrão) |

**SQL de Exemplo (Conceitual):**

```sql
INSERT INTO Notifications (recipient_id, sender_id, type, message)
VALUES (
    'id_do_usuario_b',
    'id_do_usuario_a',
    'channel_mention',
    'João te mencionou no canal #geral'
);
```

### 2. Exibição de Notificações (SELECT)

Para exibir a lista de notificações de um usuário e o contador de notificações não lidas, você fará consultas (SELECT) na tabela.

**Funcionalidade A: Contador de Notificações Não Lidas (Badge)**

```sql
SELECT COUNT(id)
FROM Notifications
WHERE recipient_id = 'id_do_usuario_logado'
  AND is_read = FALSE;
```
*   **Lógica:** O aplicativo deve rodar essa consulta frequentemente para atualizar o número no ícone de notificação.

**Funcionalidade B: Listar as Últimas Notificações**

```sql
SELECT id, sender_id, type, message, created_at
FROM Notifications
WHERE recipient_id = 'id_do_usuario_logado'
ORDER BY created_at DESC
LIMIT 20;
```
*   **Lógica:** Esta consulta recupera as notificações mais recentes para exibir na lista ou "caixa de entrada" de notificações.

### 3. Atualização de Status (UPDATE)

Quando o usuário interage com a notificação, você precisa atualizar o status `is_read`.

**Funcionalidade C: Marcar uma Notificação como Lida**

```sql
UPDATE Notifications
SET is_read = TRUE
WHERE id = 'id_da_notificacao_clicada';
```

**Funcionalidade D: Marcar TODAS as Notificações como Lidas**

```sql
UPDATE Notifications
SET is_read = TRUE
WHERE recipient_id = 'id_do_usuario_logado'
  AND is_read = FALSE;
```

## O Papel da Coluna `type`

O campo `type` é a coluna mais importante para a **lógica de frontend e backend**.

*   **No Backend:** Seu código usará o `type` para decidir qual mensagem gerar e quais usuários devem ser notificados.
*   **No Frontend:** O aplicativo usará o `type` para:
    *   Exibir um ícone ou cor diferente para cada tipo de notificação.
    *   Determinar qual ação tomar quando o usuário clica (por exemplo, se o `type` é `'new_message'`, o clique deve levar o usuário para a conversa mais recente).

Ao focar nestas três operações (Criação, Leitura/Exibição e Atualização), você terá todas as ferramentas necessárias para construir um sistema de notificação robusto e funcional.
