import { FormatCountPipe } from './format-count.pipe';

describe('FormatCountPipe', () => {
  let pipe: FormatCountPipe;
  let value: number;

  beforeEach(() => {
    pipe = new FormatCountPipe();
    value = 555;
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('number should be formated with ()', () => {
    const val = pipe.transform(value);
    expect(val).toEqual('(555)');
  });

  it('type to be undefined', () => {
    value = null;
    const val = pipe.transform(value);
    expect(val).toBeNull();
  });
});
