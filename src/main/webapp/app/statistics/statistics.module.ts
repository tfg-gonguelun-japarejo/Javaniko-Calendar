import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { STATISTICS_ROUTE } from './statistics.route';
import { StatisticsComponent } from './statistics.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([STATISTICS_ROUTE]), NgxChartsModule],
  declarations: [StatisticsComponent],
})
export class StatisticsModule {}
