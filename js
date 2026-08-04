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
}


// Converter valor recebido para formato brasileiro
function formatarValor(valor){
    return Number(valor).toLocaleString("pt-BR", {
        maximumFractionDigits: 6
    });
}


// Função principal de swap
async function executarSwap(){
    if(!wallet) return alert("🔗 Conecte a Phantom primeiro!");
    if(!ultimaRota) return alert("💹 Busque a cotação primeiro!");

    document.getElementById("status").textContent = "🚀 Preparando transação...";
    document.getElementById("swapBtn").disabled = true;

    try{
        let corpo = {
            quoteResponse: ultimaRota,
            userPublicKey: wallet,
            wrapAndUnwrapSol: true,
            asLegacyTransaction: false
        };

        // Adiciona a conta de taxa se ativada
        if(ATIVAR_TAXA){
            const moedaSaida = document.getElementById("tokenTo").value;
            let contaTaxa;

            if(moedaSaida === "SOL"){
                contaTaxa = CARTEIRA_TAXA;
            }else{
                const mint = moedaSaida === "DGM" ? DGM_MINT : USDC_MINT;
                const [ata] = await solanaWeb3.PublicKey.findProgramAddress(
                    [TAX_WALLET.toBuffer(), SPL_TOKEN_PROGRAM.toBuffer(), mint.toBuffer()],
                    new solanaWeb3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
                );
                contaTaxa = ata.toString();
            }
            corpo.feeAccount = contaTaxa;
        }

        document.getElementById("status").textContent = "🔐 Solicitando assinatura...";
        const resSwap = await fetch(JUPITER_SWAP, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        });

        const dadosSwap = await resSwap.json();
        if(!dadosSwap.swapTransaction) throw new Error(dadosSwap.error || "Falha ao gerar transação");

        const transacao = solanaWeb3.VersionedTransaction.deserialize(
            Uint8Array.from(atob(dadosSwap.swapTransaction), c => c.charCodeAt(0))
        );

        document.getElementById("status").textContent = "🔐 Assine na carteira...";
        const resultado = await window.solana.signAndSendTransaction(transacao);
        const assinatura = resultado.signature || resultado;

        document.getElementById("status").textContent = "⏳ Confirmando na Solana...";
        const conexao = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
        await conexao.confirmTransaction(assinatura, "confirmed");

        document.getElementById("status").innerHTML = `
✅ Swap concluído!${ATIVAR_TAXA ? "<br>💸 Taxa de 0,5% enviada" : ""}<br>
<a target="_blank" style="color:#facc15" href="https://solscan.io/tx/${assinatura}">Ver transação</a>
        `.trim();

    }catch(e){
        document.getElementById("status").textContent = "❌ Erro: " + (e.message || "Transação cancelada");
    }finally{
        document.getElementById("swapBtn").disabled = false;
    }
}


console.log("🐕 Jupiter Engine carregado");
