/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { IInput } from '../input.model';
import { InputService } from '../service/input.service';
import { InputDeleteDialogComponent } from '../delete/input-delete-dialog.component';
import { CalendarOptions } from '@fullcalendar/angular';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { InputUpdateComponent } from '../update/input-update.component';

@Component({
  selector: 'jhi-input',
  templateUrl: './input.component.html',
})
export class InputComponent implements OnInit {
  calendarOptions: CalendarOptions = {
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
    editable: true,
    firstDay: 1,
    buttonText: {
      today: 'Hoy',
    },
    eventClick: function (info) {
      alert('Event: ' + info.event.title);
      alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
      alert('View: ' + info.view.type);

      // change the border color just for fun
      info.el.style.borderColor = 'red';
    },
    events: [
      { date: '2021-09-15', imageUrl: '../../../content/images/happy_emoji.png' },
      { date: '2021-09-14', imageUrl: '../../../content/images/serious_emoji.png' },
      { date: '2021-09-16', imageUrl: '../../../content/images/sad.png' },
    ],
  };

  inputs?: IInput[];
  closeResult = '';
  isLoading = false;

  inputDate?: Date;
  feelings?: number;
  comment?: string;

  constructor(protected inputService: InputService, protected modalService: NgbModal, private httpClient: HttpClient) {}

  loadAll(): void {
    this.isLoading = true;

    this.inputService.query().subscribe(
      (res: HttpResponse<IInput[]>) => {
        this.isLoading = false;
        this.inputs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
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

  open(content) {
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  onSubmit(data) {
    console.log(data);
  }
}
