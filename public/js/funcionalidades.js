

//Função recuperar modal
function recuperar() {
    let minha = $('#minha_caixa');
    let modal = new bootstrap.Modal(minha);
    modal.show();
}


//Função recuperar modal
function recuperarProfessor() {
    let minha = $('#minha_caixa');
    let modal = new bootstrap.Modal(minha);
    modal.show();
}


/*------------------------------------------------------------------------------------------------------- */
/** 
 * Função que verifica se o campo está vazio
 * @param {*} valor 
 * @returns boolean 
 */
function isEmpty(valor) {
    if (valor && valor != '' && valor != null && valor != undefined) {
        return false;
    }
    return true;
}
//Função Cadastrar Estudante 
function enviarEstudante() {
    let nome = $('#nome').val();
    let email = $('#email').val();
    let senha = $('#senha').val();
    let anoturma = $('#anoturma').val();
    validarCampos(email, nome, senha, anoturma, true);
}


/**
 * Função que envia os dados para ser salvos no banco
 * @param {string} nome 
 * @param {string} email 
 * @param {string} senha 
 * @param {string} anoturma 
 */
function postEstudante(nome, email, senha, anoturma) {
    $.ajax(
        {
            type: 'POST',
            url: `${window.location.origin}/aluno`,
            data: JSON.stringify({
                "nome": nome,
                "email": email,
                "senha": senha,
                "idTurma": anoturma
            }),
            contentType: 'application/json',
            success: function (resposta) {
                window.location.href = "pag_login_estudante.html";
            }
        }
    );
}
/**
 * Função que valida os dados do cadastro do uusuário
 * @param {string} email 
 * @param {string} nome 
 * @param {string} senha 
 * @param {string} anoturma 
 * @param {boolean} ehEstudante 
 */
function validarCampos(email, nome, senha, anoturma, ehEstudante) {
    let msgErro =  document.querySelector('#msgAlertaErroCad')
    const emailReg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    const passwordRegx = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
    // Verificando os campos
    if (isEmpty(nome)) {
        msgErro.innerHTML= "Erro: Necessário preencher o campo nome!";
    } else if (isEmpty(email)) {
        msgErro.innerHTML= "Erro: Necessário preencher o campo email!";
    } else if (isEmpty(senha)) {
        msgErro.innerHTML= "Erro: Necessário preencher o campo senha!";
    } else if (isEmpty(anoturma)) {
        msgErro.innerHTML= "Erro: Necessário preencher o campo turma!";
    } else {
        // Verificando se o email é válido
        if (!emailReg.test(email)) {
            msgErro.innerHTML= "Erro: Formato inválido de email! Insira um @ email";
        } else if (!passwordRegx.test(senha)) {
            msgErro.innerHTML= "Erro: A senha deve conter entre 8 a 15 caracteres,<br> deve conter pelo menos uma letra maiúscula<br> um número ";
        } else {
            // Verifica se é estudante ou professor, para saber onde tera que salvar os dados
            if (ehEstudante == true) {
                postEstudante(nome, email, senha, anoturma);
            } else {
                postProfessor(nome, email, senha, anoturma);
            }

        }

    }
}

/*------------------------------------------------------------------------------------------------------- */

//Função Cadastrar Professor

function enviarProfessor() {
    let nome = $('#nome').val();
    let email = $('#email').val();
    let senha = $('#senha').val();
    let anoturma = $('#anoturma').val();
    validarCampos(email, nome, senha, anoturma, false);

}

/**
 * Função que envia os dados para ser salvos no banco
 * @param {string} nome 
 * @param {string} email 
 * @param {string} senha 
 * @param {string} anoturma 
 */
function postProfessor(nome, email, senha, anoturma) {
    $.ajax(
        {
            type: 'POST',
            url: `${window.location.origin}/professor`,
            data: JSON.stringify({
                "nomeprof": nome,
                "email": email,
                "senha": senha,
                "idTurma": anoturma
            }),
            contentType: 'application/json',
            success: function (resposta) {
                alert(`Usuário cadastrado!`);
            }
        }
    );
}

/*------------------------------------------------------------------------------------------------------- */

