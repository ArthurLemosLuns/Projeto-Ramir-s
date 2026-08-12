# 🎯 Ramir's Pizzaria Entertainment - Sistema de Login e Cardápio

Um projeto completo de sistema de login integrado com banco de dados SQLite3, desenvolvido com Node.js, Express, HTML, CSS e JavaScript.

## 📋 Funcionalidades

✅ **Autenticação de Usuários**
- Registrar novo usuário
- Login com email e senha
- Validação de dados
- Senhas criptografadas com bcrypt
- Token JWT para sessão

✅ **Dashboard Ramir's Pizzaria**
- Interface responsiva
- Bem-vindo personalizado
- Cards com funcionalidades
- Logout seguro

✅ **Banco de Dados**
- SQLite3 local
- Tabela de usuários
- Timestamps automáticos

## 🚀 Como Usar

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Iniciar o Servidor Backend

```bash
npm start
```

Ou em modo de desenvolvimento (com auto-reload):

```bash
npm run dev
```

Você verá:
```
✅ Servidor rodando em http://localhost:3000
📊 Banco de dados SQLite3 inicializado
✅ Tabela de usuários inicializada
```

### 3️⃣ Abrir o Frontend

Abra a pasta `Front/` no navegador ou use um servidor local:

```bash
# Usando Python 3
python -m http.server 8000

# Ou usando Node.js (http-server)
npx http-server Front -p 8000
```

Acesse: `http://localhost:8000`

## 📁 Estrutura do Projeto

```
/
├── Front/
│   ├── index.html       # Interface de login e dashboard
│   ├── index.css        # Estilos modernos
│   └── index.js         # Lógica do frontend
│
├── Back/
│   ├── server.js        # Servidor Express principal
│   ├── db.js            # Configuração SQLite3
│   └── database.db      # Banco de dados (gerado automaticamente)
│
├── package.json         # Dependências do projeto
└── README.md           # Este arquivo
```

## 🎨 Design

- **Cores**: Gradiente roxo e azul (#667eea → #764ba2)
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Animações**: Transições suaves e agradáveis
- **UX**: Interface limpa e intuitiva

## 🔐 Segurança

- Senhas criptografadas com bcrypt (10 salt rounds)
- Validação de email único
- JWT para autenticação
- Token com expiração de 24 horas
- Proteção contra CORS

## 📊 Testando o Sistema

### Criar um Novo Usuário:
1. Clique em "Registre-se aqui"
2. Preencha: Nome, Email, Senha e Confirmação
3. Clique em "Cadastrar"

### Fazer Login:
1. Use o email e senha cadastrados
2. Será redirecionado para o Dashboard Ramir's Pizzaria

### Logout:
1. Clique em "Sair" no canto superior direito

## 🛠️ Tecnologias

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Database**: SQLite3
- **Segurança**: bcrypt, JWT
- **API**: REST com JSON

## 📝 Variáveis de Ambiente

A chave secreta do JWT está no `server.js`. Para produção, mude para variáveis de ambiente:

```javascript
const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_padrao';
```

## 🚀 Próximas Melhorias

- [ ] Página de perfil do usuário
- [ ] Recuperação de senha
- [ ] Autenticação com Google/GitHub
- [ ] Dashboard com dados reais
- [ ] Sistema de permissões
- [ ] Temas escuro/claro

## 📞 Suporte

Se encontrar algum problema, verifique:
- Se o servidor está rodando na porta 3000
- Se o frontend está acessando `http://localhost:3000/api`
- Se as dependências foram instaladas corretamente

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.

---

**Desenvolvido com ❤️ para Ramir's Pizzaria Entertainment**
