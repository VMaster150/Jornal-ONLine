// CONEXÃO SUPABASE
const SUPABASE_URL = "https://jvwsowhcvydvrqfrxkwm.supabase.co";
const SUPABASE_KEY = "sb_publishable_QIhLLvU6ovWBkshGfm2bww_Bl7mk1Uz";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
    // Seleção de elementos do DOM
    const searchBar = document.getElementById("search-bar");
    const searchBtn = document.querySelector(".search-box button");
    const navLinks = document.querySelectorAll(".nav-main ul li a");
    const conteudoDinamico = document.getElementById("conteudo-dinamico");

    // Guardamos o HTML original da aba de notícias para poder voltar a ele depois
    const htmlAbaNoticias = conteudoDinamico.innerHTML;

    // SISTEMA DE BUSCA/PESQUISA EM TEMPO REAL
    function executarBusca() {
        const termoBusca = searchBar.value.toLowerCase().trim();
        const noticias = document.querySelectorAll(".noticia-item");
        let encontrouAlgo = false;

        // Percorre cada notícia para verificar se o termo bate com o texto
        noticias.forEach(noticia => {
            const textoNoticia = noticia.innerText.toLowerCase();
            
            if (termoBusca === "" || textoNoticia.includes(termoBusca)) {
                noticia.style.display = ""; // Mostra a notícia
                encontrouAlgo = true;
            } else {
                noticia.style.display = "none"; // Esconde a notícia que não coincide
            }
        });

        // Feedback visual caso nenhuma notícia seja encontrada
        const erroExistente = document.getElementById("busca-erro");
        if (!encontrouAlgo && termoBusca !== "") {
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

    if (searchBar) searchBar.addEventListener("input", executarBusca);
    if (searchBtn) searchBtn.addEventListener("click", executarBusca);

    // REDIRECIONAMENTO E ALTERNAÇÃO DE ABAS
    navLinks.forEach(link => {
        link.addEventListener("click", (evento) => {
            const hrefAlvo = link.getAttribute("href");
            if (!hrefAlvo || hrefAlvo.startsWith("http") || hrefAlvo === "javascript:void(0)") return;

            evento.preventDefault();
            
            // Remove a classe 'active' de todos os links e adiciona no clicado
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Limpa mensagens de erro de busca se houver
            searchBar.value = "";

            const outdoor = document.querySelector(".outdoor");

            if (hrefAlvo === "#noticias" || hrefAlvo === "#inicio") {
                conteudoDinamico.innerHTML = htmlAbaNoticias;
                conteudoDinamico.classList.add("grid-layout");
                if (outdoor) outdoor.style.display = "block";
                puxarNoticiasDoBanco(); // Recarrega notícias ao voltar
            } else {
                conteudoDinamico.classList.remove("grid-layout");
                if (outdoor) outdoor.style.display = "none";
                
                const nomeAba = link.innerText;
                conteudoDinamico.innerHTML = `
                    <div style="padding: 40px 0; font-family: Arial, sans-serif; text-align: center; width: 100%;">
                        <h2 style="font-size: 2rem; margin-bottom: 15px;">Seção: ${nomeAba}</h2>
                        <p style="color: #666;">Esta área está em desenvolvimento para o teste do jornal da faculdade.</p>
                        <br>
                        <button id="voltar-home" style="padding: 10px 15px; cursor: pointer;">Voltar para o Início</button>
                    </div>
                `;

                document.getElementById("voltar-home").addEventListener("click", () => {
                    const inicioLink = document.querySelector('a[href="#inicio"]');
                    if (inicioLink) inicioLink.click();
                });
            }
        });
    });

    // CARREGAR NOTÍCIAS DO BANCO DE DADOS
    async function puxarNoticiasDoBanco() {
        try {
            const { data: noticias, error } = await supabaseClient
                .from('noticias')
                .select('*')
                .eq('status', 'ativa');

            if (error) throw error;

            noticias.forEach(noticia => {
                if (noticia.secao === 'principal') {
                    const tituloPrincipal = document.querySelector(".main-title");
                    const textoPrincipal = document.querySelector(".texto-curto");
                    const fotoNoticia = document.querySelector(".story-image img");

                    if (tituloPrincipal) tituloPrincipal.innerText = noticia.titulo;
                    if (textoPrincipal) textoPrincipal.innerText = noticia.conteudo;
                    if (fotoNoticia && noticia.imagem_url) {
                        fotoNoticia.src = noticia.imagem_url;
                    }
                } 
                else if (noticia.secao === 'lateral_1') {
                    const articulos = document.querySelectorAll(".side-artigo");
                    if (articulos[0]) {
                        articulos[0].querySelector("h5").innerText = noticia.titulo;
                        articulos[0].querySelector("p").innerText = noticia.conteudo;
                    }
                } 
                else if (noticia.secao === 'lateral_2') {
                    const articulos = document.querySelectorAll(".side-artigo");
                    if (articulos[1]) {
                        articulos[1].querySelector("h5").innerText = noticia.titulo;
                        articulos[1].querySelector("p").innerText = noticia.conteudo;
                    }
                }
            });
        } catch (err) {
            console.error("Erro ao puxar dados do Banco de Dados:", err.message);
        }
    }

    // Dispara a busca no PostgreSQL assim que a página abre
    puxarNoticiasDoBanco();

                                                         // OUTDOOR (CARROSSEL)
    const trilho = document.getElementById("outdoor-trilho");
    const slides = document.querySelectorAll(".banner-outdoor");
    let indiceAtual = 0;
    const totalSlides = slides.length;

    function moverOutdoor() {
        if (totalSlides === 0) return;
        indiceAtual = (indiceAtual + 1) % totalSlides;
        if (trilho) {
            trilho.style.transform = `translateX(-${indiceAtual * 100}%)`;
        }
    }

    let loopOutdoor = setInterval(moverOutdoor, 5500);

    if (trilho) {
        trilho.addEventListener("mouseenter", () => clearInterval(loopOutdoor));
        trilho.addEventListener("mouseleave", () => {
            clearInterval(loopOutdoor);
            loopOutdoor = setInterval(moverOutdoor, 4000);
        });
    }
});