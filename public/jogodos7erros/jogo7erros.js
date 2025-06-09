/*
 * JOGO DOS 7 ERROS
 */

// Variáveis globais
let pontos = 0;
let pontuacao = 0;
let diferencasEncontradas = 0;
let desenhoOriginal = null;
let desenhoModificado = null;
let diferencas = [];
let desenhando = false;
let modoAtual = 'criar';
let modoBorracha = false;
let modoRabisco = false; // Modo para rabiscar no jogo

// Elementos do DOM
let canvasOriginal, ctxOriginal;
let canvasModificado, ctxModificado;
let canvasJogoOriginal, ctxJogoOriginal;
let canvasJogoModificado, ctxJogoModificado;
let corPincel, tamanhoPincel;

// Coordenadas para desenho
let ultimoX = 0;
let ultimoY = 0;

// Inicializar o jogo quando a página carregar
window.addEventListener('load', inicializar);

function inicializar() {
    // Obter referências aos elementos do DOM
    canvasOriginal = document.getElementById('canvasOriginal');
    ctxOriginal = canvasOriginal.getContext('2d');

    canvasModificado = document.getElementById('canvasModificado');
    ctxModificado = canvasModificado.getContext('2d');

    canvasJogoOriginal = document.getElementById('canvasJogoOriginal');
    ctxJogoOriginal = canvasJogoOriginal.getContext('2d');

    canvasJogoModificado = document.getElementById('canvasJogoModificado');
    ctxJogoModificado = canvasJogoModificado.getContext('2d');

    corPincel = document.getElementById('corPincel');
    tamanhoPincel = document.getElementById('tamanhoPincel');

    // Configurar eventos de desenho para o canvas original
    configurarEventosDesenho(canvasOriginal, ctxOriginal);

    // Configurar botões
    document.getElementById('btnCriar').addEventListener('click', () => mudarModo('criar'));
    document.getElementById('btnJogar').addEventListener('click', () => mudarModo('jogar'));
    document.getElementById('btnLimpar').addEventListener('click', limparCanvas);
    document.getElementById('btnSalvar').addEventListener('click', salvarDesenhoOriginal);
    document.getElementById('btnSalvarJogo').addEventListener('click', salvarJogo);
    document.getElementById('btnNovoJogo').addEventListener('click', carregarJogo);
    document.getElementById('btnJogarNovamente').addEventListener('click', () => {
        document.getElementById('mensagemVitoria').style.display = 'none';
        carregarJogo();
    });

    // Configurar botão de borracha
    document.getElementById('btnBorracha').addEventListener('click', toggleBorracha);

    // Configurar botões do modo rabisco
    document.getElementById('btnRabisco').addEventListener('click', function() {
        // Mostrar a barra de ferramentas quando o botão de rabisco é clicado
        document.querySelector('#modoJogar .ferramentas').style.display = 'flex';
        toggleRabisco();
    });

    document.getElementById('btnLimparRabiscos').addEventListener('click', function() {
        if (modoRabisco) {
            // Se estiver no modo rabisco, redesenhar os contornos
            desenharContornosDiferencas();
        } else {
            // Se não estiver no modo rabisco, apenas limpar os rabiscos
            limparRabiscos();
        }
    });

    // Configurar botões do modal de confirmação para limpar
    document.getElementById('btnConfirmarLimpar').addEventListener('click', confirmarLimparCanvas);
    document.getElementById('btnCancelarLimpar').addEventListener('click', cancelarLimparCanvas);

    // Configurar eventos para detectar diferenças
    canvasJogoModificado.addEventListener('click', verificarDiferenca);

    // Iniciar no modo criar
    mudarModo('criar');
}

