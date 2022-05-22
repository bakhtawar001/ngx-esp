import { UrlToSocialIconPipe } from './urlToSocialIcon.pipe';

describe('UrlToSocialIconPipe', () => {
  const pipe = new UrlToSocialIconPipe();

  it('transforms "https://www.linkedin.com/company/snugz-usa" to "fa-linkedin"', () => {
    expect(pipe.transform('https://www.linkedin.com/company/snugz-usa')).toBe(
      'fa-linkedin'
    );
  });

  it('transforms "https://www.youtube.com/channel/UChNu78DSiaP0rdKqG0e3L_Q" to "fa-youtube-square"', () => {
    expect(
      pipe.transform('https://www.youtube.com/channel/UChNu78DSiaP0rdKqG0e3L_Q')
    ).toBe('fa-youtube-square');
  });

  it('transforms "http://www.snugzusa.com" to undefined', () => {
    expect(pipe.transform('http://www.snugzusa.com')).toBe(undefined);
  });
});
