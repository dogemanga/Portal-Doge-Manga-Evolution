// ===============================
// DOGE MANGA EVOLUTION
// JUPITER QUOTE ENGINE
// ===============================

const JUPITER_QUOTE = "https://quote-api.jup.ag/v6/quote";
const JUPITER_SWAP = "https://quote-api.jup.ag/v6/swap";


async function buscarCotacao(inputMint, outputMint, amount){
    try{
        let url = `${JUPITER_QUOTE}?inputMint=${inputMint}`+
                  `&outputMint=${outputMint}`+
                  `&amount=${amount}`+
                  `&slippageBps=50`;

        // Adiciona taxa na cotação se estiver ativada
        if(ATIVAR_TAXA){
            url += `&platformFeeBps=${TAXA_EM_BPS}`;
        }

        const resposta = await fetch(url);
        const dados = await resposta.json();

        if(!dados.routePlan){
            throw new Error(dados.error || "Nenhuma rota encontrada");
        }

        ultimaRota = dados;
        console.log("🚀 Cotação Jupiter:", dados);
        return dados;

    }catch(error){
        console.error("Erro cotação:", error);
        alert("Não foi possível buscar cotação: " + error.message);
    }
