const SENHA = '0301';

$(document).ready(() => {
  $('#myModal').on('show.bs.modal', () => {
    // busca os dados de gastos do servidor
    $.get('/gastos', (gastos) => {
      // limpa a tabela de gastos
      $('#tabelaGastos').empty();
      // preenche a tabela de gastos com os dados retornados do servidor
      gastos.forEach((gasto) => {
        $('#tabelaGastos').append(
          '<tr><td>' +
            gasto.nome +
            '</td><td>' +
            gasto.valor +
            '</td><td>' +
            gasto.data +
            '</td></tr>'
        );
      });
    });

    // busca os dados de vendas do servidor
    $.get('/vendas', (vendas) => {
      // limpa a tabela de vendas
      $('#tabelaVendas').empty();
      // preenche a tabela de vendas com os dados retornados do servidor
      vendas.forEach((venda) => {
        $('#tabelaVendas').append(
          '<tr><td style="text-align: center;">' +
            venda.nome +
            '</td><td style="text-align: center;">' +
            venda.valor +
            '</td><td style="text-align: center;">' +
            venda.data +
            '</td><td style="text-align: center;">' +
            venda.comprador +
            '</td><td style="text-align: center;">' +
            venda.formapagamento +
            '</td></tr>'
        );
      });
    });

    // busca o lucro do servidor
    $.get('/lucro', (lucro) => {
      // exibe o lucro na página
      $('#lucro').text(lucro);
    });
  });

  // ao clicar no botão de cadastrar gasto abrir modal de confirmação
  $('#btnGasto').click((event) => {
    event.preventDefault();
    $('#modalConfirmacao').modal('show');

    $('#btnConfirmar').click(() => {
      // verifica se a senha está correta

      const valorSenha = $('#senha').val();

      if (valorSenha !== SENHA) {
        window.alert('Senha incorreta!');
        return;
      }

      // pega os dados do formulário
      const nomeGasto = $('#nomeGasto').val();
      const valorGasto = $('#valorGasto').val();
      const dataGasto = $('#dataGasto').val();
      const qtdeGasto = $('#qtdeGasto').val();

      // envia os dados para o servidor
      $.post(
        '/adicionarGasto',
        { nomeGasto, valorGasto, dataGasto, qtdeGasto },
        (resposta) => {
          // exibe a resposta do servidor
          $('#modalConfirmacao').modal('hide');
          $('#modalResposta').modal('show');
          window.alert(resposta);
          location.reload();
        },
        'text'
      );
    });
  });

  // ao clicar no botão de cadastrar venda abrir modal de confirmação
  $('#btnVenda').click((event) => {
    event.preventDefault();
    $('#modalConfirmacao').modal('show');

    $('#btnConfirmar').click(() => {
      // verifica se a senha está correta

      const valorSenha = $('#senha').val();

      if (valorSenha !== SENHA) {
        window.alert('Senha incorreta!');
        return;
      }

      // pega os dados do formulário
      const nomeVenda = $('#nomeVenda').val();
      const valorVenda = $('#valorVenda').val();
      const dataVenda = $('#dataVenda').val();
      const nomeComprador = $('#nomeComprador').val();
      const formaPagamento = $('#formaPagamento').val();
      const qtdeVenda = $('#qtdeVenda').val();

      // envia os dados para o servidor
      $.post(
        '/adicionarVenda',
        {
          nomeVenda,
          valorVenda,
          dataVenda,
          nomeComprador,
          formaPagamento,
          qtdeVenda,
        },
        (resposta) => {
          // exibe a resposta do servidor
          $('#modalConfirmacao').modal('hide');
          $('#modalResposta').modal('show');
          window.alert(resposta);
          location.reload();
        },
        'text'
      );
    });
  });
});
