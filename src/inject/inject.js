var globalNoInputFields = 0;

//Jquery function to insert master password fields in the web page (DOM modifications).
//It sees for the input type password and inserts the new text box (master password) before.
$("input[type='password']").each(function(){
	globalNoInputFields++;

	var originalPassword = $(this);
	var passwordPosition = originalPassword.offset();
	var passwordHeight = originalPassword.outerHeight(true);

	var masterPasswordDiv = $('<div class=extrasafeMasterPasswordDiv style="top:'+(passwordPosition.top+passwordHeight+5)+'px; left:'+passwordPosition.left+'px ">');
	var masterPasswordField = $('<input type="password" class="extrasafeMasterPassword" id="master_password" inputField="'+globalNoInputFields+'" placeholder="Master Password" ></input>');
	var images = $('<span class="images"></span>');
	var showPassword = $('<img class="extrasafeUnmask" src="'+chrome.extension.getURL("icons/Unmask16.png")+'"></img>');
	var extrasafeIcon = $('<img class="extrasafeIcon" src="'+chrome.extension.getURL("icons/Extrasafe16.png")+'"></img>');
	
	images.append(showPassword);
	images.append(extrasafeIcon);

	masterPasswordDiv.focusout(function(){
		masterPasswordDiv.hide();
	});
	masterPasswordField.keypress(function(e){
		if(e.keyCode == 13){
			chrome.runtime.sendMessage({ masterPassword: $(this).val(), fromInputField: masterPasswordField.attr('inputField') });
			masterPasswordDiv.hide();
			originalPassword.closest("form").submit();
		}
	});
	showPassword.mouseenter(function(){
		masterPasswordField.attr('type','text');
	});
	showPassword.mouseleave(function(){
		masterPasswordField.attr('type','password');
	});

	masterPasswordDiv.append(masterPasswordField);
	masterPasswordDiv.append(images);
	masterPasswordDiv.hide();

	var toggleFocus = function(){
		masterPasswordDiv.show();
		masterPasswordField.focus();
	}

	$(this).on("focus",toggleFocus);

	$(this).on("classToggled",function(){
		if($(this).hasClass('enableExtrasafe')){
			$(this).on("focus",toggleFocus);
		}
	else if($(this).hasClass('disableExtrasafe')){
		$(this).off("focus");
		}
	});

	$(document.body).append(masterPasswordDiv);

	originalPassword.addClass(""+globalNoInputFields);
	originalPassword.addClass('enableExtrasafe');

});

//Single message handler function to handle messages from content scripts.
//Note: message.result is the only field in all messages.
chrome.runtime.onMessage.addListener(function(message){
	//To rerun the DOM modifications.
	if(message.result == "rerun input script"){
		if(!$(".extrasafeMasterPassword").length){
			$("input[type='password']").each(function(){
				//copy the inject code
				globalNoInputFields++;
				
					var originalPassword = $(this);
					var passwordPosition = originalPassword.offset();
					var passwordHeight = originalPassword.outerHeight(true);

					var masterPasswordDiv = $('<div class=extrasafeMasterPasswordDiv style="top:'+(passwordPosition.top+passwordHeight+5)+'px; left:'+passwordPosition.left+'px ">');
					var masterPasswordField = $('<input type="password" class="extrasafeMasterPassword" id="master_password" inputField="'+globalNoInputFields+'" placeholder="Master Password" ></input>');
					var images = $('<span class="images"></span>');
					var showPassword = $('<img class="extrasafeUnmask" src="'+chrome.extension.getURL("icons/Unmask16.png")+'"></img>');
					var extrasafeIcon = $('<img class="extrasafeIcon" src="'+chrome.extension.getURL("icons/Extrasafe16.png")+'"></img>');
	
					images.append(showPassword);
					images.append(extrasafeIcon);

					masterPasswordDiv.focusout(function(){
						masterPasswordDiv.hide();
					});
					masterPasswordField.keypress(function(e){
						if(e.keyCode == 13){
							chrome.runtime.sendMessage({ masterPassword: $(this).val(), fromInputField: masterPasswordField.attr('inputField') });
							masterPasswordDiv.hide();
							originalPassword.closest("form").submit();
						}
					});
					showPassword.mouseenter(function(){
						masterPasswordField.attr('type','text');
					});
					showPassword.mouseleave(function(){
						masterPasswordField.attr('type','password');
					});

					masterPasswordDiv.append(masterPasswordField);
					masterPasswordDiv.append(images);
					masterPasswordDiv.hide();

					var toggleFocus = function(){
						masterPasswordDiv.show();
						masterPasswordField.focus();
					}

					$(this).on("focus",toggleFocus);

					$(this).on("classToggled",function(){
						if($(this).hasClass('enableExtrasafe')){
							$(this).on("focus",toggleFocus);
						}
					else if($(this).hasClass('disableExtrasafe')){
						$(this).off("focus");
						}
					});

					$(document.body).append(masterPasswordDiv);

					originalPassword.addClass(""+globalNoInputFields);
					originalPassword.addClass('enableExtrasafe');
			});
		}
	}

	//disable password div
	else if(message.result == "disable password div"){
		$("input[type='password']:not('.extrasafeMasterPassword')").removeClass('enableExtrasafe');
		$("input[type='password']:not('.extrasafeMasterPassword')").addClass('disableExtrasafe');
		$("input[type='password']:not('.extrasafeMasterPassword')").trigger('classToggled');
	}

	//enable password div
	else if(message.result == "enable password div"){
		$("input[type='password']:not('.extrasafeMasterPassword')").removeClass('disableExtrasafe');
		$("input[type='password']:not('.extrasafeMasterPassword')").addClass('enableExtrasafe');
		$("input[type='password']:not('.extrasafeMasterPassword')").trigger('classToggled');
	}

	//This is the password. Set in the password field.
	else{
		$("."+message.fromInputField).each(function(){
			$(this).val(message.result);
		});
	}
});

//For each keyup pass the master password to background.
$(".extrasafeMasterPassword").keyup(function(){
	chrome.runtime.sendMessage({ masterPassword: $(this).val(), fromInputField: $(this).attr('inputField') });
});
