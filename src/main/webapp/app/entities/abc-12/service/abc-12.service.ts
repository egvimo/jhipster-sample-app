import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc12, getAbc12Identifier } from '../abc-12.model';

export type EntityResponseType = HttpResponse<IAbc12>;
export type EntityArrayResponseType = HttpResponse<IAbc12[]>;

@Injectable({ providedIn: 'root' })
export class Abc12Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-12-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc12: IAbc12): Observable<EntityResponseType> {
    return this.http.post<IAbc12>(this.resourceUrl, abc12, { observe: 'response' });
  }

  update(abc12: IAbc12): Observable<EntityResponseType> {
    return this.http.put<IAbc12>(`${this.resourceUrl}/${getAbc12Identifier(abc12) as number}`, abc12, { observe: 'response' });
  }

  partialUpdate(abc12: IAbc12): Observable<EntityResponseType> {
    return this.http.patch<IAbc12>(`${this.resourceUrl}/${getAbc12Identifier(abc12) as number}`, abc12, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc12>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc12[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc12ToCollectionIfMissing(abc12Collection: IAbc12[], ...abc12sToCheck: (IAbc12 | null | undefined)[]): IAbc12[] {
    const abc12s: IAbc12[] = abc12sToCheck.filter(isPresent);
    if (abc12s.length > 0) {
      const abc12CollectionIdentifiers = abc12Collection.map(abc12Item => getAbc12Identifier(abc12Item)!);
      const abc12sToAdd = abc12s.filter(abc12Item => {
        const abc12Identifier = getAbc12Identifier(abc12Item);
        if (abc12Identifier == null || abc12CollectionIdentifiers.includes(abc12Identifier)) {
          return false;
        }
        abc12CollectionIdentifiers.push(abc12Identifier);
        return true;
      });
      return [...abc12sToAdd, ...abc12Collection];
    }
    return abc12Collection;
  }
}
