import dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IInput } from 'app/entities/input/input.model';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { IProyect } from 'app/entities/proyect/proyect.model';

export interface IUsuario {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  birthdate?: dayjs.Dayjs | null;
  phone?: number | null;
  user?: IUser | null;
  inputs?: IInput[] | null;
  workspaces?: IWorkspace[] | null;
  proyects?: IProyect[] | null;
}

export class Usuario implements IUsuario {
  constructor(
    public id?: number,
    public username?: string,
    public password?: string,
    public email?: string,
    public birthdate?: dayjs.Dayjs | null,
    public phone?: number | null,
    public user?: IUser | null,
    public inputs?: IInput[] | null,
    public workspaces?: IWorkspace[] | null,
    public proyects?: IProyect[] | null
  ) {}
}

export function getUsuarioIdentifier(usuario: IUsuario): number | undefined {
  return usuario.id;
}
