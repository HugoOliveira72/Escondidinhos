// MODEL (regras do domínio). Não importa o Prisma.
// Valores aceitos para o status. Para incluir um novo valor, altere aqui.
export const STATUS_ITEM = ['perdido', 'encontrado', 'devolvido'] as const;

export type StatusItem = (typeof STATUS_ITEM)[number];
