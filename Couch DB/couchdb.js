var Couch = {
	result: "",

	updateDB: function(browser, email){
		var xmlhttp;
		if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
		}
		else{// code for IE6, IE5
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function()
		  {
			if (xmlhttp.readyState==4 && xmlhttp.status==201){
			    	Couch.result = "true";
			}
			else{
				Couch.result = "false";
			}
		  }
		xmlhttp.open("PUT","https://extrasafe.couchappy.com/beta_invites/"+browser+"-"+email,false);
		xmlhttp.setRequestHeader("Authorization","Basic YWRtaW46ZXh0cmFzYWZlbW9uaXRvckBjb3VjaGFwcHk=");
		xmlhttp.send("{\"browser\": \""+browser+"\", \"email\": \""+email+"\"}");
	}

}
