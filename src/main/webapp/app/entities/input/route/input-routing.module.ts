import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InputComponent } from '../list/input.component';
import { InputDetailComponent } from '../detail/input-detail.component';
import { InputUpdateComponent } from '../update/input-update.component';
import { InputRoutingResolveService } from './input-routing-resolve.service';

const inputRoute: Routes = [
  {
    path: '',
    component: InputComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InputDetailComponent,
    resolve: {
      input: InputRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InputUpdateComponent,
    resolve: {
      input: InputRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InputUpdateComponent,
    resolve: {
      input: InputRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(inputRoute)],
  exports: [RouterModule],
})
export class InputRoutingModule {}
