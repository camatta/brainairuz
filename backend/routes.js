const express = require('express');

const router = express.Router();

// Middlewares
const authMiddleware = require('./middleware/auth');

// User Controllers
const { CreateUserController } = require('./controllers/user/CreateUserController');
const { AuthUserController } = require('./controllers/user/AuthUserController');
const { ListUsersController } = require('./controllers/user/ListUsersController');
const { DetailUserController } = require('./controllers/user/DetailUserController');

// Products Controllers
const { ListProductsController } = require('./controllers/product/ListProductsController');
const { CreateProductController } = require('./controllers/product/CreateProductController');
const { DeleteProductController } = require('./controllers/product/DeleteProductController');
const { UpdateProductController } = require('./controllers/product/UpdateProductController');

// Commissions Controllers
const { ListCommissionsController } = require('./controllers/commissions/ListCommissionsController');
const { CreateCommissionController } = require('./controllers/commissions/CreateCommissionController');
const { DeleteCommissionController } = require('./controllers/commissions/DeleteCommissionController');
const { UpdateCommissionController } = require('./controllers/commissions/UpdateCommissionController');


// *** USUÁRIO ***
// Rota de Cadastro
router.post('/api/auth/cadastro', CreateUserController);

// Rota de Login
router.post('/api/auth/login', AuthUserController);

// Rota para obter todos os usuários
router.get('/api/users', ListUsersController);

// Rota para obter informações do usuário logado
router.get('/api/users/me', authMiddleware, DetailUserController);


// *** PRODUTOS ***
// Rota para obter todos os produtos
router.get('/api/products', ListProductsController);

// Rota para inserir novos produtos
router.post('/api/products', CreateProductController);

// Rota para apagar um produto
router.delete('/api/products/:id', DeleteProductController);

// Rota para editar um produto
router.put('/api/products/:id', UpdateProductController);


// *** COMISSÕES ***
// Rota para obter todas as comissões
router.get('/api/comissoes', ListCommissionsController);

// Rota para inserir novas comissões
router.post('/api/comissao', CreateCommissionController);

// Rota para apagar um produto
router.delete('/api/comissoes/:id', DeleteCommissionController);

router.put('/api/comissoes/:id', UpdateCommissionController);

module.exports = router;