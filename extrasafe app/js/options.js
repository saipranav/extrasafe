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
$("#start-index").val(store.getItem("personal_startIndex")).removeAttr("disabled");
$("#end-index").val(store.getItem("personal_endIndex")).removeAttr("disabled");

//Switch profile values as user clicks the profiles
//If default profile is selected disable everything as they are not allowed to change anything
$("#profile-personal").parent().on('click', function(){
	$("#extra-security-sequence").val(store.getItem("personal_extraSequence")).removeAttr("disabled");
	$("#start-index").val(store.getItem("personal_startIndex")).removeAttr("disabled");
	$("#end-index").val(store.getItem("personal_endIndex")).removeAttr("disabled");
	$("#save-button>a").removeClass("disabled");
	$("#cancel-button>a").removeClass("disabled");
	$("#reset-button>a").removeClass("disabled");
});
$("#profile-official").parent().on('click', function(){
	$("#extra-security-sequence").val(store.getItem("official_extraSequence")).removeAttr("disabled");
	$("#start-index").val(store.getItem("official_startIndex")).removeAttr("disabled");
	$("#end-index").val(store.getItem("official_endIndex")).removeAttr("disabled");
	$("#save-button>a").removeClass("disabled");
	$("#cancel-button>a").removeClass("disabled");
	$("#reset-button>a").removeClass("disabled");
});
$("#profile-default").parent().on('click', function(){
	$("#extra-security-sequence").val(store.getItem("default_extraSequence")).attr("disabled", "disabled");
	$("#start-index").val(store.getItem("default_startIndex")).attr("disabled", "disabled");
	$("#end-index").val(store.getItem("default_endIndex")).attr("disabled", "disabled");
	$("#save-button>a").addClass("disabled");
	$("#cancel-button>a").addClass("disabled");
	$("#reset-button>a").addClass("disabled");
});

//validate the start index as user focuses out 
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

//validate the end index as user focuses out
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

//validate the start index and end index and save the options as per profiles
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

	if($("#profile-default").parent().hasClass("active"))
	{
		store.setItem("default_extraSequence", extraSequence);
		store.setItem("default_startIndex", startIndexNum);
		store.setItem("default_endIndex", endIndexNum);
	}
	else if($("#profile-personal").parent().hasClass("active"))
	{
		store.setItem("personal_extraSequence", extraSequence);
		store.setItem("personal_startIndex", startIndexNum);
		store.setItem("personal_endIndex", endIndexNum);
	}
	else if($("#profile-official").parent().hasClass("active"))
	{
		store.setItem("official_extraSequence", extraSequence);
		store.setItem("official_startIndex", startIndexNum);
		store.setItem("official_endIndex", endIndexNum);
	}
	$("#tooltip").html("All your options are saved").fadeIn();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2000);
	$("#start-index").parent().removeClass("has-error");
	$("#end-index").parent().removeClass("has-error");
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
		$("#start-index").val(personal_startIndex);
		$("#end-index").val(personal_endIndex);
		$("#tooltip").html("Your operations are canceled for personal profile").fadeIn();
	}
	else if($("#profile-official").parent().hasClass("active"))
	{
		official_extraSequence = store.getItem("official_extraSequence");
		official_startIndex = store.getItem("official_startIndex");
		official_endIndex = store.getItem("official_endIndex");
		$("#extra-security-sequence").val(official_extraSequence);
		$("#start-index").val(official_startIndex);
		$("#end-index").val(official_endIndex);
		$("#tooltip").html("Your operations are canceled for official profile").fadeIn();
	}
    $("#start-index").parent().removeClass("has-error");
    $("#start-index").siblings(".errors").hide();
    $("#end-index").parent().removeClass("has-error");
    $("#end-index").siblings(".errors").hide();
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
		$("#start-index").val(startIndex);
		$("#end-index").val(endIndex);
		$("#tooltip").html("All your options are reset to default for personal profile").fadeIn();
	}
	else if($("#profile-official").parent().hasClass("active"))
	{
		store.setItem("official_extraSequence", extraSequence);
		store.setItem("official_startIndex", startIndex);
		store.setItem("official_endIndex", endIndex);
		$("#extra-security-sequence").val(extraSequence);
		$("#start-index").val(startIndex);
		$("#end-index").val(endIndex);
		$("#tooltip").html("All your options are reset to default for official profile").fadeIn();
	}
    $("#start-index").parent().removeClass("has-error");
    $("#start-index").siblings(".errors").hide();
    $("#end-index").parent().removeClass("has-error");
    $("#end-index").siblings(".errors").hide();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2500);
});

//on click update the profile with active class
$(".btn-group a").on('click', function(){
	$(this).siblings().removeClass("active");
	$(this).addClass("active");
});
	