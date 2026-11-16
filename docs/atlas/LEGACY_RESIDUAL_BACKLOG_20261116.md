# AtlasBot — Backlog de resíduos OpenBot após varredura integral

**Data:** 2026-11-16  
**Escopo:** `AtlasHub-Si/Atlas-Bot-Desktop`, branch `fix/atlasbot-legacy-sweep-20261116`  
**Estado:** evidência estática, sem deploy nem renomeações de compatibilidade  
**Origem:** GitHub Actions [varredura validada #43833261639](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/actions/runs/43833261639), complementada com leitura direta de ficheiros da branch `main`.

> O GitHub Issues está desativado neste repositório (API 410); este backlog preserva tarefas prontas a converter em issues ou PRs. Não representa confirmação de falhas observadas em produção.

## Métricas comprovadas da varredura

- **8.896** ficheiros versionados, dos quais **8.585** de texto analisados.
- **5.020** ficheiros com correspondências e **35.336** ocorrências totais.
- **175** ocorrências `nightly-labs/openbot`, **939** `*.openbot.run`, **9.529** `@openbot/*`, **1.388** `OPENBOT_*`.
- O relatório é um inventário textual; **não** mede tráfego, confirma uma regressão ou identifica automaticamente licenças inválidas.
- A primeira execução falhou num diretório/submódulo versionado; o scanner foi corrigido para ignorar entradas que não são ficheiros regulares. Uma execução posterior terminou com sucesso.

## P0 — Corrigido nesta branch, dependente de revisão e CI

| Superfície | Correção | Gate |
| --- | --- | --- |
| `packages/i18n/src/messages/<locale>/server.ts` (15 idiomas) | Identidade textual dos servidores apresentada como AtlasBot | Preservar chaves e variáveis; CI `i18n:check` |
| `packages/i18n/src/messages/<locale>/island.ts` (15 idiomas) | Rótulos e botões de Dynamic Island apresentam AtlasBot | UI/a11y e build |
| `scripts/install-server.sh` | Remoção do download original, origem Atlas, tag aprovada obrigatória, versão e checksum | Não publicar: assinatura/proveniência extra e VM descartável |
| `src/main/host-release-service.ts` | Basenames de artefactos `AtlasBot-...` esperados | Releases oficiais ainda indisponíveis |
| `apps/auth-api/src/server/latest-download.ts` | Links de instalação delegados para o gate de releases do website Atlas-SI; Android indisponível | Verificar que website continua HTTP 503 sem aprovação |
| `apps/auth-api/src/routes/health/{ready,live}.ts` | Metadados de serviço `atlasbot-auth-api` | Compatibilidade de observadores; sem alteração em Worker deployed |
| `scripts/atlas-legacy-sweep.mjs` | Inventário completo e relatório CI | Estático apenas; sem claims sobre egress runtime |

## P0 — Egress, URLs públicas e CSP

**Ficheiros observados:**
- `src/main/content-security-policy.ts`: `https://analytics.openbot.run`, `wss://*.openbot.run` e `frame-src https://*.openbot.run` permitidos.
- `apps/auth-api/src/lib/landing-links.ts`: perfis sociais `OpenBot_`, `openbot.run`, Discord original, documentação e repositório da origem; navegação do operador original.
- `src/renderer/src/features/servers/AddServerOverlay.tsx`: `https://openbot.run/terms` e `https://openbot.run/privacy` no contexto de oferta/checkout de hosting.

**Implementação a fazer numa PR independente:**
1. Medir e classificar egress **em runtime**, por contexto: first-run, login, modelos, MCP, browser, marketplaces, analytics e remote; distinguir provedores OAuth e SDKs legítimos.
2. Não iniciar comunicação de produto com origem alheia por omissão; remover permissões CSP excessivas apenas quando Signal e endpoints Atlas estiverem comprovados, ou *fail closed*.
3. Ocultar links sociais não controlados pela Atlas, sem inventar URLs ou apropriar-se de perfis existentes; manter atribuição de origem apenas nos contextos históricos e jurídicos necessários.
4. Não ativar hosted billing até existir documentação jurídica do próprio serviço Atlas (a política do website institucional não substitui termos de conta/pagamentos).
5. Criar testes de egress, consentimento de telemetria, CSP, redirects, offline-first, login e revogação sem tokens ou dados de produção.

**Aceitação:** cliente Atlas sem destinos não autorizados à origem, sem quebrar o OAuth de provedores externos, com evidência de tráfego e aprovação jurídica do hosting antes de ativar pagamentos.

## P0 — Distribuição de host independente

**Ficheiros:**
- `scripts/hosting/openbot-server-setup`, `scripts/hosting/openbot-hosted-*`, `src/main/host-release-service.ts`, `scripts/install-server.sh`, `docs/self-hosted-server.md`.

**Dependências:**
- Não renomear automaticamente unidades systemd, diretórios `/opt/OpenBot`, `/srv/openbot-hosted`, chaveiro, `openbot` CLI ou `OPENBOT_*`.
- Rever se o AppImage Atlas realmente inclui o setup de host e o mesmo formato do manifesto.
- Testar num Ubuntu 24.04 descartável as rotas de erro de `--approved-tag`, checksum, atualização, rollback, ownership, Hermes ACP e SSH/claims, sem dados reais.
- Exigir assinatura de binários, cadeia de proveniência e distribuição homologada; manter website em modo *Em breve*.

**Aceitação:** instalar e atualizar AtlasBot sem executar download de releases da origem, preservando perfis existentes e provando rollback.

## P1 — Aplicação móvel e identificadores nativos

**Ficheiros:**
- `apps/mobile/app.json`: `name: OpenBot`, `slug: openbot`, `scheme: openbot`, `run.openbot.mobile`, App Groups e ShareExtension, `owner: openbot`, `https://updates.openbot.run/manifest`.
- `electron-builder.yml` e `package.json`: appId Canary Atlas, `desktopName: openbot.desktop`, `ElectronTeamID` herdado e ficheiros macOS `app.openbot.*`.

**Implementação:**
- Inventariar identidades Windows/macOS/iOS/Android, esquemas URI, certificados e stores; decidir a migração vs coexistência.
- Preparar App Groups, assinaturas e OTA sob identidade legal Atlas, sem reutilizar IDs de outra entidade.
- Backup e migração de dados, perfis, segredos keychain, SQLite, notificações, share extensions, app protocol e atualizadores; testes instalador/upgrade/reversão.
- Separar requisitos de marcas e utilizador visível de nomes internos de pacote e persistência.

**Aceitação:** app nativa Atlas assinada corretamente, sem perda de dados nem ligação à OTA original, apenas após revisão e publicação aprovada.

## Contratos internos a preservar até existir migração

- Imports `@openbot/*`, variáveis `OPENBOT_*`, CLI `openbot`, esquemas `openbot-attachment:`, `openbot-avatar:` e `openbot-remote-*` podem ser dependências de compatibilidade.
- Esquemas de migração SQLite, ferramentas de agentes, sockets, unit files e diretórios são interfaces de dados, **não apenas resíduos visuais**.
- `LICENSE` MIT foi aprovado na origem do repositório Atlas em 2026-11-15, e `NOTICE` preserva autores/terceiros. Não apagar ou reescrever atribuições.
- `apps/auth-api/src/lib/brand-page.ts` e recursos de arte anteriores requerem assets finais e QA visual; não mudar metadata para fazer passar como Atlas uma arte de origem.

## Verificação e estado

- [x] Scanner geral executado e corrigido.
- [x] UI de servidores/Dynamic Island rebrand em 15 idiomas.
- [x] Endpoints de download do código staging sem origem de release original.
- [x] Instalador passa a exigir tag explícita e binário Atlas.
- [x] Regressões estáticas e `bash -n` integradas em CI.
- [ ] Egress runtime e prova de isolamento real.
- [ ] Instalação Linux/host end-to-end, SHA e assinatura de release.
- [ ] UI/UX em dispositivos reais, Windows/macOS/mobile.
- [ ] Atualização de links jurídicos com conteúdo Atlas aprovado.
- [ ] Publicação de release/merge/deploy autorizados.

**Não existe autorização implícita para publicar instaladores, instalar serviços ou alterar contas AWS/GWD.**
