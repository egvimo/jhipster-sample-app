import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc5, Abc5 } from '../abc-5.model';
import { Abc5Service } from '../service/abc-5.service';

@Injectable({ providedIn: 'root' })
export class Abc5RoutingResolveService implements Resolve<IAbc5> {
  constructor(protected service: Abc5Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc5> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc5: HttpResponse<Abc5>) => {
          if (abc5.body) {
            return of(abc5.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc5());
  }
}
