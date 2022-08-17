import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IInput } from 'app/entities/input/input.model';
import { InputService } from 'app/entities/input/service/input.service';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { ProyectService } from 'app/entities/proyect/service/proyect.service';
import { SprintService } from 'app/entities/sprint/service/sprint.service';
import { ISprint } from 'app/entities/sprint/sprint.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { Usuario } from 'app/entities/usuario/usuario.model';
import { SessionStorageService } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '/';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? `${date.day}${this.DELIMITER}${date.month}${this.DELIMITER}${date.year}` : null;
  }
}

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? `${date.day}${this.DELIMITER}${date.month}${this.DELIMITER}${date.year}` : '';
  }
}

@Component({
  selector: 'jhi-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class StatisticsComponent implements OnInit {
  account: Account | null = null;
  authSubscription?: Subscription;
  usuario?: Usuario | null;
  proyects?: IProyect[] | null;
  sprints?: ISprint[] | null;
  inputsWeekUsuario?: IInput[] | null;
  inputsMonthUsuario?: IInput[] | null;
  inputsWeekProyect?: IInput[] | null;
  inputsMonthProyect?: IInput[] | null;
  inputsWeekSprint?: IInput[] | null;
  inputsMonthSprint?: IInput[] | null;
  proyectSelected?: IProyect | null;
  sprintSelected?: ISprint | null;
  locale?: string;
  calendar?: NgbDateStruct;
  dateInput?: Date;
  inputWeekUsuarioMode?: string;
  inputMonthUsuarioMode?: string;
  inputWeekProyectMode?: string;
  inputMonthProyectMode?: string;
  inputWeekSprintMode?: string;
  inputMonthSprintMode?: string;

  width: number = 700;
  height: number = 300;
  fitContainer: boolean = true;

  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  legendTitle = 'Leyenda';
  showXAxisLabel = true;
  xAxisLabel = 'Estados de ánimo';
  showYAxisLabel = true;
  yAxisLabel = 'Número de repeticiones por estado de ánimo';

  colorScheme = {
    domain: ['#20c997', '#9933ff', '#C7B42C', '#AAAAAA'],
  };

  multi?: any[];
  multi2?: any[];
  multi3?: any[];

  constructor(
    private accountService: AccountService,
    private usuarioService: UsuarioService,
    private proyectService: ProyectService,
    private sprintService: SprintService,
    private inputService: InputService,
    private customParser: NgbDateParserFormatter,
    private sessionStorage: SessionStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => {
      this.locale = this.sessionStorage.retrieve('locale') || 'es';
      if (this.locale === 'en') {
        this.xAxisLabel = 'Feelings';
        this.yAxisLabel = 'Number of appearences by each feeling';
        this.legendTitle = 'Legend';
      }
      this.account = account;
      this.usuarioService.findByUsername(account!.login).subscribe(usuario => {
        this.usuario = usuario.body;
        this.getGithubProyectsByUser(usuario.body!);
      });
    });
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  getGithubProyectsByUser(usuario: Usuario): void {
    this.proyectService.findProyectsByUsuarioId(usuario.id!).subscribe(proyects => {
      this.proyects = proyects.body;
    });
  }

  findSprintsByProyectId(proyect: IProyect, date: Date): void {
    this.inputsWeekProyect = [];
    this.inputsMonthProyect = [];
    const dueWeekDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 8);
    const dueMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate() + 1);
    this.sprintService.findSprintsByProyectId(proyect.id!).subscribe(sprints => {
      this.sprints = sprints.body;
      this.sprints!.forEach(sprint => {
        Promise.all([
          setTimeout(() => {
            this.inputService.findInputsBySprintIdAndDate(sprint.id!, date, dueWeekDate).subscribe(inputs => {
              this.inputsWeekProyect = [...this.inputsWeekProyect!, ...inputs.body!];
              this.inputWeekProyectMode = this.getMode(this.inputsWeekProyect);
            }),
              this.inputService.findInputsBySprintIdAndDate(sprint.id!, date, dueMonthDate).subscribe(inputs => {
                this.inputsMonthProyect = [...this.inputsMonthProyect!, ...inputs.body!];
                this.inputMonthProyectMode = this.getMode(this.inputsMonthProyect);
                this.multi2 = this.getInputsChart(this.inputsWeekProyect!, this.inputsMonthProyect);
              });
          }, 1000),
        ]);
      });
    });
  }

  findInputsBySprintId(sprint: ISprint, date: Date): void {
    this.inputsWeekSprint = [];
    this.inputsMonthSprint = [];
    const dueWeekDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 8);
    const dueMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate() + 1);
    Promise.all([
      setTimeout(() => {
        this.inputService.findInputsBySprintIdAndDate(sprint.id!, date, dueWeekDate).subscribe(inputs => {
          this.inputsWeekSprint = inputs.body;
          this.inputWeekSprintMode = this.getMode(inputs.body!);
        });
      }, 500),
      setTimeout(() => {
        this.inputService.findInputsBySprintIdAndDate(sprint.id!, date, dueMonthDate).subscribe(inputs => {
          this.inputsMonthSprint = inputs.body;
          this.inputMonthSprintMode = this.getMode(inputs.body!);
          this.multi3 = this.getInputsChart(this.inputsWeekSprint!, this.inputsMonthSprint!);
        });
      }, 1000),
    ]);
  }

  onChangeSelectSprint(): void {
    this.sprints = [];
    this.findSprintsByProyectId(this.proyectSelected!, this.dateInput!);
  }

  onChangeSprintDate(): void {
    this.findInputsBySprintId(this.sprintSelected!, this.dateInput!);
  }

  getInputsByUsuario(calendar: any): void {
    delete this.proyectSelected;
    delete this.sprintSelected;
    const date = calendar.split('/');
    const inputDate = new Date(date[2], date[1] - 1, date[0]);
    this.dateInput = inputDate;
    const dueWeekDate = new Date(date[2], date[1] - 1, parseInt(date[0], 10) + 8);
    const dueMonthDate = new Date(date[2], date[1], parseInt(date[0], 10) + 1);
    Promise.all([
      setTimeout(() => {
        this.inputService.findInputsByUsernameAndInputDate(this.usuario!.username!, inputDate, dueWeekDate).subscribe(inputs => {
          this.inputsWeekUsuario = inputs.body;
          this.inputWeekUsuarioMode = this.getMode(inputs.body!);
        }),
          this.inputService.findInputsByUsernameAndInputDate(this.usuario!.username!, inputDate, dueMonthDate).subscribe(inputs => {
            this.inputsMonthUsuario = inputs.body;
            this.inputMonthUsuarioMode = this.getMode(inputs.body!);
            this.multi = this.getInputsChart(this.inputsWeekUsuario!, this.inputsMonthUsuario!);
          });
      }, 1000),
    ]);
  }

  getInputsChart(inputsWeek: IInput[], inputsMonth: IInput[]): IInput[] {
    const result: IInput[] = [];
    let sadObject: any = {};
    let seriousObject: any = {};
    let happyObject: any = {};
    let dueDateWeek: string = '';
    let dueDateMonth: string = '';
    dueDateWeek = new Date(this.dateInput!.getFullYear(), this.dateInput!.getMonth(), this.dateInput!.getDate() + 7).toLocaleDateString();
    dueDateMonth = new Date(this.dateInput!.getFullYear(), this.dateInput!.getMonth() + 1, this.dateInput!.getDate()).toLocaleDateString();
    const sadInputsWeek = inputsWeek.filter(input => input.feelings === 0);
    const seriousInputsWeek = inputsWeek.filter(input => input.feelings === 5);
    const happyInputsWeek = inputsWeek.filter(input => input.feelings === 10);
    const sadInputsMonth = inputsMonth.filter(input => input.feelings === 0);
    const seriousInputsMonth = inputsMonth.filter(input => input.feelings === 5);
    const happyInputsMonth = inputsMonth.filter(input => input.feelings === 10);
    if (this.locale === 'es') {
      sadObject = {
        name: '☹',
        series: [
          {
            name: `Desde ${this.dateInput!.toLocaleDateString()} hasta ${dueDateWeek}`,
            value: sadInputsWeek.length,
          },
          {
            name: `Desde ${this.dateInput!.toLocaleDateString()} hasta ${dueDateMonth}`,
            value: sadInputsMonth.length,
          },
        ],
      };
      seriousObject = {
        name: '😐',
        series: [
          {
            name: `Desde ${this.dateInput!.toLocaleDateString()} hasta ${dueDateWeek}`,
            value: seriousInputsWeek.length,
          },
          {
            name: `Desde ${this.dateInput!.toLocaleDateString()} hasta ${dueDateMonth}`,
            value: seriousInputsMonth.length,
          },
        ],
      };
      happyObject = {
        name: '😁',
        series: [
          {
            name: `Desde ${this.dateInput!.toLocaleDateString()} hasta ${dueDateWeek}`,
            value: happyInputsWeek.length,
          },
          {
            name: `Desde ${this.dateInput!.toLocaleDateString()} hasta ${dueDateMonth}`,
            value: happyInputsMonth.length,
          },
        ],
      };
    } else {
      sadObject = {
        name: '☹',
        series: [
          {
            name: `From ${this.dateInput!.toLocaleDateString()} to ${dueDateWeek}`,
            value: sadInputsWeek.length,
          },
          {
            name: `From ${this.dateInput!.toLocaleDateString()} to ${dueDateMonth}`,
            value: sadInputsMonth.length,
          },
        ],
      };
      seriousObject = {
        name: '😐',
        series: [
          {
            name: `From ${this.dateInput!.toLocaleDateString()} to ${dueDateWeek}`,
            value: seriousInputsWeek.length,
          },
          {
            name: `From ${this.dateInput!.toLocaleDateString()} to ${dueDateMonth}`,
            value: seriousInputsMonth.length,
          },
        ],
      };
      happyObject = {
        name: '😁',
        series: [
          {
            name: `From ${this.dateInput!.toLocaleDateString()} to ${dueDateWeek}`,
            value: happyInputsWeek.length,
          },
          {
            name: `From ${this.dateInput!.toLocaleDateString()} to ${dueDateMonth}`,
            value: happyInputsMonth.length,
          },
        ],
      };
    }

    result.push(sadObject, seriousObject, happyObject);
    return result;
  }

  getMode(inputs: IInput[]): string {
    const counts = {};
    const sadEmoji = '☹';
    const seriousEmoji = '😐';
    const happyEmoji = '😁';
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i]['feelings'] || inputs[i]['feelings'] === 0) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        counts[inputs[i]['feelings']!] = (counts[inputs[i]['feelings']!] || 0) + 1;
      }
    }
    let max = 0;
    let values: any[] = [];
    for (const key in counts) {
      if (counts[key] > max) {
        max = counts[key];
        values = [key];
      } else if (counts[key] === max) {
        max = counts[key];
        values.push(key);
      }
    }
    values.forEach((value, index) => {
      if (values[index] === '0') {
        values[index] = sadEmoji;
      } else if (value === '5') {
        values[index] = seriousEmoji;
      } else if (value === '10') {
        values[index] = happyEmoji;
      }
    });

    if (this.locale === 'en') {
      return `The highest value is ${values.join(', ')} with a count of ${max}`;
    } else {
      return `El valor más alto es ${values.join(', ')} con un recuento de ${max}`;
    }
  }
}
