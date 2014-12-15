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
	findSiteTag(sender.url);
	chrome.tabs.sendMessage(sender.tab.id,{ result: Hasher.passy(request.masterPassword,siteTag), fromInputField: request.fromInputField });
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
			chrome.storage.sync.set({
				extrasafeDisabledStorageFlag : true,
			}, function(){});
		}
		else{
			broadcast({result:"enable password div"});
			extrasafeDisabled = false;
			chrome.browserAction.setIcon({path:"icons/Extrasafe19.png"});
			chrome.browserAction.setTitle({title: "Click to disable extrasafe"});
			chrome.storage.sync.set({
				extrasafeDisabledStorageFlag : false,
			}, function(){});
		}
	});
});

//To send disabled message to newly created or navigated when browser action is already disabled
//When the extrasafeDisabled fetched from storage
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	chrome.storage.sync.get({
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

chrome.storage.onChanged.addListener(function(changes, namespace) {
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
	  }*/
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
