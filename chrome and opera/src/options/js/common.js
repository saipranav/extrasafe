$("#status").css("visibility","hidden");
$("#passwordLength").hide();
//$("#specialCharacters").hide();
$("#securityLevelHeader").addClass("activeOption");

document.addEventListener('DOMContentLoaded', function(){
	chrome.storage.sync.get({
    	securitySequence : "",
		startIndex : 0,
		endIndex : 10
		//specialCharactersCheck : true
  	}, function(items) {
		$("#securityLevelInput").val(items.securitySequence);
		$("#startIndex").val(items.startIndex);
		$("#endIndex").val(items.endIndex);
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
	var min = parseInt($("#startIndex").val());
	var max = parseInt($("#endIndex").val());
	//var special = $("#specialCharactersInput").is(":checked");
	if((min<0) || (max>128) || (min>=max) || (min>127) || (max<8) || ((max-min)<8) ){
		window.alert("Password Length :: Minimum: 0, Maximum: 128\nEnd index should be greater than Start index\nDifference between End index and Start index should be greater than 8");
	}
	else{
		chrome.storage.sync.set({
			securitySequence : sequence,
			startIndex : min,
			endIndex : max
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
	$("#startIndex").val("0");
	$("#endIndex").val("10");
	//$("#specialCharactersInput").prop("checked",true);
});