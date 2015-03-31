/*******************************************************************************************
Just Remember one Master Password text, Extrasafe takes care of the rest ;)
Extrasafe (C) 2014-2015  The Extra Labs
GNU General Public License v3
http://theextralabs.com
********************************************************************************************/
var store = window.localStorage;
var siteTag = "";

var app = {
	initialize: function() {
        this.onDeviceReady();
    },
    onDeviceReady: function() {
        if(store.getItem("default_extraSequence") == null){
        	store.setItem("default_extraSequence", "");
        }
        if(store.getItem("default_startIndex") == null){
        	store.setItem("default_startIndex", 0);
        }
        if(store.getItem("default_endIndex") == null){
        	store.setItem("default_endIndex", 12);
        }
        if(store.getItem("personal_extraSequence") == null){
        	store.setItem("personal_extraSequence", "");
        }
        if(store.getItem("personal_startIndex") == null){
        	store.setItem("personal_startIndex", 0);
        }
        if(store.getItem("personal_endIndex") == null){
        	store.setItem("personal_endIndex", 12);
        }
        if(store.getItem("official_extraSequence") == null){
        	store.setItem("official_extraSequence", "");
        }
        if(store.getItem("official_startIndex") == null){
        	store.setItem("official_startIndex", 0);
        }
        if(store.getItem("official_endIndex") == null){
        	store.setItem("official_endIndex", 12);
        }
		if( (store.getItem("default_extraSequence")=="" && store.getItem("default_startIndex")==0 && store.getItem("default_endIndex")==12 ) 
			&& (store.getItem("personal_extraSequence")=="" && store.getItem("personal_startIndex")==0 && store.getItem("personal_endIndex")==12 )
			&& (store.getItem("official_extraSequence")=="" && store.getItem("official_startIndex")==0 && store.getItem("official_endIndex")==12 ) ){
				$("#default-options").show();
		}
    }
};

$("#site-url").focusout(function(){
	var siteUrl = $("#site-url");
	siteUrl.parent().removeClass("has-error");
	siteUrl.parent().siblings(".errors").html("");
	siteUrl.parent().siblings(".errors").hide();
	findSiteTag(siteUrl.val());
	siteUrl.val(siteTag);
	if(siteUrl.val()=="couldnotfind"){
		siteUrl.parents().find(".goahead").show().text("You seem to have given a modern site url, DON'T worry about this, proceed as usual");
	}
});

$("#site-url").keyup(function(e){
	var siteUrl = $("#site-url");
	siteUrl.parents().find(".goahead").hide();
	if(siteUrl.val().trim()==""){
		$("#generate-button").addClass("disable");
	}
	else if($("#master-password").val()!="") {
		 $("#generate-button").removeClass("disable");
	}
});

$("#master-password").keyup(function(e){
    var siteUrl = $("#site-url");
	var masterPassword = $("#master-password");
	masterPassword.parent().removeClass("has-error");
	masterPassword.siblings(".errors").html("");
	masterPassword.siblings(".errors").hide();
	if(masterPassword.val().match(/\s/g)){
		masterPassword.parent().addClass("has-error");
		masterPassword.siblings(".errors").append("<div>Space is not allowed</div>");
		masterPassword.siblings(".errors").show();
		$("#generate-button").addClass("disable");
	}
	else if(masterPassword.val() !="" && siteUrl.val().trim()!=""){
		$("#generate-button").removeClass("disable");
	}
	else $("#generate-button").addClass("disable");
});

$("#generate-button").click(function(){
	var goAhead = false;
	var masterPassword = $("#master-password");
	var siteUrl = $("#site-url");
    if(!$("#generate-button").hasClass("disable")){
		goAhead = true;
	}

	var profileChoice = $(".btn-group a.active").children().attr("id");
	var prefix = "";
	if(profileChoice == "profile-default")
		prefix = "default_";
	else if(profileChoice == "profile-personal")
		prefix = "personal_";
	else if(profileChoice == "profile-official")
		prefix = "official_";

	var extraSequence = store.getItem(prefix + "extraSequence");
	var startIndex = store.getItem(prefix + "startIndex");
	var endIndex = store.getItem(prefix + "endIndex");				

	if(goAhead){
		var sitePassword = Hasher.passy(masterPassword.val(), siteUrl.val(), extraSequence, startIndex, endIndex);
		$("#site-password").val( sitePassword );
		window.plugins.clipboard.copy( sitePassword );
		$("#tooltip").html("Your site password is copied to clipboard").fadeIn();
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},3000);
		return;
	}
	else{
		$("#site-password").val("");
	}

});

$("#show-password").click(function(){
	var type = ( $("#master-password").attr("type") == "text" ) ? "password" : "text";
	$("#master-password").attr("type",type);
});

//Array containing keywords for top level domains and country codes
var siteUrlHelpers = [
 "com",
 "org",
 "net",
 "int",
 "edu",
 "gov",
 "mil",
 "in",
 "ae",
 "an",
 "aq",
 "ar",
 "au",
 "bd",
 "be",
 "bm",
 "br",
 "bw",
 "ca",
 "ch",
 "cl",
 "cn",
 "co",
 "cr",
 "cs",
 "cu",
 "cz",
 "de",
 "dk",
 "eg",
 "es",
 "eu",
 "fi",
 "fr",
 "gb",
 "ge",
 "gl",
 "gr",
 "hk",
 "hu",
 "id",
 "ie",
 "il",
 "iq",
 "ir",
 "is",
 "it",
 "jm",
 "jp",
 "ke",
 "kh",
 "kw",
 "lk",
 "mm",
 "mn",
 "mx",
 "my",
 "ng",
 "np",
 "nz",
 "om",
 "pe",
 "pt",
 "qa",
 "ro",
 "ru",
 "sa",
 "se",
 "sg",
 "su",
 "th",
 "uk",
 "us",
 "uz",
 "va",
 "ve",
 "vn",
 "za",
 "zw"
];

var siteUrlRegex = "^(" + siteUrlHelpers.join("|") + ")($|[^a-zA-Z0-9])";

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

	//if the url has single word then return that as site name
	if(siteUrlBreakupArray.length == 1){
		siteTag = siteUrlBreakupArray[0];
		return;
	}

	//check the array strings with the pattern.
	for(var i=(siteUrlBreakupArray.length-1); i>=0; i--){
		var tempVar = siteUrlBreakupArray[i];
		if(tempVar.match(siteUrlRegex)){
			if( ! (siteUrlBreakupArray[i-1].match(siteUrlRegex)) ){
				siteTag = siteUrlBreakupArray[i-1];
				break;
			}
		}
	}

	//check if the site tag is "", then if split array has 3 words like (blog.about.me) grab 2nd word; if the split array has 2 words like (about.me) grab 1st word; if more than that we could not find as fall back. 
	if(siteTag == ""){
		if(siteUrlBreakupArray.length == 3){
			siteTag = siteUrlBreakupArray[1];
		}
		else if(siteUrlBreakupArray.length == 2){
			siteTag = siteUrlBreakupArray[0];
		}
		else{
			siteTag = "couldnotfind";
		}
	}
	
	return;
}

$(".btn-group a").on('click', function(){
	$(this).siblings().removeClass("active");
	$(this).addClass("active");
});