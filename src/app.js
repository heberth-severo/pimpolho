//Acessa ao banco de dados

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const pg = require('pg');
require('dotenv').config()

// Criptografia
const bcrypt = require('bcrypt');
let hashpassword 

// Pontuação dos jogos
// import {pontosJogoForca} from '/src/jogodaforca/jogoForca';


const app = express();
app.use(cors());
app.use(bodyParser.json());//receber parâmetros no formato json
// app.set('view engine', 'ejs');
// Static
// app.static('/static', express.use('public'))

const staticPath = path.join(__dirname, "../public")

app.use(express.static(staticPath))


// classe client definida dentro do pg

// const client = new pg.Client(
//     {
//         user: process.env.DATABASE_USERNAME,
//         host: process.env.HOST,
//         database: process.env.DATABASE,
//         password: process.env.PASSWORD,
//         port: process.env.DATABASE_PORT
//     }
// );

// Configure database connection options based on environment
const getClientConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    };
  } else if (process.env.NODE_ENV === 'development') {
    return {
      connectionString: process.env.DATABASE_URL
    };
  } else {
    return {
      user: 'postgres',
      host: 'localhost',
      database: 'pimpolho',
      password: 'postgres',
      port: 5432
    };
  }
};

// Create a new client instance
let client = new pg.Client(getClientConfig());

//conectar ao bd with retry
const connectWithRetry = () => {
  console.log('Attempting to connect to the database...');
  client.connect()
    .then(() => {
      console.log('Database connection established successfully');
    })
    .catch(err => {
      console.error('Failed to connect to the database:', err);
      console.log('Retrying in 5 seconds...');

      // Create a new client instance for the retry
      client = new pg.Client(getClientConfig());

      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();


// Acessando a rota pagina principal

// app.get('/', (req,res)=>{
//     res.send('hello');
// })

// Inserindo dados
app.post('/aluno', async (req, res) =>{

    // hashpassword= await bcrypt.hashSync(req.body.senha, 10)
    client.query(
        {
            text: "INSERT INTO tbAluno(nome, email, senha, idTurma ) VALUES($1, $2, $3, $4)",
            values: [req.body.nome, req.body.email,req.body.senha , req.body.idTurma] //hashpassword
        }
    ).then(
        function (ret) {
            res.json(
                {
                    status: 'OK',
                    dadosEnviados: req.body
                }
            )
        }
    ).catch(error => {
        console.error('Error registering student:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Failed to register student'
        });
    });

});

// Inserindo dados
app.post('/professor', function (req, res) {
    client.query(
        {
            text: "INSERT INTO tbProfessor(nomeprof, email, senha, idTurma ) VALUES($1, $2, $3, $4)",
            values: [req.body.nomeprof, req.body.email, req.body.senha, req.body.idTurma]
        }
    ).then(
        function (ret) {
            res.json(
                {
                    status: 'OK',
                    dadosEnviados: req.body
                }
            )
        }
    ).catch(error => {
        console.error('Error registering professor:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Failed to register professor'
        });
    });

});

/*------------------------------------------------------------------------------------------------------- */
//Consultando dados
app.get(
    '/aluno/:email/:senha',
    async (req, res) => { 

        client.query(
            {
                text: ' select al.senha, al.email, al.nome, al.idAluno, jo.nomejogo, aj.pontos	from tbAluno al left join tbAlunoJogo aj on al.idAluno = aj.idAluno left join tbJogo jo on aj.idJogo = jo.idJogo WHERE al.email= $1 and al.senha= $2 ',
                values: [req.params.email, req.params.senha]
            }

        ).then(
            function (ret) {
                let tbAluno = ret.rows[0]
                res.json(
                    {
                        status: 'OK',
                        email: tbAluno.email,
                        senha: tbAluno.senha,
                        nome: tbAluno.nome,
                        idAluno: tbAluno.idaluno,
                        nomejogo: ret.rows,
                        pontosjogo: tbAluno.pontos
                    }
                );


            }

        ).catch((error) => {
            console.error(error);
            res.status(404).json({
               status:'Erro'
            })
        });

    }
);



//Consultando dados
app.get(
    '/professor/:email/:senha',
    function (req, res) {
        client.query(
            {
                text: ' SELECT email,senha, nomeprof, idTurma, idProfessor FROM tbProfessor WHERE email= $1 and senha= $2',
                values: [req.params.email, req.params.senha]
            }

        ).then(
            function (ret) {
                let tbAluno = ret.rows[0]
                res.json(
                    {
                        status: 'OK',
                        email: tbAluno.email,
                        senha: tbAluno.senha,
                        nomeprof: tbAluno.nomeprof,
                        idTurma: tbAluno.idturma,
                        idProfessor: tbAluno.idprofessor
                    }
                );
            }
        ).catch((error) => {
            console.error(error);
            res.status(404).json({
               status:'Erro'
            })
        });
    }
);




app.post('/aluno/atualizar', function (req, res) {
    client.query(
        {
            text: "UPDATE tbAluno SET senha = $1 WHERE idaluno= $2 and email= $3",
            values: [req.body.senha, req.body.idaluno, req.body.email]
        }
    ).then(
        function (ret) {
            res.json(
                {
                    status: 'OK',
                    dadosEnviados: req.body
                }
            )
        }
    ).catch(error => {
        console.error('Error updating student:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Failed to update student'
        });
    });

});