//Função Acessar - realizar consulta Estudante
function acessar() {
    let email = $('#emailestudante').val();
    let senha = $('#senhaestudante').val();

    // validação 
    if (!isEmpty(email) && !isEmpty(senha)) {
        $.ajax(
            {
                type: 'GET',
                url: `${window.location.origin}/aluno/${email}/${senha}`,
                success: function (resposta) {
                    localStorage.removeItem('nome_estudante');
                    localStorage.setItem('nome_estudante', resposta.nome);
                    localStorage.setItem('id_estudante', resposta.idAluno);
                    localStorage.setItem('nome_jogo', JSON.stringify(resposta.nomejogo));
                    localStorage.setItem('pontos_jogo', resposta.pontosjogo);

                    // Armazenar email e senha para atualizações futuras
                    localStorage.setItem('email_estudante', email);
                    localStorage.setItem('senha_estudante', senha);

                    window.location.href = "pag_acessar_estudante.html";
                },
                error: function (resposta) {
                    alert(`Usuário não está cadastrado!`);
                    // adicionar mensagem de erro email ou senha invalida
                }
            }
        );
    } else {
        alert('Email ou senha inválida! ');
    }
}
/*------------------------------------------------------------------------------------------------------- */

//Função Acessar - realizar consulta Professor

function acessarProfessor() {
    let email = $('#emailprof').val();
    let senha = $('#senhaprof').val();

    // validação 
    if (!isEmpty(email) && !isEmpty(senha)) {
        $.ajax(
            {
                type: 'GET',
                url: `${window.location.origin}/professor/${email}/${senha}`,
                success: function (resposta) {
                    localStorage.removeItem('nome_professor');
                    localStorage.setItem('nome_professor', resposta.nomeprof);
                    localStorage.setItem('id_professor', resposta.idProfessor);
                    localStorage.setItem('id_turma_professor', resposta.idTurma);

                    // Armazenar email e senha para atualizações futuras
                    localStorage.setItem('email_professor', email);
                    localStorage.setItem('senha_professor', senha);

                    window.location.href = "pag_acessar_professor.html";
                },
                error: function (resposta) {
                    alert(`Usuário não está cadastrado!`);
                }
            }
        );
    } else {
        alert('Email ou senha inválida! ');
    }

}


/*------------------------------------------------------------------------------------------------------- */
//Atualizando dados Estudante


//Funçãp Atualizar 


function atualizar_senha() {
    let senha = $('#senha_recup').val();
    let email = $('#email_recup').val();
    let codigo = $('#codigo_recup').val();


    $.ajax(
        {
            type: 'POST',
            url: `${window.location.origin}/aluno/atualizar`,
            data: JSON.stringify({

                "senha": senha,
                "email": email,
                "idaluno": codigo
            }),
            contentType: 'application/json',
            success: function (resposta) {
                alert(`Dados atualizados com sucesso!`);
                window.location.href = "pag_login_estudante.html";
            }
        }
    );
}


/*------------------------------------------------------------------------------------------------------- */
//Atualizando dados Professor

//Função Atualizar 


function atualizar_senha_professor() {
    let senha = $('#senha_recup').val();
    let email = $('#email_recup').val();
    let codigo = $('#codigo_recup').val();


    $.ajax(
        {
            type: 'POST',
            url: `${window.location.origin}/professor/atualizar`,
            data: JSON.stringify({

                "senha": senha,
                "email": email,
                "idprofessor": codigo
            }),
            contentType: 'application/json',
            success: function (resposta) {
                alert(`Dados atualizados com sucesso!`);
                window.location.href = "pag_login_professor.html";
            }
        }
    );
}


/*------------------------------------------------------------------------------------------------------- */
// Variáveis globais para paginação
let allGameData = [];
let currentPage = 1;
let itemsPerPage = 10;

