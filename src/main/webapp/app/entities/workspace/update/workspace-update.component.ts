import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IWorkspace, Workspace } from '../workspace.model';
import { WorkspaceService } from '../service/workspace.service';

@Component({
  selector: 'jhi-workspace-update',
  templateUrl: './workspace-update.component.html',
})
export class WorkspaceUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [null, [Validators.required, Validators.minLength(20)]],
    isPrivate: [null, [Validators.required]],
  });

  constructor(protected workspaceService: WorkspaceService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workspace }) => {
      this.updateForm(workspace);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const workspace = this.createFromForm();
    if (workspace.id !== undefined) {
      this.subscribeToSaveResponse(this.workspaceService.update(workspace));
    } else {
      this.subscribeToSaveResponse(this.workspaceService.create(workspace));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkspace>>): void {
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

  protected updateForm(workspace: IWorkspace): void {
    this.editForm.patchValue({
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      isPrivate: workspace.isPrivate,
    });
  }

  protected createFromForm(): IWorkspace {
    return {
      ...new Workspace(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      isPrivate: this.editForm.get(['isPrivate'])!.value,
    };
  }
}
