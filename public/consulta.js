window.onload = function () {
  const btnPesquisar = document.getElementById('btnPesquisar');
  const tabelaConsultaCorpo = document.getElementById('tabelaConsultaCorpo');

  let ultimoDoc = null;
  let textoAtual = '';
  let colunaAtual = '';

  function carregarConsulta(filtro = '', coluna = 'descricao', reset = true) {
    if (reset) {
      tabelaConsultaCorpo.innerHTML = '';
      ultimoDoc = null;
      textoAtual = filtro;
      colunaAtual = coluna;
    }

    let query = db.collection("consulta").orderBy(coluna).limit(50);

    if (ultimoDoc) {
      query = query.startAfter(ultimoDoc);
    }

    query.get().then((querySnapshot) => {
      if (querySnapshot.empty) return;

      querySnapshot.forEach((doc) => {
        const item = doc.data();
        const valorCampo = (item[coluna] || '').toString().toLowerCase();
        const filtroLower = filtro.toLowerCase();

        if (filtro === '' || valorCampo.includes(filtroLower)) {
          const linha = `
            <tr>
              <td>${item.codItem || ''}</td>
              <td>${item.descricao || ''}</td>
              <td>${item.narrativa || ''}</td>
              <td>${item.situacao || ''}</td>
            </tr>
          `;
          tabelaConsultaCorpo.innerHTML += linha;
        }
      });

      ultimoDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      // Mostrar botão "Exibir mais"
      const botaoMais = document.getElementById('btnExibirMais');
      if (!botaoMais) {
        const novoBotao = document.createElement('button');
        novoBotao.textContent = 'Exibir mais';
        novoBotao.id = 'btnExibirMais';
        novoBotao.style.marginTop = '20px';
        novoBotao.onclick = () => carregarConsulta(textoAtual, colunaAtual, false);
        tabelaConsultaCorpo.parentElement.appendChild(novoBotao);
      }
    }).catch((error) => {
      console.error("Erro ao carregar itens de consulta: ", error);
    });
  }

  btnPesquisar.onclick = () => {
    const texto = document.getElementById('pesquisaTexto').value.trim();
    const coluna = document.getElementById('pesquisaColuna').value;
    carregarConsulta(texto, coluna, true);

    const botaoMais = document.getElementById('btnExibirMais');
    if (botaoMais) botaoMais.remove();
  };

  // Carregar os primeiros 50 ao iniciar
  carregarConsulta('', 'descricao', true);
};
