var workSession = 1500;
var shortBreak = 300;
var longBreak = 1500;

var beepSound = new buzz.sound('/assets/sounds/beep.mp3', {
  preload: true
})

angular.module('blocTimeModule', ['ui.router', 'firebase', 'ui.bootstrap'])

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
        $scope.isWorking = false;
        beepSound.play();

        if (!$scope.onBreak) {
          numSession++;
          console.log(numSession);
          $scope.onBreak = true;

          if (numSession % 4 === 0){
            $scope.counter = longBreak;
          } else {
            $scope.counter = shortBreak;
          }
        } else {
          $scope.onBreak = false;
          $scope.counter = workSession;
        }
      }
    }, 1000);
  };

  $scope.resetTimer = function(){
    $interval.cancel(currentSession);
    $scope.counter = workSession;
    $scope.isWorking = false;
  }
}])

.controller('TasksCtrl', ['$log', '$scope', 'Tasks', function($log, $scope, Tasks){
  $log.debug('TasksCtrl');

  $scope.tasks = Tasks.all;
  var currentDate = new Date().toString();

  $scope.addTask = function(){
    $scope.tasks.$add({
      task: $scope.task,
      completed: currentDate
    });
  };
}])

.factory('Tasks', ['$firebaseArray', function($firebaseArray){
  var ref = new Firebase('https://bloc-time-5622b.firebaseio.com');
  var tasks = $firebaseArray(ref);

  return {
    all: tasks
  };
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
