import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc19, Abc19 } from '../abc-19.model';
import { Abc19Service } from '../service/abc-19.service';

@Injectable({ providedIn: 'root' })
export class Abc19RoutingResolveService implements Resolve<IAbc19> {
  constructor(protected service: Abc19Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc19> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc19: HttpResponse<Abc19>) => {
          if (abc19.body) {
            return of(abc19.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc19());
  }
}
