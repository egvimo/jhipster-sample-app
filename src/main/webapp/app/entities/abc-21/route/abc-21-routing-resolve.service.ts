import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc21, Abc21 } from '../abc-21.model';
import { Abc21Service } from '../service/abc-21.service';

@Injectable({ providedIn: 'root' })
export class Abc21RoutingResolveService implements Resolve<IAbc21> {
  constructor(protected service: Abc21Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc21> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc21: HttpResponse<Abc21>) => {
          if (abc21.body) {
            return of(abc21.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc21());
  }
}
