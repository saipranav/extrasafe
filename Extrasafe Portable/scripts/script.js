$("#helpSiteName").hide();
$("#helpMasterPassword").hide();
$("#helpExtrasafe").hide();
$("#optionsDiv").slideToggle("slow");

$("#siteName").hover(function(){
	$("#helpSiteName").show();
}
,
function(){
	$("#helpSiteName").hide();
});

$("#masterPassword").hover(function(){
	$("#helpMasterPassword").show();
}
,
function(){
	$("#helpMasterPassword").hide();
});

$("#extrasafePassword").hover(function(){
	$("#helpExtrasafe").show();
}
,
function(){
	$("#helpExtrasafe").hide();
});

$("#showPassword").hover(function(){
	$("#masterPassword").attr("type","text");
},function(){
	$("#masterPassword").attr("type","password");
});

$("#options").click(function(){
	if($(this).text() == "Hide Options"){
		$(this).text("Show Options");
	}
	else{
		$(this).text("Hide Options");
	}
	$("#optionsDiv").slideToggle("slow");
});

$("#generate").click(function(){
	if($("#masterPassword").val() != ""){
		if($("#siteName").val() != ""){
			var minLength = parseInt($("#minLength").val());
			var maxLength = parseInt($("#maxLength").val());
			if(isNaN(minLength)){
				minLength = 0;
			}
			if(isNaN(maxLength)){
				maxLength = 10;
			}
			if( (minLength<0) || (maxLength>128) || (minLength>=maxLength) || (minLength>115) || (maxLength<12) || ((maxLength-minLength)<12) ){
				window.alert("Minimum length : 0\nMaximum length : 128\nstart index greater than end index\nDifference between end index and start index should be greater than 12");
			}
			else{
				Hasher.start = minLength;
				Hasher.end = maxLength;
				$("#extrasafePassword").val(Hasher.passy($("#siteName").val(), $("#masterPassword").val(), $("#extraSequence").val() ));
			}
		}
		else{
			window.alert("Enter the site Name");
		}
	}
	else{
		window.alert("Enter your master password");
	}
});