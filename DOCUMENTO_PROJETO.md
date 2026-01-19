Documento de Projeto: Controlizze - Micro SaaS de Análise de Commits GitHub

Este documento detalha o projeto Controlizze, um micro SaaS em desenvolvimento, cobrindo sua visão, arquitetura, implementação atual, procedimentos operacionais, status e roadmap futuro.

1. Visão Geral do Produto

1.1. O que é o Controlizze
Controlizze é um micro SaaS projetado para fornecer insights acionáveis sobre a atividade de desenvolvimento em repositórios GitHub. Ele atua como uma ferramenta de análise que processa dados de commits e alterações de código, transformando-os em relatórios e métricas compreensíveis.

1.2. O Problema que Resolve e Para Quem
Problema: Desenvolvedores, líderes técnicos e gerentes de projeto frequentemente carecem de uma visão clara e objetiva sobre o impacto e a natureza das mudanças de código ao longo do tempo. É difícil quantificar a atividade de desenvolvimento, identificar áreas de maior alteração ou entender o escopo de um conjunto de commits sem uma análise manual demorada.

Para Quem:
*   Desenvolvedores: Para entender o impacto de seus próprios commits ou de um colega, e para ter um histórico claro das mudanças.
*   Líderes Técnicos/Gerentes de Projeto: Para monitorar a saúde do código, identificar tendências de desenvolvimento, avaliar o esforço em diferentes partes do projeto e gerar relatórios de progresso.
*   Empresas de Software: Para ter uma ferramenta de auditoria de código, análise de produtividade e base para tomadas de decisão estratégicas.

1.3. Proposta de Valor (Insights de Mudanças/Commits)
O Controlizze oferece uma proposta de valor clara:
*   Visibilidade Aprimorada: Transforma dados brutos do GitHub (commits, arquivos alterados, linhas adicionadas/removidas) em um resumo conciso e fácil de entender.
*   Análise de Impacto: Permite comparar o estado do código entre dois pontos (commits) e ver o "diff" consolidado, incluindo o número total de commits, arquivos alterados, linhas adicionadas e removidas.
*   Identificação de Foco: Destaca os arquivos mais alterados em um período, ajudando a identificar áreas de maior atividade ou complexidade.
*   Histórico Persistente: Armazena esses resumos (snapshots) em um banco de dados, permitindo a criação de um histórico de desenvolvimento e a análise de tendências ao longo do tempo.

1.4. Como Isso Vira um Micro SaaS (Assinatura, Entregáveis)
Como um micro SaaS, o Controlizze será monetizado através de assinaturas. Os entregáveis para os usuários incluirão:
*   Dashboard Interativo: Uma interface web para visualizar os snapshots, tendências e métricas.
*   Relatórios Agendados: Geração automática de relatórios periódicos (diários, semanais, mensais) sobre a atividade de repositórios específicos.
*   Alertas Personalizados: Notificações sobre grandes volumes de mudanças, commits em arquivos críticos, etc.
*   API para Integração: Possibilidade de integrar os dados do Controlizze com outras ferramentas de CI/CD ou monitoramento.

2. Arquitetura Atual (NestJS)

O backend do Controlizze é construído com NestJS, um framework Node.js progressivo, que utiliza TypeScript e segue o padrão de arquitetura modular.

2.1. Como o Backend Está Organizado
A estrutura modular do NestJS permite uma organização clara e escalável:
*   AppModule: O módulo raiz da aplicação, que importa e orquestra todos os outros módulos.
*   GithubModule: Responsável por toda a interação com a API do GitHub. Contém o GithubService (lógica de negócio) e o GithubController (endpoints da API).
*   ControlizzeModule: Contém a lógica de negócio principal do Controlizze, processando os dados do GitHub para gerar summaries e snapshots. Inclui o ControlizzeService e o ControlizzeController.
*   PrismaModule: Gerencia a conexão e interação com o banco de dados SQLite através do Prisma ORM. Contém o PrismaService.

