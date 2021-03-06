/*******************************************************************************************
Just Remember one Master Password text, Extrasafe takes care of the rest ;)
Extrasafe (C) 2014-2015  The Extra Labs
GNU General Public License v3
http://theextralabs.com
********************************************************************************************/
//Global variable site tag (eg: google).
var siteTag = "";
//Global variable for web page url. Useful for performance in findSiteTag.
var siteUrl = "";
//Global variable to remember enabling and disabling.
var extrasafeDisabled = false;

//Single message handler.
//Called for every keyup in master password field.
//Returns the password from algorithm to content script.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.message == undefined){
		findSiteTag(sender.url);
		if(request.profile.match("Personal")){
			chrome.storage.local.get({
	    		personal_extraSequence : "",
	    		personal_startIndex : 0,
	    		personal_endIndex : 12
	  		}, function(items) {
				var extraSecuritySequence = items.personal_extraSequence;
				var startIndex = items.personal_startIndex;
				var endIndex = items.personal_endIndex;
				chrome.tabs.sendMessage(sender.tab.id,{ result: Hasher.passy(request.masterPassword, siteTag, extraSecuritySequence, startIndex, endIndex), fromInputField: request.fromInputField });
	  		});
		}
		else if(request.profile.match("Official")){
			chrome.storage.local.get({
	    		official_extraSequence : "",
	    		official_startIndex : 0,
	    		official_endIndex : 12
	  		}, function(items) {
				var extraSecuritySequence = items.official_extraSequence;
				var startIndex = items.official_startIndex;
				var endIndex = items.official_endIndex;
				chrome.tabs.sendMessage(sender.tab.id,{ result: Hasher.passy(request.masterPassword, siteTag, extraSecuritySequence, startIndex, endIndex), fromInputField: request.fromInputField });
	  		});
		}
		else if(request.profile.match("Default")){
			chrome.storage.local.get({
	    		default_extraSequence : "",
	    		default_startIndex : 0,
	    		default_endIndex : 12
	  		}, function(items) {
				var extraSecuritySequence = items.default_extraSequence;
				var startIndex = items.default_startIndex;
				var endIndex = items.default_endIndex;
				chrome.tabs.sendMessage(sender.tab.id,{ result: Hasher.passy(request.masterPassword, siteTag, extraSecuritySequence, startIndex, endIndex), fromInputField: request.fromInputField });
	  		});
		}
	}
	else{
		if(request.message == "open portable")
		chrome.tabs.create({ url : "http://theextralabs.com/extrasafe/portable.html"});
	}
});

//Toggle browser actions.
//Saving the extrasafe disabled field in storage
chrome.browserAction.onClicked.addListener(function togglePasswordDiv(){
	chrome.browserAction.getTitle({},function(title){
		if(title == "Click to disable extrasafe"){
			broadcast({result:"disable password div"});
			extrasafeDisabled = true;
			chrome.browserAction.setIcon({path:"icons/Extrasafe_red19.png"});
			chrome.browserAction.setTitle({title: "Click to enable extrasafe"});
			chrome.storage.local.set({
				extrasafeDisabledStorageFlag : true,
			}, function(){});
		}
		else{
			broadcast({result:"enable password div"});
			extrasafeDisabled = false;
			chrome.browserAction.setIcon({path:"icons/Extrasafe19.png"});
			chrome.browserAction.setTitle({title: "Click to disable extrasafe"});
			chrome.storage.local.set({
				extrasafeDisabledStorageFlag : false,
			}, function(){});
		}
	});
});

//To send disabled message to newly created or navigated when browser action is already disabled
//When the extrasafeDisabled fetched from storage
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	chrome.storage.local.get({
    		extrasafeDisabledStorageFlag : false,
  		}, function(items) {
			extrasafeDisabled = items.extrasafeDisabledStorageFlag;
  	});
	if(extrasafeDisabled){
		if(changeInfo.status == "complete"){
			chrome.tabs.sendMessage(tabId, {result:"disable password div"});
			chrome.browserAction.setIcon({path:"icons/Extrasafe_red19.png"});
			chrome.browserAction.setTitle({title: "Click to enable extrasafe"});
		}
	}
});

/*chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
	  var storageChange = changes[key];
	  if(key == "securitySequence"){
	  	Hasher.extraSecuritySequence = storageChange.newValue;
	  }
	  else if(key == "startIndex"){
	  	Hasher.start = storageChange.newValue;
	  }
	  else if(key == "endIndex"){
	  	Hasher.end = storageChange.newValue;
	  }
	  /*else if(key == "specialCharactersCheck"){
	  	Hasher. = storageChange.newValue;
	  }
	}
});*/

function broadcast(message){
	chrome.tabs.query({}, function(tabs){
		for (var i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id,message);
		}
	});
}

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
