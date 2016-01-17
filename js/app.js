//MGENz6FtyJZsr6ssaTCICtTimZkoIcWwo

//key: 1sKshjbmFNMzzyXiDPUmksJKfY7Uo3AlMQ09p7_46XmE
//1sKshjbmFNMzzyXiDPUmksJKfY7Uo3AlMQ09p7_46XmE
//https://docs.google.com/spreadsheets/d/1sKshjbmFNMzzyXiDPUmksJKfY7Uo3AlMQ09p7_46XmE/edit?usp=sharing
(function(){


	function show_div(toShow)
    {
        var show = document.getElementById(toShow);
        show.style.display = "";
    }

   var app = angular.module('myApp', []);
   app.controller('ctrl', ['$scope','$http', function($scope, $http){
   		$scope.googleJSON = [];
		$scope.active = 'home';
		$scope.newIDs = [];
	  	var onSuccess = function(response){
	  		//$scope.googleJSON = response.data.feed.entry;
	  		//only save relevant information in $scope.googleJSON
	  		for(var i = 0; i < response.data.feed.entry.length; i++) {
	  			var object = {};
	  			object.title = response.data.feed.entry[i].gsx$title.$t;
				object.stars = response.data.feed.entry[i].gsx$stars.$t;
				object.review = response.data.feed.entry[i].gsx$review.$t;
				object.imdbID = response.data.feed.entry[i].gsx$imdbid.$t;
				object.type = response.data.feed.entry[i].gsx$type.$t;
				$scope.googleJSON.push(object);
	  		}
			for(var i = 0; i < $scope.googleJSON.length; i++) {
				if($scope.googleJSON[i].imdbID !== "") {
					//already recorded imdb ID
					$scope.getObjectDataByID($scope.googleJSON[i].imdbID,i);
				} else {
					//only title available
	  				$scope.getObjectData($scope.googleJSON[i].title,i);
	  			}
	 		}

	  	};
	  var onError = function(response){
	    console.log("error: " + response);
	  };


	  //collect the data from the spreadsheet and sort it into the movies and shows arrays.
	  $scope.getData = function(){
	  	var urlToGoogleSheetCells = "https://spreadsheets.google.com/feeds/" +
							"list/" +
							"1sKshjbmFNMzzyXiDPUmksJKfY7Uo3AlMQ09p7_46XmE/" +
							"1/public/full?alt=json";
	    $http.get(urlToGoogleSheetCells)
	    .then(onSuccess, onError);
	  };
	  //for each movie or show, draw some imdb data
	  $scope.getObjectData = function(title,index) {
	  	var imdbURL = "http://www.omdbapi.com/?y=&plot=short&r=json";
	  	imdbURL += "&t="+title;

	  	$http.get(imdbURL)
	    .then(function successCallback(response) {

    // this callback will be called asynchronously
    // when the response is available
			$scope.googleJSON[index].year = response.data.Year;
			$scope.googleJSON[index].imdbID = response.data.imdbID;
			$scope.googleJSON[index].url = "http://www.imdb.com/title/" + response.data.imdbID + "/";
			$scope.googleJSON[index].img = ""+response.data.Poster;
			$scope.googleJSON[index].imdbrating = response.data.imdbRating;
			$scope.googleJSON[index].imdbVotes = response.data.imdbVotes;
			$scope.googleJSON[index].plot = response.data.Plot;
			$scope.googleJSON[index].genre = response.data.Genre;
			//write the imdb id back to the table
			$scope.updateTable(response.data.imdbID, title);
			//$scope.newIDs.push({imdbID: response.data.imdbID, title:title});
  		}, onError);

	  }

	  $scope.updateTable = function(id,title) {
	  		request = $.ajax({
 		 	//url: "https://script.google.com/macros/s/AKfycbzV--xTooSkBLufMs4AnrCTdwZxVNtycTE4JNtaCze2UijXAg8/exec",
            url: "https://script.google.com/macros/s/AKfycbwmdx3HvYtQdLw5zPiyT73Qke2Gv4J_WqMtaiEJzck58iKDQo8w/exec",
            type: "post",
            data: {imdbID:id, title: title},
            error: function (e) {
            console.log("error: " + e.error);
        },
        success: function(mess) {
            console.log("success! " + title);
        }
        });
	  }
	   $scope.getObjectDataByID = function(id,index) {
	  	var imdbURL = "http://www.omdbapi.com/?y=&plot=short&r=json";
	  	imdbURL += "&i="+id;

	  	$http.get(imdbURL)
	    .then(function successCallback(response) {

    // this callback will be called asynchronously
    // when the response is available
			$scope.googleJSON[index].year = response.data.Year;
			$scope.googleJSON[index].url = "http://www.imdb.com/title/" + response.data.imdbID + "/";
			$scope.googleJSON[index].img = ""+response.data.Poster;
			$scope.googleJSON[index].imdbrating = response.data.imdbRating;
			$scope.googleJSON[index].imdbVotes = response.data.imdbVotes;
			$scope.googleJSON[index].plot = response.data.Plot;
			$scope.googleJSON[index].genre = response.data.Genre;
  		}, onError);

	  }
	  $scope.getData();
  }]); //app controller

  app.directive('watchelement', function() {
		return {
		restrict: 'E',
		templateUrl: 'ngdirectives/watchelement.html'
		};
  });
  //if an image is broken, handle it elegantly
  app.directive('img', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            // show an image-missing image
            element.error(function () {
                var w = element.width();
                var h = element.height();
                // using 20 here because it seems even a missing image will have ~18px width
                // after this error function has been called
                if (w <= 20) { w = 100; }
                if (h <= 20) { h = 100; }
                var url = 'http://placehold.it/' + w + 'x' + h + '/cccccc/ffffff&text=No image!';
                element.prop('src', url);
                element.css('border', 'double 3px #cccccc');
            });
        }
    }
});
})();
