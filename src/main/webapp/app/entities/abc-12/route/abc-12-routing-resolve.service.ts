import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc12, Abc12 } from '../abc-12.model';
import { Abc12Service } from '../service/abc-12.service';

@Injectable({ providedIn: 'root' })
export class Abc12RoutingResolveService implements Resolve<IAbc12> {
  constructor(protected service: Abc12Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc12> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc12: HttpResponse<Abc12>) => {
          if (abc12.body) {
            return of(abc12.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc12());
  }
}
