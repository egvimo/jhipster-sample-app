import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc21, getAbc21Identifier } from '../abc-21.model';

export type EntityResponseType = HttpResponse<IAbc21>;
export type EntityArrayResponseType = HttpResponse<IAbc21[]>;

@Injectable({ providedIn: 'root' })
export class Abc21Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-21-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc21: IAbc21): Observable<EntityResponseType> {
    return this.http.post<IAbc21>(this.resourceUrl, abc21, { observe: 'response' });
  }

  update(abc21: IAbc21): Observable<EntityResponseType> {
    return this.http.put<IAbc21>(`${this.resourceUrl}/${getAbc21Identifier(abc21) as number}`, abc21, { observe: 'response' });
  }

  partialUpdate(abc21: IAbc21): Observable<EntityResponseType> {
    return this.http.patch<IAbc21>(`${this.resourceUrl}/${getAbc21Identifier(abc21) as number}`, abc21, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc21>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc21[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc21ToCollectionIfMissing(abc21Collection: IAbc21[], ...abc21sToCheck: (IAbc21 | null | undefined)[]): IAbc21[] {
    const abc21s: IAbc21[] = abc21sToCheck.filter(isPresent);
    if (abc21s.length > 0) {
      const abc21CollectionIdentifiers = abc21Collection.map(abc21Item => getAbc21Identifier(abc21Item)!);
      const abc21sToAdd = abc21s.filter(abc21Item => {
        const abc21Identifier = getAbc21Identifier(abc21Item);
        if (abc21Identifier == null || abc21CollectionIdentifiers.includes(abc21Identifier)) {
          return false;
        }
        abc21CollectionIdentifiers.push(abc21Identifier);
        return true;
      });
      return [...abc21sToAdd, ...abc21Collection];
    }
    return abc21Collection;
  }
}
