import { UrlToDomainNamePipe } from './urlToDomainName.pipe';

describe('UrlToDomainNamePipe', () => {
  const pipe = new UrlToDomainNamePipe();

  it('transforms "https://twitter.com/SnugZUSA" to "twitter.com"', () => {
    expect(pipe.transform('https://twitter.com/SnugZUSA')).toBe('twitter.com');
  });

  it('transforms "https://www.youtube.com/channel/UChNu78DSiaP0rdKqG0e3L_Q" to "youtube.com"', () => {
    expect(
      pipe.transform('https://www.youtube.com/channel/UChNu78DSiaP0rdKqG0e3L_Q')
    ).toBe('youtube.com');
  });

  it('transforms "http://www.snugzusa.com" to "snugzusa.com"', () => {
    expect(pipe.transform('http://www.snugzusa.com')).toBe('snugzusa.com');
  });
});
