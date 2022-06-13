import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc0, getAbc0Identifier } from '../abc-0.model';

export type EntityResponseType = HttpResponse<IAbc0>;
export type EntityArrayResponseType = HttpResponse<IAbc0[]>;

@Injectable({ providedIn: 'root' })
export class Abc0Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-0-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc0: IAbc0): Observable<EntityResponseType> {
    return this.http.post<IAbc0>(this.resourceUrl, abc0, { observe: 'response' });
  }

  update(abc0: IAbc0): Observable<EntityResponseType> {
    return this.http.put<IAbc0>(`${this.resourceUrl}/${getAbc0Identifier(abc0) as number}`, abc0, { observe: 'response' });
  }

  partialUpdate(abc0: IAbc0): Observable<EntityResponseType> {
    return this.http.patch<IAbc0>(`${this.resourceUrl}/${getAbc0Identifier(abc0) as number}`, abc0, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc0>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc0[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc0ToCollectionIfMissing(abc0Collection: IAbc0[], ...abc0sToCheck: (IAbc0 | null | undefined)[]): IAbc0[] {
    const abc0s: IAbc0[] = abc0sToCheck.filter(isPresent);
    if (abc0s.length > 0) {
      const abc0CollectionIdentifiers = abc0Collection.map(abc0Item => getAbc0Identifier(abc0Item)!);
      const abc0sToAdd = abc0s.filter(abc0Item => {
        const abc0Identifier = getAbc0Identifier(abc0Item);
        if (abc0Identifier == null || abc0CollectionIdentifiers.includes(abc0Identifier)) {
          return false;
        }
        abc0CollectionIdentifiers.push(abc0Identifier);
        return true;
      });
      return [...abc0sToAdd, ...abc0Collection];
    }
    return abc0Collection;
  }
}
