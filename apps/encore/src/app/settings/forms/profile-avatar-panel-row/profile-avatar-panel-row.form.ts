import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosImageUploadFormModule } from '@cosmos/components/image-upload-form';
import { CosInputModule } from '@cosmos/components/input';
import { CosToastService } from '@cosmos/components/notification';
import { FormControl, FormControlComponent } from '@cosmos/forms';
import { FilesService } from '@esp/files';
import { Contact, MediaLink } from '@esp/models';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, map } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'esp-profile-avatar-panel-row-form',
  templateUrl: './profile-avatar-panel-row.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileAvatarPanelRowForm extends FormControlComponent<MediaLink> {
  @Input()
  isEditable = true;

  contact!: Contact;

  constructor(
    @Inject(PARTY_LOCAL_STATE) public readonly state: PartyLocalState,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _filesService: FilesService,
    private readonly _toastService: CosToastService
  ) {
    super();

    this.state
      .connect(this)
      .pipe(
        map((x) => x.party),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe((contact: Contact) => {
        this.contact = contact;
        this.control?.reset(contact?.IconMediaLink);
      });
  }

  onCancel(): void {
    this.contact.IconMediaLink
      ? this.control.reset(this.contact.IconMediaLink)
      : this.control.reset();

    this.control.updateValueAndValidity();
  }

  onRemove(): void {
    this.control.markAsDirty();
    this.control.setValue(null);
  }

  onSelected(selectedFile: File[]): void {
    this._filesService
      .uploadFile(selectedFile, 'Artwork')
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          if (res instanceof HttpResponse) {
            this.control.markAsDirty();
            this.control.setValue(res.body[0]);

            this._cdr.markForCheck();
          }
        },
        error: () => {
          this._toastService.error(
            'Image cannot be saved',
            'Your profile image was not able to be saved.'
          );
        },
      });
  }

  protected override createForm(): FormControl<MediaLink> {
    return this._fb.control({ MediaId: 0 });
  }
}

@NgModule({
  declarations: [ProfileAvatarPanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosAvatarModule,
    CosButtonModule,
    CosCardModule,
    CosImageUploadFormModule,
    CosInputModule,

    AsiPanelEditableRowModule,
  ],
  exports: [ProfileAvatarPanelRowForm],
})
export class ProfileAvatarPanelRowFormModule {}
