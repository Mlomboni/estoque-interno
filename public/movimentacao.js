window.onload = function () {
  const tabelaMovimentacaoCorpo = document.getElementById('tabelaMovimentacaoCorpo');
  const btnPesquisarMov = document.getElementById('btnPesquisarMov');
  const modalMovimentacao = document.getElementById('modalMovimentacao');
  const fecharModalMovimentacao = document.getElementById('fecharModalMovimentacao');
  const salvarMovimentacao = document.getElementById('salvarMovimentacao');
  const mensagemSucessoMovimentacao = document.getElementById('mensagemSucessoMovimentacao');
  const tabelaHistorico = document.getElementById('tabelaHistoricoMovimentacao');

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
            <td>
              <button class="botao-movimentar" data-id="${idProduto}" data-erp="${produto.erp}" data-descricao="${produto.descricao}">Movimentar</button>
              <button class="botao-historico" data-descricao="${produto.descricao}">Histórico</button>
            
            </td>
          `;

          tabelaMovimentacaoCorpo.appendChild(linha);
        }
      });

      // Adicionar eventos aos botões "Movimentar"  
      document.querySelectorAll('.botao-movimentar').forEach(botao => {
        botao.onclick = () => abrirModalMovimentacao(botao.dataset);
      });
      // Adicionar eventos aos botões "Histórico"
      document.querySelectorAll('.botao-historico').forEach(botao => {
        botao.onclick = () => {
          const descricaoSelecionada = botao.dataset.descricao;
          carregarHistoricoDoProduto(descricaoSelecionada);
        };
      });
      // Adicionar eventos aos botões "Excluir"
      document.querySelectorAll('.botao-excluir').forEach(botao => {
          botao.onclick = () => {
            const id = botao.dataset.id;
            if (confirm("Deseja excluir este produto?")) {
              db.collection("produtos").doc(id).delete().then(() => {
                alert("Produto excluído com sucesso.");
                carregarProdutosMovimentacao(); // Atualiza a lista
              }).catch((error) => {
                console.error("Erro ao excluir produto: ", error);
                alert("Erro ao excluir produto.");
              });
            }
          };
        });

    }).catch((error) => {
      console.error("Erro ao carregar produtos: ", error);
    });
  }

  // Função para carregar o histórico de movimentações
  function carregarHistoricoMovimentacao() {
  tabelaHistorico.innerHTML = ''; // Limpa o histórico atual

  db.collection("movimentacoes")
    .orderBy("dataHora", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const movimentacao = doc.data();

        // Verificação de segurança caso algum campo esteja ausente
        const linha = `
          <tr>
            <td>${movimentacao.erp || '-'}</td>
            <td>${movimentacao.descricao || '-'}</td>
            <td>${movimentacao.quantidadeMovimentada || 0}</td>
            <td>${movimentacao.tipoMovimentacao || '-'}</td>
            <td>${movimentacao.observacao || '—'}</td>
            <td>${movimentacao.dataHora || '-'}</td>
          </tr>
        `;

        tabelaHistorico.innerHTML += linha;
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar histórico de movimentações: ", error);
    });
}

  
function carregarUltimasMovimentacoes() {
  tabelaHistorico.innerHTML = ''; // Limpa a tabela antes

  db.collection("movimentacoes")
    .orderBy("dataHora", "desc")
    .limit(30)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const movimentacao = doc.data();
        const linha = `
          <tr>
            <td>${movimentacao.erp || ''}</td>
            <td>${movimentacao.descricao || ''}</td>
            <td>${movimentacao.quantidadeMovimentada || 0}</td>
            <td>${movimentacao.tipoMovimentacao || ''}</td>
            <td>${movimentacao.dataHora || ''}</td>
          </tr>
        `;
        tabelaHistorico.innerHTML += linha;
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar últimas movimentações: ", error);
    });
}

function carregarHistoricoDoProduto(descricao) {
  tabelaHistorico.innerHTML = ''; // Limpa o histórico atual

  db.collection("movimentacoes")
    .where("descricao", "==", descricao)
    .orderBy("dataHora", "desc")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        tabelaHistorico.innerHTML = '<tr><td colspan="5">Nenhuma movimentação encontrada.</td></tr>';
        return;
      }

      querySnapshot.forEach((doc) => {
        const movimentacao = doc.data();
        const linha = `
          <tr>
            <td>${movimentacao.erp || '-'}</td>
            <td>${movimentacao.descricao || '-'}</td>
            <td>${movimentacao.quantidadeMovimentada || 0}</td>
            <td>${movimentacao.tipoMovimentacao || '-'}</td>
            <td>${movimentacao.dataHora || '-'}</td>
          </tr>
        `;
        tabelaHistorico.innerHTML += linha;
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar histórico do produto:", error);
      tabelaHistorico.innerHTML = '<tr><td colspan="5">Erro ao carregar histórico.</td></tr>';
    });
}


  // Função para abrir modal e preencher ERP
 function abrirModalMovimentacao(produto) {
  produtoSelecionado = produto;

  // Limpando os campos relevantes
  document.getElementById('quantidadeMovimentada').value = '';
  document.getElementById('observacaoMovimentacao').value = '';
  document.getElementById('tipoMovimentacao').value = 'Entrada';

  modalMovimentacao.style.display = 'block';

  setTimeout(() => {
    document.getElementById('quantidadeMovimentada').focus();
  }, 100);
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
  const observacao = document.getElementById('observacaoMovimentacao').value.trim();

  if (!quantidadeMovimentada || quantidadeMovimentada <= 0) {
    alert('Informe uma quantidade válida.');
    return;
  }

  if (!observacao) {
    alert('O campo "Observação" é obrigatório.');
    return;
  }

  const idProduto = produtoSelecionado.id;

  const produtoRef = db.collection('produtos').doc(idProduto);

  produtoRef.get().then((doc) => {
    if (doc.exists) {
      const dadosProduto = doc.data();
      let novaQuantidade = dadosProduto.quantidade || 0;

      if (tipoMovimentacao === 'Entrada') {
        novaQuantidade += quantidadeMovimentada;
      } else {
        novaQuantidade -= quantidadeMovimentada;
        if (novaQuantidade < 0) novaQuantidade = 0;
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
          observacao: observacao, // <--- Novo campo salvo no banco
          dataHora: new Date().toLocaleString('pt-BR')
        }).then(() => {
          modalMovimentacao.style.display = 'none';
          mensagemSucessoMovimentacao.style.display = 'block';
          setTimeout(() => {
            mensagemSucessoMovimentacao.style.display = 'none';
          }, 3000);
          carregarProdutosMovimentacao();
          carregarHistoricoMovimentacao();
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
    const btnRecentesMov = document.getElementById('btnRecentesMov');

    btnRecentesMov.onclick = () => {
      carregarUltimasMovimentacoes();
    };

  };

  // 🚀 Carregar tudo ao abrir a página
 
  carregarHistoricoMovimentacao();
};
