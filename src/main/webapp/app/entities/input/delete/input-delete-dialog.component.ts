import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInput } from '../input.model';
import { InputService } from '../service/input.service';

@Component({
  templateUrl: './input-delete-dialog.component.html',
})
export class InputDeleteDialogComponent {
  input?: IInput;

  constructor(protected inputService: InputService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.inputService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
