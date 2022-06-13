import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc6, getAbc6Identifier } from '../abc-6.model';

export type EntityResponseType = HttpResponse<IAbc6>;
export type EntityArrayResponseType = HttpResponse<IAbc6[]>;

@Injectable({ providedIn: 'root' })
export class Abc6Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-6-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc6: IAbc6): Observable<EntityResponseType> {
    return this.http.post<IAbc6>(this.resourceUrl, abc6, { observe: 'response' });
  }

  update(abc6: IAbc6): Observable<EntityResponseType> {
    return this.http.put<IAbc6>(`${this.resourceUrl}/${getAbc6Identifier(abc6) as number}`, abc6, { observe: 'response' });
  }

  partialUpdate(abc6: IAbc6): Observable<EntityResponseType> {
    return this.http.patch<IAbc6>(`${this.resourceUrl}/${getAbc6Identifier(abc6) as number}`, abc6, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc6>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc6[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc6ToCollectionIfMissing(abc6Collection: IAbc6[], ...abc6sToCheck: (IAbc6 | null | undefined)[]): IAbc6[] {
    const abc6s: IAbc6[] = abc6sToCheck.filter(isPresent);
    if (abc6s.length > 0) {
      const abc6CollectionIdentifiers = abc6Collection.map(abc6Item => getAbc6Identifier(abc6Item)!);
      const abc6sToAdd = abc6s.filter(abc6Item => {
        const abc6Identifier = getAbc6Identifier(abc6Item);
        if (abc6Identifier == null || abc6CollectionIdentifiers.includes(abc6Identifier)) {
          return false;
        }
        abc6CollectionIdentifiers.push(abc6Identifier);
        return true;
      });
      return [...abc6sToAdd, ...abc6Collection];
    }
    return abc6Collection;
  }
}
