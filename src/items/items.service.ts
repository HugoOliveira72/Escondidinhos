// SERVICE: regras de negócio. Valida, decide e chama o DAO.
// Não conhece HTTP nem HTML.
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Item } from '../generated/prisma/client.js';
import { ItemDao, type DadosGravacao } from './item.dao.js';
import { ItemDto } from './item.dto.js';

// Resultado da validação: ok com os dados, ou os erros por campo.
type ResultadoValidacao =
  | { ok: true; dados: ItemDto }
  | { ok: false; erros: Record<string, string>; valores: Record<string, string> };

async function validarEntrada(corpo: Record<string, string>): Promise<ResultadoValidacao> {
  const dto = plainToInstance(ItemDto, corpo);
  const erros = await validate(dto);

  if (erros.length === 0) return { ok: true, dados: dto };

  // Uma mensagem por campo, a primeira que falhar.
  const porCampo: Record<string, string> = {};
  for (const erro of erros) {
    porCampo[erro.property] = Object.values(erro.constraints ?? {})[0] ?? 'Valor inválido.';
  }
  return { ok: false, erros: porCampo, valores: corpo };
}

// Campos opcionais vazios viram null no banco.
function paraGravacao(dto: ItemDto): DadosGravacao {
  return {
    nome: dto.nome,
    descricao: dto.descricao || null,
    local: dto.local || null,
    imagemUrl: dto.imagemUrl || null,
    status: dto.status,
  };
}

@Injectable()
export class ItemsService {
  constructor(private readonly itemDao: ItemDao) {}

  listar() {
    return this.itemDao.listar();
  }

  buscarPorId(id: number) {
    return this.itemDao.buscarPorId(id);
  }

  // Valores do item em texto, para preencher o formulário de edição.
  itemParaFormulario(item: Item): Record<string, string> {
    return {
      nome: item.nome,
      descricao: item.descricao ?? '',
      local: item.local ?? '',
      imagemUrl: item.imagemUrl ?? '',
      status: item.status,
    };
  }

  async criar(corpo: Record<string, string>): Promise<ResultadoValidacao | { ok: true }> {
    const entrada = await validarEntrada(corpo);
    if (!entrada.ok) return entrada;

    await this.itemDao.criar(paraGravacao(entrada.dados));
    return { ok: true };
  }

  async atualizar(id: number, corpo: Record<string, string>): Promise<ResultadoValidacao | { ok: true }> {
    const entrada = await validarEntrada(corpo);
    if (!entrada.ok) return entrada;

    await this.itemDao.atualizar(id, paraGravacao(entrada.dados));
    return { ok: true };
  }

  // Devolve false se o item não existe.
  async excluir(id: number): Promise<boolean> {
    const existente = await this.itemDao.buscarPorId(id);
    if (!existente) return false;

    await this.itemDao.excluir(id);
    return true;
  }
}
