import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc25, Abc25 } from '../abc-25.model';
import { Abc25Service } from '../service/abc-25.service';

@Injectable({ providedIn: 'root' })
export class Abc25RoutingResolveService implements Resolve<IAbc25> {
  constructor(protected service: Abc25Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc25> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc25: HttpResponse<Abc25>) => {
          if (abc25.body) {
            return of(abc25.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc25());
  }
}
