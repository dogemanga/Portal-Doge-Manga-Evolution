async function getQuote(){
    const de = document.getElementById("tokenFrom").value;
    const para = document.getElementById("tokenTo").value;
    const quant = parseFloat(document.getElementById("amount").value);
    if(!quant || quant <= 0) return alert("Digite um valor válido!");
    if(de === para) return alert("Escolha moedas diferentes!");

    document.getElementById("status").textContent = "🔍 Buscando cotação...";
    document.getElementById("swapBtn").disabled = true;
    ultimaRota = null;

    try{
        const decimais = de === "SOL" ? 1e9 : 1e6;
        const quantBruto = Math.round(quant * decimais);
        let url = `https://quote-api.jup.ag/v6/quote?inputMint=${MINT_ADDRESSES[de]}&outputMint=${MINT_ADDRESSES[para]}&amount=${quantBruto}&slippageBps=50`;
        
        if(ATIVAR_TAXA){
            const taxaBps = Math.round(TAXA_PORCENTAGEM * 100);
            url += `&platformFeeBps=${taxaBps}`;
            document.getElementById("avisoTaxa").style.display = "block";
        }

        // ✅ GET funciona direto ou com proxy simples
        const res = await fetch(url);
        const dados = await res.json();
        if(!dados.routePlan) throw new Error(dados.error || "Nenhuma rota encontrada");

        const decimaisSaida = para === "SOL" ? 1e9 : 1e6;
        const valorReceber = (dados.outAmount / decimaisSaida).toFixed(6);
        document.getElementById("quote").textContent = `Cotação: ${valorReceber} ${para}`;
        document.getElementById("status").textContent = "✅ Pronto para trocar!";
        ultimaRota = dados;
        document.getElementById("swapBtn").disabled = false;
    }catch(e){
        document.getElementById("status").textContent = "❌ Erro: "+e.message;
    }
}

async function swap(){
    if(!wallet) return alert("Conecte a carteira!");
    if(!ultimaRota) return alert("Busque a cotação primeiro!");
    document.getElementById("status").textContent = "🚀 Enviando transação...";

    try{
        let corpoRequisicao = {
            quoteResponse: ultimaRota,
            userPublicKey: wallet,
            wrapAndUnwrapSol: true
        };

        if(ATIVAR_TAXA){
            const moedaSaida = document.getElementById("tokenTo").value;
            let contaTaxa;
            if(moedaSaida === "SOL"){
                contaTaxa = TAX_WALLET.toString();
            }else{
                const mint = moedaSaida === "DGM" ? DGM_MINT : USDC_MINT;
                const [ata] = await solanaWeb3.PublicKey.findProgramAddress(
                    [TAX_WALLET.toBuffer(), SPL_TOKEN_PROGRAM.toBuffer(), mint.toBuffer()],
                    new solanaWeb3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
                );
                contaTaxa = ata.toString();
            }
            corpoRequisicao.feeAccount = contaTaxa;
        }

        // ✅ POST com proxy compatível ou direto no navegador Phantom
        const resSwap = await fetch("https://quote-api.jup.ag/v6/swap", {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify(corpoRequisicao)
        });

        const dados = await resSwap.json();
        if(!dados.swapTransaction) throw new Error(dados.error || "Falha ao gerar transação");

        const transactionBuf = Uint8Array.from(atob(dados.swapTransaction), c=>c.charCodeAt(0));
        const transaction = solanaWeb3.VersionedTransaction.deserialize(transactionBuf);
        const resultado = await window.solana.signAndSendTransaction(transaction);
        const assinatura = resultado.signature || resultado;

        document.getElementById("status").innerHTML =
        `✅ Concluído!${ATIVAR_TAXA ? "<br>Taxa enviada para sua carteira" : ""}<br>
        <a target="_blank" style="color:#facc15" href="https://solscan.io/tx/${assinatura}">Ver transação</a>`;

    }catch(e){
        document.getElementById("status").textContent = "❌ Erro: "+(e.message || "Cancelado");
    }
}
