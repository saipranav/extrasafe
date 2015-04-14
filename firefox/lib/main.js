/*******************************************************************************************
Just Remember one Master Password text, Extrasafe takes care of the rest ;)
Extrasafe (C) 2014-2015  The Extra Labs
GNU General Public License v3
http://theextralabs.com
********************************************************************************************/
//Importing the required modules
var Hasher = require("hasher");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var ui = require("sdk/ui");
var workers = require("sdk/content/worker");
var simplePrefs = require("sdk/simple-prefs");

var siteTag = "";
var siteUrl = "";
var personal_extraSequence = simplePrefs.prefs.personal_extraSequence;
var personal_passwordLength = simplePrefs.prefs.personal_passwordLength;
var personal_startIndex = simplePrefs.prefs.personal_startIndex;
var personal_endIndex = simplePrefs.prefs.personal_endIndex;
var official_extraSequence = simplePrefs.prefs.official_extraSequence;
var official_passwordLength = simplePrefs.prefs.official_passwordLength;
var official_startIndex = simplePrefs.prefs.official_startIndex;
var official_endIndex = simplePrefs.prefs.official_endIndex;
var default_extraSequence = "";
var default_startIndex = 0;
var default_endIndex = 12;
var extrasafeDisabled = simplePrefs.prefs.extrasafeDisabled;
var injectedWorkers = [];
var numberRegex = /^\d+$/;

// For the first time pref will be undefined so define it
if( personal_extraSequence == undefined || personal_passwordLength == undefined || personal_startIndex == undefined || personal_endIndex == undefined || official_extraSequence == undefined || official_passwordLength == undefined || official_startIndex == undefined || official_endIndex == undefined || extrasafeDisabled == undefined){
	simplePrefs.prefs.default_extraSequence = "";
	simplePrefs.prefs.default_startIndex = 0;
	simplePrefs.prefs.default_endIndex = 12;
	simplePrefs.prefs.personal_extraSequence = personal_extraSequence = "";
	simplePrefs.prefs.personal_passwordLength = personal_passwordLength = 12;
	simplePrefs.prefs.personal_startIndex = personal_startIndex = 0;
	simplePrefs.prefs.personal_endIndex = personal_endIndex = 12;
	simplePrefs.prefs.official_extraSequence = official_extraSequence = "";
	simplePrefs.prefs.official_passwordLength = official_passwordLength = 12;
	simplePrefs.prefs.official_startIndex = official_startIndex = 0;
	simplePrefs.prefs.official_endIndex = official_endIndex = 12;
	extrasafeDisabled = false;
}

function detachWorker(worker, workerArray) {
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
  }
}

pageMod.PageMod({
	include: "*",
	exclude: "http://theextralabs.com/extrasafe/portable.html",
	contentScriptFile: [self.data.url("lib/jquery-2.1.3.min.js"), self.data.url("inject/inject.js")],
	contentScriptOptions: {
    	unmaskPng: self.data.url("icons/Unmask16.png"),
    	extrasafePng: self.data.url("icons/Extrasafe16.png"),
    	helperPng: self.data.url("icons/Info16.png"),
    	personalPng: self.data.url("icons/Personal16.png"),
    	officialPng: self.data.url("icons/Official16.png"),
    	defaultPng: self.data.url("icons/Default16.png")
  	},
  	contentStyleFile: self.data.url("inject/inject.css"),
	onAttach: function(worker){
		injectedWorkers.push(worker);
		if(extrasafeDisabled){
			worker.port.emit("disable password div",{});
		}
		worker.port.on("master password", function(message){
			findSiteTag(worker.url);
			if(message.profile.match("Personal")){
				var password = Hasher.Hasher.passy(message.masterPassword, siteTag, personal_extraSequence, personal_startIndex, personal_endIndex );
				worker.port.emit("result",{ result: password, fromInputField: message.fromInputField });
			}
			else if(message.profile.match("Official")){
				var password = Hasher.Hasher.passy(message.masterPassword, siteTag, official_extraSequence, official_startIndex, official_endIndex );
				worker.port.emit("result",{ result: password, fromInputField: message.fromInputField });
			}
			else if(message.profile.match("Default")){
				var password = Hasher.Hasher.passy(message.masterPassword, siteTag, default_extraSequence, default_startIndex, default_endIndex );
				worker.port.emit("result",{ result: password, fromInputField: message.fromInputField });
			}
		});
		worker.port.on("open portable", function(message){
			tabs.open("http://theextralabs.com/extrasafe/portable.html");
		});
		worker.on("detach", function () {
      		detachWorker(this, injectedWorkers);
    	});
	}
});

