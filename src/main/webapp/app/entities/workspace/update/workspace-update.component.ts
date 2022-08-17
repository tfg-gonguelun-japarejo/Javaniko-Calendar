import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IWorkspace, Workspace } from '../workspace.model';
import { WorkspaceService } from '../service/workspace.service';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';

@Component({
  selector: 'jhi-workspace-update',
  templateUrl: './workspace-update.component.html',
})
export class WorkspaceUpdateComponent implements OnInit {
  isSaving = false;

  usuariosSharedCollection: IUsuario[] = [];

  editForm = this.fb.group({
    id: [],
    login: [null, [Validators.required]],
    repos_url: [],
    description: [null, [Validators.required]],
    usuarios: [],
  });

  constructor(
    protected workspaceService: WorkspaceService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workspace }) => {
      this.updateForm(workspace);

      this.loadRelationshipsOptions();
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

  trackUsuarioById(index: number, item: IUsuario): number {
    return item.id!;
  }

  getSelectedUsuario(option: IUsuario, selectedVals?: IUsuario[]): IUsuario {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
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
      login: workspace.login,
      repos_url: workspace.repos_url,
      description: workspace.description,
      usuarios: workspace.usuarios,
    });

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing(
      this.usuariosSharedCollection,
      ...(workspace.usuarios ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) =>
          this.usuarioService.addUsuarioToCollectionIfMissing(usuarios, ...(this.editForm.get('usuarios')!.value ?? []))
        )
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }

  protected createFromForm(): IWorkspace {
    return {
      ...new Workspace(),
      id: this.editForm.get(['id'])!.value,
      login: this.editForm.get(['login'])!.value,
      repos_url: this.editForm.get(['repos_url'])!.value,
      description: this.editForm.get(['description'])!.value,
      usuarios: this.editForm.get(['usuarios'])!.value,
    };
  }
}
