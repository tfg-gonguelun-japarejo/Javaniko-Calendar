import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProyect, Proyect } from '../proyect.model';
import { ProyectService } from '../service/proyect.service';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { WorkspaceService } from 'app/entities/workspace/service/workspace.service';

@Component({
  selector: 'jhi-proyect-update',
  templateUrl: './proyect-update.component.html',
})
export class ProyectUpdateComponent implements OnInit {
  isSaving = false;

  workspacesSharedCollection: IWorkspace[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [null, [Validators.required]],
    createdAt: [],
    isPrivate: [null, [Validators.required]],
    workspace: [],
  });

  constructor(
    protected proyectService: ProyectService,
    protected workspaceService: WorkspaceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ proyect }) => {
      this.updateForm(proyect);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const proyect = this.createFromForm();
    if (proyect.id !== undefined) {
      this.subscribeToSaveResponse(this.proyectService.update(proyect));
    } else {
      this.subscribeToSaveResponse(this.proyectService.create(proyect));
    }
  }

  trackWorkspaceById(index: number, item: IWorkspace): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProyect>>): void {
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

  protected updateForm(proyect: IProyect): void {
    this.editForm.patchValue({
      id: proyect.id,
      name: proyect.name,
      description: proyect.description,
      createdAt: proyect.createdAt,
      isPrivate: proyect.isPrivate,
      workspace: proyect.workspace,
    });

    this.workspacesSharedCollection = this.workspaceService.addWorkspaceToCollectionIfMissing(
      this.workspacesSharedCollection,
      proyect.workspace
    );
  }

  protected loadRelationshipsOptions(): void {
    this.workspaceService
      .query()
      .pipe(map((res: HttpResponse<IWorkspace[]>) => res.body ?? []))
      .pipe(
        map((workspaces: IWorkspace[]) =>
          this.workspaceService.addWorkspaceToCollectionIfMissing(workspaces, this.editForm.get('workspace')!.value)
        )
      )
      .subscribe((workspaces: IWorkspace[]) => (this.workspacesSharedCollection = workspaces));
  }

  protected createFromForm(): IProyect {
    return {
      ...new Proyect(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      createdAt: this.editForm.get(['createdAt'])!.value,
      isPrivate: this.editForm.get(['isPrivate'])!.value,
      workspace: this.editForm.get(['workspace'])!.value,
    };
  }
}
