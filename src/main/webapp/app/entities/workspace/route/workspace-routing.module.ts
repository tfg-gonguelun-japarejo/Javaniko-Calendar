import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WorkspaceComponent } from '../list/workspace.component';
import { WorkspaceDetailComponent } from '../detail/workspace-detail.component';
import { WorkspaceUpdateComponent } from '../update/workspace-update.component';
import { WorkspaceRoutingResolveService } from './workspace-routing-resolve.service';

const workspaceRoute: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WorkspaceDetailComponent,
    resolve: {
      workspace: WorkspaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WorkspaceUpdateComponent,
    resolve: {
      workspace: WorkspaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WorkspaceUpdateComponent,
    resolve: {
      workspace: WorkspaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(workspaceRoute)],
  exports: [RouterModule],
})
export class WorkspaceRoutingModule {}
