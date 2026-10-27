// Converte qualquer erro em uma página HTML (views/erro.hbs), em vez do JSON
// padrão do NestJS. Em erros 500, registra o detalhe no log do servidor.
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HtmlExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Erro');

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const mensagem =
      exception instanceof HttpException ? exception.message : 'Erro inesperado no servidor.';

    if (status >= 500) this.logger.error(exception);

    res.status(status).render('erro', {
      titulo: `Erro ${status} - Cadê?`,
      status,
      mensagem,
    });
  }
}
