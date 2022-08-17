import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProyect } from '../proyect.model';
import { ProyectService } from '../service/proyect.service';
import { ProyectDeleteDialogComponent } from '../delete/proyect-delete-dialog.component';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { AccountService } from 'app/core/auth/account.service';
import { IUsuario, Usuario } from 'app/entities/usuario/usuario.model';
import { WorkspaceService } from 'app/entities/workspace/service/workspace.service';
import { map, tap } from 'rxjs/operators';
import dayjs from 'dayjs';
import { IWorkspace } from 'app/entities/workspace/workspace.model';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-proyect',
  templateUrl: './proyect.component.html',
})
export class ProyectComponent implements OnInit {
  proyects?: IProyect[];
  usuario?: Usuario | null;
  workspaces?: IWorkspace[] | null;
  aux?: IProyect[];
  emptyProyects = false;
  proyectDuplicate = false;
  faCheckCircle = faCheckCircle;
  isLoading = false;

  usuariosSharedCollection: IUsuario[] = [];

  constructor(
    protected proyectService: ProyectService,
    protected accountService: AccountService,
    protected usuarioService: UsuarioService,
    protected workspaceService: WorkspaceService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.proyectService.query().subscribe(
      (res: HttpResponse<IProyect[]>) => {
        this.isLoading = false;
        this.proyects = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );

    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.usuarioService.findByUsername(account.login).subscribe(usuario => {
          this.usuario = usuario.body;
        });
      }
    });

    this.loadRelationshipsOptions();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProyect): number {
    return item.id!;
  }

  trackUsuarioById(index: number, item: IUsuario): number {
    return item.id!;
  }

  hideUsuario(usuario: IUsuario, proyect: IProyect): boolean {
    let result = false;
    usuario.proyects?.forEach(p => {
      if (p.name === proyect.name) {
        result = true;
        return result;
      }
    });
    return result;
  }

  delete(proyect: IProyect): void {
    const modalRef = this.modalService.open(ProyectDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.proyect = proyect;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  getGithubWorkspacesByUser(usuario: Usuario): any {
    this.workspaceService.findWorkspacesByUsuarioId(usuario.id!).subscribe(workspaces => {
      this.workspaces = workspaces.body;
      this.workspaces!.forEach(workspace => {
        this.getGithubProyectsByOrg(workspace);
      });
    });
  }

  getGithubProyectsByOrg(workspace: IWorkspace): any {
    this.proyectService
      .getGithubProyects(workspace.repos_url!)
      .pipe(
        tap(proyects => {
          if (proyects.length === 0) {
            this.emptyProyects = true;
          }
        }),
        map(proyects =>
          proyects.map(proyect => ({
            name: proyect['name'],
            description: proyect['description'],
            createdAt: proyect['created_at'],
            isPrivate: proyect['private'],
            milestonesUrl: proyect['milestones_url'],
          }))
        )
      )
      .subscribe((proyects: IProyect[]) => {
        this.aux = proyects;
        this.aux.forEach(proyect => {
          for (let i = 0; i < this.proyects!.length; i++) {
            if (this.proyects![i].name === proyect.name && this.proyects![i].description === proyect.description) {
              this.proyectDuplicate = true;
              i = this.proyects!.length;
            }
          }
          if (this.proyectDuplicate) {
            return;
          }
          if (proyect.usuarios === undefined) {
            proyect.usuarios = [];
          }
          proyect.usuarios.push(this.usuario!);
          if (proyect.workspace === undefined) {
            proyect.workspace = {};
          }
          proyect.workspace = workspace;
          this.formatDateProyect(proyect);
          proyect.milestonesUrl = proyect.milestonesUrl!.split('{')[0];
          const create: any = this.proyectService.create(proyect);
          create.subscribe(() => this.previousState());
        });
      });
  }

  formatDateProyect(proyect: IProyect): dayjs.Dayjs {
    const fecha = dayjs(proyect.createdAt).format('D/MMM/YYYY');
    proyect.createdAt = dayjs(fecha);
    return proyect.createdAt;
  }

  previousState(): void {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing(usuarios)))
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
