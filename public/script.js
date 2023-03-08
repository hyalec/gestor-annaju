const SENHA = '0301';

const FORM_GASTOS = $('#formGastos');
const FORM_VENDAS = $('#formVendas');
const TABELA_GASTOS = $('#tabelaGastos');
const TABELA_VENDAS = $('#tabelaVendas');
const LUCRO = $('#lucro');
const MODAL_CONFIRMACAO = $('#modalConfirmacao');
const MODAL_RESPOSTA = $('#modalResposta');
const BTN_CONFIRMAR = $('#btnConfirmar');
const SENHA_INPUT = $('#senha');
const INPUT_DATE = $('input[type="date"]');

console.log('carreguei')

function verificaSenha() {
  if (SENHA_INPUT.val() !== SENHA) {
    window.alert('Senha incorreta!');
    return false;
  }
  return true;
}

function preencheTabelaGastos(gastos) {
  TABELA_GASTOS.empty();
  gastos.forEach((gasto) => {
    TABELA_GASTOS.append(
      `
      <tr>
        <td>
        ${gasto.nome}
        </td>
        <td>
        ${gasto.valor}
        </td>
        <td>
        ${gasto.data}
        </td>
        <td>
          <button class="deletar-gasto-btn" data-rowid=${gasto.id} >Apagar</button>
        </td>
      </tr>`
    );
  });
}

function preencheTabelaVendas(vendas) {
  TABELA_VENDAS.empty();
  vendas.forEach((venda) => {
    TABELA_VENDAS.append(
      `
      <tr>
        <td style="text-align: center;">
        ${venda.nome}
        </td>
        <td style="text-align: center;">
       ${venda.valor}
        </td>
        <td style="text-align: center;">
        ${venda.data}
        </td>
        <td style="text-align: center;">
        ${venda.comprador}
        </td>
        <td style="text-align: center;">
        ${venda.formapagamento}
        </td>
        <td>
        <button class="deletar-venda-btn" data-rowid=${venda.id} >Apagar</button>
        </td>
      </tr>`
    );
  });
}

function exibeMensagemErro() {
  window.alert('Ocorreu um erro ao carregar os dados. Por favor, tente novamente.');
}

function confirmaFormulario(event) {
  event.preventDefault();
  MODAL_CONFIRMACAO.modal('show');

  BTN_CONFIRMAR.on('click', () => {
    const aSenhaEValida = verificaSenha();
    if (!aSenhaEValida) {
      return;
    }

    this.submit();
  });
}

$(document).ready(() => {
  $('#myModal').on('show.bs.modal', () => {
    // busca os dados de gastos do servidor
    $.get('/gastos').done(preencheTabelaGastos).fail(exibeMensagemErro);
    // busca os dados de vendas do servidor
    $.get('/vendas').done(preencheTabelaVendas).fail(exibeMensagemErro);

    // busca o lucro do servidor
    $.get('/lucro').done((lucro) => {
      // exibe o lucro na página
      $('#lucro').text(lucro);
    }).fail(exibeMensagemErro);
  });

  INPUT_DATE.val(moment().format('YYYY-MM-DD'));

  // ao clicar no botão de cadastrar gasto abrir modal de confirmação
  FORM_GASTOS.on('submit', confirmaFormulario);

  // ao clicar no botão de cadastrar venda abrir modal de confirmação
  FORM_VENDAS.on('submit', confirmaFormulario);
});
