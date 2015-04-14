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
var personal_extraSequence = safari.extension.settings.personal_extraSequence;
var personal_passwordLength = safari.extension.settings.personal_passwordLength;
var personal_startIndex = safari.extension.settings.personal_startIndex;
var personal_endIndex = safari.extension.settings.personal_endIndex;
var official_extraSequence = safari.extension.settings.official_extraSequence;
var official_passwordLength = safari.extension.settings.official_passwordLength;
var official_startIndex = safari.extension.settings.official_startIndex;
var official_endIndex = safari.extension.settings.official_endIndex;
var default_extraSequence = safari.extension.settings.default_extraSequence;
var default_startIndex = safari.extension.settings.default_startIndex;
var default_endIndex = safari.extension.settings.default_endIndex;
var extrasafeDisabled = safari.extension.settings.extrasafeDisabled;
var numberRegex = /^\d+$/;

// For the first time settings will be undefined so define it
if( personal_extraSequence == undefined || personal_passwordLength == undefined || personal_startIndex == undefined || personal_endIndex == undefined || extrasafeDisabled == undefined || official_extraSequence == undefined || official_passwordLength == undefined || official_startIndex == undefined || official_endIndex == undefined ){
	safari.extension.settings.personal_extraSequence = "";
	safari.extension.settings.personal_passwordLength = 12;
	safari.extension.settings.personal_startIndex = 0;
	safari.extension.settings.personal_endIndex = 12;
	safari.extension.settings.official_extraSequence = "";
	safari.extension.settings.official_passwordLength = 12;
	safari.extension.settings.official_startIndex = 0;
	safari.extension.settings.official_endIndex = 12;
	safari.extension.settings.default_extraSequence = "";
	safari.extension.settings.default_startIndex = 0;
	safari.extension.settings.default_endIndex = 12;
	extrasafeDisabled = false;
}

//Called for every keyup in master password field.
//Returns the password from algorithm to content script.
safari.application.activeBrowserWindow.addEventListener("message", function(event){
	if(event.name == "key up"){
		findSiteTag(event.target.url);
		if(event.message.profile.match("Personal")){
			event.target.page.dispatchMessage("result", { result: Hasher.passy(event.message.masterPassword, siteTag, personal_extraSequence, personal_startIndex, personal_endIndex), fromInputField: event.message.fromInputField });
		}
		else if(event.message.profile.match("Official")){
			event.target.page.dispatchMessage("result", { result: Hasher.passy(event.message.masterPassword, siteTag, official_extraSequence, official_startIndex, official_endIndex), fromInputField: event.message.fromInputField });
		}
		else if(event.message.profile.match("Default")){
			event.target.page.dispatchMessage("result", { result: Hasher.passy(event.message.masterPassword, siteTag, default_extraSequence, default_startIndex, default_endIndex), fromInputField: event.message.fromInputField });
		}
	}
	else if(event.name == "open portable"){
		safari.application.activeBrowserWindow.openTab().url = "http://theextralabs.com/extrasafe/portable.html";
	}
}, true);

safari.application.addEventListener("command", function(event){
	if(event.command == "disable"){
		broadcast("disable password div", "");
		extrasafeDisabled = true;
		safari.extension.settings.extrasafeDisabled = true;
		var image = safari.extension.baseURI + "icons/Extrasafe_striked16.png";
		var windows = safari.extension.toolbarItems.length;
		for(var i=0; i<windows; i++){
			safari.extension.toolbarItems[i].command = "enable";
			safari.extension.toolbarItems[i].toolTip = "Click to enable extrasafe in this site";
			safari.extension.toolbarItems[i].image = image;
		}
	}
	else if(event.command == "enable"){
		broadcast("enable password div", "");
		extrasafeDisabled = false;
		safari.extension.settings.extrasafeDisabled = false;
		var image = safari.extension.baseURI + "icons/Extrasafe16.png";
		var windows = safari.extension.toolbarItems.length;
		for(var i=0; i<windows; i++){
			safari.extension.toolbarItems[0].command = "disable";
			safari.extension.toolbarItems[0].toolTip = "Click to disable extrasafe in this site";
			safari.extension.toolbarItems[i].image = image;
		}
	}	
}, true);

