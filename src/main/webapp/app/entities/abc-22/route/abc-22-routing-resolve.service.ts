import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc22, Abc22 } from '../abc-22.model';
import { Abc22Service } from '../service/abc-22.service';

@Injectable({ providedIn: 'root' })
export class Abc22RoutingResolveService implements Resolve<IAbc22> {
  constructor(protected service: Abc22Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc22> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc22: HttpResponse<Abc22>) => {
          if (abc22.body) {
            return of(abc22.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc22());
  }
}
