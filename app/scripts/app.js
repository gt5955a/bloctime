var workSession = 60;
var shortBreak = 60;
var longBreak = 60;

var beepSound = new buzz.sound('/assets/sounds/beep.mp3', {
  preload: true
})

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

.controller('TimerCtrl', ['$log', '$scope', '$interval', function($log, $scope, $interval){
  $log.debug('TimerCtrl');

  $scope.counter = workSession;
  $scope.isWorking = false;
  $scope.onBreak = false;
  var currentSession;
  var numSession = 0;

  $scope.startTimer = function(){
    $scope.isWorking = true;

    currentSession = $interval(function(){
      $scope.counter--;
      if ($scope.counter == 0){
        $interval.cancel(currentSession);
        beepSound.play();
        $scope.isWorking = false;

        if (!$scope.onBreak) {
          numSession++;
          console.log(numSession);
          $scope.onBreak = true;

          if (numSession % 4 === 0){
            $scope.counter = longBreak;
            beepSound.play();
          } else {
            $scope.counter = shortBreak;
            beepSound.play();
          }
        } else {
          $scope.onBreak = false;
          $scope.counter = workSession;
          beepSound.play();
        }
      }
    }, 60);
  };

  $scope.resetTimer = function(){
    $interval.cancel(currentSession);
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
