import {CollectionViewer, DataSource, ListRange} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {exhaustMap, map, takeWhile, shareReplay, catchError} from 'rxjs/operators';
import {EndOfList} from './end-of-list';

export class InfiniteScrollDataSource<T> extends DataSource<T> {
  private pending$ = new BehaviorSubject(false);
  private isConnected = false;
  private cache: T[] = [];

  get pending(): boolean {
    return this.pending$.value;
  }

  constructor(protected getOptions: (range: ListRange) => Observable<T[] | EndOfList>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    if (this.isConnected) {
      throw new Error('InfiniteScrollDataSource can only be connected once');
    }
    this.isConnected = true;

    return collectionViewer.viewChange.pipe(
      exhaustMap(range => {
        this.pending$.next(true);
        return this.getOptions(range);
      }),
      takeWhile(response => !(response instanceof EndOfList)),
      map(response => {
        this.pending$.next(false);
        if (!(response instanceof EndOfList)) {
          return this.cache = [...this.cache, ...response];
        } else {
          return this.cache;
        }
      }),
      shareReplay(),
      catchError(() => {
        this.pending$.next(false);
        return this.cache = [];
      })
    );
  }

  disconnect(): void {
  }
}
