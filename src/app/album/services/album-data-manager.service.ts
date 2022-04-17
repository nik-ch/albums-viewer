import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {CollectionViewer, ListRange} from '@angular/cdk/collections';
import {BehaviorSubject, combineLatest, distinctUntilChanged, Observable, of, Subject} from 'rxjs';
import {startWith, takeUntil, switchMap, map} from 'rxjs/operators';
import {AlbumDataService} from './album-data.service';
import {DestroyableComponent} from '@albums-viewer/common/destroyable-component';
import {EndOfList, InfiniteScrollDataSource} from '@albums-viewer/common/infinite-scroll-data-source';
import {AlbumSearchResult} from '../interfaces';
import {SearchParams} from '@albums-viewer/common/base-data-fetch';

@Injectable()
export class AlbumDataManagerService extends DestroyableComponent implements CollectionViewer {
  /**
   * Collection viewer implementation. 'start' and 'end' field's value
   * are not important here as they are not used in data loading.
   */
  viewChange = new BehaviorSubject<ListRange>({
    start: 0,
    end: 0
  });

  private dataSource: InfiniteScrollDataSource<AlbumSearchResult>;
  private reload$ = new Subject<void>();
  private page = 1;
  private hasNextPage = true;

  private dataSubject$ = new Subject<AlbumSearchResult[]>();
  get data$(): Observable<AlbumSearchResult[]> {
    return this.dataSubject$.asObservable();
  }

  private searchParams$ = new Subject<SearchParams>();
  set searchParams(params: SearchParams) {
    this.searchParams$.next(params);
  }

  constructor(private dataService: AlbumDataService) {
    super();
    this.initDataSource();
  }

  reload(): void {
    this.reload$.next();
  }

  private initDataSource(): void {
    combineLatest([
      this.searchParams$.pipe(distinctUntilChanged(_.isEqual)),
      this.reload$.pipe(startWith(true))
    ]).pipe(
      switchMap(([params]) => {
        this.dataSource = this.getDataSource(params);
        return this.dataSource.connect(this);
      }),
      takeUntil(this.destroyed$)
    ).subscribe(data => this.dataSubject$.next(data));
  }

  private getDataSource(searchParams: SearchParams): InfiniteScrollDataSource<AlbumSearchResult> {
    return new InfiniteScrollDataSource(
      () => {
        if (!this.hasNextPage) {
          return of(new EndOfList());
        }
        const params = {
          ...searchParams,
          page: this.page
        };
        return this.dataService.search(params).pipe(
          map(({pagination, results}) => {
            if (pagination.page >= pagination.pages) {
              this.hasNextPage = false;
            } else {
              this.page += 1;
            }
            return results;
          })
        );
      }
    );
  }
}
