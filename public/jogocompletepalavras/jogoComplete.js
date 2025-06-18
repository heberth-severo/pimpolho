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
let letrasAdivinhadas = []; // Posições das letras já adivinhadas
let tentativas = 0;
let pontos = 0;
let jogoIniciado = false;

// Variáveis para controle de progresso
let palavrasJogadas = []; // Índices das palavras já jogadas
let palavrasAcertadas = 0; // Contador de palavras acertadas
let palavraAtualNumero = 1; // Número da palavra atual (1-5)
const TOTAL_PALAVRAS_OBJETIVO = 5; // Total de palavras que o aluno deve acertar

// Inicializa o jogo
function iniciarJogo() {
    // Reset das variáveis de progresso se for o primeiro jogo
    if (palavrasJogadas.length === 0) {
        palavrasAcertadas = 0;
        palavraAtualNumero = 1;
    }

    // Seleciona uma palavra que ainda não foi jogada
    let indicesDisponiveis = [];
    for (let i = 0; i < palavras.length; i++) {
        if (!palavrasJogadas.includes(i)) {
            indicesDisponiveis.push(i);
        }
    }

    // Se não há mais palavras disponíveis, reinicia a lista (caso necessário)
    if (indicesDisponiveis.length === 0) {
        palavrasJogadas = [];
        for (let i = 0; i < palavras.length; i++) {
            indicesDisponiveis.push(i);
        }
    }

    // Seleciona uma palavra aleatória dos índices disponíveis
    const indiceEscolhido = Math.floor(Math.random() * indicesDisponiveis.length);
    indiceAleatorio = indicesDisponiveis[indiceEscolhido];
    palavrasJogadas.push(indiceAleatorio);

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

    // Reinicia as letras adivinhadas
    letrasAdivinhadas = [];

    // Cria os campos de entrada para as letras faltantes
    criarCamposEntrada();

    // Reinicia as variáveis do jogo
    tentativas = 0;
    jogoIniciado = true;

    // Atualiza o display de progresso
    // atualizarProgressoDisplay(); // Removido conforme solicitado
}

// Atualiza o display de progresso do jogo
function atualizarProgressoDisplay() {
    // Procura por um elemento de progresso existente ou cria um novo
    let progressoElement = document.getElementById("progressoJogo");
    if (!progressoElement) {
        progressoElement = document.createElement("div");
        progressoElement.id = "progressoJogo";
        progressoElement.className = "progresso-jogo";
        progressoElement.style.cssText = `
            text-align: center;
            margin: 10px 0;
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            background: #ecf0f1;
            padding: 10px;
            border-radius: 8px;
            border: 2px solid #3498db;
        `;

        // Insere o elemento antes da imagem do jogo
        const imgElement = document.getElementById("imgComplete");
        imgElement.parentNode.insertBefore(progressoElement, imgElement);
    }

    progressoElement.textContent = `Palavra ${palavraAtualNumero} de ${TOTAL_PALAVRAS_OBJETIVO} | Palavras acertadas: ${palavrasAcertadas}`;
}

