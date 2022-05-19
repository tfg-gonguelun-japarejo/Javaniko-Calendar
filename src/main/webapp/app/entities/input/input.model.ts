import * as dayjs from 'dayjs';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { ISprint } from '../sprint/sprint.model';

export interface IInput {
  id?: number;
  comment?: string;
  feelings?: number;
  inputDate?: dayjs.Dayjs;
  usuario?: IUsuario | null;
  sprint?: ISprint;
}

export class Input implements IInput {
  constructor(
    public id?: number,
    public comment?: string,
    public feelings?: number,
    public inputDate?: dayjs.Dayjs,
    public usuario?: IUsuario | null,
    public sprint?: ISprint
  ) {}
}

export function getInputIdentifier(input: IInput): number | undefined {
  return input.id;
}
