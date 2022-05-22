import { FormatProp65WarningPipe } from './format-prop65-warning.pipe';
import { inject } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

describe('FormatProp65WarningPipe', () => {
  let pipe;

  const warningHtml = '<span class="safety-warning">PROP 65 WARNING:</span>';

  beforeEach(inject([DomSanitizer], (domSanitizer) => {
    pipe = new FormatProp65WarningPipe(domSanitizer);
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('replaces warning text with HTML', () => {
    const res = pipe.transform('WARNING:');

    expect(res.changingThisBreaksApplicationSecurity).toEqual(warningHtml);
  });

  it('replaces prop 65 warning text with HTML', () => {
    const res = pipe.transform('PROP 65 WARNING:');

    expect(res.changingThisBreaksApplicationSecurity).toEqual(warningHtml);
  });

  it('prepends value w/ warning if other warning text', () => {
    const res = pipe.transform('test');

    expect(res.changingThisBreaksApplicationSecurity).toEqual(
      `${warningHtml} test`
    );
  });

  it('replaces prop 65 link w test anchor tag', () => {
    const res = pipe.transform('www.P65Warnings.ca.gov');

    expect(res.changingThisBreaksApplicationSecurity).toEqual(
      `${warningHtml} <a href="https://www.p65warnings.ca.gov" target="_blank">www.P65Warnings.ca.gov</a>`
    );
  });
});
