import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc14, Abc14 } from '../abc-14.model';
import { Abc14Service } from '../service/abc-14.service';

@Injectable({ providedIn: 'root' })
export class Abc14RoutingResolveService implements Resolve<IAbc14> {
  constructor(protected service: Abc14Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc14> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc14: HttpResponse<Abc14>) => {
          if (abc14.body) {
            return of(abc14.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc14());
  }
}
