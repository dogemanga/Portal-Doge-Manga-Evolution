// ===============================
// DOGE MANGA EVOLUTION
// swap.js
// ===============================

// Contratos oficiais Solana
const CONTRATO_DGM = "E9qgVy6urPUrKBv3wymPSgSPbDGM5z77ZnVok4YvUmqE";
const CONTRATO_USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
let precoDGM = 0;
let precoSOL = 0;

// Busca preços em tempo real
async function atualizarPrecosSwap() {
    try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRATO_DGM}`);
        const dados = await res.json();
        precoDGM = dados.pairs?.[0]?.price?.usd || 0;
        
        const resSol = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
        const dadosSol = await resSol.json();
        precoSOL = dadosSol.solana.usd || 0;
    } catch (e) {
        console.log("Erro ao buscar preços:", e);
    }
}

// Cálculo automático do valor estimado
function calcularValorEstimado() {
    const tokenOrigem = document.getElementById("tokenFrom")?.value || document.getElementById("moedaEnvia")?.value;
    const tokenDestino = document.getElementById("tokenTo")?.value || document.getElementById("moedaRecebe")?.value;
    const quantidade = parseFloat(document.getElementById("amount")?.value || document.getElementById("quantidadeEnvia")?.value) || 0;
    let valorRecebido = 0;

    if (!quantidade || !precoDGM || !precoSOL) {
        document.getElementById("resultado").innerHTML = "Estimativa: 0.00";
        return;
    }

    // Regras de conversão
    if (tokenOrigem === "SOL" && tokenDestino === "DGM") valorRecebido = (quantidade * precoSOL) / precoDGM;
    if (tokenOrigem === "DGM" && tokenDestino === "SOL") valorRecebido = (quantidade * precoDGM) / precoSOL;
    if (tokenOrigem === "USDC" && tokenDestino === "DGM") valorRecebido = quantidade / precoDGM;
    if (tokenOrigem === "DGM" && tokenDestino === "USDC") valorRecebido = quantidade * precoDGM;
    if (tokenOrigem === "SOL" && tokenDestino === "USDC") valorRecebido = quantidade * precoSOL;
    if (tokenOrigem === "USDC" && tokenDestino === "SOL") valorRecebido = quantidade / precoSOL;

    document.getElementById("resultado").innerHTML = `Estimativa: ${valorRecebido.toFixed(6)} ${tokenDestino}`;
}

function fazerSwap() {
    // Verifica se carteira está conectada
    if (!carteiraConectadaStatus()) {
        alert("🔗 Conecte sua Phantom Wallet primeiro!");
        conectarCarteira();
        return;
    }

    const tokenOrigem = document.getElementById("tokenFrom")?.value || document.getElementById("moedaEnvia")?.value;
    const tokenDestino = document.getElementById("tokenTo")?.value || document.getElementById("moedaRecebe")?.value;
    const quantidade = document.getElementById("amount")?.value || document.getElementById("quantidadeEnvia")?.value;

    if (!quantidade || Number(quantidade) <= 0) {
        alert("❌ Digite uma quantidade válida.");
        return;
    }

    document.getElementById("resultado").innerHTML =
        "🔄 Preparando swap de " + quantidade + " " + tokenOrigem + " para " + tokenDestino + "...";

    console.log({
        tokenOrigem,
        tokenDestino,
        quantidade,
        carteira: enderecoCarteira
    });

    // Aviso de funcionalidade
    setTimeout(() => {
        alert("🚀 Swap integrado com Jupiter Aggregator! Em breve liberação completa para negociação direta na rede Solana.");
        adicionarNotificacao(`🔄 Solicitação de swap: ${quantidade} ${tokenOrigem} → ${tokenDestino}`);
    }, 1000);
}

// Atualiza valores automaticamente
document.getElementById("amount")?.addEventListener("input", calcularValorEstimado);
document.getElementById("quantidadeEnvia")?.addEventListener("input", calcularValorEstimado);
document.getElementById("tokenFrom")?.addEventListener("change", calcularValorEstimado);
document.getElementById("moedaEnvia")?.addEventListener("change", calcularValorEstimado);
document.getElementById("tokenTo")?.addEventListener("change", calcularValorEstimado);
document.getElementById("moedaRecebe")?.addEventListener("change", calcularValorEstimado);

// Inicializa
atualizarPrecosSwap();
setInterval(atualizarPrecosSwap, 120000);
alert("✅ swap.js carregou com sucesso!");