//Função selecionar jogo
function consultarJogo() {
    let idJogo = $('#nomeJogo').val();
    console.log('ID do jogo selecionado:', idJogo);

    // Limpar dados anteriores da tabela
    $('table.tableRelatorio tbody').empty();

    // Verificar se é um professor logado e tem uma turma associada
    const idTurmaProfessor = localStorage.getItem('id_turma_professor');
    console.log('ID da turma do professor:', idTurmaProfessor);

    // Se nenhum jogo for selecionado, carregar todos os jogos
    if (!idJogo) {
        carregarTodosJogos();
        return;
    }

    // Se for professor com turma, usar o endpoint que filtra por turma e ID do jogo
    if (idTurmaProfessor) {
        const url = `${window.location.origin}/aluno/jogo/${idJogo}/turma/${idTurmaProfessor}`;
        console.log('URL da requisição:', url);

        $.ajax(
            {
                type: 'GET',
                url: url,
                success: function (resposta) {
                    console.log('Resposta da requisição:', resposta);

                    if (resposta.resultados.length === 0) {
                        $('table.tableRelatorio tbody').append('<tr><td colspan="3">Nenhum aluno encontrado para esta turma e jogo</td></tr>');
                    } else {
                        // Armazenar os dados para paginação
                        allGameData = resposta.resultados;
                        // Resetar para a primeira página
                        currentPage = 1;
                        // Atualizar a exibição com paginação
                        atualizarExibicaoComPaginacao();
                    }
                },
                error: function (resposta) {
                    console.error('Erro na requisição:', resposta);
                    $('table.tableRelatorio tbody').append('<tr><td colspan="3">Erro ao buscar dados do jogo para esta turma!</td></tr>');
                    alert(`Erro ao buscar dados do jogo para esta turma!`);
                }
            }
        );
    } else {
        // Se não for professor ou não tiver turma, usar o endpoint que filtra apenas por ID do jogo
        const url = `${window.location.origin}/aluno/jogo/${idJogo}`;
        console.log('URL da requisição:', url);

        $.ajax(
            {
                type: 'GET',
                url: url,
                success: function (resposta) {
                    console.log('Resposta da requisição:', resposta);

                    if (resposta.resultados.length === 0) {
                        $('table.tableRelatorio tbody').append('<tr><td colspan="3">Nenhum aluno encontrado para este jogo</td></tr>');
                    } else {
                        // Armazenar os dados para paginação
                        allGameData = resposta.resultados;
                        // Resetar para a primeira página
                        currentPage = 1;
                        // Atualizar a exibição com paginação
                        atualizarExibicaoComPaginacao();
                    }
                },
                error: function (resposta) {
                    console.error('Erro na requisição:', resposta);
                    $('table.tableRelatorio tbody').append('<tr><td colspan="3">Não tem esse jogo!</td></tr>');
                    alert(`Não tem esse jogo!`);
                }
            }
        );
    }
}

// Função para carregar todos os jogos
function carregarTodosJogos() {
    const idTurmaProfessor = localStorage.getItem('id_turma_professor');

    if (!idTurmaProfessor) {
        $('table.tableRelatorio tbody').append('<tr><td colspan="3">Você não está associado a nenhuma turma</td></tr>');
        return;
    }

    // IDs dos jogos disponíveis
    const jogosIDs = ["1", "2", "3", "4"]; // 1: Forca, 2: Memória, 3: 7 Erros, 4: Complete Palavras
    let resultadosCombinados = [];
    let jogosCarregados = 0;

    // Limpar a tabela
    $('table.tableRelatorio tbody').empty();

    // Mostrar mensagem de carregamento
    $('table.tableRelatorio tbody').append('<tr><td colspan="3">Carregando todos os jogos...</td></tr>');

    // Fazer requisições para cada jogo
    jogosIDs.forEach(idJogo => {
        const url = `${window.location.origin}/aluno/jogo/${idJogo}/turma/${idTurmaProfessor}`;

        $.ajax({
            type: 'GET',
            url: url,
            success: function(resposta) {
                if (resposta.resultados && resposta.resultados.length > 0) {
                    // Adicionar resultados ao array combinado
                    resultadosCombinados = resultadosCombinados.concat(resposta.resultados);
                }

                jogosCarregados++;

                // Quando todos os jogos forem carregados
                if (jogosCarregados === jogosIDs.length) {
                    // Limpar mensagem de carregamento
                    $('table.tableRelatorio tbody').empty();

                    if (resultadosCombinados.length === 0) {
                        $('table.tableRelatorio tbody').append('<tr><td colspan="3">Nenhum resultado encontrado para esta turma</td></tr>');
                    } else {
                        // Armazenar os dados para paginação
                        allGameData = resultadosCombinados;
                        // Resetar para a primeira página
                        currentPage = 1;
                        // Atualizar a exibição com paginação
                        atualizarExibicaoComPaginacao();
                    }
                }
            },
            error: function(erro) {
                console.error(`Erro ao carregar jogo ${idJogo}:`, erro);

                jogosCarregados++;

                // Mesmo com erro, verificar se todos os jogos foram processados
                if (jogosCarregados === jogosIDs.length) {
                    // Limpar mensagem de carregamento
                    $('table.tableRelatorio tbody').empty();

                    if (resultadosCombinados.length === 0) {
                        $('table.tableRelatorio tbody').append('<tr><td colspan="3">Nenhum resultado encontrado para esta turma</td></tr>');
                    } else {
                        // Armazenar os dados para paginação
                        allGameData = resultadosCombinados;
                        // Resetar para a primeira página
                        currentPage = 1;
                        // Atualizar a exibição com paginação
                        atualizarExibicaoComPaginacao();
                    }
                }
            }
        });
    });
}

