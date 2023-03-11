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
const INPUT_FILTRAR_DATA_GASTOS = $('input[name="date-range-gastos"]');
const INPUT_FILTRAR_DATA_VENDAS = $('input[name="date-range-vendas"]');
const BTN_FILTRAR_GASTOS = $('#filtrarGastos');
const BTN_FILTRAR_VENDAS = $('#filtrarVendas');
let GASTOS = [{ id: 1, valor: 0 }];
let VENDAS = [{ id: 1, valor: 0 }];

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

function formatarPorcentagem(porcentagem) {
  const porcentagemFormatada = porcentagem.toFixed(2).replace('.', ',') + '%';
  return porcentagemFormatada;
}

function preencheTabelaGastos(gastos) {
  TABELA_GASTOS.empty();
  GASTOS = gastos;
  atualizarRelatorio();
  gastos.forEach((gasto) => {
    TABELA_GASTOS.append(
      `
      <tr data-row-gasto-id=${gasto.id} class="tabela-linha">
        <td data-label="Nome do produto" class="nome-produto">
        ${gasto.nome}
        </td>
        <td data-label="Valor" class="valor-produto valor-gasto">
        ${formatarPreco(gasto.valor)}
        </td>
        <td data-label="Data da Compra" class="data">
        ${formatarData(gasto.data)}
        </td>
        <td data-label="Apagar" class="deletar-linha">
          <button class="deletar-gasto-btn deletar-btn" data-row-gasto-btn-id=${gasto.id}>
            <i class="fa-solid fa-trash" data-row-gasto-btn-id=${gasto.id}></i>
          </button>
        </td>
      </tr>`
    );
  });

  $('.deletar-gasto-btn').click(deletarLinhaGasto);
}

function preencheTabelaVendas(vendas) {
  TABELA_VENDAS.empty();
  VENDAS = vendas;
  atualizarRelatorio();
  vendas.forEach((venda) => {
    TABELA_VENDAS.append(
      `
      <tr data-row-venda-id=${venda.id}>
        <td data-label="Nome do produto" class="nome-produto">
        ${venda.nome}
        </td>
        <td data-label="Valor" class="valor-produto valor-venda">
       ${formatarPreco(venda.valor)}
        </td>
        <td data-label="Data de Venda" class="data">
        ${formatarData(venda.data)}
        </td>
        <td data-label="Nome do comprador" class="nome-comprador">
        ${venda.comprador}
        </td>
        <td data-label="Forma de pagamento" class="forma-pagamento">
          <div>${venda.formapagamento}</div>
          <i class="${pegarIconeDePagamento(venda.formapagamento)} icone-pagamento"></i>
        </td>
        <td data-label="Apagar" class="deletar-linha">
        <button class="deletar-venda-btn deletar-btn" data-row-venda-btn-id=${venda.id}>
          <i class="fa-solid fa-trash" data-row-venda-btn-id=${venda.id}></i>
        </button>
        </td>
      </tr>`
    );
  });

  $('.deletar-venda-btn').click(deletarLinhaVenda);
}

function pegarIconeDePagamento(formaPagamento) {
  switch (formaPagamento) {
    case 'Dinheiro':
      return 'fa-solid fa-money-bill';
    case 'Cartão de crédito':
      return 'fa-solid fa-credit-card';
    case 'Cartão de débito':
      return 'fa-regular fa-credit-card';
    case 'Pix':
      return 'fa-brands fa-pix';
    default:
      return 'fa-solid fa-money-bill';
  }
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
        const encontraGasto = GASTOS.find((gasto) => gasto.id === id);
        GASTOS.splice(GASTOS.indexOf(encontraGasto), 1);
        atualizarRelatorio();
      })
      .fail(exibeMensagemErro);
  });
}

function deletarLinhaVenda(event) {
  const id = $(event.target).data('row-venda-btn-id');

  console.log(id);

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
        const encontraVenda = VENDAS.find((venda) => venda.id === id);
        VENDAS.splice(VENDAS.indexOf(encontraVenda), 1);
        atualizarRelatorio();
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

function filtrarDataTabela(tipo, inicio, fim) {

  $.ajax({
    url: `/${tipo}s-filtrados-por-data`,
    type: 'GET',
    data: {
      inicio,
      fim,
    },
  })
    .done((gastos) => {
      tipo === 'gasto' ? preencheTabelaGastos(gastos) : preencheTabelaVendas(gastos);
    })
    .fail(exibeMensagemErro);
}

function aplicarFiltro(event, picker) {
  const tipo = $(event.target).data('tipo');
  const inicio = picker.startDate.format('YYYY-MM-DD');
  const fim = picker.endDate.format('YYYY-MM-DD');

  filtrarDataTabela(tipo, inicio, fim);
}

function pegarTotalVendas() {
  const totalVendas = VENDAS.reduce((prev, crr) => prev + crr.valor, 0);
  return totalVendas;
}

function pegarTotalGastos() {
  const totalGastos = GASTOS.reduce((prev, crr) => prev + crr.valor, 0);
  return totalGastos;
}

function pegarTotalLucro() {
  const totalVendas = pegarTotalVendas();
  const totalGastos = pegarTotalGastos();

  const totalLucro = totalVendas - totalGastos;

  return totalLucro;
}

function porcentagemDeLucro() {
  const valorTotalVenda = pegarTotalVendas();
  const valorTotalLucro = pegarTotalLucro();

  const porcentagemDeLucro = (valorTotalLucro / valorTotalVenda) * 100;

  return isNaN(porcentagemDeLucro) || !isFinite(porcentagemDeLucro) ? 0 : porcentagemDeLucro;
}

function atualizarRelatorio() {
  const totalVendas = pegarTotalVendas();
  const totalGastos = pegarTotalGastos();
  const totalLucro = pegarTotalLucro();
  const porcentagemLucro = porcentagemDeLucro();

  $('#total-vendas').text(formatarPreco(totalVendas));
  $('#total-gastos').text(formatarPreco(totalGastos));
  $('#total-lucro').text(formatarPreco(totalLucro));
  $('#porcentagem-lucro').text(formatarPorcentagem(porcentagemLucro));
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
    'Todo o período': [moment('2021-01-01'), moment()],
  },
};

$(document).ready(() => {
  $('#myModal').on('show.bs.modal', () => {
    // busca os dados de gastos do servidor
    $.get('/gastos').done(preencheTabelaGastos).fail(exibeMensagemErro);
    // busca os dados de vendas do servidor
    $.get('/vendas').done(preencheTabelaVendas).fail(exibeMensagemErro);
  });

  INPUT_DATE.val(moment().format('YYYY-MM-DD'));
  FORM_GASTOS.on('submit', confirmaFormulario);
  FORM_VENDAS.on('submit', confirmaFormulario);
  INPUT_FILTRAR_DATA_GASTOS.daterangepicker(dataPickerConfig).on('apply.daterangepicker', aplicarFiltro);
  INPUT_FILTRAR_DATA_VENDAS.daterangepicker(dataPickerConfig).on('apply.daterangepicker', aplicarFiltro);

  $('[data-range-key="Custom Range"]').text('Personalizado');
});
