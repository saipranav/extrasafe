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
var extraSecuritySequence = simplePrefs.prefs.extraSecuritySequence;
var startIndex = simplePrefs.prefs.startIndex;
var endIndex = simplePrefs.prefs.endIndex;
var extrasafeDisabled = simplePrefs.prefs.extrasafeDisabled;
var injectedWorkers = [];

// For the first time pref will be undefined so define it
if(extraSecuritySequence == undefined || startIndex == undefined || endIndex == undefined || extrasafeDisabled == undefined){
	simplePrefs.prefs.extraSecuritySequence = "";
	simplePrefs.prefs.startIndex = 0;
	simplePrefs.prefs.endIndex = 12;
	extraSecuritySequence = "";
	startIndex = 0;
	endIndex = 12;
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
	exclude: "http://saipranav.github.io/extrasafe/portable.html",
	contentScriptFile: [self.data.url("lib/jquery.min.js"), self.data.url("inject/inject.js")],
	contentScriptOptions: {
    	unmaskPng: self.data.url("icons/Unmask16.png"),
    	extrasafePng: self.data.url("icons/Extrasafe16.png")
  	},
  	contentStyleFile: self.data.url("inject/inject.css"),
	onAttach: function(worker){
		injectedWorkers.push(worker);
		if(extrasafeDisabled){
			worker.port.emit("disable password div",{});
		}
		worker.port.on("master password", function(message){
			findSiteTag(worker.url);
			var password = Hasher.Hasher.passy(message.masterPassword, siteTag, extraSecuritySequence, startIndex, endIndex );
			worker.port.emit("result",{ result: password, fromInputField: message.fromInputField });
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
	var checkStart = simplePrefs.prefs.startIndex;
	var checkEnd = simplePrefs.prefs.endIndex;
	var checkExtraSecuritySequence = simplePrefs.prefs.extraSecuritySequence;
	if((checkStart<0) || (checkEnd>128) || (checkStart>=checkEnd) || (checkStart>116) || (checkEnd<12) || ((checkEnd-checkStart)<12) ){
		simplePrefs.prefs.updateStatus = "Your options are NOT SAVED. Why ? End index should be greater than Start index. Difference between End index and Start index should be greater than 12";
		simplePrefs.prefs.extraSecuritySequence = extraSecuritySequence;
		simplePrefs.prefs.startIndex = startIndex;
		simplePrefs.prefs.endIndex = endIndex;
	}
	else{
		extraSecuritySequence = simplePrefs.prefs.extraSecuritySequence;
		startIndex = simplePrefs.prefs.startIndex;
		endIndex = simplePrefs.prefs.endIndex;
		simplePrefs.prefs.updateStatus = "Your options are SAVED";
	}
});
simplePrefs.on("reset",function(){
	extraSecuritySequence = "";
	startIndex = 0;
	endIndex = 12;
	simplePrefs.prefs.extraSecuritySequence = extraSecuritySequence;
	simplePrefs.prefs.startIndex = startIndex;
	simplePrefs.prefs.endIndex = endIndex;
	simplePrefs.prefs.updateStatus = "Your options are reset to DEFAULTS";
});
simplePrefs.on("cancel",function(){
	simplePrefs.prefs.extraSecuritySequence = extraSecuritySequence;
	simplePrefs.prefs.startIndex = startIndex;
	simplePrefs.prefs.endIndex = endIndex;
	simplePrefs.prefs.updateStatus = "Your options are Reset to PREVIOUS STATE";
});

function broadcast(kind,messageBody){
	var i;
	for(i=0; i<injectedWorkers.length; i++){
		injectedWorkers[i].port.emit(kind,messageBody);
	}
}

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
		if(tempVar.match("^(com|org|net|int|edu|gov|mil)($|[^a-zA-Z0-9])") || tempVar.match("^(in|ae|an|aq|ar|au|bd|be|bm|br|bw|ca|ch|cl|cn|co|cr|cs|cu|cz|de|dk|eg|es|eu|fi|fr|gb|ge|gl|gr|hk|hu|id|ie|il|iq|ir|is|it|jm|jp|ke|kh|kw|lk|mm|mn|mx|my|ng|np|nz|om|pe|pt|qa|ro|ru|sa|se|sg|su|th|uk|us|uz|va|ve|vn|za|zw)($|[^a-zA-Z0-9])")){
			if( ! (tempVar.match("^(com|org|net|int|edu|gov|mil)($|[^a-zA-Z0-9])") || tempVar.match("^(in|ae|an|aq|ar|au|bd|be|bm|br|bw|ca|ch|cl|cn|co|cr|cs|cu|cz|de|dk|eg|es|eu|fi|fr|gb|ge|gl|gr|hk|hu|id|ie|il|iq|ir|is|it|jm|jp|ke|kh|kw|lk|mm|mn|mx|my|ng|np|nz|om|pe|pt|qa|ro|ru|sa|se|sg|su|th|uk|us|uz|va|ve|vn|za|zw)($|[^a-zA-Z0-9])") ) ){
				siteTag = siteUrlBreakupArray[i-1];
				break;
			}
		}
	}
	
	return;
}
