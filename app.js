let moedas =
JSON.parse(localStorage.getItem("moedas")) || [];



function cadastrarToken(){


let moeda={

nome:nome.value,

simbolo:simbolo.value,

rede:rede.value,

contrato:contrato.value,

logo:logo.value,

site:site.value,

twitter:twitter.value,

telegram:telegram.value,

descricao:descricao.value


};


moedas.push(moeda);


localStorage.setItem(
"moedas",
JSON.stringify(moedas)
);



alert("Token cadastrado com sucesso!");

mostrarMoedas();


}



function mostrarMoedas(){


let area=document.getElementById("moedas");


area.innerHTML="";


moedas.forEach((m)=>{


area.innerHTML += `

<div class="moeda">


<img class="logo" src="${m.logo}">


<h2>${m.nome}
(${m.simbolo})</h2>


<p>
Rede: ${m.rede}
</p>


<p>
Contrato:
${m.contrato}
</p>


<p>
${m.descricao}
</p>


</div>


`;


});


}



function mostrarCadastro(){

document.getElementById("cadastro")
.style.display="block";

}



mostrarMoedas();
