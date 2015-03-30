/*******************************************************************************************
Just Remember one Master Password text, Extrasafe takes care of the rest ;)
Extrasafe (C) 2014-2015  The Extra Labs
GNU General Public License v3
http://theextralabs.com
********************************************************************************************/
var numberRegex = /^\d+$/;

$(document).ready(function(){
	chrome.storage.local.get({
    	personal_extraSequence : "",
		personal_startIndex : 0,
		personal_endIndex : 12
  	}, function(items) {
  		$("#extra-security-sequence").val(items.personal_extraSequence).removeAttr("disabled");
		$("#start-index").val(items.personal_startIndex).removeAttr("disabled");
		$("#end-index").val(items.personal_endIndex).removeAttr("disabled");
		chrome.storage.local.set({
			personal_extraSequence : items.personal_extraSequence,
			personal_startIndex : items.personal_startIndex,
			personal_endIndex : items.personal_endIndex
		});
  	});
  	chrome.storage.local.get({
    	official_extraSequence : "",
		official_startIndex : 0,
		official_endIndex : 12
  	}, function(items) {
		chrome.storage.local.set({
			official_extraSequence : items.official_extraSequence,
			official_startIndex : items.official_startIndex,
			official_endIndex : items.official_endIndex
		});
  	});
  	chrome.storage.local.get({
    	default_extraSequence : "",
		default_startIndex : 0,
		default_endIndex : 12
  	}, function(items) {
		chrome.storage.local.set({
			default_extraSequence : items.default_extraSequence,
			default_startIndex : items.default_startIndex,
			default_endIndex : items.default_endIndex
		});
  	});
});


$("#profile-personal").parent().on('click', function(){
	chrome.storage.local.get({
    	personal_extraSequence : "",
		personal_startIndex : 0,
		personal_endIndex : 12
  	}, function(items) {
		$("#extra-security-sequence").val(items.personal_extraSequence).removeAttr("disabled");
		$("#start-index").val(items.personal_startIndex).removeAttr("disabled");
		$("#end-index").val(items.personal_endIndex).removeAttr("disabled");
		$("#save-button>a").removeClass("disabled");
		$("#cancel-button>a").removeClass("disabled");
		$("#reset-button>a").removeClass("disabled");
  	});
});
$("#profile-official").parent().on('click', function(){
	chrome.storage.local.get({
    	official_extraSequence : "",
		official_startIndex : 0,
		official_endIndex : 12
  	}, function(items) {
		$("#extra-security-sequence").val(items.official_extraSequence).removeAttr("disabled");
		$("#start-index").val(items.official_startIndex).removeAttr("disabled");
		$("#end-index").val(items.official_endIndex).removeAttr("disabled");
		$("#save-button>a").removeClass("disabled");
		$("#cancel-button>a").removeClass("disabled");
		$("#reset-button>a").removeClass("disabled");
  	});
});	


$("#start-index").focusout(function(){
	var startIndex = $("#start-index");
	if(!numberRegex.test(startIndex.val()) || startIndex.val() > 115 || startIndex.val() < 0){
		startIndex.parent().addClass("has-error");
		startIndex.siblings(".errors").show();
		startIndex.keyup(function(){
			startIndex.parent().removeClass("has-error");
			startIndex.siblings(".errors").hide();
		});
	}
	else{
		startIndex.parent().removeClass("has-error");
		startIndex.siblings(".errors").hide();
	}
});

$("#end-index").focusout(function(){
	var endIndex = $("#end-index");
	if(!numberRegex.test(endIndex.val()) || endIndex.val() > 128 || endIndex.val() < 12){
		endIndex.parent().addClass("has-error");
		endIndex.siblings(".errors").show();
		endIndex.keyup(function(){
			endIndex.parent().removeClass("has-error");
			endIndex.siblings(".errors").hide();
		});
	}
	else{
		endIndex.parent().removeClass("has-error");
		endIndex.siblings(".errors").hide();
	}
});


