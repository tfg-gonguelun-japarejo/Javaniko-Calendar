import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISprint } from '../sprint.model';
import { SprintService } from '../service/sprint.service';
import { SprintDeleteDialogComponent } from '../delete/sprint-delete-dialog.component';
import { AccountService } from 'app/core/auth/account.service';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { Usuario } from 'app/entities/usuario/usuario.model';
import { IProyect } from 'app/entities/proyect/proyect.model';

@Component({
  selector: 'jhi-sprint',
  templateUrl: './sprint.component.html',
})
export class SprintComponent implements OnInit {
  sprints?: ISprint[];
  usuario?: Usuario | null;
  proyects?: IProyect[] | null;
  isLoading = false;

  constructor(
    protected sprintService: SprintService,
    protected accountService: AccountService,
    protected usuarioService: UsuarioService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.sprintService.query().subscribe(
      (res: HttpResponse<ISprint[]>) => {
        this.isLoading = false;
        this.sprints = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );

    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.usuarioService.findByUsername(account.login).subscribe(usuario => {
          this.usuario = usuario.body;
          this.getGithubProyectsByUser(this.usuario!);
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISprint): number {
    return item.id!;
  }

  delete(sprint: ISprint): void {
    const modalRef = this.modalService.open(SprintDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sprint = sprint;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  getGithubProyectsByUser(usuario: Usuario): any {
    this.sprintService.findProyectsByUsuarioId(usuario.id!).subscribe(proyects => {
      this.proyects = proyects.body;
      /* this.proyects!.forEach(proyect => {
        this.getGithubSprintsByProyect(proyect);
      }); */
    });
  }

  /* getGithubSprintsByProyect(proyect: IProyect): any {
    this.sprintService
      .getGithubMilestones(workspace.repos_url!)
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
          const create: any = this.proyectService.create(proyect);
          create.subscribe(() => this.previousState());
        });
      });
  } */

  previousState(): void {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
}
