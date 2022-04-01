import dayjs from 'dayjs';
import { ISprint } from 'app/entities/sprint/sprint.model';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IProyect {
  id?: number;
  name?: string;
  description?: string;
  createdAt?: dayjs.Dayjs | null;
  isPrivate?: boolean;
  sprints?: ISprint[] | null;
  workspace?: IWorkspace | null;
  usuarios?: IUsuario[] | null;
}

export class Proyect implements IProyect {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public createdAt?: dayjs.Dayjs | null,
    public isPrivate?: boolean,
    public sprints?: ISprint[] | null,
    public workspace?: IWorkspace | null,
    public usuarios?: IUsuario[] | null
  ) {
    this.isPrivate = this.isPrivate ?? false;
  }
}

export function getProyectIdentifier(proyect: IProyect): number | undefined {
  return proyect.id;
}
