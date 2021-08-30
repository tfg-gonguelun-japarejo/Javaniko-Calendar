import { IProyect } from 'app/entities/proyect/proyect.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IWorkspace {
  id?: number;
  name?: string;
  description?: string;
  isPrivate?: boolean;
  proyects?: IProyect[] | null;
  usuarios?: IUsuario[] | null;
}

export class Workspace implements IWorkspace {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public isPrivate?: boolean,
    public proyects?: IProyect[] | null,
    public usuarios?: IUsuario[] | null
  ) {
    this.isPrivate = this.isPrivate ?? false;
  }
}

export function getWorkspaceIdentifier(workspace: IWorkspace): number | undefined {
  return workspace.id;
}
