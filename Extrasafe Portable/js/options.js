var store = window.localStorage;
var numberRegex = /^\d+$/;

$("#extra-security-sequence").val(store.getItem("extraSecuritySequence"));
$("#start-index").val(store.getItem("startIndex"));
$("#end-index").val(store.getItem("endIndex"));

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

	store.setItem("extraSecuritySequence", extraSequence);
	store.setItem("startIndex", startIndex);
	store.setItem("endIndex", endIndex);

	$("#tooltip").html("All your options are saved").fadeIn();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2000);
	$("#start-index").parent().removeClass("has-error");
	$("#end-index").parent().removeClass("has-error");
});

$("#cancel-button").click(function(){
	var extraSequence = store.getItem("extraSecuritySequence");
	var startIndex = store.getItem("startIndex");
	var endIndex = store.getItem("endIndex");
	$("#extra-security-sequence").val(extraSequence);
	$("#start-index").val(startIndex);
	$("#end-index").val(endIndex);
	$("#tooltip").html("Your operations are canceled").fadeIn();
        $("#start-index").parent().removeClass("has-error");
        $("#start-index").siblings(".errors").hide();
        $("#end-index").parent().removeClass("has-error");
        $("#end-index").siblings(".errors").hide();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2000);
});

$("#reset-button").click(function(){
	var extraSequence = "";
	var startIndex = 0;
	var endIndex = 12;
	store.setItem("extraSecuritySequence", extraSequence);
	store.setItem("startIndex", startIndex);
	store.setItem("endIndex", endIndex);
	$("#extra-security-sequence").val(extraSequence);
	$("#start-index").val(startIndex);
	$("#end-index").val(endIndex);
	$("#tooltip").html("All your options are reset to default").fadeIn();
        $("#start-index").parent().removeClass("has-error");
        $("#start-index").siblings(".errors").hide();
        $("#end-index").parent().removeClass("has-error");
        $("#end-index").siblings(".errors").hide();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2500);
});