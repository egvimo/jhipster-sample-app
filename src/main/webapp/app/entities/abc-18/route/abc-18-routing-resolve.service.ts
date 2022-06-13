import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc18, Abc18 } from '../abc-18.model';
import { Abc18Service } from '../service/abc-18.service';

@Injectable({ providedIn: 'root' })
export class Abc18RoutingResolveService implements Resolve<IAbc18> {
  constructor(protected service: Abc18Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc18> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc18: HttpResponse<Abc18>) => {
          if (abc18.body) {
            return of(abc18.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc18());
  }
}
