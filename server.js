const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./dados.db');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  fs.readFile('public/index.html', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao carregar arquivo index.html');
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    }
  });
  fs.readFile('public/script.js', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao carregar arquivo script.js');
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    }
  });

});

app.post('/adicionarGasto', (req, res) => {
  const nomeGasto = req.body.nomeGasto;
  const valorGasto = req.body.valorGasto;
  const dataGasto = req.body.dataGasto;

  const sql = `INSERT INTO gastos (nome_produto, valor_produto, data_comprou) VALUES (?, ?, ?)`;

  db.run(sql, [nomeGasto, valorGasto, dataGasto], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao inserir gasto no banco de dados');
    } else {
      console.log(`Row inserted with ID ${this.lastID}`);
      res.send('<script>alert("Gasto cadastrado!"); window.location.href="/";</script>');
    }
  });
});

app.post('/adicionarvenda', (req, res) => {
  const nomeVenda = req.body.nomeVenda;
  const valorVenda = req.body.valorVenda;
  const dataVenda = req.body.dataVenda;
  const nomeComprador = req.body.nomeComprador;
  const formaPagamento = req.body.formaPagamento;

  const sql = `INSERT INTO vendas (nome_produto, valor_produto, data_comprou, nome_comprador,forma_pagamento) VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [nomeVenda, valorVenda, dataVenda, nomeComprador, formaPagamento], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao inserir gasto no banco de dados');
    } else {
      console.log(`Row inserted with ID ${this.lastID}`);
      res.send('<script>alert("Nova venda cadastrada! 🎉"); window.location.href="/";</script>');
    }
  });
});

app.get('/gastos', (req, res) => {
  db.all('SELECT * FROM gastos', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao buscar gastos no banco de dados');
    } else {
      const gastos = rows.map(row => ({ nome: row.nome_produto, valor: row.valor_produto, data: row.data_comprou }));
      res.json(gastos);
    }
  });
});

app.get('/vendas', (req, res) => {
  db.all('SELECT * FROM vendas', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao buscar vendas no banco de dados');
    } else {
      const vendas = rows.map(row => ({ nome: row.nome_produto, valor: row.valor_produto, data: row.data_comprou, comprador: row.nome_comprador, formapagamento: row.forma_pagamento}));
      res.json(vendas);
    }
  });
});

app.get('/lucro', (req, res) => {
  db.all('SELECT (SELECT SUM(valor_produto) FROM vendas) - (SELECT SUM(valor_produto) FROM gastos) AS lucro', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao buscar lucro no banco de dados');
    } else {
      const lucro = rows[0].lucro;
      res.json(lucro);
    }
  });
});




app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
