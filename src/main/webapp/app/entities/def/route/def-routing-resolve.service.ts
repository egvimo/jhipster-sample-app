import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDef, Def } from '../def.model';
import { DefService } from '../service/def.service';

@Injectable({ providedIn: 'root' })
export class DefRoutingResolveService implements Resolve<IDef> {
  constructor(protected service: DefService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDef> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((def: HttpResponse<Def>) => {
          if (def.body) {
            return of(def.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Def());
  }
}
