import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { InputComponent } from './list/input.component';
import { InputDetailComponent } from './detail/input-detail.component';
import { InputUpdateComponent } from './update/input-update.component';
import { InputDeleteDialogComponent } from './delete/input-delete-dialog.component';
import { InputRoutingModule } from './route/input-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

FullCalendarModule.registerPlugins([interactionPlugin, dayGridPlugin]);

@NgModule({
  imports: [SharedModule, InputRoutingModule, FullCalendarModule, HttpClientModule, NgbModule, FormsModule],
  declarations: [InputComponent, InputDetailComponent, InputUpdateComponent, InputDeleteDialogComponent],
  entryComponents: [InputDeleteDialogComponent],
})
export class InputModule {}
