angular.module('starter', ['ionic', 'ngCordova'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
              cordova.plugins.Keyboard.disableScroll(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .controller('appController', function($scope, $ionicPlatform, $cordovaImagePicker, $cordovaCamera, $q, $window) {
      $scope.openGallery = function() {
          console.log('OpenGallery');
          $ionicPlatform.ready(function() {
              console.log('$ionicPlatform ready');
              var options = {
                  maximumImagesCount: 1
              };
              $cordovaImagePicker.getPictures(options)
              .then(function (results) {
                  console.log('Image URI: ' + results[0]);
                  var fileName = getFileName(results[0]);
                  var pathName = getPathName(results[0]);
                  var fileFormat = getFileFormat(results[0]);
                  console.log('Filename: ' + fileName);
                  console.log('Path name: ' + pathName);
                  console.log('File format: ' + fileFormat);
                  readAsArrayBuffer(pathName, fileName).then(function(success) {
                      console.log('Success: ');
                      console.log(success);
                      var blob = new Blob([new Uint8Array(success)], { type: 'image/' + fileFormat });
                      displayImage(blob);
                  }).catch(function(error) {
                      console.log('Error: ');
                      console.log(error);
                  });
              }, function(e) {
                  console.log('Error: ');
                  console.log(e);
              });
          });
      };

      $scope.openCamera = function() {
          console.log('OpenCamera');
          $ionicPlatform.ready(function() {
              console.log('$ionicPlatform ready');
              $cordovaCamera.getPicture({
                  quality: 20,
                  sourceType: Camera.PictureSourceType.CAMERA,
                  destinationType: Camera.DestinationType.FILE_URI,
                  correctOrientation: true
              }).then(function(imageData) {
                  console.log('Image uri :' + imageData);
                  var fileName = getFileName(imageData);
                  var pathName = getPathName(imageData);
                  var fileFormat = getFileFormat(imageData);
                  console.log('Filename: ' + fileName);
                  console.log('Path name: ' + pathName);
                  console.log('File format: ' + fileFormat);
                  readAsArrayBuffer(pathName, fileName).then(function(success) {
                      console.log('Success: ');
                      console.log(success);
                      var blob = new Blob([new Uint8Array(success)], { type: 'image/' + fileFormat });
                      displayImage(blob);
                  }).catch(function(error) {
                      console.log('Error: ');
                      console.log(error);
                  });
              }).catch(function(e) {
                  console.log('Error: ');
                  console.log(e);
              });
          });
      };

      var errorCodes = {
          1: 'NOT_FOUND_ERR',
          2: 'SECURITY_ERR',
          3: 'ABORT_ERR',
          4: 'NOT_READABLE_ERR',
          5: 'ENCODING_ERR',
          6: 'NO_MODIFICATION_ALLOWED_ERR',
          7: 'INVALID_STATE_ERR',
          8: 'SYNTAX_ERR',
          9: 'INVALID_MODIFICATION_ERR',
          10: 'QUOTA_EXCEEDED_ERR',
          11: 'TYPE_MISMATCH_ERR',
          12: 'PATH_EXISTS_ERR'
      };

      function getFileName(path) {
          var arr = path.split('/');
          return arr[arr.length - 1];
      }

      function getPathName(path) {
          var arr = path.split('/');
          return arr.slice(0, arr.length - 1).join('/');
      }

      function getFileFormat(path) {
          var arr = path.split('.');
          return arr[arr.length - 1];
      }

      function displayImage(blob) {
            var elem = document.getElementById('imageFile');
            elem.src = window.URL.createObjectURL(blob);
      }

      function readAsArrayBuffer(path, file) {
         var q = $q.defer();

         if ((/^\//.test(file))) {
           q.reject('file-name cannot start with \/');
         }

         try {
           $window.resolveLocalFileSystemURL(path, function (fileSystem) {
             fileSystem.getFile(file, {create: false}, function (fileEntry) {
               fileEntry.file(function (fileData) {
                 var reader = new FileReader();
                 reader.onloadend = function (evt) {
                   if (evt.target.result !== undefined || evt.target.result !== null) {
                     q.resolve(evt.target.result);
                   } else if (evt.target.error !== undefined || evt.target.error !== null) {
                     q.reject(evt.target.error);
                   } else {
                     q.reject({code: null, message: 'READER_ONLOADEND_ERR'});
                   }
                 };
                 reader.readAsArrayBuffer(fileData);
               });
             }, function (error) {
               error.message = $cordovaFileError[error.code];
               q.reject(error);
             });
           }, function (err) {
             err.message = $cordovaFileError[err.code];
             q.reject(err);
           });
         } catch (e) {
           e.message = $cordovaFileError[e.code];
           q.reject(e);
         }

         return q.promise;
       }
});
