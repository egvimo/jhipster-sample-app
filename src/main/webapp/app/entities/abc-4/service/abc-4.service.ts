import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc4, getAbc4Identifier } from '../abc-4.model';

export type EntityResponseType = HttpResponse<IAbc4>;
export type EntityArrayResponseType = HttpResponse<IAbc4[]>;

@Injectable({ providedIn: 'root' })
export class Abc4Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-4-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc4: IAbc4): Observable<EntityResponseType> {
    return this.http.post<IAbc4>(this.resourceUrl, abc4, { observe: 'response' });
  }

  update(abc4: IAbc4): Observable<EntityResponseType> {
    return this.http.put<IAbc4>(`${this.resourceUrl}/${getAbc4Identifier(abc4) as number}`, abc4, { observe: 'response' });
  }

  partialUpdate(abc4: IAbc4): Observable<EntityResponseType> {
    return this.http.patch<IAbc4>(`${this.resourceUrl}/${getAbc4Identifier(abc4) as number}`, abc4, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc4>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc4[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc4ToCollectionIfMissing(abc4Collection: IAbc4[], ...abc4sToCheck: (IAbc4 | null | undefined)[]): IAbc4[] {
    const abc4s: IAbc4[] = abc4sToCheck.filter(isPresent);
    if (abc4s.length > 0) {
      const abc4CollectionIdentifiers = abc4Collection.map(abc4Item => getAbc4Identifier(abc4Item)!);
      const abc4sToAdd = abc4s.filter(abc4Item => {
        const abc4Identifier = getAbc4Identifier(abc4Item);
        if (abc4Identifier == null || abc4CollectionIdentifiers.includes(abc4Identifier)) {
          return false;
        }
        abc4CollectionIdentifiers.push(abc4Identifier);
        return true;
      });
      return [...abc4sToAdd, ...abc4Collection];
    }
    return abc4Collection;
  }
}
