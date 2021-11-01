import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUsuario, Usuario } from '../usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { WorkspaceService } from 'app/entities/workspace/service/workspace.service';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { ProyectService } from 'app/entities/proyect/service/proyect.service';

@Component({
  selector: 'jhi-usuario-update',
  templateUrl: './usuario-update.component.html',
})
export class UsuarioUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  workspacesSharedCollection: IWorkspace[] = [];
  proyectsSharedCollection: IProyect[] = [];

  editForm = this.fb.group({
    id: [],
    username: [],
    password: [],
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    birthdate: [],
    phone: ['', [Validators.pattern('^\\d{9}$')]],
    user: [],
    workspaces: [],
    proyects: [],
  });

  constructor(
    protected usuarioService: UsuarioService,
    protected userService: UserService,
    protected workspaceService: WorkspaceService,
    protected proyectService: ProyectService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuario }) => {
      this.updateForm(usuario);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usuario = this.createFromForm();
    if (usuario.id !== undefined) {
      this.subscribeToSaveResponse(this.usuarioService.update(usuario));
    } else {
      this.subscribeToSaveResponse(this.usuarioService.create(usuario));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackWorkspaceById(index: number, item: IWorkspace): number {
    return item.id!;
  }

  trackProyectById(index: number, item: IProyect): number {
    return item.id!;
  }

  getSelectedWorkspace(option: IWorkspace, selectedVals?: IWorkspace[]): IWorkspace {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedProyect(option: IProyect, selectedVals?: IProyect[]): IProyect {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsuario>>): void {
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

  protected updateForm(usuario: IUsuario): void {
    this.editForm.patchValue({
      id: usuario.id,
      username: usuario.username,
      password: usuario.password,
      email: usuario.email,
      birthdate: usuario.birthdate,
      phone: usuario.phone,
      user: usuario.user,
      workspaces: usuario.workspaces,
      proyects: usuario.proyects,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, usuario.user);
    this.workspacesSharedCollection = this.workspaceService.addWorkspaceToCollectionIfMissing(
      this.workspacesSharedCollection,
      ...(usuario.workspaces ?? [])
    );
    this.proyectsSharedCollection = this.proyectService.addProyectToCollectionIfMissing(
      this.proyectsSharedCollection,
      ...(usuario.proyects ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.workspaceService
      .query()
      .pipe(map((res: HttpResponse<IWorkspace[]>) => res.body ?? []))
      .pipe(
        map((workspaces: IWorkspace[]) =>
          this.workspaceService.addWorkspaceToCollectionIfMissing(workspaces, ...(this.editForm.get('workspaces')!.value ?? []))
        )
      )
      .subscribe((workspaces: IWorkspace[]) => (this.workspacesSharedCollection = workspaces));

    this.proyectService
      .query()
      .pipe(map((res: HttpResponse<IProyect[]>) => res.body ?? []))
      .pipe(
        map((proyects: IProyect[]) =>
          this.proyectService.addProyectToCollectionIfMissing(proyects, ...(this.editForm.get('proyects')!.value ?? []))
        )
      )
      .subscribe((proyects: IProyect[]) => (this.proyectsSharedCollection = proyects));
  }

  protected createFromForm(): IUsuario {
    return {
      ...new Usuario(),
      id: this.editForm.get(['id'])!.value,
      username: this.editForm.get(['username'])!.value,
      password: this.editForm.get(['password'])!.value,
      email: this.editForm.get(['email'])!.value,
      birthdate: this.editForm.get(['birthdate'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      user: this.editForm.get(['user'])!.value,
      workspaces: this.editForm.get(['workspaces'])!.value,
      proyects: this.editForm.get(['proyects'])!.value,
    };
  }
}