2.2. Endpoints Implementados e Propósito de Cada Um

Endpoints do GithubModule (Proxy para a API do GitHub)
*   GET /github/me
    *   Propósito: Retorna informações sobre o usuário autenticado (o dono do token GitHub).
    *   Exemplo de Uso (PowerShell do PC):
        `powershell
        iwr "http://127.0.0.1:3000/github/me" -UseBasicParsing | Select-Object -ExpandProperty Content
        `
*   GET /github/repos
    *   Propósito: Lista os repositórios do usuário autenticado. Suporta paginação.
    *   Parâmetros de Query: page (número da página), perPage (itens por página).
    *   Exemplo de Uso (PowerShell do PC):
        `powershell
        iwr "http://127.0.0.1:3000/github/repos?page=1&perPage=10" -UseBasicParsing | Select-Object -ExpandProperty Content
        `
*   GET /github/repos/:owner/:repo/commits
    *   Propósito: Lista os commits de um repositório específico. Suporta paginação.
    *   Parâmetros de Path: owner (nome do proprietário do repositório), repo (nome do repositório).
    *   Parâmetros de Query: page, perPage.
    *   Exemplo de Uso (PowerShell do PC):
        `powershell
        iwr "http://127.0.0.1:3000/github/repos/LucasRamossss/Controlizze/commits?page=1&perPage=10" -UseBasicParsing | Select-Object -ExpandProperty Content
        `
*   GET /github/compare/:owner/:repo?base&head
    *   Propósito: Compara dois commits (ou branches/tags) de um repositório, retornando detalhes sobre as diferenças, incluindo arquivos alterados, adições, remoções e uma lista dos commits entre base e head.
    *   Parâmetros de Path: owner, repo.
    *   Parâmetros de Query: base (SHA do commit inicial), head (SHA do commit final).
    *   Exemplo de Uso (PowerShell do PC):
        `powershell
        iwr "http://127.0.0.1:3000/github/compare/LucasRamossss/Controlizze?base=b0a3fd6&head=70e93a3" -UseBasicParsing | Select-Object -ExpandProperty Content
        `

Endpoints do ControlizzeModule (Lógica de Negócio do Controlizze)
*   GET /controlizze/summary/:owner/:repo?base&head
    *   Propósito: Gera um resumo consolidado das mudanças entre dois commits, utilizando o endpoint /github/compare. Este endpoint normaliza os dados do GitHub em um formato mais amigável para o Controlizze, incluindo totais de commits, arquivos alterados, adições, remoções e os 5 arquivos mais alterados.
    *   Parâmetros de Path: owner, repo.
    *   Parâmetros de Query: base, head.
    *   Exemplo de Uso (PowerShell do PC):
        `powershell
        iwr "http://127.0.0.1:3000/controlizze/summary/LucasRamossss/Controlizze?base=b0a3fd6&head=70e93a3" -UseBasicParsing | Select-Object -ExpandProperty Content
        `
*   POST /controlizze/snapshots/:owner/:repo?base&head
    *   Propósito: Cria um novo "snapshot" (registro histórico) das mudanças entre dois commits e o persiste no banco de dados. Retorna o snapshot salvo, incluindo seus arquivos detalhados.
    *   Parâmetros de Path: owner, repo.
    *   Parâmetros de Query: base, head.
    *   Exemplo de Uso (PowerShell do PC):
        `powershell
        iwr -Method Post "http://127.0.0.1:3000/controlizze/snapshots/LucasRamossss/Controlizze?base=b0a3fd6&head=70e93a3" -UseBasicParsing | Select-Object -ExpandProperty Content
        `
*   GET /controlizze/snapshots/:owner/:repo
    *   Propósito: Lista todos os snapshots previamente salvos para um repositório específico, ordenados por data de criação.
    *   Parâmetros de Path: owner, repo.
    *   Exemplo de Uso (PowerShell do PC):
        `powershell
        iwr "http://127.0.0.1:3000/controlizze/snapshots/LucasRamossss/Controlizze" -UseBasicParsing | Select-Object -ExpandProperty Content
        `