app.post('/professor/atualizar', function (req, res) {
    client.query(
        {
            text: "UPDATE tbProfessor SET senha = $1 WHERE idprofessor= $2 and email= $3",
            values: [req.body.senha, req.body.idprofessor, req.body.email]
        }
    ).then(
        function (ret) {
            res.json(
                {
                    status: 'OK',
                    dadosEnviados: req.body
                }
            )
        }
    ).catch(error => {
        console.error('Error updating professor:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Failed to update professor'
        });
    });

});


//Consultando por jogo (pelo nome - deprecated)
app.get(
    '/aluno/:jogo',
    function (req, res) {
        client.query(
            {
                text: 'select * from tbAluno al inner join tbAlunoJogo aj on al.idAluno = aj.idAluno inner join tbJogo jo on aj.idJogo = jo.idJogo where jo.nomeJogo ILIKE $1',
                values: [`%${req.params.jogo}%`]
            }
        ).then(
            function (ret) {
                let dado = []
                for (dados of ret.rows) {
                    dado.push({
                        nomealuno: dados.nome,
                        idaluno: dados.idaluno,
                        nomejogo: dados.nomejogo,
                        pontos: dados.pontos
                    })
                }
                res.json(
                    {
                        status: 'OK',
                        resultados: dado
                    }
                );
            }
        ).catch(error => {
            console.error('Error querying game data:', error);
            res.status(500).json({
                status: 'Error',
                message: 'Failed to retrieve game data'
            });
        });
    }
);

//Consultando por jogo (pelo ID)
app.get(
    '/aluno/jogo/:idJogo',
    function (req, res) {
        client.query(
            {
                text: 'select * from tbAluno al inner join tbAlunoJogo aj on al.idAluno = aj.idAluno inner join tbJogo jo on aj.idJogo = jo.idJogo where jo.idJogo = $1',
                values: [req.params.idJogo]
            }
        ).then(
            function (ret) {
                let dado = []
                for (dados of ret.rows) {
                    dado.push({
                        nomealuno: dados.nome,
                        idaluno: dados.idaluno,
                        nomejogo: dados.nomejogo,
                        pontos: dados.pontos
                    })
                }
                res.json(
                    {
                        status: 'OK',
                        resultados: dado
                    }
                );
            }
        ).catch(error => {
            console.error('Error querying game data by ID:', error);
            res.status(500).json({
                status: 'Error',
                message: 'Failed to retrieve game data by ID'
            });
        });
    }
);

