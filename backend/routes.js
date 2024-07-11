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

// Clients controllers
const { CreateClientController } = require('./controllers/clients/CreateClientController');
const { ListClientsController } = require('./controllers/clients/ListClientsController');
const { GetClientController } = require('./controllers/clients/GetClientController');

// Contracts controllers
const { ListContractsController } = require('./controllers/contracts/ListContractsController');
const { CreateContractController } = require('./controllers/contracts/CreateContractController');
const { GetContractController } = require('./controllers/contracts/GetContractController');
const { UpdateContractController } = require('./controllers/contracts/UpdateContractController');
const { DeleteContractController } = require('./controllers/contracts/DeleteContractController');
const { UpdateContractStatusController } = require('./controllers/contracts/UpdateContractStatusController');
const { DeleteClientController } = require('./controllers/clients/DeleteClientController');

// Authors controllers
const { CreateAuthorController } = require('./controllers/authors/CreateAuthorController');
const { ListAuthorsController } = require('./controllers/authors/ListAuthorsController');
const { GetAuthorController } = require('./controllers/authors/GetAuthorController');

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

// Rota para apagar uma comissão
router.delete('/api/comissoes/:id', DeleteCommissionController);

// Rota para editar uma comissão
router.put('/api/comissoes/:id', UpdateCommissionController);

/**
 * Rotas para Contratos
 */
// Rota para criar um contrato
router.post('/api/contracts', authMiddleware, CreateContractController);

// Rota para consultar todos contratos
router.get('/api/contracts', authMiddleware, ListContractsController);

// Rota para consultar um contrato por id
router.get('/api/contracts/:id', authMiddleware, GetContractController);

// Rota para editar um contrato
router.put('/api/contracts/:id', authMiddleware, UpdateContractController);

// Rota para editar o status de um contrato
router.patch('/api/contracts/:id/status', authMiddleware, UpdateContractStatusController);

// Rota para excluir um contrato
router.delete('/api/contracts/:id', authMiddleware, DeleteContractController)

/**
 * Rotas para Autores de contratos
 */
// Rota para salvar autor de contrato
router.post('/api/authors', authMiddleware, CreateAuthorController);
// Rota para consultar autores de contratos
router.get('/api/authors', authMiddleware, ListAuthorsController);
// Rota para consultar autor de contrato por email
router.get('/api/authors/:email', authMiddleware, GetAuthorController);

/**
 * Rotas para Clientes
 * os dados estão vindo da criação de um novo contrato
 */
// Rota para Criar um novo cliente
router.post('/api/clients', authMiddleware, CreateClientController);

// Rota para consultar todos os clientes
router.get('/api/clients', authMiddleware, ListClientsController);

// Rota para consultar cliente via CNPJ
router.get('/api/clients/:cnpj', authMiddleware, GetClientController);

// Rota para deletar cliente via CNPJ
router.delete('/api/clients/:cnpj', authMiddleware, DeleteClientController); 

module.exports = router;