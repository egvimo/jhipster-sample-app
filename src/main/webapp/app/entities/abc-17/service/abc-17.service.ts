import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc17, getAbc17Identifier } from '../abc-17.model';

export type EntityResponseType = HttpResponse<IAbc17>;
export type EntityArrayResponseType = HttpResponse<IAbc17[]>;

@Injectable({ providedIn: 'root' })
export class Abc17Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-17-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc17: IAbc17): Observable<EntityResponseType> {
    return this.http.post<IAbc17>(this.resourceUrl, abc17, { observe: 'response' });
  }

  update(abc17: IAbc17): Observable<EntityResponseType> {
    return this.http.put<IAbc17>(`${this.resourceUrl}/${getAbc17Identifier(abc17) as number}`, abc17, { observe: 'response' });
  }

  partialUpdate(abc17: IAbc17): Observable<EntityResponseType> {
    return this.http.patch<IAbc17>(`${this.resourceUrl}/${getAbc17Identifier(abc17) as number}`, abc17, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc17>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc17[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc17ToCollectionIfMissing(abc17Collection: IAbc17[], ...abc17sToCheck: (IAbc17 | null | undefined)[]): IAbc17[] {
    const abc17s: IAbc17[] = abc17sToCheck.filter(isPresent);
    if (abc17s.length > 0) {
      const abc17CollectionIdentifiers = abc17Collection.map(abc17Item => getAbc17Identifier(abc17Item)!);
      const abc17sToAdd = abc17s.filter(abc17Item => {
        const abc17Identifier = getAbc17Identifier(abc17Item);
        if (abc17Identifier == null || abc17CollectionIdentifiers.includes(abc17Identifier)) {
          return false;
        }
        abc17CollectionIdentifiers.push(abc17Identifier);
        return true;
      });
      return [...abc17sToAdd, ...abc17Collection];
    }
    return abc17Collection;
  }
}
