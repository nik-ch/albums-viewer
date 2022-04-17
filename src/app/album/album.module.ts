import {NgModule} from '@angular/core';
import {AlbumListComponent} from './album-list.component';
import {AlbumCardComponent} from './album-card/album-card.component';
import {AlbumDataService, AlbumDataManagerService} from './services';

@NgModule({
  declarations: [
    AlbumListComponent,
    AlbumCardComponent
  ],
  providers: [
    AlbumDataService,
    AlbumDataManagerService
  ],
  exports: [
    AlbumListComponent
  ]
})
export class AlbumModule {
}
