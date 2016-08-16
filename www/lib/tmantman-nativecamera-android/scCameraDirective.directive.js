(function() {
    'use strict';

    angular
        .module('scryo.plugins.androidnativecamera', ['scryoengine.canvas'])
        .directive('scToolsCamera', scCamera);

    scCamera.$inject = ['$ionicPopup', 'CanvasMediator', '$cordovaCamera',
        '$ionicPlatform', 'DataChannelMessenger', 'ChatCanvasOps', 'PauseNotifier'];

    function scCamera($ionicPopup, CanvasMediator, $cordovaCamera,
        $ionicPlatform, DataChannelMessenger, ChatCanvasOps, PauseNotifier) {
        var ddo = {
            link: function(scope, element, attributes) {
                $ionicPlatform.ready(function() {
                    element.bind('click', function () {
                        PauseNotifier.notifyOfPause();
                        var dim = ChatCanvasOps.getCanvasSize();
                        console.log('scToolsCamera sees paper.width and paper.height: ' +
                            dim.height, dim.width);
                        $cordovaCamera.getPicture({
                            quality: 20,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            destinationType: Camera.DestinationType.FILE_URI,
                            correctOrientation: true,
                            targetWidth: dim.width,
                            targetHeight: dim.height
                        }).then(function(imageData) {
                            CanvasMediator.addImage(imageData);
                            DataChannelMessenger.sendFileFromUri(imageData);
                        }).catch(function(e) {
                            $ionicPopup.alert(e.toString());
                        }).finally(function() {
                            PauseNotifier.notifyOfResume();
                        });
                    });
                });
            },
            template: '',
            restrict: 'A'
        };
        return ddo;
    }
})();
