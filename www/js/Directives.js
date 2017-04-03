(function () {
  var app = angular.module('starter');

  app.directive("carDescription", function () {
    return  {
      templateUrl: "../app/Car/html/carInfo.html",
      restrict: 'E',
      controller: "ListController"

    }
  })

  app.directive("mySideMenu", function () {
    return  {
      templateUrl: "../app/sideMenu/html/sideMenu.html",
      restrict: 'E',
      controller: "ListController"
    }
  })
}())
