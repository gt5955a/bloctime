var workSession = 1500;
var breakSession = 300;

angular.module('blocTimeModule', ['ui.router'])

.config(function($stateProvider, $locationProvider){
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $stateProvider.state('home', {
    url: '/',
    templateUrl: '/templates/home.html'
  });
})

/* .constant('sessions', {
  'WORK_SESSION': 1500,
  'BREAK_SESSION': 300
}) */

.controller('TimerCtrl', ['$log', '$scope', '$interval', function($log, $scope, $interval){
  $log.debug('TimerCtrl');

  $scope.counter = workSession;
  $scope.isWorking = false;
  $scope.onBreak = false;
  var newSession;

  $scope.startTimer = function(){
    $scope.isWorking = true;

    newSession = $interval(function(){
      $scope.counter--;
      if ($scope.counter == 0){
        $interval.cancel(newSession);
        $scope.isWorking = false;

        if (!$scope.onBreak) {
          $scope.onBreak = true;
          /* $scope.onBreak = constant.BREAK_SESSION */
          $scope.counter = breakSession;
        } else {
          $scope.onBreak = false;
          /* $scope.isWorking = constant.WORK_SESSION; */
          $scope.counter = workSession;
        }
      }
    }, 1000);
  };

  $scope.resetTimer = function(){
    $interval.cancel(newSession);
    /* $scope.isWorking = constant.WORK_SESSION; */
    $scope.counter = workSession;
    $scope.isWorking = false;
  }
}])

.filter('timeCode', function(){
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
