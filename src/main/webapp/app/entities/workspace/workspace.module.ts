import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { WorkspaceComponent } from './list/workspace.component';
import { WorkspaceDetailComponent } from './detail/workspace-detail.component';
import { WorkspaceUpdateComponent } from './update/workspace-update.component';
import { WorkspaceDeleteDialogComponent } from './delete/workspace-delete-dialog.component';
import { WorkspaceRoutingModule } from './route/workspace-routing.module';

@NgModule({
  imports: [SharedModule, WorkspaceRoutingModule],
  declarations: [WorkspaceComponent, WorkspaceDetailComponent, WorkspaceUpdateComponent, WorkspaceDeleteDialogComponent],
  entryComponents: [WorkspaceDeleteDialogComponent],
})
export class WorkspaceModule {}
