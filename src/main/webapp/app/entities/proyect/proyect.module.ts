import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProyectComponent } from './list/proyect.component';
import { ProyectDetailComponent } from './detail/proyect-detail.component';
import { ProyectUpdateComponent } from './update/proyect-update.component';
import { ProyectDeleteDialogComponent } from './delete/proyect-delete-dialog.component';
import { ProyectRoutingModule } from './route/proyect-routing.module';

@NgModule({
  imports: [SharedModule, ProyectRoutingModule],
  declarations: [ProyectComponent, ProyectDetailComponent, ProyectUpdateComponent, ProyectDeleteDialogComponent],
  entryComponents: [ProyectDeleteDialogComponent],
})
export class ProyectModule {}
