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
import { ProyectService } from 'app/entities/proyect/service/proyect.service';
import { map, tap } from 'rxjs/operators';
import { Status } from 'app/entities/enumerations/status.model';
import dayjs from 'dayjs';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-sprint',
  templateUrl: './sprint.component.html',
})
export class SprintComponent implements OnInit {
  sprints?: ISprint[];
  usuario?: Usuario | null;
  proyects?: IProyect[] | null;
  aux?: ISprint[];
  emptyProyects = false;
  sprintDuplicate = false;
  faCheckSquare = faCheckSquare;
  isLoading = false;

  constructor(
    protected sprintService: SprintService,
    protected proyectService: ProyectService,
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
    this.proyectService.findProyectsByUsuarioId(usuario.id!).subscribe(proyects => {
      this.proyects = proyects.body;
      this.proyects!.forEach(proyect => {
        this.getGithubSprintsByProyect(proyect);
      });
    });
  }

  getGithubSprintsByProyect(proyect: IProyect): any {
    this.sprintService
      .getGithubMilestones(proyect.milestonesUrl!)
      .pipe(
        tap(sprints => {
          if (sprints.length === 0) {
            this.emptyProyects = true;
          }
        }),
        map(sprints =>
          sprints.map(sprint => ({
            title: sprint['title'],
            description: sprint['description'],
            createdAt: sprint['created_at'],
            dueOn: sprint['due_on'],
            status: Status.ON_GOING,
          }))
        )
      )
      .subscribe((sprints: ISprint[]) => {
        this.aux = sprints;
        this.aux.forEach(sprint => {
          for (let i = 0; i < this.sprints!.length; i++) {
            if (this.sprints![i].title === sprint.title && this.sprints![i].description === sprint.description) {
              this.sprintDuplicate = true;
              i = this.sprints!.length;
            }
          }
          if (this.sprintDuplicate) {
            return;
          }
          sprint.proyect = proyect;
          this.formatDateSprint(sprint);
          const create: any = this.sprintService.create(sprint);
          create.subscribe(() => this.previousState());
        });
      });
  }

  formatDateSprint(sprint: ISprint): dayjs.Dayjs {
    const startDate = dayjs(sprint.createdAt).format('D/MMM/YYYY');
    sprint.createdAt = dayjs(startDate);
    const endDate = dayjs(sprint.dueOn).format('D/MMM/YYYY');
    sprint.dueOn = dayjs(endDate);
    return sprint.createdAt, sprint.dueOn;
  }

  previousState(): void {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
}
