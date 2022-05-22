export namespace AppSettingsActions {
  export class SetValue<TKey> {
    static readonly type = '[AppSettings] SetValue';

    constructor(
      public readonly featureSettingName: string,
      public readonly prop: TKey,
      public readonly value: any
    ) {}
  }
}

// interface AppSettingAction<T extends keyof AppSettingsStateModel['settings']> {
//   itemType: T;
//   setting: AppSettingsStateModel['settings'][T][number];
// }

// interface AppSettingActionClass<T extends keyof AppSettingsStateModel['settings']> {
//   new (
//     setting: AppSettingAction<T>['setting']
//   ): AppSettingAction<T>;
// }

// export function AppSettingAction<T extends keyof AppSettingsStateModel['settings']>(
//   key: T
// ): AppSettingActionClass<T> {
//   const className = `${key}ItemActionType`;
//   const classRef = {
//     [className]: class implements AppSettingAction<T> {
//       static type = `[AppSettings] Add recent ${key}`;
//       readonly itemType = key;
//       constructor(
//         public setting: AppSettingAction<T>['setting']
//       ) {}
//     },
//   };

//   return classRef[className];
// }

// export class AddRecentCollection extends AddRecentItemAction('companies') { }
// export class AddRecentOrder extends AppSettingAction('orders') {}

// const x = new AddRecentOrder()
