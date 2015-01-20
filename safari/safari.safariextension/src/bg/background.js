//Global variable site tag (eg: google).
var siteTag = "";
//Global variable for web page url. Useful for performance in findSiteTag.
var siteUrl = "";
var extraSecuritySequence = safari.extension.secureSettings.extraSecuritySequence;
var startIndex = safari.extension.secureSettings.startIndex;
var endIndex = safari.extension.secureSettings.endIndex;
var extrasafeDisabled = safari.extension.secureSettings.extrasafeDisabled;

// For the first time settings will be undefined so define it
if(extraSecuritySequence == undefined || startIndex == undefined || endIndex == undefined || extrasafeDisabled == undefined){
	safari.extension.secureSettings.extraSecuritySequence = "";
	safari.extension.secureSettings.startIndex = 0;
	safari.extension.secureSettings.endIndex = 12;
	extraSecuritySequence = "";
	startIndex = 0;
	endIndex = 12;
	extrasafeDisabled = false;
}

//Called for every keyup in master password field.
//Returns the password from algorithm to content script.
safari.application.activeBrowserWindow.addEventListener("message", function(event){
	if(event.name == "key up"){
		findSiteTag(event.target.url);
		event.target.page.dispatchMessage("result", { result: Hasher.passy(event.message.masterPassword, siteTag, extraSecuritySequence, startIndex, endIndex), fromInputField: event.message.fromInputField });
	}
}, true);

safari.application.addEventListener("command", function(event){
	if(event.command == "disable"){
		broadcast("disable password div", "");
		extrasafeDisabled = true;
		safari.extension.secureSettings.extrasafeDisabled = true;
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
		safari.extension.secureSettings.extrasafeDisabled = false;
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
safari.extension.secureSettings.addEventListener("change", function(event) {
	if(event.key != "extrasafeDisabled"){
		var checkStart = safari.extension.secureSettings.startIndex;
		var checkEnd = safari.extension.secureSettings.endIndex;
		if((checkStart<0) || (checkEnd>128) || (checkStart>=checkEnd) || (checkStart>116) || (checkEnd<12) || ((checkEnd-checkStart)<12) ){
			window.alert("Your options are NOT SAVED\nPassword Length ::\nStart index : Default 0, Minimum: 0, Maximum: 116.\nEnd index : Default 12, Minimum: 12, Maximum: 128.\nEnd index should be greater than Start index.\n Difference between End index and Start index should be greater than or equal to 12");
		}
		else{
			startIndex = safari.extension.secureSettings.startIndex;
			endIndex = safari.extension.secureSettings.endIndex;
			extraSecuritySequence = safari.extension.secureSettings.extraSecuritySequence;
			window.alert("Your options are SAVED");
		}
	}
}, false);

function broadcast(command,message){
	var windows = safari.application.browserWindows;
	for (var i = 0; i < windows.length; i++) {
		var tabs = windows[i].tabs;
		for (var j = 0; j < tabs.length; j++) {
			tabs[j].page.dispatchMessage(command,message);
		}
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

	if(siteUrlBreakupArray.length == 0){
		siteTag = siteUrlBreakupArray[0];
		return;
	}

	//check the array strings with the pattern.
	for(var i=(siteUrlBreakupArray.length-1); i>=0; i--){
		var tempVar = siteUrlBreakupArray[i];
		if(tempVar.match("^(com|org|net|int|edu|gov|mil|co)($|[^a-zA-Z0-9])") || tempVar.match("^(in|ae|an|aq|ar|au|bd|be|bm|br|bw|ca|ch|cl|cn|cr|cs|cu|cz|de|dk|eg|es|eu|fi|fr|gb|ge|gl|gr|hk|hu|id|ie|il|iq|ir|is|it|jm|jp|ke|kh|kw|lk|mm|mn|mx|my|ng|np|nz|om|pe|pt|qa|ro|ru|sa|se|sg|su|th|uk|us|uz|va|ve|vn|za|zw)($|[^a-zA-Z0-9])")){
			siteTag = siteUrlBreakupArray[i-1];
			break;
		}
	}

	return;
}