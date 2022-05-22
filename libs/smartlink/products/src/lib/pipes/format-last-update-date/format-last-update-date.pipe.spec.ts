// https://github.com/you-dont-need/You-Dont-Need-Momentjs
import { format, addDays, subDays, subYears } from 'date-fns';

import { FormatLastUpdateDatePipe } from './format-last-update-date.pipe';

describe('FormatLastUpdateDatePipe', () => {
  let pipe: FormatLastUpdateDatePipe;
  let testProduct: { UpdateDate: string; HasProductFeed: boolean };
  let date: Date;

  function formatDate(date: Date) {
    return format(date, `yyyy-MM-dd'T'hh:mm:ss`);
  }

  beforeEach(() => {
    pipe = new FormatLastUpdateDatePipe();

    date = new Date();

    testProduct = {
      UpdateDate: formatDate(date),
      HasProductFeed: false,
    };
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns null if no product', () => {
    const res = pipe.transform(null);

    expect(res).toBe(null);
  });

  it('returns null if no product.UpdateDate', () => {
    const res = pipe.transform({});

    expect(res).toBe(null);
  });

  it('returns null if product.UpdateDate is "None"', () => {
    const res = pipe.transform({ UpdateDate: 'None' });

    expect(res).toBe(null);
  });

  it('returns formatted string when product passed', () => {
    const res = pipe.transform(testProduct);

    expect(res).toEqual(`Last updated: Today`);
  });

  it('returns "last updated today" when product passed w date greater than today', () => {
    date = addDays(date, 5);
    testProduct.UpdateDate = formatDate(date);

    const res = pipe.transform(testProduct);

    expect(res).toEqual(`Last updated: Today`);
  });

  it('returns "last updated yesterday" when product passed w date from yesterday', () => {
    date = subDays(date, 1);
    testProduct.UpdateDate = formatDate(date);

    const res = pipe.transform(testProduct);

    expect(res).toEqual(`Last updated: Yesterday`);
  });

  it('returns "last updated over a year" when product passed w date from over a year', () => {
    date = subYears(date, 2);
    testProduct.UpdateDate = formatDate(date);

    const res = pipe.transform(testProduct);

    expect(res).toEqual(`Last updated: Over a Year`);
  });

  it('returns "last updated by a supplier at {date} if HasProductFeed"', () => {
    testProduct.HasProductFeed = true;

    const res = pipe.transform(testProduct);

    expect(res).toEqual(
      `Last updated by Supplier: ${format(date, 'MMMM d, yyyy')}`
    );
  });

  it("returns actual date if doesn't fit pre-determined label", () => {
    date = subDays(date, 43);
    testProduct.UpdateDate = formatDate(date);

    const res = pipe.transform(testProduct);

    expect(res).toEqual(`Last updated: ${format(date, 'MMMM d, yyyy')}`);
  });
});