*   GET /controlizze/snapshots/:owner/:repo/:id
    *   Propósito: Retorna os detalhes de um snapshot específico, incluindo todos os arquivos alterados.
    *   Parâmetros de Path: owner, repo, id (ID do snapshot).
    *   Exemplo de Uso (PowerShell do PC):
        `powershell
        # Substitua <snapshot_id> pelo ID retornado pelo POST ou GET anterior
        iwr "http://127.0.0.1:3000/controlizze/snapshots/LucasRamossss/Controlizze/<snapshot_id>" -UseBasicParsing | Select-Object -ExpandProperty Content
        `

2.3. Como o GithubService Funciona
O GithubService é o cliente da API do GitHub.
*   Token do .env: Ele obtém o token de autenticação do GitHub da variável de ambiente GITHUB_TOKEN. É crucial que este token esteja configurado no arquivo .env na raiz do projeto.
*   Headers Padrão: Todas as requisições para a API do GitHub incluem headers como Authorization (com o token), X-GitHub-Api-Version, User-Agent e Accept para garantir a comunicação correta.
*   githubGet: Um método utilitário interno que encapsula a lógica de fazer requisições GET para a API do GitHub, tratando erros e retornando o JSON.
*   Paginação: Os métodos listRepos e listCommits aceitam parâmetros page e perPage para controlar a paginação dos resultados da API do GitHub.

2.4. Como o ControlizzeService Monta o Summary e o Snapshot
O ControlizzeService é o coração da lógica de negócio do Controlizze:
*   summary:
    *   Chama github.compareCommits para obter os dados brutos do GitHub.
    *   Normaliza os dados de files e commits para um formato mais simples e consistente.
    *   Calcula additionsTotal e deletionsTotal somando as mudanças de todos os arquivos.
    *   Identifica os topFiles (os 5 arquivos com mais changes).
    *   Formata os commits para incluir apenas SHA curto, mensagem, autor e data.
    *   Retorna um objeto summary com todas essas informações consolidadas.
*   createSnapshot:
    *   Primeiro, chama o próprio método summary para obter os dados processados.
    *   Em seguida, utiliza o PrismaService para criar um novo registro na tabela Snapshot no banco de dados.
    *   Os detalhes dos arquivos alterados são salvos como registros relacionados na tabela SnapshotFile, garantindo a integridade dos dados.
*   listSnapshots e getSnapshot:
    *   Utilizam o PrismaService para consultar o banco de dados, retornando os snapshots salvos, incluindo seus arquivos relacionados.

3. Banco de Dados (SQLite + Prisma v7)

3.1. Por que SQLite no MVP
*   Simplicidade: Para um MVP (Minimum Viable Product), o SQLite é ideal por ser um banco de dados baseado em arquivo, não exigindo um servidor de banco de dados separado. Isso simplifica a configuração, o desenvolvimento e o deploy inicial.
*   Zero Infraestrutura: Não há necessidade de instalar, configurar ou gerenciar um servidor de banco de dados complexo. O arquivo dev.db é criado automaticamente.

3.2. Como o Prisma Foi Configurado com Prisma 7.2.0
A versão 7.2.0 do Prisma trouxe algumas mudanças significativas na configuração, especialmente para o migrate dev.
*   prisma.config.ts: Em vez de colocar a URL do banco de dados diretamente no schema.prisma, o Prisma 7 espera que a configuração da URL seja feita no arquivo prisma.config.ts na raiz do projeto. Isso permite maior flexibilidade e controle sobre as configurações do Prisma.
*   DATABASE_URL no .env: A URL de conexão com o banco de dados é lida da variável de ambiente DATABASE_URL, definida no arquivo .env. Para o SQLite, o valor é file:./dev.db.
*   PrismaService: A instância do PrismaClient é criada no PrismaService passando a datasourceUrl diretamente no construtor super(), garantindo que o cliente saiba onde se conectar.

