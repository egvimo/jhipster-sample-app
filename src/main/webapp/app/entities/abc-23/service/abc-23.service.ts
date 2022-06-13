import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc23, getAbc23Identifier } from '../abc-23.model';

export type EntityResponseType = HttpResponse<IAbc23>;
export type EntityArrayResponseType = HttpResponse<IAbc23[]>;

@Injectable({ providedIn: 'root' })
export class Abc23Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-23-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc23: IAbc23): Observable<EntityResponseType> {
    return this.http.post<IAbc23>(this.resourceUrl, abc23, { observe: 'response' });
  }

  update(abc23: IAbc23): Observable<EntityResponseType> {
    return this.http.put<IAbc23>(`${this.resourceUrl}/${getAbc23Identifier(abc23) as number}`, abc23, { observe: 'response' });
  }

  partialUpdate(abc23: IAbc23): Observable<EntityResponseType> {
    return this.http.patch<IAbc23>(`${this.resourceUrl}/${getAbc23Identifier(abc23) as number}`, abc23, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc23>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc23[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc23ToCollectionIfMissing(abc23Collection: IAbc23[], ...abc23sToCheck: (IAbc23 | null | undefined)[]): IAbc23[] {
    const abc23s: IAbc23[] = abc23sToCheck.filter(isPresent);
    if (abc23s.length > 0) {
      const abc23CollectionIdentifiers = abc23Collection.map(abc23Item => getAbc23Identifier(abc23Item)!);
      const abc23sToAdd = abc23s.filter(abc23Item => {
        const abc23Identifier = getAbc23Identifier(abc23Item);
        if (abc23Identifier == null || abc23CollectionIdentifiers.includes(abc23Identifier)) {
          return false;
        }
        abc23CollectionIdentifiers.push(abc23Identifier);
        return true;
      });
      return [...abc23sToAdd, ...abc23Collection];
    }
    return abc23Collection;
  }
}
