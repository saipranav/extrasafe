//Global variable site tag (eg: google).
var siteTag = "";
//Global variable for web page url. Useful for performance in findSiteTag.
var siteUrl = "";
//Global variable to remember enabling and disabling
var extrasafeDisabled = false;

//For web pages containing login form dynamically generated through ajax.
//This function listens to xmlhttprequests and reruns the DOM modification script in content script.
chrome.webRequest.onCompleted.addListener(function(info){
		chrome.tabs.sendMessage(info.tabId,{result:"rerun input script"});
		if(extrasafeDisabled){
			chrome.tabs.sendMessage(info.tabId, {result:"disable password div"});
		}
	},
	{
		urls: ["<all_urls>"],
		types: ["xmlhttprequest"]
	}
);

//Single message handler.
//Called for every keyup in master password field.
//Returns the password from algorithm to content script.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	findSiteTag(sender.url);
	chrome.tabs.sendMessage(sender.tab.id,{ result: Hasher.passy(request.masterPassword,siteTag), fromInputField: request.fromInputField });
});

//Toggle browser actions.
chrome.browserAction.onClicked.addListener(function togglePasswordDiv(){
	chrome.browserAction.getTitle({},function(title){
		if(title == "Click to disable extrasafe"){
			broadcast({result:"disable password div"});
			extrasafeDisabled = true;
			chrome.browserAction.setIcon({path:"icons/Extrasafe_red19.png"});
			chrome.browserAction.setTitle({title: "Click to enable extrasafe"});
		}
		else{
			broadcast({result:"enable password div"});
			extrasafeDisabled = false;
			chrome.browserAction.setIcon({path:"icons/Extrasafe19.png"});
			chrome.browserAction.setTitle({title: "Click to disable extrasafe"});
		}
	});
});

//To send disabled message to newly created or navigated when browser action is already disabled
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(extrasafeDisabled){
		if(changeInfo.status == "complete"){
			chrome.tabs.sendMessage(tabId, {result:"disable password div"});
		}
	}
});

function broadcast(message){
	chrome.tabs.query({}, function(tabs){
		for (var i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id,message);
		}
	});
}

function findSiteTag(url){
	console.error(siteUrl+" : "+url+" : "+siteTag);
	if(siteTag != "" && siteUrl == url){
		return;
	}
	siteUrl = url;
	siteTag = "";
	//Split the url with ".".
	var siteUrlBreakupArray = url.split(".");

	if(siteUrlBreakupArray.length == 0){
		siteTag = siteUrlBreakupArray[0];
	}

	//check the array strings with the pattern.
	for(var i=0; i<siteUrlBreakupArray.length; i++){
		var tempVar = siteUrlBreakupArray[i];
		if(tempVar.match("^com") || tempVar.match("^org") || tempVar.match("^gov")){
			siteTag = siteUrlBreakupArray[i-1];
			break;
		}
		else if(tempVar.match("^co")){
			siteTag = siteUrlBreakupArray[i-1];
			break;
		}
		else if(tempVar.match("^in")){
			siteTag = siteUrlBreakupArray[i-1];
			break;
		}
	}

	//Remove the http:// tag if its in siteTag there.
	if(siteTag.indexOf("://") > 0){
		siteTag = siteTag.substr( siteTag.indexOf("://")+3, siteTag.length );
	}
	return;
}