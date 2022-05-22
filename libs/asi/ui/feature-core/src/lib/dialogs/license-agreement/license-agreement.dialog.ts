import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgModule,
  OnInit,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentToHtmlPipeModule } from '@contentful/common/pipes/documentToHtml.pipe';
import { TrustHtmlPipeModule } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { LicenseAgreement, LoginService } from '@smartlink/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'asi-license-agreement',
  templateUrl: './license-agreement.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiLicenseAgreementDialog implements OnInit {
  licenseAgreement$: Observable<LicenseAgreement>;

  constructor(
    private _elRef: ElementRef,
    private readonly _loginService: LoginService
  ) {}

  ngOnInit() {
    this.licenseAgreement$ = this._loginService.getLicenseAgreement();
  }

  print(): boolean {
    const mywindow = window.open('', 'PRINT', 'height=400,width=600');
    const body = this._elRef.nativeElement.innerHTML;
    const title = document.title;

    mywindow.document.write(
      `<html>
        <head>
        <title>${title}</title>
        <style>
          mat-dialog-actions,
          .cos-modal-close {
            display: none;
          }
        </style>
        </head>
        <body>
          <div>${body}</div>
        </body>
      </html>
      `
    );

    const script = mywindow.document.createElement('script');
    script.type = 'text/javascript';
    script.text =
      'setTimeout(function () { window.print(); }, 500); window.onfocus = function () { setTimeout(function () { window.close(); }, 500); window.document.close(); }';
    mywindow.document.body.appendChild(script);
    return true;
  }
}

@NgModule({
  declarations: [AsiLicenseAgreementDialog],
  imports: [
    CommonModule,
    CosButtonModule,
    DocumentToHtmlPipeModule,
    MatDialogModule,
    TrustHtmlPipeModule,
  ],
})
export class AsiLicenseAgreementDialogModule {}
