/*
 * JOGO COMPLETE PALAVRAS
 */

// Lista de palavras e imagens correspondentes
const palavras = [
    "ABACAXI",
    "CORAÇÃO",
    "DADO",
    "ELEFANTE",
    "FADA",
    "LÁPIS",
    "MAÇÃ",
    "JANELA"
];

const imagens = [
    "../jogodamemoria/imgs/abacaxi.jpg",
    "../jogodamemoria/imgs/coracao.jpg",
    "../jogodamemoria/imgs/dado.jpg",
    "../jogodamemoria/imgs/elefante.jpg",
    "../jogodamemoria/imgs/fada.jpg",
    "../jogodamemoria/imgs/lapis.jpg",
    "../jogodamemoria/imgs/maca.jpg",
    "../jogodamemoria/imgs/janela.jpg"
];

// Dicas para cada palavra
const dicas = {
    "ABACAXI": "Fruta tropical com casca espinhosa",
    "CORAÇÃO": "Órgão que bombeia sangue pelo corpo",
    "DADO": "Objeto com números usado em jogos",
    "ELEFANTE": "Animal grande com tromba",
    "FADA": "Ser mágico com asas",
    "LÁPIS": "Usado para escrever ou desenhar",
    "MAÇÃ": "Fruta vermelha ou verde",
    "JANELA": "Abertura na parede para deixar entrar luz"
};

// Variáveis do jogo
let palavraAtual = "";
let imagemAtual = "";
let dicaAtual = "";
let indiceAleatorio = 0;
let letrasOcultas = [];
let tentativas = 0;
let pontos = 0;
let jogoIniciado = false;
let indiceLetraAtual = 0; // Índice da letra atual sendo adivinhada

// Inicializa o jogo
function iniciarJogo() {
    // Seleciona uma palavra e imagem aleatória
    indiceAleatorio = Math.floor(Math.random() * palavras.length);
    palavraAtual = palavras[indiceAleatorio];
    imagemAtual = imagens[indiceAleatorio];
    dicaAtual = dicas[palavraAtual];

    // Exibe a imagem
    document.getElementById("imgComplete").src = imagemAtual;
    document.getElementById("imgComplete").alt = "Imagem de " + palavraAtual.toLowerCase();

    // Decide quais letras ocultar (entre 30% e 50% das letras)
    letrasOcultas = [];
    const numLetrasOcultar = Math.floor(palavraAtual.length * (Math.random() * 0.2 + 0.3));

    while (letrasOcultas.length < numLetrasOcultar) {
        const indiceLetra = Math.floor(Math.random() * palavraAtual.length);
        if (!letrasOcultas.includes(indiceLetra)) {
            letrasOcultas.push(indiceLetra);
        }
    }

    // Exibe a palavra com letras faltando
    exibirPalavraComLacunas();

    // Limpa o campo de entrada
    document.querySelector(".letraAcertar span").innerHTML = "";

    // Reinicia o índice da letra atual
    indiceLetraAtual = 0;

    // Cria os campos de entrada para as letras faltantes
    criarCamposEntrada();

    // Reinicia as variáveis do jogo
    tentativas = 0;
    jogoIniciado = true;
}

// Exibe a palavra com lacunas
function exibirPalavraComLacunas() {
    const conjuntoPalavra = document.querySelector(".conjuntoPalavra span");
    conjuntoPalavra.innerHTML = "";

    for (let i = 0; i < palavraAtual.length; i++) {
        if (letrasOcultas.includes(i)) {
            conjuntoPalavra.innerHTML += "<span class='letra-oculta'>_</span>";
        } else {
            conjuntoPalavra.innerHTML += "<span class='letra-visivel'>" + palavraAtual[i] + "</span>";
        }
    }
}

