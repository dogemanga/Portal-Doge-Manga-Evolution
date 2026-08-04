<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Swap Doge Manga</title>

<style>

body{
background:#050816;
color:white;
font-family:Arial;
text-align:center;
padding:20px;
}

.box{
max-width:450px;
margin:auto;
background:#111827;
padding:25px;
border-radius:20px;
border:1px solid #facc15;
}

h1{
color:#facc15;
}

button{
width:90%;
padding:15px;
margin:10px;
border:0;
border-radius:15px;
background:#facc15;
font-size:18px;
font-weight:bold;
cursor:pointer;
}

input,select{

width:90%;
padding:12px;
margin:8px;
border-radius:10px;
background:#1f2937;
color:white;
border:0;

}

#wallet{

color:#38bdf8;
word-break:break-all;

}

#status{

color:#94a3b8;

}

</style>

</head>

<body>


<div class="box">

<h1>🐕 Swap Doge Manga</h1>


<button onclick="connectWallet()">
🔗 Conectar Phantom
</button>


<p id="wallet">
Carteira desconectada
</p>



<h3>Você envia</h3>

<input 
id="searchFrom"
placeholder="Pesquisar moeda"
oninput="buscarFrom()"
>


<select id="tokenFrom"></select>



<h3>Você recebe</h3>


<input 
id="searchTo"
placeholder="Pesquisar moeda"
oninput="buscarTo()"
>


<select id="tokenTo"></select>



<input 
id="amount"
placeholder="Quantidade"
type="number"
>


<button onclick="swap()">
🚀 Trocar Agora
</button>


<p id="status"></p>


</div>


<script>


const TAX_WALLET =
"2EYaAxuqQtQ52gBMkXBF4859p68BPabE113UNbxqLU2f";


const DGM_MINT =
"E9qgVy6urPUrKBv3wymPSgSPbDGM5z77ZnVok4YvUmqE";



let wallet=null;



let tokens=[

"BTC",
"ETH",
"SOL",
"USDC",
"USDT",
"JUP",
"BONK",
"PEPE",
"WIF",
"RAY",
"ORCA",
"WLD",
"HBAR",
"XRP",
"ZEC",
"DGM"

];



function carregar(){

preencher("tokenFrom",tokens);

preencher("tokenTo",tokens);

}



function preencher(id,lista){

let select=document.getElementById(id);

select.innerHTML="";


lista.forEach(t=>{

let op=document.createElement("option");

op.value=t;

op.text=t;

select.appendChild(op);


});

}



function buscarFrom(){

let valor=
document.getElementById("searchFrom")
.value
.toUpperCase();


preencher(
"tokenFrom",
tokens.filter(t=>t.includes(valor))
);


}



function buscarTo(){

let valor=
document.getElementById("searchTo")
.value
.toUpperCase();


preencher(
"tokenTo",
tokens.filter(t=>t.includes(valor))
);


}



async function connectWallet(){


if(window.solana){


let resp=
await window.solana.connect();


wallet=
resp.publicKey.toString();


document.getElementById("wallet").innerHTML=
"Conectada:<br>"+wallet;


}

else{

alert("Abra pela Phantom");

}


}



function swap(){


if(!wallet){

alert("Conecte a Phantom primeiro");

return;

}


let de=
document.getElementById("tokenFrom").value;


let para=
document.getElementById("tokenTo").value;



document.getElementById("status").innerHTML=

`
Preparando swap:

${de} → ${para}

<br><br>

DGM:
${DGM_MINT}

<br><br>

Carteira taxa:
${TAX_WALLET}
`;

}


carregar();


</script>


</body>
</html>
