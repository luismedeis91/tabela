

var button, amt, container;
const labels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
                  "P","Q","R","S","T","U","V","W","X","Y","Z"];

const operators = ["C","<-","(",")","->","^","<->","v","~","v","V","F","="];

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
        container.appendChild(element);
    }
    );
}

function initOperators(){
    amt = Array.from( { length: 13 }, () => document.createElement('button') );
    container = document.querySelector('.menu');
    amt.forEach( (element, i) => {
        element.innerText = operators[i];
        container.appendChild(element);
    }
    );
}

function gerarTabela() {
    const input = document.querySelector("#elementos").value;
    const letras = input.replace(/\s+/g, '').split(',');
    const tabelaDiv = document.querySelector("#tabela");

    if (letras.length === 0 || letras[0] === '') {
        tabelaDiv.innerHTML = "Coloca a droga da letra";
        return;
    }

    const linhas = Math.pow(2, letras.length);
    let html = "<table border='1'><thead><tr>";

    //tabela
    letras.forEach(letra => {
        html += `<th>${letra}</th>`;
    });
    html += `<th>AND</th>`;
    html += "</tr></thead><tbody>";

    //valores da tabela
    for (let i = 0; i < linhas; i++) {
        html += "<tr>";
        let valores = [];

        for (let j = 0; j < letras.length; j++) {
            const bit = (i >> (letras.length - j - 1)) & 1;
            const valor = bit === 1 ? 'F' : 'V';
            valores.push(valor);
            html += `<td>${valor}</td>`;
        }

        //AND
        const resultadoAND = valores.every(v => v === 'V') ? 'V' : 'F';
        html += `<td>${resultadoAND}</td>`;
        html += "</tr>";
    }

    html += "</tbody></table>";
    tabelaDiv.innerHTML = html;
}