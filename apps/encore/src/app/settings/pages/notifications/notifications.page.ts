import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { CosSlideToggleModule } from '@cosmos/components/toggle';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {
  public notificationsForm = this.createForm();
  checked = true;
  showNotificationChildren = false;

  constructor(private _fb: FormBuilder) {}

  protected createForm() {
    return this._fb.group({
      preferredEmail: ['john.jingleheimer-schmidt@kraftwerk.com'],
      frequency: ['1'],
    });
  }

  toggleExpanded() {
    this.showNotificationChildren = !this.showNotificationChildren;
  }

  updateValue(id: string) {
    console.log(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleSharedSettings() {}
}

@NgModule({
  declarations: [NotificationsPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CosInputModule,
    CosSegmentedPanelModule,
    CosSlideToggleModule,
    AsiPanelEditableRowModule,
    CosButtonModule,
  ],
})
export class NotificationsPageModule {}