// Cria os campos de entrada para as letras faltantes
function criarCamposEntrada() {
    const letraAcertar = document.querySelector(".letraAcertar span");
    letraAcertar.innerHTML = "";

    // Se todas as letras já foram adivinhadas, não cria mais campos
    if (indiceLetraAtual >= letrasOcultas.length) {
        // Todas as letras foram adivinhadas com sucesso
        mostrarMensagemVitoria(pontos);
        return;
    }

    // Cria um formulário para entrada das letras
    const form = document.createElement("form");
    form.id = "formLetras";
    form.onsubmit = function(e) { e.preventDefault(); verificarResposta(); };

    // Adiciona apenas um campo de entrada para a letra atual
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.className = "input-letra";
    input.dataset.posicao = letrasOcultas[indiceLetraAtual];
    input.required = true;

    form.appendChild(input);

    // Adiciona botão de verificação
    const btnVerificar = document.createElement("button");
    btnVerificar.type = "submit";
    btnVerificar.className = "btn-verificar";
    btnVerificar.textContent = "Verificar";

    form.appendChild(btnVerificar);
    letraAcertar.appendChild(form);

    // Foca no campo de entrada
    input.focus();
}

// Verifica se a resposta está correta
function verificarResposta() {
    if (!jogoIniciado) return;

    const input = document.querySelector(".input-letra");
    const posicao = parseInt(input.dataset.posicao);
    const letraDigitada = input.value.toUpperCase();
    const letraCorreta = palavraAtual[posicao];

    if (letraDigitada !== letraCorreta) {
        // Letra incorreta
        input.classList.add("incorreta");
        tentativas++;

        if (tentativas >= 3) {
            // Após 3 tentativas, mostra a resposta correta
            mostrarRespostaCorreta();
        }
    } else {
        // Letra correta
        input.classList.remove("incorreta");
        input.classList.add("correta");

        // Atualiza a exibição da palavra
        atualizarPalavraExibida(posicao, letraCorreta);

        // Avança para a próxima letra
        indiceLetraAtual++;

        // Pequeno atraso antes de mostrar o próximo campo
        setTimeout(() => {
            // Cria o campo para a próxima letra
            criarCamposEntrada();
        }, 500);

        // Se todas as letras foram adivinhadas
        if (indiceLetraAtual >= letrasOcultas.length) {
            // Calcula pontuação (mais pontos para menos tentativas)
            pontos = Math.max(100 - (tentativas) * 10, 10);

            // Salva a pontuação
            salvarPontuacao(pontos);
        }
    }
}

// Atualiza a exibição da palavra com a letra adivinhada
function atualizarPalavraExibida(posicao, letra) {
    const spans = document.querySelectorAll(".conjuntoPalavra span span");
    spans[posicao].textContent = letra;
    spans[posicao].className = "letra-visivel";
}

// Mostra mensagem de vitória
function mostrarMensagemVitoria(pontos) {
    // Cria o modal de vitória se não existir
    let modal = document.getElementById("mensagemVitoria");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mensagemVitoria";
        modal.className = "mensagem-modal";

        const conteudo = document.createElement("div");
        conteudo.className = "mensagem-conteudo";

        conteudo.innerHTML = `
            <h2>Parabéns!</h2>
            <p>Você completou a palavra corretamente!</p>
            <p>Pontuação: <span id="pontuacaoFinal">${pontos}</span></p>
            <div class="botoes-modal">
                <button id="btnJogarNovamente" class="btn btn-success">Jogar Novamente</button>
                <button id="btnVoltarInicio" class="btn btn-primary">Voltar ao Início</button>
            </div>
        `;

        modal.appendChild(conteudo);
        document.querySelector(".section_jogo").appendChild(modal);

        // Adiciona eventos aos botões
        document.getElementById("btnJogarNovamente").addEventListener("click", function() {
            modal.style.display = "none";
            iniciarJogo();
        });

        document.getElementById("btnVoltarInicio").addEventListener("click", function() {
            window.location.href = "../pages/pag_acessar_estudante.html";
        });
    } else {
        document.getElementById("pontuacaoFinal").textContent = pontos;
    }

    modal.style.display = "flex";
}

// Mostra a resposta correta
function mostrarRespostaCorreta() {
    // Cria o modal de resposta correta se não existir
    let modal = document.getElementById("mensagemResposta");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mensagemResposta";
        modal.className = "mensagem-modal";

        const conteudo = document.createElement("div");
        conteudo.className = "mensagem-conteudo";

        conteudo.innerHTML = `
            <h2>Não foi dessa vez!</h2>
            <p>A palavra correta era: <span id="palavraCorreta">${palavraAtual}</span></p>
            <div class="botoes-modal">
                <button id="btnTentarNovamente" class="btn btn-success">Tentar Outra Palavra</button>
                <button id="btnVoltarInicioResposta" class="btn btn-primary">Voltar ao Início</button>
            </div>
        `;

        modal.appendChild(conteudo);
        document.querySelector(".section_jogo").appendChild(modal);

        // Adiciona eventos aos botões
        document.getElementById("btnTentarNovamente").addEventListener("click", function() {
            modal.style.display = "none";
            iniciarJogo();
        });

        document.getElementById("btnVoltarInicioResposta").addEventListener("click", function() {
            window.location.href = "../pages/pag_acessar_estudante.html";
        });
    } else {
        document.getElementById("palavraCorreta").textContent = palavraAtual;
    }

    modal.style.display = "flex";
}

