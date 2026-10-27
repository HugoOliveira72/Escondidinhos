// Ponto de entrada: configura o motor de views, a proteção CSRF e sobe o servidor.
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import hbs from 'hbs';
import { join } from 'node:path';
import { AppModule } from './app.module.js';
import { HtmlExceptionFilter } from './common/html-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Proteção CSRF nativa (NestJS 12.1+). Os formulários do próprio site passam sem token.
  app.enableCsrfProtection();

  app.useGlobalFilters(new HtmlExceptionFilter());

  // Motor de views: Handlebars, com as views na pasta views/ da raiz do projeto.
  app.setBaseViewsDir(join(import.meta.dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(import.meta.dirname, '..', 'views', 'partials'));

  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
