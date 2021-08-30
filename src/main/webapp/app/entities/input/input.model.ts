import * as dayjs from 'dayjs';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { ICalendar } from 'app/entities/calendar/calendar.model';

export interface IInput {
  id?: number;
  comment?: string | null;
  feelings?: number;
  inputDate?: dayjs.Dayjs;
  usuario?: IUsuario | null;
  calendar?: ICalendar | null;
}

export class Input implements IInput {
  constructor(
    public id?: number,
    public comment?: string | null,
    public feelings?: number,
    public inputDate?: dayjs.Dayjs,
    public usuario?: IUsuario | null,
    public calendar?: ICalendar | null
  ) {}
}

export function getInputIdentifier(input: IInput): number | undefined {
  return input.id;
}
