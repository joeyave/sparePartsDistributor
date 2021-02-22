import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { ISparePart } from 'app/shared/model/spare-part.model';

type EntityResponseType = HttpResponse<ISparePart>;
type EntityArrayResponseType = HttpResponse<ISparePart[]>;

@Injectable({ providedIn: 'root' })
export class SparePartService {
  public resourceUrl = SERVER_API_URL + 'api/spare-parts';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/spare-parts';

  constructor(protected http: HttpClient) {}

  create(sparePart: ISparePart): Observable<EntityResponseType> {
    return this.http.post<ISparePart>(this.resourceUrl, sparePart, { observe: 'response' });
  }

  update(sparePart: ISparePart): Observable<EntityResponseType> {
    return this.http.put<ISparePart>(this.resourceUrl, sparePart, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISparePart>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISparePart[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISparePart[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
