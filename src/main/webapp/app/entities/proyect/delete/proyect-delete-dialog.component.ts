import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProyect } from '../proyect.model';
import { ProyectService } from '../service/proyect.service';

@Component({
  templateUrl: './proyect-delete-dialog.component.html',
})
export class ProyectDeleteDialogComponent {
  proyect?: IProyect;

  constructor(protected proyectService: ProyectService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.proyectService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
