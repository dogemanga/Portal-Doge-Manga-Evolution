<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐕 Doge Manga Swap</title>
    <script src="https://cdn.jsdelivr.net/npm/@solana/web3.js@1.95.3/lib/index.iife.min.js"></script>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050816; font-family: Arial, sans-serif; padding: 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .container { max-width: 500px; width: 100%; background: #111827; padding: 25px; border-radius: 16px; border: 2px solid #facc15; color: white; }
        
        /* 🐕 Estilo da imagem */
        .logo-art {
            width: 100%;
            max-width: 280px;
            height: auto;
            border-radius: 15px;
            border: 2px solid #facc15;
            margin: 0 auto 15px auto;
            display: block;
            object-fit: contain;
        }

        h2 { color: #facc15; text-align: center; margin-bottom: 20px; }
        button { width: 100%; padding: 12px; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; transition: opacity 0.2s; margin: 5px 0; }
        button:hover { opacity: 0.9; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-conectar { background: #facc15; color: #050816; }
        .btn-cotacao { background: #2563eb; color: white; }
        .btn-swap { background: #16a34a; color: white; }
        .info { margin: 15px 0; padding: 12px; background: #050816; border-radius: 8px; font-size: 14px; line-height: 1.6; }
        label { display: block; margin: 12px 0 5px; font-size: 14px; color: #d1d5db; }
        select, input { width: 100%; padding: 10px; border-radius: 6px; background: #1f2937; color: white; border: 1px solid #374151; font-size: 15px; }
        a { color: #facc15; text-decoration: none; }
    </style>
</head>
<body>
<div class="container">
    <!-- 🐕 IMAGEM JÁ COLOCADA NO LUGAR CERTO -->
    <img src="imagens/1785844400390.png" alt="Doge Manga Oficial" class="logo-art">
    
    <h2>🐕 Doge Manga Swap</h2>

    <button class="btn-conectar" onclick="connectWallet()">Conectar Phantom</button>
    <div id="wallet" class="info"></div>
    <div id="saldos" class="info"></div>

    <label>De:</label>
    <select id="tokenFrom">
        <option value="SOL">SOL</option>
        <option value="USDC">USDC</option>
        <option value="DGM">DGM</option>
    </select>

    <label>Para:</label>
    <select id="tokenTo">
        <option value="USDC">USDC</option>
        <option value="SOL">SOL</option>
        <option value="DGM">DGM</option>
    </select>

    <label>Quantidade:</label>
    <input type="number" step="0.0001" id="amount" placeholder="Ex: 0.1">

    <button class="btn-cotacao" onclick="getQuote()" id="quoteBtn">Buscar Cotação</button>
    <div id="quote" class="info"></div>
    <button class="btn-swap" onclick="executarSwap()" id="swapBtn" disabled>Trocar Agora</button>
    <div id="status" class="info"></div>
</div>

<script>
// ===============================
// CONFIGURAÇÕES
// ===============================
const ATIVAR_TAXA = false; // ❌ Mude para true quando terminar os testes
const CARTEIRA_TAXA = "2EYaAxuqQtQ52gBMkXBF4859p68BPabE113UNbxqLU2f";
const TAX_WALLET = new solanaWeb3.PublicKey(CARTEIRA_TAXA);
const TAXA_SWAP = 0.005; // 0,5%
const TAXA_EM_BPS = Math.round(TAXA_SWAP * 100 * 100);

const DGM_MINT = new solanaWeb3.PublicKey("E9qgVy6urPUrKBv3wymPSgSPbDGM5z77ZnVok4YvUmqE");
const USDC_MINT = new solanaWeb3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const SPL_TOKEN_PROGRAM = new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_TOKEN_PROGRAM = new solanaWeb3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

const MINT_ADDRESSES = {
    SOL: "So11111111111111111111111111111111111111112",
    USDC: USDC_MINT.toString(),
    DGM: DGM_MINT.toString()
};

const TOKEN_DECIMALS = {
    SOL: 9,
    USDC: 6,
    DGM: 6
};

const VALOR_MINIMO = {
    SOL: 0.01,
    USDC: 1,
    DGM: 1000
};

let wallet = null;
let ultimaRota = null;
let processando = false;

// ===============================
// AUTO-CONEXÃO
// ===============================
async function verificarCarteira(){
    if(window.solana?.isPhantom){
        try{
            const resp = await window.solana.connect({ onlyIfTrusted: true });
            wallet = resp.publicKey.toString();
            document.getElementById("wallet").textContent = "Conectada: " + wallet.slice(0,8) + "...";
            document.getElementById("swapBtn").disabled = true;
            await carregarSaldos();
        }catch(e){}
    }
}
window.onload = verificarCarteira;

// ===============================
// CONEXÃO PHANTOM
// ===============================
async function connectWallet(){
    if(!window.solana || !window.solana.isPhantom){
        alert("❌ Abra pelo navegador DENTRO do app Phantom!");
        return;
    }
    try{
        const resp = await window.solana.connect();
        wallet = resp.publicKey.toString();
        document.getElementById("wallet").textContent = "Conectada: " + wallet.slice(0,8) + "...";
        document.getElementById("swapBtn").disabled = true;
        await carregarSaldos();
    }catch(e){
        alert("Erro: " + e.message);
    }
}

// ===============================
// CARREGAR SALDOS
// ===============================
async function carregarSaldos(){
    if(!wallet) return;
    const conexao = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
    const endereco = new solanaWeb3.PublicKey(wallet);

    const saldoSol = await conexao.getBalance(endereco);
    const sol = (saldoSol / 1e9).toFixed(4);

    const contaUsdc = await conexao.getTokenAccountsByOwner(endereco, {mint: USDC_MINT});
    const usdc = contaUsdc.value[0] ? await conexao.getTokenAccountBalance(contaUsdc.value[0].pubkey) : {value: {uiAmount: 0}};

    const contaDgm = await conexao.getTokenAccountsByOwner(endereco, {mint: DGM_MINT});
    const dgm = contaDgm.value[0] ? await conexao.getTokenAccountBalance(contaDgm.value[0].pubkey) : {value: {uiAmount: 0}};

    document.getElementById("saldos").innerHTML = `
Saldo SOL: ${sol}<br>
Saldo USDC: ${usdc.value.uiAmount.toFixed(2)}<br>
Saldo DGM: ${dgm.value.uiAmount.toLocaleString("pt-BR")}
    `.trim();
}

// ===============================
// TRATAMENTO DE ERROS
// ===============================
function mensagemErro(erro){
    const txt = (erro.message || "").toLowerCase();
    if(txt.includes("rejected") || txt.includes("cancelada")) return "❌ Você cancelou a transação";
    if(txt.includes("insufficient")) return "❌ Saldo insuficiente";
    if(txt.includes("blockhash") || txt.includes("expired")) return "❌ Tempo esgotado, tente novamente";
    if(txt.includes("fetch") || txt.includes("network error") || txt.includes("timeout")) return "❌ Sem conexão ou API ocupada, tente novamente em instantes";
    return `❌ Erro: ${erro.message || "Falha desconhecida"}`;
}

// ===============================
// BUSCAR COTAÇÃO CORRIGIDA
// ===============================
async function getQuote(){
    if(processando) return;
    processando = true;

    const de = document.getElementById("tokenFrom").value;
    const para = document.getElementById("tokenTo").value;
    const quant = Number(document.getElementById("amount").value);

    if(!quant || quant <= 0) { alert("Digite um valor válido!"); processando=false; return; }
    if(de === para) { alert("Escolha moedas diferentes!"); processando=false; return; }
    if(quant < VALOR_MINIMO[de]) { alert(`Mínimo: ${VALOR_MINIMO[de]} ${de}`); processando=false; return; }

    if(wallet){
        const conexao = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
        const endereco = new solanaWeb3.PublicKey(wallet);
        let saldoUsuario = 0;
        if(de === "SOL"){
            saldoUsuario = (await conexao.getBalance(endereco)) / 1e9;
        }else{
            const mint = de === "DGM" ? DGM_MINT : USDC_MINT;
            const conta = await conexao.getTokenAccountsByOwner(endereco, {mint});
            if(conta.value[0]) saldoUsuario = (await conexao.getTokenAccountBalance(conta.value[0].pubkey)).value.uiAmount;
        }
        if(quant > saldoUsuario){
            alert(`Saldo insuficiente! Você tem ${saldoUsuario.toFixed(4)} ${de}`);
            processando = false;
            return;
        }
    }

    document.getElementById("status").textContent = "🔍 Buscando cotação...";
    document.getElementById("swapBtn").disabled = true;
    ultimaRota = null;

    try{
        const bruto = Math.floor(quant * (10 ** TOKEN_DECIMALS[de]));
        let url = `https://quote-api.jup.ag/v6/quote?inputMint=${MINT_ADDRESSES[de]}&outputMint=${MINT_ADDRESSES[para]}&amount=${bruto}&slippageBps=50`;
        if(ATIVAR_TAXA) url += `&platformFeeBps=${TAXA_EM_BPS}`;

        const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
        if(!res.ok) throw new Error(`Erro na rede: ${res.status}`);
        const dados = await res.json();
        
        if(!dados.routePlan || !dados.outAmount) throw new Error(dados.errorDescription || dados.error || "Nenhuma rota válida encontrada");
        
        ultimaRota = dados;
        const decimaisSaida = 10 ** TOKEN_DECIMALS[para];
        const receber = dados.outAmount / decimaisSaida;
        const taxa = ATIVAR_TAXA ? receber * TAXA_SWAP : 0;
        const final = receber - taxa;

        document.getElementById("quote").innerHTML = `
Você envia: <strong>${quant.toFixed(6)} ${de}</strong><br>
Recebe: <strong>${final.toFixed(6)} ${para}</strong>
${ATIVAR_TAXA ? `<br>Taxa Doge Manga: ${taxa.toFixed(6)} ${para}` : ""}
        `.trim();

        document.getElementById("status").textContent = "✅ Cotação pronta";
        document.getElementById("swapBtn").disabled = false;
    }catch(e){
        document.getElementById("status").textContent = mensagemErro(e);
    }finally{ processando = false; }
}

// ===============================
// EXECUTAR TROCA
// ===============================
async function executarSwap(){
    if(processando) return;
    processando = true;

    if(!wallet) { alert("Conecte a Phantom!"); processando=false; return; }
    if(!ultimaRota) { alert("Busque a cotação primeiro!"); processando=false; return; }

    document.getElementById("status").textContent = "🚀 Preparando...";
    document.getElementById("swapBtn").disabled = true;

    try{
        let corpo = {
            quoteResponse: ultimaRota,
            userPublicKey: wallet,
            wrapAndUnwrapSol: true,
            asLegacyTransaction: false
        };

        if(ATIVAR_TAXA){
            const moedaSaida = document.getElementById("tokenTo").value;
            let contaTaxa;
            if(moedaSaida === "SOL"){
                contaTaxa = CARTEIRA_TAXA;
            }else{
                const mint = moedaSaida === "DGM" ? DGM_MINT : USDC_MINT;
                const [ata] = await solanaWeb3.PublicKey.findProgramAddress(
                    [TAX_WALLET.toBuffer(), SPL_TOKEN_PROGRAM.toBuffer(), mint.toBuffer()],
                    ASSOCIATED_TOKEN_PROGRAM
                );
                contaTaxa = ata.toString();
            }
            corpo.feeAccount = contaTaxa;
        }

        document.getElementById("status").textContent = "🔐 Solicitando assinatura...";
        const resSwap = await fetch("https://quote-api.jup.ag/v6/swap", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(corpo),
            signal: AbortSignal.timeout(20000)
        });
        if(!resSwap.ok) throw new Error(`Erro na rede: ${resSwap.status}`);
        const dadosSwap = await resSwap.json();
        if(!dadosSwap.swapTransaction) throw new Error(dadosSwap.error || "Falha ao gerar transação");

        const transacao = solanaWeb3.VersionedTransaction.deserialize(Uint8Array.from(atob(dadosSwap.swapTransaction), c=>c.charCodeAt(0)));
        document.getElementById("status").textContent = "🔐 Assine na carteira...";
        const resultado = await window.solana.signAndSendTransaction(transacao);
        const assinatura = resultado.signature || resultado;

        document.getElementById("status").innerHTML = `✅ Concluído!<br><a target="_blank" href="https://solscan.io/tx/${assinatura}">Ver transação</a>`;
        await carregarSaldos();
        ultimaRota = null;

    }catch(e){
        document.getElementById("status").textContent = mensagemErro(e);
    }finally{
        processando = false;
        document.getElementById("swapBtn").disabled = false;
    }
}
</script>
</body>
</html>
