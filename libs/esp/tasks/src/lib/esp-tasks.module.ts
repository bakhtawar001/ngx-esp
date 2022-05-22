import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { TasksState, TasksSearchState } from './states';
import { TasksService } from './services';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([TasksState, TasksSearchState]),
  ],
  providers: [TasksService],
})
export class EspTasksModule {}
