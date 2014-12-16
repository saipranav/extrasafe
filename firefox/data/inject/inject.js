
var globalNoInputFields = 0;

//Forcefully injecting code which overrides the default XMLHttpRequest, so that we can rerun the inject function if the site contains
// any password field fetched by ajax
var actualCode = ['XMLHttpRequest.prototype.reallyOpen = XMLHttpRequest.prototype.open;',
                  'XMLHttpRequest.prototype.open = function(method, url, async, user, password) {',
                  ' this.addEventListener("loadend", function() {',
                  '   document.body.setAttribute("extrasafe","rerun")',
                  '   console.log("asdf");',
                  ' }, false);',
				  'this.reallyOpen (method, url, async, user, password);',
                  '}'].join('\n');

var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);

//Jquery function to insert master password fields in the web page (DOM modifications).
//It sees for the input type password and inserts the new master password div into the body.
//The master password div contains the master password input field, show password icon, Extrasafe icon.
function inject(rerun){
	$("input[type=password]:not(.extrasafeMasterPassword):not(.enableExtrasafe):not(.disableExtrasafe)").each(function(){
		globalNoInputFields++;

		//get the original password position in order to show the new master password div in correct position below the original password.
		var originalPassword = $(this);
		var passwordPosition = originalPassword.offset();
		var passwordHeight = originalPassword.outerHeight(true);

		var masterPasswordDiv = $('<div class="extrasafeMasterPasswordDiv" style="top:'+(passwordPosition.top+passwordHeight+5)+'px; left:'+passwordPosition.left+'px ">');
		if(rerun){
			masterPasswordDiv.addClass("reruned");
		}
		var masterPasswordField = $('<input type="password" class="extrasafeMasterPassword" id="master_password" inputField="'+globalNoInputFields+'" placeholder="Master Password" ></input>');
		var images = $('<span class="images"></span>');
		var showPassword = $('<img class="extrasafeUnmask" src="'+self.options.unmaskPng+'"></img>');
		var extrasafeIcon = $('<img class="extrasafeIcon" src="'+self.options.extrasafePng+'"></img>');
		
		images.append(showPassword);
		images.append(extrasafeIcon);

		//When user clicks outside the master password div, master password div should hide
		masterPasswordDiv.focusout(function(){
			masterPasswordDiv.hide();
		});

		//User can press enter in login forms for auto submit (or) can click outside to continue with other input fields.
		//On users key up event on master password field,
		//	check for whether enter is pressed -> Send the master password to background, hide the master password div, submit the login form.
		//	If master password is empty then clear the original password field also.
		//	For all other key ups send the master password to background.
		//Reason for key up is its called after key pressed actions (eg clearing does not work properly on other key events).
		masterPasswordField.keyup(function(e){
			if(e.keyCode == 13){
				self.port.emit("master password",{ masterPassword: $(this).val(), fromInputField: masterPasswordField.attr('inputField') });
				masterPasswordDiv.hide();
				originalPassword.closest("form").submit();
			}
			if(masterPasswordField.val() == ""){
				originalPassword.val("");
			}
			else{
				self.port.emit("master password",{ masterPassword: $(this).val(), fromInputField: masterPasswordField.attr('inputField') });
			}
		});

		//User presses tab or shift tab we listen in key down which will be triggered before keyup.
		//We unbind , focus on originalPassword and then bind again.
		//COMMENTED : event bubbling is prevented so as to focus the original password again after pressing tab from master password instead of showing the next password
		masterPasswordField.keydown(function(e){
			if(e.keyCode == 9){
				//e.preventDefault();
				//e.stopPropagation();
				originalPassword.off("focus");
				originalPassword.focus();
				originalPassword.on("focus",toggleFocus);
			}
		});

		//If user mouse enters over the master password show password, change the input type to text.
		showPassword.mouseenter(function(){
			masterPasswordField.attr('type','text');
		});

		//If user mouse leaves over the master password show password, change the input type to password.
		showPassword.mouseleave(function(){
			masterPasswordField.attr('type','password');
		});

		//Append all the fields and icons to master password div and hide it initially.
		masterPasswordDiv.append(masterPasswordField);
		masterPasswordDiv.append(images);
		masterPasswordDiv.hide();

		//This function shows the master password div.
		var toggleFocus = function(){
			passwordPosition = originalPassword.offset();
			passwordHeight = originalPassword.outerHeight(true);
			masterPasswordDiv.css("top",(passwordPosition.top+passwordHeight+5)+'px').css("left",passwordPosition.left+'px');
			masterPasswordDiv.show();
			masterPasswordField.focus();
		}
		
		//Initially bind the focus event with toggleFocus function.
		originalPassword.on("focus",toggleFocus);

		//On Users click on page action icon to enable or disable the Extrasafe in current site. The class of original password differs, bind or unbind accordingly.
		originalPassword.on("classToggled",function(){
			if(originalPassword.hasClass('enableExtrasafe')){
				originalPassword.on("focus",toggleFocus);
			}
			else if(originalPassword.hasClass('disableExtrasafe')){
				originalPassword.off("focus");
			}
		});

		//Bind the master password field in body.
		//See the inject.css for the position and !important fields to overcome the web sites css. 
		$(document.body).append(masterPasswordDiv);

		//Add class infomation, and these are initial settings.
		originalPassword.addClass(""+globalNoInputFields);
		originalPassword.addClass('enableExtrasafe');

	});
}

inject(false);

// Watcher for the body attribute change which is done by the content script forcefully injected
var target = document.body;
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
  	if(mutation.attributeName == "extrasafe" && mutation.target.getAttribute("extrasafe") == "rerun"){
  		if($("input[type=password]:not(.extrasafeMasterPassword):not(.enableExtrasafe):not(.disableExtrasafe)").length){
  			$(".reruned").remove();
			inject(true);
			console.log("injected");
		}
  	}
  });    
});
var config = { attributes: true, childList: true, characterData: true };
observer.observe(target, config);

self.port.on("disable password div", function(message){
	$(".extrasafeMasterPasswordDiv").hide();
	$("input[type=password]:not(.extrasafeMasterPassword)").removeClass('enableExtrasafe');
	$("input[type=password]:not(.extrasafeMasterPassword)").addClass('disableExtrasafe');
	$("input[type=password]:not(.extrasafeMasterPassword)").trigger('classToggled');
});

self.port.on("enable password div", function(message){
	$("input[type=password]:not(.extrasafeMasterPassword)").removeClass('disableExtrasafe');
	$("input[type=password]:not(.extrasafeMasterPassword)").addClass('enableExtrasafe');
	$("input[type=password]:not(.extrasafeMasterPassword)").trigger('classToggled');
});

self.port.on("result", function(message){
	$("."+message.fromInputField).each(function(){
		$(this).val(message.result);
	});
});

//To rerun the DOM modifications on ajax called login/signup forms.
self.port.on("rerun input script", function(message){
	if(!$(".extrasafeMasterPassword").length){
		inject();
	}
});