import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc29, Abc29 } from '../abc-29.model';
import { Abc29Service } from '../service/abc-29.service';

@Injectable({ providedIn: 'root' })
export class Abc29RoutingResolveService implements Resolve<IAbc29> {
  constructor(protected service: Abc29Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc29> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc29: HttpResponse<Abc29>) => {
          if (abc29.body) {
            return of(abc29.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc29());
  }
}