//To send disabled message to newly created or navigated when browser action is already disabled
safari.application.addEventListener("navigate", function(event) {
	if(extrasafeDisabled){
		event.target.page.dispatchMessage("disable password div","");
		var image = safari.extension.baseURI + "icons/Extrasafe_striked16.png";
		var windows = safari.extension.toolbarItems.length;
		for(var i=0; i<windows; i++){
			safari.extension.toolbarItems[i].command = "enable";
			safari.extension.toolbarItems[i].toolTip = "Click to enable extrasafe in this site";
			safari.extension.toolbarItems[i].image = image;
		}
	}
});

//To listen to changes in settings
safari.extension.settings.addEventListener("change", function(event) {
	if(event.key != "extrasafeDisabled" && event.key != "personal_startIndex" && event.key != "personal_endIndex" && event.key != "official_startIndex" && event.key != "official_endIndex" ){
		var personal_checkExtraSequence = safari.extension.settings.personal_extraSequence;
		var personal_checkPasswordLength = safari.extension.settings.personal_passwordLength;
		var official_checkExtraSequence = safari.extension.settings.official_extraSequence;
		var official_checkPasswordLength = safari.extension.settings.official_passwordLength;

		if( !numberRegex.test(personal_checkPasswordLength) || personal_checkPasswordLength > 128 || personal_checkPasswordLength < 12 ){
			window.alert("Your options are NOT SAVED.\nWhy ? Personal password, maximum is 128 and minimum is 12");
		}
		else if( !numberRegex.test(official_checkPasswordLength) || official_checkPasswordLength > 128 || official_checkPasswordLength < 12 ){
			window.alert("Your options are NOT SAVED.\nWhy ? Official password, maximum is 128 and minimum is 12");
		}
		else if( personal_checkExtraSequence.length > 500 ){
			window.alert("Your options are NOT SAVED.\nWhy ? Personal Security sequence, maximum is 500 characters");
		}
		else if( official_checkExtraSequence.length > 500 ){
			window.alert("Your options are NOT SAVED.\nWhy ? Official Security sequence, maximum is 500 characters");
		}
		else{
			var personal_result = deriveStartIndexAndEndIndex(personal_checkExtraSequence, parseInt(personal_checkPasswordLength) );
			var official_result = deriveStartIndexAndEndIndex(official_checkExtraSequence, parseInt(official_checkPasswordLength) );
			
			personal_extraSequence = safari.extension.settings.personal_extraSequence;
			personal_passwordLength = safari.extension.settings.personal_passwordLength;
			personal_startIndex = personal_result.startIndex;
			safari.extension.settings.personal_startIndex = personal_result.startIndex;
			personal_endIndex = personal_result.endIndex;
			safari.extension.settings.personal_endIndex = personal_result.endIndex;

			official_extraSequence = safari.extension.settings.official_extraSequence;
			official_passwordLength = safari.extension.settings.official_passwordLength;
			official_startIndex = official_result.startIndex;
			safari.extension.settings.official_startIndex = official_result.startIndex;
			official_endIndex = official_result.endIndex;
			safari.extension.settings.official_endIndex = official_result.endIndex;

			window.alert("Your options are SAVED");
		}
	}
}, true);

function broadcast(command,message){
	var windows = safari.application.browserWindows;
	for (var i = 0; i < windows.length; i++) {
		var tabs = windows[i].tabs;
		for (var j = 0; j < tabs.length; j++) {
			tabs[j].page.dispatchMessage(command,message);
		}
	}
}

function deriveStartIndexAndEndIndex(extraSequence, passwordLength){
	var startIndex = 0;
	var endIndex = 12;
	var extraLength = extraSequence.length % 116;
	startIndex = extraLength;
	endIndex = extraLength + passwordLength;
	if(endIndex > 128){
		if( extraLength > (endIndex - 128) ){
			extraLength = extraLength - (endIndex - 128);
			startIndex = extraLength;
			endIndex = extraLength + passwordLength;
		}
		else{
			startIndex = 0;
			endIndex = passwordLength;
		}
	}
	return {"startIndex": startIndex, "endIndex": endIndex}
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
