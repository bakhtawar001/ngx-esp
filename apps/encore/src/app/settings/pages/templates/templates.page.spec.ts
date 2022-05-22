import { CommonModule } from '@angular/common';
import { ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import {
  createComponentFactory,
  Spectator,
  SpectatorHost,
} from '@ngneat/spectator';
import { QuillModule } from 'ngx-quill';
import { TemplatesPage } from './templates.page';

const COSMOS_MODULES = [
  CosButtonModule,
  CosCardModule,
  CosSegmentedPanelModule,
];

describe('TemplatesPage', () => {
  let component: TemplatesPage;
  let host: SpectatorHost<TemplatesPage>;
  let spectator: Spectator<TemplatesPage>;
  let fixture: ComponentFixture<TemplatesPage>;

  const createComponent = createComponentFactory({
    component: TemplatesPage,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      QuillModule.forRoot(),
      ...COSMOS_MODULES,
      AsiPanelEditableRowModule,
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    try {
      spectator = createComponent();
      component = spectator.component;
      fixture = spectator.fixture;
    } catch (e) {
      console.log(e);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
