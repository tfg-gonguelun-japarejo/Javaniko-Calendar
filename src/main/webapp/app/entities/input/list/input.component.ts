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

  constructor(protected inputService: InputService, private httpClient: HttpClient) {}

  loadAll(): void {
    this.isLoading = true;

    this.inputService.query().subscribe(
      (res: HttpResponse<IInput[]>) => {
        this.isLoading = false;
        this.inputs = res.body ?? [];
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
        } else {
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
    return result;
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInput): number {
    return item.id!;
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
}
