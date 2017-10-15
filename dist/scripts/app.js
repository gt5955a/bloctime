var blocTimeModule = angular.module('blocTimeModule', ['ui.router']);

blocTimeModule.config(function($stateProvider, $locationProvider){
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $stateProvider.state('home', {
    url: '/',
    templateUrl: '/templates/home.html'
  });
});

blocTimeModule.controller('TimerCtrl', ['$log', '$scope', '$interval', function($log, $scope, $interval){
  $log.debug('TimerCtrl');

  $scope.counter = 1500;
  var stop;
  var isTimerRunning = false;

  $scope.startTimer = function(){
    this.isTimerRunning = true;
    stop = $interval(function(){
      $scope.counter--;
      if($scope.counter == 0){
        $interval.cancel(stop);
        $scope.counter = 1500;
      }
    }, 1000);
  };

  $scope.stopTimer = function(){
    $interval.cancel(stop);
    $scope.counter = 1500;
    this.isTimerRunning = false;
  }
}]);

blocTimeModule.filter('timeCode', function(){
  return function(seconds){
    var seconds = Number.parseFloat(seconds);

    var wholeSeconds = Math.floor(seconds);
    var minutes = Math.floor(wholeSeconds / 60);
    var remainingSeconds = wholeSeconds % 60;

    var output = minutes + ':';

    if (remainingSeconds < 10){
      output += '0';
    }

    output += remainingSeconds;

    return output;
  }
});
