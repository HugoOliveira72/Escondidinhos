# Cadê? - NestJS + Handlebars + Prisma + SQLite

Aplicação de achados e perdidos com renderização no servidor (SSR).
O navegador recebe HTML pronto; não há framework de frontend.

## Requisitos

- Node.js 24 ou superior (`node -v`)
- npm (vem com o Node.js)

## Como rodar o projeto (após clonar o repositório)

```bash
git clone <url-do-repositorio>
cd cade-mvc
npm install
cp .env.example .env              # Windows (PowerShell): Copy-Item .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Abra http://localhost:3000 no navegador.

### O que cada comando faz

| Comando | Por que é necessário |
|---|---|
| `npm install` | Instala todas as dependências listadas em `package.json`. A pasta `node_modules` não vai para o repositório. |
| `cp .env.example .env` | Cria o arquivo de configuração local com `DATABASE_URL`. O `.env` não vai para o repositório, por isso cada pessoa cria o seu a partir do `.env.example`. |
| `npx prisma generate` | Gera o client do Prisma em `src/generated/prisma`. Essa pasta não vai para o repositório. |
| `npx prisma migrate deploy` | Cria o arquivo `dev.db` e aplica as migrations que já estão em `prisma/migrations/`. Não cria migrations novas. |
| `npm run start:dev` | Sobe o servidor em modo de desenvolvimento e reinicia ao salvar um arquivo. |

### Como confirmar que deu certo

- O terminal mostra `Nest application successfully started`.
- A página http://localhost:3000 mostra o título "Cadê?" e a mensagem "Nenhum item cadastrado.".
- Ao cadastrar um item, a lista é atualizada e aparece a mensagem "Item cadastrado com sucesso!".

### Erros comuns

- **`Configuration key "DATABASE_URL" does not exist`**: o arquivo `.env` não existe. Rode `cp .env.example .env` (ou `Copy-Item .env.example .env` no PowerShell) e suba o servidor de novo.
- **`no such table: itens`**: o banco não tem a tabela. Rode `npx prisma migrate deploy`.
- **`Cannot find module '../generated/prisma/client.js'`**: o client não foi gerado. Rode `npx prisma generate`.
- **`EADDRINUSE` (porta em uso)**: outro programa usa a porta 3000. Rode com outra porta, por exemplo `PORT=3001 npm run start:dev` (no PowerShell: `$env:PORT=3001; npm run start:dev`).

## Como o projeto foi criado do zero

Esta seção é só para referência, para quem vai criar um projeto parecido. Quem só quer
rodar o projeto não precisa executar estes comandos.

```bash
npx @nestjs/cli@latest new cade-mvc      # escolha npm como gerenciador de pacotes
cd cade-mvc
npm install @nestjs/config @prisma/client @prisma/adapter-better-sqlite3 class-validator class-transformer hbs
npm install -D prisma@7 dotenv @types/hbs
```

Depois disso, os arquivos deste projeto foram criados ou substituídos (`src/`, `views/`,
`prisma/`, `prisma.config.ts`, `.env.example`). Não é necessário rodar `prisma init`: o
`schema.prisma` e o `prisma.config.ts` já existem no projeto, e o `init` pode sobrescrevê-los.

## Banco de dados

- Arquivo: `dev.db`, criado pelo `prisma migrate deploy` ou `prisma migrate dev`.
- Configuração: a variável `DATABASE_URL` no `.env` (valor padrão: `file:./dev.db`).
- Migrations: ficam em `prisma/migrations/` e vão para o repositório. Elas são o histórico
  da tabela e é com elas que o banco de cada pessoa é criado.
- Para zerar os dados locais: pare o servidor, apague o `dev.db` e rode `npx prisma migrate deploy`.

## Mapa das camadas (MVC no NestJS)

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| Model | `prisma/schema.prisma` | Estrutura da tabela |
| Model | `src/items/item.model.ts` | Constantes e regras do domínio |
| DTO / Validator | `src/items/item.dto.ts` | Regras e mensagens de validação |
| DAO | `src/items/item.dao.ts` | Todas as consultas ao banco |
| Service | `src/items/items.service.ts` | Regras de negócio: valida e chama o DAO |
| Controller | `src/items/items.controller.ts` | Rotas (URLs), escolhe a view |
| View | `views/*.hbs` e `views/partials/*.hbs` | HTML gerado no servidor |
| Conexão | `src/prisma/*.ts` | Conexão única com o banco |
| Erros | `src/common/html-exception.filter.ts` | Erros em página HTML |

Fluxo de cadastro: formulário `POST /` → controller `criar` → service `criar` (valida com
`item.dto.ts`) → DAO `criar` → Prisma → SQLite. Se houver erro, o controller renderiza o
formulário de novo com as mensagens (status 422).

## Como mudar algo com segurança

**Adicionar um campo** (exemplo: `cor`):

1. `prisma/schema.prisma`: inclua o campo no model `Item`.
2. `npx prisma migrate dev --name adicionar_cor` e `npx prisma generate`.
3. Confira o arquivo de migration criado em `prisma/migrations/` e envie-o ao repositório.
4. `src/items/item.dto.ts`: inclua a regra do campo.
5. `src/items/item.dao.ts`: inclua o campo em `DadosGravacao`.
6. `src/items/items.service.ts`: inclua o campo em `paraGravacao` e em `itemParaFormulario`.
7. `views/partials/campos_item.hbs`: inclua o `<input>` com `value="{{valores.cor}}"`.
8. `views/index.hbs`: mostre o campo na lista, se for o caso.

**Mudar uma mensagem de erro:** `src/items/item.dto.ts`.
**Mudar a lista de status:** `src/items/item.model.ts`.
**Adicionar uma rota:** `src/items/items.controller.ts` (todas as rotas ficam ali).

Use `migrate dev` apenas para criar migrations novas. Para aplicar migrations que outra
pessoa já criou, use `migrate deploy`.

## Regras que evitam erros comuns

- **Views só mostram dados.** Lógica (ifs de regra, consultas) fica no service ou no controller.
- **Só o DAO usa o `PrismaService`.** Controller e service não importam o Prisma.
- **Toda rota que altera dados usa POST.** Excluir por link (GET) é um risco.
- **Use `@Res()` com `res.render()`** nas rotas deste projeto. Sem `@Res()`, o NestJS
  responde com JSON e o HTML não é enviado.
- **Imports relativos terminam em `.js`** (o projeto usa ES modules), mesmo sendo arquivos `.ts`.
- **Não edite a pasta `dist/`.** Ela é gerada pelo build e é recriada a cada compilação.

## Arquivos que não vão para o repositório

Estes itens estão no `.gitignore` e são gerados ou criados localmente:

- `node_modules/`: criada pelo `npm install`.
- `dist/`: criada pelo build.
- `.env`: criado a partir do `.env.example`.
- `src/generated/`: criada pelo `prisma generate`.
- `*.db`: o banco SQLite local.

## Limitações conhecidas

- Não há login. O RF-0005 (área do administrador) ainda não foi implementado.
- O botão "Excluir" não pede confirmação.
- Um ID que não é número (`/editar/abc`) responde 400 com a página de erro.
- A proteção CSRF do NestJS depende do cabeçalho `Sec-Fetch-Site`, enviado pelos navegadores
  atuais em HTTPS ou em `localhost`.

## Testes

Ainda não há testes automatizados. O projeto usa Vitest (ESM), configurado pelo `nest new`
em `vitest.config.ts`. Para executar, use `npm test`.
