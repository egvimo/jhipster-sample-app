import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc22, getAbc22Identifier } from '../abc-22.model';

export type EntityResponseType = HttpResponse<IAbc22>;
export type EntityArrayResponseType = HttpResponse<IAbc22[]>;

@Injectable({ providedIn: 'root' })
export class Abc22Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-22-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc22: IAbc22): Observable<EntityResponseType> {
    return this.http.post<IAbc22>(this.resourceUrl, abc22, { observe: 'response' });
  }

  update(abc22: IAbc22): Observable<EntityResponseType> {
    return this.http.put<IAbc22>(`${this.resourceUrl}/${getAbc22Identifier(abc22) as number}`, abc22, { observe: 'response' });
  }

  partialUpdate(abc22: IAbc22): Observable<EntityResponseType> {
    return this.http.patch<IAbc22>(`${this.resourceUrl}/${getAbc22Identifier(abc22) as number}`, abc22, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc22>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc22[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc22ToCollectionIfMissing(abc22Collection: IAbc22[], ...abc22sToCheck: (IAbc22 | null | undefined)[]): IAbc22[] {
    const abc22s: IAbc22[] = abc22sToCheck.filter(isPresent);
    if (abc22s.length > 0) {
      const abc22CollectionIdentifiers = abc22Collection.map(abc22Item => getAbc22Identifier(abc22Item)!);
      const abc22sToAdd = abc22s.filter(abc22Item => {
        const abc22Identifier = getAbc22Identifier(abc22Item);
        if (abc22Identifier == null || abc22CollectionIdentifiers.includes(abc22Identifier)) {
          return false;
        }
        abc22CollectionIdentifiers.push(abc22Identifier);
        return true;
      });
      return [...abc22sToAdd, ...abc22Collection];
    }
    return abc22Collection;
  }
}
