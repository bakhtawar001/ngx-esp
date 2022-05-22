import { EvalDisplayValuePipe } from './eval-display-value.pipe';

describe('EvalDisplayValuePipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new EvalDisplayValuePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns No if value is not a boolean', () => {
    const val = pipe.transform('test');

    expect(val).toEqual('No');
  });

  it('returns No when value is false', () => {
    const val = pipe.transform(false);

    expect(val).toEqual('No');
  });

  it('returns Yes when value is true', () => {
    const val = pipe.transform(true);

    expect(val).toEqual('Yes');
  });

  it('returns nullDisplay when non-bool value is falsy', () => {
    const expected = 'TEST';

    const val = pipe.transform(null, '', '', 'TEST');

    expect(val).toEqual(expected);
  });

  it('returns display value when non-bool value is falsy', () => {
    const expected = 'TEST';

    const val = pipe.transform(null, '', expected);

    expect(val).toEqual(expected);
  });
});
