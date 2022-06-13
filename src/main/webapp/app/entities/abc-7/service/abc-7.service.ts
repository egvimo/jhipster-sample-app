import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc7, getAbc7Identifier } from '../abc-7.model';

export type EntityResponseType = HttpResponse<IAbc7>;
export type EntityArrayResponseType = HttpResponse<IAbc7[]>;

@Injectable({ providedIn: 'root' })
export class Abc7Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-7-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc7: IAbc7): Observable<EntityResponseType> {
    return this.http.post<IAbc7>(this.resourceUrl, abc7, { observe: 'response' });
  }

  update(abc7: IAbc7): Observable<EntityResponseType> {
    return this.http.put<IAbc7>(`${this.resourceUrl}/${getAbc7Identifier(abc7) as number}`, abc7, { observe: 'response' });
  }

  partialUpdate(abc7: IAbc7): Observable<EntityResponseType> {
    return this.http.patch<IAbc7>(`${this.resourceUrl}/${getAbc7Identifier(abc7) as number}`, abc7, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc7>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc7[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc7ToCollectionIfMissing(abc7Collection: IAbc7[], ...abc7sToCheck: (IAbc7 | null | undefined)[]): IAbc7[] {
    const abc7s: IAbc7[] = abc7sToCheck.filter(isPresent);
    if (abc7s.length > 0) {
      const abc7CollectionIdentifiers = abc7Collection.map(abc7Item => getAbc7Identifier(abc7Item)!);
      const abc7sToAdd = abc7s.filter(abc7Item => {
        const abc7Identifier = getAbc7Identifier(abc7Item);
        if (abc7Identifier == null || abc7CollectionIdentifiers.includes(abc7Identifier)) {
          return false;
        }
        abc7CollectionIdentifiers.push(abc7Identifier);
        return true;
      });
      return [...abc7sToAdd, ...abc7Collection];
    }
    return abc7Collection;
  }
}
