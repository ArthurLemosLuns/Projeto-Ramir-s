const API_URL = 'http://localhost:3000/api';

const pizzaCategories = [
    {
        title: 'Pizza salgada',
        sizes: [
            {
                size: 'Pequena',
                items: [
                    { name: 'Margherita', description: 'Molho de tomate, mussarela e manjericão.', price: 'R$ 34,90' },
                    { name: 'Pepperoni', description: 'Pepperoni, mussarela e borda crocante.', price: 'R$ 39,90' }
                ]
            },
            {
                size: 'Média',
                items: [
                    { name: 'Frango com Catupiry', description: 'Frango, catupiry e cebola crocante.', price: 'R$ 49,90' },
                    { name: 'Quatro Queijos', description: 'Mussarela, provolone, gorgonzola e parmesão.', price: 'R$ 52,90' }
                ]
            },
            {
                size: 'Grande',
                items: [
                    { name: 'Calabresa Especial', description: 'Calabresa, cebola e queijo derretido.', price: 'R$ 59,90' },
                    { name: 'Vegetariana', description: 'Tomate, abobrinha, pimentão e champignon.', price: 'R$ 57,90' }
                ]
            },
            {
                size: 'Família',
                items: [
                    { name: 'Bacon com Cebola', description: 'Bacon, cebola caramelizada e queijo premium.', price: 'R$ 69,90' },
                    { name: 'Mussarela Especial', description: 'Mussarela generosa e molho artesanal.', price: 'R$ 66,90' }
                ]
            }
        ]
    },
    {
        title: 'Pizza doce',
        sizes: [
            {
                size: 'Pequena',
                items: [
                    { name: 'Chocolate com Morango', description: 'Chocolate ao leite e morangos frescos.', price: 'R$ 36,90' },
                    { name: 'Romeu e Julieta', description: 'Queijo minas com goiabada.', price: 'R$ 34,90' }
                ]
            },
            {
                size: 'Média',
                items: [
                    { name: 'Banoffee', description: 'Banana, doce de leite e chocolate.', price: 'R$ 46,90' },
                    { name: 'Prestígio', description: 'Chocolate, coco e raspas de chocolate.', price: 'R$ 44,90' }
                ]
            },
            {
                size: 'Grande',
                items: [
                    { name: 'Nutella com Banana', description: 'Nutella, banana e castanhas.', price: 'R$ 56,90' },
                    { name: 'Brigadeiro', description: 'Brigadeiro e granulado crocante.', price: 'R$ 54,90' }
                ]
            },
            {
                size: 'Família',
                items: [
                    { name: 'Sensação', description: 'Chocolate, morango e creme.', price: 'R$ 64,90' },
                    { name: 'Confetti', description: 'Chocolate, confete e creme de leite.', price: 'R$ 62,90' }
                ]
            }
        ]
    }
];

const drinkSizes = {
    '250ml': {
        price: 'R$ 6,90',
        brands: [
            { name: 'Pepsi', flavors: ['Cola', 'Zero'] },
            { name: 'Coca-Cola', flavors: ['Original', 'Zero'] },
            { name: 'Fanta', flavors: ['Laranja', 'Uva'] },
            { name: 'Guaraná Antarctica', flavors: ['Original', 'Zero'] }
        ]
    },
    '500ml': {
        price: 'R$ 9,90',
        brands: [
            { name: 'Pepsi', flavors: ['Cola', 'Limao'] },
            { name: 'Coca-Cola', flavors: ['Original', 'Zero'] },
            { name: 'Fanta', flavors: ['Laranja', 'Guaraná'] },
            { name: 'Guaraná Antarctica', flavors: ['Original', 'Sem Açúcar'] }
        ]
    },
    '1,5L': {
        price: 'R$ 14,90',
        brands: [
            { name: 'Pepsi', flavors: ['Cola', 'Manga'] },
            { name: 'Coca-Cola', flavors: ['Original', 'Zero'] },
            { name: 'Fanta', flavors: ['Laranja', 'Uva'] },
            { name: 'Guaraná Antarctica', flavors: ['Original', 'Zero'] }
        ]
    },
    '2L': {
        price: 'R$ 18,90',
        brands: [
            { name: 'Pepsi', flavors: ['Cola', 'Pêssego'] },
            { name: 'Coca-Cola', flavors: ['Original', 'Zero'] },
            { name: 'Fanta', flavors: ['Laranja', 'Manga'] },
            { name: 'Guaraná Antarctica', flavors: ['Original', 'Sem Açúcar'] }
        ]
    }
};

