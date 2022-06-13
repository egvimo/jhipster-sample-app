import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc24, Abc24 } from '../abc-24.model';
import { Abc24Service } from '../service/abc-24.service';

@Injectable({ providedIn: 'root' })
export class Abc24RoutingResolveService implements Resolve<IAbc24> {
  constructor(protected service: Abc24Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc24> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc24: HttpResponse<Abc24>) => {
          if (abc24.body) {
            return of(abc24.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc24());
  }
}
