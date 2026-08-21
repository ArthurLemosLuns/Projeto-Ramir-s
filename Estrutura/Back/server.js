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
const DELIVERY_ORDER_SUCCESS_MESSAGE = "Pedido finalizado e enviado para a Ramir's! Obrigado pela escolha de nossos serviços.";
const ORDER_STATUSES = ['Sendo preparados', 'Mandados', 'Entregues'];
let cachedDeliveryToken = null;
let cachedDeliveryUser = null;

// ===== MIDDLEWARE DE AUTENTICAÇÃO =====
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de acesso não fornecido' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado' });
        }
        req.user = user;
        next();
    });
}

// Middleware de acesso exclusivo a administradores
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso restrito a administradores' });
    }
    next();
}

// ===== INTEGRAÇÃO COM API EXTERNA DE DELIVERY =====
async function deliveryRequest(path, options = {}) {
    const headers = {};

    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }

    if (options.token) {
        headers['Authorization'] = `Bearer ${options.token}`;
    }

    // Timeout de 15s para não travar o servidor caso a API externa esteja lenta/fora do ar
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(`${DELIVERY_API_URL}${path}`, {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
            signal: controller.signal
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
    } finally {
        clearTimeout(timeoutId);
    }
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

// Encaminha o pedido à API externa em segundo plano (não bloqueia a resposta ao cliente)
async function forwardOrderToExternalDelivery(orderId, items, address, note) {
    try {
        const token = await getDeliveryToken();
        if (!token) {
            console.warn(`[delivery] pedido #${orderId} sem token externo; envio ignorado`);
            return;
        }

        const { restaurantId, productId } = await ensureDeliveryRestaurantAndProduct(token);

        const orderItems = Array.isArray(items) && items.length > 0
            ? items.map(item => ({
                productId: item.productId || productId,
                quantidade: item.quantidade || 1
            }))
            : [{ productId, quantidade: 1 }];

        const orderResponse = await deliveryRequest('/orders', {
            method: 'POST',
            token,
            body: {
                restaurantId,
                enderecoEntrega: address,
                observacao: note?.trim() || 'Pedido feito pelo site Ramir\'s.',
                items: orderItems
            }
        });

        if (orderResponse.ok) {
            console.log(`[delivery] pedido #${orderId} encaminhado à API externa com sucesso`);
        } else {
            console.warn(`[delivery] falha ao encaminhar pedido #${orderId}:`, orderResponse.data || orderResponse.text);
        }
    } catch (error) {
        console.warn(`[delivery] erro ao encaminhar pedido #${orderId}:`, error.message);
    }
}

// ===== ROTAS DE AUTENTICAÇÃO =====

// Registro
app.post('/api/auth/register', async (req, res) => {
    const { name, username, email, password } = req.body;

    // Validação
    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (username.trim().length < 3) {
        return res.status(400).json({ message: 'O nome de usuário deve ter no mínimo 3 caracteres' });
    }

    try {
        // Verificar se email já existe
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao verificar usuário' });
            }

            if (user) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            // Verificar se nome de usuário já existe
            db.get('SELECT * FROM users WHERE username = ?', [username.trim()], async (err2, userByName) => {
                if (err2) {
                    return res.status(500).json({ message: 'Erro ao verificar usuário' });
                }

                if (userByName) {
                    return res.status(400).json({ message: 'Nome de usuário já cadastrado' });
                }

                // Hash da senha
                const hashedPassword = await bcrypt.hash(password, 10);

                // Inserir usuário
                db.run(
                    "INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, 'user')",
                    [name, username.trim(), email, hashedPassword],
                    function(err3) {
                        if (err3) {
                            return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
                        }

                        res.status(201).json({
                            message: 'Usuário cadastrado com sucesso',
                            user: { id: this.lastID, name, username: username.trim(), email }
                        });
                    }
                );
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Login (aceita email OU nome de usuário)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Validação
    if (!email || !password) {
        return res.status(400).json({ message: 'Email/nome de usuário e senha são obrigatórios' });
    }

    try {
        // Buscar usuário por email ou username
        db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, email], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao buscar usuário' });
            }

            if (!user) {
                return res.status(401).json({ message: 'Email/usuário ou senha incorretos' });
            }

            // Comparar senhas
            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) {
                return res.status(401).json({ message: 'Email/usuário ou senha incorretos' });
            }

            const role = user.role || 'user';

            // Gerar token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, name: user.name, username: user.username || null, role },
                SECRET_KEY,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login realizado com sucesso',
                token,
                user: { id: user.id, name: user.name, username: user.username || null, email: user.email, role }
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

// ===== ROTAS DE DELIVERY =====

// Finalizar pedido: salva no banco imediatamente e responde na hora.
// O envio à API externa acontece em segundo plano, sem travar o cliente.
app.post('/api/delivery/order', (req, res) => {
    const { address, note, items, total, customerName, customerEmail } = req.body;

    if (!address || !address.trim()) {
        return res.status(400).json({ message: 'Informe o endereço de entrega.' });
    }

    const orderItems = Array.isArray(items) && items.length > 0 ? items : [];
    const orderTotal = typeof total === 'number'
        ? total
        : orderItems.reduce((sum, item) => sum + (Number(item.valor) || 0), 0) + 8.00;

    db.run(
        `INSERT INTO orders (customer_name, customer_email, address, note, items, total, status)
         VALUES (?, ?, ?, ?, ?, ?, 'Sendo preparados')`,
        [
            customerName?.trim() || 'Cliente',
            customerEmail?.trim() || null,
            address.trim(),
            note?.trim() || null,
            JSON.stringify(orderItems),
            orderTotal
        ],
        function (err) {
            if (err) {
                console.error('❌ Erro ao salvar pedido:', err.message);
                return res.status(500).json({ message: 'Erro ao registrar o pedido. Tente novamente.' });
            }

            const orderId = this.lastID;

            // Resposta imediata ao cliente
            res.status(201).json({
                message: DELIVERY_ORDER_SUCCESS_MESSAGE,
                orderId
            });

            // Encaminhamento à API externa em segundo plano
            forwardOrderToExternalDelivery(orderId, orderItems, address.trim(), note);
        }
    );
});

// Lista pedidos (compatibilidade)
app.get('/api/delivery/orders', (req, res) => {
    db.all('SELECT * FROM orders ORDER BY created_at DESC, id DESC', (err, orders) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar pedidos' });
        }
        res.json(orders.map(order => ({ ...order, items: JSON.parse(order.items || '[]') })));
    });
});

// ===== ROTAS DO PAINEL ADMINISTRATIVO =====

// Estatísticas + lista de pedidos
app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => {
    db.all('SELECT * FROM orders ORDER BY created_at DESC, id DESC', (err, orders) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar pedidos' });
        }

        const parsed = orders.map(order => ({
            ...order,
            items: JSON.parse(order.items || '[]')
        }));

        const stats = {
            total: parsed.length,
            'Sendo preparados': parsed.filter(o => o.status === 'Sendo preparados').length,
            'Mandados': parsed.filter(o => o.status === 'Mandados').length,
            'Entregues': parsed.filter(o => o.status === 'Entregues').length
        };

        res.json({ stats, orders: parsed });
    });
});

// Alterar status de um pedido (livre entre os 3 status)
app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
        return res.status(400).json({ message: `Status inválido. Use um dos: ${ORDER_STATUSES.join(', ')}` });
    }

    db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        res.json({ message: `Pedido #${id} atualizado para "${status}"`, id: Number(id), status });
    });
});

// Listar estoque
app.get('/api/admin/stock', authenticateToken, requireAdmin, (req, res) => {
    db.all('SELECT * FROM stock ORDER BY tipo, categoria, tamanho', (err, stock) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar estoque' });
        }
        res.json(stock);
    });
});

// Ajustar quantidade de um item do estoque
app.put('/api/admin/stock/:id', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { quantidade } = req.body;

    const qty = parseInt(quantidade, 10);
    if (isNaN(qty) || qty < 0) {
        return res.status(400).json({ message: 'Quantidade inválida' });
    }

    db.run('UPDATE stock SET quantidade = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [qty, id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Erro ao atualizar estoque' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Produto não encontrado no estoque' });
        }
        res.json({ message: 'Estoque atualizado', id: Number(id), quantidade: qty });
    });
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