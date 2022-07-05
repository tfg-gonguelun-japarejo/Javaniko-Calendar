/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { IInput } from '../input.model';
import { InputService } from '../service/input.service';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { HttpClient } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InputDeleteDialogComponent } from '../delete/input-delete-dialog.component';
import { AccountService } from 'app/core/auth/account.service';
import { SessionStorageService } from 'ngx-webstorage';
import { Tooltip } from 'bootstrap';
import dayjs from 'dayjs';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { Usuario } from 'app/entities/usuario/usuario.model';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { ISprint } from 'app/entities/sprint/sprint.model';
import { SprintService } from 'app/entities/sprint/service/sprint.service';
import { ProyectService } from 'app/entities/proyect/service/proyect.service';

@Component({
  selector: 'jhi-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  inputs?: IInput[];
  usuario?: Usuario | null;
  proyects?: IProyect[] | null;
  sprints?: ISprint[] | null;
  isLoading = false;
  calendarOptions?: CalendarOptions;
  hasThisAuthority = false;
  locale?: string;
  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;
  title?: string;
  proyectSelected?: IProyect | null;
  sprintSelected?: ISprint | null;

  constructor(
    protected inputService: InputService,
    protected usuarioService: UsuarioService,
    protected accountService: AccountService,
    protected sprintService: SprintService,
    protected proyectService: ProyectService,
    private httpClient: HttpClient,
    private sessionStorage: SessionStorageService,
    private modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.inputService.query().subscribe(
      (res: HttpResponse<IInput[]>) => {
        this.isLoading = false;
        this.inputs = res.body ?? [];

        this.accountService.getAuthenticationState().subscribe(account => {
          if (account) {
            this.usuarioService.findByUsername(account.login).subscribe(usuario => {
              this.usuario = usuario.body;
              this.getGithubProyectsByUser(usuario.body!);
            });
          }
        });

        this.loadCalendar();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadCalendar(): void {
    this.calendarOptions = {
      headerToolbar: false,
      initialView: 'dayGridMonth',
      eventContent: this.renderEventContent,
      eventColor: '#ffffff',
      contentHeight: 700,
      firstDay: 1,
      eventDidMount: this.renderEventTooltip,
      dayMaxEvents: 1,
    };

    this.title = this.calendarComponent!.getApi().view.title;

    this.calendarOptions.events = this.transformInputsInEvents();

    this.locale = this.sessionStorage.retrieve('locale');

    if (this.locale === 'es') {
      this.calendarOptions.locale = 'es';
      this.calendarOptions.buttonText = {
        today: 'Hoy',
      };
    } else {
      this.calendarOptions.locale = 'en';
      this.calendarOptions.buttonText = {
        today: 'Today',
      };
    }
  }

  getPreviousMonth(calendarComponent): void {
    calendarComponent.getApi().prev();
    this.title = calendarComponent.getApi().view.title;
  }

  getNextMonth(calendarComponent): void {
    calendarComponent.getApi().next();
    this.title = calendarComponent.getApi().view.title;
  }

  getCurrentMonth(calendarComponent): void {
    calendarComponent.getApi().today();
    this.title = calendarComponent.getApi().view.title;
  }

  transformInputsInEvents(): any {
    const result: any[] = [];
    let obj: any;
    if (this.inputs) {
      for (let i = 0; i < this.inputs.length; i++) {
        for (let j = 0; j < this.inputs.length; j++) {
          if (this.inputs[i].inputDate === this.inputs[j].inputDate && i !== j) {
            this.inputs.splice(j, 1);
            j = 0;
          }
        }
      }
      for (const myinput of this.inputs) {
        if (myinput.feelings === 0) {
          obj = {
            title: `${myinput.usuario!.username!}: ${myinput.comment!}`,
            start: myinput.inputDate?.format(),
            end: myinput.inputDate?.format(),
            imageUrl: '../../../content/images/sad.png',
          };
          result.push(obj);
        } else if (myinput.feelings === 5) {
          obj = {
            title: `${myinput.usuario!.username!}: ${myinput.comment!}`,
            start: myinput.inputDate?.format(),
            end: myinput.inputDate?.format(),
            imageUrl: '../../../content/images/serious_emoji.png',
          };
          result.push(obj);
        } else if (myinput.feelings === 10) {
          obj = {
            title: `${myinput.usuario!.username!}: ${myinput.comment!}`,
            start: myinput.inputDate?.format(),
            end: myinput.inputDate?.format(),
            imageUrl: '../../../content/images/happy_emoji.png',
          };
          result.push(obj);
        }
      }
    }
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result.length; j++) {
        if (result[i].start === result[j].start && i !== j) {
          result.splice(j, 1);
          j = 0;
        }
      }
    }
    return result;
  }

  getGithubProyectsByUser(usuario: Usuario): void {
    this.proyectService.findProyectsByUsuarioId(usuario.id!).subscribe(proyects => {
      this.proyects = proyects.body;
    });
  }

  findSprintsByProyectId(proyect: IProyect): void {
    this.sprintService.findSprintsByProyectId(proyect.id!).subscribe(sprints => {
      this.sprints = sprints.body;
    });
  }

  onChangeSelectSprint(): void {
    this.findSprintsByProyectId(this.proyectSelected!);
  }

  onChangeSprintDate(calendarComponent): void {
    calendarComponent.getApi().gotoDate(this.sprintSelected?.createdAt);
    this.title = calendarComponent.getApi().view.title;
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInput): number {
    return item.id!;
  }

  delete(input: IInput): void {
    const modalRef = this.modalService.open(InputDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.input = input;
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    return this.accountService.hasAnyAuthority(authorities);
  }

  renderEventContent(eventInfo): any {
    const innerHtml = `<img class='eventImage' style='width: 3rem; max-width: 100%; max-height: 100%' src='${eventInfo.event._def.extendedProps.imageUrl}'>`;
    return { html: `<div class="imageCalendar" style="margin-left: auto; margin-right: auto">${innerHtml}</div>` };
  }

  renderEventTooltip(info): any {
    const fecha = dayjs(info.event.startStr).format('D/MMM/YYYY');
    return new Tooltip(info.el, {
      title: `<b>${info.event.title}</br>Fecha → ${fecha}</b>`,
      trigger: 'hover',
      html: true,
    });
  }
}
