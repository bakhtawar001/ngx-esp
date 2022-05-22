import { MadeInUsaPipe } from './made-in-usa.pipe';

describe('MadeInUsaPipe', () => {
  let pipe: MadeInUsaPipe;

  beforeEach(() => {
    pipe = new MadeInUsaPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns "Supplier has not specified" if no origin', () => {
    const val = pipe.transform(null);

    expect(val).toEqual('Supplier has not specified');
  });

  it('returns "Supplier has not specified" if entries in origin', () => {
    const val = pipe.transform([]);

    expect(val).toEqual('Supplier has not specified');
  });

  it('returns "Yes" if origin is USA', () => {
    const val = pipe.transform(['USA']);

    expect(val).toEqual('Yes');
  });

  it('returns "Yes" if origin is U.S.A', () => {
    const val = pipe.transform(['U.S.A']);

    expect(val).toEqual('Yes');
  });

  it('returns "No" if origin is not USA/U.S.A', () => {
    const val = pipe.transform(['Chiiiina']);

    expect(val).toEqual('No');
  });
});