let selectedDrinkSize = '500ml';

// ===== DADOS DE PREÇOS DO DELIVERY =====
let deliveryFormInitialized = false;
const deliveryPizzaSizes = {
    'Pequena': { price: 30.00, label: 'Pequena', display: 'R$ 30,00' },
    'Média': { price: 40.00, label: 'Média', display: 'R$ 40,00' },
    'Grande': { price: 55.00, label: 'Grande', display: 'R$ 55,00' }
};

const deliveryDrinkSizes = {
    '1L': { price: 10.90, label: '1 Litro', display: 'R$ 10,90' },
    '1,5L': { price: 12.90, label: '1,5 Litro', display: 'R$ 12,90' },
    '2L': { price: 14.90, label: '2 Litros', display: 'R$ 14,90' }
};

// Sabores disponíveis para cada tamanho de pizza no delivery
const deliveryPizzaFlavors = {
    'Pequena': ['Margherita', 'Pepperoni', 'Chocolate com Morango'],
    'Média': ['Frango com Catupiry', 'Quatro Queijos', 'Banoffee'],
    'Grande': ['Calabresa Especial', 'Vegetariana', 'Nutella com Banana']
};

// Marcas e sabores de bebida para o delivery
const deliveryDrinkBrands = [
    { name: 'Coca-Cola', flavors: ['Original', 'Zero'] },
    { name: 'Pepsi', flavors: ['Cola', 'Zero'] },
    { name: 'Fanta', flavors: ['Laranja', 'Uva'] },
    { name: 'Guaraná Antarctica', flavors: ['Original', 'Zero'] }
];

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function initDeliveryForm() {
    const pizzaFlavorSelect = document.getElementById('delivery-pizza-flavor');
    const drinkBrandSelect = document.getElementById('delivery-drink-brand');
    const drinkFlavorSelect = document.getElementById('delivery-drink-flavor');

    if (!pizzaFlavorSelect || !drinkBrandSelect || !drinkFlavorSelect) {
        console.warn('⚠️ Elementos do formulário de delivery não encontrados');
        return;
    }

    // Popula o select de sabores de pizza
    const defaultPizzaSize = document.querySelector('input[name="pizzaSize"]:checked')?.value || 'Pequena';
    populatePizzaFlavors(defaultPizzaSize);

    // Popula o select de marcas de bebida (limpa antes para evitar duplicatas)
    drinkBrandSelect.innerHTML = '';
    deliveryDrinkBrands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.name;
        option.textContent = brand.name;
        drinkBrandSelect.appendChild(option);
    });

    // Popula os sabores da primeira marca
    if (deliveryDrinkBrands.length > 0) {
        drinkBrandSelect.value = deliveryDrinkBrands[0].name;
        populateDrinkFlavors(deliveryDrinkBrands[0].name);
    }

    // Event listeners para atualizar o resumo (apenas uma vez)
    const deliveryForm = document.getElementById('delivery-form');
    if (deliveryForm && !deliveryFormInitialized) {
        deliveryForm.addEventListener('change', updateDeliverySummary);
        deliveryFormInitialized = true;
    }

    updateDeliverySummary();
}