// Configurar eventos de desenho para um canvas
function configurarEventosDesenho(canvas, ctx) {
    // Remover eventos existentes para evitar duplicação
    canvas.removeEventListener('mousedown', canvas.iniciarDesenho);
    canvas.removeEventListener('mousemove', canvas.desenhar);
    canvas.removeEventListener('mouseup', canvas.pararDesenho);
    canvas.removeEventListener('mouseout', canvas.pararDesenho);
    canvas.removeEventListener('touchstart', canvas.iniciarDesenhoTouch);
    canvas.removeEventListener('touchmove', canvas.desenharTouch);
    canvas.removeEventListener('touchend', canvas.pararDesenho);

    // Funções de evento
    canvas.iniciarDesenho = function(e) {
        desenhando = true;
        [ultimoX, ultimoY] = [e.offsetX, e.offsetY];

        // Se estiver no modo jogo e rabisco, desativar verificação de diferença
        if (modoAtual === 'jogar' && modoRabisco && canvas === canvasJogoModificado) {
            e.stopPropagation(); // Impedir que o clique seja processado para verificação de diferença
        }
    };

    canvas.iniciarDesenhoTouch = function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        desenhando = true;
        [ultimoX, ultimoY] = [x, y];

        // Se estiver no modo jogo e rabisco, desativar verificação de diferença
        if (modoAtual === 'jogar' && modoRabisco && canvas === canvasJogoModificado) {
            e.stopPropagation();
        }
    };

    canvas.desenhar = function(e) {
        if (!desenhando) return;

        const x = e.offsetX;
        const y = e.offsetY;

        ctx.beginPath();

        // Usar cores e tamanhos diferentes dependendo do modo
        if (modoAtual === 'jogar' && canvas === canvasJogoModificado) {
            // No modo jogo, usar as configurações de rabisco
            const corRabisco = document.getElementById('corRabisco');
            const tamanhoRabisco = document.getElementById('tamanhoRabisco');
            ctx.strokeStyle = corRabisco.value;
            ctx.lineWidth = tamanhoRabisco.value;

            // Verificar se estamos desenhando sobre uma diferença
            if (modoRabisco) {
                for (let i = 0; i < diferencas.length; i++) {
                    const dif = diferencas[i];

                    // Se a diferença já foi encontrada, pular
                    if (dif.encontrada) continue;

                    // Calcular a distância entre o desenho e a diferença
                    const distancia = Math.sqrt(Math.pow(x - dif.x, 2) + Math.pow(y - dif.y, 2));

                    // Usar o raio da diferença se disponível, ou um valor padrão
                    // Aumentar o raio de detecção para melhorar a detecção no centro da tela
                    const raioDeteccao = (dif.raio || 35) * 1.5;

                    // Se o desenho foi próximo o suficiente da diferença
                    if (distancia < raioDeteccao) {
                        // Marcar como encontrada
                        dif.encontrada = true;
                        diferencasEncontradas++;

                        // Atualizar contador
                        document.getElementById('diferencasEncontradas').textContent = diferencasEncontradas;

                        // Somar pontos
                        pontuacao = somaPontos();
                        document.getElementById('pontuacao').textContent = pontuacao;

                        // Destacar a diferença
                        destacarDiferenca(dif.x, dif.y, raioDeteccao);

                        // Verificar se todas as diferenças foram encontradas
                        if (diferencasEncontradas === 7) {
                            // Mostrar mensagem de vitória
                            document.getElementById('pontuacaoFinal').textContent = pontuacao;
                            document.getElementById('mensagemVitoria').style.display = 'flex';

                            // Salvar pontuação
                            salvarPontuacao();
                        }

                        break;
                    }
                }
            }
        } else {
            // No modo criar, usar as configurações normais
            ctx.strokeStyle = modoBorracha ? '#FFFFFF' : corPincel.value;
            ctx.lineWidth = tamanhoPincel.value;
        }

        ctx.lineCap = 'round';
        ctx.moveTo(ultimoX, ultimoY);
        ctx.lineTo(x, y);
        ctx.stroke();

        [ultimoX, ultimoY] = [x, y];
    };

    canvas.desenharTouch = function(e) {
        e.preventDefault();
        if (!desenhando) return;

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        ctx.beginPath();

        // Usar cores e tamanhos diferentes dependendo do modo
        if (modoAtual === 'jogar' && canvas === canvasJogoModificado) {
            // No modo jogo, usar as configurações de rabisco
            const corRabisco = document.getElementById('corRabisco');
            const tamanhoRabisco = document.getElementById('tamanhoRabisco');
            ctx.strokeStyle = corRabisco.value;
            ctx.lineWidth = tamanhoRabisco.value;

            // Verificar se estamos desenhando sobre uma diferença
            if (modoRabisco) {
                for (let i = 0; i < diferencas.length; i++) {
                    const dif = diferencas[i];

                    // Se a diferença já foi encontrada, pular
                    if (dif.encontrada) continue;

                    // Calcular a distância entre o desenho e a diferença
                    const distancia = Math.sqrt(Math.pow(x - dif.x, 2) + Math.pow(y - dif.y, 2));

                    // Usar o raio da diferença se disponível, ou um valor padrão
                    // Aumentar o raio de detecção para melhorar a detecção no centro da tela
                    const raioDeteccao = (dif.raio || 35) * 1.5;

                    // Se o desenho foi próximo o suficiente da diferença
                    if (distancia < raioDeteccao) {
                        // Marcar como encontrada
                        dif.encontrada = true;
                        diferencasEncontradas++;

                        // Atualizar contador
                        document.getElementById('diferencasEncontradas').textContent = diferencasEncontradas;

                        // Somar pontos
                        pontuacao = somaPontos();
                        document.getElementById('pontuacao').textContent = pontuacao;

                        // Destacar a diferença
                        destacarDiferenca(dif.x, dif.y, raioDeteccao);

                        // Verificar se todas as diferenças foram encontradas
                        if (diferencasEncontradas === 7) {
                            // Mostrar mensagem de vitória
                            document.getElementById('pontuacaoFinal').textContent = pontuacao;
                            document.getElementById('mensagemVitoria').style.display = 'flex';

                            // Salvar pontuação
                            salvarPontuacao();
                        }

                        break;
                    }
                }
            }
        } else {
            // No modo criar, usar as configurações normais
            ctx.strokeStyle = modoBorracha ? '#FFFFFF' : corPincel.value;
            ctx.lineWidth = tamanhoPincel.value;
        }

        ctx.lineCap = 'round';
        ctx.moveTo(ultimoX, ultimoY);
        ctx.lineTo(x, y);
        ctx.stroke();

        [ultimoX, ultimoY] = [x, y];
    };

    canvas.pararDesenho = function() {
        desenhando = false;
    };

    // Adicionar os novos event listeners
    canvas.addEventListener('mousedown', canvas.iniciarDesenho);
    canvas.addEventListener('mousemove', canvas.desenhar);
    canvas.addEventListener('mouseup', canvas.pararDesenho);
    canvas.addEventListener('mouseout', canvas.pararDesenho);
    canvas.addEventListener('touchstart', canvas.iniciarDesenhoTouch);
    canvas.addEventListener('touchmove', canvas.desenharTouch);
    canvas.addEventListener('touchend', canvas.pararDesenho);
}

