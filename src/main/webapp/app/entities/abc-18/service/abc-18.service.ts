import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc18, getAbc18Identifier } from '../abc-18.model';

export type EntityResponseType = HttpResponse<IAbc18>;
export type EntityArrayResponseType = HttpResponse<IAbc18[]>;

@Injectable({ providedIn: 'root' })
export class Abc18Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-18-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc18: IAbc18): Observable<EntityResponseType> {
    return this.http.post<IAbc18>(this.resourceUrl, abc18, { observe: 'response' });
  }

  update(abc18: IAbc18): Observable<EntityResponseType> {
    return this.http.put<IAbc18>(`${this.resourceUrl}/${getAbc18Identifier(abc18) as number}`, abc18, { observe: 'response' });
  }

  partialUpdate(abc18: IAbc18): Observable<EntityResponseType> {
    return this.http.patch<IAbc18>(`${this.resourceUrl}/${getAbc18Identifier(abc18) as number}`, abc18, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc18>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc18[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc18ToCollectionIfMissing(abc18Collection: IAbc18[], ...abc18sToCheck: (IAbc18 | null | undefined)[]): IAbc18[] {
    const abc18s: IAbc18[] = abc18sToCheck.filter(isPresent);
    if (abc18s.length > 0) {
      const abc18CollectionIdentifiers = abc18Collection.map(abc18Item => getAbc18Identifier(abc18Item)!);
      const abc18sToAdd = abc18s.filter(abc18Item => {
        const abc18Identifier = getAbc18Identifier(abc18Item);
        if (abc18Identifier == null || abc18CollectionIdentifiers.includes(abc18Identifier)) {
          return false;
        }
        abc18CollectionIdentifiers.push(abc18Identifier);
        return true;
      });
      return [...abc18sToAdd, ...abc18Collection];
    }
    return abc18Collection;
  }
}
