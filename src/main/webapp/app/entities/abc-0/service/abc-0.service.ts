import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc0, NewAbc0 } from '../abc-0.model';

export type PartialUpdateAbc0 = Partial<IAbc0> & Pick<IAbc0, 'id'>;

export type EntityResponseType = HttpResponse<IAbc0>;
export type EntityArrayResponseType = HttpResponse<IAbc0[]>;

@Injectable({ providedIn: 'root' })
export class Abc0Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/abc-0-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(abc0: NewAbc0): Observable<EntityResponseType> {
    return this.http.post<IAbc0>(this.resourceUrl, abc0, { observe: 'response' });
  }

  update(abc0: IAbc0): Observable<EntityResponseType> {
    return this.http.put<IAbc0>(`${this.resourceUrl}/${this.getAbc0Identifier(abc0)}`, abc0, { observe: 'response' });
  }

  partialUpdate(abc0: PartialUpdateAbc0): Observable<EntityResponseType> {
    return this.http.patch<IAbc0>(`${this.resourceUrl}/${this.getAbc0Identifier(abc0)}`, abc0, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAbc0>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAbc0[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAbc0Identifier(abc0: Pick<IAbc0, 'id'>): number {
    return abc0.id;
  }

  compareAbc0(o1: Pick<IAbc0, 'id'> | null, o2: Pick<IAbc0, 'id'> | null): boolean {
    return o1 && o2 ? this.getAbc0Identifier(o1) === this.getAbc0Identifier(o2) : o1 === o2;
  }

  addAbc0ToCollectionIfMissing<Type extends Pick<IAbc0, 'id'>>(
    abc0Collection: Type[],
    ...abc0sToCheck: (Type | null | undefined)[]
  ): Type[] {
    const abc0s: Type[] = abc0sToCheck.filter(isPresent);
    if (abc0s.length > 0) {
      const abc0CollectionIdentifiers = abc0Collection.map(abc0Item => this.getAbc0Identifier(abc0Item)!);
      const abc0sToAdd = abc0s.filter(abc0Item => {
        const abc0Identifier = this.getAbc0Identifier(abc0Item);
        if (abc0CollectionIdentifiers.includes(abc0Identifier)) {
          return false;
        }
        abc0CollectionIdentifiers.push(abc0Identifier);
        return true;
      });
      return [...abc0sToAdd, ...abc0Collection];
    }
    return abc0Collection;
  }
}
