(function () {
  'use strict';

  angular.module('core.models').factory('CompanyArtwork', CompanyArtwork);

  CompanyArtwork.$inject = ['$modelFactory', '$http'];

  function CompanyArtwork($modelFactory, $http) {
    var model = $modelFactory('companies/{CompanyId}/media', {
      pk: 'Id',
      search: query,
      instance: {
        $delete: $delete,
      },
    });

    return model;

    function $delete() {
      var requestConfig = {
        method: 'DELETE',
        url: '/api/v1/companies/' + this.CompanyId + '/media/' + this.Id,
      };

      return $http(requestConfig);
    }

    function query(companyId, qs, params) {
      var requestConfig = {
        method: 'GET',
        url: '/api/v1/companies/' + companyId + '/media',
        params: getParams(qs),
      };

      return $http(requestConfig).then(function (res) {
        res.data.Results = new model.List(res.data.Results);

        return res.data;
      });
    }

    function getParams(qs, params) {
      return angular.extend(
        {
          term: qs,
        },
        params
      );
    }
  }
})();
