import { Route } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { StatisticsComponent } from './statistics.component';

export const STATISTICS_ROUTE: Route = {
  path: 'statistics',
  component: StatisticsComponent,
  data: {
    pageTitle: 'statistics.title',
  },
  canActivate: [UserRouteAccessService],
};
