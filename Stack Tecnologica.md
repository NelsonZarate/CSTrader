# ⚙️ Stack Tecnológica e Estrutura do Projeto (MVP Trade de Skins)

Este documento detalha o conjunto de tecnologias e a organização do código para o desenvolvimento do Produto Mínimo Viável (MVP) do nosso marketplace de skins.

## 1. 💻 Stack Tecnológica Escolhida

| Camada | Tecnologia | Dependências Chave | Finalidade |
| :--- | :--- | :--- | :--- |
| **Frontend** | HTML, CSS, JavaScript Puro | N/A | Desenvolvimento rápido sem frameworks, focado na lógica Vanilla JS. |
| **Backend Framework** | **Python (FastAPI)** | `fastapi`, `pydantic` | Framework moderno e de alta performance para construir a API REST. |
| **Servidor API** | **Uvicorn** | `uvicorn` | Servidor ASGI de produção necessário para executar o FastAPI. |
| **Gerenciamento Python** | **Poetry** | `pyproject.toml`, `poetry.lock` | Gestão de dependências e ambiente virtual para o Python. |
| **Banco de Dados** | **PostgreSQL** | `psycopg2-binary` | Robusto para dados transacionais (saldos, preços de skins). |
| **ORM / Migrações** | SQLAlchemy / Alembic | `SQLAlchemy`, `alembic` | Gerenciamento de persistência e evolução do esquema do DB. |
| **Segurança** | JWT / Passlib | `PyJWT`, `passlib[bcrypt]` | Autenticação (Tokens) e hashing seguro de passwords. |
| **Infraestrutura** | Docker Compose, Nginx | `docker-compose.yml`, `nginx.conf` | Containerização e *Reverse Proxy* para servir a aplicação. |
| **Ambiente Dev** | **DevContainer (VS Code)** | `.devcontainer/` | Padroniza o ambiente de codificação e integra-se com o Docker Compose. |

---

## 2. 🏗️ Estrutura de Diretórios do Repositório (Visualização Otimizada)

O projeto está organizado em três áreas principais de código (`backend`, `frontend`) e uma área de ferramentas de ambiente.

### 2.1. ⚙️ Ficheiros na Raiz do Projeto

| Ficheiro / Pasta | Propósito |
| :--- | :--- |
| **`.devcontainer/`** | Pasta com a configuração do ambiente de desenvolvimento no VS Code. |
| **`backend/`** | Contém o código da API em Python/FastAPI. |
| **`frontend/`** | Contém o código de interface do utilizador (HTML/CSS/JS). |
| **`docker-compose.yml`** | Define e liga os três serviços (API, DB, Web) no Docker. |
| **`Dockerfile.backend`** | Instruções para o Docker construir a imagem do serviço `api` usando o Poetry. |
| **`nginx.conf`** | Configura o Nginx para servir o frontend e encaminhar chamadas para o backend. |
| **`README.md`** | O guia principal de inicialização, execução e *deploy*. |
| **`STACK.md`** | **Este Ficheiro.** |

### 2.2. 🐍 Conteúdo do `backend/` (API)

| Ficheiro / Pasta | Propósito |
| :--- | :--- |
| `app.py` | Ponto de entrada da aplicação FastAPI e definição das rotas principais. |
| `models.py` | Definição dos modelos de dados (tabelas) do SQLAlchemy. |
| `config.py` | Ficheiro para variáveis de configuração e constantes da aplicação. |
| `pyproject.toml` | Lista de dependências e metadados do projeto (gerido pelo Poetry). |
| `poetry.lock` | Registo exato e fixo de todas as dependências instaladas. |
| `.env.example` | Template para as variáveis de ambiente sensíveis (ex: DB URL, Chave JWT). |
| `alembic.ini` | Ficheiro de configuração para o gerenciador de migrações. |
| `migrations/` | Pasta onde o Alembic armazena os scripts de alteração da base de dados. |

### 2.3. 🖼️ Conteúdo do `frontend/` (Interface)

| Ficheiro / Pasta | Propósito |
| :--- | :--- |
| `index.html` | A página inicial da aplicação (inclui Login, Registo e o Market). |
| `css/style.css` | Folha de estilos principal da aplicação. |
| `js/main.js` | Lógica de interação, manipulação do DOM e chamadas assíncronas (`fetch`) à API. |