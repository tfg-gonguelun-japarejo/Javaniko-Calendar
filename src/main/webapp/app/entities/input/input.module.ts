import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { InputComponent } from './list/input.component';
import { InputDetailComponent } from './detail/input-detail.component';
import { InputUpdateComponent } from './update/input-update.component';
import { InputDeleteDialogComponent } from './delete/input-delete-dialog.component';
import { InputRoutingModule } from './route/input-routing.module';

@NgModule({
  imports: [SharedModule, InputRoutingModule],
  declarations: [InputComponent, InputDetailComponent, InputUpdateComponent, InputDeleteDialogComponent],
  entryComponents: [InputDeleteDialogComponent],
})
export class InputModule {}
