// ===============================
// DOGE MANGA EVOLUTION
// wallet.js
// ===============================

let wallet = null;

async function conectarCarteira() {

    if (!window.solana || !window.solana.isPhantom) {
        alert("Phantom Wallet não encontrada. Instale a Phantom.");
        return;
    }

    try {

        const resposta = await window.solana.connect();

        wallet = resposta.publicKey.toString();

        console.log("Carteira:", wallet);

        alert("Carteira conectada!\n\n" + wallet);

        return wallet;

    } catch (erro) {

        console.error(erro);

        alert("Conexão cancelada.");

    }

}

async function desconectarCarteira() {

    if (window.solana) {

        await window.solana.disconnect();

        wallet = null;

        alert("Carteira desconectada.");

    }

}

function carteiraConectada() {

    return wallet !== null;

}
