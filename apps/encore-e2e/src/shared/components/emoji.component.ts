export class Emoji {
  constructor(public parent: string) {
    this._element({ timeout: 1000 });
  }

  _element(options?: Partial<Cypress.Timeoutable>) {
    return cy.get(this.parent, options).find('cos-emoji-menu');
  }
  clickicon() {
    this.getIcon().click();
    return this;
  }
  getIcon() {
    return this._element().find('ngx-emoji');
  }
  invokeNGReflectEmoji() {
    return this._element().find('ngx-emoji').invoke('attr', 'ng-reflect-emoji');
  }

  dialogBox() {
    return cy.get(
      '.cdk-overlay-connected-position-bounding-box>[id^=cdk-overlay-]'
    );
  }

  SmileysPeople(input) {
    return this.dialogBox()
      .find('.emoji-mart-scroll')
      .find('emoji-category[ng-reflect-name="Smileys & People"]')
      .find('.emoji-mart-category')
      .find('ngx-emoji>span')
      .eq(input);
  }
}
