// ==================================
// DOGE MANGA EVOLUTION
// swap.js
// ==================================

let ultimoSwap = null;


// Executa ao clicar em Fazer Swap
function fazerSwap(){

    const origem = document.getElementById("tokenFrom").value;
    const destino = document.getElementById("tokenTo").value;
    const quantidade = document.getElementById("amount").value;
    const resultado = document.getElementById("resultado");


    if(!quantidade || Number(quantidade) <= 0){

        alert("Digite uma quantidade válida.");
        return;

    }


    ultimoSwap = {

        tokenOrigem: origem,
        tokenDestino: destino,
        valor: quantidade

    };


    resultado.innerHTML =
    quantidade +
    " " +
    origem +
    " → " +
    destino;


    console.log("Swap preparado:", ultimoSwap);


    alert(
        "Swap preparado com sucesso!"
    );

}



// Atualiza a estimativa na tela
function atualizarEstimativa(){

    const valor =
    document.getElementById("amount").value;


    if(valor){

        document.getElementById("resultado").innerHTML =
        valor;

    }

}
