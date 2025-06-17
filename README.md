# MVP de Delivery de Comida

Este projeto é uma aplicação web completa de delivery de comida, construída como um Mínimo Produto Viável (MVP). A plataforma conecta restaurantes, clientes e administradores, oferecendo um sistema robusto para gerenciamento de pedidos, cardápios e usuários.

O sistema é dividido em duas partes principais:
* **Backend**: Uma API RESTful construída com Node.js, Express e Sequelize, responsável por toda a lógica de negócios, gerenciamento de banco de dados e autenticação.
* **Frontend**: Uma aplicação de página única (SPA) interativa e responsiva, desenvolvida com React e Vite.

---

## Índice

* [Principais Funcionalidades](#principais-funcionalidades)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Estrutura do Projeto](#estrutura-do-projeto)
* [Pré-requisitos](#pré-requisitos)
* [Instalação e Execução](#instalação-e-execução)
    * [Backend](#backend-1)
    * [Frontend](#frontend-1)
* [Scripts Disponíveis](#scripts-disponíveis)
* [Perfis de Usuário e Credenciais](#perfis-de-usuário-e-credenciais)

---

## Principais Funcionalidades

### Para Clientes
* Cadastro e Login de usuários.
* Navegação por restaurantes com filtros por tipo de cozinha, entrega grátis, restaurantes abertos e busca por nome.
* Visualização do cardápio detalhado por restaurante.
* Adição de itens a um carrinho de compras persistente.
* Gerenciamento de endereços de entrega.
* Finalização de pedidos com simulação de diferentes formas de pagamento.
* Visualização do histórico de pedidos.
* Avaliação de pedidos entregues.

### Para Empresas (Donos de Restaurantes)
* Dashboard para gerenciamento do restaurante e produtos.
* Cadastro e edição dos dados do restaurante (nome, CNPJ, endereço, taxa de frete, etc.).
* Gerenciamento completo do cardápio: criação, edição, ativação/desativação de produtos.
* Recebimento e atualização do status dos pedidos (pendente, em preparo, entregue, etc.).

### Para Administradores
* Dashboard administrativo com visão geral do sistema.
* Estatísticas de usuários, restaurantes e pedidos.
* Gerenciamento de todos os usuários, incluindo a atribuição de papéis (grupos).
* Gerenciamento de todos os restaurantes, podendo editar ou remover qualquer um.
* Gerenciamento de tipos de cozinha.
* Gerenciamento das formas de pagamento disponíveis na plataforma.
* Visualização e remoção de todas as avaliações feitas no sistema.

---

## Tecnologias Utilizadas

### Backend
* **Node.js**: Ambiente de execução JavaScript.
* **Express.js**: Framework para construção da API REST.
* **Sequelize**: ORM (Mapeamento Objeto-Relacional) para interagir com o banco de dados.
* **MySQL**: Banco de dados relacional (utilizado via `mysql2` e `docker-compose.yml`).
* **JWT (JSON Web Token)**: Para autenticação e autorização de rotas.
* **Bcrypt**: Para hash de senhas.
* **Docker**: Para containerização da aplicação e do banco de dados.

### Frontend
* **React**: Biblioteca para construção de interfaces de usuário.
* **Vite**: Ferramenta de build e desenvolvimento frontend.
* **React Router DOM**: Para gerenciamento de rotas na SPA.
* **Axios**: Cliente HTTP para comunicação com o backend.
* **Bootstrap & Bootstrap Icons**: Para estilização e componentes de UI.
* **Context API**: Para gerenciamento de estado global (Autenticação, Carrinho, Dados da Aplicação).

---

## Estrutura do Projeto

O repositório está organizado em duas pastas principais:

```
/
├── backend/         # Contém toda a aplicação da API (Node.js/Express)
└── frontend-delivery/ # Contém toda a aplicação do cliente (React)
```

---

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas:

* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [Docker](https://www.docker.com/) e Docker Compose (Recomendado para o backend)
* Um cliente de banco de dados SQL como [DBeaver](https://dbeaver.io/) ou [MySQL Workbench](https://www.mysql.com/products/workbench/) (Opcional, para visualizar os dados).

---

## Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### Backend

O backend pode ser executado de duas maneiras: via Docker (recomendado) ou localmente.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/EduardoArauj0/MVP-de-Delivery-de-Comida
    cd mvp-de-delivery-de-comida/backend
    ```

2.  **Crie o arquivo de ambiente:**
    Crie um arquivo chamado `.env` na raiz da pasta `backend/` e preencha com as seguintes variáveis. Um exemplo básico é fornecido abaixo:

    ```env
    DB_NAME=deliverydb
    DB_USER=root
    DB_PASSWORD=seu_password_se_houver
    DB_HOST=mysql      # Use 'mysql' para Docker, 'localhost' para execução local
    DB_DIALECT=mysql
    JWT_SECRET=sua_chave_secreta_aqui
    PORT=3000
    ```
    > **Nota**: Se estiver rodando com o Docker Compose fornecido, você pode deixar `DB_PASSWORD` em branco, pois ele está configurado para permitir senhas vazias.

3.  **Execute a Aplicação:**

    * **Com Docker (Recomendado):**
        Este comando irá construir a imagem do backend, iniciar um container para o banco de dados MySQL e iniciar o servidor da aplicação. O banco de dados e as tabelas serão criados e populados automaticamente na primeira inicialização.

        ```bash
        docker-compose up --build
        ```

    * **Localmente (Sem Docker):**
        Se não for usar Docker, você precisa ter um servidor MySQL rodando na sua máquina.

        ```bash
        # Instale as dependências
        npm install

        # Inicie o servidor em modo de desenvolvimento
        npm run dev
        ```
        > **Importante**: Ao rodar localmente, certifique-se de que as configurações no seu arquivo `.env` (especialmente `DB_HOST`, `DB_USER`, `DB_PASSWORD`) correspondem às do seu servidor MySQL local.

O backend estará rodando em `http://localhost:3000`.

### Frontend

1.  **Navegue até a pasta do frontend:**
    Em um novo terminal, a partir da raiz do projeto:
    ```bash
    cd frontend-delivery
    ```

2.  **Crie o arquivo de ambiente:**
    Crie um arquivo `.env` na raiz da pasta `frontend-delivery/` para especificar a URL da API do backend:
    ```env
    VITE_API_URL=http://localhost:3000
    ```

3.  **Instale as dependências e execute:**
    ```bash
    # Instale as dependências
    npm install

    # Inicie o servidor de desenvolvimento
    npm run dev
    ```

A aplicação frontend estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

---

## Scripts Disponíveis

### Backend (`package.json`)
* `npm start`: Inicia o servidor em modo de produção.
* `npm run dev`: Inicia o servidor em modo de desenvolvimento com `nodemon`, que reinicia automaticamente ao detectar alterações nos arquivos.

### Frontend (`package.json`)
* `npm run dev`: Inicia o servidor de desenvolvimento do Vite.
* `npm run build`: Compila a aplicação React para produção.
* `npm run lint`: Executa o linter (ESLint) para verificar a qualidade do código.
* `npm run preview`: Inicia um servidor local para visualizar a build de produção.

---

## Perfis de Usuário e Credenciais

O banco de dados é populado (seeded) com dados iniciais, incluindo usuários com diferentes perfis para facilitar os testes. A senha padrão para todos é `123`.

* **Administrador**:
    * **Email**: `admin@delivery.com`
    * **Permissões**: Acesso total a todas as funcionalidades de gerenciamento do sistema.

* **Cliente**:
    * **Email**: `cliente@delivery.com`
    * **Permissões**: Realizar e visualizar pedidos, avaliar, gerenciar carrinho e endereços.

* **Empresas (Donos de Restaurantes)**:
    * **Email**: `dono.pizza@example.com` (Dono da Pizzaria da Praça)
    * **Email**: `chef.sushi@example.com` (Dono do Sushi Master)
    * **Email**: `gerente.burger@example.com` (Dono do Burger Place)
    * **Permissões**: Gerenciar o próprio restaurante, cardápio e pedidos recebidos.
