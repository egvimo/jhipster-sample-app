import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAbc, Abc } from '../abc.model';
import { AbcService } from '../service/abc.service';

@Injectable({ providedIn: 'root' })
export class AbcRoutingResolveService implements Resolve<IAbc> {
  constructor(protected service: AbcService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAbc> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((abc: HttpResponse<Abc>) => {
          if (abc.body) {
            return of(abc.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Abc());
  }
}
