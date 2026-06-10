const API_URL = 'http://localhost:3000/api';

const menuItems = [
    {
        name: 'Margherita Suprema',
        description: 'Molho de tomate especial, mussarela fresca, manjericão e toque de azeite aromático.',
        price: 'R$ 49,90',
        tags: ['Clássica', 'Vegetariana']
    },
    {
        name: 'Pepperoni do Chef',
        description: 'Fatias generosas de pepperoni, queijo extra e borda crocante dourada.',
        price: 'R$ 59,90',
        tags: ['Apimentada', 'Favorita']
    },
    {
        name: 'Quatro Queijos Art',
        description: 'Mussarela, provolone, gorgonzola e parmesão com mel trufado opcional.',
        price: 'R$ 64,90',
        tags: ['Cremosa', 'Premium']
    },
    {
        name: 'Frango com Catupiry',
        description: 'Frango desfiado, catupiry, milho doce e cebola crocante para uma explosão de sabor.',
        price: 'R$ 57,90',
        tags: ['Clássica', 'Saborosa']
    }
];

const drinkItems = [
    {
        name: 'Refrigerante Gelado',
        description: 'Coca-Cola, Guaraná ou Fanta em tamanho 350ml.',
        price: 'R$ 9,90',
        tags: ['Refrescante', 'Clássica']
    },
    {
        name: 'Suco Natural',
        description: 'Laranja, abacaxi ou maracujá preparado na hora com toque de hortelã.',
        price: 'R$ 12,90',
        tags: ['Natural', 'Saudável']
    },
    {
        name: 'Drink Sem Álcool',
        description: 'Mocktail de frutas vermelhas com água com gás e um twist cítrico.',
        price: 'R$ 16,90',
        tags: ['Especial', 'Festivo']
    },
    {
        name: 'Chá Gelado Gourmet',
        description: 'Chá de hibisco com limão e geleia de pêssego.',
        price: 'R$ 11,90',
        tags: ['Elegante', 'Refrescante']
    }
];

function toggleRegister() {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    loginSection.style.display = loginSection.style.display === 'none' ? 'flex' : 'none';
    registerSection.style.display = registerSection.style.display === 'none' ? 'flex' : 'none';

    document.getElementById('message').textContent = '';
    document.getElementById('register-message').textContent = '';
    document.getElementById('message').className = 'message';
    document.getElementById('register-message').className = 'message';
}

function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    const drinksGrid = document.getElementById('drinks-grid');

    if (menuGrid) {
        menuGrid.innerHTML = menuItems.map(item => {
            const tags = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            return `
                <article class="menu-card">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="price">${item.price}</div>
                    <div class="tags">${tags}</div>
                </article>
            `;
        }).join('');
    }

    if (drinksGrid) {
        drinksGrid.innerHTML = drinkItems.map(item => {
            const tags = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            return `
                <article class="menu-card">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="price">${item.price}</div>
                    <div class="tags">${tags}</div>
                </article>
            `;
        }).join('');
    }
}

function showDashboard(userName) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('user-name').textContent = `Olá, ${userName}!`;
    renderMenu();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM Carregado - Inicializando Ramir\'s Pizzaria Entertainment');

    fetch(`${API_URL}/ping`)
        .then(res => res.json())
        .then(data => console.log('🟢 Conexão com servidor OK:', data))
        .catch(err => console.error('🔴 Erro ao conectar com servidor:', err));

    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    if (token && userName) {
        showDashboard(userName);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('message');

            try {
                console.log('📤 Enviando requisição de login...');
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                console.log('📥 Resposta do servidor:', data);

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.user.name);
                    messageDiv.textContent = 'Login realizado com sucesso!'
                    messageDiv.className = 'message success';
                    setTimeout(() => {
                        showDashboard(data.user.name);
                    }, 1000);
                } else {
                    messageDiv.textContent = data.message || 'Erro ao fazer login';
                    messageDiv.className = 'message error';
                }
            } catch (error) {
                console.error('❌ Erro ao conectar:', error);
                messageDiv.textContent = 'Erro ao conectar com o servidor';
                messageDiv.className = 'message error';
            }
        });
    } else {
        console.warn('⚠️ Formulário de login não encontrado');
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            const messageDiv = document.getElementById('register-message');

            if (password !== confirm) {
                messageDiv.textContent = 'As senhas não correspondem!';
                messageDiv.className = 'message error';
                return;
            }

            if (password.length < 6) {
                messageDiv.textContent = 'A senha deve ter no mínimo 6 caracteres!';
                messageDiv.className = 'message error';
                return;
            }

            try {
                console.log('📤 Enviando requisição de registro...');
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                console.log('📥 Resposta do servidor:', data);

                if (response.ok) {
                    messageDiv.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
                    messageDiv.className = 'message success';
                    document.getElementById('register-form').reset();
                    setTimeout(() => {
                        toggleRegister();
                        messageDiv.textContent = '';
                        messageDiv.className = 'message';
                    }, 2000);
                } else {
                    messageDiv.textContent = data.message || 'Erro ao cadastrar';
                    messageDiv.className = 'message error';
                }
            } catch (error) {
                console.error('❌ Erro ao conectar:', error);
                messageDiv.textContent = 'Erro ao conectar com o servidor';
                messageDiv.className = 'message error';
            }
        });
    } else {
        console.warn('⚠️ Formulário de registro não encontrado');
    }
});

