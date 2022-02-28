import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISprint, Sprint } from '../sprint.model';
import { SprintService } from '../service/sprint.service';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { ProyectService } from 'app/entities/proyect/service/proyect.service';

@Component({
  selector: 'jhi-sprint-update',
  templateUrl: './sprint-update.component.html',
})
export class SprintUpdateComponent implements OnInit {
  isSaving = false;

  proyectsSharedCollection: IProyect[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    createdAt: [],
    dueOn: [],
    status: [],
    description: [],
    proyect: [],
  });

  constructor(
    protected sprintService: SprintService,
    protected proyectService: ProyectService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sprint }) => {
      this.updateForm(sprint);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sprint = this.createFromForm();
    if (sprint.id !== undefined) {
      this.subscribeToSaveResponse(this.sprintService.update(sprint));
    } else {
      this.subscribeToSaveResponse(this.sprintService.create(sprint));
    }
  }

  trackProyectById(index: number, item: IProyect): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISprint>>): void {
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

  protected updateForm(sprint: ISprint): void {
    this.editForm.patchValue({
      id: sprint.id,
      title: sprint.title,
      createdAt: sprint.createdAt,
      dueOn: sprint.dueOn,
      status: sprint.status,
      description: sprint.description,
      proyect: sprint.proyect,
    });

    this.proyectsSharedCollection = this.proyectService.addProyectToCollectionIfMissing(this.proyectsSharedCollection, sprint.proyect);
  }

  protected loadRelationshipsOptions(): void {
    this.proyectService
      .query()
      .pipe(map((res: HttpResponse<IProyect[]>) => res.body ?? []))
      .pipe(
        map((proyects: IProyect[]) => this.proyectService.addProyectToCollectionIfMissing(proyects, this.editForm.get('proyect')!.value))
      )
      .subscribe((proyects: IProyect[]) => (this.proyectsSharedCollection = proyects));
  }

  protected createFromForm(): ISprint {
    return {
      ...new Sprint(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      createdAt: this.editForm.get(['createdAt'])!.value,
      dueOn: this.editForm.get(['dueOn'])!.value,
      status: this.editForm.get(['status'])!.value,
      description: this.editForm.get(['description'])!.value,
      proyect: this.editForm.get(['proyect'])!.value,
    };
  }
}
