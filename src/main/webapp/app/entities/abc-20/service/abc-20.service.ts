import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc20, getAbc20Identifier } from '../abc-20.model';

export type EntityResponseType = HttpResponse<IAbc20>;
export type EntityArrayResponseType = HttpResponse<IAbc20[]>;

@Injectable({ providedIn: 'root' })
export class Abc20Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-20-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc20: IAbc20): Observable<EntityResponseType> {
    return this.http.post<IAbc20>(this.resourceUrl, abc20, { observe: 'response' });
  }

  update(abc20: IAbc20): Observable<EntityResponseType> {
    return this.http.put<IAbc20>(`${this.resourceUrl}/${getAbc20Identifier(abc20) as number}`, abc20, { observe: 'response' });
  }

  partialUpdate(abc20: IAbc20): Observable<EntityResponseType> {
    return this.http.patch<IAbc20>(`${this.resourceUrl}/${getAbc20Identifier(abc20) as number}`, abc20, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc20>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc20[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc20ToCollectionIfMissing(abc20Collection: IAbc20[], ...abc20sToCheck: (IAbc20 | null | undefined)[]): IAbc20[] {
    const abc20s: IAbc20[] = abc20sToCheck.filter(isPresent);
    if (abc20s.length > 0) {
      const abc20CollectionIdentifiers = abc20Collection.map(abc20Item => getAbc20Identifier(abc20Item)!);
      const abc20sToAdd = abc20s.filter(abc20Item => {
        const abc20Identifier = getAbc20Identifier(abc20Item);
        if (abc20Identifier == null || abc20CollectionIdentifiers.includes(abc20Identifier)) {
          return false;
        }
        abc20CollectionIdentifiers.push(abc20Identifier);
        return true;
      });
      return [...abc20sToAdd, ...abc20Collection];
    }
    return abc20Collection;
  }
}
