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
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
  fs.readFile('public/script.js', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao carregar arquivo script.js');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

app.post('/adicionarGasto', (req, res) => {
  const nomeGasto = req.body.nomeGasto;
  const valorGasto = req.body.valorGasto;
  const dataGasto = req.body.dataGasto;
  const qtdeGasto = Number(req.body.qtdeGasto) || 1;

  const valorTotalGasto = qtdeGasto * valorGasto;

  const sql = `INSERT INTO gastos (nome_produto, valor_produto, data_comprou) VALUES (?, ?, ?)`;

  db.run(sql, [nomeGasto, valorTotalGasto, dataGasto], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao inserir gasto no banco de dados');
    } else {
      console.log(`Row inserted with ID ${this.lastID}`);
      res.send(
        '<script>alert("Gasto cadastrado! 🎉"); window.location.href = "/"</script>'
      );
    }
  });
});

app.post('/adicionarvenda', (req, res) => {
  const nomeVenda = req.body.nomeVenda;
  const valorVenda = req.body.valorVenda;
  const dataVenda = req.body.dataVenda;
  const nomeComprador = req.body.nomeComprador;
  const formaPagamento = req.body.formaPagamento;
  const qtdeVenda = Number(req.body.qtdeVenda) || 1;

  const valorTotalVenda = qtdeVenda * valorVenda;

  const sql = `INSERT INTO vendas (nome_produto, valor_produto, data_comprou, nome_comprador,forma_pagamento) VALUES (?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [nomeVenda, valorTotalVenda, dataVenda, nomeComprador, formaPagamento],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erro ao inserir gasto no banco de dados');
      } else {
        console.log(`Row inserted with ID ${this.lastID}`);
        res.send(
          '<script>alert("Nova venda cadastrada! 🎉"); window.location.href = "/"</script>'
        );
      }
    }
  );
});

app.get('/gastos', (req, res) => {
  db.all('SELECT * FROM gastos', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao buscar gastos no banco de dados');
    } else {
      const gastos = rows.map((row) => ({
        id: row.id,
        nome: row.nome_produto,
        valor: row.valor_produto,
        data: row.data_comprou,
      }));
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
      const vendas = rows.map((row) => ({
        id: row.id,
        nome: row.nome_produto,
        valor: row.valor_produto,
        data: row.data_comprou,
        comprador: row.nome_comprador,
        formapagamento: row.forma_pagamento,
      }));
      res.json(vendas);
    }
  });
});

app.post('/gastos', (req, res) => {
  const gastos = req.body.gastos;

  const sql = `INSERT INTO gastos (nome_produto, valor_produto, data_comprou) VALUES (?, ?, ?)`;

  const stmt = db.prepare(sql);

  gastos.forEach((gasto) => {
    stmt.run(gasto.nome, gasto.valor, gasto.data);
  });

  stmt.finalize();

  res.send();
});

app.post('/vendas', (req, res) => {
  const vendas = req.body.vendas;

  const sql = `INSERT INTO vendas (nome_produto, valor_produto, nome_comprador, forma_pagamento, data_comprou) VALUES (?, ?, ?, ?, ?)`;

  const stmt = db.prepare(sql);

  vendas.forEach((venda) => {
    stmt.run(
      venda.nome,
      venda.valor,
      venda.comprador,
      venda.formapagamento,
      venda.data
    );
  });

  stmt.finalize();

  res.send();
});

app.get('/gastos-filtrados-por-data', (req, res) => {
  const { inicio, fim } = req.query;

  const sql = `SELECT * FROM gastos WHERE data_comprou BETWEEN ? AND ?`;

  db.all(sql, [inicio, fim], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao buscar gastos no banco de dados');
    } else {
      const gastos = rows.map((row) => ({
        id: row.id,
        nome: row.nome_produto,
        valor: row.valor_produto,
        data: row.data_comprou,
      }));
      res.json(gastos);
    }
  });
});

app.get('/vendas-filtrados-por-data', (req, res) => {
  const { inicio, fim } = req.query;

  const sql = `SELECT * FROM vendas WHERE data_comprou BETWEEN ? AND ?`;

  db.all(sql, [inicio, fim], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao buscar vendas no banco de dados');
    } else {
      const vendas = rows.map((row) => ({
        id: row.id,
        nome: row.nome_produto,
        valor: row.valor_produto,
        data: row.data_comprou,
        comprador: row.nome_comprador,
        formapagamento: row.forma_pagamento,
      }));
      res.json(vendas);
    }
  });
});

app.delete('/venda/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM vendas WHERE id = ?`;

  try {
    db.run(sql, [id]);
    console.log(`Row venda deleted with ID ${id}`);
    return res.status(200).send();
  } catch {
    return res.status(500).send();
  }
});

app.delete('/gasto/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM gastos WHERE id = ?`;

  try {
    db.run(sql, [id]);
    console.log(`Row gasto deleted with ID ${id}`);
    return res.status(200).send();
  } catch {
    return res.status(500).send();
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
