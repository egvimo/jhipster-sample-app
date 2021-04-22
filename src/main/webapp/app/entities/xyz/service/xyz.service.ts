import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IXyz, getXyzIdentifier } from '../xyz.model';

export type EntityResponseType = HttpResponse<IXyz>;
export type EntityArrayResponseType = HttpResponse<IXyz[]>;

@Injectable({ providedIn: 'root' })
export class XyzService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/xyzs');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(xyz: IXyz): Observable<EntityResponseType> {
    return this.http.post<IXyz>(this.resourceUrl, xyz, { observe: 'response' });
  }

  update(xyz: IXyz): Observable<EntityResponseType> {
    return this.http.put<IXyz>(`${this.resourceUrl}/${getXyzIdentifier(xyz) as number}`, xyz, { observe: 'response' });
  }

  partialUpdate(xyz: IXyz): Observable<EntityResponseType> {
    return this.http.patch<IXyz>(`${this.resourceUrl}/${getXyzIdentifier(xyz) as number}`, xyz, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IXyz>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IXyz[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addXyzToCollectionIfMissing(xyzCollection: IXyz[], ...xyzsToCheck: (IXyz | null | undefined)[]): IXyz[] {
    const xyzs: IXyz[] = xyzsToCheck.filter(isPresent);
    if (xyzs.length > 0) {
      const xyzCollectionIdentifiers = xyzCollection.map(xyzItem => getXyzIdentifier(xyzItem)!);
      const xyzsToAdd = xyzs.filter(xyzItem => {
        const xyzIdentifier = getXyzIdentifier(xyzItem);
        if (xyzIdentifier == null || xyzCollectionIdentifiers.includes(xyzIdentifier)) {
          return false;
        }
        xyzCollectionIdentifiers.push(xyzIdentifier);
        return true;
      });
      return [...xyzsToAdd, ...xyzCollection];
    }
    return xyzCollection;
  }
}
