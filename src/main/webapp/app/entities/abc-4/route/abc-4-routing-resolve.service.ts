import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc4, Abc4 } from '../abc-4.model';
import { Abc4Service } from '../service/abc-4.service';

@Injectable({ providedIn: 'root' })
export class Abc4RoutingResolveService implements Resolve<IAbc4> {
  constructor(protected service: Abc4Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc4> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc4: HttpResponse<Abc4>) => {
          if (abc4.body) {
            return of(abc4.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc4());
  }
}
