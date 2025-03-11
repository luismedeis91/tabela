var button, amt, container;
const labels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
                  "P","Q","R","S","T","U","V","W","X","Y","Z"];

const operators = ["C","DEL","(",")","→","^","↔","v","~","v","V","F","="];

var operation = [];

init();

function init(){
    initLetters();
    initOperators();
}

function initLetters(){
    amt = Array.from( { length: 26 }, () => document.createElement('button') );
    container = document.querySelector('.content');
    amt.forEach( (element, i) => {
        element.innerText = labels[i];
        element.addEventListener("click", () => insertValue(labels[i]));
        container.appendChild(element);
    });
}

function initOperators(){
    amt = Array.from( { length: 13 }, () => document.createElement('button') );
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
    const input = document.querySelector("#elementos");
    switch(op){
        case "C":
            operation = [];
            updateOperation(); //pra limpar toda a caixa de texto
            break;
        case "DEL":
            operation.pop(); //deletar ultimo caractere colocado
            updateOperation();
            break;
        case "=":
            gerarTabela();break;
        default:
            insertValue(op);
            break;
    }
}

function updateOperation(){
    const input = document.querySelector("#elementos");
    input.value = "";

    operation.forEach( (element) => {
        input.value += element;
    })
}

function gerarTabela() {
    const input = document.querySelector("#elementos").value;
    const letras = input.replace(/[^A-Z]/g, '').split('');
    const tabelaDiv = document.querySelector("#tabela");
    const temAND = input.includes("^");
    const temOR = input.includes("v");

    //se a caixa de texto estiver vazia
    if (letras.length === 0 || letras[0] === '') {
        tabelaDiv.innerHTML = "Coloca a droga da letra";
        return;
    }

    const linhas = Math.pow(2, letras.length);
    let html = "<table border='1'><thead><tr>";

    letras.forEach(letra => {
        html += `<th>${letra}</th>`;
    });
    if (temAND) html += `<th>AND</th>`;
    if (temOR) html += `<th>OR</th>`;
    html += "</tr></thead><tbody>";

    for (let i = 0; i < linhas; i++) {
        html += "<tr>";
        let valores = [];

        for (let j = 0; j < letras.length; j++) {
            const bit = (i >> (letras.length - j - 1)) & 1;
            const valor = bit === 1 ? 'F' : 'V';
            valores.push(valor);
            html += `<td>${valor}</td>`;
        }

        if (temAND) {
            const resultadoAND = valores.every(v => v === 'V') ? 'V' : 'F';
            html += `<td>${resultadoAND}</td>`;
        }
        if (temOR) {
            const resultadoOR = valores.some(v => v === 'V') ? 'V' : 'F';
            html += `<td>${resultadoOR}</td>`;
        }
        html += "</tr>";
    }

    html += "</tbody></table>";
    tabelaDiv.innerHTML = html;
}
