import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc28, Abc28 } from '../abc-28.model';
import { Abc28Service } from '../service/abc-28.service';

@Injectable({ providedIn: 'root' })
export class Abc28RoutingResolveService implements Resolve<IAbc28> {
  constructor(protected service: Abc28Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc28> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc28: HttpResponse<Abc28>) => {
          if (abc28.body) {
            return of(abc28.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc28());
  }
}
