import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInput, Input } from '../input.model';
import { InputService } from '../service/input.service';

@Injectable({ providedIn: 'root' })
export class InputRoutingResolveService implements Resolve<IInput> {
  constructor(protected service: InputService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInput> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((input: HttpResponse<Input>) => {
          if (input.body) {
            return of(input.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Input());
  }
}
