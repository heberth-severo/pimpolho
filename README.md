## Projeto Pimpolho


1. [Sobre o Projeto](#sobre-o-projeto)
    * [Dependências](#Dependências)
    * [Docker](#Docker)
    * [Autores](#Autores)

## Sobre o Projeto
Repositório criado para o desenvolvimento do projeto pimpolho.

### Dependências 

- HTML
- CSS
- JAVASCRIPT
- BOOTSTRAP
- Node.js
- Express
- PostgreSQL

### Docker

O projeto pode ser executado em containers Docker, facilitando a configuração do ambiente de desenvolvimento.

#### Requisitos

- Docker
- Docker Compose

#### Como executar

1. Clone o repositório:
   ```
   git clone https://github.com/camilacarvalhon/projetopimpolho.git
   cd projetopimpolho
   ```

2. Execute o projeto com Docker Compose:
   ```
   docker-compose up
   ```

3. Acesse a aplicação em seu navegador:
   ```
   http://localhost:3000
   ```

4. Para parar os containers:
   ```
   docker-compose down
   ```

#### Estrutura Docker

- **app**: Serviço Node.js que executa a aplicação
- **db**: Serviço PostgreSQL para o banco de dados

Os dados do PostgreSQL são persistidos em um volume Docker, então eles não serão perdidos quando os containers forem reiniciados.

### Autores

- Camila Carvalho 
