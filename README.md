# Sistema de Gestão para Call Center

## 📖 Descrição

Este é um projeto de aplicação web full-stack desenvolvido para gerenciar operações e ferramentas de um call center. O sistema é construído com foco na experiência do usuário (UX/UI) e utiliza uma arquitetura moderna com frontend e backend desacoplados.

---

## ✨ Funcionalidades Implementadas

### Módulo 1: Gestão de Pausas (v1.0 - Concluído)

#### Visão do Operador
- [X] Fazer login no sistema com persistência (não desloga ao atualizar a página).
- [X] Visualizar e selecionar os tipos de pausa disponíveis (regressivas e progressivas).
- [X] Solicitar uma pausa para um supervisor.
- [X] Cancelar uma solicitação de pausa pendente, com atualização no banco de dados.
- [X] Ser notificado em tempo real quando a pausa é aprovada, rejeitada ou forçada pelo supervisor.
- [X] Iniciar a pausa após a aprovação.
- [X] Visualizar um cronômetro grande e claro na tela principal durante a pausa.
- [X] O cronômetro funciona para contagens regressivas e progressivas.
- [X] Finalizar a pausa (manualmente ou automaticamente ao fim do tempo).
- [X] O estado da pausa (pendente, aprovada, em andamento) persiste e é sincronizado mesmo se a página for atualizada.

#### Visão do Supervisor
- [X] Fazer login no sistema com persistência.
- [X] Visualizar em tempo real as solicitações de pausa pendentes na sidebar de notificações.
- [X] Aprovar ou rejeitar solicitações, com atualização instantânea na tela do operador.
- [X] Visualizar um dashboard principal com o monitor de todas as pausas ativas (em andamento) e aprovadas.
- [X] Acompanhar o tempo (regressivo ou progressivo) das pausas em andamento em tempo real.
- [X] Visualizar uma lista de todos os operadores da equipe e seu status atual (Em Atendimento, Em Pausa, etc.).
- [X] Forçar o início de uma pausa para um operador que esteja em atendimento.
- [X] Visualizar indicadores com o total de operadores em pausa e o percentual sobre a equipe.

#### Visão do Administrador
- [X] Fazer login no sistema com persistência.
- [X] Acessar uma página de administração protegida para gerenciar tipos de pausa.
- [X] Criar, editar e excluir tipos de pausa.
- [X] Definir se uma pausa é de contagem regressiva (com duração) ou progressiva (sem duração).

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** React.js, React Router
*   **Backend:** Node.js, Express.js
*   **Banco de Dados:** PostgreSQL
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

2.  **Configurar o Backend:**
    ```bash
    cd backend
    npm install
    ```
    *   Crie um arquivo `.env` na raiz da pasta `backend` e preencha com as suas credenciais do PostgreSQL (use o arquivo `.env.example` como modelo, se houver).
    ```env
    PGHOST=localhost
    PGPORT=5432
    PGDATABASE=callcenter_db
    PGUSER=postgres
    PGPASSWORD=suasenha
    ```
    *   Execute as migrações para criar a estrutura do banco de dados:
    ```bash
    npm run migrate up
    ```
    *   Popule o banco com dados iniciais de teste:
    ```bash
    npm run seed
    ```

3.  **Configurar o Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Executar a Aplicação:**
    *   Abra um terminal e inicie o backend:
    ```bash
    cd backend
    npm start
    ```
    *   Abra um **novo** terminal e inicie o frontend:
    ```bash
    cd frontend
    npm start
    ```
    *   Acesse `http://localhost:3000` no seu navegador.

    