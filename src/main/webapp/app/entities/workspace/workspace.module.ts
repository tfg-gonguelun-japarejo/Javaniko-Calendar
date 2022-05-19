import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { WorkspaceComponent } from './list/workspace.component';
import { WorkspaceDetailComponent } from './detail/workspace-detail.component';
import { WorkspaceUpdateComponent } from './update/workspace-update.component';
import { WorkspaceDeleteDialogComponent } from './delete/workspace-delete-dialog.component';
import { WorkspaceRoutingModule } from './route/workspace-routing.module';
import { GithubModalComponent } from './github/github.component';

@NgModule({
  imports: [SharedModule, WorkspaceRoutingModule],
  declarations: [
    WorkspaceComponent,
    WorkspaceDetailComponent,
    WorkspaceUpdateComponent,
    WorkspaceDeleteDialogComponent,
    GithubModalComponent,
  ],
  entryComponents: [WorkspaceDeleteDialogComponent],
})
export class WorkspaceModule {}
