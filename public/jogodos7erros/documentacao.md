# Documentação do Jogo dos 7 Erros - Pimpolho Kids

## Sumário
1. [Visão Geral](#visão-geral)
2. [Arquitetura Técnica](#arquitetura-técnica)
3. [Modos de Jogo](#modos-de-jogo)
4. [Funcionalidades Principais](#funcionalidades-principais)
5. [Estrutura do Código](#estrutura-do-código)
6. [Integração com a Plataforma](#integração-com-a-plataforma)
7. [Fluxo de Interação do Usuário](#fluxo-de-interação-do-usuário)
8. [Considerações de Design Responsivo](#considerações-de-design-responsivo)
9. [Aspectos Educacionais](#aspectos-educacionais)

## Visão Geral

O Jogo dos 7 Erros é uma aplicação educacional interativa desenvolvida para a plataforma Pimpolho Kids. Este jogo estimula a criatividade, a atenção aos detalhes e a percepção visual das crianças através de duas modalidades principais: criação de desenhos com diferenças e identificação dessas diferenças.

O jogo foi projetado para ser intuitivo, divertido e educativo, permitindo que as crianças desenvolvam habilidades importantes enquanto se divertem. A interface é amigável e adaptada para o público infantil, com controles simples e feedback visual claro.

## Arquitetura Técnica

O jogo foi implementado utilizando tecnologias web padrão:

- **HTML5**: Estrutura da página e elementos de interface
- **CSS3**: Estilização e design responsivo
- **JavaScript**: Lógica do jogo e interatividade
- **Canvas API**: Desenho e manipulação de imagens
- **LocalStorage API**: Persistência de dados entre sessões

### Componentes Principais:

1. **Interface de Desenho**: Implementada com a API Canvas do HTML5, permite que os usuários criem desenhos originais e modificados.
2. **Sistema de Detecção de Diferenças**: Algoritmo que compara os pixels entre os desenhos original e modificado para identificar diferenças.
3. **Sistema de Pontuação**: Mecanismo que registra e armazena as pontuações dos jogadores.
4. **Gerenciamento de Estado**: Controle dos diferentes modos e estados do jogo.

## Modos de Jogo

O jogo possui dois modos principais:

### Modo Criar

Neste modo, o jogador pode:
1. Desenhar uma imagem original usando ferramentas de desenho (cores e tamanhos de pincel)
2. Salvar o desenho original
3. Criar uma versão modificada do desenho, introduzindo até 7 diferenças
4. Salvar o jogo completo para que outros jogadores possam jogar

O processo de criação é guiado, com instruções claras em cada etapa.

### Modo Jogar

Neste modo, o jogador pode:
1. Visualizar o desenho original e o desenho modificado lado a lado
2. Clicar nas diferenças que conseguir identificar no desenho modificado
3. Receber feedback visual imediato sobre acertos e erros
4. Acompanhar seu progresso através de contadores de diferenças encontradas e pontuação
5. Receber uma mensagem de vitória ao encontrar todas as 7 diferenças

## Funcionalidades Principais

### Sistema de Desenho

- **Ferramentas de Desenho**: 
  - Seletor de cores com suporte a toda a paleta de cores
  - Controle de tamanho do pincel (1-20px)
  - Botão para limpar o canvas
  
- **Suporte Multi-plataforma**:
  - Eventos de mouse para desktop
  - Eventos de toque para dispositivos móveis

### Detecção de Diferenças

O sistema utiliza um algoritmo sofisticado para detectar diferenças entre os desenhos:

1. Compara os valores RGB dos pixels entre os dois desenhos
2. Identifica áreas com diferenças significativas
3. Agrupa diferenças próximas para evitar duplicidade
4. Garante que exatamente 7 diferenças sejam registradas

Se menos de 7 diferenças forem detectadas automaticamente, o sistema gera pontos adicionais para completar o número necessário.

### Sistema de Pontuação

- Cada diferença encontrada vale 10 pontos
- A pontuação é armazenada no localStorage
- A pontuação é exibida no perfil do jogador na plataforma

### Feedback Visual

- Círculos verdes indicam diferenças encontradas
- Círculos vermelhos indicam cliques em áreas sem diferenças
- Mensagem de vitória ao completar o jogo
- Contadores atualizados em tempo real

## Estrutura do Código

### Arquivos Principais

- **jogo7erros.html**: Estrutura da interface do jogo
- **jogo7erros.js**: Lógica e funcionalidades do jogo
- **style.css**: Estilização e design responsivo

### Organização do JavaScript

O código JavaScript segue uma estrutura modular e bem organizada:

1. **Inicialização e Configuração**:
   - Declaração de variáveis globais
   - Função `inicializar()` para configurar o ambiente do jogo
   - Event listeners para botões e interações

2. **Funcionalidades de Desenho**:
   - Função `configurarEventosDesenho()` para configurar eventos de mouse e toque
   - Funções para iniciar, executar e parar o desenho

3. **Gerenciamento de Modos**:
   - Função `mudarModo()` para alternar entre os modos criar e jogar
   - Funções específicas para cada modo

4. **Manipulação de Desenhos**:
   - Funções para salvar, carregar e limpar desenhos
   - Conversão entre formatos de imagem

5. **Detecção e Verificação de Diferenças**:
   - Função `calcularDiferencas()` para analisar e registrar diferenças
   - Função `verificarDiferenca()` para checar cliques do jogador

6. **Feedback e Pontuação**:
   - Funções para destacar diferenças e indicar erros
   - Sistema de pontuação e armazenamento

### Fluxo de Dados

1. Os desenhos são armazenados como strings de dados URL no localStorage
2. As diferenças são armazenadas como objetos JSON com coordenadas (x, y)
3. A pontuação é integrada ao sistema de pontuação global da plataforma

## Integração com a Plataforma

O jogo se integra à plataforma Pimpolho Kids através de:

1. **Sistema de Pontuação Unificado**:
   - As pontuações são armazenadas no localStorage usando o mesmo formato dos outros jogos
   - A sidebar exibe as pontuações de todos os jogos, incluindo o Jogo dos 7 Erros

2. **Interface Consistente**:
   - Utiliza o mesmo layout de cabeçalho, rodapé e sidebar dos outros jogos
   - Mantém a identidade visual da plataforma

3. **Navegação Integrada**:
   - Botões de navegação para retornar à página principal
   - Acesso ao perfil do usuário através da sidebar

## Fluxo de Interação do Usuário

### Modo Criar

1. Usuário seleciona "Modo Criar"
2. Desenha a imagem original usando as ferramentas disponíveis
3. Clica em "Salvar Desenho"
4. O sistema apresenta um segundo canvas com a cópia do desenho original
5. Usuário modifica o desenho para criar 7 diferenças
6. Clica em "Salvar Jogo"
7. O sistema analisa as diferenças e salva o jogo
8. Uma mensagem de confirmação é exibida

### Modo Jogar

1. Usuário seleciona "Modo Jogar"
2. O sistema carrega os desenhos original e modificado
3. Usuário observa os dois desenhos lado a lado
4. Clica nas diferenças que consegue identificar
5. O sistema fornece feedback visual para cada clique
6. Contadores de diferenças e pontuação são atualizados
7. Ao encontrar todas as 7 diferenças, uma mensagem de vitória é exibida
8. A pontuação é salva no perfil do usuário

## Considerações de Design Responsivo

O jogo foi projetado para funcionar em diferentes dispositivos e tamanhos de tela:

1. **Layout Flexível**:
   - Uso de flexbox para organização dos elementos
   - Adaptação do layout para telas menores

2. **Suporte a Dispositivos Móveis**:
   - Eventos de toque para desenho e interação
   - Reorganização dos elementos em telas pequenas

3. **Media Queries**:
   - Ajustes específicos para telas com largura máxima de 768px
   - Reorganização dos canvases em coluna em dispositivos móveis

## Aspectos Educacionais

O Jogo dos 7 Erros foi desenvolvido com objetivos educacionais específicos:

1. **Desenvolvimento Criativo**:
   - Estimula a criatividade ao permitir que as crianças criem seus próprios desenhos
   - Incentiva o pensamento estratégico na criação de diferenças

2. **Habilidades de Observação**:
   - Treina a atenção aos detalhes
   - Desenvolve a percepção visual e a capacidade de comparação

3. **Coordenação Motora**:
   - Aprimora a coordenação motora fina através do desenho
   - Desenvolve precisão nos movimentos ao clicar nas diferenças

4. **Pensamento Lógico**:
   - Estimula o raciocínio lógico na identificação de padrões e diferenças
   - Desenvolve estratégias para encontrar todas as diferenças

O jogo se alinha à proposta educacional da plataforma Pimpolho Kids, oferecendo uma experiência divertida que contribui para o desenvolvimento cognitivo e motor das crianças.