function populatePizzaFlavors(size) {
    const pizzaFlavorSelect = document.getElementById('delivery-pizza-flavor');
    if (!pizzaFlavorSelect) return;

    pizzaFlavorSelect.innerHTML = '<option value="">Selecione o sabor...</option>';
    const flavors = deliveryPizzaFlavors[size] || [];
    flavors.forEach(flavor => {
        const option = document.createElement('option');
        option.value = flavor;
        option.textContent = flavor;
        pizzaFlavorSelect.appendChild(option);
    });
}

function populateDrinkFlavors(brandName) {
    const drinkFlavorSelect = document.getElementById('delivery-drink-flavor');
    if (!drinkFlavorSelect) return;

    const brand = deliveryDrinkBrands.find(b => b.name === brandName);
    drinkFlavorSelect.innerHTML = '<option value="">Selecione o sabor...</option>';
    if (!brand) return;

    brand.flavors.forEach(flavor => {
        const option = document.createElement('option');
        option.value = flavor;
        option.textContent = flavor;
        drinkFlavorSelect.appendChild(option);
    });
}

function updateDeliverySummary() {
    const pizzaFlavorSelect = document.getElementById('delivery-pizza-flavor');
    const pizzaSizeInput = document.querySelector('input[name="pizzaSize"]:checked');
    const wantDrinkInput = document.querySelector('input[name="wantDrink"]:checked');
    const drinkBrandSelect = document.getElementById('delivery-drink-brand');
    const drinkFlavorSelect = document.getElementById('delivery-drink-flavor');
    const drinkSizeInput = document.querySelector('input[name="drinkSize"]:checked');
    const summaryDiv = document.getElementById('delivery-order-summary');
    const totalDiv = document.getElementById('delivery-order-total');

    if (!pizzaFlavorSelect || !pizzaSizeInput || !summaryDiv || !totalDiv) return;

    const pizzaFlavor = pizzaFlavorSelect.value;
    const pizzaSize = pizzaSizeInput.value;
    const pizzaPrice = deliveryPizzaSizes[pizzaSize]?.price || 0;
    const wantDrink = wantDrinkInput?.value === 'yes';

    let itemsHtml = '';
    let total = 0;

    // Item da pizza
    if (pizzaFlavor) {
        itemsHtml += `
            <div class="order-summary-item">
                <span class="summary-item-name">🍕 ${pizzaFlavor} (${deliveryPizzaSizes[pizzaSize]?.label})</span>
                <span class="summary-item-price">${deliveryPizzaSizes[pizzaSize]?.display}</span>
            </div>
        `;
        total += pizzaPrice;
    }

    // Item da bebida
    if (wantDrink && drinkBrandSelect && drinkFlavorSelect && drinkSizeInput) {
        const drinkBrand = drinkBrandSelect.value;
        const drinkFlavor = drinkFlavorSelect.value;
        const drinkSize = drinkSizeInput.value;
        const drinkPrice = deliveryDrinkSizes[drinkSize]?.price || 0;

        if (drinkBrand && drinkFlavor) {
            itemsHtml += `
                <div class="order-summary-item">
                    <span class="summary-item-name">🥤 ${drinkBrand} - ${drinkFlavor} (${deliveryDrinkSizes[drinkSize]?.label})</span>
                    <span class="summary-item-price">${deliveryDrinkSizes[drinkSize]?.display}</span>
                </div>
            `;
            total += drinkPrice;
        }
    }

    if (!itemsHtml) {
        summaryDiv.innerHTML = '<p class="order-summary-empty">Selecione os itens para ver o resumo.</p>';
    } else {
        summaryDiv.innerHTML = itemsHtml;
    }

    totalDiv.textContent = formatCurrency(total);
}

