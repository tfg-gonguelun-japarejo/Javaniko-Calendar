import dayjs from 'dayjs';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { Status } from 'app/entities/enumerations/status.model';
import { IInput } from '../input/input.model';

export interface ISprint {
  id?: number;
  title?: string | null;
  createdAt?: dayjs.Dayjs | null;
  dueOn?: dayjs.Dayjs | null;
  status?: Status | null;
  description?: string | null;
  inputs?: IInput[] | null;
  proyect?: IProyect | null;
}

export class Sprint implements ISprint {
  constructor(
    public id?: number,
    public title?: string | null,
    public createdAt?: dayjs.Dayjs | null,
    public dueOn?: dayjs.Dayjs | null,
    public status?: Status | null,
    public description?: string | null,
    public inputs?: IInput[] | null,
    public proyect?: IProyect | null
  ) {}
}

export function getSprintIdentifier(sprint: ISprint): number | undefined {
  return sprint.id;
}
