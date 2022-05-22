import {
  DecorationLineItemDetail,
  MediaLink,
  ProductAttribute,
} from '@esp/models';
import { createDecorationDetail } from './core.models.DecorationDetail';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('core.models').factory('CompanyDecoration', CompanyDecoration);

  CompanyDecoration.$inject = ['$modelFactory', '$http', 'DecorationDetail_XX'];

  function CompanyDecoration($modelFactory, $http, DecorationDetail) {
    var model = $modelFactory('companies/{CompanyId}/decorations', {
      pk: 'Id',
      defaults: {
        Name: '',
        CompanyId: null,
        CompanyName: '',
        MediaLinks: [],
        Details: new DecorationDetail.List([new DecorationDetail()]),
        Decoration: {},
      },
      actions: {},
      instance: {
        addDetail: addDetail,
        removeDetail: removeDetail,
        $delete: $delete,
      },
      get: get,
      search: query,
    });

    return model;

    function addDetail(options) {
      addItem(this.Details, options, DecorationDetail, false);
    }

    function addItem(arr, options, Entity, hasSequence) {
      var item;

      if (options instanceof Entity) {
        item = options;
      } else {
        item = new Entity(options);
      }

      arr.push(item);

      if (hasSequence) setSequence(arr);
    }

    function $delete() {
      var requestConfig = {
        method: 'DELETE',
        url: '/api/v1/companies/' + this.CompanyId + '/decorations/' + this.Id,
      };

      return $http(requestConfig);
    }

    function get(companyId, id) {
      return $http
        .get('/api/v1/companies/' + companyId + '/decorations/' + id)
        .then(function (res) {
          // ESLINT!!
          var Model = model;

          var decoration = new Model(res.data);
          decoration.CompanyId = decoration.Company.Id;
          return decoration;
        });
    }

    function query(companyId, qs) {
      var requestConfig = {
        method: 'GET',
        url: '/api/v1/companies/' + companyId + '/decorations',
        params: getParams(qs),
      };

      return $http(requestConfig).then(function (res) {
        res.data.Results = new model.List(res.data.Results);

        return res.data;
      });

      function getParams(qs) {
        return {
          rpp: 5,
          term: qs,
        };
      }
    }

    function removeDetail(item) {
      removeItem(this.Details, item);
    }

    function removeItem(arr, item) {
      if (angular.isDefined(item)) {
        if (typeof item === 'number') {
          if (angular.isDefined(arr[item])) {
            arr.splice(item, 1);
          }
        } else {
          arr.splice(arr.indexOf(item), 1);
        }
      }
    }

    function setSequence(arr) {
      angular.forEach(arr, function (v, i) {
        v.Sequence = i;
      });
    }
  }
})();
*/

export function createCompanyDecoration(options: Partial<CompanyDecoration>) {
  return {
    Name: '',
    CompanyId: null,
    CompanyName: '',
    MediaLinks: [],
    Details: [createDecorationDetail()],
    Decoration: {},
    ...options,
  };
}

export interface CompanyDecoration {
  Name: string;
  CompanyId: any;
  CompanyName: string;
  Description: string;
  MediaLinks: MediaLink[]; // ??
  Details: DecorationLineItemDetail[];
  Decoration: ProductAttribute; // ??
}
