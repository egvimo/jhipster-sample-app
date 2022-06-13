import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc13, getAbc13Identifier } from '../abc-13.model';

export type EntityResponseType = HttpResponse<IAbc13>;
export type EntityArrayResponseType = HttpResponse<IAbc13[]>;

@Injectable({ providedIn: 'root' })
export class Abc13Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-13-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc13: IAbc13): Observable<EntityResponseType> {
    return this.http.post<IAbc13>(this.resourceUrl, abc13, { observe: 'response' });
  }

  update(abc13: IAbc13): Observable<EntityResponseType> {
    return this.http.put<IAbc13>(`${this.resourceUrl}/${getAbc13Identifier(abc13) as number}`, abc13, { observe: 'response' });
  }

  partialUpdate(abc13: IAbc13): Observable<EntityResponseType> {
    return this.http.patch<IAbc13>(`${this.resourceUrl}/${getAbc13Identifier(abc13) as number}`, abc13, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc13>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc13[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc13ToCollectionIfMissing(abc13Collection: IAbc13[], ...abc13sToCheck: (IAbc13 | null | undefined)[]): IAbc13[] {
    const abc13s: IAbc13[] = abc13sToCheck.filter(isPresent);
    if (abc13s.length > 0) {
      const abc13CollectionIdentifiers = abc13Collection.map(abc13Item => getAbc13Identifier(abc13Item)!);
      const abc13sToAdd = abc13s.filter(abc13Item => {
        const abc13Identifier = getAbc13Identifier(abc13Item);
        if (abc13Identifier == null || abc13CollectionIdentifiers.includes(abc13Identifier)) {
          return false;
        }
        abc13CollectionIdentifiers.push(abc13Identifier);
        return true;
      });
      return [...abc13sToAdd, ...abc13Collection];
    }
    return abc13Collection;
  }
}
