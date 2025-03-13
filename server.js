const express = require('express');
const cors = require('cors');
const app = express(); 
const path = require('path');

const routes = require('./backend/routes');

app.use(cors());

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://desenvolvimento:7CSJ5iTVgPxXeA1t@cluster0.wxdwjbm.mongodb.net/internuz'

// Conexão com banco de dados

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao banco MongoDB');
})
.catch((error) => {
  console.error('Erro ao conectar ao banco MongoDB', error);
});

// Configuração do middleware para permitir o uso de JSON nas requisições
app.use(express.json());

// Utilizando o arquivo de rotas
app.use(routes);

// *** OUTROS ***
const distFolder = path.join(process.cwd(), '/dist/nairuz');

app.get('*.*', express.static(distFolder, {
  maxAge: '1y'
}));

app.use("*", function(req, resp) {
  resp.sendFile(__dirname + '/dist/nairuz/index.html');
});

// Inicialização do servidor
const port = process.env['PORT'] || 3000;
app.listen(port, () => {
  console.log(`Servidor express iniciado na porta ${port}`);
});
