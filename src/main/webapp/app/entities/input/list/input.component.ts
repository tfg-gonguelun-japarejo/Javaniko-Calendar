/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { IInput } from '../input.model';
import { InputService } from '../service/input.service';
import { CalendarOptions } from '@fullcalendar/angular';
import { HttpClient } from '@angular/common/http';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef, ViewChild } from '@angular/core';
import { InputDeleteDialogComponent } from '../delete/input-delete-dialog.component';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-input',
  templateUrl: './input.component.html',
})
export class InputComponent implements OnInit {
  inputs?: IInput[];
  closeResult = '';
  isLoading = false;
  calendarOptions?: CalendarOptions;
  hasThisAuthority = false;

  @ViewChild('content')
  private content!: TemplateRef<any>;

  constructor(protected inputService: InputService, protected accountService: AccountService, private httpClient: HttpClient, private modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.inputService.query().subscribe(
      (res: HttpResponse<IInput[]>) => {
        this.isLoading = false;
        this.inputs = res.body ?? [];
        this.calendarOptions = {
          headerToolbar: {
            left: '',
            center: 'title',
            right: 'prev,next today',
          },
          initialView: 'dayGridMonth',
          eventContent: this.renderEventContent, // This will render the event with image
          eventColor: '#ffffff',
          contentHeight: 700,
          locale: 'es',
          firstDay: 1,
          buttonText: {
            today: 'Hoy',
          },
          eventClick: function (info) {
            alert('Event: ' + info.event.title);
            alert('Start: ' + info.event.start);

            // change the border color just for fun
            info.el.style.borderColor = 'red';
          },
          dayMaxEvents: 1,
        };
        this.calendarOptions.events = this.transformInputsInEvents();
      },
      () => {
        this.isLoading = false;
      }
    );
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
            title: myinput.comment,
            start: myinput.inputDate?.format(),
            end: myinput.inputDate?.format(),
            imageUrl: '../../../content/images/sad.png',
          };
          result.push(obj);
        } else if (myinput.feelings === 5) {
          obj = {
            title: myinput.comment,
            start: myinput.inputDate?.format(),
            end: myinput.inputDate?.format(),
            imageUrl: '../../../content/images/serious_emoji.png',
          };
          result.push(obj);
        } else if (myinput.feelings === 10) {
          obj = {
            title: myinput.comment,
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

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInput): number {
    return item.id!;
  }

  delete(input: IInput): void {
    const modalRef = this.modalService.open(InputDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.input = input;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    return this.accountService.hasAnyAuthority(authorities);
  }

  renderEventContent(eventInfo, createElement) {
    // eslint-disable-next-line no-var
    var innerHtml;
    // Check if event has image
    if (eventInfo.event._def.extendedProps.imageUrl) {
      // Store custom html code in variable
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      innerHtml =
        '<p>' +
        eventInfo.event._def.title +
        '</p>' +
        "<img style='width:100px;' src='" +
        eventInfo.event._def.extendedProps.imageUrl +
        "'>";
      // Event with rendering html
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      return (createElement = { html: '<div class="imageCalendar">' + innerHtml + '</div>' });
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  onSubmit(data) {
    console.log(data);
  }

  open(content): any {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      result => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `with: ${reason}`;
    }
  }
}
