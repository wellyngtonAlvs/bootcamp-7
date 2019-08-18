// Comando usado para importa dependências para a variavel express. 
const express = require('express');

// Chamando a função do express para a variavel server
const server = express();

// Falando para o express que a função é json
server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Wellyngton", "email": "wellington.02@icloud.com" }

// CRUD = Create, Read, Update, Delete

// Vetor users
const users = [ 'Wellyngton', 'Kelvin', 'Test' ];

// Função middlewares = intercepitador de rotas
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  if (!req.body.name){
    return res.status(400).json({ error: 'User name is required' });
  };

  return next();
}; 

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exists' });
  };

  req.user = user;

  return next();
};

// localhost:3000/users 
// Paramentro 'req' = representa todos os dados das requisição 
// Paramentro 'res' = ultilizado para dar as respostas para o frontend
server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  // const { index } = req.params;

  return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

// Funcionalidade do listen: ouve na porta (3000)
server.listen(3000);
