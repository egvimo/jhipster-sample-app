import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJoinTable, getJoinTableIdentifier } from '../join-table.model';

export type EntityResponseType = HttpResponse<IJoinTable>;
export type EntityArrayResponseType = HttpResponse<IJoinTable[]>;

@Injectable({ providedIn: 'root' })
export class JoinTableService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/join-tables');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(joinTable: IJoinTable): Observable<EntityResponseType> {
    return this.http.post<IJoinTable>(this.resourceUrl, joinTable, { observe: 'response' });
  }

  update(joinTable: IJoinTable): Observable<EntityResponseType> {
    return this.http.put<IJoinTable>(`${this.resourceUrl}/${getJoinTableIdentifier(joinTable) as number}`, joinTable, {
      observe: 'response',
    });
  }

  partialUpdate(joinTable: IJoinTable): Observable<EntityResponseType> {
    return this.http.patch<IJoinTable>(`${this.resourceUrl}/${getJoinTableIdentifier(joinTable) as number}`, joinTable, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJoinTable>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJoinTable[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJoinTableToCollectionIfMissing(
    joinTableCollection: IJoinTable[],
    ...joinTablesToCheck: (IJoinTable | null | undefined)[]
  ): IJoinTable[] {
    const joinTables: IJoinTable[] = joinTablesToCheck.filter(isPresent);
    if (joinTables.length > 0) {
      const joinTableCollectionIdentifiers = joinTableCollection.map(joinTableItem => getJoinTableIdentifier(joinTableItem)!);
      const joinTablesToAdd = joinTables.filter(joinTableItem => {
        const joinTableIdentifier = getJoinTableIdentifier(joinTableItem);
        if (joinTableIdentifier == null || joinTableCollectionIdentifiers.includes(joinTableIdentifier)) {
          return false;
        }
        joinTableCollectionIdentifiers.push(joinTableIdentifier);
        return true;
      });
      return [...joinTablesToAdd, ...joinTableCollection];
    }
    return joinTableCollection;
  }
}
