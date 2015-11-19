/*DEFINE ENGINE PARTS*/
var cardTemplate;
var cardsData = [];
var currentCardData = {};
var results = {
	"user": {},
	"answers": []
};

/*DEFINE ENGINE FUNCTIONALITY*/
function init(){
	/*Create and cache card template*/
	cardTemplate = Handlebars.compile($("#card-template").html());

	/*Handle answer click event*/
	$("card").on("click", ".answer", answerClicked);
}

function getCardsData(success){
	$.ajax({"url": "cards.json"})
	.success(success)
	.error(function(errorCode){
		console.error("Data for cards are not available");
	});
}

function generateCard(cardNumber){
	currentCardData = cardsData[cardNumber];
	if(currentCardData == undefined){
		currentCardData = cardsData[cardsData.length-1];
	}
	$("card").html( cardTemplate(currentCardData));
}

function answerClicked(){
	var nextCardNumber = parseInt($(this).attr("data-answer-to"));
	saveAnswers(currentCardData.number, $(this).text().trim());
	$.when( $("#current").removeClass("slideInFromTop").addClass("slideOutToBottom").delay( 1000 ) )
	.done( function(){
		generateCard(nextCardNumber);
		updateUrl(nextCardNumber);
	});
}

function updateUrl(cardNumber){
	var location = window.location.href;
	if(location.indexOf("#card") == -1){
		window.location.href = location+"#card=0"
	}
	else{
		window.location.href = location.replace(
								location.substr(
									location.indexOf("#card="), location.length)
								, "#card="+cardNumber);
	}
}

$(window).on("hashchange", function(event){
	var location = window.location.href;
	var previousCardNumber = location.substr(location.indexOf("#card=")+6, location.length);
	if( $("#questions").attr("data-card-number") != previousCardNumber ){
		generateCard(previousCardNumber);
	}
})

function saveAnswers(cardNumber, answer){
	var tempAnswer = {
		"number": cardNumber,
		"question": cardsData[cardNumber].question,
		"answer": answer 
	};
	$("#help-elements [data-for]").each(function(){
		if( $(this).prop("tagName") == "PAPER-INPUT" ){
			var key = $(this).attr("data-for");
			var value = $(this).val();
			tempAnswer[key] = value;
		}
		else if( $(this).prop("tagName") == "PAPER-TOGGLE-BUTTON" ){
			var key = $(this).prop("data-for");
			var value = $(this).prop("checked");
			tempAnswer[key] = value;
		}
	});
	results.answers.push( tempAnswer );
}

/*START ENGINE*/
$(function(){
	init();
	getCardsData(function(data){
		cardsData = data;
		currentCardData = cardsData[0];
		generateCard(0);
		updateUrl(0);
	});
});
