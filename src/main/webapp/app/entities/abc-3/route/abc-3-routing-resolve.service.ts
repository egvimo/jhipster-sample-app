import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc3, Abc3 } from '../abc-3.model';
import { Abc3Service } from '../service/abc-3.service';

@Injectable({ providedIn: 'root' })
export class Abc3RoutingResolveService implements Resolve<IAbc3> {
  constructor(protected service: Abc3Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc3> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc3: HttpResponse<Abc3>) => {
          if (abc3.body) {
            return of(abc3.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc3());
  }
}
