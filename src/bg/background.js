//Global variable site tag (eg: google).
var siteTag = undefined;

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
      chrome.tabs.sendMessage(currentTab.id,{ result:Hasher.passy(request.masterPassword,siteTag) });
});

//For every update in tab (eg: opening google) this will capture the siteTag.
//New tab is set as global variable.
//TODO: afterpattern, beforepattern some best approach.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        	currentTab = tabs[0];
			siteTag = tabs[0].url.split(".")[1];

			var beforePattern = new RegExp("www","g");
			var afterPattern = new RegExp("(com|in|co|html|jsp|php)","g");

			if(afterPattern.test(siteTag)){
				siteTag = currentTab.url.split(".")[0];
			}
			if(beforePattern.test(siteTag)){
				siteTag = currentTab.url.split(".")[2];
			}

		});
});