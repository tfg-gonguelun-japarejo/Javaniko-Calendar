/* eslint-disable no-empty-pattern */
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, filter, finalize, map } from 'rxjs/operators';

import { IInput, Input } from '../input.model';
import { InputService } from '../service/input.service';
import { IUsuario, Usuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { AccountService } from 'app/core/auth/account.service';
import { IUser } from 'app/admin/user-management/user-management.model';
import { Account } from 'app/core/auth/account.model';
import { ISprint } from 'app/entities/sprint/sprint.model';
import { SprintService } from 'app/entities/sprint/service/sprint.service';

@Component({
  selector: 'jhi-input-update',
  templateUrl: './input-update.component.html',
})
export class InputUpdateComponent implements OnInit {
  isSaving = false;

  usuariosSharedCollection: IUsuario[] = [];
  sprintsSharedCollection: ISprint[] = [];

  usuario?: Usuario | null;

  editForm = this.fb.group({
    id: [],
    comment: [],
    feelings: [null, [Validators.required]],
    inputDate: [null, [Validators.required]],
    usuario: [],
    sprint: [],
  });

  constructor(
    protected inputService: InputService,
    protected usuarioService: UsuarioService,
    protected accountService: AccountService,
    protected sprintService: SprintService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ input }) => {
      this.updateForm(input);

      this.loadRelationshipsOptions();

      this.accountService.getAuthenticationState()
      .subscribe(
        account => {
          if(account) {
            this.usuarioService.findByUsername(account.login)
            .subscribe(
              usuario => this.usuario = usuario.body
            );
          }
        }
      );
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const input = this.createFromForm();
    if (input.id !== undefined) {
      if(this.usuario!.username !== undefined && this.usuario!.username !== 'admin') {
        input.usuario = this.usuario;
      }
      this.subscribeToSaveResponse(this.inputService.update(input));
    } else {
      if(this.usuario!.username !== undefined && this.usuario!.username !== 'admin') {
        input.usuario = this.usuario;
      }
      this.subscribeToSaveResponse(this.inputService.create(input));
    }
  }

  trackUsuarioById(index: number, item: IUsuario): number {
    return item.id!;
  }

  trackSprintById(index: number, item: ISprint): number {
    return item.id!;
  }

  
  hasAnyAuthority(authorities: string[] | string): boolean {
    return this.accountService.hasAnyAuthority(authorities);
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
      sprint: input.sprint,
    });

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing(this.usuariosSharedCollection, input.usuario);
    this.sprintsSharedCollection = this.sprintService.addSprintToCollectionIfMissing(this.sprintsSharedCollection, input.sprint);
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing(usuarios, this.editForm.get('usuario')!.value))
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));

    this.sprintService
    .query()
    .pipe(map((res: HttpResponse<ISprint[]>) => res.body ?? []))
    .pipe(map((sprints: ISprint[]) => this.sprintService.addSprintToCollectionIfMissing(sprints, this.editForm.get('sprint')!.value)))
    .subscribe((sprints: ISprint[]) => (this.sprintsSharedCollection = sprints));
  }

  protected createFromForm(): IInput {
    return {
      ...new Input(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      feelings: this.editForm.get(['feelings'])!.value,
      inputDate: this.editForm.get(['inputDate'])!.value,
      usuario: this.editForm.get(['usuario'])!.value,
      sprint: this.editForm.get(['sprint'])!.value,
    };
  }
}
