import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProyect, Proyect } from '../proyect.model';
import { ProyectService } from '../service/proyect.service';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { WorkspaceService } from 'app/entities/workspace/service/workspace.service';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';

@Component({
  selector: 'jhi-proyect-update',
  templateUrl: './proyect-update.component.html',
})
export class ProyectUpdateComponent implements OnInit {
  isSaving = false;

  workspacesSharedCollection: IWorkspace[] = [];
  usuariosSharedCollection: IUsuario[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [null, [Validators.required]],
    createdAt: ['', [this.dateGreater]],
    isPrivate: [null, [Validators.required]],
    milestonesUrl: [],
    workspace: [],
    usuarios: [],
  });

  constructor(
    protected proyectService: ProyectService,
    protected workspaceService: WorkspaceService,
    protected usuarioService: UsuarioService,
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

  dateGreater(control: AbstractControl): { [key: string]: boolean } | null {
    const dateNow = new Date();
    return new Date(control.value) > dateNow ? { LessThanToday: true } : null;
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
      milestonesUrl: proyect.milestonesUrl,
      workspace: proyect.workspace,
      usuarios: proyect.usuarios,
    });

    this.workspacesSharedCollection = this.workspaceService.addWorkspaceToCollectionIfMissing(
      this.workspacesSharedCollection,
      proyect.workspace
    );
    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing(
      this.usuariosSharedCollection,
      ...(proyect.usuarios ?? [])
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

  protected createFromForm(): IProyect {
    return {
      ...new Proyect(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      createdAt: this.editForm.get(['createdAt'])!.value,
      isPrivate: this.editForm.get(['isPrivate'])!.value,
      milestonesUrl: this.editForm.get(['milestonesUrl'])!.value,
      workspace: this.editForm.get(['workspace'])!.value,
      usuarios: this.editForm.get(['usuarios'])!.value,
    };
  }
}
