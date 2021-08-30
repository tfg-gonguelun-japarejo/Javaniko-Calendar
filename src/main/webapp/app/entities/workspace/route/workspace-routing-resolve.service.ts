import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWorkspace, Workspace } from '../workspace.model';
import { WorkspaceService } from '../service/workspace.service';

@Injectable({ providedIn: 'root' })
export class WorkspaceRoutingResolveService implements Resolve<IWorkspace> {
  constructor(protected service: WorkspaceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWorkspace> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((workspace: HttpResponse<Workspace>) => {
          if (workspace.body) {
            return of(workspace.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Workspace());
  }
}
