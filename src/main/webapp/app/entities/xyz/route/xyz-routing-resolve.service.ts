import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IXyz, Xyz } from '../xyz.model';
import { XyzService } from '../service/xyz.service';

@Injectable({ providedIn: 'root' })
export class XyzRoutingResolveService implements Resolve<IXyz> {
  constructor(protected service: XyzService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IXyz> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((xyz: HttpResponse<Xyz>) => {
          if (xyz.body) {
            return of(xyz.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Xyz());
  }
}
