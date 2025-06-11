var palavra 
var desenha_letras 
var letra_digitada
var letraMaiuscula
var linha
var valor
var enforcou = false
var acertou = false
var erros = 0
var right = 0
var acertos = false;
var pontos = 0;
var tam
var pontuacao
var ja_digitada = []

async function iniciar() {
    await limparTela();
    palavra = carrega_palavra_secreta();
    desenha_letras = desenha_letras_palavras(palavra);
    enforcou = false
    acertou = false
    erros = 0
    acertos = false;
    right = 0
    ja_digitada = []
    $('#imgForco').attr('src','assets/forcaCompleta.png')
}

function desenha_letras_palavras(palavra) {
    let v = 0
    for (l of palavra) {
        linha = document.createElement("input")
        linha.classList.add("letra");
        linha.id = 'letra' + v
        linha.setAttribute("disabled", "disabled");
        linha.style.display = 'inline-block';
        let divPalavra = document.getElementById("palavraSorteada");
        divPalavra.appendChild(linha)
        v++
    }
}

function carrega_palavra_secreta() {
    let palavras = ["chaveiro", "chave", "boneca", "chuveiro", "maca", "banana", "melancia", "dado", "vaca","chinelo", "sapato"];
    tam = palavras.length
    let qtd = palavras.length - 1;
    let pos = Math.round(Math.random() * qtd);
    let palavra_secreta = palavras[pos].toUpperCase();

    return palavra_secreta;
}

function jogar() {
    letra_digitada = document.getElementById('letraDigitada').value;
    letraMaiuscula = letra_digitada.toUpperCase()
    letra_digitada = document.getElementById('letraDigitada').value = ""
    letrasErradas=[]

    for(let l of ja_digitada){
        if(l == letraMaiuscula){
            alert('Essa letra ja foi digitada')
        }
    }


    if (letraMaiuscula == "") {
        alert("Por favor, digite uma letra!")
    }else{  
        marca_chute_correto(letraMaiuscula, palavra)

        if (!acertos) {
            erros++
            desenhaForca(erros);

            // document.querySelectorAll("#letrasDigitadas")
        } else if (acertos) {
            console.log(right);
            acertos = false;
        }

        if(erros == 7) {
            // mostrar desenho final da forca
            alert("Não foi dessa vez! A palavra sorteada era " + palavra)
            // desabilitar o input para digitar e habilitar ao sortear uma palavra ou reiniciar;
        }else if(right == palavra.length){
            alert("PARABÉNS!")
            console.log(pontuacao);

            // Registrar pontuação no banco de dados (ID 1 = Jogo da Forca)
            if (typeof registrarPontuacao === 'function') {
                registrarPontuacao(1, pontuacao);
            }

            // Salvar pontuação no localStorage
            console.log("Salvando pontuação do Jogo da Forca. Pontuação:", pontuacao);

            let jogos = JSON.parse(localStorage.getItem('nome_jogo')) || [];
            console.log("Jogos atuais:", jogos);

            // Verificar se o jogo já existe na lista
            let jogoExiste = false;
            for (let i = 0; i < jogos.length; i++) {
                if (jogos[i].nomejogo.includes('Forca')) {
                    jogos[i].pontos = pontuacao;
                    jogoExiste = true;
                    console.log("Jogo encontrado na lista, atualizando pontuação para:", pontuacao);
                    break;
                }
            }

            // Se o jogo não existir, adicionar à lista
            if (!jogoExiste) {
                console.log("Jogo não encontrado na lista, adicionando com pontuação:", pontuacao);
                jogos.push({
                    nomejogo: 'Jogo da Forca',
                    pontos: pontuacao
                });
            }

            // Salvar a lista atualizada
            localStorage.setItem('nome_jogo', JSON.stringify(jogos));
            console.log("Lista de jogos atualizada no localStorage:", jogos);

            setTimeout(() => {iniciar()}, 3000)
        }

    }



}

function marca_chute_correto(letra_digitada, palavra_secreta) {

    for (pos in palavra_secreta) {
        if (letra_digitada == palavra_secreta[pos]) {
            ja_digitada.push(letra_digitada)
            let acessaLetra = document.getElementById('letra' + pos)
            acessaLetra.value = letra_digitada;
            acertos = true;
            right++
            pontuacao = somaPontos()
        }
    }

}

function desenhaForca(erros) {

    switch (erros) {
        case 1:
            $('#imgForco').attr('src','assets/erro1.png')
            break;
        case 2:
            $('#imgForco').attr('src','assets/erro2.png')
            break;
        case 3:
            $('#imgForco').attr('src','assets/erro3.png')
            break;
        case 4:
            $('#imgForco').attr('src','assets/erro4.png')
            break;
        case 5:
            $('#imgForco').attr('src','assets/erro5.png') 
            break;
        case 6:
            $('#imgForco').attr('src','assets/erro6.png')
            break;
        case 7:
            $('#imgForco').attr('src','assets/erro7.png')
            setTimeout(() => {iniciar()}, 4000)
            break;
        default:
            console.log("Erro!");
    }
}
function somaPontos(){
    return pontos+=10;
}
function limparTela() {
    let linha = document.getElementById("palavraSorteada")
    linha.innerHTML = "";
}

// Objeto com dicas para cada palavra
const dicas = {
    "CHAVEIRO": "Objeto usado para guardar chaves",
    "CHAVE": "Objeto usado para abrir portas",
    "BONECA": "Brinquedo que parece uma pessoa pequena",
    "CHUVEIRO": "Usado para tomar banho",
    "MACA": "Fruta vermelha ou verde",
    "BANANA": "Fruta amarela",
    "MELANCIA": "Fruta grande com interior vermelho",
    "DADO": "Objeto com números usado em jogos",
    "VACA": "Animal que produz leite",
    "CHINELO": "Calçado usado em casa",
    "SAPATO": "Calçado usado na rua"
};

// Função para mostrar a dica
function conhecer() {
    const modal = document.getElementById('modalDica');
    const textoDica = document.getElementById('textoDica');

    // Verifica se uma palavra foi sorteada
    if (!palavra) {
        textoDica.textContent = "Sorteie uma palavra primeiro!";
    } else {
        // Busca a dica para a palavra atual
        const dica = dicas[palavra] || "Esta é uma palavra que você já conhece!";
        textoDica.textContent = dica;
    }

    // Mostra o modal
    modal.style.display = 'flex';
}

// Adiciona evento para fechar o modal
document.addEventListener('DOMContentLoaded', function() {
    const btnFecharDica = document.getElementById('btnFecharDica');
    btnFecharDica.addEventListener('click', function() {
        document.getElementById('modalDica').style.display = 'none';
    });
});

window.addEventListener('load', iniciar);
