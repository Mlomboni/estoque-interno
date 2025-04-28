window.onload = function() {
  const btnPesquisarMov = document.getElementById('btnPesquisarMov');
  const btnSalvarMovimentacao = document.getElementById('salvarMovimentacao');
  const btnFecharModal = document.getElementById('fecharModalMovimentacao');
  const modalMovimentacao = document.getElementById('modalMovimentacao');
  const mensagemSucesso = document.getElementById('mensagemSucessoMovimentacao');

  btnPesquisarMov.onclick = () => {
    modalMovimentacao.style.display = 'block';
  };

  btnFecharModal.onclick = () => {
    modalMovimentacao.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == modalMovimentacao) {
      modalMovimentacao.style.display = 'none';
    }
  };

  btnSalvarMovimentacao.onclick = () => {
    const erp = document.getElementById('movimentacaoErp').value.trim();
    const quantidadeMov = parseInt(document.getElementById('quantidadeMovimentada').value.trim());
    const tipoMov = document.getElementById('tipoMovimentacao').value;

    if (!erp || isNaN(quantidadeMov) || quantidadeMov <= 0) {
      alert('Preencha ERP e quantidade válida.');
      return;
    }

    const movimentacao = {
      erp: erp,
      quantidade: quantidadeMov,
      tipo: tipoMov,
      dataHora: new Date().toLocaleString('pt-BR')
    };

    db.collection("movimentacoes").add(movimentacao)
      .then(() => {
        modalMovimentacao.style.display = 'none';
        mensagemSucesso.style.display = 'block';
        setTimeout(() => {
          mensagemSucesso.style.display = 'none';
        }, 3000);
      })
      .catch((error) => {
        console.error("Erro ao registrar movimentação: ", error);
        alert("Erro ao registrar movimentação.");
      });
  };
};
