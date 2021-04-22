import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJoinTableAbcXyz, getJoinTableAbcXyzIdentifier } from '../join-table-abc-xyz.model';

export type EntityResponseType = HttpResponse<IJoinTableAbcXyz>;
export type EntityArrayResponseType = HttpResponse<IJoinTableAbcXyz[]>;

@Injectable({ providedIn: 'root' })
export class JoinTableAbcXyzService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/join-table-abc-xyzs');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(joinTableAbcXyz: IJoinTableAbcXyz): Observable<EntityResponseType> {
    return this.http.post<IJoinTableAbcXyz>(this.resourceUrl, joinTableAbcXyz, { observe: 'response' });
  }

  update(joinTableAbcXyz: IJoinTableAbcXyz): Observable<EntityResponseType> {
    return this.http.put<IJoinTableAbcXyz>(
      `${this.resourceUrl}/${getJoinTableAbcXyzIdentifier(joinTableAbcXyz) as number}`,
      joinTableAbcXyz,
      { observe: 'response' }
    );
  }

  partialUpdate(joinTableAbcXyz: IJoinTableAbcXyz): Observable<EntityResponseType> {
    return this.http.patch<IJoinTableAbcXyz>(
      `${this.resourceUrl}/${getJoinTableAbcXyzIdentifier(joinTableAbcXyz) as number}`,
      joinTableAbcXyz,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJoinTableAbcXyz>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJoinTableAbcXyz[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJoinTableAbcXyzToCollectionIfMissing(
    joinTableAbcXyzCollection: IJoinTableAbcXyz[],
    ...joinTableAbcXyzsToCheck: (IJoinTableAbcXyz | null | undefined)[]
  ): IJoinTableAbcXyz[] {
    const joinTableAbcXyzs: IJoinTableAbcXyz[] = joinTableAbcXyzsToCheck.filter(isPresent);
    if (joinTableAbcXyzs.length > 0) {
      const joinTableAbcXyzCollectionIdentifiers = joinTableAbcXyzCollection.map(
        joinTableAbcXyzItem => getJoinTableAbcXyzIdentifier(joinTableAbcXyzItem)!
      );
      const joinTableAbcXyzsToAdd = joinTableAbcXyzs.filter(joinTableAbcXyzItem => {
        const joinTableAbcXyzIdentifier = getJoinTableAbcXyzIdentifier(joinTableAbcXyzItem);
        if (joinTableAbcXyzIdentifier == null || joinTableAbcXyzCollectionIdentifiers.includes(joinTableAbcXyzIdentifier)) {
          return false;
        }
        joinTableAbcXyzCollectionIdentifiers.push(joinTableAbcXyzIdentifier);
        return true;
      });
      return [...joinTableAbcXyzsToAdd, ...joinTableAbcXyzCollection];
    }
    return joinTableAbcXyzCollection;
  }
}
