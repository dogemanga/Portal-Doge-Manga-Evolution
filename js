// ===============================
// DOGE MANGA - TESTE SEM TAXA + API ATUALIZADA
// ===============================

const ATIVAR_TAXA = false; // ❌ Taxa desligada para testes
const CARTEIRA_TAXA = "2EYaAxuqQtQ52gBMkXBF4859p68BPabE113UNbxqLU2f";
const TAX_WALLET = new solanaWeb3.PublicKey(CARTEIRA_TAXA);
const TAXA_SWAP = 0.005;
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

console.log("🐕 Modo de teste: SEM TAXA | API Jupiter atualizada");

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
// MOTOR JUPITER (ATUALIZADO!)
// ===============================
const JUPITER_QUOTE = "https://lite-api.jup.ag/swap/v1/quote";
const JUPITER_SWAP = "https://lite-api.jup.ag/swap/v1/swap";

async function buscarCotacao(inputMint, outputMint, amount){
    try{
        let url = `${JUPITER_QUOTE}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`;
        if(ATIVAR_TAXA) url += `&platformFeeBps=${TAXA_EM_BPS}`;

        const res = await fetch(url);
        const dados = await res.json();
        if(!dados.routePlan) throw new Error(dados.error || "Nenhuma rota encontrada");
        
        ultimaRota = dados;
        return dados;
    }catch(e){
        console.error("Erro cotação:", e);
        alert("Não foi possível buscar cotação: " + e.message);
    }
}

// ===============================
// ERROS AMIGÁVEIS
// ===============================
function mensagemErro(erro){
    const txt = erro.message.toLowerCase();
    if(txt.includes("rejected") || txt.includes("cancelada")) return "❌ Você cancelou a transação";
    if(txt.includes("insufficient")) return "❌ Saldo insuficiente";
    if(txt.includes("blockhash") || txt.includes("expired")) return "❌ Tempo esgotado, tente novamente";
    if(txt.includes("fetch")) return "❌ Sem conexão com a API, verifique a internet";
    return `❌ Erro: ${erro.message || "Falha desconhecida"}`;
}

// ===============================
// BUSCAR COTAÇÃO
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
        const dados = await buscarCotacao(MINT_ADDRESSES[de], MINT_ADDRESSES[para], bruto);
        if(!dados) { processando=false; return; }

        const decimaisSaida = 10 ** TOKEN_DECIMALS[para];
        const receber = dados.outAmount / decimaisSaida;
        const taxa = ATIVAR_TAXA ? receber * TAXA_SWAP : 0;
        const final = receber - taxa;

        document.getElementById("quote").innerHTML = `
Você envia: <strong>${quant.toFixed(6)} ${de}</strong><br>
Recebe: <strong>${final.toFixed(6)} ${para}</strong>
${ATIVAR_TAXA ? `<br>Taxa: ${taxa.toFixed(6)} ${para}` : ""}
        `.trim();

        document.getElementById("status").textContent = "✅ Cotação pronta";
        document.getElementById("swapBtn").disabled = false;
    }catch(e){
        document.getElementById("status").textContent = mensagemErro(e);
    }finally{ processando = false; }
}

// ===============================
// EXECUTAR SWAP
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
        const resSwap = await fetch(JUPITER_SWAP, {
            method: "POST", headers: {"Content-Type":"application/json"},
            body: JSON.stringify(corpo)
        });
        const dadosSwap = await resSwap.json();
        if(!dadosSwap.swapTransaction) throw new Error(dadosSwap.error || "Falha ao gerar transação");

        const transacao = solanaWeb3.VersionedTransaction.deserialize(Uint8Array.from(atob(dadosSwap.swapTransaction), c=>c.charCodeAt(0)));
        document.getElementById("status").textContent = "🔐 Assine na carteira...";
        const resultado = await window.solana.signAndSendTransaction(transacao);
        const assinatura = resultado.signature || resultado;

        document.getElementById("status").textContent = "⏳ Confirmando...";
        const conexao = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
        await conexao.confirmTransaction(assinatura, "confirmed");

        document.getElementById("status").innerHTML = `✅ Concluído!<br><a style="color:#facc15" target="_blank" href="https://solscan.io/tx/${assinatura}">Ver transação</a>`;
        await carregarSaldos();
        ultimaRota = null;

    }catch(e){
        document.getElementById("status").textContent = mensagemErro(e);
    }finally{
        processando = false;
        document.getElementById("swapBtn").disabled = false;
    }
}

console.log("🐕 Pronto para testes passo a passo!");
