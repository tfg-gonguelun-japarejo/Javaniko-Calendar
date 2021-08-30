import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInput } from '../input.model';
import { InputService } from '../service/input.service';
import { InputDeleteDialogComponent } from '../delete/input-delete-dialog.component';

@Component({
  selector: 'jhi-input',
  templateUrl: './input.component.html',
})
export class InputComponent implements OnInit {
  inputs?: IInput[];
  isLoading = false;

  constructor(protected inputService: InputService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.inputService.query().subscribe(
      (res: HttpResponse<IInput[]>) => {
        this.isLoading = false;
        this.inputs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInput): number {
    return item.id!;
  }

  delete(input: IInput): void {
    const modalRef = this.modalService.open(InputDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.input = input;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
