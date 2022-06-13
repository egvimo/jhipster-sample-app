import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc23, Abc23 } from '../abc-23.model';
import { Abc23Service } from '../service/abc-23.service';

@Injectable({ providedIn: 'root' })
export class Abc23RoutingResolveService implements Resolve<IAbc23> {
  constructor(protected service: Abc23Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc23> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc23: HttpResponse<Abc23>) => {
          if (abc23.body) {
            return of(abc23.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc23());
  }
}
