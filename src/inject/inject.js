var noInputFields = 0;

//Jquery function to insert master password fields in the web page (DOM modifications).
//It sees for the input type password and inserts the new text box (master password) before.
//On hover of password fields it shows the password fields on 2 second gap.
$("input[type='password']").each(function(){
	noInputFields++;
	var passwordPosition = $(this).position();
	var passwordHeight = $(this).height();
	var passwordWidth = $(this).outerWidth();
	window.alert(passwordWidth+" "+passwordHeight);
	var masterPasswordDiv = $('<div class="masterPasswordDiv" style="top:'+passwordPosition.top+'px; left:'+passwordPosition.left+'px; height:'+passwordHeight+'px; width:'+passwordWidth+'px" ></div>');
	var close = $('<div class="close"></div>');
	masterPasswordDiv.append($('<input type="password" class="masterPassword" id="master_password" inputField="'+noInputFields+'" placeholder="Master Password"></input>'));
	masterPasswordDiv.append(close);
	$(document.body).append(masterPasswordDiv);
	$(this).addClass(""+noInputFields);
});

//Single message handler function to handle messages from content scripts.
//Note: message.result is the only field in all messages.
chrome.runtime.onMessage.addListener(function(message){
	//To rerun the DOM modifications.
	if(message.result == "rerun input script"){
		if(!$(".masterPassword").length){
			$("input[type='password']").each(function(){
				noInputFields++;
				$(this).before('<input type="password" class="masterPassword" id="master_password'+noInputFields+'" placeholder="Master Password"></input>');
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
$(".masterPassword").keyup(function(){
	chrome.runtime.sendMessage({ masterPassword: $(".master_password").val(), fromInputField: $(this).attr('inputField') });
});