//Consultando por jogo e turma (para professores - pelo nome - deprecated)
app.get(
    '/aluno/:jogo/:idTurma',
    function (req, res) {
        client.query(
            {
                text: 'select * from tbAluno al inner join tbAlunoJogo aj on al.idAluno = aj.idAluno inner join tbJogo jo on aj.idJogo = jo.idJogo where jo.nomeJogo ILIKE $1 and al.idTurma = $2',
                values: [`%${req.params.jogo}%`, req.params.idTurma]
            }
        ).then(
            function (ret) {
                let dado = []
                for (dados of ret.rows) {
                    dado.push({
                        nomealuno: dados.nome,
                        idaluno: dados.idaluno,
                        nomejogo: dados.nomejogo,
                        pontos: dados.pontos
                    })
                }
                res.json(
                    {
                        status: 'OK',
                        resultados: dado
                    }
                );
            }
        ).catch(error => {
            console.error('Error querying game data by class:', error);
            res.status(500).json({
                status: 'Error',
                message: 'Failed to retrieve game data by class'
            });
        });
    }
);

//Consultando por jogo e turma (para professores - pelo ID)
app.get(
    '/aluno/jogo/:idJogo/turma/:idTurma',
    function (req, res) {
        client.query(
            {
                text: 'select * from tbAluno al left join tbAlunoJogo aj on al.idAluno = aj.idAluno left join tbJogo jo on aj.idJogo = jo.idJogo where (jo.idJogo = $1 or aj.idJogo is null) and al.idTurma = $2',
                values: [req.params.idJogo, req.params.idTurma]
            }
        ).then(
            function (ret) {
                let dado = []
                for (dados of ret.rows) {
                    dado.push({
                        nomealuno: dados.nome,
                        idaluno: dados.idaluno,
                        nomejogo: dados.nomejogo || 'Não jogou ainda',
                        pontos: dados.pontos || 0
                    })
                }
                res.json(
                    {
                        status: 'OK',
                        resultados: dado
                    }
                );
            }
        ).catch(error => {
            console.error('Error querying game data by ID and class:', error);
            res.status(500).json({
                status: 'Error',
                message: 'Failed to retrieve game data by ID and class'
            });
        });
    }
);



/*------------------------------------------------------------------------------------------------------- */

// Endpoint para registrar pontuação de jogos
app.post('/registrar-pontuacao', function (req, res) {
    const idAluno = req.body.idAluno;
    const idJogo = req.body.idJogo;
    const pontos = req.body.pontos;

    // Verificar se já existe um registro para este aluno e jogo
    client.query(
        {
            text: "SELECT * FROM tbAlunoJogo WHERE idAluno = $1 AND idJogo = $2",
            values: [idAluno, idJogo]
        }
    ).then(
        function (ret) {
            if (ret.rows.length > 0) {
                // Se já existe um registro, atualizar os pontos
                client.query(
                    {
                        text: "UPDATE tbAlunoJogo SET pontos = $1 WHERE idAluno = $2 AND idJogo = $3",
                        values: [pontos, idAluno, idJogo]
                    }
                ).then(
                    function (updateRet) {
                        res.json(
                            {
                                status: 'OK',
                                message: 'Pontuação atualizada com sucesso'
                            }
                        );
                    }
                ).catch(error => {
                    console.error('Error updating score:', error);
                    res.status(500).json({
                        status: 'Error',
                        message: 'Failed to update score'
                    });
                });
            } else {
                // Se não existe um registro, inserir um novo
                client.query(
                    {
                        text: "INSERT INTO tbAlunoJogo(idAluno, idJogo, pontos) VALUES($1, $2, $3)",
                        values: [idAluno, idJogo, pontos]
                    }
                ).then(
                    function (insertRet) {
                        res.json(
                            {
                                status: 'OK',
                                message: 'Pontuação registrada com sucesso'
                            }
                        );
                    }
                ).catch(error => {
                    console.error('Error inserting score:', error);
                    res.status(500).json({
                        status: 'Error',
                        message: 'Failed to insert score'
                    });
                });
            }
        }
    ).catch(error => {
        console.error('Error checking existing score:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Failed to check existing score'
        });
    });
});

/*------------------------------------------------------------------------------------------------------- */

//Conectar o sevidor web
app.listen(
    process.env.PORT || 3000,
    function () {
        console.log('Servidor web funcionando');
    }
);
