import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc25, getAbc25Identifier } from '../abc-25.model';

export type EntityResponseType = HttpResponse<IAbc25>;
export type EntityArrayResponseType = HttpResponse<IAbc25[]>;

@Injectable({ providedIn: 'root' })
export class Abc25Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-25-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc25: IAbc25): Observable<EntityResponseType> {
    return this.http.post<IAbc25>(this.resourceUrl, abc25, { observe: 'response' });
  }

  update(abc25: IAbc25): Observable<EntityResponseType> {
    return this.http.put<IAbc25>(`${this.resourceUrl}/${getAbc25Identifier(abc25) as number}`, abc25, { observe: 'response' });
  }

  partialUpdate(abc25: IAbc25): Observable<EntityResponseType> {
    return this.http.patch<IAbc25>(`${this.resourceUrl}/${getAbc25Identifier(abc25) as number}`, abc25, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc25>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc25[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc25ToCollectionIfMissing(abc25Collection: IAbc25[], ...abc25sToCheck: (IAbc25 | null | undefined)[]): IAbc25[] {
    const abc25s: IAbc25[] = abc25sToCheck.filter(isPresent);
    if (abc25s.length > 0) {
      const abc25CollectionIdentifiers = abc25Collection.map(abc25Item => getAbc25Identifier(abc25Item)!);
      const abc25sToAdd = abc25s.filter(abc25Item => {
        const abc25Identifier = getAbc25Identifier(abc25Item);
        if (abc25Identifier == null || abc25CollectionIdentifiers.includes(abc25Identifier)) {
          return false;
        }
        abc25CollectionIdentifiers.push(abc25Identifier);
        return true;
      });
      return [...abc25sToAdd, ...abc25Collection];
    }
    return abc25Collection;
  }
}
