import { NgModule } from '@angular/core';
import { EspCompaniesModule } from '@esp/companies';
import { EspOrdersModule } from '@esp/orders';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [ProjectsRoutingModule, EspCompaniesModule, EspOrdersModule],
})
export class ProjectsModule {}
