interface TestRecorderOptions {
  logToConsole?: boolean;
}
export class TestRecorder<T> {
  private _items: T[] = [];

  constructor(private readonly _options: TestRecorderOptions = {}) {}

  get items(): ReadonlyArray<T> {
    return this._items;
  }

  reset = () => {
    this._items = [];
  };

  record = (entry: T) => {
    if (this._options.logToConsole) {
      console.log(entry);
    }
    this._items.push(entry);
  };
}