var button = ui.ActionButton({
  id: "Extrasafe",
  label: "Click to disable Extrasafe",
  icon: {"16": "./icons/Extrasafe16.png", "48": "./icons/Extrasafe48.png"},
  onClick: function(state) {
    if(state.label == "Click to disable Extrasafe"){
			broadcast("disable password div",{});
			extrasafeDisabled = true;
			simplePrefs.prefs.extrasafeDisabled = extrasafeDisabled; 
			button.state(button, { label: "Click to enable Extrasafe", icon: {"16": "./icons/Extrasafe_red16.png", "48": "./icons/Extrasafe_red48.png"} });
	}
	else{
			broadcast("enable password div",{});
			extrasafeDisabled = false;
			simplePrefs.prefs.extrasafeDisabled = extrasafeDisabled;
			button.state(button, { label: "Click to disable Extrasafe", icon: {"16": "./icons/Extrasafe16.png", "48": "./icons/Extrasafe48.png"} });
	}
  }
});

//if extrasafe is disabled then instruct all tabs to go on disabled mode
if(extrasafeDisabled){
	broadcast("disable password div",{});
	button.state(button, { label: "Click to enable Extrasafe", icon: {"16": "./icons/Extrasafe_red16.png", "48": "./icons/Extrasafe_red48.png"} });
}

//For saving options
simplePrefs.on("update",function(){
	var personal_checkExtraSequence = simplePrefs.prefs.personal_extraSequence;
	var personal_checkPasswordLength = simplePrefs.prefs.personal_passwordLength;
	var official_checkExtraSequence = simplePrefs.prefs.official_extraSequence;
	var official_checkPasswordLength = simplePrefs.prefs.official_passwordLength;

	if( !numberRegex.test(personal_checkPasswordLength) || personal_checkPasswordLength > 128 || personal_checkPasswordLength < 12 ){
		simplePrefs.prefs.updateStatus = "Your options are NOT SAVED. Why ? Personal password, maximum is 128 and minimum is 12";
		cancelOptions();
	}
	else if( !numberRegex.test(official_checkPasswordLength) || official_checkPasswordLength > 128 || official_checkPasswordLength < 12 ){
		simplePrefs.prefs.updateStatus = "Your options are NOT SAVED. Why ? Official password, maximum is 128 and minimum is 12";
		cancelOptions();
	}
	else if( personal_checkExtraSequence.length > 500 ){
		simplePrefs.prefs.updateStatus = "Your options are NOT SAVED. Why ? Personal Security sequence, maximum is 500 characters";
		cancelOptions();
	}
	else if( official_checkExtraSequence.length > 500 ){
		simplePrefs.prefs.updateStatus = "Your options are NOT SAVED. Why ? Official Security sequence, maximum is 500 characters";
		cancelOptions();
	}
	else{
		var personal_result = deriveStartIndexAndEndIndex(personal_checkExtraSequence, personal_checkPasswordLength);
		var official_result = deriveStartIndexAndEndIndex(official_checkExtraSequence, official_checkPasswordLength);

		personal_extraSequence = simplePrefs.prefs.personal_extraSequence;
		personal_startIndex = simplePrefs.prefs.personal_startIndex = personal_result.startIndex;
		personal_endIndex = simplePrefs.prefs.personal_endIndex = personal_result.endIndex;
		personal_passwordLength = simplePrefs.prefs.personal_passwordLength;
		official_extraSequence = simplePrefs.prefs.official_extraSequence;
		official_startIndex = simplePrefs.prefs.official_startIndex = official_result.startIndex;
		official_endIndex = simplePrefs.prefs.official_endIndex = official_result.endIndex;
		official_passwordLength = simplePrefs.prefs.official_passwordLength;
		simplePrefs.prefs.updateStatus = "Your options are SAVED for all profiles";
	}
});
simplePrefs.on("reset",function(){
	extraSequence = "";
	startIndex = 0;
	endIndex = 12;
	passwordLength = 12;
	simplePrefs.prefs.personal_extraSequence = extraSequence;
	simplePrefs.prefs.personal_passwordLength = passwordLength;
	simplePrefs.prefs.personal_startIndex = startIndex;
	simplePrefs.prefs.personal_endIndex = endIndex;
	simplePrefs.prefs.official_extraSequence = extraSequence;
	simplePrefs.prefs.official_passwordLength = passwordLength;
	simplePrefs.prefs.official_startIndex = startIndex;
	simplePrefs.prefs.official_endIndex = endIndex;
	simplePrefs.prefs.updateStatus = "Your options are reset to DEFAULTS for all profiles";
});
simplePrefs.on("cancel",function(){
	cancelOptions();
	simplePrefs.prefs.updateStatus = "Your options are Reset to PREVIOUS STATE for all profiles";
});

function broadcast(kind,messageBody){
	var i;
	for(i=0; i<injectedWorkers.length; i++){
		injectedWorkers[i].port.emit(kind,messageBody);
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

function cancelOptions(){
	simplePrefs.prefs.personal_extraSequence = personal_extraSequence;
	simplePrefs.prefs.personal_startIndex = personal_startIndex;
	simplePrefs.prefs.personal_endIndex = personal_endIndex;
	simplePrefs.prefs.personal_passwordLength = personal_passwordLength;
	simplePrefs.prefs.official_extraSequence = official_extraSequence;
	simplePrefs.prefs.official_startIndex = official_startIndex;
	simplePrefs.prefs.official_endIndex = official_endIndex;
	simplePrefs.prefs.official_passwordLength = official_passwordLength;
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
