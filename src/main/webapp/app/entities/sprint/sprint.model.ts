import * as dayjs from 'dayjs';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface ISprint {
  id?: number;
  title?: string;
  createdAt?: dayjs.Dayjs | null;
  dueOn?: dayjs.Dayjs | null;
  status?: Status | null;
  description?: string;
  proyect?: IProyect | null;
}

export class Sprint implements ISprint {
  constructor(
    public id?: number,
    public title?: string,
    public createdAt?: dayjs.Dayjs | null,
    public dueOn?: dayjs.Dayjs | null,
    public status?: Status | null,
    public description?: string,
    public proyect?: IProyect | null
  ) {}
}

export function getSprintIdentifier(sprint: ISprint): number | undefined {
  return sprint.id;
}
