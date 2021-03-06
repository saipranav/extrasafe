/*******************************************************************************************
Just Remember one Master Password text, Extrasafe takes care of the rest ;)
Extrasafe (C) 2014-2015  The Extra Labs
GNU General Public License v3
http://theextralabs.com
********************************************************************************************/
var globalNoInputFields = 0;
var disabled = false;
var helperTimer;

//Jquery function to insert master password fields in the web page (DOM modifications).
//It sees for the input type password and inserts the new master password div into the body.
//The master password div contains the master password input field, show password icon, Extrasafe icon.
function inject(){
	$("input[type=password]:not(.extrasafe-child):not([extrasafe=extrasafe-parent])").each(function(){
		globalNoInputFields++;

		//get the original password position in order to show the new master password div in correct position below the original password.
		var originalPassword = $(this);
		var passwordPosition = originalPassword.offset();
		var passwordHeight = originalPassword.outerHeight(true);

		//the input field number is tagged against child password field which is tagged again with parent, used for pasting the password in respective fields
		var masterPasswordDiv = $('<div class="extrasafe-child-container" style="top:'+(passwordPosition.top+passwordHeight+5)+'px; left:'+passwordPosition.left+'px "></div>');
		var masterPasswordField = $('<input type="password" class="extrasafe-child" id="master_password" inputField="'+globalNoInputFields+'" placeholder="Master Password" ></input>');
		var showPassword = $('<img class="extrasafe-unmask" src="'+safari.extension.baseURI+'icons/Unmask16.png"></img>');
		var extrasafeIcon = $('<img class="extrasafe-icon" title="Powered by Extrasafe" src="'+safari.extension.baseURI+'icons/Extrasafe16.png"></img>');
		var masterPasswordFieldErrors = $('<div class="extrasafe-errors center-text" style="display:none" id="master_password_errors"></div>');
		var extrasafeHelper = $('<img class="extrasafe-helper" title="Not your computer? Stay still for 5 seconds to open our backup plan!" src="'+safari.extension.baseURI+'icons/Info16.png"></img>');
		var profileDiv = $('<div class="profile-div"><ul><li class="profile-item"><img src="'+safari.extension.baseURI+'icons/Personal16.png"></img><span>Personal</span></li><li class="profile-item"><img src="'+safari.extension.baseURI+'icons/Official16.png"></img><span>Official</span></li><li class="profile-item"><img src="'+safari.extension.baseURI+'icons/Default16.png"></img><span>Default</span></li></ul></div>');
		var profileSelector = $('<span class="profile-selector"><img src="'+safari.extension.baseURI+'icons/Personal16.png"></img></span>');

		//When user clicks outside the master password div, master password div should hide
		masterPasswordDiv.focusout(function(){
			masterPasswordDiv.hide();
		});

		//User can press enter in login forms for auto submit (or) can click outside to continue with other input fields.
		//On users key up event on master password field,
		//	check for whether enter is pressed -> Send the master password to background, hide the master password div, submit the login form.
		//	If master password is empty then clear the original password field also.
		//	For all other key ups send the master password to background.
        //  If it has space then show the red error things as space is not allowed because it might be confuse the user while typing master password in portable site.  
		//Reason for key up is its called after key pressed actions (eg clearing does not work properly on other key events).
		masterPasswordField.keyup(function(e){
			masterPasswordField.removeClass("extrasafe-error-div");
			masterPasswordFieldErrors.html("");
			masterPasswordFieldErrors.hide();
			if(e.keyCode == 13){
				safari.self.tab.dispatchMessage("key up", { masterPassword: $(this).val(), fromInputField: masterPasswordField.attr('inputField') });
				masterPasswordDiv.hide();
				originalPassword.closest("form").submit();
			}
			if(masterPasswordField.val() == ""){
				originalPassword.val("");
			}
			else if(masterPasswordField.val().match(" ")){
				masterPasswordField.addClass("extrasafe-error-div");
				masterPasswordFieldErrors.append("<div>Space is not allowed</div>");
				masterPasswordFieldErrors.show();
				originalPassword.val("");
			}
			else{
				safari.self.tab.dispatchMessage("key up", { masterPassword: $(this).val(), fromInputField: masterPasswordField.attr('inputField'), profile: profileSelector.find("img").attr("src") });
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

		//If user hovers over the master password show password, change the input type to text.
		showPassword.mouseenter(function(){
			masterPasswordField.attr('type','text');
		});
		showPassword.mouseleave(function(){
			masterPasswordField.attr('type','password');
		});

		//If user mouse entered the extrasafe helper, wait for 4 sec and open portable site in new tab
		//If user mouse leaved the extrasafe helper, clear the timer
		extrasafeHelper.mouseenter(function(){
			helperTimer = setTimeout(function(){
				safari.self.tab.dispatchMessage("open portable", {});
			},4000);
		});
		extrasafeHelper.mouseleave(function(){
			clearTimeout(helperTimer);
		});

		//If user mouse entered the profile selector, show the profile div for selection
		//If user mouse entered the profile div, show the profile div for selection
		//If user mouse leaved the profile div, hide the profile div
		profileSelector.mouseenter(function(){
			profileDiv.show();
		});
		profileDiv.mouseenter(function(){
			profileDiv.show();
		});
		profileDiv.mouseleave(function(){
			profileDiv.hide();
		});

		//On mouse enter of profile items set the timer for 250ms for change the settings in background
		profileDiv.find(".profile-item").mouseenter(function(){
			currentProfileOnHover = $(this);
			helperTimer = setTimeout(function(){
				profileSelector.find("img").attr("src", currentProfileOnHover.find("img").attr("src"));
				if(masterPasswordField.val() != ""){
					safari.self.tab.dispatchMessage("key up", { masterPassword: masterPasswordField.val(), fromInputField: masterPasswordField.attr('inputField'), profile: profileSelector.find("img").attr("src") });
				}
			},250);
		});

		//On mouse leave of profile items cancel the timer
		profileDiv.find(".profile-item").mouseleave(function(){
			clearTimeout(helperTimer);
		});

		//Append all the fields and icons to master password div and hide it initially.
		masterPasswordDiv.append(extrasafeIcon);
		masterPasswordDiv.append(masterPasswordField);
		masterPasswordDiv.append(showPassword);
		masterPasswordDiv.append(extrasafeHelper);
		masterPasswordDiv.append(profileSelector);
		masterPasswordDiv.append(profileDiv);
		masterPasswordDiv.append(masterPasswordFieldErrors);
		masterPasswordDiv.hide();
		profileDiv.hide();

		//This function shows the master password div.
		var toggleFocus = function(){
			passwordPosition = originalPassword.offset();
			passwordHeight = originalPassword.outerHeight(true);
			masterPasswordDiv.css("top",(passwordPosition.top+passwordHeight+5)+'px').css("left",passwordPosition.left+'px');
			masterPasswordDiv.show();
			masterPasswordField.focus();
			profileDiv.hide();
		}
		
		//Initially bind the focus event with toggleFocus function.
		originalPassword.on("focus",toggleFocus);

		//On Users click on page action icon to enable or disable the Extrasafe in current site. Bind or unbind according to disabled global attribute.
		originalPassword.on("coupler",function(){
			if(!disabled){
				originalPassword.on("focus",toggleFocus);
				originalPassword.blur();
			}
			else{
				originalPassword.off("focus");
			}
		});

		//Bind the master password field in body.
		//See the inject.css for the position and !important fields to overcome the web sites css. 
		$(document.body).append(masterPasswordDiv);

		//Add other infomation, like tagging the input field 
		originalPassword.attr("extrasafe-password-number",globalNoInputFields);
		originalPassword.attr("extrasafe","extrasafe-parent");

		//Trigger the coupler to initialize the newly created extrasafechild for ajax based login form, in case the extrasafe is in disabled mode 
		if(disabled){
			originalPassword.trigger('coupler');
		}

	});
}

inject();

// Watcher for the body subtree change and checking input and password in innerHTML and triggering the inject script to create master password div for ajaxed input forms
var target = document.body;
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation){
  	for (var i = mutation.addedNodes.length - 1; i >= 0; i--) {
  		var node = mutation.addedNodes[i]
  		if( node.innerHTML != undefined && node.innerHTML.indexOf("input") !=-1 && node.innerHTML.indexOf("password") != -1){
  			inject();
  		}
  	};
  });    
});
var config = { childList: true, subtree: true};
observer.observe(target, config);

//Single function to capture all messages
function captureFunction(event){

	if(event.name == "disable password div"){
		$(".extrasafe-child-container").hide();
		disabled = true;
		$("input[type=password]:not(.extrasafe-child)").trigger('coupler');
	}
	else if(event.name == "enable password div"){
		disabled = false;
		$("input[type=password]:not(.extrasafe-child)").trigger('coupler');
	}
	else if(event.name == "result"){
		$("input[extrasafe-password-number='"+event.message.fromInputField+"']").each(function(){
			$(this).val(event.message.result);
		});
	}
}

safari.self.addEventListener("message", captureFunction ,true);
