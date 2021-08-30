import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkspace } from '../workspace.model';

@Component({
  selector: 'jhi-workspace-detail',
  templateUrl: './workspace-detail.component.html',
})
export class WorkspaceDetailComponent implements OnInit {
  workspace: IWorkspace | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workspace }) => {
      this.workspace = workspace;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
