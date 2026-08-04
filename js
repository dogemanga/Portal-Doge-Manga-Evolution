// ===============================
// DOGE MANGA EVOLUTION
// JUPITER QUOTE ENGINE
// ===============================

const JUPITER_QUOTE =
"https://quote-api.jup.ag/v6/quote";


async function buscarCotacao(
    inputMint,
    outputMint,
    amount
){

    try{

        const url =
        `${JUPITER_QUOTE}?inputMint=${inputMint}`+
        `&outputMint=${outputMint}`+
        `&amount=${amount}`+
        `&slippageBps=50`;


        const resposta = await fetch(url);

        const dados = await resposta.json();


        if(!dados.routePlan){

            throw new Error(
            "Nenhuma rota encontrada"
            );

        }


        ultimaRota = dados;


        console.log(
        "🚀 Cotação Jupiter:",
        dados
        );


        return dados;


    }catch(error){

        console.error(
        "Erro cotação:",
        error
        );

        alert(
        "Não foi possível buscar cotação"
        );

    }

}



// Converter valor recebido

function formatarValor(valor){

    return Number(valor)
    .toLocaleString(
        "pt-BR",
        {
            maximumFractionDigits:6
        }
    );

}


console.log(
"🐕 Jupiter Engine carregado"
);
