// ===============================
// DOGE MANGA EVOLUTION
// swap.js
// ===============================

function fazerSwap() {

    const tokenOrigem = document.getElementById("tokenFrom").value;
    const tokenDestino = document.getElementById("tokenTo").value;
    const quantidade = document.getElementById("amount").value;

    if (!quantidade || Number(quantidade) <= 0) {
        alert("Digite uma quantidade válida.");
        return;
    }

    document.getElementById("resultado").innerHTML =
        "Preparando swap de " +
        quantidade +
        " " +
        tokenOrigem +
        " para " +
        tokenDestino +
        "...";

    console.log({
        tokenOrigem,
        tokenDestino,
        quantidade
    }

alert("swap.js carregou!");