// Mudar entre os modos criar e jogar
function mudarModo(modo) {
    modoAtual = modo;

    if (modo === 'criar') {
        document.getElementById('modoCriar').style.display = 'flex';
        document.getElementById('modoJogar').style.display = 'none';
        document.getElementById('btnCriar').classList.add('btn-primary');
        document.getElementById('btnCriar').classList.remove('btn-outline-primary');
        document.getElementById('btnJogar').classList.add('btn-outline-success');
        document.getElementById('btnJogar').classList.remove('btn-success');
    } else {
        document.getElementById('modoCriar').style.display = 'none';
        document.getElementById('modoJogar').style.display = 'flex';
        document.getElementById('btnCriar').classList.add('btn-outline-primary');
        document.getElementById('btnCriar').classList.remove('btn-primary');
        document.getElementById('btnJogar').classList.add('btn-success');
        document.getElementById('btnJogar').classList.remove('btn-outline-success');

        // Esconder a barra de ferramentas no modo jogar
        document.querySelector('#modoJogar .ferramentas').style.display = 'none';

        carregarJogo();
    }
}

// Mostrar modal de confirmação para limpar o canvas
function limparCanvas() {
    if (modoAtual === 'criar') {
        // Mostrar o modal de confirmação
        document.getElementById('modalConfirmacaoLimpar').style.display = 'flex';
    }
}