//Save button
$("#save-button").click(function(){
	var extraSequence = $("#extra-security-sequence").val();
	var startIndex = $("#start-index").val();
	var endIndex = $("#end-index").val();
    var startIndexNum = parseInt($("#start-index").val());
    var endIndexNum = parseInt($("#end-index").val());
	if( !numberRegex.test(startIndex) || !numberRegex.test(endIndex) || (startIndexNum<0) || (endIndexNum>128) || (startIndexNum>=endIndexNum) || (startIndexNum>115) || (endIndexNum<12)){
		$("#tooltip").html("Failed to save your options, please rectify the errors in red input boxes").fadeIn();
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},3000);
		return;
	}
	if( endIndex-startIndex < 12  ){
		$("#tooltip").html("The difference between the end and start index should be atleast 12").fadeIn();
		$("#start-index").parent().addClass("has-error");
		$("#end-index").parent().addClass("has-error");
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},3000);
		return;
	}

	if($("#profile-personal").parent().hasClass("active"))
	{
		personal_extraSequence = extraSequence;
		personal_startIndex = startIndexNum;
		personal_endIndex = endIndexNum;
		chrome.storage.local.set({
			personal_extraSequence : personal_extraSequence,
			personal_startIndex : personal_startIndex,
			personal_endIndex : personal_endIndex
		}, function(){
			$("#tooltip").html("All your options are saved for personal profile").fadeIn();
			setTimeout(function(){
				$("#tooltip").fadeOut();
			},2000);
		});
	}
	else if($("#profile-official").parent().hasClass("active"))
	{
		official_extraSequence = extraSequence;
		official_startIndex = startIndexNum;
		official_endIndex = endIndexNum;
		chrome.storage.local.set({
			official_extraSequence : official_extraSequence,
			official_startIndex : official_startIndex,
			official_endIndex : official_endIndex
		}, function(){
			$("#tooltip").html("All your options are saved for official profile").fadeIn();
			setTimeout(function(){
				$("#tooltip").fadeOut();
			},2000);
		});
	}
	$("#start-index").parent().removeClass("has-error");
	$("#end-index").parent().removeClass("has-error");

});


//Cancel button
$("#cancel-button").click(function(){
	if($("#profile-personal").parent().hasClass("active"))
	{
		chrome.storage.local.get({
	    	personal_extraSequence : "",
			personal_startIndex : 0,
			personal_endIndex : 12
	  	}, function(items) {
			var extraSequence = items.personal_extraSequence;
			var startIndex = items.personal_startIndex;
			var endIndex = items.personal_endIndex;
			$("#extra-security-sequence").val(extraSequence);
			$("#start-index").val(startIndex);
			$("#end-index").val(endIndex);
			$("#tooltip").html("Your operations are canceled for personal profile").fadeIn();
	  	});
	}
	else if($("#profile-official").parent().hasClass("active"))
	{
		chrome.storage.local.get({
	    	official_extraSequence : "",
			official_startIndex : 0,
			official_endIndex : 12
	  	}, function(items) {
			var extraSequence = items.official_extraSequence;
			var startIndex = items.official_startIndex;
			var endIndex = items.official_endIndex;
			$("#extra-security-sequence").val(extraSequence);
			$("#start-index").val(startIndex);
			$("#end-index").val(endIndex);
			$("#tooltip").html("Your operations are canceled for official profile").fadeIn();
	  	});
	}
    $("#start-index").parent().removeClass("has-error");
    $("#start-index").siblings(".errors").hide();
    $("#end-index").parent().removeClass("has-error");
    $("#end-index").siblings(".errors").hide();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2000);
});


//Reset button
$("#reset-button").click(function(){
	var extraSequence = "";
	var startIndex = 0;
	var endIndex = 12;
	if($("#profile-personal").parent().hasClass("active"))
	{
		chrome.storage.local.set({
			personal_extraSequence : extraSequence,
			personal_startIndex : startIndex,
			personal_endIndex : endIndex
		}, function(){
			$("#tooltip").html("All your options are reset to default for personal profile").fadeIn();
		});
	}
	else if($("#profile-official").parent().hasClass("active"))
	{
		chrome.storage.local.set({
			official_extraSequence : extraSequence,
			official_startIndex : startIndex,
			official_endIndex : endIndex
		}, function(){
			$("#tooltip").html("All your options are reset to default for official profile").fadeIn();
		});
	}
	$("#extra-security-sequence").val(extraSequence);
	$("#start-index").val(startIndex);
	$("#end-index").val(endIndex);
    $("#start-index").parent().removeClass("has-error");
    $("#start-index").siblings(".errors").hide();
    $("#end-index").parent().removeClass("has-error");
    $("#end-index").siblings(".errors").hide();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2500);
});

$(".btn-group a").on('click', function(){
	$(this).siblings().removeClass("active");
	$(this).addClass("active");
});
	