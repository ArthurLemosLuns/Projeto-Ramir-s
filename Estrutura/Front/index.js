const API_URL = 'http://localhost:3000/api';

// ===== TOGGLE ENTRE LOGIN E REGISTRO =====
function toggleRegister() {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    
    loginSection.style.display = loginSection.style.display === 'none' ? 'flex' : 'none';
    registerSection.style.display = registerSection.style.display === 'none' ? 'flex' : 'none';
    
    // Limpar mensagens
    document.getElementById('message').textContent = '';
    document.getElementById('register-message').textContent = '';
    document.getElementById('message').className = 'message';
    document.getElementById('register-message').className = 'message';
}

// ===== CARREGAR DASHBOARD SE USUÁRIO ESTIVER LOGADO =====
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    
    if (token && userName) {
        showDashboard(userName);
    }
});

// ===== FORMULÁRIO DE LOGIN =====
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Salvar token e dados do usuário
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name);
            
            messageDiv.textContent = 'Login realizado com sucesso!';
            messageDiv.className = 'message success';
            
            // Redirecionar para dashboard após 1 segundo
            setTimeout(() => {
                showDashboard(data.user.name);
            }, 1000);
        } else {
            messageDiv.textContent = data.message || 'Erro ao fazer login';
            messageDiv.className = 'message error';
        }
    } catch (error) {
        console.error('Erro:', error);
        messageDiv.textContent = 'Erro ao conectar com o servidor';
        messageDiv.className = 'message error';
    }
});

// ===== FORMULÁRIO DE REGISTRO =====
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const messageDiv = document.getElementById('register-message');
    
    // Validação básica
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
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
            messageDiv.className = 'message success';
            
            // Limpar formulário
            document.getElementById('register-form').reset();
            
            // Redirecionar para login após 2 segundos
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
        console.error('Erro:', error);
        messageDiv.textContent = 'Erro ao conectar com o servidor';
        messageDiv.className = 'message error';
    }
});

// ===== MOSTRAR DASHBOARD =====
function showDashboard(userName) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('user-name').textContent = `Olá, ${userName}!`;
}

// ===== LOGOUT =====
function logout() {
    // Remover dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    // Resetar página
    location.reload();
}
