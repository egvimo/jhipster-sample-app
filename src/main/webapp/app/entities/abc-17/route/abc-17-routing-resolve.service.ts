import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc17, Abc17 } from '../abc-17.model';
import { Abc17Service } from '../service/abc-17.service';

@Injectable({ providedIn: 'root' })
export class Abc17RoutingResolveService implements Resolve<IAbc17> {
  constructor(protected service: Abc17Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc17> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc17: HttpResponse<Abc17>) => {
          if (abc17.body) {
            return of(abc17.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc17());
  }
}
