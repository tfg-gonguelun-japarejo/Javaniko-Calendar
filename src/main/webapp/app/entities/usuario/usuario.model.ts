import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IInput } from 'app/entities/input/input.model';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { IProyect } from 'app/entities/proyect/proyect.model';

export interface IUsuario {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  birthdate?: dayjs.Dayjs;
  phone?: number;
  user?: IUser;
  inputs?: IInput[];
  workspaces?: IWorkspace[];
  proyects?: IProyect[];
}

export class Usuario implements IUsuario {
  constructor(
    public id?: number,
    public username?: string,
    public password?: string,
    public email?: string,
    public birthdate?: dayjs.Dayjs,
    public phone?: number,
    public user?: IUser,
    public inputs?: IInput[],
    public workspaces?: IWorkspace[],
    public proyects?: IProyect[]
  ) {}
}

export function getUsuarioIdentifier(usuario: IUsuario): number | undefined {
  return usuario.id;
}
