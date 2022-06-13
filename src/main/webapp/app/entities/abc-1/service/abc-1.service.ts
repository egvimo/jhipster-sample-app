import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc1, getAbc1Identifier } from '../abc-1.model';

export type EntityResponseType = HttpResponse<IAbc1>;
export type EntityArrayResponseType = HttpResponse<IAbc1[]>;

@Injectable({ providedIn: 'root' })
export class Abc1Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-1-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc1: IAbc1): Observable<EntityResponseType> {
    return this.http.post<IAbc1>(this.resourceUrl, abc1, { observe: 'response' });
  }

  update(abc1: IAbc1): Observable<EntityResponseType> {
    return this.http.put<IAbc1>(`${this.resourceUrl}/${getAbc1Identifier(abc1) as number}`, abc1, { observe: 'response' });
  }

  partialUpdate(abc1: IAbc1): Observable<EntityResponseType> {
    return this.http.patch<IAbc1>(`${this.resourceUrl}/${getAbc1Identifier(abc1) as number}`, abc1, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc1>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc1[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc1ToCollectionIfMissing(abc1Collection: IAbc1[], ...abc1sToCheck: (IAbc1 | null | undefined)[]): IAbc1[] {
    const abc1s: IAbc1[] = abc1sToCheck.filter(isPresent);
    if (abc1s.length > 0) {
      const abc1CollectionIdentifiers = abc1Collection.map(abc1Item => getAbc1Identifier(abc1Item)!);
      const abc1sToAdd = abc1s.filter(abc1Item => {
        const abc1Identifier = getAbc1Identifier(abc1Item);
        if (abc1Identifier == null || abc1CollectionIdentifiers.includes(abc1Identifier)) {
          return false;
        }
        abc1CollectionIdentifiers.push(abc1Identifier);
        return true;
      });
      return [...abc1sToAdd, ...abc1Collection];
    }
    return abc1Collection;
  }
}
