$(document).ready(function() {
    $('#myModal').on('show.bs.modal', function() {
      // busca os dados de gastos do servidor
      $.get('/gastos', function(gastos) {
        // limpa a tabela de gastos
        $('#tabelaGastos').empty();
        // preenche a tabela de gastos com os dados retornados do servidor
        gastos.forEach(function(gasto) {
          $('#tabelaGastos').append('<tr><td>' + gasto.nome + '</td><td>' + gasto.valor + '</td><td>' + gasto.data + '</td></tr>');
        });
      });
  
      // busca os dados de vendas do servidor
      $.get('/vendas', function(vendas) {
        // limpa a tabela de vendas
        $('#tabelaVendas').empty();
        // preenche a tabela de vendas com os dados retornados do servidor
        vendas.forEach(function(venda) {
          $('#tabelaVendas').append('<tr><td>' + venda.nome + '</td><td>' + venda.valor + '</td><td>' + venda.data + '</td><td>' + venda.comprador + '</td></tr>');
        });
      });
  
      // busca o lucro do servidor
      $.get('/lucro', function(lucro) {
        // exibe o lucro na página
        $('#lucro').text(lucro);
      });
    });
  });
  