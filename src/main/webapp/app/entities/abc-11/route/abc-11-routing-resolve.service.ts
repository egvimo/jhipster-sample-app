import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc11, Abc11 } from '../abc-11.model';
import { Abc11Service } from '../service/abc-11.service';

@Injectable({ providedIn: 'root' })
export class Abc11RoutingResolveService implements Resolve<IAbc11> {
  constructor(protected service: Abc11Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc11> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc11: HttpResponse<Abc11>) => {
          if (abc11.body) {
            return of(abc11.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc11());
  }
}
