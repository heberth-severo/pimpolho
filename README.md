# Documentação Técnica - Projeto Pimpolho

## Índice

1. [Introdução](#1-introdução)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Módulos e Componentes](#3-módulos-e-componentes)
4. [Regras de Negócio](#4-regras-de-negócio)
5. [Preparação do Ambiente de Desenvolvimento](#5-preparação-do-ambiente-de-desenvolvimento)
6. [Execução e Testes](#6-execução-e-testes)
7. [Banco de Dados](#7-banco-de-dados)
8. [Deploy e Ambientes](#8-deploy-e-ambientes)
9. [Segurança](#9-segurança)
10. [Manutenção e Suporte](#10-manutenção-e-suporte)
11. [Anexos e Referências](#11-anexos-e-referências)

---

## 1. Introdução

### Nome do Projeto
**Pimpolho Kids** - Plataforma Educacional de Jogos Interativos

### Objetivo do Sistema
O Pimpolho Kids é uma plataforma educacional desenvolvida para crianças, oferecendo jogos interativos que auxiliam no processo de aprendizagem de forma lúdica e divertida. O sistema permite que professores acompanhem o progresso dos estudantes através de um sistema de pontuação integrado.

### Público-alvo
- **Estudantes**: Crianças em idade escolar que utilizam os jogos educativos
- **Professores**: Educadores que acompanham o progresso e desempenho dos alunos
- **Desenvolvedores**: Equipe técnica responsável pela manutenção e evolução da plataforma

### Visão Geral da Solução
A plataforma oferece uma interface web responsiva com quatro jogos educativos principais:
- Jogo da Forca
- Jogo da Memória
- Jogo dos 7 Erros
- Jogo Complete Palavras

O sistema inclui funcionalidades de cadastro, autenticação e acompanhamento de pontuação para estudantes e professores.

### Tecnologias Utilizadas

**Frontend:**
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.1.3

**Backend:**
- Node.js
- Express.js 4.18.1
- EJS (Template Engine)

**Banco de Dados:**
- PostgreSQL 13

**Infraestrutura:**
- Docker
- Docker Compose

**Dependências Principais:**
- bcrypt 5.0.1 (criptografia)
- cors 2.8.5 (CORS)
- dotenv 16.0.1 (variáveis de ambiente)
- pg 8.7.3 (driver PostgreSQL)
- password-validator 5.3.0 (validação de senhas)
- cpf-cnpj-email-validator 1.4.2 (validação de documentos brasileiros)

---

## 2. Arquitetura do Sistema

### Descrição da Arquitetura
O sistema segue uma arquitetura **monolítica** com separação clara entre frontend e backend:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Banco de      │
│   (Static)      │◄──►│   (Express.js)  │◄──►│   Dados         │
│                 │    │                 │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Fluxo de Dados e Comunicação

1. **Autenticação**: Usuário acessa via interface web → Backend valida credenciais → Retorna dados do usuário
2. **Jogos**: Frontend executa lógica dos jogos → Envia pontuação para API → Backend registra no banco
3. **Consultas**: Professor solicita relatórios → Backend consulta banco → Retorna dados formatados

### Componentes Principais

- **Servidor Web**: Express.js servindo arquivos estáticos e API REST
- **Banco de Dados**: PostgreSQL com conexão via pool de conexões
- **Sistema de Autenticação**: Baseado em email/senha com criptografia bcrypt
- **Sistema de Pontuação**: Registro e consulta de scores dos jogos

---

## 3. Módulos e Componentes

### 3.1 Módulo de Autenticação
**Localização**: `src/app.js` (rotas de autenticação)

**Responsabilidades:**
- Cadastro de estudantes e professores
- Login e validação de credenciais
- Atualização de senhas

**Endpoints Principais:**
- `POST /aluno` - Cadastro de estudante
- `POST /professor` - Cadastro de professor
- `GET /aluno/:email/:senha` - Login de estudante
- `GET /professor/:email/:senha` - Login de professor
- `POST /aluno/atualizar` - Atualização de dados do estudante
- `POST /professor/atualizar` - Atualização de dados do professor

### 3.2 Módulo de Jogos
**Localização**: `public/jogo*/`

**Jogos Disponíveis:**
1. **Jogo da Forca** (`public/jogodaforca/`)
   - Arquivo principal: `jogoForca.js`
   - Palavras pré-definidas
   - Sistema de erros progressivos

2. **Jogo da Memória** (`public/jogodamemoria/`)
   - Cartas com imagens temáticas
   - Sistema de pares

3. **Jogo dos 7 Erros** (`public/jogodos7erros/`)
   - Comparação de imagens
   - Detecção de diferenças

4. **Jogo Complete Palavras** (`public/jogocompletepalavras/`)
   - Completar palavras com letras faltantes

### 3.3 Módulo de Pontuação
**Localização**: `src/app.js` (endpoint `/registrar-pontuacao`)

**Responsabilidades:**
- Registrar pontuações dos jogos
- Atualizar scores existentes
- Consultar histórico de pontuações

**Endpoints:**
- `POST /registrar-pontuacao` - Registra/atualiza pontuação
- `GET /aluno/:jogo` - Consulta pontuações por jogo

### 3.4 Dependências Externas

**Bibliotecas Frontend:**
- Bootstrap CDN (5.1.3)
- Fontes e ícones customizados

**Bibliotecas Backend:**
- bcrypt: Criptografia de senhas
- pg: Driver PostgreSQL
- cors: Habilitação de CORS
- dotenv: Gerenciamento de variáveis de ambiente

---

## 4. Regras de Negócio

### 4.1 Regras Gerais

1. **Cadastro de Usuários:**
   - Email deve ser único no sistema
   - Senhas devem atender critérios mínimos de segurança
   - Estudantes e professores são cadastrados em tabelas separadas

2. **Sistema de Pontuação:**
   - Cada jogo possui ID único (1-4)
   - Pontuações são registradas por estudante/jogo
   - Sistema de upsert: atualiza se existe, insere se não existe

3. **Autenticação:**
   - Login baseado em email e senha
   - Não há sistema de sessão persistente
   - Dados do usuário são retornados após login bem-sucedido

### 4.2 Casos de Uso Principais

**UC01 - Cadastro de Estudante:**
```
Ator: Estudante
Pré-condição: Email não cadastrado
Fluxo:
1. Estudante acessa página de cadastro
2. Preenche nome, email, senha e ID da turma
3. Sistema valida dados
4. Sistema registra no banco
5. Sistema confirma cadastro
```

**UC02 - Jogar e Registrar Pontuação:**
```
Ator: Estudante
Pré-condição: Estudante logado
Fluxo:
1. Estudante seleciona jogo
2. Completa o jogo
3. Sistema calcula pontuação
4. Sistema registra pontuação via API
5. Sistema atualiza localStorage
```

**UC03 - Consultar Desempenho:**
```
Ator: Professor
Pré-condição: Professor logado
Fluxo:
1. Professor acessa relatórios
2. Sistema consulta pontuações por jogo
3. Sistema retorna dados formatados
4. Professor visualiza desempenho dos alunos
```

### 4.3 Restrições e Validações

- **Email**: Deve ser válido e único
- **Senha**: Mínimo de caracteres (validado por password-validator)
- **Pontuação**: Valores numéricos positivos
- **Jogos**: IDs válidos (1-4)
- **Turma**: ID numérico obrigatório

---

## 5. Preparação do Ambiente de Desenvolvimento

### 5.1 Requisitos do Sistema

**Sistema Operacional:**
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+)

**Dependências Obrigatórias:**
- Node.js 16.x ou superior
- npm 8.x ou superior
- PostgreSQL 13+ (ou Docker)
- Git

**Dependências Opcionais:**
- Docker 20.x
- Docker Compose 2.x
- Nodemon (para desenvolvimento)

### 5.2 Instalação de Dependências

1. **Clone o repositório:**
```bash
git clone https://github.com/camilacarvalhon/projetopimpolho.git
cd projetopimpolho
```

2. **Instale as dependências do Node.js:**
```bash
npm install
```

3. **Instale dependências de desenvolvimento (opcional):**
```bash
npm install -g nodemon
```

### 5.3 Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL=postgres://postgres:postgres@localhost:5432/pimpolho
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE=pimpolho
HOST=localhost
DATABASE_PORT=5432

# Servidor
PORT=3000
NODE_ENV=development
```

**Para Produção:**
```env
NODE_ENV=production
DATABASE_URL=sua_url_de_producao_aqui
PORT=3000
```

### 5.4 Configuração do Banco de Dados

**Opção 1 - PostgreSQL Local:**
1. Instale PostgreSQL
2. Crie o banco `pimpolho`
3. Execute o script `init.sql`

```sql
psql -U postgres -c "CREATE DATABASE pimpolho;"
psql -U postgres -d pimpolho -f init.sql
```

**Opção 2 - Docker (Recomendado):**
```bash
docker-compose up db
```

### 5.5 Inicialização do Projeto

**Desenvolvimento:**
```bash
npm run dev
# ou
nodemon src/app.js
```

**Produção:**
```bash
npm start
```

**Com Docker:**
```bash
docker-compose up
```

O servidor estará disponível em: `http://localhost:3000`

---

## 6. Execução e Testes

### 6.1 Como Rodar o Projeto Localmente

**Método 1 - Desenvolvimento Tradicional:**
```bash
# 1. Configurar banco de dados
createdb pimpolho
psql -d pimpolho -f init.sql

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Instalar dependências
npm install

# 4. Executar em modo desenvolvimento
npm run dev
```

**Método 2 - Docker (Recomendado):**
```bash
# Executar todos os serviços
docker-compose up

# Executar em background
docker-compose up -d

# Parar serviços
docker-compose down
```

### 6.2 Scripts de Inicialização

**Scripts disponíveis no package.json:**
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

**Scripts Docker:**
```bash
# Rebuild containers
docker-compose up --build

# Ver logs
docker-compose logs -f

# Executar comandos no container
docker-compose exec app bash
```

### 6.3 Comandos de Testes

**Atualmente o projeto não possui testes automatizados implementados.**

**Testes Manuais Recomendados:**

1. **Teste de Conectividade:**
```bash
curl http://localhost:3000
```

2. **Teste de API - Cadastro:**
```bash
curl -X POST http://localhost:3000/aluno \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@teste.com","senha":"123456","idTurma":1}'
```

3. **Teste de API - Login:**
```bash
curl http://localhost:3000/aluno/teste@teste.com/123456
```

### 6.4 Ferramentas de Testes Sugeridas

**Para implementação futura:**
- **Jest**: Framework de testes unitários
- **Supertest**: Testes de API
- **Cypress**: Testes end-to-end
- **Postman**: Testes manuais de API

**Exemplo de configuração Jest:**
```bash
npm install --save-dev jest supertest
```

---

## 7. Banco de Dados

### 7.1 Estrutura do Banco de Dados

**Sistema de Gerenciamento:** PostgreSQL 13

**Esquema Principal:**
```sql
-- Estudantes
tbAluno (
    idAluno SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    idTurma INTEGER
)

-- Professores
tbProfessor (
    idProfessor SERIAL PRIMARY KEY,
    nomeProf VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    idTurma INTEGER
)

-- Jogos
tbJogo (
    idJogo SERIAL PRIMARY KEY,
    nomeJogo VARCHAR(100) NOT NULL
)

-- Pontuações (Relacionamento N:N)
tbAlunoJogo (
    idAlunoJogo SERIAL PRIMARY KEY,
    idAluno INTEGER REFERENCES tbAluno(idAluno),
    idJogo INTEGER REFERENCES tbJogo(idJogo),
    pontos INTEGER DEFAULT 0
)
```

### 7.2 Scripts de Criação/Migração

**Arquivo:** `init.sql`

```sql
-- Executar para criar estrutura inicial
psql -U postgres -d pimpolho -f init.sql
```

**Dados Iniciais:**
```sql
INSERT INTO tbJogo (nomeJogo) VALUES 
    ('Jogo da Forca'),
    ('Jogo da Memória'),
    ('Jogo dos 7 Erros'),
    ('Jogo Complete Palavras');
```

### 7.3 Entidades Principais e Relacionamentos

```
tbAluno ||--o{ tbAlunoJogo }o--|| tbJogo
tbProfessor (independente)

Relacionamentos:
- Um aluno pode ter múltiplas pontuações (1:N)
- Um jogo pode ter múltiplas pontuações (1:N)
- Aluno-Jogo é uma relação N:N com atributo pontos
```

**Índices Recomendados:**
```sql
CREATE INDEX idx_aluno_email ON tbAluno(email);
CREATE INDEX idx_professor_email ON tbProfessor(email);
CREATE INDEX idx_aluno_jogo ON tbAlunoJogo(idAluno, idJogo);
```

### 7.4 Backup e Restore

**Backup:**
```bash
pg_dump -U postgres pimpolho > backup_pimpolho.sql
```

**Restore:**
```bash
psql -U postgres -d pimpolho < backup_pimpolho.sql
```

**Com Docker:**
```bash
docker-compose exec db pg_dump -U postgres pimpolho > backup.sql
```

---

## 8. Deploy e Ambientes

### 8.1 Ambientes Disponíveis

**Desenvolvimento (Local):**
- URL: `http://localhost:3000`
- Banco: PostgreSQL local ou Docker
- Configuração: `.env` com `NODE_ENV=development`

**Staging/Homologação:**
- Configuração similar à produção
- Banco de dados separado para testes

**Produção:**
- Configuração via variáveis de ambiente
- SSL habilitado para banco de dados
- `NODE_ENV=production`

### 8.2 Pipeline de CI/CD

**Atualmente não implementado. Sugestão de estrutura:**

**GitHub Actions (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - name: Deploy to production
        run: # comandos de deploy
```

### 8.3 Deploy Manual

**Heroku:**
```bash
# Instalar Heroku CLI
heroku create pimpolho-kids
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set NODE_ENV=production
git push heroku main
```

**Docker em Servidor:**
```bash
# No servidor
git clone https://github.com/camilacarvalhon/projetopimpolho.git
cd projetopimpolho
docker-compose -f docker-compose.prod.yml up -d
```

### 8.4 Monitoramento e Logging

**Logs da Aplicação:**
```bash
# Docker
docker-compose logs -f app

# PM2 (sugestão)
pm2 logs pimpolho
```

**Monitoramento Sugerido:**
- **PM2**: Gerenciamento de processos Node.js
- **Winston**: Logging estruturado
- **New Relic**: Monitoramento de performance
- **Sentry**: Tracking de erros

---

## 9. Segurança

### 9.1 Estratégias de Autenticação e Autorização

**Autenticação Atual:**
- Sistema básico de email/senha
- Validação via consulta direta ao banco
- Sem sistema de sessões persistentes

**Melhorias Recomendadas:**
- Implementar JWT (JSON Web Tokens)
- Sistema de refresh tokens
- Rate limiting para tentativas de login
- Validação de força de senha

### 9.2 Criptografia

**Implementação Atual:**
- bcrypt para hash de senhas (parcialmente implementado)
- Código comentado indica intenção de uso

**Configuração Recomendada:**
```javascript
// Implementar hash de senhas
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verificação
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 9.3 Controle de Acesso e Perfis

**Perfis de Usuário:**
- **Estudante**: Acesso aos jogos e próprias pontuações
- **Professor**: Acesso a relatórios e dados dos alunos

**Implementação Atual:**
- Separação por tabelas diferentes
- Sem middleware de autorização

**Melhorias Sugeridas:**
```javascript
// Middleware de autenticação
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    // Validar JWT
}

// Middleware de autorização
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({error: 'Forbidden'});
        }
        next();
    };
}
```

### 9.4 Vulnerabilidades e Proteções

**Vulnerabilidades Identificadas:**
1. SQL Injection: Mitigado pelo uso de queries parametrizadas
2. Senhas em texto plano: Parcialmente resolvido
3. Ausência de rate limiting
4. Falta de validação de entrada robusta
5. CORS muito permissivo

**Proteções Implementadas:**
- Queries parametrizadas (pg)
- CORS habilitado
- Validação básica de entrada

**Proteções Recomendadas:**
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por IP
});

// Helmet para headers de segurança
const helmet = require('helmet');
app.use(helmet());

// Validação de entrada
const { body, validationResult } = require('express-validator');
```

---

## 10. Manutenção e Suporte

### 10.1 Estrutura do Repositório

```
projetopimpolho/
├── src/                    # Código fonte do backend
│   ├── app.js             # Aplicação principal
│   └── auth.js            # Módulo de autenticação
├── public/                # Arquivos estáticos (frontend)
│   ├── assets/           # Imagens, ícones, áudios
│   ├── style/            # Arquivos CSS
│   ├── js/               # JavaScript compartilhado
│   ├── pages/            # Páginas HTML
│   ├── jogodaforca/      # Jogo da Forca
│   ├── jogodamemoria/    # Jogo da Memória
│   ├── jogodos7erros/    # Jogo dos 7 Erros
│   └── jogocompletepalavras/ # Jogo Complete Palavras
├── docker-compose.yml     # Configuração Docker
├── Dockerfile            # Imagem Docker
├── init.sql              # Script de inicialização do BD
├── package.json          # Dependências Node.js
└── README.md             # Esta documentação
```

### 10.2 Convenções de Código e Boas Práticas

**JavaScript:**
- Usar camelCase para variáveis e funções
- Usar PascalCase para construtores
- Indentação: 4 espaços
- Ponto e vírgula obrigatório

**CSS:**
- Usar kebab-case para classes
- Organizar por componentes
- Usar variáveis CSS para cores e medidas

**SQL:**
- Nomes de tabelas em camelCase com prefixo 'tb'
- Campos em camelCase
- Usar UPPERCASE para palavras-chave SQL

**Git:**
- Commits em português
- Mensagens descritivas
- Branches por feature: `feature/nome-da-funcionalidade`

### 10.3 Checklist para Contribuir

**Antes de Contribuir:**
- [ ] Fork do repositório
- [ ] Clone do fork local
- [ ] Criar branch para a feature
- [ ] Configurar ambiente de desenvolvimento

**Durante o Desenvolvimento:**
- [ ] Seguir convenções de código
- [ ] Testar funcionalidades localmente
- [ ] Documentar mudanças significativas
- [ ] Verificar compatibilidade com browsers

**Antes do Pull Request:**
- [ ] Testar com Docker
- [ ] Verificar se não quebrou funcionalidades existentes
- [ ] Atualizar documentação se necessário
- [ ] Commit com mensagens claras

**Pull Request:**
- [ ] Título descritivo
- [ ] Descrição detalhada das mudanças
- [ ] Screenshots se aplicável
- [ ] Referenciar issues relacionadas

### 10.4 Contatos e Responsáveis

**Desenvolvedora Principal:**
- **Nome**: Camila Carvalho
- **GitHub**: [@camilacarvalhon](https://github.com/camilacarvalhon)
- **Repositório**: [projetopimpolho](https://github.com/camilacarvalhon/projetopimpolho)

**Para Suporte:**
- Abrir issue no GitHub
- Descrever problema detalhadamente
- Incluir logs de erro se aplicável
- Especificar ambiente (OS, Node.js version, etc.)

**Para Contribuições:**
- Fork do repositório
- Pull requests são bem-vindos
- Seguir guidelines de contribuição
- Participar das discussões nas issues

---

## 11. Anexos e Referências

### 11.1 Links Úteis

**Documentações Oficiais:**
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Docker Documentation](https://docs.docker.com/)

**Bibliotecas Utilizadas:**
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [pg (node-postgres)](https://node-postgres.com/)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [password-validator](https://www.npmjs.com/package/password-validator)

**Ferramentas de Desenvolvimento:**
- [Nodemon](https://nodemon.io/)
- [Postman](https://www.postman.com/)
- [pgAdmin](https://www.pgadmin.org/)

### 11.2 Glossário de Termos

**API**: Application Programming Interface - Interface de comunicação entre sistemas
**CORS**: Cross-Origin Resource Sharing - Política de compartilhamento de recursos
**JWT**: JSON Web Token - Padrão para tokens de autenticação
**ORM**: Object-Relational Mapping - Mapeamento objeto-relacional
**REST**: Representational State Transfer - Arquitetura para APIs web
**SQL**: Structured Query Language - Linguagem de consulta estruturada
**SSL**: Secure Sockets Layer - Protocolo de segurança
**UUID**: Universally Unique Identifier - Identificador único universal

**Termos do Projeto:**
- **Pimpolho**: Nome da plataforma educacional
- **tbAluno**: Tabela de estudantes no banco de dados
- **tbProfessor**: Tabela de professores no banco de dados
- **tbJogo**: Tabela de jogos disponíveis
- **tbAlunoJogo**: Tabela de relacionamento aluno-jogo com pontuações

### 11.3 Logs de Versão (Changelog)

**Versão 1.0.0 (Atual)**
- ✅ Sistema básico de autenticação
- ✅ Quatro jogos educativos implementados
- ✅ Sistema de pontuação integrado
- ✅ Interface responsiva com Bootstrap
- ✅ Containerização com Docker
- ✅ Banco de dados PostgreSQL

**Próximas Versões (Roadmap):**

**v1.1.0 (Planejado)**
- 🔄 Implementação completa de criptografia de senhas
- 🔄 Sistema de sessões com JWT
- 🔄 Testes automatizados
- 🔄 Melhorias de segurança

**v1.2.0 (Futuro)**
- 📋 Dashboard para professores
- 📋 Relatórios de desempenho
- 📋 Novos jogos educativos
- 📋 Sistema de turmas aprimorado

**v2.0.0 (Visão)**
- 🚀 Migração para arquitetura de microsserviços
- 🚀 API GraphQL
- 🚀 Progressive Web App (PWA)
- 🚀 Sistema de gamificação avançado

### 11.4 Licença

Este projeto está sob a licença ISC. Consulte o arquivo `LICENSE` para mais detalhes.

### 11.5 Agradecimentos

Agradecimentos especiais a todos os contribuidores e à comunidade de desenvolvedores que tornaram este projeto possível.

---

**Última atualização desta documentação:** Dezembro 2024
**Versão da documentação:** 1.0.0
