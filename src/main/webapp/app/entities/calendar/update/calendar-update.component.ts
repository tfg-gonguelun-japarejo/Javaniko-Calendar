import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICalendar, Calendar } from '../calendar.model';
import { CalendarService } from '../service/calendar.service';
import { ISprint } from 'app/entities/sprint/sprint.model';
import { SprintService } from 'app/entities/sprint/service/sprint.service';

@Component({
  selector: 'jhi-calendar-update',
  templateUrl: './calendar-update.component.html',
})
export class CalendarUpdateComponent implements OnInit {
  isSaving = false;

  sprintsSharedCollection: ISprint[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    holidays: [],
    sprint: [],
  });

  constructor(
    protected calendarService: CalendarService,
    protected sprintService: SprintService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ calendar }) => {
      this.updateForm(calendar);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const calendar = this.createFromForm();
    if (calendar.id !== undefined) {
      this.subscribeToSaveResponse(this.calendarService.update(calendar));
    } else {
      this.subscribeToSaveResponse(this.calendarService.create(calendar));
    }
  }

  trackSprintById(index: number, item: ISprint): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICalendar>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(calendar: ICalendar): void {
    this.editForm.patchValue({
      id: calendar.id,
      name: calendar.name,
      holidays: calendar.holidays,
      sprint: calendar.sprint,
    });

    this.sprintsSharedCollection = this.sprintService.addSprintToCollectionIfMissing(this.sprintsSharedCollection, calendar.sprint);
  }

  protected loadRelationshipsOptions(): void {
    this.sprintService
      .query()
      .pipe(map((res: HttpResponse<ISprint[]>) => res.body ?? []))
      .pipe(map((sprints: ISprint[]) => this.sprintService.addSprintToCollectionIfMissing(sprints, this.editForm.get('sprint')!.value)))
      .subscribe((sprints: ISprint[]) => (this.sprintsSharedCollection = sprints));
  }

  protected createFromForm(): ICalendar {
    return {
      ...new Calendar(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      holidays: this.editForm.get(['holidays'])!.value,
      sprint: this.editForm.get(['sprint'])!.value,
    };
  }
}
