import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc26, getAbc26Identifier } from '../abc-26.model';

export type EntityResponseType = HttpResponse<IAbc26>;
export type EntityArrayResponseType = HttpResponse<IAbc26[]>;

@Injectable({ providedIn: 'root' })
export class Abc26Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-26-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc26: IAbc26): Observable<EntityResponseType> {
    return this.http.post<IAbc26>(this.resourceUrl, abc26, { observe: 'response' });
  }

  update(abc26: IAbc26): Observable<EntityResponseType> {
    return this.http.put<IAbc26>(`${this.resourceUrl}/${getAbc26Identifier(abc26) as number}`, abc26, { observe: 'response' });
  }

  partialUpdate(abc26: IAbc26): Observable<EntityResponseType> {
    return this.http.patch<IAbc26>(`${this.resourceUrl}/${getAbc26Identifier(abc26) as number}`, abc26, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc26>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc26[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc26ToCollectionIfMissing(abc26Collection: IAbc26[], ...abc26sToCheck: (IAbc26 | null | undefined)[]): IAbc26[] {
    const abc26s: IAbc26[] = abc26sToCheck.filter(isPresent);
    if (abc26s.length > 0) {
      const abc26CollectionIdentifiers = abc26Collection.map(abc26Item => getAbc26Identifier(abc26Item)!);
      const abc26sToAdd = abc26s.filter(abc26Item => {
        const abc26Identifier = getAbc26Identifier(abc26Item);
        if (abc26Identifier == null || abc26CollectionIdentifiers.includes(abc26Identifier)) {
          return false;
        }
        abc26CollectionIdentifiers.push(abc26Identifier);
        return true;
      });
      return [...abc26sToAdd, ...abc26Collection];
    }
    return abc26Collection;
  }
}
