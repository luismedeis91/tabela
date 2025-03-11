var button, amt, container;
const labels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
                "P","Q","R","S","T","U","V","W","X","Y","Z"];

const operators = ["C","DEL","(",")","→","^","↔","v","~","=","V","F"];

var operation = [];

init();

function init(){
    document.querySelector('#elementos').addEventListener('input', (event) => {
        operation = [];
        for(var i = 0; i < event.target.value.length; i++){
            if(labels.includes(event.target.value[i] || operators.includes(event.target.value[i]))){
                operation.push(event.target.value[i]);
            }
        }
        updateOperation();
    });
    
    initLetters();
    initOperators();
}

function initLetters(){
    amt = Array.from( { length: labels.length }, () => document.createElement('button') );
    container = document.querySelector('.content');
    amt.forEach( (element, i) => {
        element.innerText = labels[i];
        element.addEventListener("click", () => insertValue(labels[i]));
        container.appendChild(element);
    });
}

function initOperators(){
    amt = Array.from( { length: operators.length }, () => document.createElement('button') );
    container = document.querySelector('.menu');
    amt.forEach( (element, i) => {
        element.innerText = operators[i];
        element.addEventListener("click", () => handleOperator(operators[i]));
        container.appendChild(element);
    });
}

function insertValue(value) {
    operation.push(value);
    updateOperation();
}

function handleOperator(op) {
    if (op === "C") {
        operation = [];
        updateOperation(); 
    } else if (op === "DEL") {
        operation.pop(); 
        updateOperation();
    } else if (op === "="){
        gerarTabela();
    } else {
        insertValue(op);
    }
}

function updateOperation(){
    const input = document.querySelector("#elementos");
    input.value = operation.join('');
}

function gerarTabela() {
    const input = document.querySelector("#elementos").value;
    const letras = [...new Set(input.replace(/[^A-Z]/g, ''))];
    const tabelaDiv = document.querySelector("#tabela");

    if (letras.length === 0) {
        tabelaDiv.innerHTML = "Digite uma expressão válida";
        return;
    }

    const linhas = Math.pow(2, letras.length);
    let html = "<table border='1'><thead><tr>";

    letras.forEach(letra => {
        html += `<th>${letra}</th>`;
    });
    html += `<th>Passo a Passo</th><th>Resultado</th></tr></thead><tbody>`;

    for (let i = 0; i < linhas; i++) {
        let valores = {};
        html += "<tr>";
        
        for (let j = 0; j < letras.length; j++) {
            const bit = (i >> (letras.length - j - 1)) & 1;
            valores[letras[j]] = bit === 1 ? 'F' : 'V';
            html += `<td>${valores[letras[j]]}</td>`;
        }

        let expressaoOriginal = input;
        Object.keys(valores).forEach(letra => {
            expressaoOriginal = expressaoOriginal.replace(new RegExp(letra, 'g'), valores[letra] === 'V' ? 'true' : 'false');
        });

        let expressaoConvertida = expressaoOriginal.replace(/~/g, '!')
                                                   .replace(/\^/g, '&&')
                                                   .replace(/v/g, '||')
                                                   .replace(/→/g, '<=')
                                                   .replace(/↔/g, '===');

        let resultado;
        let passoAPasso = expressaoOriginal;
        try {
            resultado = eval(expressaoConvertida) ? 'V' : 'F';
            passoAPasso = expressaoOriginal + " → " + expressaoConvertida;
        } catch (e) {
            resultado = 'Erro';
        }
        html += `<td>${passoAPasso}</td><td>${resultado}</td></tr>`;
    }

    html += "</tbody></table>";
    tabelaDiv.innerHTML = html;
}
