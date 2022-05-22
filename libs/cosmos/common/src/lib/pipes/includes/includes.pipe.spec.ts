import { IncludesPipe } from './includes.pipe';

describe('IncludesPipe', () => {
  it('create an instance', () => {
    const pipe = new IncludesPipe();
    expect(pipe).toBeTruthy();
  });

  describe('check against an array', () => {
    it('returns true if a value EXIST in an array', () => {
      // value to check
      const arrayToCheck = ['foo', 'bar', 'baz'];

      const pipe = new IncludesPipe();
      const pipeResult = pipe.transform(arrayToCheck, 'bar');
      expect(pipeResult).toBeTruthy();
    });

    it('returns false if a value DOES NOT EXIST in an array', () => {
      // value to check
      const arrayToCheck = ['foo', 'bar', 'baz'];

      const pipe = new IncludesPipe();
      const pipeResult = pipe.transform(arrayToCheck, 'lorem');
      expect(pipeResult).toBeFalsy();
    });
  });

  describe('check against a string', () => {
    it('returns true if a value EXIST in a string', () => {
      // value to check
      const valueToCheck = ['foo', 'bar', 'baz'].join('');

      const pipe = new IncludesPipe();
      const pipeResult = pipe.transform(valueToCheck, 'bar');
      expect(pipeResult).toBeTruthy();
    });

    it('returns false if a value DOES NOT EXIST in a string', () => {
      // value to check
      const arrayToCheck = ['foo', 'bar', 'baz'].join('');

      const pipe = new IncludesPipe();
      const pipeResult = pipe.transform(arrayToCheck, 'lorem');
      expect(pipeResult).toBeFalsy();
    });
  });
});
