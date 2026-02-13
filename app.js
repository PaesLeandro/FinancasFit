// ==========================================
// ORÇAMENTO PESSOAL - APP.JS
// Sistema de Controle Financeiro Pessoal
// ==========================================

class Bd {
  constructor() {
    this.migrateIfNeeded();
  }

  migrateIfNeeded() {
    const despesas = localStorage.getItem("despesas");
    if (despesas) return;

    const id = localStorage.getItem("id");
    if (!id) {
      localStorage.setItem("despesas", JSON.stringify([]));
      return;
    }

    const arr = [];
    for (let i = 1; i <= parseInt(id); i++) {
      const item = localStorage.getItem(String(i));
      if (!item) continue;
      try {
        const obj = JSON.parse(item);
        if (obj.ano && obj.mes && obj.dia && obj.tipo && obj.descricao && obj.valor) {
          arr.push(obj);
          localStorage.removeItem(String(i));
        }
      } catch (e) {}
    }

    localStorage.removeItem("id");
    localStorage.setItem("despesas", JSON.stringify(arr));
  }

  gravar(d) {
    const arr = JSON.parse(localStorage.getItem("despesas") || "[]");
    arr.push(d);
    localStorage.setItem("despesas", JSON.stringify(arr));
  }

  recuperarTodosRegistros() {
    return JSON.parse(localStorage.getItem("despesas") || "[]");
  }

  pesquisar(despesa) {
    let lista = this.recuperarTodosRegistros();

    if (despesa.ano) lista = lista.filter(d => d.ano === despesa.ano);
    if (despesa.mes) lista = lista.filter(d => d.mes === despesa.mes);
    if (despesa.tipo) lista = lista.filter(d => d.tipo === despesa.tipo);
    if (despesa.descricao) {
      lista = lista.filter(d =>
        d.descricao.toLowerCase().includes(despesa.descricao.toLowerCase())
      );
    }

    return lista;
  }

  remover(index) {
    const arr = JSON.parse(localStorage.getItem("despesas") || "[]");
    arr.splice(index, 1);
    localStorage.setItem("despesas", JSON.stringify(arr));
  }
}

const bd = new Bd();

// ==========================================
// CATEGORIAS
// ==========================================
const categorias = [
  { id: "1", nome: "🍔 Alimentação", cor: "#FF6384" },
  { id: "2", nome: "🎓 Educação", cor: "#36A2EB" },
  { id: "3", nome: "🏠 Moradia", cor: "#FFCE56" },
  { id: "4", nome: "🎮 Lazer", cor: "#4BC0C0" },
  { id: "5", nome: "🚌 Transporte", cor: "#9966FF" },
  { id: "6", nome: "💊 Saúde", cor: "#FF9F40" },
  { id: "7", nome: "💳 Cartão de Crédito", cor: "#C9CBCF" },
  { id: "8", nome: "🛒 Compras", cor: "#FF6384" },
  { id: "9", nome: "📱 Assinaturas", cor: "#36A2EB" },
  { id: "10", nome: "💰 Outros", cor: "#FFCE56" }
];

