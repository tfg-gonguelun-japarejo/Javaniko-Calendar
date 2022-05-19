import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'app/core/auth/account.service';
import { IProyect } from 'app/entities/proyect/proyect.model';
import { ProyectService } from 'app/entities/proyect/service/proyect.service';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { Usuario } from 'app/entities/usuario/usuario.model';
import dayjs from 'dayjs';
import { map, tap } from 'rxjs/operators';
import { WorkspaceService } from '../service/workspace.service';
import { IWorkspace } from '../workspace.model';

@Component({
  selector: 'jhi-github',
  templateUrl: './github.component.html',
})
export class GithubModalComponent {
  workspaces?: IWorkspace[];
  usuario?: Usuario | null;
  aux?: IWorkspace[];
  aux2?: IProyect[];
  emptyOrgs?: boolean;
  emptyProyects?: boolean;
  @Output() emitService = new EventEmitter();

  constructor(
    protected workspaceService: WorkspaceService,
    protected proyectService: ProyectService,
    protected accountService: AccountService,
    protected usuarioService: UsuarioService,
    protected activeModal: NgbActiveModal
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmGithubData(): any {
    this.workspaceService
      .getGithubOrg(this.usuario!.username!)
      .pipe(
        tap(workspaces => {
          if (workspaces.length === 0) {
            this.emitService.emit((this.emptyOrgs = true));
            this.activeModal.close();
          }
        }),
        map(workspaces =>
          workspaces.map(workspace => ({
            login: workspace.login,
            repos_url: workspace.repos_url,
            description: workspace.description,
          }))
        )
      )
      .subscribe((workspaces: IWorkspace[]) => {
        this.aux = workspaces;
        this.aux.forEach(workspace => {
          if (workspace.usuarios === undefined) {
            workspace.usuarios = [];
          }
          workspace.usuarios.push(this.usuario!);
          const create: any = this.workspaceService.create(workspace);
          create.subscribe(() => this.activeModal.close());
        });
      });
  }
}
