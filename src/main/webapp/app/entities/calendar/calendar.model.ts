import { IInput } from 'app/entities/input/input.model';
import { ISprint } from 'app/entities/sprint/sprint.model';

export interface ICalendar {
  id?: number;
  name?: string | null;
  holidays?: number | null;
  inputs?: IInput[] | null;
  sprint?: ISprint | null;
}

export class Calendar implements ICalendar {
  constructor(
    public id?: number,
    public name?: string | null,
    public holidays?: number | null,
    public inputs?: IInput[] | null,
    public sprint?: ISprint | null
  ) {}
}

export function getCalendarIdentifier(calendar: ICalendar): number | undefined {
  return calendar.id;
}
