import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc1, Abc1 } from '../abc-1.model';
import { Abc1Service } from '../service/abc-1.service';

@Injectable({ providedIn: 'root' })
export class Abc1RoutingResolveService implements Resolve<IAbc1> {
  constructor(protected service: Abc1Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc1> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc1: HttpResponse<Abc1>) => {
          if (abc1.body) {
            return of(abc1.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc1());
  }
}
