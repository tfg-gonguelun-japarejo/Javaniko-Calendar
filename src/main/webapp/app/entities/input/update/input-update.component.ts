import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IInput, Input } from '../input.model';
import { InputService } from '../service/input.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { ICalendar } from 'app/entities/calendar/calendar.model';
import { CalendarService } from 'app/entities/calendar/service/calendar.service';

@Component({
  selector: 'jhi-input-update',
  templateUrl: './input-update.component.html',
})
export class InputUpdateComponent implements OnInit {
  isSaving = false;

  usuariosSharedCollection: IUsuario[] = [];
  calendarsSharedCollection: ICalendar[] = [];

  editForm = this.fb.group({
    id: [],
    comment: [],
    feelings: [null, [Validators.required]],
    inputDate: [null, [Validators.required]],
    usuario: [],
    calendar: [],
  });

  constructor(
    protected inputService: InputService,
    protected usuarioService: UsuarioService,
    protected calendarService: CalendarService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ input }) => {
      this.updateForm(input);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const input = this.createFromForm();
    if (input.id !== undefined) {
      this.subscribeToSaveResponse(this.inputService.update(input));
    } else {
      this.subscribeToSaveResponse(this.inputService.create(input));
    }
  }

  trackUsuarioById(index: number, item: IUsuario): number {
    return item.id!;
  }

  trackCalendarById(index: number, item: ICalendar): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInput>>): void {
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

  protected updateForm(input: IInput): void {
    this.editForm.patchValue({
      id: input.id,
      comment: input.comment,
      feelings: input.feelings,
      inputDate: input.inputDate,
      usuario: input.usuario,
      calendar: input.calendar,
    });

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing(this.usuariosSharedCollection, input.usuario);
    this.calendarsSharedCollection = this.calendarService.addCalendarToCollectionIfMissing(this.calendarsSharedCollection, input.calendar);
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing(usuarios, this.editForm.get('usuario')!.value))
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));

    this.calendarService
      .query()
      .pipe(map((res: HttpResponse<ICalendar[]>) => res.body ?? []))
      .pipe(
        map((calendars: ICalendar[]) =>
          this.calendarService.addCalendarToCollectionIfMissing(calendars, this.editForm.get('calendar')!.value)
        )
      )
      .subscribe((calendars: ICalendar[]) => (this.calendarsSharedCollection = calendars));
  }

  protected createFromForm(): IInput {
    return {
      ...new Input(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      feelings: this.editForm.get(['feelings'])!.value,
      inputDate: this.editForm.get(['inputDate'])!.value,
      usuario: this.editForm.get(['usuario'])!.value,
      calendar: this.editForm.get(['calendar'])!.value,
    };
  }
}
