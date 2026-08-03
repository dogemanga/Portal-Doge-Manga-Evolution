// ===============================
// DOGE MANGA EVOLUTION
// wallet.js
// ===============================

let wallet = null;
let enderecoCarteira = null;


// CONECTAR PHANTOM

async function conectarCarteira() {

    if (!window.solana || !window.solana.isPhantom) {

        alert("Phantom Wallet não encontrada. Instale a Phantom.");

        return;

    }


    try {

        const resposta = await window.solana.connect();


        wallet = window.solana;

        enderecoCarteira = resposta.publicKey.toString();


        console.log("Carteira:", enderecoCarteira);


        alert(
            "Carteira conectada!\n\n" +
            enderecoCarteira
        );


        return enderecoCarteira;


    } catch (erro) {

        console.error(erro);

        alert("Conexão cancelada.");

    }

}



// DESCONECTAR PHANTOM

async function desconectarCarteira() {


    if (wallet) {


        await wallet.disconnect();


        wallet = null;

        enderecoCarteira = null;


        alert("Carteira desconectada.");


    }

}



// VERIFICAR CONEXÃO

function carteiraConectada() {

    return wallet !== null;

}



// PEGAR ENDEREÇO

function pegarEnderecoCarteira(){

    return enderecoCarteira;

}


console.log("wallet.js carregado!");
