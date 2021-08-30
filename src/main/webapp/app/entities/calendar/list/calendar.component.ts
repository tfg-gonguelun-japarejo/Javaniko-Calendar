import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICalendar } from '../calendar.model';
import { CalendarService } from '../service/calendar.service';
import { CalendarDeleteDialogComponent } from '../delete/calendar-delete-dialog.component';

@Component({
  selector: 'jhi-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  calendars?: ICalendar[];
  isLoading = false;

  constructor(protected calendarService: CalendarService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.calendarService.query().subscribe(
      (res: HttpResponse<ICalendar[]>) => {
        this.isLoading = false;
        this.calendars = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICalendar): number {
    return item.id!;
  }

  delete(calendar: ICalendar): void {
    const modalRef = this.modalService.open(CalendarDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.calendar = calendar;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