// Função para confirmar a limpeza do canvas
function confirmarLimparCanvas() {
    // Limpar o canvas
    ctxOriginal.clearRect(0, 0, canvasOriginal.width, canvasOriginal.height);

    // Esconder o modal
    document.getElementById('modalConfirmacaoLimpar').style.display = 'none';
}

// Função para cancelar a limpeza do canvas
function cancelarLimparCanvas() {
    // Apenas esconder o modal
    document.getElementById('modalConfirmacaoLimpar').style.display = 'none';
}

// Alternar entre modo pincel e borracha
function toggleBorracha() {
    modoBorracha = !modoBorracha;
    const btnBorracha = document.getElementById('btnBorracha');

    if (modoBorracha) {
        // Mantém a classe btn-light para evitar o fundo cinza
        // Remove a borda quando o ícone do pincel é mostrado
        btnBorracha.style.border = 'none';
        // Ícone de pincel
        btnBorracha.innerHTML = `
            <img src="../assets/pincel-lapis.png" alt="Pincel" width="40" height="40">
        `;
    } else {
        // Restaura a borda padrão quando o ícone da borracha é mostrado
        btnBorracha.style.border = '';
        // Ícone de borracha
        btnBorracha.innerHTML = `
            <img src="../assets/borracha.png" alt="Borracha" width="40" height="40">
        `;
    }
}

// Alternar modo rabisco no jogo
function toggleRabisco() {
    modoRabisco = !modoRabisco;
    const btnRabisco = document.getElementById('btnRabisco');

    if (modoRabisco) {
        // Ativar modo rabisco
        btnRabisco.style.border = '2px solid #FF0000';
        // Remover temporariamente o evento de clique para verificação de diferenças
        canvasJogoModificado.removeEventListener('click', verificarDiferenca);

        // Configurar eventos de desenho para o canvas do jogo modificado
        configurarEventosDesenho(canvasJogoModificado, ctxJogoModificado);

        // Desenhar contornos ao redor das áreas de diferenças
        desenharContornosDiferencas();

        // Mudar cursor para indicar modo de desenho
        canvasJogoModificado.style.cursor = 'crosshair';
    } else {
        // Desativar modo rabisco
        btnRabisco.style.border = '';

        // Limpar rabiscos e restaurar a imagem original
        limparRabiscos();

        // Restaurar cursor padrão
        canvasJogoModificado.style.cursor = 'default';

        // Reconfigurar evento de clique para verificar diferenças
        canvasJogoModificado.addEventListener('click', verificarDiferenca);
    }
}

// Desenhar contornos ao redor das áreas de diferenças
function desenharContornosDiferencas() {
    // Primeiro limpar o canvas e redesenhar a imagem original
    const imgModificado = new Image();
    imgModificado.onload = function() {
        ctxJogoModificado.clearRect(0, 0, canvasJogoModificado.width, canvasJogoModificado.height);
        ctxJogoModificado.drawImage(imgModificado, 0, 0, canvasJogoModificado.width, canvasJogoModificado.height);

        // Redesenhar todas as diferenças encontradas
        for (const dif of diferencas) {
            if (dif.encontrada) {
                desenharCheckMark(ctxJogoModificado, dif.x, dif.y);
            }
        }

        // Desenhar contornos ao redor de todas as diferenças (não apenas as encontradas)
        const corRabisco = document.getElementById('corRabisco').value;
        const tamanhoRabisco = document.getElementById('tamanhoRabisco').value;

        for (const dif of diferencas) {
            // Usar o raio da diferença ou um valor padrão
            const raio = dif.raio || 35;

            // Desenhar um círculo ao redor da área da diferença
            ctxJogoModificado.beginPath();
            ctxJogoModificado.arc(dif.x, dif.y, raio, 0, Math.PI * 2);
            ctxJogoModificado.strokeStyle = corRabisco;
            ctxJogoModificado.lineWidth = tamanhoRabisco;
            ctxJogoModificado.stroke();
        }
    };
    imgModificado.src = desenhoModificado;
}

