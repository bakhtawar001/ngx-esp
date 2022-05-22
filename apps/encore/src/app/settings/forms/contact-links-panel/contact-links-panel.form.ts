import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import {
  AsiPanelEditableRowModule,
  AsiPartyAutocompleteComponentModule,
} from '@asi/ui/feature-core';
import { LinkRelationship } from '@esp/models';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { CosButtonModule } from '@cosmos/components/button';
import { FormArrayComponent, FormGroup } from '@cosmos/forms';
import { CosInputModule } from '@cosmos/components/input';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosAutocompleteModule } from '@cosmos/components/autocomplete';
import { CosDottedButtonModule } from '@cosmos/components/dotted-button';
import {
  FilterPersonTypePipe,
  FilterPersonTypePipeModule,
} from './filter-person-type.pipe';
import { ContactDetailLocalState } from '../../../contacts/local-states';
import { PartyAvatarComponentModule } from '../../../directory/components/party-avatar';

@UntilDestroy()
@Component({
  selector: 'esp-contact-links-panel',
  templateUrl: './contact-links-panel.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./contact-links-panel.form.scss'],
  providers: [FilterPersonTypePipe],
})
export class ContactLinksPanelForm
  extends FormArrayComponent<LinkRelationship>
  implements AfterContentInit
{
  activeRow: number | null = null;
  creatingMode = false;

  constructor(
    readonly state: ContactDetailLocalState,
    private filterPersonTypePipe: FilterPersonTypePipe
  ) {
    super();
  }

  override addItem(): void {
    if (this.form.valid) {
      super.addItem();
    }

    this.activeRow = this.groups.length - 1;
    this.creatingMode = true;
  }

  cancelEdit(): void {
    this.resetForm();
    this.resetActiveRow();
  }

  ngAfterContentInit(): void {
    this.state
      .connect(this)
      .pipe(
        distinctUntilChanged(isEqual),
        filter(Boolean),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.resetForm();
      });
  }

  save(linkRelationshipFormGroup: FormGroup<LinkRelationship>): void {
    if (this.creatingMode) {
      this.state.createLink(linkRelationshipFormGroup.value);
    } else {
      this.state.patchLink(linkRelationshipFormGroup.value);
    }

    this.resetActiveRow();
  }

  override removeItem(contactLink: FormGroup<LinkRelationship>): void {
    super.removeItem(contactLink);

    if (this.form.value.length === 0) {
      this.form.reset();
    }

    this.resetActiveRow();

    if (!this.creatingMode) {
      this.state.removeLink(contactLink.value.Id);
    }
  }

  protected createArrayControl(): FormGroup<LinkRelationship> {
    return this._fb.group<LinkRelationship>({
      Id: [0],
      Comment: [''],
      Title: [''],
      Type: [null],
      IsEditable: [false],
      To: [null],
      From: [null],
      Reverse: [false],
    });
  }

  private resetActiveRow(): void {
    this.activeRow = null;
    this.creatingMode = false;
  }

  private resetForm(): void {
    this.form.reset(
      this.filterPersonTypePipe.transform(this.state.party?.Links)
    );
  }
}

@NgModule({
  declarations: [ContactLinksPanelForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CosAutocompleteModule,
    CosButtonModule,
    CosSegmentedPanelModule,
    CosCheckboxModule,
    CosFormFieldModule,
    CosInputModule,
    CosDottedButtonModule,
    AsiPanelEditableRowModule,
    AsiPartyAutocompleteComponentModule,
    PartyAvatarComponentModule,
    FilterPersonTypePipeModule,
  ],
  exports: [ContactLinksPanelForm],
})
export class ContactLinksPanelFormModule {}
