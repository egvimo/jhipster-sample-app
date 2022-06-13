import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc7, Abc7 } from '../abc-7.model';
import { Abc7Service } from '../service/abc-7.service';

@Injectable({ providedIn: 'root' })
export class Abc7RoutingResolveService implements Resolve<IAbc7> {
  constructor(protected service: Abc7Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc7> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc7: HttpResponse<Abc7>) => {
          if (abc7.body) {
            return of(abc7.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc7());
  }
}
