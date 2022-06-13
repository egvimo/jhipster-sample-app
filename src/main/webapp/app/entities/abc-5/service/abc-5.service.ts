import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc5, getAbc5Identifier } from '../abc-5.model';

export type EntityResponseType = HttpResponse<IAbc5>;
export type EntityArrayResponseType = HttpResponse<IAbc5[]>;

@Injectable({ providedIn: 'root' })
export class Abc5Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-5-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc5: IAbc5): Observable<EntityResponseType> {
    return this.http.post<IAbc5>(this.resourceUrl, abc5, { observe: 'response' });
  }

  update(abc5: IAbc5): Observable<EntityResponseType> {
    return this.http.put<IAbc5>(`${this.resourceUrl}/${getAbc5Identifier(abc5) as number}`, abc5, { observe: 'response' });
  }

  partialUpdate(abc5: IAbc5): Observable<EntityResponseType> {
    return this.http.patch<IAbc5>(`${this.resourceUrl}/${getAbc5Identifier(abc5) as number}`, abc5, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc5>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc5[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc5ToCollectionIfMissing(abc5Collection: IAbc5[], ...abc5sToCheck: (IAbc5 | null | undefined)[]): IAbc5[] {
    const abc5s: IAbc5[] = abc5sToCheck.filter(isPresent);
    if (abc5s.length > 0) {
      const abc5CollectionIdentifiers = abc5Collection.map(abc5Item => getAbc5Identifier(abc5Item)!);
      const abc5sToAdd = abc5s.filter(abc5Item => {
        const abc5Identifier = getAbc5Identifier(abc5Item);
        if (abc5Identifier == null || abc5CollectionIdentifiers.includes(abc5Identifier)) {
          return false;
        }
        abc5CollectionIdentifiers.push(abc5Identifier);
        return true;
      });
      return [...abc5sToAdd, ...abc5Collection];
    }
    return abc5Collection;
  }
}
