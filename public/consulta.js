window.onload = function () {
  const btnPesquisar = document.getElementById('btnPesquisar');
  const tabelaConsultaCorpo = document.getElementById('tabelaConsultaCorpo');

  function carregarConsulta(filtro = '', coluna = 'descricao') {
    tabelaConsultaCorpo.innerHTML = '';

    db.collection("consulta").get().then((querySnapshot) => {
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
    }).catch((error) => {
      console.error("Erro ao carregar itens de consulta: ", error);
    });
  }

  btnPesquisar.onclick = () => {
    const texto = document.getElementById('pesquisaTexto').value.trim();
    const coluna = document.getElementById('pesquisaColuna').value;
    carregarConsulta(texto, coluna);
  };

  // Carregar todos ao iniciar
  carregarConsulta();
};
