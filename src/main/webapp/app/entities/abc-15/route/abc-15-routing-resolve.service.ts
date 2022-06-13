import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc15, Abc15 } from '../abc-15.model';
import { Abc15Service } from '../service/abc-15.service';

@Injectable({ providedIn: 'root' })
export class Abc15RoutingResolveService implements Resolve<IAbc15> {
  constructor(protected service: Abc15Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc15> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc15: HttpResponse<Abc15>) => {
          if (abc15.body) {
            return of(abc15.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc15());
  }
}
