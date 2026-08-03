// ===============================
// DOGE MANGA SWAP - BOTÕES CORRIGIDOS
// ===============================
const CONTRATO_DGM = "E9qgVy6urPUrKBv3wymPSgSPbDGM5z77ZnVok4YvUmqE";
let precoDGM = 0, precoSOL = 0;

// Verifica se a Phantom foi detectada
function temPhantom() {
    return typeof window.solana !== "undefined" && window.solana.isPhantom === true;
}

// 🟢 FUNÇÃO DO BOTÃO "Conectar Phantom"
async function acaoConectar() {
    if (!temPhantom()) {
        alert(`❌ Navegador errado!\n\nAbra o site DENTRO do app Phantom → ícone Navegador 🧭`);
        return;
    }
    try {
        const resp = await window.solana.connect();
        const endereco = resp.publicKey.toString();
        alert(`✅ Carteira conectada!\n${endereco.slice(0,10)}...`);
        // Muda o texto do botão depois de conectar
        const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Conectar Phantom"));
        if (btn) btn.textContent = `✅ ${endereco.slice(0,6)}...`;
    } catch (erro) {
        alert(`⚠️ Erro: ${erro.message || "Conexão cancelada"}`);
    }
}

// 🔄 FUNÇÃO DO BOTÃO "Fazer Swap"
function acaoFazerSwap() {
    if (!temPhantom()) return alert("🔗 Conecte a carteira primeiro!");
    alert("🚀 Swap pronto! Em breve você vai poder trocar diretamente aqui.");
}

// 📊 Busca preços e cálculo automático
async function atualizarPrecos() {
    try {
        const rDGM = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRATO_DGM}`);
        precoDGM = (await rDGM.json())?.pairs?.[0]?.price?.usd || 0;
        const rSOL = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
        precoSOL = (await rSOL.json())?.solana?.usd || 0;
    } catch {}
}
function calcularEstimativa() {
    const q = parseFloat(document.querySelector("input[placeholder='0.00']")?.value) || 0;
    const sel = document.querySelectorAll("select");
    const de = sel[0]?.value, para = sel[1]?.value;
    let res = 0;
    if (!q || !precoDGM || !precoSOL) return mostrarEstimativa("0.00");
    if (de==="SOL"&&para==="DGM") res=(q*precoSOL)/precoDGM;
    if (de==="DGM"&&para==="SOL") res=(q*precoDGM)/precoSOL;
    if (de==="USDC"&&para==="DGM") res=q/precoDGM;
    if (de==="DGM"&&para==="USDC") res=q*precoDGM;
    mostrarEstimativa(res.toFixed(6));
}
function mostrarEstimativa(texto) {
    const el = Array.from(document.querySelectorAll("*")).find(e => e.textContent.includes("Estimativa"));
    if (el) el.innerHTML = `Estimativa: <strong>${texto}</strong>`;
}

// 🔗 LIGA OS BOTÕES ASSIM QUE A PÁGINA CARREGA
window.addEventListener("load", () => {
    // Botão Conectar Phantom
    const btnConectar = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Conectar Phantom"));
    if (btnConectar) {
        btnConectar.addEventListener("click", acaoConectar);
        console.log("✅ Botão Conectar ligado!");
    } else {
        console.log("⚠️ Botão Conectar não encontrado");
    }

    // Botão Fazer Swap
    const btnSwap = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Fazer Swap"));
    if (btnSwap) {
        btnSwap.addEventListener("click", acaoFazerSwap);
        console.log("✅ Botão Fazer Swap ligado!");
    } else {
        console.log("⚠️ Botão Fazer Swap não encontrado");
    }

    // Atualiza cálculo quando mudar valores
    document.querySelector("input[placeholder='0.00']")?.addEventListener("input", calcularEstimativa);
    document.querySelectorAll("select").forEach(s => s.addEventListener("change", calcularEstimativa));

    atualizarPrecos();
    setInterval(atualizarPrecos, 180000);
});

alert("✅ swap.js carregou!");
