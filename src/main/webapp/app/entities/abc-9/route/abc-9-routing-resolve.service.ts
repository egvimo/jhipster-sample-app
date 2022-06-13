import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc9, Abc9 } from '../abc-9.model';
import { Abc9Service } from '../service/abc-9.service';

@Injectable({ providedIn: 'root' })
export class Abc9RoutingResolveService implements Resolve<IAbc9> {
  constructor(protected service: Abc9Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc9> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc9: HttpResponse<Abc9>) => {
          if (abc9.body) {
            return of(abc9.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc9());
  }
}