3.3. Estrutura do schema.prisma (Snapshot e SnapshotFile) e Relacionamento
O arquivo prisma/schema.prisma define o modelo de dados:
*   model Snapshot:
    *   Representa um resumo de mudanças entre dois commits.
    *   Campos: id (UUID gerado automaticamente), owner, repo, base, head, totalCommits, filesChanged, additionsTotal, deletionsTotal, createdAt.
    *   Relacionamento: files (um array de SnapshotFile), indicando que um snapshot pode ter múltiplos arquivos alterados.
*   model SnapshotFile:
    *   Representa um arquivo individual alterado dentro de um snapshot.
    *   Campos: id, snapshotId (chave estrangeira para Snapshot), filename, status, additions, deletions, changes.
    *   Relacionamento: snapshot (referência ao Snapshot pai), com onDelete: Cascade para garantir que os arquivos sejam excluídos se o snapshot for.
    *   @@index([snapshotId]): Otimiza consultas por snapshotId.

3.4. Migrations (migrate dev) e Geração do Client (prisma generate)
*   npx prisma migrate dev --name init: Este comando é usado para criar e aplicar a primeira migração (init) com base no schema.prisma. Ele cria o arquivo dev.db (se não existir) e a estrutura de tabelas definida no schema.
*   npx prisma generate: Este comando gera o Prisma Client, que é uma biblioteca TypeScript/JavaScript que permite interagir com o banco de dados de forma type-safe. É essencial rodá-lo sempre que o schema.prisma for alterado para que o código da aplicação tenha acesso aos modelos atualizados.

3.5. Principais Erros que Ocorreram e Como Resolvemos
Durante a implementação, enfrentamos alguns desafios comuns, especialmente com a versão 7 do Prisma e o ambiente Windows PowerShell:

*   BOM/encoding no schema (TS1003: Identifier expected):
    *   Erro: Arquivos salvos com Byte Order Mark (BOM) no Windows PowerShell podem causar erros de parsing no TypeScript ou no Prisma CLI, resultando em mensagens como "Identifier expected" ou "This line is invalid".
    *   Solução: Utilizar [System.IO.File]::WriteAllText("caminho/arquivo.ts", $conteudo, (New-Object System.Text.UTF8Encoding($false))) para gravar arquivos em UTF-8 sem BOM.
*   datasource.url no schema vs config (Error: The datasource.url property is required in your Prisma config file):
    *   Erro: No Prisma 7, a propriedade url da datasource foi removida do schema.prisma e deve ser configurada no prisma.config.ts.
    *   Solução: Remover url = env("DATABASE_URL") do schema.prisma e adicionar datasourceUrl: process.env.DATABASE_URL || "file:./dev.db" (ou datasource: { url: ... } dependendo da variante do CLI) no prisma.config.ts.
*   Propriedade datasources no PrismaClient (PrismaClientConstructorValidationError: Unknown property datasources):
    *   Erro: A opção datasources no construtor do PrismaClient foi removida no Prisma 7.
    *   Solução: Substituir super({ datasources: { db: { url: ... } } }) por super({ datasourceUrl: process.env.DATABASE_URL || "file:./dev.db" }) no PrismaService.
*   Erro de DI no Nest (UnknownDependenciesException para GithubService):
    *   Erro: O ControlizzeModule não conseguia injetar o GithubService no ControlizzeService porque o GithubModule não o estava exportando.
    *   Solução: Adicionar exports: [GithubService] no @Module decorator do GithubModule.
*   Cannot find module '.prisma/client/default':
    *   Erro: O Prisma Client não foi gerado ou não foi encontrado pelo Node.
    *   Solução: Rodar npx prisma generate para criar os arquivos do cliente na pasta node_modules/.prisma/client.
