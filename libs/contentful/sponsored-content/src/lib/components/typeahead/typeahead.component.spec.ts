import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RootContentfulService } from '@contentful/common/services/root-contentful.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TypeaheadComponent } from './typeahead.component';

describe('TypeaheadComponent', () => {
  let component: TypeaheadComponent;
  let spectator: Spectator<TypeaheadComponent>;

  const createComponent = createComponentFactory({
    component: TypeaheadComponent,
    imports: [NgSelectModule, HttpClientTestingModule, FormsModule],
    providers: [RootContentfulService],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
