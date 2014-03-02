$("#helpSiteName").hide();
$("#helpMasterPassword").hide();
$("#helpExtrasafe").hide();
$("#copied").hide();

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

$("#generate").click(function(){
	if($("#masterPassword").val() != ""){
		if($("#siteName").val() != ""){
			$("#extrasafePassword").val(Hasher.passy($("#siteName").val(), $("#masterPassword").val()));
		}
		else{
			window.alert("Enter the site Name");
		}
	}
	else{
		window.alert("Enter your master password");
	}
});