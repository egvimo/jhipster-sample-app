import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc26, Abc26 } from '../abc-26.model';
import { Abc26Service } from '../service/abc-26.service';

@Injectable({ providedIn: 'root' })
export class Abc26RoutingResolveService implements Resolve<IAbc26> {
  constructor(protected service: Abc26Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc26> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc26: HttpResponse<Abc26>) => {
          if (abc26.body) {
            return of(abc26.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc26());
  }
}
