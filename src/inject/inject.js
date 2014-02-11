var noInputFields = 0;

//Jquery function to insert master password fields in the web page (DOM modifications).
//It sees for the input type password and inserts the new text box (master password) before.
$("input[type='password']").each(function(){
	noInputFields++;

	var passwordPosition = $(this).offset();
	var passwordHeight = $(this).outerHeight(true);
	/*var passwordWidth = $(this).innerWidth();*/
	
	/*var masterPasswordDiv = $('<div class="extrasafeMasterPasswordDiv" style="top:'+passwordPosition.top+'px; left:'+passwordPosition.left+'px; height:'+passwordHeight+'px; width:'+passwordWidth+'px" ></div>');
	var masterPasswordField = $(this).clone(false);
	masterPasswordField.addClass("extrasafeMasterPassword");
	masterPasswordField.attr("id","master_password");
	masterPasswordField.attr("inputField",""+noInputFields);
	masterPasswordField.attr("placeholder","Master Password");
	//var masterPasswordField = $('<input type="password" class="extrasafeMasterPassword" id="master_password" inputField="'+noInputFields+'" placeholder="Master Password"></input>');
	masterPasswordDiv.append(masterPasswordField);

	var close = $('<div class="extrasafeClose"></div>');
	close.click(function(){
		masterPasswordDiv.hide();
	});
	masterPasswordDiv.append(close);

	$(document.body).append(masterPasswordDiv);

	var openPosition = close.offset();
	var openHeight = close.innerHeight();
	var openWidth = close.innerWidth();

	var open = $('<div class="extrasafeOpen" inputField="'+$(this).closest("#master_password").attr('inputField')+'" style="top:'+openPosition.top+'px; left:'+openPosition.left+'px; height:'+openHeight+'px; width:'+openWidth+'px" ></div>');
	open.click(function(){
		masterPasswordDiv.show();
	});
	$(document.body).append(open);*/

	var masterPasswordDiv = $('<div class=extrasafeMasterPasswordDiv style="top:'+(passwordPosition.top+passwordHeight)+'px; left:'+passwordPosition.left+'px ">');
	var masterPasswordField = $('<input type="password" class="extrasafeMasterPassword" id="master_password" inputField="'+noInputFields+'" placeholder="Master Password" ></input>');

	masterPasswordField.focusout(function(){
		masterPasswordDiv.hide();
	});
	$(this).focus(function(){
		masterPasswordDiv.show();
		masterPasswordField.focus();
	});

	masterPasswordDiv.append(masterPasswordField);
	masterPasswordDiv.hide();

	$(document.body).append(masterPasswordDiv);

	$(this).addClass(""+noInputFields);
});


//Single message handler function to handle messages from content scripts.
//Note: message.result is the only field in all messages.
chrome.runtime.onMessage.addListener(function(message){
	//To rerun the DOM modifications.
	if(message.result == "rerun input script"){
		if(!$(".extrasafeMasterPassword").length){
			$("input[type='password']").each(function(){
				noInputFields++;
				$(this).before('<input type="password" class="extrasafeMasterPassword" id="master_password'+noInputFields+'" placeholder="Master Password"></input>');
				$(this).addClass(""+noInputFields);
			});
		}
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
