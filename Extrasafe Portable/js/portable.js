var store = window.localStorage;
var siteTag = "";

var app = {
	initialize: function() {
        this.onDeviceReady();
    },
    onDeviceReady: function() {
        if(store.getItem("extraSecuritySequence") == null){
        	store.setItem("extraSecuritySequence", "");
        }
        if(store.getItem("startIndex") == null){
        	store.setItem("startIndex", 0);
        }
        if(store.getItem("endIndex") == null){
        	store.setItem("endIndex", 12);
        }
        if(store.getItem("sites") == null){
        	store.setItem("sites", JSON.stringify([]));
        }
    }
};

$("#site-password").click(function(){
	$("#site-password").select();
});

$("#site-url").focusout(function(){
	var siteUrl = $("#site-url");
	siteUrl.parent().removeClass("has-error");
	siteUrl.parent().siblings(".errors").html("");
	siteUrl.parent().siblings(".errors").hide();
	findSiteTag(siteUrl.val());
	siteUrl.val(siteTag);
});

$("#master-password").keyup(function(e){
	var masterPassword = $("#master-password");
	masterPassword.parent().removeClass("has-error");
	masterPassword.siblings(".errors").html("");
	masterPassword.siblings(".errors").hide();
	if(masterPassword.val().match(/\s/g)){
		masterPassword.parent().addClass("has-error");
		masterPassword.siblings(".errors").append("<div>Space is not allowed</div>");
		masterPassword.siblings(".errors").show();
	}
});

$("#generate-button").click(function(){

	var goAhead = false;
	//get all required parameters
	var masterPassword = $("#master-password");
	var siteUrl = $("#site-url");

	//check master password
	masterPassword.siblings(".errors").html("");
	if(masterPassword.val() == ""){
		masterPassword.parent().addClass("has-error");
		masterPassword.siblings(".errors").append("<div>Mandatory Field</div>");
		masterPassword.siblings(".errors").show();
		masterPassword.focus();
	}
	else if(masterPassword.val().match(/\s/g)){
		masterPassword.parent().addClass("has-error");
		masterPassword.siblings(".errors").append("<div>Space is not allowed</div>");
		masterPassword.siblings(".errors").show();
	}
	else{
		goAhead = true;
	}

	if($(".has-error").length>0){
		$("#tooltip").html("Retry after fixing errors in red input fields").fadeIn();
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},3000);
		goAhead = false;
	}

	if($("#clear").attr("value") == "CLEARED"){
		$("#tooltip").html("You have cleared everything, please open the application / refresh web page again").fadeIn();
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},8000);
		goAhead = false;
	}

	if(goAhead){
		//check site name
		siteUrl.parent().siblings(".errors").html("");
		if(siteUrl.val() == ""){
			siteUrl.parent().addClass("has-error");
			siteUrl.parent().siblings(".errors").append("<div>Mandatory Field</div>");
			siteUrl.parent().siblings(".errors").show();
			siteUrl.focus();
			goAhead = false;
		}
		else{
			siteUrl.parent().removeClass("has-error");
			goAhead = true;
		}
	}

	var extraSecuritySequence = store.getItem("extraSecuritySequence");
	var startIndex = store.getItem("startIndex");
	var endIndex = store.getItem("endIndex");			

	if(goAhead){
		$("#site-password").val( Hasher.passy(masterPassword.val(), siteUrl.val(), extraSecuritySequence, startIndex, endIndex));
		$("#tooltip").html("Your site password is generated, please copy it from the Site Password box").fadeIn();
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},3000);
		var sites = JSON.parse(store.getItem("sites"));
		if($.inArray(siteUrl.val(),sites) == -1){
			sites.push(siteUrl.val());
		}
		store.setItem("sites", JSON.stringify(sites));
		return;
	}
	else{
		$("#site-password").val("");
	}

});

$("#show-password").hover(function(){
	var type = ( $("#master-password").attr("type") == "text" ) ? "password" : "text";
	$("#master-password").attr("type",type);
});

$("#clear").click(function(){
	store.clear();
	$(this).attr("value","CLEARED");
	$(this).css("background-color","#228B22");
});

function findSiteTag(url){
	if(siteTag != "" && siteUrl == url){
		return;
	}
	siteUrl = url;
	siteTag = "";

	//Remove the http:// tag if its in siteTag there.
	if(url.indexOf("://") > 0){
		url = url.substr( url.indexOf("://")+3, url.length );
	}
	//Split the url with "/"
	var url = url.split("/")[0];

	//Split the url with ".".
	var siteUrlBreakupArray = url.split(".");

	//if url has single word return that word as site name
	if(siteUrlBreakupArray.length == 1){
		siteTag = siteUrlBreakupArray[0];
		return;
	}

	//check the array strings with the pattern.
	for(var i=(siteUrlBreakupArray.length-1); i>=0; i--){
		var tempVar = siteUrlBreakupArray[i];
		if(tempVar.match("^(com|org|net|int|edu|gov|mil)($|[^a-zA-Z0-9])") || tempVar.match("^(in|ae|an|aq|ar|au|bd|be|bm|br|bw|ca|ch|cl|cn|co|cr|cs|cu|cz|de|dk|eg|es|eu|fi|fr|gb|ge|gl|gr|hk|hu|id|ie|il|iq|ir|is|it|jm|jp|ke|kh|kw|lk|mm|mn|mx|my|ng|np|nz|om|pe|pt|qa|ro|ru|sa|se|sg|su|th|uk|us|uz|va|ve|vn|za|zw)($|[^a-zA-Z0-9])")){
			if( ! (siteUrlBreakupArray[i-1].match("^(com|org|net|int|edu|gov|mil)($|[^a-zA-Z0-9])") || siteUrlBreakupArray[i-1].match("^(in|ae|an|aq|ar|au|bd|be|bm|br|bw|ca|ch|cl|cn|co|cr|cs|cu|cz|de|dk|eg|es|eu|fi|fr|gb|ge|gl|gr|hk|hu|id|ie|il|iq|ir|is|it|jm|jp|ke|kh|kw|lk|mm|mn|mx|my|ng|np|nz|om|pe|pt|qa|ro|ru|sa|se|sg|su|th|uk|us|uz|va|ve|vn|za|zw)($|[^a-zA-Z0-9])") ) ){
				siteTag = siteUrlBreakupArray[i-1];
				break;
			}
		}
	}
	
	return;
}
