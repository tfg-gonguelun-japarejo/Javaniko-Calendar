import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProyect } from '../proyect.model';
import { ProyectService } from '../service/proyect.service';
import { ProyectDeleteDialogComponent } from '../delete/proyect-delete-dialog.component';

@Component({
  selector: 'jhi-proyect',
  templateUrl: './proyect.component.html',
})
export class ProyectComponent implements OnInit {
  proyects?: IProyect[];
  isLoading = false;

  constructor(protected proyectService: ProyectService, protected modalService: NgbModal) {}

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
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProyect): number {
    return item.id!;
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
}
