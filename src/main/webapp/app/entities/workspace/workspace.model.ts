import { IProyect } from 'app/entities/proyect/proyect.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IWorkspace {
  id?: number;
  login?: string;
  repos_url?: string | null;
  description?: string;
  proyects?: IProyect[] | null;
  usuarios?: IUsuario[] | null;
}

export class Workspace implements IWorkspace {
  constructor(
    public id?: number,
    public login?: string,
    public repos_url?: string | null,
    public description?: string,
    public proyects?: IProyect[] | null,
    public usuarios?: IUsuario[] | null
  ) {}
}

export function getWorkspaceIdentifier(workspace: IWorkspace): number | undefined {
  return workspace.id;
}
