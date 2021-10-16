import * as dayjs from 'dayjs';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IInput {
  id?: number;
  comment?: string | null;
  feelings?: number;
  inputDate?: dayjs.Dayjs;
  usuario?: IUsuario | null;
}

export class Input implements IInput {
  constructor(
    public id?: number,
    public comment?: string | null,
    public feelings?: number,
    public inputDate?: dayjs.Dayjs,
    public usuario?: IUsuario | null
  ) {}
}

export function getInputIdentifier(input: IInput): number | undefined {
  return input.id;
}
