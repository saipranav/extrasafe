/*TODO use some import functionality to import JQUERY, SHA3, HASHER js*/

	/*CRYPTOJS SHA3*/
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(v,p){var d={},u=d.lib={},r=function(){},f=u.Base={extend:function(a){r.prototype=this;var b=new r;a&&b.mixIn(a);b.hasOwnProperty("init")||(b.init=function(){b.$super.init.apply(this,arguments)});b.init.prototype=b;b.$super=this;return b},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
s=u.WordArray=f.extend({init:function(a,b){a=this.words=a||[];this.sigBytes=b!=p?b:4*a.length},toString:function(a){return(a||y).stringify(this)},concat:function(a){var b=this.words,c=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var n=0;n<a;n++)b[j+n>>>2]|=(c[n>>>2]>>>24-8*(n%4)&255)<<24-8*((j+n)%4);else if(65535<c.length)for(n=0;n<a;n+=4)b[j+n>>>2]=c[n>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<
32-8*(b%4);a.length=v.ceil(b/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*v.random()|0);return new s.init(b,a)}}),x=d.enc={},y=x.Hex={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++){var n=b[j>>>2]>>>24-8*(j%4)&255;c.push((n>>>4).toString(16));c.push((n&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j+=2)c[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new s.init(c,b/2)}},e=x.Latin1={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++)c.push(String.fromCharCode(b[j>>>2]>>>24-8*(j%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j++)c[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new s.init(c,b)}},q=x.Utf8={stringify:function(a){try{return decodeURIComponent(escape(e.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return e.parse(unescape(encodeURIComponent(a)))}},
t=u.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new s.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=q.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,j=b.sigBytes,n=this.blockSize,e=j/(4*n),e=a?v.ceil(e):v.max((e|0)-this._minBufferSize,0);a=e*n;j=v.min(4*a,j);if(a){for(var f=0;f<a;f+=n)this._doProcessBlock(c,f);f=c.splice(0,a);b.sigBytes-=j}return new s.init(f,j)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});u.Hasher=t.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){t.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,c){return(new a.init(c)).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return(new w.HMAC.init(a,
c)).finalize(b)}}});var w=d.algo={};return d}(Math);
(function(v){var p=CryptoJS,d=p.lib,u=d.Base,r=d.WordArray,p=p.x64={};p.Word=u.extend({init:function(f,s){this.high=f;this.low=s}});p.WordArray=u.extend({init:function(f,s){f=this.words=f||[];this.sigBytes=s!=v?s:8*f.length},toX32:function(){for(var f=this.words,s=f.length,d=[],p=0;p<s;p++){var e=f[p];d.push(e.high);d.push(e.low)}return r.create(d,this.sigBytes)},clone:function(){for(var f=u.clone.call(this),d=f.words=this.words.slice(0),p=d.length,r=0;r<p;r++)d[r]=d[r].clone();return f}})})();
(function(v){for(var p=CryptoJS,d=p.lib,u=d.WordArray,r=d.Hasher,f=p.x64.Word,d=p.algo,s=[],x=[],y=[],e=1,q=0,t=0;24>t;t++){s[e+5*q]=(t+1)*(t+2)/2%64;var w=(2*e+3*q)%5,e=q%5,q=w}for(e=0;5>e;e++)for(q=0;5>q;q++)x[e+5*q]=q+5*((2*e+3*q)%5);e=1;for(q=0;24>q;q++){for(var a=w=t=0;7>a;a++){if(e&1){var b=(1<<a)-1;32>b?w^=1<<b:t^=1<<b-32}e=e&128?e<<1^113:e<<1}y[q]=f.create(t,w)}for(var c=[],e=0;25>e;e++)c[e]=f.create();d=d.SHA3=r.extend({cfg:r.cfg.extend({outputLength:512}),_doReset:function(){for(var a=this._state=
[],b=0;25>b;b++)a[b]=new f.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(a,b){for(var e=this._state,f=this.blockSize/2,h=0;h<f;h++){var l=a[b+2*h],m=a[b+2*h+1],l=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360,m=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360,g=e[h];g.high^=m;g.low^=l}for(f=0;24>f;f++){for(h=0;5>h;h++){for(var d=l=0,k=0;5>k;k++)g=e[h+5*k],l^=g.high,d^=g.low;g=c[h];g.high=l;g.low=d}for(h=0;5>h;h++){g=c[(h+4)%5];l=c[(h+1)%5];m=l.high;k=l.low;l=g.high^
(m<<1|k>>>31);d=g.low^(k<<1|m>>>31);for(k=0;5>k;k++)g=e[h+5*k],g.high^=l,g.low^=d}for(m=1;25>m;m++)g=e[m],h=g.high,g=g.low,k=s[m],32>k?(l=h<<k|g>>>32-k,d=g<<k|h>>>32-k):(l=g<<k-32|h>>>64-k,d=h<<k-32|g>>>64-k),g=c[x[m]],g.high=l,g.low=d;g=c[0];h=e[0];g.high=h.high;g.low=h.low;for(h=0;5>h;h++)for(k=0;5>k;k++)m=h+5*k,g=e[m],l=c[m],m=c[(h+1)%5+5*k],d=c[(h+2)%5+5*k],g.high=l.high^~m.high&d.high,g.low=l.low^~m.low&d.low;g=e[0];h=y[f];g.high^=h.high;g.low^=h.low}},_doFinalize:function(){var a=this._data,
b=a.words,c=8*a.sigBytes,e=32*this.blockSize;b[c>>>5]|=1<<24-c%32;b[(v.ceil((c+1)/e)*e>>>5)-1]|=128;a.sigBytes=4*b.length;this._process();for(var a=this._state,b=this.cfg.outputLength/8,c=b/8,e=[],h=0;h<c;h++){var d=a[h],f=d.high,d=d.low,f=(f<<8|f>>>24)&16711935|(f<<24|f>>>8)&4278255360,d=(d<<8|d>>>24)&16711935|(d<<24|d>>>8)&4278255360;e.push(d);e.push(f)}return new u.init(e,b)},clone:function(){for(var a=r.clone.call(this),b=a._state=this._state.slice(0),c=0;25>c;c++)b[c]=b[c].clone();return a}});
p.SHA3=r._createHelper(d);p.HmacSHA3=r._createHmacHelper(d)})(Math);
	/*CRYPTOJS SHA3*/
	/*HASHER*/
Hasher = {

	masterPassword: "", //input master password
	siteTag: "", //site name
	extraSecuritySequence: "", // extra string to be added with master password
	password: "", //output password
	start: 0, //start for triming
	end: 12, //end for triming
	specialCharacters : new Array("@","!","&","*","#","(",")","/"),
	capitalCharacters : new Array("A","B","C","D","E","F","G","H"),
	smallCharacters : new Array("a","b","c","d","e","f","g","h"),
	numbers : new Array("0","1","2","3","4","5","6","7","8","9"),
	specialCharactersPos : new Array(),
	numberPos : new Array(),
	smallCharactersPos : new Array(),
	capitalCharactersPos : new Array(),
	injectedChars: new Array(),
	iterator : 0,
	
	//Call the crypto graphic algorithm.
	hashy: function(){	
			Hasher.password = CryptoJS.SHA3( Hasher.siteTag + Hasher.masterPassword + Hasher.extraSecuritySequence).toString();
			},

	//It will be called after the Crypto returns.
	modify: function(){
				Hasher.password = Hasher.password.slice(Hasher.start, Hasher.end);
				Hasher.extrasafeModification();
			},
	
	//Extrasafe modification
	extrasafeModification: function(){
					Hasher.fillCountCharacters();
					Hasher.checker();
					Hasher.finalTrim();
					Hasher.iterator = 0;
				},

	checker: function(){
					//all small characters

					//Inside if structure:
					// derive replace index (password) from position array and charAt (denotes instance of injection) (should be within password length)
					// replaces the password at replaceIndex, with character taken from predefined array (take the password character at position (take from position array ) convert to integer value) (fold the integer with predefined array length so that it stays within predefined array)
					// add replaceIndex in deficit position array
					// remove replaceIndex from surplus position array
					// add replaceIndex in injectedChars so that its not replaced again with another injected character
					if(/^[a-z]*$/.test(Hasher.password) == true || Hasher.numberPos.length < 4){

						var replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.numbers[((Hasher.password[Hasher.smallCharactersPos[0]]).charCodeAt(0))%(Hasher.numbers.length-1)]);
						Hasher.numberPos.push(replaceIndex);
						Hasher.smallCharactersPos.splice(Hasher.smallCharactersPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 1);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.numbers[((Hasher.password[Hasher.smallCharactersPos[1]]).charCodeAt(0))%(Hasher.numbers.length-1)]);
						Hasher.numberPos.push(replaceIndex);
						Hasher.smallCharactersPos.splice(Hasher.smallCharactersPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 2);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.numbers[((Hasher.password[Hasher.smallCharactersPos[2]]).charCodeAt(0))%(Hasher.numbers.length-1)]);
						Hasher.numberPos.push(replaceIndex);
						Hasher.smallCharactersPos.splice(Hasher.smallCharactersPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);
					}
					//all numbers
					if(/^[0-9]*$/.test(Hasher.password) == true || Hasher.smallCharactersPos.length < 4){

						var replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.smallCharacters[((Hasher.password[Hasher.numberPos[0]]).charCodeAt(0))%(Hasher.smallCharacters.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
						Hasher.numberPos.splice(Hasher.numberPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 1);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.smallCharacters[((Hasher.password[Hasher.numberPos[1]]).charCodeAt(0))%(Hasher.smallCharacters.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
						Hasher.numberPos.splice(Hasher.numberPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 2);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.smallCharacters[((Hasher.password[Hasher.numberPos[2]]).charCodeAt(0))%(Hasher.smallCharacters.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
						Hasher.numberPos.splice(Hasher.numberPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);
					}
					//capital characters not found
					if(/^([a-z]|(@|!|&|#|\*)|[0-9])*$/.test(Hasher.password) == true){
						var replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.capitalCharacters[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1]]).charCodeAt(0))%(Hasher.capitalCharacters.length-1)]);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 1);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.capitalCharacters[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-2]]).charCodeAt(0))%(Hasher.capitalCharacters.length-1)]);
						Hasher.injectedChars.push(replaceIndex);
					}
					//special characters not found
					if(/^([a-z]|[A-Z]|[0-9])*$/.test(Hasher.password) == true){
						var replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.specialCharacters[((Hasher.password[Hasher.numberPos[Hasher.numberPos.length-1]]).charCodeAt(0))%(Hasher.specialCharacters.length-1)]);
						Hasher.injectedChars.push(replaceIndex);
					}
				},

	//takes the passwords char code (int) at charAt, fold it to the size of array/2, to make sure index stays inside the password (because array elements are subset of password indexes)
	//it takes care of injected characters not being replaced
	//it might some times give undefined which makes the password grow by repeating chars at replaceAt function, but finalTrim takes care of this issue
	getReplaceIndex: function(array, charAt){
					var index = array[(Hasher.password.charCodeAt(charAt))%(Math.ceil(array.length/2))];
					if(Hasher.injectedChars.indexOf(index) != -1){
						index = undefined;
					}
					return index;
				},	
	
	//function to reduce the size of passwords if required
	finalTrim: function(){
					if(Hasher.password.length > Hasher.end){
						Hasher.fillCountCharacters();
						//check whether numbers or small chars are more in number
						if(Hasher.numberPos.length > Hasher.smallCharactersPos.length){
							//reduce the numbers but minimum of 4
							while(Hasher.password.length > Hasher.end && Hasher.numberPos.length > 4){
								Hasher.password = Hasher.password.substr(0, Hasher.numberPos[Hasher.numberPos.length-1])+Hasher.password.substr((Hasher.numberPos[Hasher.numberPos.length-1])+1, Hasher.password.length);
								Hasher.numberPos.splice(-1,1);
							}
							Hasher.iterator++;
							//check to trim more for 2 times max then forcefully come out
							if(Hasher.iterator < 2){
								Hasher.finalTrim();
							}
						}
						else{
							//reduce the small chars but minimum of 4
							while(Hasher.password.length > Hasher.end && Hasher.smallCharactersPos.length > 4){
								Hasher.password = Hasher.password.substr(0, Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1])+Hasher.password.substr((Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1])+1, Hasher.password.length);
								Hasher.smallCharactersPos.splice(-1,1);
							}
							Hasher.iterator++;
							//check to trim more for 2 times max then forcefully come out
							if(Hasher.iterator < 2){
								Hasher.finalTrim();
							}
						}
					}
				},

	//Utility Helper methods - replaceAt(index to be replaced, character to be placed)
	replaceAt: function(index, character) {
   							return Hasher.password.substr(0, index) + character + Hasher.password.substr(index+character.length);
						},

	//fill the position array buckets
	fillCountCharacters: function() {
					//reset array to 0
					Hasher.injectedChars.length = Hasher.specialCharactersPos.length = Hasher.numberPos.length = Hasher.smallCharactersPos.length = Hasher.capitalCharactersPos.length = 0;
					for(var iterator=0;iterator<Hasher.password.length;iterator++) {
						if(/^[a-z]$/.test(Hasher.password[iterator])){
							Hasher.smallCharactersPos[Hasher.smallCharactersPos.length++]=iterator;
						}
						else if(/^[0-9]$/.test(Hasher.password[iterator])){
							Hasher.numberPos[Hasher.numberPos.length++]=iterator;
						}
						else if(/^[A-Z]$/.test(Hasher.password[iterator])){
							Hasher.capitalCharactersPos[Hasher.capitalCharactersPos.length++]=iterator;
						}
						else if(/^\W$/.test(Hasher.password[iterator])){
							Hasher.specialCharactersPos[Hasher.specialCharactersPos.length++]=iterator;
						}
					}	
				},			

	
	//Single method to call from outside to return the hashed and modified password.
	passy: function(masterPassword, siteTag){ 
						Hasher.masterPassword = masterPassword;
						Hasher.siteTag = siteTag;
						Hasher.hashy();
						Hasher.modify();
						return Hasher.password;
						}

};
	/*HASHER*/

	/*Main.js*/

