import * as dayjs from 'dayjs';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { Status } from 'app/entities/enumerations/status.model';
import { IInput } from '../input/input.model';

export interface ISprint {
  id?: number;
  title?: string;
  createdAt?: dayjs.Dayjs;
  dueOn?: dayjs.Dayjs;
  status?: Status;
  description?: string;
  inputs?: IInput[];
  proyect?: IProyect;
}

export class Sprint implements ISprint {
  constructor(
    public id?: number,
    public title?: string,
    public createdAt?: dayjs.Dayjs,
    public dueOn?: dayjs.Dayjs,
    public status?: Status,
    public description?: string,
    public inputs?: IInput[],
    public proyect?: IProyect
  ) {}
}

export function getSprintIdentifier(sprint: ISprint): number | undefined {
  return sprint.id;
}
