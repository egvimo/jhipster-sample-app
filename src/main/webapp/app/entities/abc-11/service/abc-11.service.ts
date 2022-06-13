import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc11, getAbc11Identifier } from '../abc-11.model';

export type EntityResponseType = HttpResponse<IAbc11>;
export type EntityArrayResponseType = HttpResponse<IAbc11[]>;

@Injectable({ providedIn: 'root' })
export class Abc11Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-11-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc11: IAbc11): Observable<EntityResponseType> {
    return this.http.post<IAbc11>(this.resourceUrl, abc11, { observe: 'response' });
  }

  update(abc11: IAbc11): Observable<EntityResponseType> {
    return this.http.put<IAbc11>(`${this.resourceUrl}/${getAbc11Identifier(abc11) as number}`, abc11, { observe: 'response' });
  }

  partialUpdate(abc11: IAbc11): Observable<EntityResponseType> {
    return this.http.patch<IAbc11>(`${this.resourceUrl}/${getAbc11Identifier(abc11) as number}`, abc11, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc11>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc11[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc11ToCollectionIfMissing(abc11Collection: IAbc11[], ...abc11sToCheck: (IAbc11 | null | undefined)[]): IAbc11[] {
    const abc11s: IAbc11[] = abc11sToCheck.filter(isPresent);
    if (abc11s.length > 0) {
      const abc11CollectionIdentifiers = abc11Collection.map(abc11Item => getAbc11Identifier(abc11Item)!);
      const abc11sToAdd = abc11s.filter(abc11Item => {
        const abc11Identifier = getAbc11Identifier(abc11Item);
        if (abc11Identifier == null || abc11CollectionIdentifiers.includes(abc11Identifier)) {
          return false;
        }
        abc11CollectionIdentifiers.push(abc11Identifier);
        return true;
      });
      return [...abc11sToAdd, ...abc11Collection];
    }
    return abc11Collection;
  }
}
