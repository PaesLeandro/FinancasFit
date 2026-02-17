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
    if (despesa.mes) {
      const mesPadded = String(despesa.mes).padStart(2, "0");
      lista = lista.filter(d => d.mes === mesPadded);
    }
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
    const isFilter = select.id === "tipo";
    const defaultText = isFilter ? "Todas as categorias" : "Selecione";
    select.innerHTML = `<option value="">${defaultText}</option>`;
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
  carregarCartoesNoPdfImport();
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
  carregarCartoesNoPdfImport();
  exibirMensagem("✅ Cartão excluído com sucesso!", "Sucesso", "success");
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
    // Compra dentro do ciclo atual: vence no mês seguinte
    mesVenc = mes + 1;
  } else {
    // Compra após fechamento: vence no mês seguinte ao próximo
    mesVenc = mes + 2;
  }

  while (mesVenc > 12) {
    mesVenc -= 12;
    anoVenc++;
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

function parseValorInput(valorStr) {
  const limpo = valorStr.replace(/\./g, "").replace(",", ".");
  return parseFloat(limpo);
}

// ==========================================
// CADASTRAR DESPESA
// ==========================================
function cadastrarDespesa() {
  const data = document.getElementById("modalData").value;
  const tipo = document.getElementById("modalTipo").value;
  const descricao = document.getElementById("modalDescricao").value.trim();
  const valorStr = document.getElementById("modalValor").value.trim();
  const valor = parseValorInput(valorStr);
  const cartaoIdx = document.getElementById("modalCartaoVinculado").value;

  if (!data || !tipo || descricao.length < 3 || isNaN(valor) || valor <= 0) {
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

  const todosDespesas = bd.recuperarTodosRegistros();
  const indiceMap = new Map();
  todosDespesas.forEach((item, idx) => {
    const key = `${item.ano}|${item.mes}|${item.dia}|${item.descricao}|${item.valor}|${item.tipo}`;
    if (!indiceMap.has(key)) indiceMap.set(key, []);
    indiceMap.get(key).push(idx);
  });

  lista.innerHTML = "";

  despesas.forEach((d) => {
    // Encontrar índice real no banco de dados
    const key = `${d.ano}|${d.mes}|${d.dia}|${d.descricao}|${d.valor}|${d.tipo}`;
    const indices = indiceMap.get(key) || [];
    const indiceReal = indices.length ? indices.shift() : -1;

    const dataVenc = `${String(d.dia).padStart(2, "0")}/${String(d.mes).padStart(2, "0")}/${d.ano}`;
    const valorFormatado = `R$ ${parseFloat(d.valor).toFixed(2).replace(".", ",")}`;

    const linha = `
      <tr class="fade-in-row">
        <td>
          <input type="checkbox" class="checkDespesa" value="${indiceReal}" onchange="atualizarBotaoExcluir()" />
        </td>
        <td>${dataVenc}</td>
        <td>${d.cartao || getNomeCategoria(d.tipo)}</td>
        <td>${d.descricao}</td>
        <td class="text-right"><strong>${valorFormatado}</strong></td>
        <td class="text-center">
          <button class="btn btn-outline-primary btn-sm mr-1" onclick="editarValorDespesa(${indiceReal})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="removerDespesa(${indiceReal})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
    lista.innerHTML += linha;
  });
  
  // Resetar checkbox de selecionar todos
  const checkAll = document.getElementById("checkAll");
  if (checkAll) checkAll.checked = false;
  atualizarBotaoExcluir();
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
  
  // Recarregar lista com filtros mantidos
  const ano = document.getElementById("ano")?.value || "";
  const mes = document.getElementById("mes")?.value || "";
  const tipo = document.getElementById("tipo")?.value || "";
  const descricao = document.getElementById("descricao")?.value || "";
  
  if (ano || mes || tipo || descricao) {
    const resultado = bd.pesquisar({ ano, mes, tipo, descricao });
    carregaListaDespesas(resultado, true);
  } else {
    carregaListaDespesas();
  }

  mostrarUndo();
  if (typeof atualizarResumoDespesas === "function") {
    atualizarResumoDespesas();
  }
}

function editarValorDespesa(idx) {
  const arr = bd.recuperarTodosRegistros();
  const item = arr[idx];
  if (!item) return;

  const valorAtual = parseFloat(item.valor).toFixed(2).replace(".", ",");
  const novoValorStr = prompt("Novo valor (ex: 123,45):", valorAtual);
  if (novoValorStr === null) return;

  const novoValor = parseValorInput(novoValorStr.trim());
  if (isNaN(novoValor) || novoValor <= 0) {
    alert("⚠️ Valor inválido!");
    return;
  }
  item.valor = novoValor.toFixed(2);
  localStorage.setItem("despesas", JSON.stringify(arr));

  const ano = document.getElementById("ano")?.value || "";
  const mes = document.getElementById("mes")?.value || "";
  const tipo = document.getElementById("tipo")?.value || "";
  const descricao = document.getElementById("descricao")?.value || "";

  if (ano || mes || tipo || descricao) {
    const resultado = bd.pesquisar({ ano, mes, tipo, descricao });
    carregaListaDespesas(resultado, true);
  } else {
    carregaListaDespesas();
  }

  if (typeof atualizarResumoDespesas === "function") {
    atualizarResumoDespesas();
  }
}

// ==========================================
// SELEÇÃO MÚLTIPLA
// ==========================================
function toggleTodos() {
  const checkAll = document.getElementById("checkAll");
  const checkboxes = document.querySelectorAll(".checkDespesa");
  checkboxes.forEach(cb => cb.checked = checkAll.checked);
  atualizarBotaoExcluir();
}

function atualizarBotaoExcluir() {
  const checkboxes = document.querySelectorAll(".checkDespesa:checked");
  const btn = document.getElementById("btnExcluirSelecionados");
  if (btn) {
    btn.style.display = checkboxes.length > 0 ? "inline-block" : "none";
  }
}

function excluirDespesasSelecionadas() {
  const checkboxes = document.querySelectorAll(".checkDespesa:checked");
  const indices = Array.from(checkboxes).map(cb => parseInt(cb.value));
  
  if (indices.length === 0) return;
  
  if (!confirm(`Deseja excluir ${indices.length} despesa(s) selecionada(s)?`)) return;
  
  // Ordenar do maior para o menor para não afetar os índices
  indices.sort((a, b) => b - a);
  
  indices.forEach(idx => bd.remover(idx));
  
  // Recarregar lista mantendo os filtros atuais
  const ano = document.getElementById("ano")?.value || "";
  const mes = document.getElementById("mes")?.value || "";
  const tipo = document.getElementById("tipo")?.value || "";
  const descricao = document.getElementById("descricao")?.value || "";
  
  if (ano || mes || tipo || descricao) {
    // Se há filtros, aplicar pesquisa
    const resultado = bd.pesquisar({ ano, mes, tipo, descricao });
    carregaListaDespesas(resultado, true);
  } else {
    // Se não há filtros, recarregar tudo
    carregaListaDespesas();
  }
  
  if (typeof atualizarResumoDespesas === "function") {
    atualizarResumoDespesas();
  }
  
  alert(`✅ ${indices.length} despesa(s) excluída(s) com sucesso!`);
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

  // Formatar total com separador de milhar
  const totalFormatado = total.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  let html = `
    <div class="row">
      <div class="col-md-6">
        <h6>💰 Total Geral</h6>
        <h3 class="text-primary">R$ ${totalFormatado}</h3>
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
    const valFormatado = val.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    html += `<li>${cat}: <strong>R$ ${valFormatado}</strong></li>`;
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
  doc.text("Orcamento Pessoal - Relatorio", 14, 20);

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
    doc.text(`Cartao: ${cartao}`, 14, y);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    y += 6;

    const rows = lista.map(d => [
      `${d.dia}/${d.mes}/${d.ano}`,
      d.descricao,
      `R$ ${parseFloat(d.valor).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
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
    const totalCartaoFormatado = totalCartao.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    doc.text(
      `Total: R$ ${totalCartaoFormatado}`,
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
// EXPORTAR / IMPORTAR CSV
// ==========================================
function csvEscape(value) {
  const str = String(value ?? "");
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function parseCsvText(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (char === ',') {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }

    if (char === '\n' || char === '\r') {
      row.push(field);
      field = "";
      if (row.some(col => col !== "")) rows.push(row);
      row = [];
      if (char === '\r' && text[i + 1] === '\n') i += 2;
      else i += 1;
      continue;
    }

    field += char;
    i += 1;
  }

  if (field !== "" || row.length) {
    row.push(field);
    if (row.some(col => col !== "")) rows.push(row);
  }

  return rows;
}

function exportDespesasToCsv() {
  const despesas = bd.recuperarTodosRegistros();
  if (despesas.length === 0) {
    alert("⚠️ Nenhuma despesa para exportar!");
    return;
  }

  const header = ["ano", "mes", "dia", "tipo", "descricao", "valor", "cartao"];
  const rows = despesas.map(d => [
    d.ano,
    d.mes,
    d.dia,
    d.tipo,
    d.descricao,
    d.valor,
    d.cartao || ""
  ]);

  const csv = [header, ...rows]
    .map(row => row.map(csvEscape).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "orcamento-pessoal.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================
// IMPORTAR DESPESAS DE PDF
// ==========================================
async function importarDespesasDePdf() {
  console.log("Iniciando importacao de PDF...");
  
  const input = document.getElementById("inputPdfFatura");
  const cartaoIdx = document.getElementById("pdfCartaoImport").value;
  const statusDiv = document.getElementById("pdfImportStatus");
  const messageSpan = document.getElementById("pdfImportMessage");

  console.log("Elementos encontrados:", { input, statusDiv, messageSpan });

  if (!input || !input.files || input.files.length === 0) {
    alert("⚠️ Selecione um arquivo PDF!");
    return;
  }

  const file = input.files[0];
  console.log("Arquivo selecionado:", file.name);
  
  if (typeof window.pdfjsLib === "undefined") {
    alert("⚠️ Biblioteca PDF não carregada. Recarregue a página.");
    console.error("PDF.js não está disponível");
    return;
  }

  console.log("PDF.js carregado:", window.pdfjsLib);

  if (statusDiv) statusDiv.style.display = "block";
  if (messageSpan) messageSpan.textContent = "📄 Processando PDF...";

  try {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    
    console.log("Worker configurado");

    const arrayBuffer = await file.arrayBuffer();
    console.log("ArrayBuffer criado, tamanho:", arrayBuffer.byteLength);
    
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log("PDF carregado, páginas:", pdf.numPages);

    const despesasEncontradas = [];
    const despesasProcessadas = new Set(); // Para evitar duplicatas
    const cartoes = getCartoes();
    const cartaoSelecionado = cartaoIdx !== "" ? cartoes[parseInt(cartaoIdx)] : null;

    console.log("Cartão selecionado:", cartaoSelecionado);

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`\n========== PÁGINA ${pageNum} ==========`);
      
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const texto = textContent.items.map(item => item.str).join(" ");

      console.log(`TEXTO COMPLETO da página ${pageNum}:\n`, texto);
      console.log(`\n========== FIM TEXTO ==========\n`);

      // Tenta múltiplos padrões para maior compatibilidade
      // Padrão 1: DD/MM Descrição Cidade Valor,XX (com suporte a separador de milhar: 1.150,23)
      // Padrão 2: DD/MM Descrição Parcela X de Y ... Valor,XX
      const padrao1 = /(\d{2}\/\d{2})\s+(.+?)\s+([A-Z\s]+)\s+(\d+(?:\.\d{3})*,\d{2})/gi;
      const padrao2 = /(\d{2}\/\d{2})\s+(.+?)\s+[Pp]arcela\s+\d+\s+de\s+\d+\s+(.+?)\s+(\d+(?:\.\d{3})*,\d{2})/gi;
      
      let matches = [];
      let match;
      
      // Tenta primeiro padrão
      while ((match = padrao1.exec(texto)) !== null) {
        matches.push({
          data: match[1],
          desc: match[2].trim(),
          cidade: match[3].trim(),
          valor: match[4],
          tipo: 'normal'
        });
      }
      
      // Tenta segundo padrão (com Parcela)
      while ((match = padrao2.exec(texto)) !== null) {
        matches.push({
          data: match[1],
          desc: match[2].trim(),
          cidade: match[3].trim(),
          valor: match[4],
          tipo: 'parcela'
        });
      }
      
      let matchCount = 0;
      for (const m of matches) {
        matchCount++;
        const dataStr = m.data;
        let descricao = m.desc;
        const cidade = m.cidade;
        const valorStr = m.valor;

        console.log(`\n✓ Match ${matchCount}:`, { 
          data: dataStr, 
          descricao: descricao.substring(0, 50),
          cidade: cidade.substring(0, 30),
          valor: valorStr 
        });

        // Criar chave única MAIS ROBUSTA (normalizar espaços, remover caracteres especiais)
        const descricaoNormalizada = descricao.replace(/\s+/g, ' ').trim().toLowerCase();
        const cidadeNormalizada = cidade.replace(/\s+/g, ' ').trim().toLowerCase();
        const chaveUnicaBruta = `${dataStr}|${descricaoNormalizada.substring(0, 40)}|${cidadeNormalizada.substring(0, 20)}|${valorStr}`;
        
        if (despesasProcessadas.has(chaveUnicaBruta)) {
          console.log("  ✗ Despesa duplicada (já capturada), ignorando");
          continue;
        }
        
        despesasProcessadas.add(chaveUnicaBruta);

        // Filtrar linhas indesejadas (incluindo variações de "total")
        const descricaoLower = descricao.toLowerCase();
        const cidadeLower = cidade.toLowerCase();
        const textoCompleto = (descricaoLower + " " + cidadeLower).toLowerCase();
        
        const palavrasIgnorar = [
          "total para", 
          "total da fatura", 
          "fatura em real",
          "previsão de fechamento", 
          "limite de compras", 
          "saldo devedor",
          "valor total",
          "total em real"
        ];
        
        const deveIgnorar = palavrasIgnorar.some(palavra => textoCompleto.includes(palavra));
        
        if (deveIgnorar || descricao.length < 3) {
          console.log("  ✗ Ignorado (palavra-chave de metadados)");
          continue;
        }

        // Parse data - inferir ano baseado no mês da compra e mês atual
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();
        const mesAtual = dataAtual.getMonth() + 1; // 0-11 para 1-12
        
        const [dia, mes] = dataStr.split("/");
        const mesCompra = parseInt(mes);
        
        // Se a compra é de um mês futuro (ex: compra em agosto mas estamos em fevereiro),
        // assume que é do ano anterior
        let anoCompra = anoAtual;
        if (mesCompra > mesAtual + 1) { // +1 de margem
          anoCompra = anoAtual - 1;
          console.log(`  → Mês da compra (${mesCompra}) é futuro, usando ano anterior: ${anoCompra}`);
        }
        
        if (!dia || !mes) {
          console.log("  ✗ Data inválida");
          continue;
        }

        // Combinar descrição com cidade
        descricao = `${descricao.substring(0, 50)} - ${cidade.substring(0, 20)}`.trim();

        // Parse valor - formato brasileiro XX,XX ou 1.150,23 (com separador de milhar)
        // Primeiro remove ponto de milhar, depois converte vírgula em ponto
        const valorLimpo = valorStr.replace(".", "").replace(",", ".");
        const valor = parseFloat(valorLimpo);
        
        console.log(`  → Valor parseado: ${valor}`);
        
        if (isNaN(valor) || valor <= 0) {
          console.log("  ✗ Valor inválido");
          continue;
        }
        
        if (valor > 5000) {
          console.log(`  ✗ Valor muito alto (${valor}), provavelmente é total da fatura. Pulando...`);
          continue;
        }

        // Calcular vencimento se houver cartão
        let dataVenc;
        if (cartaoSelecionado) {
          const dataCompra = `${anoCompra}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
          dataVenc = calcularVencimento(dataCompra, cartaoSelecionado);
        } else {
          dataVenc = `${anoCompra}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
        }

        const [anoVenc, mesVenc, diaVenc] = dataVenc.split("-");

        despesasEncontradas.push({
          ano: anoVenc,
          mes: mesVenc,
          dia: diaVenc,
          tipo: "10", // Outros
          descricao: descricao.substring(0, 100),
          valor: valor.toFixed(2),
          cartao: cartaoSelecionado ? cartaoSelecionado.nome : ""
        });
        
        console.log("  ✓ Despesa adicionada:", despesasEncontradas[despesasEncontradas.length - 1]);
      }
    } // Fecha o loop for das páginas

    console.log(`\n========== RESUMO ==========`);
    console.log(`Total de despesas encontradas: ${despesasEncontradas.length}`);

    if (despesasEncontradas.length === 0) {
      if (messageSpan) {
        messageSpan.innerHTML = `⚠️ Nenhuma despesa encontrada no PDF.<br><small>Verifique o console (F12) para ver o texto extraído e envie para análise.</small>`;
      }
      console.warn("❌ NENHUMA DESPESA ENCONTRADA!");
      console.warn("Por favor, copie o 'TEXTO COMPLETO' acima e envie para ajustarmos a regex.");
      setTimeout(() => { if (statusDiv) statusDiv.style.display = "none"; }, 8000);
      return;
    }

    // Verificar duplicatas com despesas já existentes no localStorage
    const despesasExistentes = bd.recuperarTodosRegistros();
    const despesasNovas = [];
    let duplicatasIgnoradas = 0;
    
    despesasEncontradas.forEach(nova => {
      const isDuplicata = despesasExistentes.some(existente => {
        return existente.ano === nova.ano &&
               existente.mes === nova.mes &&
               existente.dia === nova.dia &&
               existente.descricao.toLowerCase().trim() === nova.descricao.toLowerCase().trim() &&
               parseFloat(existente.valor) === parseFloat(nova.valor);
      });
      
      if (isDuplicata) {
        console.log("  ✗ Despesa já existe no banco, ignorando:", nova);
        duplicatasIgnoradas++;
      } else {
        despesasNovas.push(nova);
      }
    });

    console.log(`Despesas novas: ${despesasNovas.length}, Duplicatas ignoradas: ${duplicatasIgnoradas}`);

    // Gravar apenas despesas novas
    console.log("Gravando despesas novas...");
    despesasNovas.forEach(d => bd.gravar(d));

    if (messageSpan) {
      if (despesasNovas.length > 0) {
        messageSpan.textContent = `✅ ${despesasNovas.length} despesa(s) importada(s) com sucesso!${duplicatasIgnoradas > 0 ? ` (${duplicatasIgnoradas} duplicata(s) ignorada(s))` : ''}`;
      } else {
        messageSpan.innerHTML = `⚠️ Todas as despesas já foram importadas anteriormente.<br><small>${duplicatasIgnoradas} duplicata(s) ignorada(s).</small>`;
      }
    }
    input.value = "";

    if (typeof atualizarResumoDespesas === "function") {
      atualizarResumoDespesas();
    }

    if (typeof carregaListaDespesas === "function") {
      carregaListaDespesas();
    }

    setTimeout(() => { if (statusDiv) statusDiv.style.display = "none"; }, 5000);

  } catch (error) {
    console.error("Erro ao processar PDF:", error);
    console.error("Stack:", error.stack);
    if (messageSpan) messageSpan.textContent = `❌ Erro: ${error.message}`;
    setTimeout(() => { if (statusDiv) statusDiv.style.display = "none"; }, 5000);
  }
}

function carregarCartoesNoPdfImport() {
  const select = document.getElementById("pdfCartaoImport");
  if (!select) return;

  select.innerHTML = '<option value="">Nenhum (Débito/Dinheiro)</option>';
  const cartoes = getCartoes();
  cartoes.forEach((c, idx) => {
    select.innerHTML += `<option value="${idx}">${c.nome} - ${c.bandeira}</option>`;
  });
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  preencherCategorias();
  carregarCartoesNoSelect();
  atualizarListaCartoes();
  carregarCartoesNoPdfImport();

  if (typeof atualizarResumoDespesas === "function") {
    atualizarResumoDespesas();
  }

  // Definir data de hoje no input de data
  const inputData = document.getElementById("modalData");
  if (inputData) {
    const hoje = new Date().toISOString().split("T")[0];
    inputData.value = hoje;
  }

  // Cadastrar novo cartão
  const btnCadastrarCartao = document.getElementById("btnCadastrarCartao");
  if (btnCadastrarCartao) {
    btnCadastrarCartao.addEventListener("click", () => {
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
      carregarCartoesNoPdfImport();
      exibirMensagem("✅ Cartão cadastrado com sucesso!", "Sucesso", "success");
    });
  }

  // Import PDF button
  const btnImportarPdf = document.getElementById("btnImportarPdf");
  if (btnImportarPdf) {
    btnImportarPdf.addEventListener("click", importarDespesasDePdf);
  }

  // Export CSV button
  const btnExportCsv = document.getElementById("btnExportCsv");
  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", exportDespesasToCsv);
  }

  // Export PDF button
  const btnExportPdf = document.getElementById("btnExportPdf");
  if (btnExportPdf) {
    btnExportPdf.addEventListener("click", exportDespesasToPdf);
  }

  // Custom file input label
  const inputPdf = document.getElementById("inputPdfFatura");
  if (inputPdf) {
    inputPdf.addEventListener("change", function() {
      const fileName = this.files[0] ? this.files[0].name : "Escolher arquivo PDF...";
      const label = this.nextElementSibling;
      if (label) label.textContent = fileName;
    });
  }
});