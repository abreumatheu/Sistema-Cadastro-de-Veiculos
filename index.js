const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;
const dataPath = path.join(__dirname, 'data', 'vehicles.json');

// Middleware para lidar com JSON
app.use(bodyParser.json());

// Função auxiliar para ler o arquivo JSON
const readData = () => {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

// Função auxiliar para escrever no arquivo JSON
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Rota para a raiz do servidor
app.get('/', (req, res) => {
  res.send('Bem-vindo à Concessionária!');
});

// Rota para buscar todos os veículos
app.get('/vehicles', (req, res) => {
  const vehicles = readData();
  res.json(vehicles);
});

// Rota para buscar um veículo específico pelo ID
app.get('/vehicles/:id', (req, res) => {
  const vehicles = readData();
  const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
  if (vehicle) {
    res.json(vehicle);
  } else {
    res.status(404).send('Veículo não encontrado');
  }
});

// Rota para cadastrar um novo veículo
app.post('/vehicles', (req, res) => {
  const vehicles = readData();
  const newVehicle = req.body;
  newVehicle.id = vehicles.length ? vehicles[vehicles.length - 1].id + 1 : 1;
  vehicles.push(newVehicle);
  writeData(vehicles);
  res.status(201).json(newVehicle);
});

// Rota para atualizar os dados de um veículo pelo ID
app.put('/vehicles/:id', (req, res) => {
  const vehicles = readData();
  const index = vehicles.findIndex(v => v.id === parseInt(req.params.id));
  if (index !== -1) {
    const updatedVehicle = { ...vehicles[index], ...req.body };
    vehicles[index] = updatedVehicle;
    writeData(vehicles);
    res.json(updatedVehicle);
  } else {
    res.status(404).send('Veículo não encontrado');
  }
});

// Rota para excluir um veículo vendido pelo ID
app.delete('/vehicles/:id', (req, res) => {
  const vehicles = readData();
  const index = vehicles.findIndex(v => v.id === parseInt(req.params.id));
  if (index !== -1) {
    vehicles.splice(index, 1);
    writeData(vehicles);
    res.status(204).send();
  } else {
    res.status(404).send('Veículo não encontrado');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
