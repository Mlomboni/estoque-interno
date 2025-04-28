window.onload = function () {
  const btnCadastrar = document.getElementById('btnCadastrar');
  const modal = document.getElementById('modalCadastro');
  const fecharModal = document.getElementById('fecharModal');
  const btnSalvar = document.getElementById('salvarProduto');
  const mensagemSucesso = document.getElementById('mensagemSucesso');
  const tabelaCorpo = document.getElementById('tabelaCorpo');

  const inputErp = document.getElementById('cadastroErp');
  const inputDescricao = document.getElementById('cadastroDescricao');
  const inputAplicacao = document.getElementById('cadastroAplicacao');
  const inputModelo = document.getElementById('cadastroModelo');
  const inputQuantidade = document.getElementById('cadastroQuantidade');
  const inputLocalizacao = document.getElementById('cadastroLocalizacao');

  // Função para abrir o modal
  btnCadastrar.onclick = () => {
    modal.style.display = 'block';
    limparCampos();
  };

  // Fechar modal
  fecharModal.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  // Função para salvar um novo produto
  btnSalvar.onclick = () => {
    if (inputDescricao.value.trim() === '' || inputQuantidade.value.trim() === '' || inputLocalizacao.value.trim() === '') {
      alert('Por favor, preencha Descrição, Quantidade e Localização antes de salvar.');
      return;
    }

    const novoProduto = {
      erp: inputErp.value.trim(),
      descricao: inputDescricao.value.trim(),
      aplicacao: inputAplicacao.value.trim(),
      modelo_codigo: inputModelo.value.trim(),
      quantidade: parseInt(inputQuantidade.value.trim()),
      localizacao: inputLocalizacao.value.trim(),
      ultima_movimentacao: new Date().toLocaleString('pt-BR')
    };

    db.collection("produtos").add(novoProduto)
      .then(() => {
        modal.style.display = 'none';
        mensagemSucesso.style.display = 'block';
        setTimeout(() => {
          mensagemSucesso.style.display = 'none';
        }, 3000);
        limparCampos();
        carregarProdutos(); // Atualizar a tabela após cadastrar
      })
      .catch((error) => {
        console.error("Erro ao salvar produto: ", error);
        alert("Erro ao salvar produto. Veja o console para detalhes.");
      });
  };

  // Função para limpar os campos do formulário
  function limparCampos() {
    inputErp.value = '';
    inputDescricao.value = '';
    inputAplicacao.value = '';
    inputModelo.value = '';
    inputQuantidade.value = '';
    inputLocalizacao.value = '';
  }

  // 🔥 Função para carregar produtos já cadastrados no Firestore
  function carregarProdutos() {
    tabelaCorpo.innerHTML = ''; // Limpar a tabela antes de popular
    db.collection("produtos").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const produto = doc.data();
        const linha = `
          <tr>
            <td>${produto.erp || ''}</td>
            <td>${produto.descricao || ''}</td>
            <td>${produto.aplicacao || ''}</td>
            <td>${produto.modelo_codigo || ''}</td>
            <td>${produto.quantidade || ''}</td>
            <td>${produto.localizacao || ''}</td>
            <td>${produto.ultima_movimentacao || ''}</td>
          </tr>
        `;
        tabelaCorpo.innerHTML += linha;
      });
    }).catch((error) => {
      console.error("Erro ao carregar produtos: ", error);
    });
  }

  // 🚀 Chamar carregarProdutos ao entrar na página
  carregarProdutos();
};