var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var widgets = require("sdk/widget");
var ui = require("sdk/ui");
var workers = require("sdk/content/worker");
var simplePrefs = require("sdk/simple-prefs");

var siteTag = "";
var siteUrl = "";
var extrasafeDisabled = false;
var injectedWorkers = [];

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
			var password = Hasher.passy(message.masterPassword,siteTag);
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
			button.state(button, { label: "Click to enable Extrasafe", icon: {"16": "./icons/Extrasafe_red16.png", "48": "./icons/Extrasafe_red48.png"} });
	}
	else{
			broadcast("enable password div",{});
			extrasafeDisabled = false;
			button.state(button, { label: "Click to disable Extrasafe", icon: {"16": "./icons/Extrasafe16.png", "48": "./icons/Extrasafe48.png"} });
	}
  }
});

//For saving options
simplePrefs.on("update",function(){
	var start = simplePrefs.prefs.startIndex;
	var end = simplePrefs.prefs.endIndex;
	var extraSecuritySequence = simplePrefs.prefs.extraSecuritySequence;
	if((start<0) || (end>128) || (start>=end) || (start>116) || (end<12) || ((end-start)<12) ){
		simplePrefs.prefs.updateStatus = "Password Length :: Minimum: 0, Maximum: 128\nEnd index should be greater than Start index\nDifference between End index and Start index should be greater than 12";
	}
	else{
		Hasher.extraSecuritySequence = extraSecuritySequence;
		Hasher.start = start;
		Hasher.end = end;
		simplePrefs.prefs.updateStatus = "Your options are Saved";
	}
});
simplePrefs.on("reset",function(){
	var start = 0;
	var end = 12;
	var extraSecuritySequence = "";
	Hasher.extraSecuritySequence = extraSecuritySequence;
	Hasher.start = start;
	Hasher.end = end;
	simplePrefs.prefs.startIndex = start;
	simplePrefs.prefs.endIndex = end;
	simplePrefs.prefs.extraSecuritySequence = extraSecuritySequence;
	simplePrefs.prefs.updateStatus = "Your options are Reset to default";
});
simplePrefs.on("cancel",function(){
	var start = Hasher.start;
	var end = Hasher.end;
	var extraSecuritySequence = Hasher.extraSecuritySequence;
	simplePrefs.prefs.startIndex = start;
	simplePrefs.prefs.endIndex = end;
	simplePrefs.prefs.extraSecuritySequence = extraSecuritySequence;
	simplePrefs.prefs.updateStatus = "Your options are Reset to previous state";
});


//TODO: firefox 28 and earlier supports widget not action button
/*var widget = widgets.Widget({
  id: "mozilla-link",
  label: "",
  contentURL: self.data.url("icon/Extrasafe16.png"),
  onClick: function() {
    tabs.open("http://developer.mozilla.org/");
  }
});*/

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
