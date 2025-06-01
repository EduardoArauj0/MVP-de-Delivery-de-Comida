# Backend - Instruções

## Pré-requisitos

* [Node.js](https://nodejs.org/)
* [Docker](https://www.docker.com/)(Opcional)
* [MySQL](GUI Client) - Qualquer ferramenta com a capacidade de verificar o banco de dados. (ex., MySQL Workbench, Dbeaver...) (Opcional)

## Instruções de execução:
* Clone o repositório e em um terminal de sua escolha acesse o diretório `backend`.

## 1. Etapa: Criando o .env:

* Crie um arquivo `.env` no diretório, e adicione as variáveis.

``` 
    DB_NAME=### (à critério do usuário)
    DB_USER=root (Ou qualquer com permissões suficientes)
    DB_PASSWORD=
    DB_HOST=mysql
    DB_DIALECT=mysql
    JWT_SECRET=### (à critério do usuário e de acordo com controllers/userController.js)
    PORT=3000
```
## 2. Etapa: Executando o Backend:

### 1. Executando localmente (sem Docker):

1. **Instalando as dependências e iniciando o servidor:**
```
 npm install
 npm run dev
```
2. **Configurando o banco de dados:**(Utilizando um Cliente MySQL, Opcional)

* Criar um banco de dados para correspondente ao DB_NAME do `.env`.
* Ajustar as configurações no banco de dados para corresponder ao `.env`.

### 2. Executando com o Docker:

1. **Construindo as imagens e containêrs no Docker**
```
 docker-compose --build up
```  
(Cria os containêrs no docker e inicia o servidor instalando as dependências)

2. **Configurando o banco de dados:**(Utilizando um Cliente MySQL, Opcional)

* Criar um banco de dados para correspondente ao DB_NAME do `.env`.
* Ajustar as configurações no banco de dados para corresponder ao `.env`.

## 3. Etapa:  **Acesso ao Swagger Docs:**(Opcional)

* Para facilitar o teste e controle de rotas a documentação Swagger está hosteada em [Swagger](http://localhost:3000/api-docs).

## Observações:

* Certifique-se que todas as portas em default do projeto estejam livres, 3000 (backend) e 3306 (MySQL), caso não, é aconselhável troca-lás, sendo necessária a alteração do `index.js`, `docker-compose.yml`, `Dockerfile` e o `.env`.
