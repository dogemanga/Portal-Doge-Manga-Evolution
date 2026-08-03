// ===============================
// DOGE MANGA EVOLUTION - swap.js
// ===============================
const CONTRATO_DGM = "E9qgVy6urPUrKBv3wymPSgSPbDGM5z77ZnVok4YvUmqE";
let precoDGM = 0;
let precoSOL = 0;

// Atualiza preços reais
async function atualizarPrecos() {
    try {
        const resDGM = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRATO_DGM}`);
        const dadosDGM = await resDGM.json();
        precoDGM = dadosDGM?.pairs?.[0]?.price?.usd || 0;

        const resSOL = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
        const dadosSOL = await resSOL.json();
        precoSOL = dadosSOL?.solana?.usd || 0;
    } catch (e) {
        console.log("Erro ao buscar preços:", e);
    }
}

// Cálculo automático da estimativa
function calcularEstimativa() {
    const tokenOrigem = document.getElementById("tokenFrom").value;
    const tokenDestino = document.getElementById("tokenTo").value;
    const quantidade = parseFloat(document.getElementById("amount").value) || 0;
    let valorRecebido = 0;

    if (!quantidade || !precoDGM || !precoSOL) {
        document.getElementById("resultado").textContent = "0.00";
        document.getElementById("swapButton").disabled = true;
        return;
    }

    // Regras de conversão
    if (tokenOrigem === "SOL" && tokenDestino === "DGM") valorRecebido = (quantidade * precoSOL) / precoDGM;
    if (tokenOrigem === "DGM" && tokenDestino === "SOL") valorRecebido = (quantidade * precoDGM) / precoSOL;
    if (tokenOrigem === "USDC" && tokenDestino === "DGM") valorRecebido = quantidade / precoDGM;
    if (tokenOrigem === "DGM" && tokenDestino === "USDC") valorRecebido = quantidade * precoDGM;
    if (tokenOrigem === "SOL" && tokenDestino === "USDC") valorRecebido = quantidade * precoSOL;
    if (tokenOrigem === "USDC" && tokenDestino === "SOL") valorRecebido = quantidade / precoSOL;

    document.getElementById("resultado").textContent = valorRecebido.toFixed(6);
    document.getElementById("swapButton").disabled = !carteiraConectadaStatus() || valorRecebido <= 0;
}

// Conectar Phantom
async function conectarCarteira() {
    if (!window.solana || !window.solana.isPhantom) {
        alert(`❌ Phantom NÃO ENCONTRADA!\n\n📱 ABRA ESTA PÁGINA DENTRO DO NAVEGADOR DO APP PHANTOM!`);
        window.open("https://phantom.app/download", "_blank");
        return;
    }
    try {
        await window.solana.connect();
        const end = window.solana.publicKey.toString();
        document.getElementById("btnConectar").textContent = `✅ ${end.slice(0,6)}...`;
        document.getElementById("btnConectar").disabled = true;
        alert("✅ Carteira conectada!");
        calcularEstimativa();
    } catch (e) {
        alert(`⚠️ Erro: ${e.message || "Conexão cancelada"}`);
    }
}

// Função do botão Swap
function fazerSwap() {
    if (!carteiraConectadaStatus()) return alert("🔗 Conecte a carteira primeiro!");
    alert("🚀 Swap pronto! Em breve execução direta na rede Solana.");
}

// Eventos automáticos
document.getElementById("amount").addEventListener("input", calcularEstimativa);
document.getElementById("tokenFrom").addEventListener("change", calcularEstimativa);
document.getElementById("tokenTo").addEventListener("change", calcularEstimativa);

// Inicializa
atualizarPrecos();
setInterval(atualizarPrecos, 120000);
alert("✅ swap.js carregou!");
