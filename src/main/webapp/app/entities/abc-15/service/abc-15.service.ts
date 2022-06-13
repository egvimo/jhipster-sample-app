import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc15, getAbc15Identifier } from '../abc-15.model';

export type EntityResponseType = HttpResponse<IAbc15>;
export type EntityArrayResponseType = HttpResponse<IAbc15[]>;

@Injectable({ providedIn: 'root' })
export class Abc15Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-15-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc15: IAbc15): Observable<EntityResponseType> {
    return this.http.post<IAbc15>(this.resourceUrl, abc15, { observe: 'response' });
  }

  update(abc15: IAbc15): Observable<EntityResponseType> {
    return this.http.put<IAbc15>(`${this.resourceUrl}/${getAbc15Identifier(abc15) as number}`, abc15, { observe: 'response' });
  }

  partialUpdate(abc15: IAbc15): Observable<EntityResponseType> {
    return this.http.patch<IAbc15>(`${this.resourceUrl}/${getAbc15Identifier(abc15) as number}`, abc15, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc15>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc15[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc15ToCollectionIfMissing(abc15Collection: IAbc15[], ...abc15sToCheck: (IAbc15 | null | undefined)[]): IAbc15[] {
    const abc15s: IAbc15[] = abc15sToCheck.filter(isPresent);
    if (abc15s.length > 0) {
      const abc15CollectionIdentifiers = abc15Collection.map(abc15Item => getAbc15Identifier(abc15Item)!);
      const abc15sToAdd = abc15s.filter(abc15Item => {
        const abc15Identifier = getAbc15Identifier(abc15Item);
        if (abc15Identifier == null || abc15CollectionIdentifiers.includes(abc15Identifier)) {
          return false;
        }
        abc15CollectionIdentifiers.push(abc15Identifier);
        return true;
      });
      return [...abc15sToAdd, ...abc15Collection];
    }
    return abc15Collection;
  }
}
