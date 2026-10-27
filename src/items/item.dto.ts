// VALIDAÇÃO: regras de entrada do formulário, com class-validator.
// Mensagens em português ficam aqui, num único lugar.
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { STATUS_ITEM } from './item.model.js';

// Remove espaços no início e no fim de textos.
const aparandoEspacos = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class ItemDto {
  @Transform(aparandoEspacos)
  @IsString({ message: 'Informe o nome do item.' })
  @IsNotEmpty({ message: 'Informe o nome do item.' })
  @MaxLength(120, { message: 'O nome deve ter no máximo 120 caracteres.' })
  nome!: string;

  @IsOptional()
  @Transform(aparandoEspacos)
  @IsString({ message: 'Descrição inválida.' })
  descricao?: string;

  @IsOptional()
  @Transform(aparandoEspacos)
  @IsString({ message: 'Local inválido.' })
  @MaxLength(120, { message: 'O local deve ter no máximo 120 caracteres.' })
  local?: string;

  @IsOptional()
  @Transform(aparandoEspacos)
  @IsString({ message: 'URL da imagem inválida.' })
  imagemUrl?: string;

  @IsIn(STATUS_ITEM, { message: 'Escolha um status válido.' })
  status!: string;
}