// Limpar rabiscos do canvas do jogo
function limparRabiscos() {
    // Recarregar a imagem original sem os rabiscos
    const imgModificado = new Image();
    imgModificado.onload = function() {
        ctxJogoModificado.clearRect(0, 0, canvasJogoModificado.width, canvasJogoModificado.height);
        ctxJogoModificado.drawImage(imgModificado, 0, 0, canvasJogoModificado.width, canvasJogoModificado.height);

        // Redesenhar todas as diferenças encontradas
        for (const dif of diferencas) {
            if (dif.encontrada) {
                desenharCheckMark(ctxJogoModificado, dif.x, dif.y);

                // Desenhar um círculo sutil para mostrar a área da diferença encontrada
                ctxJogoModificado.beginPath();
                // Usar o mesmo raio aumentado para manter a consistência visual
                ctxJogoModificado.arc(dif.x, dif.y, (dif.raio || 35) * 1.5, 0, Math.PI * 2);
                ctxJogoModificado.strokeStyle = 'rgba(39, 174, 96, 0.3)'; // Verde mais transparente
                ctxJogoModificado.lineWidth = 2;
                ctxJogoModificado.stroke();
            }
        }
    };
    imgModificado.src = desenhoModificado;
}

// Salvar o desenho original e preparar para modificação
function salvarDesenhoOriginal() {
    desenhoOriginal = canvasOriginal.toDataURL();

    // Mostrar a segunda etapa
    document.getElementById('modificarDesenho').style.display = 'block';

    // Copiar o desenho original para o canvas modificado
    const img = new Image();
    img.onload = function() {
        ctxModificado.clearRect(0, 0, canvasModificado.width, canvasModificado.height);
        ctxModificado.drawImage(img, 0, 0);

        // Configurar eventos de desenho para o canvas modificado
        configurarEventosDesenho(canvasModificado, ctxModificado);
    };
    img.src = desenhoOriginal;
}

// Salvar o jogo completo (desenho original e modificado)
function salvarJogo() {
    desenhoModificado = canvasModificado.toDataURL();

    // Salvar os desenhos no localStorage
    localStorage.setItem('desenhoOriginal', desenhoOriginal);
    localStorage.setItem('desenhoModificado', desenhoModificado);

    // Calcular e salvar as diferenças
    const diferencasValidas = calcularDiferencas();

    // Só prosseguir se houver diferenças suficientes
    if (diferencasValidas) {
        alert('Jogo salvo com sucesso! Agora outros podem jogar.');

        // Mudar para o modo jogar
        mudarModo('jogar');
    }
    // Se não houver diferenças suficientes, o alerta já foi mostrado em calcularDiferencas()
}

