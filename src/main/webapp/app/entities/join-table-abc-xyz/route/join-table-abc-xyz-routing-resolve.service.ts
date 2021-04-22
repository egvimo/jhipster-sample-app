import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJoinTableAbcXyz, JoinTableAbcXyz } from '../join-table-abc-xyz.model';
import { JoinTableAbcXyzService } from '../service/join-table-abc-xyz.service';

@Injectable({ providedIn: 'root' })
export class JoinTableAbcXyzRoutingResolveService implements Resolve<IJoinTableAbcXyz> {
  constructor(protected service: JoinTableAbcXyzService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJoinTableAbcXyz> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((joinTableAbcXyz: HttpResponse<JoinTableAbcXyz>) => {
          if (joinTableAbcXyz.body) {
            return of(joinTableAbcXyz.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new JoinTableAbcXyz());
  }
}
