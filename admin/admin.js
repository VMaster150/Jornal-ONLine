                                            // CONEXÃO DO SUPABASE
const SUPABASE_URL = "https://jvwsowhcvydvrqfrxkwm.supabase.co";
const SUPABASE_KEY = "sb_publishable_QIhLLvU6ovWBkshGfm2bww_Bl7mk1Uz";
const supabaseApp = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const formulario = document.getElementById("form-admin");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const secao = document.getElementById("secao").value;
    const conteudo = document.getElementById("conteudo").value;
    const imagem_url = document.getElementById("imagem_url").value;
    try {
        // 1. Procura a notícia que está 'ativa' nessa seção e altera o status para 'arquivada'
        await supabaseApp
            .from('noticias')
            .update({ status: 'arquivada' })
            .eq('secao', secao)
            .eq('status', 'ativa');

        // 2. Insere a nova notícia como 'ativa'
        const { error } = await supabaseApp
            .from('noticias')
            .insert([{ titulo, conteudo, secao, imagem_url, status: 'ativa' }]);

        if (error) throw error;

        alert("Sucesso! Nova notícia publicada e a antiga foi salva no histórico do PostgreSQL.");
        formulario.reset();

    } catch (erro) {
        alert("Erro ao salvar no banco de dados: " + erro.message);
    }
});