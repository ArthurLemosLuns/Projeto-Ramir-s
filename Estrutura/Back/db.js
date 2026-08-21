const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Caminho do banco de dados
const dbPath = path.join(__dirname, 'database.db');

// Criar conexão
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite3');
        initializeDatabase();
    }
});

// ===== INICIALIZAR BANCO DE DADOS =====
function initializeDatabase() {
    // Criar tabela de usuários se não existir
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('❌ Erro ao criar tabela:', err.message);
        } else {
            console.log('✅ Tabela de usuários inicializada');
            migrateUsersTable();
        }
    });

    // Criar tabela de pedidos (persistente)
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            customer_email TEXT,
            address TEXT NOT NULL,
            note TEXT,
            items TEXT NOT NULL,
            total REAL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'Sendo preparados',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('❌ Erro ao criar tabela de pedidos:', err.message);
        } else {
            console.log('✅ Tabela de pedidos inicializada');
        }
    });

    // Criar tabela de estoque
    db.run(`
        CREATE TABLE IF NOT EXISTS stock (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL,
            categoria TEXT NOT NULL,
            tamanho TEXT NOT NULL,
            quantidade INTEGER NOT NULL DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(tipo, categoria, tamanho)
        )
    `, (err) => {
        if (err) {
            console.error('❌ Erro ao criar tabela de estoque:', err.message);
        } else {
            console.log('✅ Tabela de estoque inicializada');
            seedStock();
        }
    });
}

// ===== MIGRAÇÃO: COLUNAS username E role NA TABELA users =====
function migrateUsersTable() {
    db.all('PRAGMA table_info(users)', (err, columns) => {
        if (err) {
            console.error('❌ Erro ao verificar colunas de users:', err.message);
            return;
        }

        const colNames = columns.map(c => c.name);
        const steps = [];

        if (!colNames.includes('username')) {
            steps.push((next) => {
                db.run('ALTER TABLE users ADD COLUMN username TEXT', (err) => {
                    if (err) console.error('❌ Erro ao adicionar coluna username:', err.message);
                    else console.log('✅ Coluna username adicionada');
                    next();
                });
            });
        }

        if (!colNames.includes('role')) {
            steps.push((next) => {
                db.run("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'", (err) => {
                    if (err) console.error('❌ Erro ao adicionar coluna role:', err.message);
                    else console.log('✅ Coluna role adicionada');
                    next();
                });
            });
        }

        // Índice único para username criado APÓS garantir que a coluna existe
        // (SQLite permite múltiplos NULL em índice único)
        steps.push((next) => {
            db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username)', (err) => {
                if (err) console.error('❌ Erro ao criar índice de username:', err.message);
                else console.log('✅ Índice único de username verificado');
                next();
            });
        });

        let i = 0;
        const runNext = () => {
            if (i >= steps.length) {
                seedAdminUser();
                return;
            }
            steps[i++](runNext);
        };
        runNext();
    });
}

// ===== SEED: CONTA ADMINISTRADORA =====
function seedAdminUser() {
    const adminEmail = 'admin@ramirs.com';

    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [adminEmail, 'Admin'], async (err, user) => {
        if (err) {
            console.error('❌ Erro ao verificar conta admin:', err.message);
            return;
        }

        if (user) {
            console.log('✅ Conta administradora já existe');
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash("Ramir's@admin", 10);
            db.run(
                "INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, 'admin')",
                ['Admin', 'Admin', adminEmail, hashedPassword],
                (err) => {
                    if (err) console.error('❌ Erro ao criar conta admin:', err.message);
                    else console.log('✅ Conta administradora criada (usuário: Admin)');
                }
            );
        } catch (error) {
            console.error('❌ Erro ao criptografar senha do admin:', error.message);
        }
    });
}

// ===== SEED: ESTOQUE INICIAL (30 unidades por produto) =====
function seedStock() {
    const drinkBrands = ['Pepsi', 'Coca-Cola', 'Fanta', 'Guaraná Antarctica', 'Sucos Naturais', 'Vitaminas'];
    const drinkSizes = ['250ml', '500ml', '1,5L', '2L'];
    const pizzaTypes = ['Salgada', 'Doce'];
    const pizzaSizes = ['Pequena', 'Média', 'Grande', 'Família'];
    const QUANTIDADE_INICIAL = 30;

    const items = [];
    drinkBrands.forEach(brand => drinkSizes.forEach(size => items.push(['bebida', brand, size])));
    pizzaTypes.forEach(type => pizzaSizes.forEach(size => items.push(['pizza', type, size])));

    const stmt = db.prepare(`
        INSERT OR IGNORE INTO stock (tipo, categoria, tamanho, quantidade)
        VALUES (?, ?, ?, ?)
    `);
    items.forEach(([tipo, categoria, tamanho]) => stmt.run(tipo, categoria, tamanho, QUANTIDADE_INICIAL));
    stmt.finalize(() => {
        console.log('✅ Estoque inicial verificado (30 unidades por produto)');
    });
}

module.exports = db;