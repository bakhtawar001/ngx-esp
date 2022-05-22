import { OrderStatusKind, OrderStatusType } from '@esp/lookup-types';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('OrderStatus', OrderStatus);

  OrderStatus.$inject = [
    '$modelFactory',
    'LookupTypes',
    'statusLockKind',
    'userFactory',
  ];

  function OrderStatus(
    $modelFactory,
    LookupTypes,
    statusLockKind,
    userFactory
  ) {
    var model = $modelFactory('settings/orderstatustype', {
      pk: 'Id',
      map: {},
      defaults: {
        TypeId: null,
        TenantId: 0,
        Label: '',
        Color: '',
        Comment: '',
        IsEditable: true,
        Kind: 'Custom',
      },
      init: function (instance) {
        instance.TypeId =
          !instance.TypeId && instance.Id ? instance.Id : instance.TypeId;
        instance.IsEditable = canEditOrderStatusTypeObject(instance);

        return instance;
      },
      instance: {},
      actions: {},
      getByLabel: getStatusByName,
      getStatusKind: getStatusKind,
      setSecurityPolicy: setSecurityPolicy,
      setStatus: setStatus,
      Default: getDefault(),
      LookupTypes: getStatuses(),
      refreshLookupTypes: function () {
        this.LookupTypes = getStatuses();
      },
    });

    return model;

    /* Helper Methods /

    function getStatusKind(name: string) {
      return getOrderStatusKind(LookupTypes.OrderStatuses, name);
    }

    type StatusKindProps = {
      StatusKind: OrderStatusKind;
      OldStatusKind: OrderStatusKind;
    };

    function setStatus(
      instance: Order & StatusKindProps,
      status: OrderStatusType
    ) {
      instance.OldStatusKind = instance.StatusKind;
      instance.Status = status.Label;
      instance.StatusKind = status.Kind;

      setSecurityPolicy(instance);
    }

    function setSecurityPolicy(
      instance: Order &
        StatusKindProps & { $$isEditable?: boolean; IsLocked?: boolean }
    ) {
      var kind = getStatusKind(instance.Status),
        user = userFactory.currentUser;

      if (typeof instance.$$isEditable === 'undefined')
        instance.$$isEditable = instance.IsEditable;

      const originalIsEditableValue = instance.$$isEditable;

      const isEditable = isOrderEditable(originalIsEditableValue, kind, user);

      const isLocked = isOrderLocked(isEditable, kind);
      instance.IsEditable = isEditable;
      instance.IsLocked = isLocked;
    }

    /* Private Methods /
    function getDefault() {
      return getDefaultOrderStatus();
    }

    function getStatuses() {
      return getAvailableOrderStatusTypes(
        LookupTypes.OrderStatuses,
        userFactory.currentUser
      );
    }

    function getStatusByName(name) {
      return getOrderStatusByName(LookupTypes.OrderStatuses, name) || {};
    }
  }
}) ();
*/

export function getOrderStatusKind(orderStatusTypes: any, name: string) {
  return getOrderStatusByName(orderStatusTypes, name)?.Kind;
}

export function getDefaultOrderStatus() {
  return 'Open';
}

type PartialUserModel = {
  hasPermission(permissionName: string): boolean;
};

export function getAvailableOrderStatusTypes(
  orderStatusTypes: OrderStatusType[],
  currentUser: PartialUserModel
) {
  return orderStatusTypes
    ? orderStatusTypes.filter(function (s) {
        return (
          hasOrderSuperCrudPermission(currentUser) ||
          s.Kind !== OrderStatusKind.AdminOnly
        );
      })
    : [];
}

function hasOrderSuperCrudPermission(currentUser: PartialUserModel): unknown {
  return currentUser.hasPermission('OrderStatus=SuperCrud');
}

export function getOrderStatusByName(
  orderStatusTypes: OrderStatusType[],
  name: string
) {
  const statuses: OrderStatusType[] = orderStatusTypes || [];
  return statuses.filter(function (status) {
    return name === status.Label;
  })[0];
}

export function canEditOrderStatusTypeObject(instance: OrderStatusType): any {
  return (
    instance.Kind !== OrderStatusKind.Open &&
    instance.Kind !== OrderStatusKind.Closed &&
    instance.Kind !== OrderStatusKind.AgeLimitFail &&
    instance.Kind !== OrderStatusKind.CreditFail
  );
}

export function isOrderEditable(
  orderIsEditable: boolean,
  orderStatusKind: OrderStatusKind,
  user: PartialUserModel
) {
  return (
    orderIsEditable &&
    (orderStatusKind !== OrderStatusKind.AdminOnly ||
      hasOrderSuperCrudPermission(user))
  );
}

export function isOrderLocked(
  isEditable: boolean,
  orderStatusKind: OrderStatusKind
) {
  return (
    !isEditable ||
    orderStatusKind === OrderStatusKind.AdminOnly ||
    orderStatusKind === OrderStatusKind.Locked
  );
}
