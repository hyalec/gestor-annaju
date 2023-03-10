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
const INPUT_DATERANGE_GASTOS = $('input[name="date-range-gastos"]');
const INPUT_DATERANGE_VENDAS = $('input[name="date-range-vendas"]');
const BTN_FILTRAR_GASTOS = $('#filtrarGastos');
const BTN_FILTRAR_VENDAS = $('#filtrarVendas');

function verificaSenha() {
  return SENHA_INPUT.val() === SENHA;
}

function exibeMensagemErro() {
  window.alert('Ocorreu um erro ao carregar os dados. Por favor, tente novamente.');
}

function formatarData(data) {
  const dataFormatada = moment(data).format('DD/MM/YY');
  return dataFormatada;
}

function formatarPreco(preco) {
  const precoFormatado = preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return precoFormatado;
}

function preencheTabelaGastos(gastos) {
  TABELA_GASTOS.empty();
  gastos.forEach((gasto) => {
    TABELA_GASTOS.append(
      `
      <tr data-row-gasto-id=${gasto.id} class="tabela-linha">
        <td data-label="Nome do produto" class="nome-produto">
        ${gasto.nome}
        </td>
        <td data-label="Valor" class="valor-produto">
        ${formatarPreco(gasto.valor)}
        </td>
        <td data-label="Data da Compra" class="data-compra">
        ${formatarData(gasto.data)}
        </td>
        <td data-label="Apagar" class="deletar-linha">
          <button class="deletar-gasto-btn deletar-btn" data-row-gasto-btn-id=${gasto.id}>
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>`
    );
  });

  $('.deletar-gasto-btn').click(deletarLinhaGasto);
}

function preencheTabelaVendas(vendas) {
  TABELA_VENDAS.empty();
  vendas.forEach((venda) => {
    TABELA_VENDAS.append(
      `
      <tr data-row-venda-id=${venda.id}>
        <td data-label="Nome do produto">
        ${venda.nome}
        </td>
        <td data-label="Valor">
       ${formatarPreco(venda.valor)}
        </td>
        <td data-label="Data de Venda">
        ${formatarData(venda.data)}
        </td>
        <td data-label="Nome do comprador">
        ${venda.comprador}
        </td>
        <td data-label="Forma de pagamento">
        ${venda.formapagamento}
        </td>
        <td data-label="Apagar">
        <button class="deletar-venda-btn deletar-btn" data-row-venda-btn-id=${venda.id}>
          <i class="fa-solid fa-trash"></i>
        </button>
        </td>
      </tr>`
    );
  });

  $('.deletar-venda-btn').click(deletarLinhaVenda);
}

function deletarLinhaGasto(event) {
  const id = $(event.target).data('row-gasto-btn-id');

  MODAL_CONFIRMACAO.modal('show');

  BTN_CONFIRMAR.on('click', () => {
    const aSenhaEValida = verificaSenha();
    if (!aSenhaEValida) {
      return;
    }

    $.ajax({
      url: `/gasto/${id}`,
      type: 'DELETE',
    })
      .done(() => {
        $(`tr[data-row-gasto-id=${id}]`).remove();
      })
      .fail(exibeMensagemErro);
  });
}

function deletarLinhaVenda(event) {
  const id = $(event.target).data('row-venda-btn-id');

  MODAL_CONFIRMACAO.modal('show');

  BTN_CONFIRMAR.on('click', () => {
    const aSenhaEValida = verificaSenha();
    if (!aSenhaEValida) {
      return;
    }

    $.ajax({
      url: `/venda/${id}`,
      type: 'DELETE',
    })
      .done(() => {
        $(`tr[data-row-venda-id=${id}]`).remove();
      })
      .fail(exibeMensagemErro);
  });
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

const dataPickerConfig = {
  locale: {
    format: 'DD/MM/YY',
  },

  startDate: moment().subtract(1, 'month'),
  endDate: moment(),

  ranges: {
    Hoje: [moment(), moment()],
    Ontem: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Últimos 7 dias': [moment().subtract(6, 'days'), moment()],
    'Últimos 30 dias': [moment().subtract(29, 'days'), moment()],
    'Este mês': [moment().startOf('month'), moment().endOf('month')],
    'Mês passado': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
    ],
  },
};

$(document).ready(() => {
  $('#myModal').on('show.bs.modal', () => {
    // busca os dados de gastos do servidor
    $.get('/gastos').done(preencheTabelaGastos).fail(exibeMensagemErro);
    // busca os dados de vendas do servidor
    $.get('/vendas').done(preencheTabelaVendas).fail(exibeMensagemErro);

    // busca o lucro do servidor
    $.get('/lucro')
      .done((lucro) => {
        // exibe o lucro na página
        $('#lucro').text(lucro);
      })
      .fail(exibeMensagemErro);
  });

  INPUT_DATE.val(moment().format('YYYY-MM-DD'));
  FORM_GASTOS.on('submit', confirmaFormulario);
  FORM_VENDAS.on('submit', confirmaFormulario);
  INPUT_DATERANGE_GASTOS.daterangepicker(dataPickerConfig);
  INPUT_DATERANGE_VENDAS.daterangepicker(dataPickerConfig);

  $('[data-range-key="Custom Range"]').text('Personalizado');
});
