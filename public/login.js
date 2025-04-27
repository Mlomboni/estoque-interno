window.onload = function() {
  const btnEntrar = document.getElementById('btnEntrar');
  
  btnEntrar.onclick = function() {
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value.trim();

    if (email === '' || senha === '') {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, senha)
      .then(() => {
        window.location.href = "produtos.html";
      })
      .catch((error) => {
        alert('Erro ao fazer login. Verifique o email e senha.');
        console.error(error);
      });
  };
};
