import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProyectComponent } from '../list/proyect.component';
import { ProyectDetailComponent } from '../detail/proyect-detail.component';
import { ProyectUpdateComponent } from '../update/proyect-update.component';
import { ProyectRoutingResolveService } from './proyect-routing-resolve.service';

const proyectRoute: Routes = [
  {
    path: '',
    component: ProyectComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProyectDetailComponent,
    resolve: {
      proyect: ProyectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProyectUpdateComponent,
    resolve: {
      proyect: ProyectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProyectUpdateComponent,
    resolve: {
      proyect: ProyectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(proyectRoute)],
  exports: [RouterModule],
})
export class ProyectRoutingModule {}
