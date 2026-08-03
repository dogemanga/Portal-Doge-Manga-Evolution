// ==================================
// DOGE MANGA EVOLUTION
// swap.js
// ==================================

function fazerSwap(){

    const origem = document.getElementById("tokenFrom").value;
    const destino = document.getElementById("tokenTo").value;
    const quantidade = document.getElementById("amount").value;
    const resultado = document.getElementById("resultado");


    if(!quantidade || quantidade <= 0){

        alert("Digite uma quantidade válida.");
        return;

    }


    resultado.innerHTML =
    "Preparando troca: " +
    quantidade +
    " " +
    origem +
    " → " +
    destino;


    console.log("Swap solicitado:", {

        origem: origem,
        destino: destino,
        quantidade: quantidade

    });


}
