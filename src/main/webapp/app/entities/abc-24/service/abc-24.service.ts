import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc24, getAbc24Identifier } from '../abc-24.model';

export type EntityResponseType = HttpResponse<IAbc24>;
export type EntityArrayResponseType = HttpResponse<IAbc24[]>;

@Injectable({ providedIn: 'root' })
export class Abc24Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-24-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc24: IAbc24): Observable<EntityResponseType> {
    return this.http.post<IAbc24>(this.resourceUrl, abc24, { observe: 'response' });
  }

  update(abc24: IAbc24): Observable<EntityResponseType> {
    return this.http.put<IAbc24>(`${this.resourceUrl}/${getAbc24Identifier(abc24) as number}`, abc24, { observe: 'response' });
  }

  partialUpdate(abc24: IAbc24): Observable<EntityResponseType> {
    return this.http.patch<IAbc24>(`${this.resourceUrl}/${getAbc24Identifier(abc24) as number}`, abc24, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc24>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc24[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc24ToCollectionIfMissing(abc24Collection: IAbc24[], ...abc24sToCheck: (IAbc24 | null | undefined)[]): IAbc24[] {
    const abc24s: IAbc24[] = abc24sToCheck.filter(isPresent);
    if (abc24s.length > 0) {
      const abc24CollectionIdentifiers = abc24Collection.map(abc24Item => getAbc24Identifier(abc24Item)!);
      const abc24sToAdd = abc24s.filter(abc24Item => {
        const abc24Identifier = getAbc24Identifier(abc24Item);
        if (abc24Identifier == null || abc24CollectionIdentifiers.includes(abc24Identifier)) {
          return false;
        }
        abc24CollectionIdentifiers.push(abc24Identifier);
        return true;
      });
      return [...abc24sToAdd, ...abc24Collection];
    }
    return abc24Collection;
  }
}
