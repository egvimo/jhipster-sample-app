import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc16, getAbc16Identifier } from '../abc-16.model';

export type EntityResponseType = HttpResponse<IAbc16>;
export type EntityArrayResponseType = HttpResponse<IAbc16[]>;

@Injectable({ providedIn: 'root' })
export class Abc16Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-16-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc16: IAbc16): Observable<EntityResponseType> {
    return this.http.post<IAbc16>(this.resourceUrl, abc16, { observe: 'response' });
  }

  update(abc16: IAbc16): Observable<EntityResponseType> {
    return this.http.put<IAbc16>(`${this.resourceUrl}/${getAbc16Identifier(abc16) as number}`, abc16, { observe: 'response' });
  }

  partialUpdate(abc16: IAbc16): Observable<EntityResponseType> {
    return this.http.patch<IAbc16>(`${this.resourceUrl}/${getAbc16Identifier(abc16) as number}`, abc16, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc16>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc16[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbc16ToCollectionIfMissing(abc16Collection: IAbc16[], ...abc16sToCheck: (IAbc16 | null | undefined)[]): IAbc16[] {
    const abc16s: IAbc16[] = abc16sToCheck.filter(isPresent);
    if (abc16s.length > 0) {
      const abc16CollectionIdentifiers = abc16Collection.map(abc16Item => getAbc16Identifier(abc16Item)!);
      const abc16sToAdd = abc16s.filter(abc16Item => {
        const abc16Identifier = getAbc16Identifier(abc16Item);
        if (abc16Identifier == null || abc16CollectionIdentifiers.includes(abc16Identifier)) {
          return false;
        }
        abc16CollectionIdentifiers.push(abc16Identifier);
        return true;
      });
      return [...abc16sToAdd, ...abc16Collection];
    }
    return abc16Collection;
  }
}
