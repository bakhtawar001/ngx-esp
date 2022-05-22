/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('MediaLink', MediaLink);

  MediaLink.$inject = ['$simpleModelFactory'];

  function MediaLink($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        DownloadFileName: '',
        DownloadFileUrl: '',
        FileType: '',
        FileUrl: '',
        MediaId: '',
        OnDiskFileName: '',
        OriginalFileName: '',
        Extension: '',
        IsVisible: true,
      },
      init: function (instance) {
        if (instance.OriginalFileName) {
          instance.Extension = getFileExtension(instance.OriginalFileName);
        }
      },
    });

    return model;
  }
})();
*/

export function getFileExtension(fileName: string) {
  var re = /(?:\.([^.]+))?$/;
  return re.exec(fileName)[1];
}