// Calcular as diferenças entre os desenhos
function calcularDiferencas() {
    // Obter dados dos pixels
    const imgDataOriginal = ctxOriginal.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
    const imgDataModificado = ctxModificado.getImageData(0, 0, canvasModificado.width, canvasModificado.height);

    const dataOriginal = imgDataOriginal.data;
    const dataModificado = imgDataModificado.data;

    // Array para armazenar todas as diferenças encontradas
    const todasDiferencas = [];

    // Array final de diferenças (limitado a 7)
    diferencas = [];

    // Comparar pixels e encontrar diferenças - intervalo reduzido para melhor detecção
    for (let y = 0; y < canvasOriginal.height; y += 1) {  // Verificar cada pixel para maior precisão
        for (let x = 0; x < canvasOriginal.width; x += 1) {  // Verificar cada pixel para maior precisão
            const idx = (y * canvasOriginal.width + x) * 4;

            // Verificar se há diferença significativa - limiar reduzido para detectar mais diferenças
            if (
                Math.abs(dataOriginal[idx] - dataModificado[idx]) > 10 || // R
                Math.abs(dataOriginal[idx + 1] - dataModificado[idx + 1]) > 10 || // G
                Math.abs(dataOriginal[idx + 2] - dataModificado[idx + 2]) > 10 // B
            ) {
                // Verificar se já existe uma diferença próxima em todasDiferencas
                let existeDiferencaProxima = false;
                for (const dif of todasDiferencas) {
                    const distancia = Math.sqrt(Math.pow(x - dif.x, 2) + Math.pow(y - dif.y, 2));
                    if (distancia < 20) {  // Reduzido para agrupar diferenças mais próximas
                        existeDiferencaProxima = true;
                        break;
                    }
                }

                if (!existeDiferencaProxima) {
                    todasDiferencas.push({ x, y, encontrada: false, pixels: 1 });
                }
            }
        }
    }

    // Agrupar diferenças próximas para formar regiões
    const regioes = [];
    for (const dif of todasDiferencas) {
        let adicionadoARegiao = false;

        for (const regiao of regioes) {
            // Verificar se a diferença está próxima de alguma região existente
            for (const ponto of regiao.pontos) {
                const distancia = Math.sqrt(Math.pow(dif.x - ponto.x, 2) + Math.pow(dif.y - ponto.y, 2));
                if (distancia < 30) {  // Distância para considerar parte da mesma região
                    regiao.pontos.push(dif);
                    regiao.tamanho++;
                    adicionadoARegiao = true;
                    break;
                }
            }

            if (adicionadoARegiao) break;
        }

        // Se não foi adicionado a nenhuma região existente, criar uma nova
        if (!adicionadoARegiao) {
            regioes.push({
                pontos: [dif],
                tamanho: 1
            });
        }
    }

    // Ordenar regiões por tamanho (número de pixels diferentes)
    regioes.sort((a, b) => b.tamanho - a.tamanho);

    // Selecionar as 7 maiores regiões como diferenças principais
    const regioesImportantes = regioes.slice(0, 7);

    // Para cada região importante, escolher um ponto central como representante
    for (const regiao of regioesImportantes) {
        // Calcular o centro da região
        let somaX = 0;
        let somaY = 0;

        for (const ponto of regiao.pontos) {
            somaX += ponto.x;
            somaY += ponto.y;
        }

        const centroX = Math.round(somaX / regiao.pontos.length);
        const centroY = Math.round(somaY / regiao.pontos.length);

        // Adicionar o ponto central à lista de diferenças
        diferencas.push({ 
            x: centroX, 
            y: centroY, 
            encontrada: false,
            raio: Math.min(50, Math.max(20, Math.sqrt(regiao.tamanho))) // Raio baseado no tamanho da região
        });
    }

    // Se não encontrou 7 diferenças, alertar o usuário
    if (diferencas.length < 7) {
        alert(`Foram encontradas apenas ${diferencas.length} diferenças. Por favor, adicione pelo menos 7 diferenças visíveis ao desenho.`);
        return false; // Indica que não há diferenças suficientes
    }

    // Salvar as diferenças no localStorage
    localStorage.setItem('diferencas', JSON.stringify(diferencas));
    return true; // Indica sucesso
}

