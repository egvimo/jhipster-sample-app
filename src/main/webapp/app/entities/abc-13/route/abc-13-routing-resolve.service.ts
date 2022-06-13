import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc13, Abc13 } from '../abc-13.model';
import { Abc13Service } from '../service/abc-13.service';

@Injectable({ providedIn: 'root' })
export class Abc13RoutingResolveService implements Resolve<IAbc13> {
  constructor(protected service: Abc13Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc13> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc13: HttpResponse<Abc13>) => {
          if (abc13.body) {
            return of(abc13.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc13());
  }
}
