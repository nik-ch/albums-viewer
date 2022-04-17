import {Component, OnInit} from '@angular/core';
import {DestroyableComponent} from '../common/destroyable-component';
import {AlbumDataManagerService} from './services/album-data-manager.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent extends DestroyableComponent implements OnInit {
  constructor(private dataManager: AlbumDataManagerService) {
    super();
  }

  ngOnInit(): void {
    this.initSearchParams();

    this.dataManager.data$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(console.log);
  }

  private initSearchParams(): void {
    this.dataManager.searchParams = {
      country: 'uk',
      style: 'indie rock',
      genre: 'rock'
    };
  }
}
