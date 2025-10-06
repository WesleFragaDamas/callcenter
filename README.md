# Sistema de Gestão para Call Center

## 📖 Descrição

Este é um projeto de aplicação web full-stack desenvolvido para gerenciar operações e ferramentas de um call center. O sistema é construído com foco na experiência do usuário (UX/UI) e utiliza uma arquitetura moderna com frontend e backend desacoplados, pronto para ser implantado em um ambiente de produção.

---

## ✨ Funcionalidades Implementadas

### Módulo 1: Instalação e Autenticação (Concluído)
- [X] **Fluxo de Instalação Inicial:** Na primeira execução, o sistema redireciona para uma página de setup para a criação do primeiro usuário Administrador, eliminando a necessidade de scripts manuais no banco de dados.
- [X] **Login Seguro com JWT:** Autenticação baseada em tokens (JSON Web Token) com tempo de expiração.
- [X] **Persistência de Sessão:** O usuário permanece logado mesmo após atualizar ou fechar o navegador.
- [X] **Controle de Acesso Baseado em Função (RBAC):** Rotas da API e da interface são protegidas, garantindo que apenas usuários com a permissão correta (ex: 'ADMIN') possam acessá-las.
- [X] **Funcionalidade de Logout.**

### Módulo 2: Gestão de Pausas (Concluído)

#### Visão do Operador
- [X] Visualizar e selecionar os tipos de pausa disponíveis (regressivas e progressivas).
- [X] Solicitar, cancelar, iniciar e finalizar pausas.
- [X] Ser notificado em tempo real sobre o status da sua solicitação (Aprovada, Rejeitada, Em Fila).
- [X] Visualizar um cronômetro grande na tela principal durante a pausa, funcional para contagens regressivas e progressivas.
- [X] O estado da pausa persiste e é sincronizado mesmo se a página for atualizada.

#### Visão do Supervisor
- [X] Visualizar em tempo real as solicitações pendentes e a fila de espera na sidebar de notificações.
- [X] Aprovar ou rejeitar solicitações. O sistema gerencia a fila automaticamente com base em um limite de pausas configurável (ex: 15%).
- [X] Quando uma pausa termina, o sistema promove o próximo da fila automaticamente.
- [X] Monitorar em um dashboard principal todas as pausas ativas e aprovadas.
- [X] Acompanhar o tempo (regressivo ou progressivo) das pausas em andamento.
- [X] Visualizar uma lista de todos os operadores da equipe e seu status atual.
- [X] Forçar o início ou a finalização de uma pausa para um operador.

### Módulo 3: Administração (Concluído)

#### Gerenciamento de Tipos de Pausa
- [X] Interface para Criar, Ler, Editar e Excluir (CRUD) os tipos de pausa.
- [X] Possibilidade de definir se uma pausa é de contagem regressiva (com duração) ou progressiva (sem duração).

#### Gerenciamento de Usuários
- [X] Interface para Criar, Ler e Editar (CRUD) todos os usuários do sistema.
- [X] Atribuir funções (roles) específicas para cada usuário (Admin, Supervisor, Operador, etc.).
- [X] Funcionalidade de Ativar e Desativar usuários (exclusão lógica para manter o histórico).
- [X] A contagem de operadores para o limite de pausas considera apenas os usuários ativos.

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** React.js, React Router
*   **Backend:** Node.js, Express.js
*   **Banco de Dados:** PostgreSQL
*   **Autenticação:** JSON Web Token (JWT)
*   **Gerenciamento de Banco de Dados:** node-pg-migrate (para migrations)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (versão LTS recomendada)
- Git
- PostgreSQL instalado e rodando.

### Passos para Instalação

1.  **Clonar o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO_GIT]
    cd callcenter
    ```

2.  **Configurar e Iniciar o Backend:**
    ```bash
    cd backend
    npm install
    ```
    *   Crie um arquivo `.env` na raiz da pasta `backend` com as suas credenciais do PostgreSQL e uma `JWT_SECRET`.
    *   **Importante:** Garanta que o banco de dados especificado no `.env` exista e esteja vazio.
    *   Execute as migrações para criar toda a estrutura do banco de dados:
        ```bash
        npm run migrate up
        ```
    *   Inicie o servidor backend:
        ```bash
        npm start
        ```

3.  **Configurar e Iniciar o Frontend:**
    *   Abra um **novo terminal**.
    ```bash
    cd frontend
    npm install
    npm start
    ```

4.  **Primeiro Acesso (Setup):**
    *   Acesse `http://localhost:3000` no seu navegador. Você será redirecionado para a página `/setup`.
    *   Crie o primeiro usuário Administrador. Após o sucesso, você será levado para a tela de login.
    *   A partir deste ponto, o script de `seed` (`npm run seed`) torna-se opcional e serve apenas para popular o banco com dados de teste.