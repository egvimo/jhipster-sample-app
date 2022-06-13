import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc28, getAbc28Identifier } from '../abc-28.model';

export type EntityResponseType = HttpResponse<IAbc28>;
export type EntityArrayResponseType = HttpResponse<IAbc28[]>;

@Injectable({ providedIn: 'root' })
export class Abc28Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-28-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc28: IAbc28): Observable<EntityResponseType> {
    return this.http.post<IAbc28>(this.resourceUrl, abc28, { observe: 'response' });
  }

  update(abc28: IAbc28): Observable<EntityResponseType> {
    return this.http.put<IAbc28>(`${this.resourceUrl}/${getAbc28Identifier(abc28) as number}`, abc28, { observe: 'response' });
  }

  partialUpdate(abc28: IAbc28): Observable<EntityResponseType> {
    return this.http.patch<IAbc28>(`${this.resourceUrl}/${getAbc28Identifier(abc28) as number}`, abc28, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc28>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc28[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc28ToCollectionIfMissing(abc28Collection: IAbc28[], ...abc28sToCheck: (IAbc28 | null | undefined)[]): IAbc28[] {
    const abc28s: IAbc28[] = abc28sToCheck.filter(isPresent);
    if (abc28s.length > 0) {
      const abc28CollectionIdentifiers = abc28Collection.map(abc28Item => getAbc28Identifier(abc28Item)!);
      const abc28sToAdd = abc28s.filter(abc28Item => {
        const abc28Identifier = getAbc28Identifier(abc28Item);
        if (abc28Identifier == null || abc28CollectionIdentifiers.includes(abc28Identifier)) {
          return false;
        }
        abc28CollectionIdentifiers.push(abc28Identifier);
        return true;
      });
      return [...abc28sToAdd, ...abc28Collection];
    }
    return abc28Collection;
  }
}
