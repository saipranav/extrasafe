var appCards = angular.module("appCards", ["ngRoute"]);

appCards.controller("cardsController", ["$scope", "$http", "$log", "$location", function($scope, $http, $log, $location){

	/*this to store because we are storing data after ajax call success so scope changes if we use this inside success function*/
	var store = this;

	/*stores the path user has travelled*/
	store.path = [];

	store.directionForward = true;

	/*stores all answers that user has given for every question*/
	store.results={
		user: {},
		answers: {}
	};

	/*data to be shown for the previous card, current card, next card*/
	store.previousData = {};
	store.currentData = {};
	store.nextData = {};

	/*async http call to fetch data for all cards from cards.json in assets/data folder*/
	$http.get("app/data/cards.json")
		.success(function(data){
			store.data = data;
			store.currentData = store.data[0];
		})
		.error(function(){
			$log.error("Data for cards are not available check cards.json in assets/data");
		});

	/*store user details in answers object*/
	store.setUser = function(userObject){
		store.results.user = userObject;
	}
	
	/*change the current data to required data after user clicking some answer option*/
	store.answered = function(answer){
		/*current data transfered to previous data*/
		store.previousData = store.currentData;

		/*push the card number to path*/
		store.path.push(store.previousData.number);

		/*store results that user has selected for the question*/
		var tempCardNumber = store.previousData.number;
		store.results.answers.tempCardNumber = { "question": store.previousData.question, "answer": answer.text};

		/*validate the edge case where no 'to' exists in cards data*/
		store.currentData = store.data[answer.to];

		/*if application cannot find card data show the last card of cards*/
		if (store.currentData == undefined){
			store.currentData = store.data[store.data.length-1];
		}

		store.directionForward = false;

	};


} ] );

/*animate cards and make user think like screen showing the next card*/
appCards.directive("cards", function(){
	return{
		restrict: "E",
		transclude: true,
		templateUrl: "components/cards/view.html",
		scope: {
			card: "=",
			directionForward: "="
		},
		controller: function($scope){
			var control = this;
			$scope.$watch("$scope.directionForward", function renderAgain(){
				alert($scope.directionForward);
			});
		},
		link: function postLink(scope, element, attrs){
			element[0].querySelector(".answer").addEventListener("click", function(){
				scope.directionForward = false;
			});
		}
	};
});