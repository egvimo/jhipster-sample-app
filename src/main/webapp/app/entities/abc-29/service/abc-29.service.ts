import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc29, getAbc29Identifier } from '../abc-29.model';

export type EntityResponseType = HttpResponse<IAbc29>;
export type EntityArrayResponseType = HttpResponse<IAbc29[]>;

@Injectable({ providedIn: 'root' })
export class Abc29Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-29-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc29: IAbc29): Observable<EntityResponseType> {
    return this.http.post<IAbc29>(this.resourceUrl, abc29, { observe: 'response' });
  }

  update(abc29: IAbc29): Observable<EntityResponseType> {
    return this.http.put<IAbc29>(`${this.resourceUrl}/${getAbc29Identifier(abc29) as number}`, abc29, { observe: 'response' });
  }

  partialUpdate(abc29: IAbc29): Observable<EntityResponseType> {
    return this.http.patch<IAbc29>(`${this.resourceUrl}/${getAbc29Identifier(abc29) as number}`, abc29, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc29>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc29[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc29ToCollectionIfMissing(abc29Collection: IAbc29[], ...abc29sToCheck: (IAbc29 | null | undefined)[]): IAbc29[] {
    const abc29s: IAbc29[] = abc29sToCheck.filter(isPresent);
    if (abc29s.length > 0) {
      const abc29CollectionIdentifiers = abc29Collection.map(abc29Item => getAbc29Identifier(abc29Item)!);
      const abc29sToAdd = abc29s.filter(abc29Item => {
        const abc29Identifier = getAbc29Identifier(abc29Item);
        if (abc29Identifier == null || abc29CollectionIdentifiers.includes(abc29Identifier)) {
          return false;
        }
        abc29CollectionIdentifiers.push(abc29Identifier);
        return true;
      });
      return [...abc29sToAdd, ...abc29Collection];
    }
    return abc29Collection;
  }
}
