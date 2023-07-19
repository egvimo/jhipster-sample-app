import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc0 } from '../abc-0.model';
import { Abc0Service } from '../service/abc-0.service';

@Injectable({ providedIn: 'root' })
export class Abc0RoutingResolveService implements Resolve<IAbc0 | null> {
  constructor(protected service: Abc0Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc0 | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc0: HttpResponse<IAbc0>) => {
          if (abc0.body) {
            return of(abc0.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
