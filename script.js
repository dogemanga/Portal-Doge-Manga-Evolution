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