function toggleRegister() {
    console.log('🔄 toggleRegister() chamado');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const forgotSection = document.getElementById('forgot-password-section');

    if (!loginSection || !registerSection || !forgotSection) {
        console.error('❌ Um dos elementos não foi encontrado!');
        return;
    }

    const loginVisible = loginSection.style.display !== 'none';
    console.log('loginVisible antes:', loginVisible);
    
    // Alterna entre login e registro
    loginSection.style.display = loginVisible ? 'none' : 'flex';
    registerSection.style.display = loginVisible ? 'flex' : 'none';
    forgotSection.style.display = 'none';

    // Limpar mensagens
    const messageDiv = document.getElementById('message');
    const registerMessageDiv = document.getElementById('register-message');
    const forgotMessageDiv = document.getElementById('forgot-message');
    
    if (messageDiv) messageDiv.textContent = '';
    if (registerMessageDiv) registerMessageDiv.textContent = '';
    if (forgotMessageDiv) forgotMessageDiv.textContent = '';
    
    console.log('✅ toggleRegister() concluído - Login:', loginSection.style.display, 'Registro:', registerSection.style.display);
}

function toggleForgotPassword() {
    console.log('🔄 toggleForgotPassword() chamado');
    const loginSection = document.getElementById('login-section');
    const forgotSection = document.getElementById('forgot-password-section');
    const registerSection = document.getElementById('register-section');

    if (!loginSection || !forgotSection || !registerSection) {
        console.error('❌ Um dos elementos não foi encontrado!');
        return;
    }

    const loginVisible = loginSection.style.display !== 'none';
    console.log('loginVisible antes:', loginVisible);
    
    // Alterna entre login e esqueceu senha
    loginSection.style.display = loginVisible ? 'none' : 'flex';
    forgotSection.style.display = loginVisible ? 'flex' : 'none';
    registerSection.style.display = 'none';

    // Limpar mensagens
    const messageDiv = document.getElementById('message');
    const registerMessageDiv = document.getElementById('register-message');
    const forgotMessageDiv = document.getElementById('forgot-message');
    
    if (messageDiv) messageDiv.textContent = '';
    if (registerMessageDiv) registerMessageDiv.textContent = '';
    if (forgotMessageDiv) forgotMessageDiv.textContent = '';
    
    console.log('✅ toggleForgotPassword() concluído - Login:', loginSection.style.display, 'Esqueceu:', forgotSection.style.display);
}

function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    const drinksGrid = document.getElementById('drinks-grid');

    if (menuGrid) {
        menuGrid.innerHTML = pizzaCategories.map(category => {
            const sizeCards = category.sizes.map(sizeGroup => {
                const items = sizeGroup.items.map(item => `
                    <article class="menu-card pizza-item-card">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <div class="price">${item.price}</div>
                    </article>
                `).join('');

                return `
                    <div class="pizza-size-group">
                        <h4>${sizeGroup.size}</h4>
                        <div class="pizza-items-list">${items}</div>
                    </div>
                `;
            }).join('');

            return `
                <section class="menu-category-block">
                    <h3>${category.title}</h3>
                    <div class="pizza-size-grid">${sizeCards}</div>
                </section>
            `;
        }).join('');
    }

    if (drinksGrid) {
        const sizeButtons = Object.keys(drinkSizes).map(size => `
            <button class="drink-size-btn ${selectedDrinkSize === size ? 'active' : ''}" data-size="${size}">
                ${size}
            </button>
        `).join('');

        const currentSelection = drinkSizes[selectedDrinkSize];
        const brandsMarkup = currentSelection.brands.map(brand => {
            const flavors = brand.flavors.map(flavor => `<span class="drink-flavor-tag">${flavor}</span>`).join('');
            return `
                <article class="menu-card drink-brand-card">
                    <h4>${brand.name}</h4>
                    <p>Sabores disponíveis para o tamanho ${selectedDrinkSize}:</p>
                    <div class="drink-flavors">${flavors}</div>
                </article>
            `;
        }).join('');

        drinksGrid.innerHTML = `
            <div class="drink-selector">${sizeButtons}</div>
            <div class="drink-price-banner">Preço sugerido: <strong>${currentSelection.price}</strong></div>
            <div class="drink-brand-list">${brandsMarkup}</div>
        `;

        drinksGrid.querySelectorAll('.drink-size-btn').forEach(button => {
            button.addEventListener('click', () => {
                selectedDrinkSize = button.getAttribute('data-size');
                renderMenu();
            });
        });
    }
}

