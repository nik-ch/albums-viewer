import {Directive, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Directive()
export abstract class DestroyableComponent implements OnDestroy {
  protected destroyed$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
