import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc14, getAbc14Identifier } from '../abc-14.model';

export type EntityResponseType = HttpResponse<IAbc14>;
export type EntityArrayResponseType = HttpResponse<IAbc14[]>;

@Injectable({ providedIn: 'root' })
export class Abc14Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-14-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc14: IAbc14): Observable<EntityResponseType> {
    return this.http.post<IAbc14>(this.resourceUrl, abc14, { observe: 'response' });
  }

  update(abc14: IAbc14): Observable<EntityResponseType> {
    return this.http.put<IAbc14>(`${this.resourceUrl}/${getAbc14Identifier(abc14) as number}`, abc14, { observe: 'response' });
  }

  partialUpdate(abc14: IAbc14): Observable<EntityResponseType> {
    return this.http.patch<IAbc14>(`${this.resourceUrl}/${getAbc14Identifier(abc14) as number}`, abc14, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc14>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc14[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc14ToCollectionIfMissing(abc14Collection: IAbc14[], ...abc14sToCheck: (IAbc14 | null | undefined)[]): IAbc14[] {
    const abc14s: IAbc14[] = abc14sToCheck.filter(isPresent);
    if (abc14s.length > 0) {
      const abc14CollectionIdentifiers = abc14Collection.map(abc14Item => getAbc14Identifier(abc14Item)!);
      const abc14sToAdd = abc14s.filter(abc14Item => {
        const abc14Identifier = getAbc14Identifier(abc14Item);
        if (abc14Identifier == null || abc14CollectionIdentifiers.includes(abc14Identifier)) {
          return false;
        }
        abc14CollectionIdentifiers.push(abc14Identifier);
        return true;
      });
      return [...abc14sToAdd, ...abc14Collection];
    }
    return abc14Collection;
  }
}
