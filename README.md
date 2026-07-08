# Meu Aprendizado

Aplicativo desktop (Electron) para **organizar aprendizados em árvores de tópicos**, com status, anotações e um grafo arrastável estilo mapa mental. Uso individual, local — sem autenticação e sem servidor.

## O que o app faz

- **Aprendizados**: listagem em cards (título, descrição e barra de progresso de tópicos concluídos), com criação, edição e exclusão.
- **Detalhe do aprendizado**: árvore de tópicos exibida como um grafo arrastável — cada tópico é um card que pode ser posicionado livremente (a posição fica salva), com linhas de conexão que saem sempre pelo lado mais lógico em relação à posição do card pai/filho. O card muda de cor conforme o status (`não iniciado` → `em andamento` → `concluído`), e cada tópico pode ter anotações breves, subtópicos e ser editado/excluído (com aviso ao excluir um tópico que tem subtópicos).
- **Configurações**: informações sobre o app e exportação/importação de todos os dados (aprendizados + árvores completas) em um arquivo JSON de backup.

Os dados são armazenados localmente em um banco **SQLite** (`meu-aprendizado.db`), salvo na pasta de dados do usuário do Electron — não há servidor nem sincronização em nuvem.

## Como executar

Pré-requisitos: Node.js e npm instalados.

```bash
# instalar dependências (recompila o better-sqlite3 para o Electron automaticamente)
npm install

# rodar em modo desenvolvimento (abre a janela do Electron com hot reload)
npm run dev

# rodar apenas o renderer (UI) no navegador, sem abrir o Electron
npm run dev:renderer

# gerar o build de produção (compila main/preload/renderer para out/)
npm run build

# rodar o build de produção já compilado (sem servidor de dev)
npm run preview

# build + empacotar o instalador .exe (NSIS) via electron-builder, gerado em dist/
npm run dist:win

# lint e formatação
npm run lint
npm run format
npm run format:check
```

## Estrutura do projeto

```
src/
├── main/                          # Processo principal do Electron (Node.js, acesso a banco/arquivos)
│   ├── index.ts                    # Bootstrap: cria a janela, inicializa o banco e registra os handlers de IPC
│   ├── db/
│   │   ├── connection.ts            # Conexão SQLite, schema das tabelas e migrações incrementais
│   │   ├── aprendizadosRepository.ts    # CRUD de aprendizados, com progresso agregado (tópicos concluídos/total)
│   │   ├── nosAprendizadoRepository.ts  # CRUD dos tópicos da árvore (parent_id, status, anotações, posição no grafo)
│   │   └── backupRepository.ts      # Exportação/importação de todos os dados (backup em JSON)
│   ├── ipc/
│   │   ├── registerIpc.ts           # Liga os canais de IPC aos repositórios
│   │   └── backupHandlers.ts        # Handlers de exportação/importação de dados (diálogos de arquivo, com validação zod)
│   ├── schemas/                     # Validação de entrada dos IPCs por domínio (zod)
│   ├── errors/
│   │   └── AppError.ts              # Erro tipado (status + mensagem) repassado ao renderer
│   └── utils/                       # parseId (valida IDs) e validate/parseOrThrow (parse zod)
│
├── preload/
│   └── index.ts                     # Expõe com segurança `window.api` para o renderer (contextBridge)
│
├── shared/                          # Código/tipos compartilhados entre main, preload e renderer
│   ├── ipc/                          # Constantes de canais de IPC e contrato da API exposta
│   └── types/                        # Aprendizado, NoAprendizado, BackupData
│
└── renderer/                        # Interface React (roda no Chromium, sem acesso direto ao Node)
    ├── index.html
    └── src/
        ├── main.tsx                  # Ponto de entrada do React (HashRouter + tema)
        ├── App.tsx                   # Rotas (react-router-dom): Aprendizados, AprendizadoDetail, Settings
        ├── routes.ts                 # Constantes de caminho das rotas
        ├── api/client.ts             # Wrapper das chamadas IPC (desembrulha erros)
        ├── theme/                    # Tema do MUI e contexto de modo claro/escuro
        ├── contexts/                 # AprendizadosContext, SnackbarContext
        ├── components/                # Layout, ConfirmDialog, AppSnackbar
        ├── hooks/
        │   ├── aprendizados/          # Schema/hook do formulário e CRUD de aprendizados
        │   ├── nos/                    # buildNoTree, layoutNoGraph (dagre), useNoTree, useNoForm
        │   └── settings/                # useDataTransfer (export/import)
        └── pages/
            ├── aprendizados/           # Listagem em cards
            ├── aprendizado-detail/     # Grafo de tópicos (React Flow + arestas flutuantes)
            └── settings/
```

## Stack técnica

- **Electron 35** + **electron-vite** (build de main/preload/renderer)
- **React 19** + **React Router 7**
- **MUI (Material UI) 6** + Emotion para estilização
- **@xyflow/react** + **@dagrejs/dagre** para o grafo de tópicos (layout hierárquico automático, arestas flutuantes calculadas pela posição relativa dos cards, arrastar com posição persistida)
- **react-hook-form** + **zod** para formulários e validação
- **better-sqlite3** para persistência local (SQLite, WAL)
- **electron-builder** para gerar o instalador Windows (NSIS)
- **TypeScript**, **ESLint** e **Prettier**
