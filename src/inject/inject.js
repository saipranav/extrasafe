var inputFields = new Array();

//Jquery function to insert master password fields in the web page (DOM modifications).
//It sees for the input type password and inserts the new text box (master password) before.
//On hover of password fields it shows the password fields on 2 second gap.
$("input[type='password']").each(function(){
	$(this).before('<input type="password" id="master_password" placeholder="Master Password"></input>');
	inputFields.push($(this));
	$(this).mouseenter(function(){
		inputFields[inputFields.length-1].prop('type','text');
	});
	$(this).mouseleave(function(){
		inputFields[inputFields.length-1].prop('type','password');
	});
});

//show master password on hover
$("input#master_password").mouseenter(function(){
	$(this).prop('type','text');
});
$("input#master_password").mouseleave(function(){
	$(this).prop('type','password');
});

//Single message handler function to handle messages from content scripts.
//Note: message.result is the only field in all messages.
chrome.runtime.onMessage.addListener(function(message){
	//To rerun the DOM modifications.
	if(message.result == "rerun input script"){
		if(!$("#master_password").length){
			$("input[type='password']").each(function(){
				$(this).before('<input type="password" id="master_password" placeholder="Master Password"></input>');
			});
		}
	}
	//This is the password. Set in the password field.
	else{
		$("input[type='password']:not('#master_password')").each(function(){
			$(this).val(message.result);
		});
	}
});

//For each keyup pass the master password to background.
$("#master_password").keyup(function(){
	chrome.runtime.sendMessage({ masterPassword: $("#master_password").val() });
});
