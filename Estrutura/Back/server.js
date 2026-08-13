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
const DELIVERY_API_URL = 'https://nest-api-wzc7.onrender.com';
let cachedDeliveryToken = null;
let cachedDeliveryUser = null;
const deliveryOrders = [];

async function deliveryRequest(path, options = {}) {
    const headers = {};

    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }

    if (options.token) {
        headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(`${DELIVERY_API_URL}${path}`, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    console.log(`[delivery] ${options.method || 'GET'} ${path} -> ${response.status}`);

    const text = await response.text();
    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch (error) {
        data = text;
    }

    return {
        ok: response.ok,
        status: response.status,
        data,
        text
    };
}

async function getDeliveryToken() {
    if (cachedDeliveryToken) {
        return cachedDeliveryToken;
    }

    const deliveryUser = {
        email: process.env.DELIVERY_EMAIL || 'ramirs.delivery@local.test',
        password: process.env.DELIVERY_PASSWORD || 'Delivery@123'
    };

    cachedDeliveryUser = deliveryUser;

    try {
        const loginResponse = await deliveryRequest('/login', {
            method: 'POST',
            body: deliveryUser
        });

        const token = loginResponse.data?.access_token || loginResponse.data?.token || loginResponse.data?.accessToken || loginResponse.data?.data?.access_token || null;

        if (!token) {
            console.warn('[delivery] login sem token:', loginResponse.data);
            return null;
        }

        cachedDeliveryToken = token;
        return token;
    } catch (error) {
        console.error('❌ Erro ao autenticar no delivery:', error.message);
        return null;
    }
}

async function ensureDeliveryRestaurantAndProduct(token) {
    const restaurantsResponse = await deliveryRequest('/restaurants', { token });

    let restaurant = null;
    if (restaurantsResponse.ok) {
        const restaurants = Array.isArray(restaurantsResponse.data)
            ? restaurantsResponse.data
            : restaurantsResponse.data?.data || [];

        restaurant = restaurants.find(item => item?.nome?.toLowerCase().includes('ramir')) || restaurants[0] || null;
    }

    if (!restaurant) {
        const createRestaurantResponse = await deliveryRequest('/restaurants', {
            method: 'POST',
            token,
            body: {
                nome: 'Ramir\'s Pizzaria',
                endereco: 'Rua das Pizzas, 100',
                telefone: '(11) 99999-9999',
                descricao: 'Delivery da pizzaria Ramir\'s'
            }
        });

        if (!createRestaurantResponse.ok) {
            throw new Error(createRestaurantResponse.text || 'Não foi possível criar o restaurante no delivery');
        }

        restaurant = createRestaurantResponse.data;
    }

    const productsResponse = await deliveryRequest(`/products/restaurant/${restaurant.id}`, { token });
    let product = null;

    if (productsResponse.ok) {
        const products = Array.isArray(productsResponse.data)
            ? productsResponse.data
            : productsResponse.data?.data || [];

        product = products.find(item => item?.nome?.toLowerCase().includes('combo')) || products[0] || null;
    }

    if (!product) {
        const createProductResponse = await deliveryRequest('/products', {
            method: 'POST',
            token,
            body: {
                nome: 'Combo Ramir\'s',
                descricao: 'Pizza + bebida para entrega',
                preco: 39.9,
                imagemUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
                restaurantId: restaurant.id
            }
        });

        if (!createProductResponse.ok) {
            throw new Error(createProductResponse.text || 'Não foi possível criar o produto no delivery');
        }

        product = createProductResponse.data;
    }

    return {
        restaurantId: restaurant.id,
        productId: product.id
    };
}

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

app.post('/api/delivery/order', async (req, res) => {
    const { address, note, items } = req.body;

    if (!address || !address.trim()) {
        return res.status(400).json({ message: 'Informe o endereço de entrega.' });
    }

    const orderDraft = {
        id: Date.now(),
        address: address.trim(),
        note: note?.trim() || 'Pedido feito pelo site Ramir\'s.',
        items: Array.isArray(items) && items.length > 0 ? items : [{ productId: 1, quantidade: 1 }],
        status: 'recebido'
    };

    deliveryOrders.push(orderDraft);

    try {
        const token = await getDeliveryToken();
        if (token) {
            const { restaurantId, productId } = await ensureDeliveryRestaurantAndProduct(token);

            const orderItems = Array.isArray(items) && items.length > 0
                ? items.map(item => ({
                    productId: item.productId || productId,
                    quantidade: item.quantidade || 1
                }))
                : [{ productId, quantidade: 1 }];

            const orderPayload = {
                restaurantId,
                enderecoEntrega: address.trim(),
                observacao: note?.trim() || 'Pedido feito pelo site Ramir\'s.',
                items: orderItems
            };

            const orderResponse = await deliveryRequest('/orders', {
                method: 'POST',
                token,
                body: orderPayload
            });

            if (orderResponse.ok) {
                orderDraft.status = 'enviado-para-delivery';
                return res.json({
                    message: 'Pedido enviado com sucesso para delivery!',
                    order: orderResponse.data,
                    localOrder: orderDraft
                });
            }

            console.warn('[delivery] falha no envio externo:', orderResponse.data || orderResponse.text);
        }

        return res.json({
            message: 'Pedido recebido pelo site e registrado para entrega. O envio para a API externa será revisado em seguida.',
            localOrder: orderDraft
        });
    } catch (error) {
        return res.json({
            message: 'Pedido recebido pelo site e registrado para entrega.',
            localOrder: orderDraft,
            warning: error.message
        });
    }
});

app.get('/api/delivery/orders', (req, res) => {
    res.json(deliveryOrders);
});

// Rota principal - Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front/home.html'));
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
