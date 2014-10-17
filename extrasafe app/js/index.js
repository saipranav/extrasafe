$("#options-page").hide();
$("#about-page").hide();

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

	//get all required parameters
	var masterPassword = $("#master-password").val();
	var siteName = $("#site-name").val();

	//check master password
	if(masterPassword == ""){
		$("#master-password").parent().addClass("has-error");
		$("#master-password").keyup(function(){
			$("#master-password").parent().removeClass("has-error");
		});
	}
	else{
		$("#master-password").parent().removeClass("has-error");
	}

	//check site name
	if(siteName == ""){
		$("#site-name").parent().addClass("has-error");
		$("#site-name").keyup(function(){
			$("#site-name").parent().removeClass("has-error");
		});
	}
	else{
		$("#site-name").parent().removeClass("has-error");
	}
});

