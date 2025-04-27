// login.js

window.onload = function () {
  const loginButton = document.getElementById('btnEntrar');

  loginButton.addEventListener('click', function () {
    // Apenas redireciona para produtos.html
    window.location.href = "/produtos.html";
  });
};
