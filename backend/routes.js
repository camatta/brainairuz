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

// Mix Products Controllers
const { ListMixProductsController } = require('./controllers/mixProducts/ListMixProductsController');
const { CreateMixProductController } = require('./controllers/mixProducts/CreateMixProductController');
const { UpdateMixProductController } = require('./controllers/mixProducts/UpdateMixProductController');
const { DeleteMixProductController } = require('./controllers/mixProducts/DeleteMixProductController');

// Metas Vendedores Controllers
const { ListSellerGoalsController } = require('./controllers/sellerGoals/ListSellerGoalsController');
const { CreateSellerGoalController } = require('./controllers/sellerGoals/CreateSellerGoalController');
const { UpdateSellerGoalController } = require('./controllers/sellerGoals/UpdateSellerGoalController');
const { DeleteSellerGoalController } = require('./controllers/sellerGoals/DeleteSellerGoalController');

// Metas Vendedores Controllers
const { ListEnterpriseGoalsController } = require('./controllers/enterpriseGoals/ListEnterpriseGoalsController');
const { CreateEnterpriseGoalController } = require('./controllers/enterpriseGoals/CreateEnterpriseGoalController');
const { UpdateEnterpriseGoalController } = require('./controllers/enterpriseGoals/UpdateEnterpriseGoalController');
const { DeleteEnterpriseGoalController } = require('./controllers/enterpriseGoals/DeleteEnterpriseGoalController');

// Oportunidades Controllers
const { ListOpportunitiesController } = require('./controllers/opportunities/ListOpportunitiesController');
const { CreateOpportunityController } = require('./controllers/opportunities/CreateOpportunityController');
const { UpdateOpportunityController } = require('./controllers/opportunities/UpdateOpportunityController');


// *** USUÁRIO ***
// Rota de Cadastro
router.post('/api/auth/cadastro', CreateUserController);

// Rota de Login
router.post('/api/auth/login', AuthUserController);

// Rota para obter todos os usuários
router.get('/api/users', authMiddleware, ListUsersController);

// Rota para obter informações do usuário logado
router.get('/api/users/me', authMiddleware, DetailUserController);


// *** PRODUTOS ***
// Rota para obter todos os produtos
router.get('/api/products', authMiddleware, ListProductsController);

// Rota para inserir novos produtos
router.post('/api/products', authMiddleware, CreateProductController);

// Rota para apagar um produto
router.delete('/api/products/:id', authMiddleware, DeleteProductController);

// Rota para editar um produto
router.put('/api/products/:id', authMiddleware, UpdateProductController);


// *** MIX DE PRODUTOS ***
// Rota para obter todos os mixes de produtos
router.get('/api/mix-produtos', authMiddleware, ListMixProductsController);

// Rota para criar mix de produtos
router.post('/api/mix-produtos', authMiddleware, CreateMixProductController);

// Rota para editar mix de produtos
router.put('/api/mix-produtos/:id', authMiddleware, UpdateMixProductController);

// Rota para remover mix de produtos
router.delete('/api/mix-produtos/:id', authMiddleware, DeleteMixProductController);


// *** METAS VENDEDORES ***
// Rota para listar todas as metas
router.get('/api/metas-vendedores', authMiddleware, ListSellerGoalsController);

// Rota para criar metas
router.post('/api/metas-vendedores', authMiddleware, CreateSellerGoalController);

// Rota para editar uma meta
router.put('/api/metas-vendedores/:id', authMiddleware, UpdateSellerGoalController);

// Rota para remover uma meta
router.delete('/api/metas-vendedores/:id', authMiddleware, DeleteSellerGoalController);


// *** METAS EMPRESA ***
// Rota para listar todas as metas
router.get('/api/metas-empresa', authMiddleware, ListEnterpriseGoalsController);

// Rota para criar metas
router.post('/api/metas-empresa', authMiddleware, CreateEnterpriseGoalController);

// Rota para editar uma meta
router.put('/api/metas-empresa/:id', authMiddleware, UpdateEnterpriseGoalController);

// Rota para remover uma meta
router.delete('/api/metas-empresa/:id', authMiddleware, DeleteEnterpriseGoalController);


// *** COMISSÕES ***
// Rota para obter todas as comissões
router.get('/api/comissoes', authMiddleware, ListCommissionsController);

// Rota para inserir novas comissões
router.post('/api/comissao', authMiddleware, CreateCommissionController);

// Rota para apagar uma comissão
router.delete('/api/comissoes/:id', authMiddleware, DeleteCommissionController);

// Rota para editar uma comissão
router.put('/api/comissoes/:id', authMiddleware, UpdateCommissionController);

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


// *** OPORTUNIDADES ***
// Rota para listar todas as oportunidades
router.get('/api/oportunidades', ListOpportunitiesController);

// Rota para criar uma oportunidade
router.post('/api/oportunidades', CreateOpportunityController);

// Rota para editar uma oportunidade
router.put('/api/oportunidades/:id', UpdateOpportunityController);

module.exports = router;