function preencherCategorias() {
  const selects = document.querySelectorAll("#tipo, #modalTipo");
  selects.forEach(select => {
    select.innerHTML = '<option value="">Selecione</option>';
    categorias.forEach(cat => {
      select.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`;
    });
  });
}

function getNomeCategoria(id) {
  const cat = categorias.find(c => c.id === id);
  return cat ? cat.nome : "Outros";
}

// ==========================================
// CARTÕES DE CRÉDITO
// ==========================================
function getCartoes() {
  return JSON.parse(localStorage.getItem("cartoes") || "[]");
}

function saveCartoes(arr) {
  localStorage.setItem("cartoes", JSON.stringify(arr));
}

function carregarCartoesNoSelect() {
  const select = document.getElementById("modalCartaoVinculado");
  if (!select) return;

  select.innerHTML = '<option value="">Débito / Dinheiro</option>';
  const cartoes = getCartoes();
  cartoes.forEach((c, idx) => {
    select.innerHTML += `<option value="${idx}">${c.nome} - ${c.bandeira}</option>`;
  });
}

// Atualizar lista visual de cartões no modal de gerenciamento
function atualizarListaCartoes() {
  const container = document.getElementById("listaCartoes");
  if (!container) return;

  const cartoes = getCartoes();
  
  if (cartoes.length === 0) {
    container.innerHTML = '<p class="text-muted">Nenhum cartão cadastrado ainda.</p>';
    return;
  }

  container.innerHTML = cartoes.map((c, idx) => `
    <div class="cartao-item">
      <div class="cartao-item-info">
        <strong>${c.nome}</strong> - ${c.bandeira}<br>
        <small class="text-muted">Vencimento: dia ${c.vencimento} | Fechamento: dia ${c.fechamento}</small>
      </div>
      <div class="cartao-item-actions">
        <button class="btn btn-sm btn-outline-primary" onclick="editarCartao(${idx})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluirCartao(${idx})">
          <i class="fas fa-trash"></i> Excluir
        </button>
      </div>
    </div>
  `).join('');
}

// Editar cartão existente
function editarCartao(idx) {
  const cartoes = getCartoes();
  const cartao = cartoes[idx];

  const novoNome = prompt("Novo nome do cartão:", cartao.nome);
  if (novoNome === null) return; // Cancelou
  if (novoNome.trim() === "") {
    alert("⚠️ Nome não pode ser vazio!");
    return;
  }

  const novaBandeira = prompt("Nova bandeira do cartão:", cartao.bandeira);
  if (novaBandeira === null) return;
  if (novaBandeira.trim() === "") {
    alert("⚠️ Bandeira não pode ser vazia!");
    return;
  }

  const novoVencimento = prompt("Novo dia de vencimento (1-31):", cartao.vencimento);
  if (novoVencimento === null) return;
  const venc = parseInt(novoVencimento);
  if (isNaN(venc) || venc < 1 || venc > 31) {
    alert("⚠️ Dia de vencimento inválido!");
    return;
  }

  const novoFechamento = prompt("Novo dia de fechamento (1-31):", cartao.fechamento);
  if (novoFechamento === null) return;
  const fech = parseInt(novoFechamento);
  if (isNaN(fech) || fech < 1 || fech > 31) {
    alert("⚠️ Dia de fechamento inválido!");
    return;
  }

  cartoes[idx] = {
    nome: novoNome.trim(),
    bandeira: novaBandeira.trim(),
    vencimento: venc,
    fechamento: fech
  };

  saveCartoes(cartoes);
  atualizarListaCartoes();
  carregarCartoesNoSelect();
  exibirMensagem("✅ Cartão alterado com sucesso!", "Sucesso", "success");
}

// Excluir cartão
function excluirCartao(idx) {
  const cartoes = getCartoes();
  const cartao = cartoes[idx];
  
  if (!confirm(`Deseja realmente excluir o cartão "${cartao.nome}"?`)) {
    return;
  }

  cartoes.splice(idx, 1);
  saveCartoes(cartoes);
  atualizarListaCartoes();
  carregarCartoesNoSelect();
  exibirMensagem("✅ Cartão excluído com sucesso!", "Sucesso", "success");
}

// Cadastrar novo cartão
if (document.getElementById("btnCadastrarCartao")) {
  document.getElementById("btnCadastrarCartao").addEventListener("click", () => {
    const nome = document.getElementById("nomeCartao").value.trim();
    const bandeira = document.getElementById("bandeiraCartao").value;
    const vencimento = parseInt(document.getElementById("vencimentoCartao").value);
    const fechamento = parseInt(document.getElementById("fechamentoCartao").value);

    if (!nome || !bandeira || !vencimento || !fechamento) {
      alert("⚠️ Preencha todos os campos do cartão!");
      return;
    }

    if (vencimento < 1 || vencimento > 31 || fechamento < 1 || fechamento > 31) {
      alert("⚠️ Dias devem estar entre 1 e 31!");
      return;
    }

    const cartoes = getCartoes();
    cartoes.push({ nome, bandeira, vencimento, fechamento });
    saveCartoes(cartoes);

    document.getElementById("nomeCartao").value = "";
    document.getElementById("bandeiraCartao").value = "";
    document.getElementById("vencimentoCartao").value = "";
    document.getElementById("fechamentoCartao").value = "";

    atualizarListaCartoes();
    carregarCartoesNoSelect();
    exibirMensagem("✅ Cartão cadastrado com sucesso!", "Sucesso", "success");
  });
}

// ==========================================
// CÁLCULO DE VENCIMENTO
// ==========================================
function calcularVencimento(dataCompra, cartao) {
  if (!cartao) return dataCompra;

  const [ano, mes, dia] = dataCompra.split("-").map(Number);
  let mesVenc = mes;
  let anoVenc = ano;

  if (dia <= cartao.fechamento) {
    // Compra dentro do ciclo atual
    mesVenc = mes;
  } else {
    // Compra após fechamento - vai para próximo mês
    mesVenc = mes + 1;
    if (mesVenc > 12) {
      mesVenc = 1;
      anoVenc++;
    }
  }

  return `${anoVenc}-${String(mesVenc).padStart(2, "0")}-${String(cartao.vencimento).padStart(2, "0")}`;
}

// ==========================================
// TOGGLE PARCELAS
// ==========================================
function toggleParcelas() {
  const checked = document.getElementById("checkParcelado").checked;
  document.getElementById("divParcelas").style.display = checked ? "block" : "none";
}

// ==========================================
// CADASTRAR DESPESA
// ==========================================
function cadastrarDespesa() {
  const data = document.getElementById("modalData").value;
  const tipo = document.getElementById("modalTipo").value;
  const descricao = document.getElementById("modalDescricao").value.trim();
  const valorStr = document.getElementById("modalValor").value.replace(",", ".");
  const valor = parseFloat(valorStr);
  const cartaoIdx = document.getElementById("modalCartaoVinculado").value;

  if (!data || !tipo || !descricao || isNaN(valor) || valor <= 0) {
    exibirMensagem("⚠️ Preencha todos os campos corretamente!", "Erro", "danger");
    return;
  }

  const cartoes = getCartoes();
  const cartao = cartaoIdx !== "" ? cartoes[parseInt(cartaoIdx)] : null;

  const isParcelado = document.getElementById("checkParcelado").checked;
  const qtdParcelas = isParcelado ? parseInt(document.getElementById("modalQtdParcelas").value) : 1;

  if (qtdParcelas < 1 || qtdParcelas > 48) {
    exibirMensagem("⚠️ Número de parcelas inválido!", "Erro", "danger");
    return;
  }

  const valorParcela = valor / qtdParcelas;

  for (let i = 0; i < qtdParcelas; i++) {
    const dataCompra = new Date(data + "T00:00:00");
    dataCompra.setMonth(dataCompra.getMonth() + i);

    const dataVenc = cartao
      ? calcularVencimento(dataCompra.toISOString().split("T")[0], cartao)
      : dataCompra.toISOString().split("T")[0];

    const [anoVenc, mesVenc, diaVenc] = dataVenc.split("-");

    const descFinal = qtdParcelas > 1
      ? `${descricao} (${i + 1}/${qtdParcelas})`
      : descricao;

    const despesa = {
      ano: anoVenc,
      mes: mesVenc,
      dia: diaVenc,
      tipo: tipo,
      descricao: descFinal,
      valor: valorParcela.toFixed(2),
      cartao: cartao ? cartao.nome : ""
    };

    bd.gravar(despesa);
  }

  $("#modalCadastrarDespesa").modal("hide");
  exibirMensagem(
    `✅ ${qtdParcelas > 1 ? qtdParcelas + " parcelas" : "Despesa"} cadastrada com sucesso!`,
    "Sucesso",
    "success"
  );

  // Limpar formulário
  document.getElementById("modalData").value = "";
  document.getElementById("modalTipo").value = "";
  document.getElementById("modalDescricao").value = "";
  document.getElementById("modalValor").value = "";
  document.getElementById("modalCartaoVinculado").value = "";
  document.getElementById("checkParcelado").checked = false;
  toggleParcelas();

  // Atualizar resumo se estiver na página index
  if (typeof atualizarResumoDespesas === "function") {
    atualizarResumoDespesas();
  }
}

// ==========================================
// CARREGAR LISTA DE DESPESAS
// ==========================================
function carregaListaDespesas(despesas = [], filtro = false) {
  if (despesas.length === 0 && !filtro) {
    despesas = bd.recuperarTodosRegistros();
  }

  // Ordenar por data
  despesas.sort((a, b) => {
    const dateA = new Date(a.ano, a.mes - 1, a.dia);
    const dateB = new Date(b.ano, b.mes - 1, b.dia);
    return dateA - dateB;
  });

  const lista = document.getElementById("listaDespesas");
  if (!lista) return;

  lista.innerHTML = "";

  despesas.forEach((d, idx) => {
    const dataVenc = `${String(d.dia).padStart(2, "0")}/${String(d.mes).padStart(2, "0")}/${d.ano}`;
    const valorFormatado = `R$ ${parseFloat(d.valor).toFixed(2).replace(".", ",")}`;

    const linha = `
      <tr class="fade-in-row">
        <td>${dataVenc}</td>
        <td>${d.cartao || getNomeCategoria(d.tipo)}</td>
        <td>${d.descricao}</td>
        <td class="text-right"><strong>${valorFormatado}</strong></td>
        <td class="text-center">
          <button class="btn btn-danger btn-sm" onclick="removerDespesa(${idx})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
    lista.innerHTML += linha;
  });
}

// ==========================================
// PESQUISAR DESPESA
// ==========================================
function pesquisarDespesa() {
  const ano = document.getElementById("ano").value;
  const mes = document.getElementById("mes").value;
  const tipo = document.getElementById("tipo").value;
  const descricao = document.getElementById("descricao").value;

  const despesa = { ano, mes, tipo, descricao };
  const resultado = bd.pesquisar(despesa);
  carregaListaDespesas(resultado, true);
}

// ==========================================
// REMOVER DESPESA COM UNDO
// ==========================================
let undoTimeout = null;
let removedItem = null;
let removedIndex = null;

function removerDespesa(idx) {
  const arr = bd.recuperarTodosRegistros();
  removedItem = arr[idx];
  removedIndex = idx;

  bd.remover(idx);
  carregaListaDespesas();

  mostrarUndo();
  if (typeof atualizarResumoDespesas === "function") {
    atualizarResumoDespesas();
  }
}

function mostrarUndo() {
  clearTimeout(undoTimeout);

  const panel = document.getElementById("undoPanel");
  panel.innerHTML = `
    <div class="undo-toast">
      <span>✅ Despesa removida</span>
      <button onclick="desfazerRemocao()">↩️ Desfazer</button>
    </div>
  `;
  panel.style.display = "block";

  undoTimeout = setTimeout(() => {
    panel.style.display = "none";
    removedItem = null;
    removedIndex = null;
  }, 5000);
}

function desfazerRemocao() {
  if (!removedItem) return;

  const arr = bd.recuperarTodosRegistros();
  arr.splice(removedIndex, 0, removedItem);
  localStorage.setItem("despesas", JSON.stringify(arr));

  carregaListaDespesas();
  document.getElementById("undoPanel").style.display = "none";
  clearTimeout(undoTimeout);

  if (typeof atualizarResumoDespesas === "function") {
    atualizarResumoDespesas();
  }
}

// ==========================================
// EXIBIR MENSAGEM MODAL
// ==========================================
function exibirMensagem(msg, titulo, tipo) {
  const modalTitulo = document.getElementById("modal_titulo");
  const modalConteudo = document.getElementById("modal_conteudo");
  const modalDiv = document.getElementById("modal_titulo_div");

  modalTitulo.textContent = titulo;
  modalConteudo.innerHTML = msg;

  modalDiv.className = "modal-header";
  if (tipo === "success") modalDiv.classList.add("text-success");
  else if (tipo === "danger") modalDiv.classList.add("text-danger");

  $("#modalRegistraDespesa").modal("show");
}

// ==========================================
// RESUMO E GRÁFICO (INDEX.HTML)
// ==========================================
function atualizarResumoDespesas() {
  const despesas = bd.recuperarTodosRegistros();
  const total = despesas.reduce((sum, d) => sum + parseFloat(d.valor), 0);

  const resumoDiv = document.getElementById("resumoDespesas");
  if (!resumoDiv) return;

  const porCategoria = {};
  despesas.forEach(d => {
    const cat = getNomeCategoria(d.tipo);
    porCategoria[cat] = (porCategoria[cat] || 0) + parseFloat(d.valor);
  });

  let html = `
    <div class="row">
      <div class="col-md-6">
        <h6>💰 Total Geral</h6>
        <h3 class="text-primary">R$ ${total.toFixed(2).replace(".", ",")}</h3>
      </div>
      <div class="col-md-6">
        <h6>📊 Total de Registros</h6>
        <h3>${despesas.length}</h3>
      </div>
    </div>
    <hr>
    <h6>Por Categoria:</h6>
    <ul class="list-unstyled">
  `;

  Object.entries(porCategoria).forEach(([cat, val]) => {
    html += `<li>${cat}: <strong>R$ ${val.toFixed(2).replace(".", ",")}</strong></li>`;
  });

  html += "</ul>";
  resumoDiv.innerHTML = html;

  // Atualizar gráfico
  atualizarGrafico(porCategoria);
}

let graficoInstance = null;

function atualizarGrafico(porCategoria) {
  const canvas = document.getElementById("graficoDespesas");
  if (!canvas) return;

  const labels = Object.keys(porCategoria);
  const data = Object.values(porCategoria);
  const cores = labels.map(label => {
    const cat = categorias.find(c => c.nome === label);
    return cat ? cat.cor : "#CCCCCC";
  });

  if (graficoInstance) {
    graficoInstance.destroy();
  }

  graficoInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: cores,
        borderWidth: 2,
        borderColor: "#fff"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const valor = context.parsed;
              return `${context.label}: R$ ${valor.toFixed(2).replace(".", ",")}`;
            }
          }
        }
      }
    }
  });
}

