import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc20, Abc20 } from '../abc-20.model';
import { Abc20Service } from '../service/abc-20.service';

@Injectable({ providedIn: 'root' })
export class Abc20RoutingResolveService implements Resolve<IAbc20> {
  constructor(protected service: Abc20Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc20> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc20: HttpResponse<Abc20>) => {
          if (abc20.body) {
            return of(abc20.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc20());
  }
}