// Função para ir para a próxima palavra
function proximaPalavra() {
    palavraAtualNumero++;

    if (palavraAtualNumero <= TOTAL_PALAVRAS_OBJETIVO) {
        iniciarJogo();
    } else {
        // Todas as 5 palavras foram jogadas, mostrar resultado final
        mostrarResultadoFinal();
    }
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
    if (letrasAdivinhadas.length >= letrasOcultas.length) {
        // Todas as letras foram adivinhadas com sucesso
        palavrasAcertadas++;

        // Calcula pontuação (mais pontos para menos tentativas)
        const pontosRodada = Math.max(100 - (tentativas) * 10, 10);
        pontos += pontosRodada;

        // Verifica se completou todas as 5 palavras
        if (palavrasAcertadas >= TOTAL_PALAVRAS_OBJETIVO) {
            // Salva a pontuação final
            salvarPontuacao(pontos);
            mostrarResultadoFinal();
        } else {
            // Mostra modal de palavra acertada e vai para próxima
            mostrarPalavraAcertada(pontosRodada);
        }
        return;
    }

    // Cria um formulário para entrada das letras
    const form = document.createElement("form");
    form.id = "formLetras";
    form.onsubmit = function(e) { e.preventDefault(); verificarResposta(); };

    // Adiciona um campo de entrada para qualquer letra faltante
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.className = "input-letra";
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
    const letraDigitada = input.value.toUpperCase();

    // Encontra todas as posições onde esta letra aparece nas posições ocultas
    const posicoesDisponiveis = letrasOcultas.filter(pos => 
        palavraAtual[pos] === letraDigitada && !letrasAdivinhadas.includes(pos)
    );

    if (posicoesDisponiveis.length === 0) {
        // Letra incorreta ou já foi adivinhada
        input.classList.add("incorreta");
        tentativas++;

        if (tentativas >= 3) {
            // Após 5 tentativas, mostra a resposta correta
            mostrarRespostaCorreta();
        }
    } else {
        // Letra correta - marca a primeira posição disponível como adivinhada
        const posicao = posicoesDisponiveis[0];
        letrasAdivinhadas.push(posicao);

        input.classList.remove("incorreta");
        input.classList.add("correta");

        // Atualiza a exibição da palavra
        atualizarPalavraExibida(posicao, letraDigitada);

        // Pequeno atraso antes de mostrar o próximo campo
        setTimeout(() => {
            // Cria o campo para a próxima letra
            criarCamposEntrada();
        }, 500);

        // A lógica de vitória foi movida para criarCamposEntrada()
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
            <p>Progresso: <span id="progressoRespostaTexto">${palavrasAcertadas} palavras acertadas</span></p>
            <div class="botoes-modal">
                <button id="btnTentarNovamente" class="btn btn-success">Próxima Palavra</button>
            </div>
        `;

        modal.appendChild(conteudo);
        document.querySelector(".section_jogo").appendChild(modal);

        // Adiciona evento ao botão
        document.getElementById("btnTentarNovamente").addEventListener("click", function() {
            modal.style.display = "none";
            proximaPalavra();
        });
    } else {
        document.getElementById("palavraCorreta").textContent = palavraAtual;
        document.getElementById("progressoRespostaTexto").textContent = `${palavrasAcertadas} palavras acertadas`;
    }

    modal.style.display = "flex";
}

// Mostra modal quando uma palavra é acertada (mas ainda não terminou o jogo)
function mostrarPalavraAcertada(pontosRodada) {
    // Cria o modal de palavra acertada se não existir
    let modal = document.getElementById("mensagemPalavraAcertada");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mensagemPalavraAcertada";
        modal.className = "mensagem-modal";

        const conteudo = document.createElement("div");
        conteudo.className = "mensagem-conteudo";

        conteudo.innerHTML = `
            <h2>Parabéns!</h2>
            <p>Você acertou a palavra: <strong id="palavraAcertadaTexto">${palavraAtual}</strong></p>
            <p>Pontos desta rodada: <span id="pontosRodada">${pontosRodada}</span></p>
            <p>Progresso: <span id="progressoTexto">${palavrasAcertadas} palavras acertadas</span></p>
            <div class="botoes-modal">
                <button id="btnProximaPalavra" class="btn btn-success">Próxima Palavra</button>
            </div>
        `;

        modal.appendChild(conteudo);
        document.querySelector(".section_jogo").appendChild(modal);

        // Adiciona evento ao botão
        document.getElementById("btnProximaPalavra").addEventListener("click", function() {
            modal.style.display = "none";
            proximaPalavra();
        });
    } else {
        document.getElementById("palavraAcertadaTexto").textContent = palavraAtual;
        document.getElementById("pontosRodada").textContent = pontosRodada;
        document.getElementById("progressoTexto").textContent = `${palavrasAcertadas} palavras acertadas`;
    }

    modal.style.display = "flex";
}

// Mostra o resultado final após completar todas as 5 palavras
function mostrarResultadoFinal() {
    // Cria o modal de resultado final se não existir
    let modal = document.getElementById("mensagemResultadoFinal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "mensagemResultadoFinal";
        modal.className = "mensagem-modal";

        const conteudo = document.createElement("div");
        conteudo.className = "mensagem-conteudo";

        conteudo.innerHTML = `
            <h2>🎉 Parabéns! 🎉</h2>
            <p>Você completou todas as ${TOTAL_PALAVRAS_OBJETIVO} palavras!</p>
            <p>Palavras acertadas: <span id="palavrasAcertadasFinal">${palavrasAcertadas}</span></p>
            <p>Pontuação total: <span id="pontuacaoTotalFinal">${pontos}</span></p>
            <div class="botoes-modal">
                <button id="btnJogarNovamenteFinal" class="btn btn-success">Jogar Novamente</button>
                <button id="btnVoltarInicioFinal" class="btn btn-primary">Voltar ao Início</button>
            </div>
        `;

        modal.appendChild(conteudo);
        document.querySelector(".section_jogo").appendChild(modal);

        // Adiciona eventos aos botões
        document.getElementById("btnJogarNovamenteFinal").addEventListener("click", function() {
            modal.style.display = "none";
            // Reinicia o jogo completamente
            palavrasJogadas = [];
            palavrasAcertadas = 0;
            palavraAtualNumero = 1;
            pontos = 0;
            iniciarJogo();
        });

        document.getElementById("btnVoltarInicioFinal").addEventListener("click", function() {
            window.location.href = "../pages/pag_acessar_estudante.html";
        });
    } else {
        document.getElementById("palavrasAcertadasFinal").textContent = palavrasAcertadas;
        document.getElementById("pontuacaoTotalFinal").textContent = pontos;
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
