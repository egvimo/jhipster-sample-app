import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc16, Abc16 } from '../abc-16.model';
import { Abc16Service } from '../service/abc-16.service';

@Injectable({ providedIn: 'root' })
export class Abc16RoutingResolveService implements Resolve<IAbc16> {
  constructor(protected service: Abc16Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc16> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc16: HttpResponse<Abc16>) => {
          if (abc16.body) {
            return of(abc16.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc16());
  }
}
