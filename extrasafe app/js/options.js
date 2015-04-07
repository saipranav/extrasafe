/*******************************************************************************************
Just Remember one Master Password text, Extrasafe takes care of the rest ;)
Extrasafe (C) 2014-2015  The Extra Labs
GNU General Public License v3
http://theextralabs.com
********************************************************************************************/
var store = window.localStorage;
var numberRegex = /^\d+$/;

//Default profile is personal
$("#extra-security-sequence").val(store.getItem("personal_extraSequence")).removeAttr("disabled");
$("#password-length").val( store.getItem("personal_endIndex") - store.getItem("personal_startIndex") ).removeAttr("disabled");

//Switch profile values as user clicks the profiles
//If default profile is selected disable everything as they are not allowed to change anything
$("#profile-personal").parent().on('click', function(){
	$("#extra-security-sequence").val(store.getItem("personal_extraSequence")).removeAttr("disabled");
	$("#password-length").val( store.getItem("personal_endIndex") - store.getItem("personal_startIndex") ).removeAttr("disabled");
	$("#save-button>a").removeClass("disabled");
	$("#cancel-button>a").removeClass("disabled");
	$("#reset-button>a").removeClass("disabled");
});
$("#profile-official").parent().on('click', function(){
	$("#extra-security-sequence").val(store.getItem("official_extraSequence")).removeAttr("disabled");
	$("#password-length").val( store.getItem("official_endIndex") - store.getItem("official_startIndex") ).removeAttr("disabled");
	$("#save-button>a").removeClass("disabled");
	$("#cancel-button>a").removeClass("disabled");
	$("#reset-button>a").removeClass("disabled");
});

//validate the extra sequence as user focuses out
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

//validate the password length as user focuses out 
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

//derive start and end index from extra sequence and password length
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

//validate the start index and end index and save the options as per profiles
$("#save-button").click(function(){
	var extraSequence = $("#extra-security-sequence").val();
	var passwordLength = parseInt($("#password-length").val());

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
		store.setItem("personal_extraSequence", extraSequence);
		store.setItem("personal_startIndex", startIndex);
		store.setItem("personal_endIndex", endIndex);
	}
	else if($("#profile-official").parent().hasClass("active"))
	{
		store.setItem("official_extraSequence", extraSequence);
		store.setItem("official_startIndex", startIndex);
		store.setItem("official_endIndex", endIndex);
	}
	$("#tooltip").html("All your options are saved").fadeIn();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2000);
	$("#extra-security-sequence").parent().removeClass("has-error");
	$("#password-length").parent().removeClass("has-error");
	if( (store.getItem("default_extraSequence")=="" && store.getItem("default_startIndex")==0 && store.getItem("default_endIndex")==12 ) 
		&& (store.getItem("personal_extraSequence")=="" && store.getItem("personal_startIndex")==0 && store.getItem("personal_endIndex")==12 )
		&& (store.getItem("official_extraSequence")=="" && store.getItem("official_startIndex")==0 && store.getItem("official_endIndex")==12 ) ){
			$("#default-options").show();
	}
	else{
		$("#default-options").hide();
	}
});

//Get the options for perticular profile and change the present values
$("#cancel-button").click(function(){
	if($("#profile-personal").parent().hasClass("active"))
	{
		personal_extraSequence = store.getItem("personal_extraSequence");
		personal_startIndex = store.getItem("personal_startIndex");
		personal_endIndex = store.getItem("personal_endIndex");
		$("#extra-security-sequence").val(personal_extraSequence);
		$("#password-length").val(personal_endIndex - personal_startIndex);
		$("#tooltip").html("Your operations are canceled for personal profile").fadeIn();
	}
	else if($("#profile-official").parent().hasClass("active"))
	{
		official_extraSequence = store.getItem("official_extraSequence");
		official_startIndex = store.getItem("official_startIndex");
		official_endIndex = store.getItem("official_endIndex");
		$("#extra-security-sequence").val(official_extraSequence);
		$("#password-length").val(personal_endIndex - personal_startIndex);
		$("#tooltip").html("Your operations are canceled for official profile").fadeIn();
	}
	$("#extra-security-sequence").parent().removeClass("has-error");
    $("#extra-security-sequence").siblings(".errors").hide();
    $("#password-length").parent().removeClass("has-error");
    $("#password-length").siblings(".errors").hide();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2000);
});

//Reset the current values with default options for selected profile
$("#reset-button").click(function(){
	var extraSequence = "";
	var startIndex = 0;
	var endIndex = 12;
	if($("#profile-personal").parent().hasClass("active"))
	{
		store.setItem("personal_extraSequence", extraSequence);
		store.setItem("personal_startIndex", startIndex);
		store.setItem("personal_endIndex", endIndex);
		$("#extra-security-sequence").val(extraSequence);
		$("#password-length").val(endIndex - startIndex);
		$("#tooltip").html("All your options are reset to default for personal profile").fadeIn();
	}
	else if($("#profile-official").parent().hasClass("active"))
	{
		store.setItem("official_extraSequence", extraSequence);
		store.setItem("official_startIndex", startIndex);
		store.setItem("official_endIndex", endIndex);
		$("#extra-security-sequence").val(extraSequence);
		$("#password-length").val(endIndex - startIndex);
		$("#tooltip").html("All your options are reset to default for official profile").fadeIn();
	}
    $("#extra-security-sequence").parent().removeClass("has-error");
    $("#extra-security-sequence").siblings(".errors").hide();
    $("#password-length").parent().removeClass("has-error");
    $("#password-length").siblings(".errors").hide();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2500);
});

//on click update the profile with active class
$(".btn-group a").on('click', function(){
	$(this).siblings().removeClass("active");
	$(this).addClass("active");
});
	
