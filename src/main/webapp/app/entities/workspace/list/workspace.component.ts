/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorkspace, Workspace } from '../workspace.model';
import { WorkspaceService } from '../service/workspace.service';
import { WorkspaceDeleteDialogComponent } from '../delete/workspace-delete-dialog.component';

import { filter, switchMap, debounceTime, catchError, concatMap, delay, tap, map } from 'rxjs/operators';
import { EMPTY, forkJoin, Observable, of, throwError } from 'rxjs';
import { FormControl } from '@angular/forms';
import { IUsuario, Usuario } from 'app/entities/usuario/usuario.model';
import { fi } from 'date-fns/locale';

import { AccountService } from '../../../core/auth/account.service';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { forEachChild } from 'typescript';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-workspace',
  templateUrl: './workspace.component.html',
})
export class WorkspaceComponent implements OnInit {
  workspaces?: IWorkspace[];
  isLoading = false;
  usuario?: Usuario | null;
  aux?: IWorkspace[];
  faPaperPlane = faPaperPlane;
  emptyOrgs = false;

  constructor(protected workspaceService: WorkspaceService, protected accountService: AccountService, protected usuarioService: UsuarioService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.workspaceService.query().subscribe(
      (res: HttpResponse<IWorkspace[]>) => {
        this.isLoading = false;
        this.workspaces = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
      
    );

    this.accountService.getAuthenticationState().subscribe(
      account => {
        if(account) {
          this.usuarioService.findByUsername(account.login).subscribe(
            usuario => this.usuario = usuario.body
          );
        }
      }
    );
    
  } 

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IWorkspace): number {
    return item.id!;
  }

  delete(workspace: IWorkspace): void {
    const modalRef = this.modalService.open(WorkspaceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.workspace = workspace;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  getGithubData(): any {
    this.workspaceService.getGithubOrg(this.usuario!.username!).pipe(
      tap(workspaces => {
        if(workspaces.length === 0){
          this.emptyOrgs = true
        }
      }),
      map(workspaces => workspaces.map(
        workspace => ({
            login: workspace.login,
            repos_url: workspace.repos_url,
            description: workspace.description

          })
      ))
    ).subscribe(
      (workspaces: IWorkspace[]) => {
        this.aux = workspaces
        this.aux.forEach(workspace => {
          const create: any = this.workspaceService.create(workspace)
          create.subscribe(() => this.previousState())
        })
      }
    );
  }

  previousState(): void {
    setTimeout(() => {
      window.location.reload();
   }, 3000);
  }
    
}
