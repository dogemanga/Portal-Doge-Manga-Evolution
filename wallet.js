let wallet = null;
let enderecoCarteira = null;


async function conectarCarteira(){

    alert("Entrou na função conectarCarteira");


    if(!window.solana || !window.solana.isPhantom){

        alert("Phantom Wallet não encontrada.");

        return;

    }


    try{

        const resposta = await window.solana.connect();


        wallet = window.solana;

        enderecoCarteira = resposta.publicKey.toString();


        console.log("Carteira:", enderecoCarteira);


        alert("Carteira conectada!\n\n" + enderecoCarteira);


    }catch(erro){

        console.error(erro);

        alert("Erro ao conectar.");

    }

}


async function desconectarCarteira(){

    if(wallet){

        await wallet.disconnect();

        wallet = null;

        enderecoCarteira = null;

        alert("Carteira desconectada.");

    }

}


function carteiraConectada(){

    return wallet !== null;

}


console.log("wallet.js carregado!");