// Carregar um jogo salvo
function carregarJogo() {
    // Resetar contadores
    diferencasEncontradas = 0;
    pontuacao = 0;
    document.getElementById('diferencasEncontradas').textContent = diferencasEncontradas;
    document.getElementById('pontuacao').textContent = pontuacao;

    // Desativar modo rabisco se estiver ativo
    if (modoRabisco) {
        toggleRabisco();
    }

    // Carregar desenhos do localStorage
    desenhoOriginal = localStorage.getItem('desenhoOriginal');
    desenhoModificado = localStorage.getItem('desenhoModificado');

    // Carregar diferenças
    const diferencasSalvas = localStorage.getItem('diferencas');
    if (diferencasSalvas) {
        diferencas = JSON.parse(diferencasSalvas);
        // Resetar status de encontradas
        diferencas.forEach(dif => {
            dif.encontrada = false;
            // Garantir que cada diferença tenha um raio definido
            if (!dif.raio) {
                dif.raio = 35; // Valor padrão se não tiver raio
            }
        });
    }

    // Exibir os desenhos nos canvas de jogo
    if (desenhoOriginal && desenhoModificado) {
        const imgOriginal = new Image();
        imgOriginal.onload = function() {
            ctxJogoOriginal.clearRect(0, 0, canvasJogoOriginal.width, canvasJogoOriginal.height);
            ctxJogoOriginal.drawImage(imgOriginal, 0, 0, canvasJogoOriginal.width, canvasJogoOriginal.height);
        };
        imgOriginal.src = desenhoOriginal;

        const imgModificado = new Image();
        imgModificado.onload = function() {
            ctxJogoModificado.clearRect(0, 0, canvasJogoModificado.width, canvasJogoModificado.height);
            ctxJogoModificado.drawImage(imgModificado, 0, 0, canvasJogoModificado.width, canvasJogoModificado.height);
        };
        imgModificado.src = desenhoModificado;
    } else {
        alert('Nenhum jogo salvo encontrado. Crie um jogo primeiro!');
        mudarModo('criar');
    }
}

// Verificar se o clique foi em uma diferença
function verificarDiferenca(e) {
    // Se estiver no modo rabisco, não verificar diferenças
    if (modoRabisco) return;

    const x = e.offsetX;
    const y = e.offsetY;

    // Verificar cada diferença
    for (let i = 0; i < diferencas.length; i++) {
        const dif = diferencas[i];

        // Se a diferença já foi encontrada, pular
        if (dif.encontrada) continue;

        // Calcular a distância entre o clique e a diferença
        const distancia = Math.sqrt(Math.pow(x - dif.x, 2) + Math.pow(y - dif.y, 2));

        // Usar o raio da diferença se disponível, ou um valor padrão
        // Aumentar o raio de detecção para melhorar a detecção no centro da tela
        const raioDeteccao = (dif.raio || 35) * 1.5;

        // Se o clique foi próximo o suficiente da diferença
        if (distancia < raioDeteccao) {
            // Marcar como encontrada
            dif.encontrada = true;
            diferencasEncontradas++;

            // Atualizar contador
            document.getElementById('diferencasEncontradas').textContent = diferencasEncontradas;

            // Somar pontos
            pontuacao = somaPontos();
            document.getElementById('pontuacao').textContent = pontuacao;

            // Destacar a diferença
            destacarDiferenca(dif.x, dif.y, raioDeteccao);

            // Verificar se todas as diferenças foram encontradas
            if (diferencasEncontradas === 7) {
                // Mostrar mensagem de vitória
                document.getElementById('pontuacaoFinal').textContent = pontuacao;
                document.getElementById('mensagemVitoria').style.display = 'flex';

                // Salvar pontuação
                salvarPontuacao();
            }

            return;
        }
    }

    // Se chegou aqui, o clique não acertou nenhuma diferença
    indicarErro(x, y);
}

