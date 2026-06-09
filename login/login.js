const formulario = document.getElementById("login-form");

formulario.addEventListener("submit", function(evento){

    evento.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if(email === "admin" && senha === "admin"){

        localStorage.setItem("tipoUsuario", "admin");

        window.location.href = "../admin/admin.html";

        return;
    }

    if(email.includes("@") && senha.length > 0){

        localStorage.setItem("tipoUsuario", "publico");

        window.location.href = "../public/index.html";

        return;
    }

    alert("Login inválido.");
});