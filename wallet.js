let wallet = null;
let enderecoCarteira = null;

async function conectarCarteira(){
    if(!window.solana || !window.solana.isPhantom){
        alert("❌ Phantom Wallet não encontrada. Instale em https://phantom.app/");
        return;
    }
    try{
        const resposta = await window.solana.connect();
        wallet = window.solana;
        enderecoCarteira = resposta.publicKey.toString();
        alert("✅ Carteira conectada!\n\n" + enderecoCarteira);
    }catch(erro){
        alert("❌ Erro ao conectar: " + erro.message);
    }
}

async function desconectarCarteira(){
    if(wallet){
        await wallet.disconnect();
        wallet = null;
        enderecoCarteira = null;
        alert("✅ Carteira desconectada.");
    }
}

function carteiraConectadaStatus(){
    return wallet !== null;
}

console.log("✅ wallet.js carregado!");
