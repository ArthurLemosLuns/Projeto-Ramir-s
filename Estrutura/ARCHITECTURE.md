# 🏗️ Arquitetura do Projeto Ramir's Pizzaria Entertainment

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Front/)                    │
│  HTML5 → CSS3 → JavaScript Vanilla (localStorage)      │
│  Responsivo | Gradiente Roxo/Azul | Animações         │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/JSON
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (Back/)                      │
│  Node.js + Express.js + CORS                           │
│  Rotas: /api/auth/register | /api/auth/login          │
└────────────────────┬────────────────────────────────────┘
                     │ SQL Queries
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite3)                   │
│  database.db → Tabela: users                           │
│  (id, name, email, password, created_at, updated_at)   │
└─────────────────────────────────────────────────────────┘
```

## 🗂️ Estrutura de Arquivos

```
Projeto-Ainda-sem-Nome/
│
├── Front/                          # 📱 Frontend
│   ├── index.html                 # Página única (SPA)
│   ├── index.css                  # Estilos responsivos
│   └── index.js                   # Lógica e comunicação com API
│
├── Back/                          # 🔌 Backend
│   ├── server.js                  # Express app + rotas
│   ├── db.js                      # Configuração SQLite3
│   └── database.db                # [Gerado] Banco de dados
│
├── package.json                   # Dependências do projeto
├── .gitignore                     # Arquivos ignorados
├── README.md                      # Documentação completa
├── QUICK_START.md                 # Guia rápido
├── ARCHITECTURE.md                # Este arquivo
└── node_modules/                  # [Gerado] Dependências

```

## 🔄 Fluxo de Autenticação

### 1️⃣ Registro (POST /api/auth/register)

```
Cliente                              Servidor
   │                                    │
   ├─► { name, email, password }       │
   │                                    │
   │                         ┌─────────────────┐
   │                         │ Validar entrada │
   │                         │ Criptografar    │
   │                         │ Buscar por email│
   │                         └────────┬────────┘
   │                                  │
   │                         ┌────────▼──────────┐
   │                         │ INSERT users DB   │
   │                         └────────┬──────────┘
   │                                  │
   │◄─ { message, user }             │
   │                                 │
```

**Validações:**
- Email único
- Senha mínimo 6 caracteres
- Campos obrigatórios

---

### 2️⃣ Login (POST /api/auth/login)

```
Cliente                              Servidor
   │                                    │
   ├─► { email, password }             │
   │                                    │
   │                         ┌─────────────────┐
   │                         │ SELECT user DB  │
   │                         │ Comparar senha  │
   │                         │ Gerar JWT Token │
   │                         └────────┬────────┘
   │                                  │
   │◄─ { token, user, message }      │
   │                                 │
   │ Armazenar em localStorage        │
   ├─ localStorage.setItem('token')   │
   ├─ localStorage.setItem('userName')│
   │                                 │
   │ Redirecionar Dashboard           │
```

**Validações:**
- Email existe
- Senha correta
- Gera JWT com expiração 24h

---

## 🛡️ Segurança Implementada

| Aspecto | Implementação |
|--------|--------------|
| **Senhas** | bcrypt (10 salt rounds) |
| **Autenticação** | JWT com 24h expiração |
| **Armazenamento** | localStorage no cliente |
| **Comunicação** | HTTPS ready (CORS configurado) |
| **Email Único** | Constraint SQL UNIQUE |
| **Validação** | Frontend + Backend |

---

## 📝 Endpoints da API

### 1. **POST /api/auth/register**

Registrar novo usuário

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "message": "Usuário cadastrado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

**Erros:**
- `400`: Campos obrigatórios faltando
- `400`: Email já cadastrado
- `500`: Erro no servidor

---

### 2. **POST /api/auth/login**

Fazer login

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

**Erros:**
- `400`: Email ou senha obrigatórios
- `401`: Email ou senha incorretos
- `500`: Erro no servidor

---

### 3. **GET /**

Health check do servidor

**Response:**
```json
{
  "message": "Servidor rodando! 🚀"
}
```

---

## 💾 Estrutura do Banco de Dados

### Tabela: `users`

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id`: Identificador único (chave primária)
- `name`: Nome do usuário
- `email`: Email único (constraint UNIQUE)
- `password`: Senha criptografada com bcrypt
- `created_at`: Timestamp de criação
- `updated_at`: Timestamp de atualização

---

## 🎯 Fluxo Frontend

```javascript
// 1. Página carrega
DOMContentLoaded
    ↓
Verificar localStorage para token
    ↓
┌─────────────┬──────────────┐
│ Token existe│ Sem token    │
│             │              │
│ Mostrar     │ Mostrar      │
│ Dashboard   │ Login        │
└─────────────┴──────────────┘

// 2. Usuário faz login
Submeter formulário
    ↓
Validação local (email, senha)
    ↓
POST /api/auth/login
    ↓
┌─────────────┬──────────────┐
│ Sucesso     │ Erro         │
│             │              │
│ Armazenar   │ Mostrar      │
│ token+user  │ mensagem     │
│ Ir dashboard│              │
└─────────────┴──────────────┘

// 3. Logout
Clique "Sair"
    ↓
Remover localStorage
    ↓
Recarregar página
    ↓
Voltar para login
```

---

## ⚙️ Variáveis de Configuração

### Backend (server.js)

```javascript
const SECRET_KEY = 'sua_chave_secreta_muito_segura_2026'; // JWT Secret
const PORT = 3000; // Porta do servidor
```

### Frontend (index.js)

```javascript
const API_URL = 'http://localhost:3000/api'; // URL da API
```

---

## 🚀 Como Expandir o Projeto

### ➕ Adicionar Nova Rota

1. **Backend (Back/server.js):**
```javascript
app.get('/api/users/profile', authenticateToken, (req, res) => {
    // Lógica aqui
});
```

2. **Frontend (Front/index.js):**
```javascript
const response = await fetch(`${API_URL}/users/profile`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
```

### ➕ Adicionar Novo Campo no Banco

1. Editar [Back/db.js](Back/db.js)
2. Adicionar coluna na tabela
3. Reiniciar servidor

---

## 📈 Performance & Otimizações

- ✅ CSS minificado (pronto para compressão)
- ✅ JavaScript vanilla (sem framework overhead)
- ✅ Lazy loading pronto
- ✅ CORS configurado
- ✅ Tokens JWT em vez de sessões

---

## 🐛 Debugging

**Ver logs do servidor:**
```bash
npm start
```

**Ver Network no navegador:**
- F12 → Network → Aba XHR
- Observar requisições e respostas

**Verificar localStorage:**
```javascript
console.log(localStorage);
console.log(localStorage.getItem('token'));
```

---

## 📚 Tecnologias Usadas

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | HTML5 | - |
| | CSS3 | - |
| | JavaScript | ES6+ |
| **Backend** | Node.js | 18+ |
| | Express.js | 4.18.2 |
| | CORS | 2.8.5 |
| **Segurança** | bcrypt | 5.1.0 |
| | JWT | 9.0.0 |
| **Banco** | SQLite3 | 6.0.1 |

---

## 🎓 Próximos Passos

1. **Adicionar Middleware de Autenticação**
   - Proteger rotas com JWT
   - Criar arquivo `middleware/auth.js`

2. **Dashboard Interativo**
   - Fetch dados do servidor
   - CRUD operations

3. **Deploy**
   - Heroku ou Vercel
   - Variáveis de ambiente

4. **Testes**
   - Jest para testes unitários
   - Postman para API testing

---

**Documento atualizado em 04/06/2026**
