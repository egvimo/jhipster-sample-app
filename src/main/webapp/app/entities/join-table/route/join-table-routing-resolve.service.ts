import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJoinTable, JoinTable } from '../join-table.model';
import { JoinTableService } from '../service/join-table.service';

@Injectable({ providedIn: 'root' })
export class JoinTableRoutingResolveService implements Resolve<IJoinTable> {
  constructor(protected service: JoinTableService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJoinTable> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((joinTable: HttpResponse<JoinTable>) => {
          if (joinTable.body) {
            return of(joinTable.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new JoinTable());
  }
}
