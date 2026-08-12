# ⚡ Quick Start - Ramir's Pizzaria Entertainment

## ✨ Começar em 3 passos!

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar servidor backend
```bash
npm start
```

Esperado:
```
✅ Servidor rodando em http://localhost:3000
📊 Banco de dados SQLite3 inicializado
✅ Tabela de usuários inicializada
```

### 3. Iniciar servidor frontend (em outro terminal)
```bash
# Opção 1: Com Python
python -m http.server 8000 -d Front

# Opção 2: Com Node
npx http-server Front -p 8000
```

Acesse: **http://localhost:8000**

---

## 🧪 Testar o Sistema

### 📝 Criar Conta:
1. Clique em "Registre-se aqui"
2. Preencha os campos
3. Clique em "Cadastrar"

### 🔓 Fazer Login:
1. Use seus dados cadastrados
2. ✅ Será redirecionado para **Dashboard Ramir's Pizzaria**

### 🚪 Sair:
1. Clique em "Sair" no topo direito

---

## 🐛 Problemas Comuns?

| Erro | Solução |
|------|---------|
| "Erro ao conectar com o servidor" | Verifique se backend está em http://localhost:3000 |
| "Porta já em uso" | Mude a porta no `server.js` ou fecha outro processo |
| "Módulo não encontrado" | Execute `npm install` novamente |

---

## 📂 Arquivos Principais

- **Front/index.html** - Interface de login
- **Front/index.js** - Lógica frontend
- **Front/index.css** - Estilos
- **Back/server.js** - Servidor backend
- **Back/db.js** - Banco de dados SQLite3

---

**Pronto! Seu sistema está funcionando! 🎉**
