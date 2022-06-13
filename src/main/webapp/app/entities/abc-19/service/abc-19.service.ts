import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc19, getAbc19Identifier } from '../abc-19.model';

export type EntityResponseType = HttpResponse<IAbc19>;
export type EntityArrayResponseType = HttpResponse<IAbc19[]>;

@Injectable({ providedIn: 'root' })
export class Abc19Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-19-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc19: IAbc19): Observable<EntityResponseType> {
    return this.http.post<IAbc19>(this.resourceUrl, abc19, { observe: 'response' });
  }

  update(abc19: IAbc19): Observable<EntityResponseType> {
    return this.http.put<IAbc19>(`${this.resourceUrl}/${getAbc19Identifier(abc19) as number}`, abc19, { observe: 'response' });
  }

  partialUpdate(abc19: IAbc19): Observable<EntityResponseType> {
    return this.http.patch<IAbc19>(`${this.resourceUrl}/${getAbc19Identifier(abc19) as number}`, abc19, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc19>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc19[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc19ToCollectionIfMissing(abc19Collection: IAbc19[], ...abc19sToCheck: (IAbc19 | null | undefined)[]): IAbc19[] {
    const abc19s: IAbc19[] = abc19sToCheck.filter(isPresent);
    if (abc19s.length > 0) {
      const abc19CollectionIdentifiers = abc19Collection.map(abc19Item => getAbc19Identifier(abc19Item)!);
      const abc19sToAdd = abc19s.filter(abc19Item => {
        const abc19Identifier = getAbc19Identifier(abc19Item);
        if (abc19Identifier == null || abc19CollectionIdentifiers.includes(abc19Identifier)) {
          return false;
        }
        abc19CollectionIdentifiers.push(abc19Identifier);
        return true;
      });
      return [...abc19sToAdd, ...abc19Collection];
    }
    return abc19Collection;
  }
}
