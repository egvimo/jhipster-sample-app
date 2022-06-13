import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc6, Abc6 } from '../abc-6.model';
import { Abc6Service } from '../service/abc-6.service';

@Injectable({ providedIn: 'root' })
export class Abc6RoutingResolveService implements Resolve<IAbc6> {
  constructor(protected service: Abc6Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc6> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc6: HttpResponse<Abc6>) => {
          if (abc6.body) {
            return of(abc6.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc6());
  }
}
