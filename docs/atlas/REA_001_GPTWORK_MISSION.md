# REA-001 — AtlasBot Desktop | Audit integral para GPTWORK

**Data:** 2026-11-14  
**Estado:** INSTRUÇÕES DE MISSÃO — REA **NÃO EXECUTADA**  
**Owner:** GPTWORK (Desktop & Design), com validação cruzada de Engenharia API / Infra  
**Repositório:** `AtlasHub-Si/Atlas-Bot-Desktop`, apenas; o antigo `Atlas-Bot` foi apagado e está fora do âmbito.  
**Meta:** transformar a base que compila numa versão **AtlasBot** visualmente coerente, auditada e testável, sem dependências acidentais da infraestrutura OpenBot.

## 0. Regras não negociáveis

- Auditar `main` + PR [#2](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/pull/2) (assets) + PR [#3](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/pull/3) (staging) por separado, sem declarar que PRs em Draft já estão em `main`.
- Não fazer `merge`, deploy, alterar DNS, chaves, credenciais, produção, VPS da Helena ou os perfis locais do utilizador nesta missão.
- Usar REA oficial de [morluto/rea](https://github.com/morluto/rea), verificar proveniência e requisitos. Usar REA como **instrumento de evidência**, não como substituto de auditoria manual. Não afirmar que foi executada sem resultados guardados.
- `LICENSE` e `NOTICE` preservados. A licença upstream **PolyForm Noncommercial 1.0.0** não se converte em MIT por rebranding e pode limitar exploração e distribuição comercial. Solicitar parecer/consentimento quando exigido.
- Preservar IDs de protocolos internos, `@openbot/*` imports, SQLite e app ID até haver plano de migração e testes de atualização/rollback. Textos e marcas visíveis podem ser substituídos quando aprovados.
- Não incorporar personagens/avatar assets ainda não aprovados nem inventar versões finais a partir de mockups. A aprovação V0.7 é de **DEV**, não de release.

## 1. REA real: inventário de funcionamento e interfaces

1. **Baseline reproduzível:** identificar SHAs, branches, comandos, CI, versão Electron/Solid/Bun, dependências de terceiros e binários nativos. Conferir `src/main`, `src/preload`, `src/backend`, `src/renderer/src`, `packages/brand`, `apps/auth-api`, `remote/api`, `electron-builder.yml`.
2. **Executar REA:** preparar clone/build em PC/VM de desenvolvimento isolado. Consultar instalação em `morluto/rea`; exemplo, após validar compatibilidade do ambiente e o alvo real: `npx -y rea-agents@latest analyze-javascript-application /CAMINHO/ABSOLUTO/DA/APLICACAO --json`. Guardar saída e limites. O projeto fonte e o build Electron podem exigir sondas diferentes; não afirmar capacidade da ferramenta que não foi testada.
3. **Mapa ecrã a ecrã:** arranque, splash, login opcional, onboarding, dashboard, agentes, agent-card, roster/equipa, avatars, settings, workspace, fila de tarefas, messenger, notificações, menus, state empty/loading/error/success, bandeja/tray, about, install/uninstall, atualizações, URLs e deep links. Para cada ecrã: captura atual, ficheiro/componente, identidade herdada, asset proposto e comportamento.
4. **Dados e segurança:** traçar como e onde avatar do agente, foto de utilizador, role icon, avatar de membro remoto, attachments, workspace, sessão e preferências se armazenam e propagam. Inspecionar os protocolos locais `openbot-avatar:`, `openbot-remote-avatar:` e a comunicação IPC; não mudar IDs por estética.
5. **Egress externo:** todos os `openbot.run`, analytics/crash, marketplace, download de CLIs, atualização, convites, remotes Signal/TURN, hosted services, links para terceiros, OAuth/SSO, recursos web. Registar em tabela **path/line**, gatilho, necessidade, domínio, prioridade, e comportamento em modo sem conta. Classificar em `LOCAL`, `ATLAS`, `EXTERNAL_PROVIDER`, `OPTIONAL`, `BLOCK/REMOVE`. Validar com inspeção de rede no primeiro arranque.
6. **Teste de código real:** não confundir `bun run build` (compila) com `bun run dist:win` (instalador). Auditar dependências de credenciais, autorun, permissões e persistência. Nunca instalar a distribuição herdada para a apresentar como AtlasBot.

## 2. REA visual: personagens, avatares e design system

**Fontes:** `AtlasHub-Si/atlas-brand-system` + pack V0.7 aprovado para DEV na PR #2 e packs anteriores necessários. Confirmar hashes, aprovadores e estado de cada asset; não alterar os ficheiros-master.

**Matriz obrigatória, por componente:** localização no projeto, ecrã, função, estado atual, marca herdada, personagem ideal, asset verificado, formato, dimensões/resolução, dark/light, fallback, acessibilidade, motion/reduced-motion, tamanho/peso e plano de integração.

Cobrir 3 conceitos que NÃO são a mesma coisa:

- **Personagens/mascotes AtlasBot:** `Guide`, `Creator`, `Builder`, `Analyst`, `Flow`, `Shield`. Propor função e localização de cada personagem para aprovação, sem impor esse casting prematuramente.
- **Avatares individuais de agentes/utilizadores:** presets, upload de foto/ilustração, seletores, recorte, validação de imagem, persistência local/remota, herança visual e fallbacks. Não substituir identidades personalizadas por mascotes de forma automática.
- **Avatares animados/interativos:** animação estática/motion CSS vs Lottie/Rive/3D vs personagem falante é um requisito distinto com tecnologia, direitos, performance, memória/GPU e UX próprios. Elaborar opções e dependências, não inferir funcionamento a partir de um MP4.

**Ecrãs a mapear:** onboarding, seleção de perfil e agente, biblioteca de agentes, grupo/múltiplos agentes, diálogo, workspace, estados de tarefas e desempenho, notificações, login, settings, lista de skills, integração Hermes/ACP, about, loading e erros, web landing e instalador. Determinar se os packs incluem Windows ICO, macOS ICNS, Linux PNG, tray, SVG/PNG/WebP, splash, favicon e motion; apontar lacunas.

**Decisão desejada:** arquitetura modular `AtlasBot Character System` com contratos `roleId/characterId/avatarId`, catálogo de assets versionados, associação opcional a agentes, isolamento entre UI e dados do agente, e seleção manual do avatar. Trata-se de **proposta** a validar, não de implementação aprovada.

## 3. Sequência técnica do primeiro teste

### Gate L0 — Windows local sem backend Atlas público

- Criar clone de `main` numa **VM Windows ou conta de teste descartável**, repositórios-teste e usuário limitado; nunca abrir workspaces de produção. Auditar condições de licenciamento da avaliação.
- `bun install --frozen-lockfile` e `bun run dev` para lançar stack de desenvolvimento. **Nota:** `bun run dev` arranca componentes locais de API e Signal, não é um teste que prove ausência de tráfego externo.
- Sem login OpenBot. Analisar e impedir egress não pretendido para OpenBot; capturar a rede, identificar pontos de contacto de fornecedores de modelos e downloads.
- Validar UI, assets e criar agente local com uma tarefa descartável de leitura/escrita num diretório-teste. Os agents podem executar comandos sem confirmação granular; não fornecer segredos ou pastas reais.
- Documentar resultados/falhas/screenshot e preparar matriz para empacotamento. Nenhuma release pública.

### Gate L1 — API Atlas propriamente dita

- PR #3 oferece configuração `env.atlas-staging` para Cloudflare Workers + D1 + R2, **não um Worker deployado**. D1 `atlasbot-auth-staging` tinha somente `_cf_KV` na inspeção de 14/11.
- O acesso à conta original usa `api.openbot.run` sem overrides. O código pode receber `OPENBOT_AUTH_API_URL` e `OPENBOT_REMOTE_SIGNAL_URL`; estes nomes internos não devem ser substituídos até migração testada.
- API engineering: migrar esquema para D1 stage com backup, gerar chaves próprias, integrar Resend OTP (domínio verificado ≠ transporte implementado), endpoint HTTPS restrito, testes de login/sessão/ACL/egress.
- **Não** usar os scripts `api:deploy` / `api:deploy:test` herdados para Atlas staging.

### Gate L2 — VPS AtlasHub (Helena)

- Testar um host isolado com volumes, rede, backups e limites; não executar o `remote/compose.yaml` original em produção sem adaptação.
- Se necessário, instalar Signal e TURN e apontar a Cloudflare API Atlas com chaves e URLs coerentes. Validar portas, certificados, WSS, UDP e persistência.
- Ligar Hermes via ACP **depois** de comprovar L0/L1. Não copiar as credenciais da instância Hermes existente.

### Gate L3 — Instalador Windows

- Testar `bun run dist:win` depois de integrar assets de DEV e garantir todos os recursos binários. Verificar `appId`, ícone, protocolo, copyright, fornecedor de assinatura, upgrades, dado do usuário, deinstall e portable/dev profile.
- Testes em Windows limpo, logs, permissões, antivírus/SmartScreen, memória, baixa resolução e tela HiDPI; nenhum update feed ligado automaticamente.
- Restringir o instalador a contexto permitido após revisão jurídica; **não** redistribuir comercialmente sem os direitos necessários.

## 4. Entregáveis obrigatórios

Criar **noutra branch** (não escrever diretamente em PR #2 ou #3):
- `docs/atlas/rea/REA-001-EXECUTIVE-SUMMARY.md` — achados comprovados, risco, decisões, não testado.
- `docs/atlas/rea/REA-001-ARCHITECTURE-DEPENDENCIES.md` — diagramas de runtime, módulos, serviços e contratos; evidência de REA e URLs/egress.
- `docs/atlas/rea/REA-001-VISUAL-CHARACTER-MATRIX.md` — personagens, avatares, componentes/rotas, telas, assets, gaps e estados.
- `docs/atlas/rea/REA-001-WINDOWS-LOCAL-PILOT.md` — comandos, screenshots, logs, QA de segurança e reprodução.
- `docs/atlas/rea/REA-001-ACTION-BACKLOG.md` — ações concretas P0/P1/P2, owner, prioridade e condições de aceitação.

Incluir commit SHA, método, resultados REA (ou razão de indisponibilidade), links para prints/relatórios, caminhos e linhas do código, e resultado da matriz **Exige API / Funciona local / Exige VPS**. Não apresentar uma proposta não testada como facto.

## 5. Critérios de aceitação

- [ ] REA oficial executada e resultados/evidência arquivados ou limitação expressamente declarada.
- [ ] 100% dos ecrãs e dos pontos de identidade visual **inventariados**; mudanças futuras priorizadas, sem afirmar que tudo já foi alterado.
- [ ] Seis personagens tratados com assets/estado claros; avatares de utilizador/agente e sistema de motion independentes.
- [ ] Endpoint padrão do cliente auditado e comportamento no teste sem conta comprovado por logs de rede.
- [ ] Prova local com agente executada em ambiente descartável e resultado preservado.
- [ ] Lista final dos componentes do backend que **já existem**, que **faltam instalar** e que **não são necessários ao primeiro teste**.
- [ ] Sem commits de segredos, alteração de produção ou releases comerciais.
- [ ] Backlog com evidência suficiente para o segundo ciclo de integração visual e operacional.

**Nota:** documento de trabalho; não afirma conclusão da REA, deploy de backend ou teste Windows.
