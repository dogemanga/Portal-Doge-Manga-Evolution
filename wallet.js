let wallet = null;
let enderecoCarteira = null;

async function conectarCarteira(){
    alert("Entrou na função conectarCarteira");

    if(!window.solana || !window.solana.isPhantom){
        alert("❌ Phantom Wallet não encontrada. Instale em https://phantom.app/");
        window.open("https://phantom.app/", "_blank");
        return;
    }

    try{
        const resposta = await window.solana.connect();
        wallet = window.solana;
        enderecoCarteira = resposta.publicKey.toString();

        console.log("Carteira:", enderecoCarteira);
        alert("✅ Carteira conectada!\n\n" + enderecoCarteira);

        // Sincroniza com o restante do portal
        carteiraConectada = enderecoCarteira;
        document.getElementById('statusCarteira')?.textContent = `Conectada: ${enderecoCarteira.slice(0,10)}...`;
        document.getElementById('statusSwap')?.textContent = `Conectada: ${enderecoCarteira.slice(0,10)}...`;
        document.getElementById('btnConectarSwap')?.textContent = "✅ Carteira Conectada";
        adicionarNotificacao("👛 Phantom Wallet conectada com sucesso!");
        calcularEstimativa?.();
        verificarFormulario?.();
    }catch(erro){
        console.error("Erro na conexão:", erro);
        alert("❌ Erro ao conectar: " + (erro.message || "Conexão cancelada pelo usuário"));
    }
}

async function desconectarCarteira(){
    if(wallet){
        await wallet.disconnect();
        wallet = null;
        enderecoCarteira = null;
        carteiraConectada = null;

        alert("✅ Carteira desconectada.");
        console.log("Carteira desconectada");

        // Atualiza status em todas as telas
        document.getElementById('statusCarteira')?.textContent = "Desconectado";
        document.getElementById('statusSwap')?.textContent = "Carteira não conectada";
        document.getElementById('btnConectarSwap')?.textContent = "🟣 Conectar Phantom";
        adicionarNotificacao("👛 Carteira desconectada");
        verificarFormulario?.();
    }
}

function carteiraConectadaStatus(){
    return wallet !== null;
}

console.log("✅ Gerenciamento Phantom Wallet carregado com sucesso!");
