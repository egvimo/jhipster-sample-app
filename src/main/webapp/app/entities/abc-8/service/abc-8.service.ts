import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc8, getAbc8Identifier } from '../abc-8.model';

export type EntityResponseType = HttpResponse<IAbc8>;
export type EntityArrayResponseType = HttpResponse<IAbc8[]>;

@Injectable({ providedIn: 'root' })
export class Abc8Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-8-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc8: IAbc8): Observable<EntityResponseType> {
    return this.http.post<IAbc8>(this.resourceUrl, abc8, { observe: 'response' });
  }

  update(abc8: IAbc8): Observable<EntityResponseType> {
    return this.http.put<IAbc8>(`${this.resourceUrl}/${getAbc8Identifier(abc8) as number}`, abc8, { observe: 'response' });
  }

  partialUpdate(abc8: IAbc8): Observable<EntityResponseType> {
    return this.http.patch<IAbc8>(`${this.resourceUrl}/${getAbc8Identifier(abc8) as number}`, abc8, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc8>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc8[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc8ToCollectionIfMissing(abc8Collection: IAbc8[], ...abc8sToCheck: (IAbc8 | null | undefined)[]): IAbc8[] {
    const abc8s: IAbc8[] = abc8sToCheck.filter(isPresent);
    if (abc8s.length > 0) {
      const abc8CollectionIdentifiers = abc8Collection.map(abc8Item => getAbc8Identifier(abc8Item)!);
      const abc8sToAdd = abc8s.filter(abc8Item => {
        const abc8Identifier = getAbc8Identifier(abc8Item);
        if (abc8Identifier == null || abc8CollectionIdentifiers.includes(abc8Identifier)) {
          return false;
        }
        abc8CollectionIdentifiers.push(abc8Identifier);
        return true;
      });
      return [...abc8sToAdd, ...abc8Collection];
    }
    return abc8Collection;
  }
}
