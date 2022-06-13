import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc2, Abc2 } from '../abc-2.model';
import { Abc2Service } from '../service/abc-2.service';

@Injectable({ providedIn: 'root' })
export class Abc2RoutingResolveService implements Resolve<IAbc2> {
  constructor(protected service: Abc2Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc2> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc2: HttpResponse<Abc2>) => {
          if (abc2.body) {
            return of(abc2.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc2());
  }
}
