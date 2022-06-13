import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc27, getAbc27Identifier } from '../abc-27.model';

export type EntityResponseType = HttpResponse<IAbc27>;
export type EntityArrayResponseType = HttpResponse<IAbc27[]>;

@Injectable({ providedIn: 'root' })
export class Abc27Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-27-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc27: IAbc27): Observable<EntityResponseType> {
    return this.http.post<IAbc27>(this.resourceUrl, abc27, { observe: 'response' });
  }

  update(abc27: IAbc27): Observable<EntityResponseType> {
    return this.http.put<IAbc27>(`${this.resourceUrl}/${getAbc27Identifier(abc27) as number}`, abc27, { observe: 'response' });
  }

  partialUpdate(abc27: IAbc27): Observable<EntityResponseType> {
    return this.http.patch<IAbc27>(`${this.resourceUrl}/${getAbc27Identifier(abc27) as number}`, abc27, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc27>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc27[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc27ToCollectionIfMissing(abc27Collection: IAbc27[], ...abc27sToCheck: (IAbc27 | null | undefined)[]): IAbc27[] {
    const abc27s: IAbc27[] = abc27sToCheck.filter(isPresent);
    if (abc27s.length > 0) {
      const abc27CollectionIdentifiers = abc27Collection.map(abc27Item => getAbc27Identifier(abc27Item)!);
      const abc27sToAdd = abc27s.filter(abc27Item => {
        const abc27Identifier = getAbc27Identifier(abc27Item);
        if (abc27Identifier == null || abc27CollectionIdentifiers.includes(abc27Identifier)) {
          return false;
        }
        abc27CollectionIdentifiers.push(abc27Identifier);
        return true;
      });
      return [...abc27sToAdd, ...abc27Collection];
    }
    return abc27Collection;
  }
}
