-- Create tables for Pimpolho Kids application

-- Table for students
CREATE TABLE IF NOT EXISTS tbAluno (
    idAluno SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    idTurma INTEGER
);

-- Table for teachers
CREATE TABLE IF NOT EXISTS tbProfessor (
    idProfessor SERIAL PRIMARY KEY,
    nomeProf VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    idTurma INTEGER
);

-- Table for games
CREATE TABLE IF NOT EXISTS tbJogo (
    idJogo SERIAL PRIMARY KEY,
    nomeJogo VARCHAR(100) NOT NULL
);

-- Table for student-game relationship (scores)
CREATE TABLE IF NOT EXISTS tbAlunoJogo (
    idAlunoJogo SERIAL PRIMARY KEY,
    idAluno INTEGER REFERENCES tbAluno(idAluno),
    idJogo INTEGER REFERENCES tbJogo(idJogo),
    pontos INTEGER DEFAULT 0
);

-- Insert default games
INSERT INTO tbJogo (nomeJogo) VALUES 
    ('Jogo da Forca'),
    ('Jogo da Memória'),
    ('Jogo dos 7 Erros'),
    ('Jogo Complete Palavras');