import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProyect, Proyect } from '../proyect.model';
import { ProyectService } from '../service/proyect.service';

@Injectable({ providedIn: 'root' })
export class ProyectRoutingResolveService implements Resolve<IProyect> {
  constructor(protected service: ProyectService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProyect> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((proyect: HttpResponse<Proyect>) => {
          if (proyect.body) {
            return of(proyect.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Proyect());
  }
}
