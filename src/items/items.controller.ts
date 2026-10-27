// CONTROLLER: recebe a requisição, chama o service e escolhe a view.
// Todas as URLs do sistema estão nesta classe.
// Usamos @Res() para renderizar as views com res.render(), igual ao padrão
// de MVC do NestJS com Handlebars.
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { STATUS_ITEM } from './item.model.js';
import { ItemsService } from './items.service.js';

// Mensagens de sucesso vindas da URL (ex.: /?msg=criado).
// Um código curto evita texto livre na URL.
const MENSAGENS: Record<string, string> = {
  criado: 'Item cadastrado com sucesso!',
  atualizado: 'Item atualizado com sucesso!',
  excluido: 'Item excluído com sucesso!',
};

// Monta o que o partial de campos precisa: valores, erros e opções de status.
function formulario(valores: Record<string, string>, erros: Record<string, string> = {}) {
  const statusAtual = valores.status || 'perdido';
  return {
    valores,
    erros,
    opcoesStatus: STATUS_ITEM.map((valor) => ({ valor, selecionado: valor === statusAtual })),
  };
}

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // GET / -> lista e formulário de cadastro
  @Get()
  async lista(@Query('msg') msg: string | undefined, @Res() res: Response) {
    return res.render('index', {
      titulo: 'Cadê? - Itens',
      itens: await this.itemsService.listar(),
      mensagem: msg ? (MENSAGENS[msg] ?? null) : null,
      form: formulario({}),
    });
  }

  // POST / -> cadastra. Se houver erro, mostra o formulário de novo com as mensagens.
  @Post()
  async criar(@Body() corpo: Record<string, string>, @Res() res: Response) {
    const resultado = await this.itemsService.criar(corpo);

    if (!resultado.ok) {
      return res.status(422).render('index', {
        titulo: 'Cadê? - Itens',
        itens: await this.itemsService.listar(),
        mensagem: null,
        form: formulario(resultado.valores, resultado.erros),
      });
    }
    return res.redirect('/?msg=criado');
  }

  // GET /editar/:id -> formulário preenchido
  @Get('editar/:id')
  async formEditar(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const item = await this.itemsService.buscarPorId(id);
    if (!item) throw new NotFoundException('Item não encontrado.');

    return res.render('editar', {
      titulo: 'Editar item - Cadê?',
      item,
      form: formulario(this.itemsService.itemParaFormulario(item)),
    });
  }

  // POST /editar/:id -> salva a alteração
  @Post('editar/:id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() corpo: Record<string, string>,
    @Res() res: Response,
  ) {
    const item = await this.itemsService.buscarPorId(id);
    if (!item) throw new NotFoundException('Item não encontrado.');

    const resultado = await this.itemsService.atualizar(id, corpo);
    if (!resultado.ok) {
      return res.status(422).render('editar', {
        titulo: 'Editar item - Cadê?',
        item,
        form: formulario(resultado.valores, resultado.erros),
      });
    }
    return res.redirect('/?msg=atualizado');
  }

  // POST /deletar/:id -> exclui (excluir sempre por POST, nunca por link GET)
  @Post('deletar/:id')
  async excluir(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const removido = await this.itemsService.excluir(id);
    if (!removido) throw new NotFoundException('Item não encontrado.');

    return res.redirect('/?msg=excluido');
  }
}
