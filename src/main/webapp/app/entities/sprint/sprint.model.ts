import * as dayjs from 'dayjs';
import { ICalendar } from 'app/entities/calendar/calendar.model';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface ISprint {
  id?: number;
  sprint?: number | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  status?: Status | null;
  goal?: string | null;
  calendars?: ICalendar[] | null;
  proyect?: IProyect | null;
}

export class Sprint implements ISprint {
  constructor(
    public id?: number,
    public sprint?: number | null,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public status?: Status | null,
    public goal?: string | null,
    public calendars?: ICalendar[] | null,
    public proyect?: IProyect | null
  ) {}
}

export function getSprintIdentifier(sprint: ISprint): number | undefined {
  return sprint.id;
}
