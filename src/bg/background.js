//Global variable site tag (eg: google).
var siteTag = "";

//Global variable tab (current tab).
var currentTab = undefined;

//For web pages containing login form dynamically generated through ajax.
//This function listens to xmlhttprequests and reruns the DOM modification script in content script.
chrome.webRequest.onCompleted.addListener(function(info){
		/*chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			chrome.tabs.sendMessage(tabs[0].id,{result:"rerun input script"});
		});*/
		chrome.tabs.sendMessage(currentTab.id,{result:"rerun input script"});
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
	chrome.tabs.sendMessage(currentTab.id,{ result: Hasher.passy(request.masterPassword,siteTag), fromInputField: request.fromInputField });
});

//For every update in tab (eg: opening google) this will capture the siteTag.
//New tab is set as global variable.
//TODO: some best approach if possible.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == "complete"){
		siteTag = "";

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			currentTab = tabs[0];
			//Split the url with ".".
			var siteUrlBreakupArray = tabs[0].url.split(".");

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
		
			chrome.pageAction.show(currentTab.id);
			chrome.pageAction.setTitle({tabId: currentTab.id,title: "Click to disable extrasafe in this site"});

		});
	}
});

chrome.pageAction.onClicked.addListener(function togglePasswordDiv(){
	chrome.pageAction.getTitle({tabId: currentTab.id}, function toggleTitle(title){
		if(title == "Click to disable extrasafe in this site"){
			chrome.tabs.sendMessage(currentTab.id,{result:"disable password div"});
			chrome.pageAction.setIcon({tabId: currentTab.id, path:"icons/Extrasafe_red19.png"});
			chrome.pageAction.setTitle({tabId: currentTab.id,title: "Click to enable extrasafe in this site"});
		}
		else{
			chrome.tabs.sendMessage(currentTab.id,{result:"enable password div"});
			chrome.pageAction.setIcon({tabId: currentTab.id, path:"icons/Extrasafe19.png"});
			chrome.pageAction.setTitle({tabId: currentTab.id,title: "Click to disable extrasafe in this site"});
		}
	});
});
