import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc8, Abc8 } from '../abc-8.model';
import { Abc8Service } from '../service/abc-8.service';

@Injectable({ providedIn: 'root' })
export class Abc8RoutingResolveService implements Resolve<IAbc8> {
  constructor(protected service: Abc8Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc8> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc8: HttpResponse<Abc8>) => {
          if (abc8.body) {
            return of(abc8.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc8());
  }
}