function showDashboard(userName) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('user-name').textContent = `Olá, ${userName}!`;
    renderMenu();
    initDeliveryForm();
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

            console.log('📝 Formulário de registro enviado');
            console.log('Nome:', name);
            console.log('Email:', email);
            console.log('Senha:', password);
            console.log('Confirmar:', confirm);

            if (password !== confirm) {
                console.log('❌ Senhas não coincidem');
                messageDiv.textContent = 'As senhas não correspondem!';
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
                return;
            }

            if (password.length < 6) {
                console.log('❌ Senha muito curta');
                messageDiv.textContent = 'A senha deve ter no mínimo 6 caracteres!';
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
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
                    console.log('✅ Cadastro realizado com sucesso');
                    messageDiv.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
                    messageDiv.className = 'message success';
                    messageDiv.style.display = 'block';
                    document.getElementById('register-form').reset();
                    setTimeout(() => {
                        toggleRegister();
                        messageDiv.textContent = '';
                        messageDiv.className = 'message';
                        messageDiv.style.display = 'none';
                    }, 2000);
                } else {
                    console.log('❌ Erro do servidor:', data);
                    messageDiv.textContent = data.message || 'Erro ao cadastrar';
                    messageDiv.className = 'message error';
                    messageDiv.style.display = 'block';
                }
            } catch (error) {
                console.error('❌ Erro ao conectar:', error);
                messageDiv.textContent = 'Erro ao conectar com o servidor';
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
            }
        });
    } else {
        console.warn('⚠️ Formulário de registro não encontrado');
    }

    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('forgot-email').value;
            const newPassword = document.getElementById('forgot-new-password').value;
            const confirm = document.getElementById('forgot-confirm-password').value;
            const messageDiv = document.getElementById('forgot-message');

            console.log('📝 Formulário de recuperação enviado');
            console.log('Email:', email);
            console.log('Nova Senha:', newPassword);
            console.log('Confirmar:', confirm);

            if (newPassword !== confirm) {
                console.log('❌ Senhas não coincidem');
                messageDiv.textContent = 'As senhas não correspondem!';
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
                return;
            }

            if (newPassword.length < 6) {
                console.log('❌ Senha muito curta');
                messageDiv.textContent = 'A senha deve ter no mínimo 6 caracteres!';
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
                return;
            }

            try {
                console.log('📤 Enviando requisição de reset de senha...');
                
                const response = await fetch(`${API_URL}/auth/reset-password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, newPassword })
                });

                const data = await response.json();
                console.log('📥 Resposta do servidor:', data);

                if (response.ok) {
                    console.log('✅ Senha alterada com sucesso');
                    messageDiv.textContent = 'Senha alterada com sucesso! Redirecionando...';
                    messageDiv.className = 'message success';
                    messageDiv.style.display = 'block';
                    document.getElementById('forgot-password-form').reset();
                    setTimeout(() => {
                        toggleForgotPassword();
                        messageDiv.textContent = '';
                        messageDiv.className = 'message';
                        messageDiv.style.display = 'none';
                    }, 2000);
                } else {
                    console.log('❌ Erro do servidor:', data);
                    messageDiv.textContent = data.message || 'Erro ao alterar senha';
                    messageDiv.className = 'message error';
                    messageDiv.style.display = 'block';
                }
            } catch (error) {
                console.error('❌ Erro ao conectar:', error);
                messageDiv.textContent = 'Erro ao conectar com o servidor';
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
            }
        });
    } else {
        console.warn('⚠️ Formulário de recuperação de senha não encontrado');
    }

    const deliveryForm = document.getElementById('delivery-form');
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const address = document.getElementById('delivery-address').value;
            const note = document.getElementById('delivery-note').value;
            const messageDiv = document.getElementById('delivery-message');

            const pizzaFlavorSelect = document.getElementById('delivery-pizza-flavor');
            const pizzaSizeInput = document.querySelector('input[name="pizzaSize"]:checked');
            const wantDrinkInput = document.querySelector('input[name="wantDrink"]:checked');
            const drinkBrandSelect = document.getElementById('delivery-drink-brand');
            const drinkFlavorSelect = document.getElementById('delivery-drink-flavor');
            const drinkSizeInput = document.querySelector('input[name="drinkSize"]:checked');

            if (!address.trim()) {
                messageDiv.textContent = 'Informe o endereço para o delivery.';
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
                return;
            }

            if (!pizzaFlavorSelect || !pizzaFlavorSelect.value || !pizzaSizeInput) {
                messageDiv.textContent = 'Escolha o sabor e o tamanho da pizza.';
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
                return;
            }

            const items = [];

            // Item da pizza
            items.push({
                nome: pizzaFlavorSelect.value,
                tipo: 'pizza',
                tamanho: pizzaSizeInput.value,
                valor: deliveryPizzaSizes[pizzaSizeInput.value]?.price || 0
            });

            // Item da bebida (se selecionada)
            const wantDrink = wantDrinkInput?.value === 'yes';
            if (wantDrink && drinkBrandSelect && drinkFlavorSelect && drinkSizeInput) {
                const drinkBrand = drinkBrandSelect.value;
                const drinkFlavor = drinkFlavorSelect.value;

                if (drinkBrand && drinkFlavor) {
                    items.push({
                        nome: `${drinkBrand} - ${drinkFlavor}`,
                        tipo: 'bebida',
                        tamanho: drinkSizeInput.value,
                        valor: deliveryDrinkSizes[drinkSizeInput.value]?.price || 0
                    });
                }
            }

            const total = items.reduce((sum, item) => sum + item.valor, 0);

            try {
                const response = await fetch(`${API_URL}/delivery/order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        address,
                        note,
                        items,
                        total
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    messageDiv.textContent = data.message || 'Pedido enviado com sucesso!';
                    messageDiv.className = 'message success';
                    messageDiv.style.display = 'block';
                    deliveryForm.reset();
                    // Re-inicializa o delivery após reset para repopular os selects
                    initDeliveryForm();
                } else {
                    messageDiv.textContent = data.message || 'Não foi possível enviar o pedido.';
                    messageDiv.className = 'message error';
                    messageDiv.style.display = 'block';
                }
            } catch (error) {
                console.error('❌ Erro ao enviar pedido de delivery:', error);
                messageDiv.textContent = 'Erro ao conectar com o serviço de delivery.';
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
            }
        });
    }

    // Event listeners para os controles do delivery
    const pizzaSizeRadios = document.querySelectorAll('input[name="pizzaSize"]');
    pizzaSizeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                populatePizzaFlavors(radio.value);
                updateDeliverySummary();
            }
        });
    });

    const drinkBrandSelect = document.getElementById('delivery-drink-brand');
    if (drinkBrandSelect) {
        drinkBrandSelect.addEventListener('change', () => {
            populateDrinkFlavors(drinkBrandSelect.value);
            updateDeliverySummary();
        });
    }

    const wantDrinkRadios = document.querySelectorAll('input[name="wantDrink"]');
    const drinkFields = document.getElementById('delivery-drink-fields');
    wantDrinkRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (drinkFields) {
                drinkFields.style.display = radio.value === 'yes' ? 'block' : 'none';
            }
            updateDeliverySummary();
        });
    });

    const drinkSizeRadios = document.querySelectorAll('input[name="drinkSize"]');
    drinkSizeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                updateDeliverySummary();
            }
        });
    });

    console.log('🎉 Todos os formulários foram inicializados com sucesso!');
});

