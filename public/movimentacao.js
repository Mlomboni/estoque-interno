window.onload = function () {
  const tabelaMovimentacaoCorpo = document.getElementById('tabelaMovimentacaoCorpo');
  const btnPesquisarMov = document.getElementById('btnPesquisarMov');
  const modalMovimentacao = document.getElementById('modalMovimentacao');
  const fecharModalMovimentacao = document.getElementById('fecharModalMovimentacao');
  const salvarMovimentacao = document.getElementById('salvarMovimentacao');
  const mensagemSucessoMovimentacao = document.getElementById('mensagemSucessoMovimentacao');

  const inputPesquisa = document.getElementById('pesquisaTextoMov');
  const inputErpMovimentacao = document.getElementById('movimentacaoErp');
  const inputQuantidadeMovimentada = document.getElementById('quantidadeMovimentada');
  const selectTipoMovimentacao = document.getElementById('tipoMovimentacao');

  let produtoSelecionado = null;

  // Função para carregar todos os produtos
  function carregarProdutosMovimentacao(filtro = '') {
    tabelaMovimentacaoCorpo.innerHTML = ''; // Limpa a tabela

    db.collection("produtos").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const produto = doc.data();
        const idProduto = doc.id;
        const descricaoLower = (produto.descricao || '').toLowerCase();
        const erpLower = (produto.erp || '').toLowerCase();
        const filtroLower = filtro.toLowerCase();

        if (
          filtro === '' ||
          descricaoLower.includes(filtroLower) ||
          erpLower.includes(filtroLower)
        ) {
          const linha = document.createElement('tr');
          linha.innerHTML = `
            <td>${produto.erp || ''}</td>
            <td>${produto.descricao || ''}</td>
            <td>${produto.quantidade || 0}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td><button class="botao-movimentar" data-id="${idProduto}" data-erp="${produto.erp}" data-descricao="${produto.descricao}">Movimentar</button></td>
          `;
          tabelaMovimentacaoCorpo.appendChild(linha);
        }
      });

      // Adicionar eventos aos botões "Movimentar"
      document.querySelectorAll('.botao-movimentar').forEach(botao => {
        botao.onclick = () => abrirModalMovimentacao(botao.dataset);
      });
    }).catch((error) => {
      console.error("Erro ao carregar produtos: ", error);
    });
  }

  // Função para abrir modal e preencher ERP
  function abrirModalMovimentacao(produto) {
    produtoSelecionado = produto;
    inputErpMovimentacao.value = produto.erp;
    inputQuantidadeMovimentada.value = '';
    selectTipoMovimentacao.value = 'Entrada';
    modalMovimentacao.style.display = 'block';
  }

  // Fechar modal
  fecharModalMovimentacao.onclick = () => {
    modalMovimentacao.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == modalMovimentacao) {
      modalMovimentacao.style.display = 'none';
    }
  };

  // Salvar movimentação
  salvarMovimentacao.onclick = () => {
    const quantidadeMovimentada = parseInt(inputQuantidadeMovimentada.value.trim());
    const tipoMovimentacao = selectTipoMovimentacao.value;

    if (!quantidadeMovimentada || quantidadeMovimentada <= 0) {
      alert('Informe uma quantidade válida.');
      return;
    }

    const idProduto = produtoSelecionado.id;

    // Atualizar a quantidade no produto
    const produtoRef = db.collection('produtos').doc(idProduto);

    produtoRef.get().then((doc) => {
      if (doc.exists) {
        const dadosProduto = doc.data();
        let novaQuantidade = dadosProduto.quantidade || 0;

        if (tipoMovimentacao === 'Entrada') {
          novaQuantidade += quantidadeMovimentada;
        } else {
          novaQuantidade -= quantidadeMovimentada;
          if (novaQuantidade < 0) novaQuantidade = 0; // não permitir estoque negativo
        }

        produtoRef.update({
          quantidade: novaQuantidade,
          ultima_movimentacao: new Date().toLocaleString('pt-BR')
        }).then(() => {
          // Registrar movimentação no histórico
          db.collection('movimentacoes').add({
            erp: produtoSelecionado.erp,
            descricao: produtoSelecionado.descricao,
            quantidadeMovimentada: quantidadeMovimentada,
            tipoMovimentacao: tipoMovimentacao,
            dataHora: new Date().toLocaleString('pt-BR')
          }).then(() => {
            modalMovimentacao.style.display = 'none';
            mensagemSucessoMovimentacao.style.display = 'block';
            setTimeout(() => {
              mensagemSucessoMovimentacao.style.display = 'none';
            }, 3000);
            carregarProdutosMovimentacao(); // Atualizar a lista
          });
        });
      }
    }).catch((error) => {
      console.error("Erro ao movimentar produto: ", error);
      alert('Erro ao movimentar produto.');
    });
  };

  // Botão pesquisar
  btnPesquisarMov.onclick = () => {
    const texto = inputPesquisa.value.trim();
    carregarProdutosMovimentacao(texto);
  };

  // 🚀 Carregar todos produtos ao abrir a página
  carregarProdutosMovimentacao();
};
