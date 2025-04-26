// Arquivo: produtos.js

/* BLOCO: Controle de Navegação entre Telas */
function mostrarTela(telaId) {
  const telas = ["telaProdutos", "telaMovimentacao", "telaUsuarios"];
  telas.forEach(id => {
    document.getElementById(id).style.display = id === telaId ? "block" : "none";
  });
}

// BLOCO: Ações do Menu
const linkProdutos = document.getElementById("linkProdutos");
const linkMovimentacao = document.getElementById("linkMovimentacao");
const linkUsuarios = document.getElementById("linkUsuarios");
const linkLogout = document.getElementById("linkLogout");

linkProdutos.addEventListener("click", () => mostrarTela("telaProdutos"));
linkMovimentacao.addEventListener("click", () => mostrarTela("telaMovimentacao"));
linkUsuarios.addEventListener("click", () => mostrarTela("telaUsuarios"));
linkLogout.addEventListener("click", () => window.location.reload());

/* BLOCO: Ações Específicas de Cada Tela */
// Exemplo: botão de cadastrar produto
const cadastrarProdutoBtn = document.getElementById("cadastrarProdutoBtn");
cadastrarProdutoBtn.addEventListener("click", () => {
  alert("Função de cadastrar produto em desenvolvimento!");
});
