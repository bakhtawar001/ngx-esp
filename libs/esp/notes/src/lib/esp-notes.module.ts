import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NotesState, NotesSearchState } from './states';
import { NotesService } from './services';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([NotesState, NotesSearchState]),
  ],
  providers: [NotesService],
})
export class EspNotesModule {}
