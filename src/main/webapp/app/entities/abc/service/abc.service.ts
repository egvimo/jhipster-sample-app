import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { IAbc } from '../abc.model';

type EntityResponseType = HttpResponse<IAbc>;
type EntityArrayResponseType = HttpResponse<IAbc[]>;

@Injectable({ providedIn: 'root' })
export class AbcService {
  public resourceUrl = SERVER_API_URL + 'api/abcs';

  constructor(protected http: HttpClient) {}

  create(abc: IAbc): Observable<EntityResponseType> {
    return this.http.post<IAbc>(this.resourceUrl, abc, { observe: 'response' });
  }

  update(abc: IAbc): Observable<EntityResponseType> {
    return this.http.put<IAbc>(this.resourceUrl, abc, { observe: 'response' });
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
}
