// CONEXÃO COM O SEU SUPABASE CONFIGURADA
const SUPABASE_URL = "https://jvwsowhcvydvrqfrxkwm.supabase.co";
const SUPABASE_KEY = "COLE_AQUI_SUA_CHAVE_SB_PUBLISHABLE"; // Substitua pelo token do passo anterior
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. CARREGAR NOTÍCIAS DO BANCO DE DADOS
    // ==========================================
    async function puxarNoticiasDoBanco() {
        try {
            // Busca apenas os registros que estão marcados como ativos
            const { data: noticias, error } = await supabaseClient
                .from('noticias')
                .select('*')
                .eq('status', 'ativa');

            if (error) throw error;

            // Distribui dinamicamente os textos com base na seção do banco
            noticias.forEach(noticia => {
                if (noticia.secao === 'principal') {
                    const tituloPrincipal = document.querySelector(".main-title");
                    const textoPrincipal = document.querySelector(".lead-text");
                    if (tituloPrincipal) tituloPrincipal.innerText = noticia.titulo;
                    if (textoPrincipal) textoPrincipal.innerText = noticia.conteudo;
                } 
                else if (noticia.secao === 'lateral_1') {
                    const articulos = document.querySelectorAll(".side-article");
                    if (articulos[0]) {
                        articulos[0].querySelector("h5").innerText = noticia.titulo;
                        articulos[0].querySelector("p").innerText = noticia.conteudo;
                    }
                } 
                else if (noticia.secao === 'lateral_2') {
                    const articulos = document.querySelectorAll(".side-article");
                    if (articulos[1]) {
                        articulos[1].querySelector("h5").innerText = noticia.titulo;
                        articulos[1].querySelector("p").innerText = noticia.conteudo;
                    }
                }
            });
        } catch (err) {
            console.error("Erro ao puxar dados do PostgreSQL:", err.message);
        }
    }

    // Dispara a busca no PostgreSQL assim que a página abre
    puxarNoticiasDoBanco();


    // ==========================================
    // 2. SISTEMA DE BUSCA EM TEMPO REAL
    // ==========================================
    const searchBar = document.getElementById("search-bar");
    const searchBtn = document.querySelector(".search-box button");

    function executarBusca() {
        const termoBusca = searchBar.value.toLowerCase().trim();
        const noticias = document.querySelectorAll(".noticia-item");

        noticias.forEach(noticia => {
            const textoNoticia = noticia.innerText.toLowerCase();
            if (textoNoticia.includes(termoBusca) || termoBusca === "") {
                noticia.style.display = ""; 
            } else {
                noticia.style.display = "none"; 
            }
        });
    }

    if (searchBar) searchBar.addEventListener("input", BallsBusca);
    if (searchBtn) searchBtn.addEventListener("click", executarBusca);


    // ==========================================
    // 3. LÓGICA DO OUTDOOR ROTATIVO (CARROSSEL)
    // ==========================================
    const trilho = document.getElementById("outdoor-track");
    const slides = document.querySelectorAll(".outdoor-slide");
    
    if (trilho && slides.length > 0) {
        let indiceAtual = 0;
        const totalSlides = slides.length;

        function moverOutdoor() {
            indiceAtual++;
            if (indiceAtual >= totalSlides) {
                indiceAtual = 0;
            }
            trilho.style.transform = `translateX(-${indiceAtual * 100}%)`;
        }

        let loopOutdoor = setInterval(moverOutdoor, 4000);

        trilho.addEventListener("mouseenter", () => clearInterval(loopOutdoor));
        trilho.addEventListener("mouseleave", () => {
            loopOutdoor = setInterval(moverOutdoor, 4000);
        });
    }
});