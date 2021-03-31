import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc, getAbcIdentifier } from '../abc.model';

export type EntityResponseType = HttpResponse<IAbc>;
export type EntityArrayResponseType = HttpResponse<IAbc[]>;

@Injectable({ providedIn: 'root' })
export class AbcService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/abcs');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(abc: IAbc): Observable<EntityResponseType> {
    return this.http.post<IAbc>(this.resourceUrl, abc, { observe: 'response' });
  }

  update(abc: IAbc): Observable<EntityResponseType> {
    return this.http.put<IAbc>(`${this.resourceUrl}/${getAbcIdentifier(abc) as number}`, abc, { observe: 'response' });
  }

  partialUpdate(abc: IAbc): Observable<EntityResponseType> {
    return this.http.patch<IAbc>(`${this.resourceUrl}/${getAbcIdentifier(abc) as number}`, abc, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAbcToCollectionIfMissing(abcCollection: IAbc[], ...abcsToCheck: (IAbc | null | undefined)[]): IAbc[] {
    const abcs: IAbc[] = abcsToCheck.filter(isPresent);
    if (abcs.length > 0) {
      const abcCollectionIdentifiers = abcCollection.map(abcItem => getAbcIdentifier(abcItem)!);
      const abcsToAdd = abcs.filter(abcItem => {
        const abcIdentifier = getAbcIdentifier(abcItem);
        if (abcIdentifier == null || abcCollectionIdentifiers.includes(abcIdentifier)) {
          return false;
        }
        abcCollectionIdentifiers.push(abcIdentifier);
        return true;
      });
      return [...abcsToAdd, ...abcCollection];
    }
    return abcCollection;
  }
}
