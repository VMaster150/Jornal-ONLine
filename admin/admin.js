if(localStorage.getItem("tipoUsuario") !== "admin"){
    window.location.href = "../login/login.html";
}

// CONEXÃO DO SUPABASE
const SUPABASE_URL = "https://jvwsowhcvydvrqfrxkwm.supabase.co";
const SUPABASE_KEY = "sb_publishable_QIhLLvU6ovWBkshGfm2bww_Bl7mk1Uz";
const supabaseApp = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const formulario = document.getElementById("form-admin");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
const titulo = document.getElementById("titulo").value;
const subtitulo = document.getElementById("subtitulo").value;
const secao = document.getElementById("secao").value;
const conteudo = document.getElementById("conteudo").value;
const imagem_url = document.getElementById("imagem_url").value;

const btnEnviar = formulario.querySelector("button");
const textoOriginalBtn = btnEnviar.innerText;

try {
    btnEnviar.disabled = true;
    btnEnviar.innerText = "Publicando...";

    // 1. Procura a notícia que está 'ativa' nessa seção e altera o status para 'arquivada'
    const { error: updateError } = await supabaseApp
        .from('noticias')
        .update({ status: 'arquivada' })
        .eq('secao', secao)
        .eq('status', 'ativa');

    if (updateError) {
        console.error("Aviso ao arquivar notícia antiga:", updateError.message);
        // Não interrompemos o processo se falhar ao arquivar, pois pode não haver notícia ativa.
    }

    // 2. Insere a nova notícia como 'ativa'
    const { error: insertError } = await supabaseApp
        .from('noticias')
        .insert([{ 
            titulo, 
            subtitulo,
            conteudo, 
            secao, 
            imagem_url: imagem_url || null, 
            status: 'ativa'
        }]);

        if (insertError) throw insertError;

        alert("Sucesso! Nova notícia publicada e a antiga foi salva no histórico.");
        formulario.reset();

    } catch (erro) {
        console.error("Erro completo:", erro);
        alert("Erro ao salvar no banco de dados: " + erro.message);
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.innerText = textoOriginalBtn;
    }
});