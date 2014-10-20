$("#options-page").hide();
$("#about-page").hide();

$("#site-password").click(function(){
	$("#site-password").select();
});

$("#options-button").click(function(){
	$("#home-page").hide();
	$("#about-page").hide();
	$("#options-page").show();
});

$("#about-button").click(function(){
	$("#home-page").hide();
	$("#options-page").hide();
	$("#about-page").show();
});

$(".back-button").click(function(){
	$("#options-page").hide();
	$("#about-page").hide();
	$("#home-page").show();
});

$("#generate-button").click(function(){

	var goAhead = false;
	//get all required parameters
	var masterPassword = $("#master-password").val();
	var siteName = $("#site-name").val();

	//check master password
	if(masterPassword == ""){
		$("#master-password").parent().addClass("has-error");
		$("#master-password").keyup(function(){
			$("#master-password").parent().removeClass("has-error");
		});
		$("#master-password").focus();
	}
	else{
		$("#master-password").parent().removeClass("has-error");
		goAhead = true;
	}

	if(goAhead){
		//check site name
	if(siteName == ""){
		$("#site-name").parent().addClass("has-error");
		$("#site-name").keyup(function(){
			$("#site-name").parent().removeClass("has-error");
		});
		$("#site-name").focus();
		goAhead = false;
	}
	else{
		$("#site-name").parent().removeClass("has-error");
		goAhead = true;
	}
	}

	var startIndex = 5;
	var endIndex = 20;
	var extraSequence = "a";

	if(goAhead){
		Hasher.start = startIndex;
		Hasher.end = endIndex;
		Hasher.extraSecuritySequence = extraSequence;
		$("#site-password").val( Hasher.passy($("#master-password").val(), $("#site-name").val()) );
	}
	else{
		$("#site-password").val("");
	}

});

$("#save-button").click(function(){
	$("#tooltip").html("All your options are saved").fadeIn();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2000);
});

$("#cancel-button").click(function(){
	$("#tooltip").html("Your operations are canceled").fadeIn();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2000);
});

$("#reset-button").click(function(){
	$("#tooltip").html("All your options are reset to default").fadeIn();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2500);
});