// Salva a pontuação no localStorage
function salvarPontuacao(pontos) {
    let jogos = JSON.parse(localStorage.getItem('nome_jogo')) || [];

    // Verificar se o jogo já existe na lista
    let jogoExiste = false;
    for (let i = 0; i < jogos.length; i++) {
        if (jogos[i].nomejogo.includes('Complete Palavras')) {
            jogos[i].pontos = pontos;
            jogoExiste = true;
            break;
        }
    }

    // Se o jogo não existir, adicionar à lista
    if (!jogoExiste) {
        jogos.push({
            nomejogo: 'Jogo Complete Palavras',
            pontos: pontos
        });
    }

    // Salvar a lista atualizada
    localStorage.setItem('nome_jogo', JSON.stringify(jogos));
}

// Mostra uma dica sobre a palavra atual
function mostrarDica() {
    if (!jogoIniciado) return;

    // Cria o modal de dica se não existir
    let modal = document.getElementById("modalDica");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modalDica";
        modal.className = "mensagem-modal";

        const conteudo = document.createElement("div");
        conteudo.className = "mensagem-conteudo";

        conteudo.innerHTML = `
            <h2>Dica!</h2>
            <p id="textoDica">${dicaAtual}</p>
            <button id="btnFecharDica" class="btn btn-success">Entendi</button>
        `;

        modal.appendChild(conteudo);
        document.querySelector(".section_jogo").appendChild(modal);

        // Adiciona evento ao botão
        document.getElementById("btnFecharDica").addEventListener("click", function() {
            modal.style.display = "none";
        });
    } else {
        document.getElementById("textoDica").textContent = dicaAtual;
    }

    modal.style.display = "flex";
}

// Função para alternar o áudio
function toggleAudio() {
    const audio = document.getElementById('gameAudio');
    if (audio.paused) {
        audio.play();
        document.getElementById('btnSom').classList.add('playing');
    } else {
        audio.pause();
        document.getElementById('btnSom').classList.remove('playing');
    }
}

// Adiciona eventos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar o jogo
    iniciarJogo();

    // O botão de dica no footer agora mostra instruções do jogo
    // O botão de dica dentro do jogo mostra dicas sobre a palavra atual

    // Exibir nome do aluno e pontuações
    if (localStorage.getItem('nome_estudante')) {
        document.getElementById('nameAluno').textContent = localStorage.getItem('nome_estudante');
    }

    let jogos = JSON.parse(localStorage.getItem('nome_jogo')) || [];
    let totalPontos = 0;

    for (let jogo of jogos) {
        // Somar pontos ao total
        totalPontos += parseInt(jogo.pontos || 0);

        if (jogo.nomejogo.includes('memória') || jogo.nomejogo.includes('Memória')) {
            document.getElementById('jogMemoria').textContent = jogo.nomejogo + ' : ' + jogo.pontos;
        }
        if (jogo.nomejogo.includes('Forca') || jogo.nomejogo.includes('forca')) {
            document.getElementById('jogForca').textContent = jogo.nomejogo + ' : ' + jogo.pontos;
        }
        if (jogo.nomejogo.toLowerCase().includes('7 erros')) {
            document.getElementById('jog7Erros').textContent = jogo.nomejogo + ' : ' + jogo.pontos;
        }
    }

    // Adicionar o total de pontos
    const ulPontos = document.querySelector('.offcanvas-body ul');
    if (ulPontos && !document.querySelector('.total-pontos')) {
        const liTotalPontos = document.createElement('li');
        liTotalPontos.className = 'mt-3 fw-bold total-pontos';
        liTotalPontos.textContent = 'Total de Pontos: ' + totalPontos;
        ulPontos.appendChild(liTotalPontos);
    }
});
