
function parseExpression(expr) {
    expr = expr.replace(/¬/g, '!');
    expr = expr.replace(/∧/g, '&&');
    expr = expr.replace(/∨/g, '||');
    expr = expr.replace(/→/g, '==>');
    expr = expr.replace(/↔/g, '===');
    return expr;
}


function gerarTabela() {
    const proposicao = document.getElementById("proposicao").value;
    const resultadoDiv = document.getElementById("resultado");
    const mensagemDiv = document.getElementById("mensagem");
    const botao = document.querySelector("button");

    if (!proposicao) {
        mensagemDiv.innerHTML = "Por favor, insira uma proposição lógica.";
        resultadoDiv.innerHTML = '';
        return;
    }

    try {
        
        ativarPulse(botao);

        const expr = parseExpression(proposicao);

        
        const variaveis = [...new Set(proposicao.match(/[a-zA-Z]/g) || [])];

        
        const combinacoes = [];
        for (let i = 0; i < Math.pow(2, variaveis.length); i++) {
            combinacoes.push(i.toString(2).padStart(variaveis.length, '0').split('').map(Number));
        }

        
        let tabela = '';
        tabela += '<table><tr>' + variaveis.map(v => `<th>${v}</th>`).join('') + '<th>Resultado</th></tr>';

        let resultados = [];
        for (let combinacao of combinacoes) {
            let ambiente = {};
            variaveis.forEach((v, index) => {
                ambiente[v] = combinacao[index] === 1;
            });

            let resultado = new Function(...variaveis, `return ${expr};`)(...Object.values(ambiente));
            tabela += `<tr>${combinacao.map(c => `<td>${c === 1 ? 'V' : 'F'}</td>`).join('')}<td>${resultado ? 'V' : 'F'}</td></tr>`;

            resultados.push(resultado);
        }

        tabela += '</table>';
        resultadoDiv.innerHTML = tabela;

        
        if (resultados.every(res => res)) {
            mensagemDiv.innerHTML = "A proposição é uma Tautologia.";
        } else if (resultados.every(res => !res)) {
            mensagemDiv.innerHTML = "A proposição é uma Contradição.";
        } else {
            mensagemDiv.innerHTML = "A proposição é uma Contingência.";
        }

    } catch (e) {
        mensagemDiv.innerHTML = "Erro ao processar a proposição. Verifique a sintaxe.";
        resultadoDiv.innerHTML = '';
    }
}


function ativarPulse(botao) {
    
    botao.classList.add("pulse-animation");

    
    setTimeout(() => {
        botao.classList.remove("pulse-animation");
    }, 1000); 
}
