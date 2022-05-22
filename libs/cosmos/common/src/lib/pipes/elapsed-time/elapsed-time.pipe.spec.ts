import { CosElapsedTimePipe } from './elapsed-time.pipe';

describe('ElapsedTimePipe', () => {
  const pipe = new CosElapsedTimePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should display updated date, minutes correctly', () => {
    const date = new Date().getTime();
    let updateDate = new Date(date - 60 * 1000).toISOString();
    let elapsedTime = pipe.transform(updateDate);

    expect(elapsedTime).toEqual('1 minute');

    updateDate = new Date(date - 60 * 1000 * 3).toISOString();
    elapsedTime = pipe.transform(updateDate);

    expect(elapsedTime).toEqual('3 minutes');
  });

  it('should display updated date, hours correctly', () => {
    const date = new Date().getTime();
    let updateDate = new Date(date - 60 * 60 * 1000).toISOString();
    let elapsedTime = pipe.transform(updateDate);

    expect(elapsedTime).toEqual('about 1 hour');

    updateDate = new Date(date - 60 * 60 * 1000 * 3).toISOString();
    elapsedTime = pipe.transform(updateDate);

    expect(elapsedTime).toEqual('about 3 hours');
  });

  it('should display updated date, days correctly', () => {
    const date = new Date().getTime();
    let updateDate = new Date(date - 24 * 60 * 60 * 1000).toISOString();
    let elapsedTime = pipe.transform(updateDate);

    expect(elapsedTime).toEqual('1 day');

    updateDate = new Date(date - 24 * 60 * 60 * 1000 * 12).toISOString();
    elapsedTime = pipe.transform(updateDate);

    expect(elapsedTime).toEqual('12 days');
  });

  it('should display updated date, months correctly', () => {
    const date = new Date().getTime();
    let updateDate = new Date(date - 24 * 60 * 60 * 1000 * 33).toISOString();
    let elapsedTime = pipe.transform(updateDate);

    expect(elapsedTime).toEqual('about 1 month');

    updateDate = new Date(date - 24 * 60 * 60 * 1000 * 70).toISOString();
    elapsedTime = pipe.transform(updateDate);

    expect(elapsedTime).toEqual('2 months');
  });

  it('should display updated date, years correctly', () => {
    const date = new Date().getTime();
    let updateDate = new Date(date - 365 * 24 * 60 * 60 * 1000).toISOString();
    let elapsedTime = pipe.transform(updateDate);

    expect(elapsedTime).toEqual('about 1 year');

    updateDate = new Date(date - 365 * 24 * 60 * 60 * 1000 * 23).toISOString();
    elapsedTime = pipe.transform(updateDate);

    expect(elapsedTime).toEqual('almost 23 years');
  });
});