*   Cache/ordem de execução dos comandos (npm run dev antes da correção):
    *   Erro: Frequentemente, o ts-node-dev ou o ambiente de desenvolvimento pode continuar usando versões antigas de arquivos ou configurações se o servidor não for reiniciado após uma correção.
    *   Solução: Sempre parar o npm run dev (Ctrl+C) e rodá-lo novamente após aplicar qualquer alteração de código ou configuração. Em casos extremos, limpar node_modules e package-lock.json e reinstalar (npm i) pode ser necessário.
*   process.env.DATABASE_URL vazio no PrismaService:
    *   Erro: O PrismaService é instanciado muito cedo no ciclo de vida da aplicação, antes que o @nestjs/config tenha carregado as variáveis do .env para process.env.
    *   Solução: Adicionar import 'dotenv/config'; no topo do src/main.ts para garantir que as variáveis de ambiente sejam carregadas antes de qualquer outra parte da aplicação.

4. Procedimento Operacional (Como Rodar e Testar)

4.1. Diferenciar PowerShell do Cursor vs PowerShell do PC
*   PowerShell do Cursor: Refere-se ao terminal integrado no ambiente de desenvolvimento (Cursor IDE). É onde você executa comandos de desenvolvimento como npm run dev, git, npx prisma, etc.
*   PowerShell do PC: Refere-se a um terminal PowerShell separado, fora do ambiente de desenvolvimento. É usado para testar os endpoints da API com comandos HTTP como iwr (Invoke-WebRequest).

4.2. Comandos de Desenvolvimento: npm run dev
*   Propósito: Inicia o servidor NestJS em modo de desenvolvimento, com hot-reload.
*   Comando (PowerShell do Cursor):
    `powershell
    npm run dev
    `
