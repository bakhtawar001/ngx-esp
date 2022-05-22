import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosInputModule } from '@cosmos/components/input';
import { CosRadioModule } from '@cosmos/components/radio';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage {
  settingsForm = this.createForm();

  tasks = ['Task 1', 'Task 2', 'Task 3'];

  errors = false;

  pageDescription = `Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur labore et dolore magna adipiscing elit, sed do. Quis nostrud exercitation ullamco laboris nisi ut aliquip tempor incididunt ut labore et dolore magna aliqua.`;

  constructor(private _fb: FormBuilder) {}

  protected createForm() {
    return this._fb.group({
      name: [''],
      email: [''],
      phone: [''],
      website: [''],
      defaultCurrency: [''],
      defaultMarket: [''],
      primary_brand_color: [''],
      showProductImages: [true],
      showShippingContactPhoneNumber: [false],
      showShippingContactEmailAddress: [false],
      showPoRefernence: [false],
      social: [
        {
          facebook: '',
          twitter: '',
          instagram: '',
        },
      ],
      address: [''],
    });
  }

  public trackByFn(index) {
    return index;
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }

  public removeTask(id: number) {
    console.log(id);
  }
}

@NgModule({
  declarations: [TrackingPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    AsiPanelEditableRowModule,
    CosSegmentedPanelModule,
    CosInputModule,
    CosCheckboxModule,
    CosRadioModule,
    CosButtonModule,
  ],
})
export class TrackingPageModule {}
