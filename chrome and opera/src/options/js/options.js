$("#statusSave").css("display","none");
$("#statusCancel").css("display","none");
$("#statusReset").css("display","none");
$("#passwordLength").hide();
//$("#specialCharacters").hide();
$("#securityLevelHeader").addClass("activeOption");

document.addEventListener('DOMContentLoaded', function(){
	chrome.storage.local.get({
    	extraSecuritySequence : "",
		startIndex : 0,
		endIndex : 12
		//specialCharactersCheck : true
  	}, function(items) {
		$("#securityLevelInput").val(items.extraSecuritySequence);
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
	if((min<0) || (max>128) || (min>=max) || (min>116) || (max<12) || ((max-min)<12) ){
		window.alert("Your options are NOT SAVED\n Why ? \nPassword Length :: Minimum: 0, Maximum: 128\nEnd index should be greater than Start index\nDifference between End index and Start index should be greater than 12");
	}
	else{
		chrome.storage.local.set({
			extraSecuritySequence : sequence,
			startIndex : min,
			endIndex : max
			//specialCharactersCheck : special
		}, function(){
			$("#statusSave").css("display","inline");
			setTimeout(function(){
				$("#statusSave").css("display","none");
			}, 2000);
		});
	}
});

$("#cancel").click(function(){
	$("#statusCancel").css("display","inline");
	setTimeout(function(){
		$("#statusCancel").css("display","none");
	}, 2000);
});

$("#reset").click(function(){
	$("#securityLevelInput").val("");
	$("#startIndex").val("0");
	$("#endIndex").val("12");
	var sequence = "";
	var min = 0;
	var max = 12;
	chrome.storage.local.set({
			extraSecuritySequence : sequence,
			startIndex : min,
			endIndex : max
			//specialCharactersCheck : special
		}, function(){
			$("#statusReset").css("display","inline");
			setTimeout(function(){
				$("#statusReset").css("display","none");
			}, 2000);
	});
	//$("#specialCharactersInput").prop("checked",true);
});
