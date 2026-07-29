// 🚀 Portal Doge Manga Evolution
// Phantom Wallet Integration

const connectButton = document.querySelector("#connectWallet");


async function connectPhantomWallet(){

    if(window.solana && window.solana.isPhantom){

        try{

            const response = await window.solana.connect();

            const walletAddress = response.publicKey.toString();

            alert(
                "Carteira conectada:\n" + walletAddress
            );

            console.log(
                "Phantom Wallet:",
                walletAddress
            );

        }

        catch(error){

            console.log(
                "Conexão cancelada",
                error
            );

        }

    }

    else{

        alert(
            "Instale a Phantom Wallet para continuar."
        );

        window.open(
            "https://phantom.app/",
            "_blank"
        );

    }

}



if(connectButton){

    connectButton.addEventListener(
        "click",
        connectPhantomWallet
    );

}
// 🐕 Doge Manga Evolution
// Phantom Wallet Connection


const button = document.getElementById("connectWallet");


if(button){

button.addEventListener("click", async () => {


if(window.solana && window.solana.isPhantom){


try{


const wallet = await window.solana.connect();


const address = wallet.publicKey.toString();


alert(
"Carteira conectada:\n" + address
);


console.log(
"Wallet:",
address
);


}


catch(error){

console.log(error);

}


}

else{


alert(
"Instale a Phantom Wallet para conectar."
);


window.open(
"https://phantom.app/",
"_blank"
);


}


});


}
const janelaGrafico = document.getElementById('janelaGrafico');
const iframeGrafico = document.getElementById('iframeGrafico');
const fecharGrafico = document.getElementById('fecharGrafico');
const fundoGrafico = document.getElementById('fundoGrafico');

function abrirGrafico(link){
    iframeGrafico.src = link;
    janelaGrafico.classList.add('mostrar');
    fundoGrafico.classList.add('mostrar');
}
fecharGrafico.addEventListener('click', ()=>{
    janelaGrafico.classList.remove('mostrar');
    fundoGrafico.classList.remove('mostrar');
    iframeGrafico.src = '';
});
