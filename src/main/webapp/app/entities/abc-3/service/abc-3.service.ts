import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc3, getAbc3Identifier } from '../abc-3.model';

export type EntityResponseType = HttpResponse<IAbc3>;
export type EntityArrayResponseType = HttpResponse<IAbc3[]>;

@Injectable({ providedIn: 'root' })
export class Abc3Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-3-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc3: IAbc3): Observable<EntityResponseType> {
    return this.http.post<IAbc3>(this.resourceUrl, abc3, { observe: 'response' });
  }

  update(abc3: IAbc3): Observable<EntityResponseType> {
    return this.http.put<IAbc3>(`${this.resourceUrl}/${getAbc3Identifier(abc3) as number}`, abc3, { observe: 'response' });
  }

  partialUpdate(abc3: IAbc3): Observable<EntityResponseType> {
    return this.http.patch<IAbc3>(`${this.resourceUrl}/${getAbc3Identifier(abc3) as number}`, abc3, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc3>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc3[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc3ToCollectionIfMissing(abc3Collection: IAbc3[], ...abc3sToCheck: (IAbc3 | null | undefined)[]): IAbc3[] {
    const abc3s: IAbc3[] = abc3sToCheck.filter(isPresent);
    if (abc3s.length > 0) {
      const abc3CollectionIdentifiers = abc3Collection.map(abc3Item => getAbc3Identifier(abc3Item)!);
      const abc3sToAdd = abc3s.filter(abc3Item => {
        const abc3Identifier = getAbc3Identifier(abc3Item);
        if (abc3Identifier == null || abc3CollectionIdentifiers.includes(abc3Identifier)) {
          return false;
        }
        abc3CollectionIdentifiers.push(abc3Identifier);
        return true;
      });
      return [...abc3sToAdd, ...abc3Collection];
    }
    return abc3Collection;
  }
}
