// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngStorage'])
  .config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

  }])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: "NavCtrl"
      })
      .state('tabs.list', {
        url: '/list/:id',
        views: {
          'list-tab': {
            templateUrl: 'templates/carDescription.html',
            controller: 'ListController'
          }
        }
      })
      .state('tabs.gallery', {
        url: '/gallery',
        views: {
          'gallery-tab': {
            templateUrl: 'templates/gallery.html',
            controller: 'CarsCtrl'
          }
        }
      })
      .state('tabs.assistance', {
        url: '/assistance',
        views: {
          'assistance-button': {
            templateUrl: 'templates/assistance.html',
            controller: 'AssistanceCtrl'
          }
        }
      })
      .state('tabs.my-gallery', {
        url: '/my-gallery',
        views: {
          'my-gallery-tab': {
            templateUrl: 'templates/my-gallery.html',
            controller: 'GalleryCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/tab/list/112')
  })
  .controller("ListController", function ($scope, Data, $ionicSideMenuDelegate, $state, cam) {
    var carId = $state.params.id;



    $scope.car = Data.carById(carId)

    // $scope.toggleRight = function () {
    //   console.log("hhhhhh");
    //   $ionicSideMenuDelegate.toggleRight();
    // }
    $scope.title = "Interactive Beacon App";

    $scope.takePhoto = function () {
      cam.takePhoto()
    }
  })
  .controller("CarsCtrl", function ($scope, Data) {
    $scope.title = "Photo Gallery";
    $scope.allCars = Data.getAllCars()
  })
  .controller("NavCtrl", function ($scope, $ionicSideMenuDelegate, $ionicPopup) {
    console.log("nav ctrl")
    $scope.title = "Car Interactive App";

    //===================================
    // A confirm dialog
    $scope.showConfirm = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Get Assitance',
        template: 'Are you sure you need assistance? If yes, click OK and one of our staff will come over to help you'
      });
      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    };
    //===================================

    $scope.toggleRight = function () {
      $ionicSideMenuDelegate.toggleRight();
    };
    //close side menu on state change
    $scope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams){
        if($ionicSideMenuDelegate.isOpen()){
          $ionicSideMenuDelegate.toggleRight();
        }
      });
  })
  .controller("GalleryCtrl", function ($scope, cam, StorageService) {
    $scope.title = "My Photos";
    $scope.allpic = [];

    //when screen page is loaded, display somehting to console
    // $scope.$on('$ionicView.afterEnter', function(){
      console.log("After Entered Interactive Guide");
      $scope.allpic = cam.getAllFotos;
      // $scope.allpic = ["A7", "mercedes1", "tesla_model_s", "volkswagen_beetle", "wheelSystem", "temp"];
      // $scope.allpic = ["DSC_0062", "DSC_0063", "DSC_0064", "DSC_0065", "DSC_0066"];
      // console.log($scope.allpic.length);
    $scope.things = StorageService.getAll();
    console.log($scope.things.length);
  })
  .controller("AssistanceCtrl", function ($scope) {

  })
  .factory("cam", function ($cordovaCamera, StorageService) {
    var allPic = [];
    var tp = function() {
      var options = {
        quality : 90,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.CAMERA,
        allowEdit : false,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true,
        // targetWidth: 300,
        // targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        allPic.push("data:image/jpeg;base64," + imageData);
        StorageService.add("data:image/jpeg;base64," + imageData);
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }

    return{
      takePhoto:tp,
      getAllFotos:allPic
    }
  })
  .directive('temp', ["$timeout", function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, elem, attr) {
        function checkSize(){
          console.log(elem.prop('offsetHeight'));
          console.log(elem.prop('clientWidth'));

        }
        var myVar = $timeout( checkSize, 1500 );

      }
    }
  }])
  .factory ('StorageService', function ($localStorage) {
  $localStorage = $localStorage.$default({
    things: []
  });

  var _getAll = function () {
    return $localStorage.things;
  };
  var _add = function (thing) {
    // console.log("adding:  " + thing);
    $localStorage.things.push(thing);
  }
  var _remove = function (thing) {
    $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
  }
  return {
    getAll: _getAll,
    add: _add,
    remove: _remove
  };
})
