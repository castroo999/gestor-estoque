# 📦 Gestor de Estoque

Sistema de gerenciamento de estoque desenvolvido com **TypeScript**, com foco em organização de produtos, controle de estoque, usuários e entregas.

O projeto está sendo desenvolvido com uma arquitetura de **API REST**, autenticação utilizando **JWT** e persistência de dados em **PostgreSQL** através do **Prisma ORM**.

> 🚧 Projeto em desenvolvimento

---

## 🚀 Tecnologias

### Backend

* **Node.js**
* **TypeScript**
* **Express**
* **Prisma ORM**
* **PostgreSQL**
* **JWT**
* **bcrypt**
* **dotenv**

### Frontend

* **React**
* **TypeScript**
* **Axios**
* **CSS**

### Ferramentas

* Git & GitHub
* VS Code
* Postman
* Prisma Studio

---

## ✨ Funcionalidades

### 🔐 Autenticação

* Cadastro de usuários
* Login
* Senhas protegidas com bcrypt
* Autenticação utilizando JWT
* Proteção de rotas
* Identificação do usuário autenticado

### 📦 Estoque

* Cadastro de produtos
* Listagem de produtos
* Atualização de produtos
* Exclusão de produtos
* Controle de quantidade em estoque
* Associação de informações aos usuários

### 🚚 Entregas

* Cadastro e gerenciamento de entregas
* Listagem de entregas
* Associação de entrega a um responsável
* Identificação do usuário responsável
* Controle das informações relacionadas às entregas

### 📊 Dashboard

O sistema possui uma área de dashboard destinada à visualização das principais informações do estoque.

---

## 🏗️ Estrutura do projeto

```text
gestor-estoque/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

> A estrutura pode sofrer alterações conforme o desenvolvimento do projeto.

---

## 🗄️ Banco de dados

O projeto utiliza **PostgreSQL** como banco de dados e **Prisma ORM** para comunicação entre a aplicação e o banco.

O Prisma é responsável por:

* Modelagem das entidades
* Criação e gerenciamento das migrations
* Consultas ao banco
* Relacionamento entre entidades
* Tipagem das consultas

### Principais entidades

Atualmente, o sistema trabalha principalmente com informações relacionadas a:

* 👤 Usuários
* 📦 Produtos
* 🚚 Entregas

---

## 🔑 Variáveis de ambiente

Crie um arquivo `.env` no backend:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/gestor_estoque"

JWT_SECRET="sua_chave_secreta"
PORT=3000
```

> Nunca envie o arquivo `.env` para o GitHub.

Adicione ao `.gitignore`:

```gitignore
.env
node_modules/
dist/
```

---

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone SEU_REPOSITORIO
```

Entre na pasta:

```bash
cd gestor-estoque
```

---

### 2. Instale as dependências do backend

```bash
cd backend
npm install
```

---

### 3. Configure o banco de dados

Crie um banco PostgreSQL e configure a variável:

```env
DATABASE_URL="sua_connection_string"
```

---

### 4. Execute as migrations

```bash
npx prisma migrate dev
```

---

### 5. Gere o Prisma Client

```bash
npx prisma generate
```

---

### 6. Inicie o backend

```bash
npm run dev
```

O servidor será executado na porta configurada no `.env`.

---

## 🧪 Testando a API

A API pode ser testada utilizando ferramentas como:

* Postman
* Insomnia
* Thunder Client

Fluxo básico:

```text
Cadastro
   ↓
Login
   ↓
Recebimento do JWT
   ↓
Envio do token nas requisições
   ↓
Acesso às rotas protegidas
   ↓
Gerenciamento do estoque
```

---

## 🔒 Autenticação

As rotas protegidas utilizam **JWT**.

Após realizar o login, o cliente recebe um token que deve ser enviado nas requisições autenticadas.

Exemplo:

```http
Authorization: Bearer SEU_TOKEN
```

O middleware de autenticação verifica o token antes de permitir o acesso à rota.

---

## 📌 Objetivos do projeto

Este projeto tem como objetivo desenvolver uma aplicação de gerenciamento de estoque com uma estrutura próxima de aplicações utilizadas em ambientes reais.

Além de praticar desenvolvimento web, o projeto busca trabalhar conceitos como:

* Arquitetura de APIs REST
* TypeScript
* Autenticação e autorização
* Banco de dados relacional
* ORM
* Relacionamentos entre entidades
* Segurança de senhas
* Middleware
* Organização de código
* Integração entre frontend e backend

---

## 👨‍💻 Autor

Desenvolvido por **Gustavo Castro**.

Projeto criado para estudo e evolução prática em **Desenvolvimento de Sistemas**, com foco em backend, bancos de dados e desenvolvimento full-stack.

---

## 📄 Licença

Este projeto está sendo desenvolvido para fins de estudo e portfólio.
