import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorkspace } from '../workspace.model';
import { WorkspaceService } from '../service/workspace.service';
import { WorkspaceDeleteDialogComponent } from '../delete/workspace-delete-dialog.component';

@Component({
  selector: 'jhi-workspace',
  templateUrl: './workspace.component.html',
})
export class WorkspaceComponent implements OnInit {
  workspaces?: IWorkspace[];
  isLoading = false;

  constructor(protected workspaceService: WorkspaceService, protected modalService: NgbModal) {}

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
}
