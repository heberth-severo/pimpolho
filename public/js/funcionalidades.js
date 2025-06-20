

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
//Função selecionar jogo
function consultarJogo() {
    let jogo = $('#nomeJogo').val();

    $.ajax(
        {
            type: 'GET',
            url: `${window.location.origin}/aluno/${jogo}`,
            success: function (resposta) {

                for (let i = 0; i < resposta.resultados.length; i++) {
                    $('#tbnome').append(`${resposta.resultados[i].nomealuno}<br>`);
                    $('#tbid').append(`${resposta.resultados[i].idaluno}<br>`);
                    $('#tbnomejogo').append(` ${resposta.resultados[i].nomejogo}<br>`);
                    $('#tbpontos').append(` ${resposta.resultados[i].pontos}<br>`);
                }
            },
            error: function (resposta) {
                alert(`Não tem esse jogo!`);
            }
        }
    );
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