// Função para atualizar a exibição com paginação
function atualizarExibicaoComPaginacao() {
    // Limpar a tabela
    $('table.tableRelatorio tbody').empty();

    // Calcular índices para a página atual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, allGameData.length);
    const totalPages = Math.ceil(allGameData.length / itemsPerPage);

    // Se não houver dados
    if (allGameData.length === 0) {
        $('table.tableRelatorio tbody').append('<tr><td colspan="3">Nenhum resultado encontrado</td></tr>');
        return;
    }

    // Adicionar linhas para a página atual
    for (let i = startIndex; i < endIndex; i++) {
        const row = `<tr>
            <td>${allGameData[i].nomealuno}</td>
            <td class="me-2">${allGameData[i].nomejogo}</td>
            <td class="text-center">${allGameData[i].pontos}</td>
        </tr>`;
        $('table.tableRelatorio tbody').append(row);
    }

    // Atualizar informação da página atual
    $('#currentPage').text(`Página ${currentPage} de ${totalPages}`);

    // Habilitar/desabilitar botões de navegação
    if (currentPage === 1) {
        $('#prevPageItem').addClass('disabled');
    } else {
        $('#prevPageItem').removeClass('disabled');
    }

    if (currentPage === totalPages) {
        $('#nextPageItem').addClass('disabled');
    } else {
        $('#nextPageItem').removeClass('disabled');
    }

    // Gerar os números das páginas
    atualizarNumerosPaginas(totalPages);
}

