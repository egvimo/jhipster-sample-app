import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDef, getDefIdentifier } from '../def.model';

export type EntityResponseType = HttpResponse<IDef>;
export type EntityArrayResponseType = HttpResponse<IDef[]>;

@Injectable({ providedIn: 'root' })
export class DefService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/defs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(def: IDef): Observable<EntityResponseType> {
    return this.http.post<IDef>(this.resourceUrl, def, { observe: 'response' });
  }

  update(def: IDef): Observable<EntityResponseType> {
    return this.http.put<IDef>(`${this.resourceUrl}/${getDefIdentifier(def) as number}`, def, { observe: 'response' });
  }

  partialUpdate(def: IDef): Observable<EntityResponseType> {
    return this.http.patch<IDef>(`${this.resourceUrl}/${getDefIdentifier(def) as number}`, def, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDef>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDef[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDefToCollectionIfMissing(defCollection: IDef[], ...defsToCheck: (IDef | null | undefined)[]): IDef[] {
    const defs: IDef[] = defsToCheck.filter(isPresent);
    if (defs.length > 0) {
      const defCollectionIdentifiers = defCollection.map(defItem => getDefIdentifier(defItem)!);
      const defsToAdd = defs.filter(defItem => {
        const defIdentifier = getDefIdentifier(defItem);
        if (defIdentifier == null || defCollectionIdentifiers.includes(defIdentifier)) {
          return false;
        }
        defCollectionIdentifiers.push(defIdentifier);
        return true;
      });
      return [...defsToAdd, ...defCollection];
    }
    return defCollection;
  }
}
