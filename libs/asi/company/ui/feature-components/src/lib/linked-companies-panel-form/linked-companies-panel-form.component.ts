import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  AfterContentInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormArrayComponent, FormGroup } from '@cosmos/forms';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { CommonModule } from '@angular/common';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { AsiLinkedCompaniesFormModule } from '../linked-companies-form/linked-companies-form.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CosButtonModule } from '@cosmos/components/button';
import { LinkedCompany, LinkRelationship } from '@esp/models';
import { LinkedCompaniesLocalState } from './linked-companies.local-state';
import { CreateLinkPayload } from '@esp/companies';

@UntilDestroy()
@Component({
  selector: 'asi-linked-companies-panel-form',
  templateUrl: './linked-companies-panel-form.component.html',
  styleUrls: ['./linked-companies-panel-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LinkedCompaniesLocalState],
})
export class AsiLinkedCompaniesPanelFormComponent
  extends FormArrayComponent<LinkedCompany>
  implements AfterContentInit
{
  @Input() companyId!: number;

  activeRow: number | null = null;
  isCompanyExisting = false;
  companyLinks: LinkRelationship[] = [];
  linkedCompanies: LinkedCompany[] = [];
  editMode = false;
  isEditable: boolean | undefined;

  constructor(public state: LinkedCompaniesLocalState) {
    super();
  }

  override addItem(): void {
    this.editMode = true;
    if (this.form.valid) {
      super.addItem();
    }

    this.activeRow = this.groups.length - 1;
  }

  protected createArrayControl(): FormGroup<LinkedCompany> {
    return this._fb.group<LinkedCompany>({
      Company: [null, Validators.required],
      Relationship: null,
    });
  }

  save(index: number): void {
    const form = this.groups[index].value;
    const newCompanyLink: LinkRelationship = {
      Id: form.Relationship.Id,
      Comment: 'Linked Company',
      Title: form.Company.Name,
      Type: {
        Id: form.Relationship.Id,
        Code: form.Relationship.Code,
        ForwardTitle: form.Relationship.ForwardTitle,
        ReverseTitle: form.Relationship.ReverseTitle,
        ForPerson: form.Relationship.ForPerson,
        ForCompany: form.Relationship.ForCompany,
      },
      To: {
        Name: form.Company.Name,
        Addresses: [{ ...form.Company.Address }],
        Id: form.Company.Id,
        IsCompany: form.Company.IsCompany,
        IsPerson: form.Company.IsPerson,
      },
      IsEditbale: true,
      Reverse: form.Relationship.Reverse,
    };

    const newLinkPayload: CreateLinkPayload = {
      companyId: this.companyId,
      link: newCompanyLink,
    };

    this.state.createLink(newLinkPayload);
    this.activeRow = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetActiveRow(): void {
    this.activeRow = null;
  }

  private resetForm(): void {
    const items: any[] & LinkedCompany[] = [];

    if (items.length === 0) {
      items.push({});
    }

    this.form.reset(items);
    this.resetActiveRow();
  }

  ngAfterContentInit(): void {
    this.state
      .connect(this)
      .pipe(
        filter(({ partyIsReady }) => partyIsReady),
        map((x) => x.company?.Links),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe({
        next: (Links) => {
          this.linkedCompanies = [];
          this.companyLinks = Links?.filter((link: LinkRelationship) => {
            return link.To?.IsCompany;
          });

          this.companyLinks?.forEach((link) => {
            this.linkedCompanies.push({
              Company: link.To,
              Relationship: link.Type,
            });
          });

          this.form.reset(this.linkedCompanies);
        },
      });
  }
}

@NgModule({
  declarations: [AsiLinkedCompaniesPanelFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    AsiLinkedCompaniesFormModule,
    CosButtonModule,
    CosSegmentedPanelModule,
    AsiPanelEditableRowModule,
  ],
  exports: [AsiLinkedCompaniesPanelFormComponent],
})
export class AsiLinkedCompaniesPanelFormModule {}
