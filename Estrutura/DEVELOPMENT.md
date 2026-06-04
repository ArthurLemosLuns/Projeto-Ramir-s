# 👨‍💻 Guia de Desenvolvimento - Marlons

## 📚 Aprendizados Principais

Este projeto combina:

1. **Frontend Responsivo** - HTML/CSS/JS vanilla
2. **Backend REST** - Node.js + Express
3. **Segurança** - bcrypt + JWT
4. **Banco de Dados** - SQLite3

---

## 🔧 Tips de Desenvolvimento

### ✅ Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar servidor
npm start

# Modo desenvolvimento (auto-reload)
npm run dev

# Servir frontend
python -m http.server 8000 -d Front

# Ver processos Node
lsof -i :3000

# Matar processo na porta 3000
kill -9 $(lsof -t -i:3000)
```

---

### 🎯 Estrutura de Pastas Expandida

Conforme o projeto cresce:

```
Projeto-Ainda-sem-Nome/
│
├── Front/
│   ├── pages/                  # Páginas futuras
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   └── profile.html
│   ├── css/                    # Organizando estilos
│   │   ├── login.css
│   │   ├── dashboard.css
│   │   └── common.css
│   ├── js/                     # Organizando scripts
│   │   ├── auth.js             # Lógica de autenticação
│   │   ├── api.js              # Chamadas API
│   │   └── utils.js            # Funções utilitárias
│   ├── img/                    # Imagens
│   └── index.html
│
├── Back/
│   ├── routes/                 # Rotas organizadas
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── dashboard.js
│   ├── middleware/             # Middlewares
│   │   ├── auth.js             # Verificar JWT
│   │   └── errorHandler.js
│   ├── controllers/            # Lógica de negócio
│   │   └── authController.js
│   ├── server.js
│   ├── db.js
│   └── database.db
│
├── tests/                      # Testes
│   ├── auth.test.js
│   └── api.test.js
│
└── docs/                       # Documentação
    ├── API.md
    ├── DATABASE.md
    └── SETUP.md
```

---

## 🔐 Melhorias de Segurança

### 1. Middleware de Autenticação

**Back/middleware/auth.js:**
```javascript
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, 'sua_chave_secreta', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
```

### 2. Variáveis de Ambiente

**Instalar dotenv:**
```bash
npm install dotenv
```

**.env:**
```
SECRET_KEY=sua_chave_super_secreta
DATABASE_PATH=./Back/database.db
PORT=3000
NODE_ENV=development
```

**Back/server.js:**
```javascript
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
```

### 3. HTTPS em Produção

```javascript
const https = require('https');
const fs = require('fs');

if (process.env.NODE_ENV === 'production') {
    const options = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    };
    https.createServer(options, app).listen(PORT);
}
```

---

## 🎨 Customizações Frontend

### Temas Personalizados

```css
/* Tema Escuro */
@media (prefers-color-scheme: dark) {
    body {
        background: #1a1a1a;
        color: #fff;
    }
}

/* Tema Rosa (Alternativo) */
:root {
    --primary-color: #ff6b9d;
    --secondary-color: #c44569;
}
```

### Notificações Toast

```javascript
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}
```

---

## 📦 Deploy Checklist

- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS habilitado
- [ ] Banco de dados backupado
- [ ] CORS configurado para domínio
- [ ] Rate limiting implementado
- [ ] Logs configurados
- [ ] Monitoramento ativo
- [ ] Backup automático BD

---

## 🚀 Plataformas de Deploy

### Heroku
```bash
heroku login
heroku create nome-app
heroku config:set SECRET_KEY=seu_secret
git push heroku main
```

### Railway
```bash
railway login
railway init
railway up
```

### Vercel (Frontend apenas)
```bash
npm install -g vercel
vercel
```

---

## 🧪 Testando a API com cURL

```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@test.com","password":"123456"}'
```

---

## 📊 Monitoramento

### Logs Estruturados

```javascript
const log = (level, msg, data = {}) => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message: msg,
        ...data
    }));
};

log('INFO', 'Login successful', { userId: 123 });
log('ERROR', 'Database error', { error: err.message });
```

---

## 🔄 CI/CD com GitHub Actions

**.github/workflows/test.yml:**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npm run build
```

---

## 📱 Responsividade

Já está configurada! Mas aqui estão os breakpoints:

```css
/* Mobile */
@media (max-width: 600px) { }

/* Tablet */
@media (601px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

---

## 🎓 Recursos de Aprendizado

- [Express.js Docs](https://expressjs.com/)
- [SQLite3 Docs](https://www.sqlite.org/docs.html)
- [JWT Introduction](https://jwt.io/introduction)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

## ❓ FAQ

**P: Como adicionar mais usuários?**
A: Através do formulário de registro na interface, ou direto no BD com SQL.

**P: Como resetar o banco de dados?**
A: Delete o arquivo `Back/database.db` e reinicie o servidor.

**P: Posso usar outro banco de dados?**
A: Sim! Substitua SQLite3 por PostgreSQL, MySQL, MongoDB, etc.

**P: Como proteger rotas?**
A: Use middleware de autenticação antes de acessar dados sensíveis.

**P: Preciso de HTTPS?**
A: Sim! Essencial em produção. Use Let's Encrypt grátis.

---

## 🤝 Contribuindo

1. Faça um fork
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Verifique o terminal do servidor
3. Verifique as conexões de rede
4. Leia o README.md
5. Consulte ARCHITECTURE.md

---

**Happy Coding! 🚀 Marlons - 2026**
