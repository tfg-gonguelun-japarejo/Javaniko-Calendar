import { IProyect } from 'app/entities/proyect/proyect.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IWorkspace {
  id?: number;
  login?: string;
  repos_url?: string;
  description?: string;
  proyects?: IProyect[];
  usuarios?: IUsuario[];
}

export class Workspace implements IWorkspace {
  constructor(
    public id?: number,
    public login?: string,
    public repos_url?: string,
    public description?: string,
    public proyects?: IProyect[],
    public usuarios?: IUsuario[]
  ) {}
}

export function getWorkspaceIdentifier(workspace: IWorkspace): number | undefined {
  return workspace.id;
}
