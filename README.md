# Cadê? - NestJS + Handlebars + Prisma + SQLite

Aplicação de achados e perdidos com renderização no servidor (SSR).
O navegador recebe HTML pronto; não há framework de frontend.

## Como criar e rodar

Requisito: Node.js 24 ou superior, e NestJS 12.1 ou superior (para a proteção CSRF nativa).

```bash
# Escolha npm como gerenciador de pacotes.
cd cade-mvc

npm install @nestjs/config @prisma/client @prisma/adapter-better-sqlite3 class-validator class-transformer hbs
npm install -D prisma@7 dotenv @types/hbs
```

Copie os arquivos deste pacote para dentro do projeto, substituindo os que existirem
(`src/app.module.ts`, `src/main.ts`, `prisma/`, `views/`, `.env`, `prisma.config.ts`).

Gere o banco e o client:

```bash
npx prisma init --datasource-provider sqlite --output ../src/generated/prisma
```
Se o comando criar `prisma7.config.ts`, mantenha **apenas um** arquivo de configuração
(o `prisma.config.ts` deste pacote ou o `prisma7.config.ts` criado). Dois arquivos juntos causam conflito.

```bash
npx prisma migrate dev --name criar_itens
npx prisma generate
npm run start:dev
```

Abra http://localhost:3000.

## Banco de dados

O `.env` define `DATABASE_URL="file:./dev.db"`. O Prisma CLI e a aplicação precisam abrir
o mesmo arquivo. Depois do `migrate dev`, confirme onde o `dev.db` foi criado. Se a página mostrar
erro de "no such table", os caminhos estão diferentes: ajuste `DATABASE_URL` para um caminho
que funcione nos dois casos. Este ponto não foi testado ao gerar o projeto.

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
3. `src/items/item.dto.ts`: inclua a regra do campo.
4. `src/items/item.dao.ts`: inclua o campo em `DadosGravacao`.
5. `src/items/items.service.ts`: inclua o campo em `paraGravacao` e em `itemParaFormulario`.
6. `views/partials/campos_item.hbs`: inclua o `<input>` com `value="{{valores.cor}}"`.
7. `views/index.hbs`: mostre o campo na lista, se for o caso.

**Mudar uma mensagem de erro:** `src/items/item.dto.ts`.
**Mudar a lista de status:** `src/items/item.model.ts`.
**Adicionar uma rota:** `src/items/items.controller.ts` (todas as rotas ficam ali).

## Regras que evitam erros comuns

- **Views só mostram dados.** Lógica (ifs de regra, consultas) fica no service ou no controller.
- **Só o DAO usa o `PrismaService`.** Controller e service não importam o Prisma.
- **Toda rota que altera dados usa POST.** Excluir por link (GET) é um risco.
- **Use `@Res()` com `res.render()`** nas rotas deste projeto. Sem `@Res()`, o NestJS
  responde com JSON e o HTML não é enviado.
- **Imports relativos terminam em `.js`** (o projeto usa ES modules), mesmo sendo arquivos `.ts`.

## Limitações conhecidas

- Não há login. O RF-0005 (área do administrador) ainda não foi implementado.
- O botão "Excluir" não pede confirmação.
- Um ID que não é número (`/editar/abc`) responde 400 com a página de erro.
- A proteção CSRF do NestJS depende do cabeçalho `Sec-Fetch-Site`, enviado pelos navegadores
  atuais em HTTPS ou em `localhost`.

## O que não foi testado

Este pacote foi gerado sem executar o projeto, porque o ambiente não tem acesso ao npm.
Pontos que merecem atenção na primeira execução:

- Caminho do banco SQLite (seção "Banco de dados").
- Conflito entre `prisma.config.ts` e `prisma7.config.ts`.
- Importação de `hbs` e `@types/hbs`, no modo ES modules.
- Comportamento do CSRF ao enviar o formulário pelo navegador.
- Mensagens de validação do class-validator.
