// DAO: todas as consultas da tabela "itens" ficam aqui.
// Nenhum outro arquivo usa o PrismaService diretamente.
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

// Dados já validados e prontos para gravar.
export type DadosGravacao = {
  nome: string;
  descricao: string | null;
  local: string | null;
  imagemUrl: string | null;
  status: string;
};

@Injectable()
export class ItemDao {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.item.findMany({ orderBy: { id: 'desc' } });
  }

  buscarPorId(id: number) {
    return this.prisma.item.findUnique({ where: { id } });
  }

  criar(dados: DadosGravacao) {
    return this.prisma.item.create({ data: dados });
  }

  atualizar(id: number, dados: DadosGravacao) {
    return this.prisma.item.update({ where: { id }, data: dados });
  }

  excluir(id: number) {
    return this.prisma.item.delete({ where: { id } });
  }
}
