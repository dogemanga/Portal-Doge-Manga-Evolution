// ===============================
// DOGE MANGA SWAP - SOLANA
// ===============================

let carteiraUsuario = null;

async function conectarPhantom(){

    if(window.solana && window.solana.isPhantom){

        try {

            const resposta = await window.solana.connect();

            carteiraUsuario = resposta.publicKey.toString();

            document.getElementById("wallet").innerHTML =
            "Conectado: " + carteiraUsuario;

            console.log("Carteira:", carteiraUsuario);

        } catch(error){

            console.log(error);
            alert("Erro ao conectar carteira");

        }

    } else {

        alert("Instale a Phantom Wallet");

    }

}


// Verifica configuração

function verificarConfig(){

    console.log("Token Doge Manga:",
    CONFIG.DOGEMANGA_TOKEN);

    console.log("Recebimento:",
    CONFIG.CARTEIRA_RECEBIMENTO);

    console.log("Taxa:",
    CONFIG.TAXA_SWAP);

}


window.onload = () => {

    verificarConfig();

};
