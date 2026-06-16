const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../Front')));

const SECRET_KEY = 'sua_chave_secreta_muito_segura_2026';

// ===== ROTAS DE AUTENTICAÇÃO =====

// Registro
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Validação
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    try {
        // Verificar se usuário já existe
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao verificar usuário' });
            }
            
            if (user) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }
            
            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Inserir usuário
            db.run(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword],
                function(err) {
                    if (err) {
                        return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
                    }
                    
                    res.status(201).json({ 
                        message: 'Usuário cadastrado com sucesso',
                        user: { id: this.lastID, name, email }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Validação
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    
    try {
        // Buscar usuário
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao buscar usuário' });
            }
            
            if (!user) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }
            
            // Comparar senhas
            const isValid = await bcrypt.compare(password, user.password);
            
            if (!isValid) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }
            
            // Gerar token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, name: user.name },
                SECRET_KEY,
                { expiresIn: '24h' }
            );
            
            res.json({ 
                message: 'Login realizado com sucesso',
                token,
                user: { id: user.id, name: user.name, email: user.email }
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// ===== ROTAS DE RECUPERAÇÃO DE SENHA =====

// Verificar se email existe
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório' });
    }
    
    try {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao buscar usuário' });
            }
            
            if (!user) {
                return res.status(404).json({ message: 'Email não encontrado' });
            }
            
            res.json({ message: 'Email encontrado. Você pode resetar sua senha.' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Resetar senha
app.put('/api/auth/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email e nova senha são obrigatórios' });
    }
    
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres' });
    }
    
    try {
        // Verificar se usuário existe
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao buscar usuário' });
            }
            
            if (!user) {
                return res.status(404).json({ message: 'Email não encontrado' });
            }
            
            // Hash da nova senha
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            // Atualizar senha
            db.run(
                'UPDATE users SET password = ? WHERE email = ?',
                [hashedPassword, email],
                (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Erro ao resetar senha' });
                    }
                    
                    res.json({ message: 'Senha alterada com sucesso! Faça login com sua nova senha.' });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Rota de teste
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front/index.html'));
});

// Rota de teste - simple ping
app.get('/api/ping', (req, res) => {
    res.json({ message: 'Servidor está respondendo! ✅' });
});

// ===== INICIAR SERVIDOR =====
const PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`✅ Servidor rodando em http://127.0.0.1:${PORT}`);
    console.log(`📊 Banco de dados SQLite3 inicializado`);
});

module.exports = app;
