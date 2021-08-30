import * as dayjs from 'dayjs';
import { ISprint } from 'app/entities/sprint/sprint.model';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IProyect {
  id?: number;
  name?: string;
  description?: string;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  sprints?: ISprint[] | null;
  workspace?: IWorkspace | null;
  usuarios?: IUsuario[] | null;
}

export class Proyect implements IProyect {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public sprints?: ISprint[] | null,
    public workspace?: IWorkspace | null,
    public usuarios?: IUsuario[] | null
  ) {}
}

export function getProyectIdentifier(proyect: IProyect): number | undefined {
  return proyect.id;
}
