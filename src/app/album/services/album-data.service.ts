import {Injectable} from '@angular/core';
import {BaseDataFetchService} from '@albums-viewer/common/base-data-fetch';
import {AlbumSearchResult} from '../interfaces';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AlbumDataService extends BaseDataFetchService<AlbumSearchResult> {
  constructor(protected override http: HttpClient) {
    super(http);
  }
}
