//Global variable site tag (eg: google).
var siteTag = "";

//Global variable tab (current tab).
var currentTab = undefined;

/*//For web pages containing login form dynamically generated through ajax.
//This function listens to xmlhttprequests and reruns the DOM modification script in content script.
chrome.webRequest.onCompleted.addListener(function(info){
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("rerun", {result:"rerun input script"});
	},
	{
		urls: ["<all_urls>"],
		types: ["xmlhttprequest"]
	}
);*/

//Single message handler.
//Called for every keyup in master password field.
//Returns the password from algorithm to content script.
safari.application.activeBrowserWindow.addEventListener("message", function(event){
	if(event.name == "key up"){
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("result", { result: Hasher.passy(event.message.masterPassword,siteTag), fromInputField: event.message.fromInputField });
	}
}, true);

//For every update in tab (eg: opening google) this will capture the siteTag.
//New tab is set as global variable.
//TODO: some best approach if possible.
safari.application.addEventListener("navigate", function(event) {
		siteTag = "";

		currentTab = safari.application.activeBrowserWindow.activeTab;
		//Split the url with ".".
		var siteUrlBreakupArray = currentTab.url.split(".");
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
		window.alert(siteTag);
}, true);

safari.application.addEventListener("command", function(event){
	if(event.command == "disable"){
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("disable password div", "");
		safari.extension.toolbarItems[0].command = "enable";
		safari.extension.toolbarItems[0].toolTip = "Click to enable extrasafe in this site";
		safari.extension.toolbarItems[0].image = safari.extension.baseURI + "icons/Extrasafe_striked16.png";
	}
	else if(event.command == "enable"){
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("enable password div", "");
		safari.extension.toolbarItems[0].command = "disable";
		safari.extension.toolbarItems[0].toolTip = "Click to disable extrasafe in this site";
		safari.extension.toolbarItems[0].image = safari.extension.baseURI + "icons/Extrasafe16.png";
	}
	
}, true);