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
		$("#password-length").val(items.personal_endIndex - items.personal_startIndex).removeAttr("disabled");
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
		$("#password-length").val(items.personal_endIndex - items.personal_startIndex).removeAttr("disabled");
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
		$("#password-length").val(items.official_endIndex - items.official_startIndex).removeAttr("disabled");
		$("#save-button>a").removeClass("disabled");
		$("#cancel-button>a").removeClass("disabled");
		$("#reset-button>a").removeClass("disabled");
  	});
});

$("#extra-security-sequence").focusout(function(){
	var extraSequence = $("#extra-security-sequence");
	if( extraSequence.val().length > 500 ){
		extraSequence.parent().addClass("has-error");
		extraSequence.siblings(".errors").show();
		extraSequence.keyup(function(){
			extraSequence.parent().removeClass("has-error");
			extraSequence.siblings(".errors").hide();
		});
	}
	else{
		extraSequence.parent().removeClass("has-error");
		extraSequence.siblings(".errors").hide();
	}
});

$("#password-length").focusout(function(){
	var passwordLength = $("#password-length");
	if(!numberRegex.test(passwordLength.val()) || passwordLength.val() > 128 || passwordLength.val() < 12){
		passwordLength.parent().addClass("has-error");
		passwordLength.siblings(".errors").show();
		passwordLength.keyup(function(){
			passwordLength.parent().removeClass("has-error");
			passwordLength.siblings(".errors").hide();
		});
	}
	else{
		passwordLength.parent().removeClass("has-error");
		passwordLength.siblings(".errors").hide();
	}
});

function deriveStartIndexAndEndIndex(extraSequence, passwordLength){
	var startIndex = 0;
	var endIndex = 12;
	var extraLength = extraSequence.length % 116;
	startIndex = extraLength;
	endIndex = extraLength + passwordLength;
	if(endIndex > 128){
		if( extraLength > (endIndex - 128) ){
			extraLength = extraLength - (endIndex - 128);
			startIndex = extraLength;
			endIndex = extraLength + passwordLength;
		}
		else{
			startIndex = 0;
			endIndex = passwordLength;
		}
	}
	return {"startIndex": startIndex, "endIndex": endIndex}
}

//Save button
$("#save-button").click(function(){
	var extraSequence = $("#extra-security-sequence").val();
	var passwordLength = parseInt($("#password-length").val())	;

	if( !numberRegex.test(passwordLength) || passwordLength > 128 || passwordLength < 12 ){
		$("#tooltip").html("Failed to save your options, rectify errors in password length field").fadeIn();
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},3000);
		return;
	}

	if( extraSequence.length > 500 ){
		$("#tooltip").html("Failed to save your options, rectify errors in extra sequence field").fadeIn();
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},3000);
		return;
	}

	var result = deriveStartIndexAndEndIndex(extraSequence, passwordLength);
	var startIndex = result.startIndex;
	var endIndex = result.endIndex;

	if($("#profile-personal").parent().hasClass("active"))
	{
		personal_extraSequence = extraSequence;
		personal_startIndex = startIndex;
		personal_endIndex = endIndex;
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
		official_startIndex = startIndex;
		official_endIndex = endIndex;
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
	$("#extra-security-sequence").parent().removeClass("has-error");
	$("#password-length").parent().removeClass("has-error");
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
			$("#password-length").val(endIndex - startIndex);
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
			$("#password-length").val(endIndex - startIndex);
			$("#tooltip").html("Your operations are canceled for official profile").fadeIn();
	  	});
	}
    $("#password-length").parent().removeClass("has-error");
    $("#password-length").siblings(".errors").hide();
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
	$("#password-length").val(endIndex - startIndex);
    $("#password-length").parent().removeClass("has-error");
    $("#password-length").siblings(".errors").hide();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2500);
});

$(".btn-group a").on('click', function(){
	$(this).siblings().removeClass("active");
	$(this).addClass("active");
});
	