*   Saída Esperada: O NestJS deve iniciar, logar os módulos carregados e as rotas mapeadas, e indicar que está escutando em uma porta (geralmente http://localhost:3000).

4.3. Como Testar Cada Endpoint via iwr (PowerShell)
Use o PowerShell do PC para testar os endpoints.

*   GET /github/me
    `powershell
    iwr "http://127.0.0.1:3000/github/me" -UseBasicParsing | Select-Object -ExpandProperty Content
    `
*   GET /github/repos
    `powershell
    iwr "http://127.0.0.1:3000/github/repos?page=1&perPage=10" -UseBasicParsing | Select-Object -ExpandProperty Content
    `
*   GET /github/repos/:owner/:repo/commits
    `powershell
    iwr "http://127.0.0.1:3000/github/repos/LucasRamossss/Controlizze/commits?page=1&perPage=10" -UseBasicParsing | Select-Object -ExpandProperty Content
    `
*   GET /github/compare/:owner/:repo?base&head
    `powershell
    iwr "http://127.0.0.1:3000/github/compare/LucasRamossss/Controlizze?base=b0a3fd6&head=70e93a3" -UseBasicParsing | Select-Object -ExpandProperty Content
    `
*   GET /controlizze/summary/:owner/:repo?base&head
    `powershell
    iwr "http://127.0.0.1:3000/controlizze/summary/LucasRamossss/Controlizze?base=b0a3fd6&head=70e93a3" -UseBasicParsing | Select-Object -ExpandProperty Content
    `

4.4. Como Selecionar SHAs para base/head
Você pode obter SHAs válidos para os parâmetros base e head de duas maneiras:
1.  Do endpoint /github/repos/:owner/:repo/commits: Este endpoint retorna uma lista de commits, cada um com seu sha. Você pode pegar dois SHAs diferentes para comparar.
2.  Do histórico do Git local: Use git log --oneline no PowerShell do Cursor para ver os SHAs dos seus commits.

4.5. Como Criar e Listar Snapshots
*   Criar Snapshot (POST):
    `powershell
    iwr -Method Post "http://127.0.0.1:3000/controlizze/snapshots/LucasRamossss/Controlizze?base=b0a3fd6&head=70e93a3" -UseBasicParsing | Select-Object -ExpandProperty Content
    `
    *   Saída Esperada: Um JSON representando o snapshot salvo, incluindo um id gerado e os files relacionados.
*   Listar Snapshots (GET):
    `powershell
    iwr "http://127.0.0.1:3000/controlizze/snapshots/LucasRamossss/Controlizze" -UseBasicParsing | Select-Object -ExpandProperty Content
    `
    *   Saída Esperada: Um array JSON contendo todos os snapshots salvos para o repositório, cada um com seus files.

5. Status do Projeto (Checkpoint)

O projeto Controlizze está na Etapa 8, com a maior parte da funcionalidade de persistência implementada.

5.1. Etapas 1 a 8 Concluídas (Funcionalidade)
*   Etapa 1: Bootstrap do Projeto (Node.js, TypeScript, NestJS).
*   Etapa 2: Configuração de Variáveis de Ambiente (GITHUB_TOKEN no .env).
*   Etapa 3: Endpoint /github/me (autenticação com GitHub).
*   Etapa 4: Endpoint /github/repos (listagem de repositórios).
*   Etapa 5: Endpoint /github/repos/:owner/:repo/commits (listagem de commits).
    *   Commit Relevante: 12f1170 feat(github): list repos and commits
*   Etapa 6: Endpoint /github/compare/:owner/:repo?base&head (comparação de commits).
    *   Commit Relevante: 70e93a3 feat(github): add compare endpoint
*   Etapa 7: Endpoint /controlizze/summary/:owner/:repo?base&head (resumo de mudanças).
    *   Commit Relevante: 9ee9fad feat(controlizze): add summary endpoint from github compare
*   Etapa 8: Persistência com SQLite + Prisma (modelos Snapshot e SnapshotFile, endpoints POST/GET para snapshots).
    *   Status Atual: A configuração do Prisma (schema, config, client, service) foi ajustada para compatibilidade com Prisma 7.2.0 e ambiente Windows PowerShell. O npm run dev deve estar subindo sem erros de Prisma.

5.2. O que Ainda Falta para Concluir a Etapa 8
*   Confirmação Final: O servidor npm run dev precisa subir sem erros após as últimas correções no PrismaService e main.ts.
*   Testes de Endpoints: Os endpoints POST /controlizze/snapshots e GET /controlizze/snapshots precisam ser testados com sucesso no PowerShell do PC.

6. Roadmap Detalhado (Etapas 9 e 10)

6.1. Etapa 9: Funcionalidades Avançadas e Preparação para UI
*   Autenticação/Usuários: Implementar um sistema de autenticação (ex: JWT) para gerenciar usuários e seus repositórios.
*   Multi-repo/Multi-tenant: Adaptar a arquitetura para suportar múltiplos usuários e múltiplos repositórios por usuário, garantindo isolamento de dados.
*   Agendamento de Snapshots (Cron): Desenvolver um mecanismo para agendar a criação automática de snapshots em intervalos regulares (ex: diariamente, semanalmente), gerando um histórico contínuo.
*   Relatórios Personalizados: Permitir a configuração de relatórios com filtros e métricas específicas.
*   Preparação para Deploy: Otimizar a aplicação para deploy em plataformas como Render, Fly.io ou Railway (configurações de ambiente, Dockerfile, etc.).

6.2. Etapa 10: Interface de Usuário (UI) e Monetização
*   UI/Dashboard:
    *   Desenvolver uma interface de usuário intuitiva (ex: com Next.js ou React) para visualizar os dados do Controlizze.
    *   Dashboard com gráficos de tendências (adições/remoções ao longo do tempo), lista de snapshots, top arquivos alterados.
    *   Páginas para gerenciar repositórios, agendamentos e usuários.
*   Observabilidade: Implementar logging robusto, monitoramento de erros e métricas de performance.
*   Monetização:
    *   Pricing Sugerido: Modelo freemium (repositórios públicos limitados, 1 usuário) e planos pagos (repositórios privados, múltiplos usuários, histórico estendido, relatórios avançados).
    *   Planos e Limites: Definir limites de repositórios, frequência de snapshots, retenção de histórico e número de usuários por plano.

7. Guia de Uso com IA do Cursor

A interação com a IA do Cursor é uma parte fundamental do desenvolvimento do Controlizze. Para maximizar a eficiência:

7.1. Como Pedir Tarefas (Prompts) para Implementar Features sem Quebrar
*   Seja Específico: Descreva a funcionalidade desejada com o máximo de detalhes possível.
    *   Ruim: "Adicione autenticação."
    *   Bom: "Implemente autenticação JWT no NestJS, com endpoints de registro e login, e proteja o endpoint /github/me."
*   Contexto é Rei: Mencione os arquivos relevantes, as classes envolvidas e o comportamento esperado.
    *   Ruim: "Crie um endpoint."
    *   Bom: "No ControlizzeController, adicione um POST para /controlizze/snapshots que chame controlizzeService.createSnapshot com owner, repo, base e head dos parâmetros de rota e query."
*   Divida em Passos Menores: Para funcionalidades complexas, peça um passo de cada vez.
    *   Ruim: "Faça a Etapa 8 inteira."
    *   Bom: "Primeiro, instale Prisma e configure o schema. Depois, crie o PrismaService. Em seguida, atualize o ControlizzeService para usar o Prisma."
*   Indique o Ambiente: Sempre especifique se o comando deve ser rodado no PowerShell do Cursor ou PowerShell do PC.
*   Use o Formato de Saída: Se precisar de um arquivo, peça para usar Out-File -Encoding utf8 ou [System.IO.File]::WriteAllText para evitar problemas de encoding.

7.2. Boas Práticas: Rodar Testes, Validar Endpoint, Commits Pequenos
*   Rodar Testes (Manualmente): Após cada alteração de código fornecida pela IA, sempre rode npm run dev no PowerShell do Cursor e teste os endpoints relevantes no PowerShell do PC com iwr.
*   Validar Endpoint: Verifique se o JSON de resposta está correto e se o comportamento é o esperado.
*   Commits Pequenos e Atômicos: Faça commits frequentes e pequenos, cada um resolvendo um problema ou adicionando uma funcionalidade específica. Isso facilita o rastreamento de erros e a colaboração.
    *   Exemplo: git add ., git commit -m "feat(modulo): descrição da feature", git push.
*   Não Pule Etapas: Siga a sequência de passos fornecida pela IA. Pular etapas pode levar a erros de dependência ou configuração.
*   Reporte Erros Completos: Se algo falhar, cole a mensagem de erro completa (incluindo stack trace, se houver) e o contexto (qual comando rodou, qual arquivo foi alterado). Isso ajuda a IA a diagnosticar o problema rapidamente.

Checklist de Próximos Passos

1.  PowerShell do Cursor: Rodar npm run dev e confirmar que o servidor NestJS inicia sem erros.
2.  PowerShell do PC: Testar o endpoint POST /controlizze/snapshots/LucasRamossss/Controlizze?base=b0a3fd6&head=70e93a3 e verificar se retorna um snapshot com id.
3.  PowerShell do PC: Testar o endpoint GET /controlizze/snapshots/LucasRamossss/Controlizze e verificar se lista o snapshot criado.
4.  PowerShell do Cursor: Fazer o commit final da Etapa 8:
    `powershell
    git add .
    git commit -m "feat(db): add prisma sqlite snapshots for controlizze"
    git push
    `
5.  PowerShell do Cursor: Enviar o git log -1 --oneline para confirmar o commit.

Após a confirmação desses passos, a Etapa 8 será marcada como concluída e avançaremos para a Etapa 9 do roadmap.
