import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc2, getAbc2Identifier } from '../abc-2.model';

export type EntityResponseType = HttpResponse<IAbc2>;
export type EntityArrayResponseType = HttpResponse<IAbc2[]>;

@Injectable({ providedIn: 'root' })
export class Abc2Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-2-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc2: IAbc2): Observable<EntityResponseType> {
    return this.http.post<IAbc2>(this.resourceUrl, abc2, { observe: 'response' });
  }

  update(abc2: IAbc2): Observable<EntityResponseType> {
    return this.http.put<IAbc2>(`${this.resourceUrl}/${getAbc2Identifier(abc2) as number}`, abc2, { observe: 'response' });
  }

  partialUpdate(abc2: IAbc2): Observable<EntityResponseType> {
    return this.http.patch<IAbc2>(`${this.resourceUrl}/${getAbc2Identifier(abc2) as number}`, abc2, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc2>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc2[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc2ToCollectionIfMissing(abc2Collection: IAbc2[], ...abc2sToCheck: (IAbc2 | null | undefined)[]): IAbc2[] {
    const abc2s: IAbc2[] = abc2sToCheck.filter(isPresent);
    if (abc2s.length > 0) {
      const abc2CollectionIdentifiers = abc2Collection.map(abc2Item => getAbc2Identifier(abc2Item)!);
      const abc2sToAdd = abc2s.filter(abc2Item => {
        const abc2Identifier = getAbc2Identifier(abc2Item);
        if (abc2Identifier == null || abc2CollectionIdentifiers.includes(abc2Identifier)) {
          return false;
        }
        abc2CollectionIdentifiers.push(abc2Identifier);
        return true;
      });
      return [...abc2sToAdd, ...abc2Collection];
    }
    return abc2Collection;
  }
}
