import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc9, getAbc9Identifier } from '../abc-9.model';

export type EntityResponseType = HttpResponse<IAbc9>;
export type EntityArrayResponseType = HttpResponse<IAbc9[]>;

@Injectable({ providedIn: 'root' })
export class Abc9Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-9-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc9: IAbc9): Observable<EntityResponseType> {
    return this.http.post<IAbc9>(this.resourceUrl, abc9, { observe: 'response' });
  }

  update(abc9: IAbc9): Observable<EntityResponseType> {
    return this.http.put<IAbc9>(`${this.resourceUrl}/${getAbc9Identifier(abc9) as number}`, abc9, { observe: 'response' });
  }

  partialUpdate(abc9: IAbc9): Observable<EntityResponseType> {
    return this.http.patch<IAbc9>(`${this.resourceUrl}/${getAbc9Identifier(abc9) as number}`, abc9, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc9>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc9[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc9ToCollectionIfMissing(abc9Collection: IAbc9[], ...abc9sToCheck: (IAbc9 | null | undefined)[]): IAbc9[] {
    const abc9s: IAbc9[] = abc9sToCheck.filter(isPresent);
    if (abc9s.length > 0) {
      const abc9CollectionIdentifiers = abc9Collection.map(abc9Item => getAbc9Identifier(abc9Item)!);
      const abc9sToAdd = abc9s.filter(abc9Item => {
        const abc9Identifier = getAbc9Identifier(abc9Item);
        if (abc9Identifier == null || abc9CollectionIdentifiers.includes(abc9Identifier)) {
          return false;
        }
        abc9CollectionIdentifiers.push(abc9Identifier);
        return true;
      });
      return [...abc9sToAdd, ...abc9Collection];
    }
    return abc9Collection;
  }
}