// Função para atualizar os números das páginas na paginação
function atualizarNumerosPaginas(totalPages) {
    // Remover os números de página existentes
    $('.pagination .page-number').remove();

    // Determinar quais páginas mostrar
    let pagesToShow = [];

    if (totalPages <= 5) {
        // Se houver 5 ou menos páginas, mostrar todas
        for (let i = 1; i <= totalPages; i++) {
            pagesToShow.push(i);
        }
    } else {
        // Sempre mostrar a primeira página
        pagesToShow.push(1);

        // Se a página atual estiver próxima do início
        if (currentPage <= 3) {
            pagesToShow.push(2, 3, '...', totalPages);
        } 
        // Se a página atual estiver próxima do fim
        else if (currentPage >= totalPages - 2) {
            pagesToShow.push('...', totalPages - 2, totalPages - 1, totalPages);
        } 
        // Se a página atual estiver no meio
        else {
            pagesToShow.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }

    // Adicionar os números de página à paginação
    let pageNumbersHTML = '';

    for (let i = 0; i < pagesToShow.length; i++) {
        if (pagesToShow[i] === '...') {
            pageNumbersHTML += `<li class="page-item disabled page-number">
                <span class="page-link">...</span>
            </li>`;
        } else {
            const isActive = pagesToShow[i] === currentPage ? 'active' : '';
            pageNumbersHTML += `<li class="page-item ${isActive} page-number">
                <a class="page-link page-number-link" href="#" data-page="${pagesToShow[i]}">${pagesToShow[i]}</a>
            </li>`;
        }
    }

    // Inserir os números de página entre os botões de anterior e próximo
    $(pageNumbersHTML).insertAfter('#prevPageItem');

    // Adicionar evento de clique para os links de número de página
    $('.page-number-link').on('click', function(e) {
        e.preventDefault();
        currentPage = parseInt($(this).data('page'));
        atualizarExibicaoComPaginacao();
    });
}

// Função para carregar todos os alunos da turma do professor
function carregarAlunosDaTurma() {
    // Verificar se é um professor logado e tem uma turma associada
    const idTurmaProfessor = localStorage.getItem('id_turma_professor');
    console.log('ID da turma do professor:', idTurmaProfessor);

    if (!idTurmaProfessor) {
        $('table.tableRelatorio tbody').empty();
        $('table.tableRelatorio tbody').append('<tr><td colspan="3">Você não está associado a nenhuma turma</td></tr>');
        return;
    }

    // Limpar o dropdown de seleção de jogo
    $('#nomeJogo').val('');

    // Carregar todos os jogos
    carregarTodosJogos();
}

/*------------------------------------------------------------------------------------------------------- */
// Fazer o post dos pontos dos jogos

/**
 * Função para registrar a pontuação de um jogo
 * @param {number} idJogo - ID do jogo (1: Jogo da Forca, 2: Jogo da Memória, 3: Jogo dos 7 Erros, 4: Jogo Complete Palavras)
 * @param {number} pontos - Pontuação obtida no jogo
 */
function registrarPontuacao(idJogo, pontos) {
    const idAluno = localStorage.getItem('id_estudante');

    if (!idAluno) {
        console.error('ID do aluno não encontrado. Faça login novamente.');
        return;
    }

    $.ajax({
        type: 'POST',
        url: `${window.location.origin}/registrar-pontuacao`,
        data: JSON.stringify({
            idAluno: idAluno,
            idJogo: idJogo,
            pontos: pontos
        }),
        contentType: 'application/json',
        success: function(resposta) {
            console.log('Pontuação registrada com sucesso:', resposta);

            // Após registrar a pontuação, buscar os dados atualizados do aluno
            atualizarDadosAluno();
        },
        error: function(erro) {
            console.error('Erro ao registrar pontuação:', erro);
        }
    });
}

/**
 * Função para atualizar os dados do aluno após o jogo
 */
function atualizarDadosAluno() {
    const email = localStorage.getItem('email_estudante');
    const senha = localStorage.getItem('senha_estudante');

    if (!email || !senha) {
        console.error('Dados de login não encontrados.');
        return;
    }

    $.ajax({
        type: 'GET',
        url: `${window.location.origin}/aluno/${email}/${senha}`,
        success: function(resposta) {
            // Atualizar os dados no localStorage
            localStorage.setItem('nome_estudante', resposta.nome);
            localStorage.setItem('id_estudante', resposta.idAluno);
            localStorage.setItem('nome_jogo', JSON.stringify(resposta.nomejogo));
            localStorage.setItem('pontos_jogo', resposta.pontosjogo);

            // Se estiver na página do estudante, atualizar a exibição
            if (window.location.href.includes('pag_acessar_estudante.html')) {
                atualizarExibicaoPontuacao();
            }
        },
        error: function(erro) {
            console.error('Erro ao atualizar dados do aluno:', erro);
        }
    });
}

/**
 * Função para atualizar a exibição da pontuação na página do estudante
 */
function atualizarExibicaoPontuacao() {
    $('#nameAluno').text(localStorage.getItem('nome_estudante'));
    let jogos = JSON.parse(localStorage.getItem('nome_jogo'));
    let totalPontos = 0;

    // Limpar pontuações anteriores
    $('#jogMemoria').text('');
    $('#jogForca').text('');
    $('#jog7Erros').text('');
    $('#jogCompletePalavras').text('');

    for(let jogo of jogos){
        // Somar pontos ao total
        totalPontos += parseInt(jogo.pontos || 0);

        if(jogo.nomejogo.includes('memória') || jogo.nomejogo.includes('Memória')){
            $('#jogMemoria').text(jogo.nomejogo+ ' : ' + jogo.pontos);
        }
        if(jogo.nomejogo.includes('Forca') || jogo.nomejogo.includes('forca')){
            $('#jogForca').text(jogo.nomejogo+ ' : ' + jogo.pontos);
        }
        if(jogo.nomejogo.toLowerCase().includes('7 erros')){
            $('#jog7Erros').text(jogo.nomejogo+ ' : ' + jogo.pontos);
        }
        if(jogo.nomejogo.includes('Complete Palavras')){
            $('#jogCompletePalavras').text(jogo.nomejogo+ ' : ' + jogo.pontos);
        }
    }

    // Atualizar o total de pontos
    $('.offcanvas-body ul li:last-child').remove(); // Remover o total antigo
    $('.offcanvas-body ul').append('<li class="mt-3 fw-bold">Total de Pontos: ' + totalPontos + '</li>');
}
