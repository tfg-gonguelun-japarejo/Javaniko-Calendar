import { Route } from '@angular/router';

import { StatisticsComponent } from './statistics.component';

export const STATISTICS_ROUTE: Route = {
  path: 'statistics',
  component: StatisticsComponent,
  data: {
    pageTitle: 'statistics.title',
  },
};
