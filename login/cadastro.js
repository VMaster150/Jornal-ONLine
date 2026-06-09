const formulario = document.getElementById("cadastro-form");

formulario.addEventListener("submit", function(evento){
evento.preventDefault();

alert("Conta criada com sucesso!");

window.location.href = "login.html";
});