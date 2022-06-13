import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc10, Abc10 } from '../abc-10.model';
import { Abc10Service } from '../service/abc-10.service';

@Injectable({ providedIn: 'root' })
export class Abc10RoutingResolveService implements Resolve<IAbc10> {
  constructor(protected service: Abc10Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc10> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc10: HttpResponse<Abc10>) => {
          if (abc10.body) {
            return of(abc10.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc10());
  }
}
