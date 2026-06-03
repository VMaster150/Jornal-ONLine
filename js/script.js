document.addEventListener("DOMContentLoaded", () => {
    // Seleção de elementos do DOM
    const searchBar = document.getElementById("search-bar");
    const searchBtn = document.querySelector(".search-box button");
    const navLinks = document.querySelectorAll(".nav-main ul li a");
    const conteudoDinamico = document.getElementById("conteudo-dinamico");

    // Guardamos o HTML original da aba de notícias para poder voltar a ele depois
    const htmlAbaNoticias = conteudoDinamico.innerHTML;

    // 1. SISTEMA DE BUSCA/PESQUISA EM TEMPO REAL
    function executarBusca() {
        const termoBusca = searchBar.value.toLowerCase().trim();
        const noticias = document.querySelectorAll(".noticia-item");
        let encontrouAlgo = false;

        // Se o usuário limpou a barra de busca, exibe todas as notícias novamente
        if (termoBusca === "") {
            noticias.forEach(noticia => noticia.style.display = "");
            return;
        }

        // Percorre cada notícia para verificar se o termo bate com o texto
        noticias.forEach(noticia => {
            const textoNoticia = noticia.innerText.toLowerCase();
            
            if (textoNoticia.includes(termoBusca)) {
                noticia.style.display = ""; // Mostra a notícia
                encontrouAlgo = true;
            } else {
                noticia.style.display = "none"; // Esconde a notícia que não coincide
            }
        });

        // Feedback visual caso nenhuma notícia seja encontrada
        const erroExistente = document.getElementById("busca-erro");
        if (!encontrouAlgo) {
            if (!erroExistente) {
                const mensagemErro = document.createElement("p");
                mensagemErro.id = "busca-erro";
                mensagemErro.style.fontFamily = "Arial, sans-serif";
                mensagemErro.style.padding = "20px";
                mensagemErro.innerText = `Nenhum resultado encontrado para: "${searchBar.value}"`;
                conteudoDinamico.appendChild(mensagemErro);
            }
        } else if (erroExistente) {
            erroExistente.remove();
        }
    }

    searchBar.addEventListener("input", executarBusca);
    searchBtn.addEventListener("click", executarBusca);


    // 2. REDIRECIONAMENTO E ALTERNAÇÃO DE ABAS
    navLinks.forEach(link => {
        link.addEventListener("click", (evento) => {
            // Remove a classe 'active' de todos os links e adiciona no clicado
            navLinks.forEach(l => l.classList.remove("active"));
            const hrefAlvo = link.getAttribute("href");
            if (!hrefAlvo || hrefAlvo === "#") return;

            evento.preventDefault(); // Evita que a página recarregue
            link.classList.add("active");

            // Limpa mensagens de erro de busca se houver
            searchBar.value = "";

            // Verifica qual foi clicada
            if (hrefAlvo === "#noticias" || hrefAlvo === "#inicio") {
                conteudoDinamico.innerHTML = htmlAbaNoticias;
                conteudoDinamico.classList.add("grid-layout");
            } else {
                conteudoDinamico.classList.remove("grid-layout"); //remode grid das outras abas
                
                // Simula criar nova aba para o menu
                const nomeAba = link.innerText;
                conteudoDinamico.innerHTML = `
                    <div style="padding: 40px 0; font-family: Arial, sans-serif; text-align: center; width: 100%;">
                        <h2 style="font-size: 2rem; margin-bottom: 15px;">Seção: ${nomeAba}</h2>
                        <p style="color: #666;">Esta área está em desenvolvimento para o teste do jornal da faculdade.</p>
                        <br>
                        <button id="voltar-home" style="padding: 10px 15px; cursor: pointer;">Voltar para o Início</button>
                    </div>
                `;

                // botão pra voltar para a pagina inicial
                document.getElementById("voltar-home").addEventListener("click", () => {
                    const inicioLink = document.querySelector('a[href="#inicio"]');
                    if (inicioLink) inicioLink.click();
                });
            }
        });
    });
});