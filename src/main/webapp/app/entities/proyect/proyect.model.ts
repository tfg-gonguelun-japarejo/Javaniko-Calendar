import * as dayjs from 'dayjs';
import { ISprint } from 'app/entities/sprint/sprint.model';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IProyect {
  id?: number;
  name?: string;
  description?: string;
  createdAt?: dayjs.Dayjs;
  isPrivate?: boolean;
  milestonesUrl?: string;
  sprints?: ISprint[];
  workspace?: IWorkspace;
  usuarios?: IUsuario[];
}

export class Proyect implements IProyect {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public createdAt?: dayjs.Dayjs,
    public isPrivate?: boolean,
    public milestonesUrl?: string,
    public sprints?: ISprint[],
    public workspace?: IWorkspace,
    public usuarios?: IUsuario[]
  ) {
    this.isPrivate = this.isPrivate ?? false;
  }
}

export function getProyectIdentifier(proyect: IProyect): number | undefined {
  return proyect.id;
}
