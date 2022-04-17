import * as _ from 'lodash';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseHttpResponse} from './base-http-response';
import {SearchParams} from './search-params';

export abstract class BaseDataFetchService<TResult> {
  protected searchUrl = "https://api.discogs.com/database/search";

  constructor(protected http: HttpClient) {
  }

  search(searchParams: SearchParams): Observable<BaseHttpResponse<TResult>> {
    const params = this.getHttpParams(searchParams);
    return this.http.get<BaseHttpResponse<TResult>>(this.searchUrl, {params});
  }

  protected getHttpParams(params: SearchParams): HttpParams {
    const httpParams = new HttpParams();
    const keys = Object.keys(params) as Array<keyof SearchParams>;
    keys.forEach(key => {
      if (!_.isNil(params[key])) {
        httpParams.set(key, (params[key] as string));
      }
    });
    return httpParams;
  }
}