// Destacar uma diferença encontrada
function destacarDiferenca(x, y, raio) {
    // Desenhar um círculo temporário para destacar a diferença encontrada
    ctxJogoModificado.beginPath();
    // Usar o mesmo raio aumentado para manter a consistência visual
    ctxJogoModificado.arc(x, y, raio || (35 * 1.5), 0, Math.PI * 2);
    ctxJogoModificado.strokeStyle = 'rgba(39, 174, 96, 0.5)'; // Verde semi-transparente
    ctxJogoModificado.lineWidth = 3;
    ctxJogoModificado.stroke();

    // Efeito de fade out
    setTimeout(() => {
        const imgModificado = new Image();
        imgModificado.onload = function() {
            ctxJogoModificado.clearRect(0, 0, canvasJogoModificado.width, canvasJogoModificado.height);
            ctxJogoModificado.drawImage(imgModificado, 0, 0, canvasJogoModificado.width, canvasJogoModificado.height);

            // Redesenhar todas as diferenças encontradas
            for (const dif of diferencas) {
                if (dif.encontrada) {
                    // Desenhar um check mark verde para cada diferença encontrada
                    desenharCheckMark(ctxJogoModificado, dif.x, dif.y);

                    // Desenhar um círculo sutil para mostrar a área da diferença
                    ctxJogoModificado.beginPath();
                    // Usar o mesmo raio aumentado para manter a consistência visual
                    ctxJogoModificado.arc(dif.x, dif.y, (dif.raio || 35) * 1.5, 0, Math.PI * 2);
                    ctxJogoModificado.strokeStyle = 'rgba(39, 174, 96, 0.3)'; // Verde mais transparente
                    ctxJogoModificado.lineWidth = 2;
                    ctxJogoModificado.stroke();
                }
            }
        };
        imgModificado.src = desenhoModificado;
    }, 500);
}

// Função para desenhar um check mark
function desenharCheckMark(ctx, x, y) {
    const size = 15; // Tamanho do check mark

    ctx.save();
    ctx.translate(x, y);

    // Desenhar o check mark
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(-size/3, size/1.5);
    ctx.lineTo(size, -size);

    ctx.strokeStyle = '#27ae60'; // Verde
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.restore();
}

// Indicar um erro (clique em local sem diferença)
function indicarErro(x, y) {
    // Não mostrar indicação visual de erro, apenas redesenhar o canvas
    // para manter as diferenças já encontradas visíveis

    // Efeito de fade out - mantido para redesenhar as diferenças encontradas
    setTimeout(() => {
        const imgModificado = new Image();
        imgModificado.onload = function() {
            ctxJogoModificado.clearRect(0, 0, canvasJogoModificado.width, canvasJogoModificado.height);
            ctxJogoModificado.drawImage(imgModificado, 0, 0, canvasJogoModificado.width, canvasJogoModificado.height);

            // Redesenhar todas as diferenças encontradas
            for (const dif of diferencas) {
                if (dif.encontrada) {
                    // Desenhar um check mark verde para cada diferença encontrada
                    desenharCheckMark(ctxJogoModificado, dif.x, dif.y);

                    // Desenhar um círculo sutil para mostrar a área da diferença
                    ctxJogoModificado.beginPath();
                    ctxJogoModificado.arc(dif.x, dif.y, dif.raio || 35, 0, Math.PI * 2);
                    ctxJogoModificado.strokeStyle = 'rgba(39, 174, 96, 0.3)'; // Verde mais transparente
                    ctxJogoModificado.lineWidth = 2;
                    ctxJogoModificado.stroke();
                }
            }
        };
        imgModificado.src = desenhoModificado;
    }, 500);
}

// Somar pontos
function somaPontos() {
    return pontos += 10;
}

// Salvar pontuação no localStorage e no banco de dados
function salvarPontuacao() {
    let jogos = JSON.parse(localStorage.getItem('nome_jogo')) || [];

    // Verificar se o jogo já existe na lista
    let jogoExiste = false;
    for (let i = 0; i < jogos.length; i++) {
        if (jogos[i].nomejogo.includes('7 erros')) {
            jogos[i].pontos = pontuacao;
            jogoExiste = true;
            break;
        }
    }

    // Se o jogo não existir, adicionar à lista
    if (!jogoExiste) {
        jogos.push({
            nomejogo: 'Jogo dos 7 erros',
            pontos: pontuacao
        });
    }

    // Salvar a lista atualizada
    localStorage.setItem('nome_jogo', JSON.stringify(jogos));

    // Registrar pontuação no banco de dados (ID 3 = Jogo dos 7 Erros)
    if (typeof registrarPontuacao === 'function') {
        registrarPontuacao(3, pontuacao);
    }
}
