//Carrega o dom
document.addEventListener("DOMContentLoaded", () => {
    
    //Barra de  pesquisa
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.querySelector(".search-box button");

    function ExecutarPesquisa() {
        const termoPesquisa = searchBar.value.trim();
        
        if (termoPesquisa !== "") {
            alert(`Você pesquisou por: "${termoPesquisa}"\n(Aqui você pode redirecionar para uma página de resultados ou filtrar o conteúdo).`);
            // Exemplo de redirecionamento real no futuro:
            // window.location.href = `https://seusite.com/search?q=${encodeURIComponent(termoPesquisa)}`;
        } else {
            alert("Por favor, digite algo para pesquisar.");
        }
    }

    //Botão da lupa
    searchButton.addEventListener("click", ExecutarPesquisa);

    //Tecla enter
    searchBar.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            ExecutarPesquisa();
        }
    });

    //Marcar link ativo
    const menuLinks = document.querySelectorAll("nav ul li a");

    menuLinks.forEach(link => {
        // Ignora o caractere separador "|"
        if (link.textContent === "|") return;

        link.addEventListener("click", function() {
            // Remove a classe 'active' de todos os links
            menuLinks.forEach(item => item.classList.remove("active"));
            
            // Adiciona a classe 'active' apenas ao link clicado
            this.classList.add("active");
        });
    });
});