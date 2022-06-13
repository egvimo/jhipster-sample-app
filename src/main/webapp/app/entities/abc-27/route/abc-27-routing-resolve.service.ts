import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc27, Abc27 } from '../abc-27.model';
import { Abc27Service } from '../service/abc-27.service';

@Injectable({ providedIn: 'root' })
export class Abc27RoutingResolveService implements Resolve<IAbc27> {
  constructor(protected service: Abc27Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc27> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc27: HttpResponse<Abc27>) => {
          if (abc27.body) {
            return of(abc27.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc27());
  }
}
