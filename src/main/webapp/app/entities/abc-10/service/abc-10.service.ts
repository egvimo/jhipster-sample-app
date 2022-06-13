import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc10, getAbc10Identifier } from '../abc-10.model';

export type EntityResponseType = HttpResponse<IAbc10>;
export type EntityArrayResponseType = HttpResponse<IAbc10[]>;

@Injectable({ providedIn: 'root' })
export class Abc10Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-10-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc10: IAbc10): Observable<EntityResponseType> {
    return this.http.post<IAbc10>(this.resourceUrl, abc10, { observe: 'response' });
  }

  update(abc10: IAbc10): Observable<EntityResponseType> {
    return this.http.put<IAbc10>(`${this.resourceUrl}/${getAbc10Identifier(abc10) as number}`, abc10, { observe: 'response' });
  }

  partialUpdate(abc10: IAbc10): Observable<EntityResponseType> {
    return this.http.patch<IAbc10>(`${this.resourceUrl}/${getAbc10Identifier(abc10) as number}`, abc10, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc10>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc10[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc10ToCollectionIfMissing(abc10Collection: IAbc10[], ...abc10sToCheck: (IAbc10 | null | undefined)[]): IAbc10[] {
    const abc10s: IAbc10[] = abc10sToCheck.filter(isPresent);
    if (abc10s.length > 0) {
      const abc10CollectionIdentifiers = abc10Collection.map(abc10Item => getAbc10Identifier(abc10Item)!);
      const abc10sToAdd = abc10s.filter(abc10Item => {
        const abc10Identifier = getAbc10Identifier(abc10Item);
        if (abc10Identifier == null || abc10CollectionIdentifiers.includes(abc10Identifier)) {
          return false;
        }
        abc10CollectionIdentifiers.push(abc10Identifier);
        return true;
      });
      return [...abc10sToAdd, ...abc10Collection];
    }
    return abc10Collection;
  }
}
