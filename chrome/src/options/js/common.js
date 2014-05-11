$("#status").css("visibility","hidden");
$("#passwordLength").hide();
//$("#specialCharacters").hide();
$("#securityLevelHeader").addClass("activeOption");

document.addEventListener('DOMContentLoaded', function(){
	chrome.storage.sync.get({
    	securitySequence : "",
		minPasswordLength : 0,
		maxPasswordLength : 10
		//specialCharactersCheck : true
  	}, function(items) {
		$("#securityLevelInput").val(items.securitySequence);
		$("#minLength").val(items.minPasswordLength);
		$("#maxLength").val(items.maxPasswordLength);
		//$("#specialCharactersInput").prop("checked",items.specialCharactersCheck);
  	});
});

$("#securityLevelHeader").click(function(){
	$("#securityLevel").show();
	$("#passwordLength").hide();
	//$("#specialCharacters").hide();
	$("#passwordLengthHeader").removeClass("activeOption");
	//$("#specialCharactersHeader").removeClass("activeOption");
	$(this).addClass("activeOption");
});

$("#passwordLengthHeader").click(function(){
	$("#securityLevel").hide();
	$("#passwordLength").show();
	//$("#specialCharacters").hide();
	$("#securityLevelHeader").removeClass("activeOption");
	//$("#specialCharactersHeader").removeClass("activeOption");
	$(this).addClass("activeOption");
});

/*$("#specialCharactersHeader").click(function(){
	$("#securityLevel").hide();
	$("#passwordLength").hide();
	$("#specialCharacters").show();
	$("#securityLevelHeader").removeClass("activeOption");
	$("#passwordLengthHeader").removeClass("activeOption");
	$(this).addClass("activeOption");
});*/

$("#save").click(function(){
	var sequence = $("#securityLevelInput").val();
	var min = parseInt($("#minLength").val());
	var max = parseInt($("#maxLength").val());
	//var special = $("#specialCharactersInput").is(":checked");
	if((min<0) || (max>128) || (min>=max) || (min>127) || (max<1) || ((max-min)<8) ){
		window.alert("Password Length :: Minimum: 0, Maximum: 128\nMax should be greater than Min\nDifference between Max length and Min length should be greater than 8");
	}
	else{
		chrome.storage.sync.set({
			securitySequence : sequence,
			minPasswordLength : min,
			maxPasswordLength : max
			//specialCharactersCheck : special
		}, function(){
			$("#status").css("visibility","visible");
			setTimeout(function(){
				$("#status").css("visibility","hidden");
			}, 1000)
		});
	}
});

$("#cancel").click(function(){
	window.close();
});

$("#reset").click(function(){
	$("#securityLevelInput").val("");
	$("#minLength").val("0");
	$("#maxLength").val("10");
	//$("#specialCharactersInput").prop("checked",true);
});