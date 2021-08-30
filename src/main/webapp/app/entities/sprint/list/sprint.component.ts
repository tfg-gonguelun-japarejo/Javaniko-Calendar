import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISprint } from '../sprint.model';
import { SprintService } from '../service/sprint.service';
import { SprintDeleteDialogComponent } from '../delete/sprint-delete-dialog.component';

@Component({
  selector: 'jhi-sprint',
  templateUrl: './sprint.component.html',
})
export class SprintComponent implements OnInit {
  sprints?: ISprint[];
  isLoading = false;

  constructor(protected sprintService: SprintService, protected modalService: NgbModal) {}

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
}