// ==========================================
// EXPORTAR PDF COM CARTÕES (CONSULTA)
// ==========================================
function exportDespesasToPdf() {
  const despesas = bd.recuperarTodosRegistros();
  if (despesas.length === 0) {
    alert("⚠️ Nenhuma despesa para exportar!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("💰 Orçamento Pessoal - Relatório", 14, 20);

  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 28);

  // Agrupar por cartão
  const porCartao = {};
  despesas.forEach(d => {
    const key = d.cartao || "Débito/Dinheiro";
    if (!porCartao[key]) porCartao[key] = [];
    porCartao[key].push(d);
  });

  let y = 40;

  Object.entries(porCartao).forEach(([cartao, lista]) => {
    const totalCartao = lista.reduce((sum, d) => sum + parseFloat(d.valor), 0);

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(`💳 ${cartao}`, 14, y);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    y += 6;

    const rows = lista.map(d => [
      `${d.dia}/${d.mes}/${d.ano}`,
      d.descricao,
      `R$ ${parseFloat(d.valor).toFixed(2).replace(".", ",")}`
    ]);

    doc.autoTable({
      startY: y,
      head: [["Data", "Descrição", "Valor"]],
      body: rows,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    y = doc.lastAutoTable.finalY + 8;

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(
      `Total: R$ ${totalCartao.toFixed(2).replace(".", ",")}`,
      14,
      y
    );
    doc.setFont(undefined, "normal");
    y += 10;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("orcamento-pessoal.pdf");
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  preencherCategorias();
  carregarCartoesNoSelect();
  atualizarListaCartoes();

  if (typeof atualizarResumoDespesas === "function") {
    atualizarResumoDespesas();
  }

  // Definir data de hoje no input de data
  const inputData = document.getElementById("modalData");
  if (inputData) {
    const hoje = new Date().toISOString().split("T")[0];
    inputData.value = hoje;
  }
});
