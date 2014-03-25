$("#MasterPassword").hide();
$("#Amazon").hide();
$("#Apple").hide();
$("#Evernote").hide();
$("#Facebook").hide();
$("#Google").hide();
$("#Instagram").hide();
$("#Linkedin").hide();
$("#Pinterest").hide();
$("#Twitter").hide();
$("#Wordpress").hide();
$("#Yahoo").hide();
$("#inProgress").hide();
$(".usePoint>p").hide();

$("#container").hover(function(){
	$("#MasterPassword").show();
}, function(){
	$("#MasterPassword").hide();
});

$("#container").mousemove(function(e){
	$("#MasterPassword").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#amazonIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Amazon").show();
}, function(){
	$("#Amazon").hide();
	$("#MasterPassword").show();
});

$("#amazonIcon").mousemove(function(e){
	$("#Amazon").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#appleIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Apple").show();
}, function(){
	$("#Apple").hide();
	$("#MasterPassword").show();
});

$("#appleIcon").mousemove(function(e){
	$("#Apple").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#evernoteIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Evernote").show();
}, function(){
	$("#Evernote").hide();
	$("#MasterPassword").show();
});

$("#evernoteIcon").mousemove(function(e){
	$("#Evernote").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#facebookIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Facebook").show();
}, function(){
	$("#Facebook").hide();
	$("#MasterPassword").show();
});

$("#facebookIcon").mousemove(function(e){
	$("#Facebook").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#googleIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Google").show();
}, function(){
	$("#Google").hide();
	$("#MasterPassword").show();
});

$("#googleIcon").mousemove(function(e){
	$("#Google").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#instagramIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Instagram").show();
}, function(){
	$("#Instagram").hide();
	$("#MasterPassword").show();
});

$("#instagramIcon").mousemove(function(e){
	$("#Instagram").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#linkedinIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Linkedin").show();
}, function(){
	$("#Linkedin").hide();
	$("#MasterPassword").show();
});

$("#linkedinIcon").mousemove(function(e){
	$("#Linkedin").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#pinterestIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Pinterest").show();
}, function(){
	$("#Pinterest").hide();
	$("#MasterPassword").show();
});

$("#pinterestIcon").mousemove(function(e){
	$("#Pinterest").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#twitterIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Twitter").show();
}, function(){
	$("#Twitter").hide();
	$("#MasterPassword").show();
});

$("#twitterIcon").mousemove(function(e){
	$("#Twitter").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#wordpressIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Wordpress").show();
}, function(){
	$("#Wordpress").hide();
	$("#MasterPassword").show();
});

$("#wordpressIcon").mousemove(function(e){
	$("#Wordpress").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$("#yahooIcon").hover(function(){
	$("#MasterPassword").hide();
	$("#Yahoo").show();
}, function(){
	$("#Yahoo").hide();
	$("#MasterPassword").show();
});

$("#yahooIcon").mousemove(function(e){
	$("#Yahoo").css({ left:e.pageX+5 , top:e.pageY+10 });
});

$(".usePoint").hover(
	function(){
		$(this).children("p").show(500);	
	}
	,
	function(){
		$(this).children("p").hide(1000);
	}
);

$("#firefox").click(function(){
	$("#inProgress>#invite").off("click");
	$("#inProgress").show();
	$("#inProgress>span>#thisBrowser").html("Firefox");
	$("#inProgress>#invite").click(function(){
		Couch.updateDB("firefox",$("#inProgress>#email").val());
		setTimeout(function(){
			if(Couch.result == "true"){
				$("#inProgress>#invite").val("Thank You");
				$("#inProgress>#invite").css("background", "#008000");
			}
			else{
				$("#inProgress>#invite").val("You are already in the list");
				$("#inProgress>#invite").css("background", "#FF8C00");
				$("#inProgress>#invite").css("color", "#151515");
			}
		}, 1000);
	});
	try{
		ga('send', 'event', 'button', 'click', 'firefox');
	}
	catch(e){
		console.log("google analytics not installed properly");
	}
});

$("#chrome").click(function(){
	$("#inProgress>#invite").off("click");
	$("#inProgress").hide();
	try{
		ga('send', 'event', 'button', 'click', 'chrome');
	}
	catch(e){
		console.log("google analytics not installed properly");
	}
});

$("#internetExplorer").click(function(){
	$("#inProgress>#invite").off("click");
	$("#inProgress").show();
	$("#inProgress>span>#thisBrowser").html("IE");
	$("#inProgress>#invite").click(function(){
		Couch.updateDB("internetExplorer",$("#inProgress>#email").val());
		setTimeout(function(){
			if(Couch.result == "true"){
				$("#inProgress>#invite").val("Thank You");
				$("#inProgress>#invite").css("background", "#008000");
			}
			else{
				$("#inProgress>#invite").val("You are already in the list");
				$("#inProgress>#invite").css("background", "#FF8C00");
				$("#inProgress>#invite").css("color", "#151515");
			}
		}, 1000);
	});
	try{
		ga('send', 'event', 'button', 'click', 'internet explorer');
	}
	catch(e){
		console.log("google analytics not installed properly");
	}
});

$("#safari").click(function(){
	$("#inProgress>#invite").off("click");
	$("#inProgress").show();
	$("#inProgress>span>#thisBrowser").html("Safari");
	$("#inProgress>#invite").click(function(){
		Couch.updateDB("safari",$("#inProgress>#email").val());
		setTimeout(function(){
			if(Couch.result == "true"){
				$("#inProgress>#invite").val("Thank You");
				$("#inProgress>#invite").css("background", "#008000");
			}
			else{
				$("#inProgress>#invite").val("You are already in the list");
				$("#inProgress>#invite").css("background", "#FF8C00");
				$("#inProgress>#invite").css("color", "#151515");
			}
		}, 1000);
	});
	try{
		ga('send', 'event', 'button', 'click', 'safari');
	}
	catch(e){
		console.log("google analytics not installed properly");
	}
});

$("#opera").click(function(){
	$("#inProgress>#invite").off("click");
	$("#inProgress").show();
	$("#inProgress>span>#thisBrowser").html("Opera");
	$("#inProgress>#invite").click(function(){
		Couch.updateDB("opera",$("#inProgress>#email").val());
		setTimeout(function(){
			if(Couch.result == "true"){
				$("#inProgress>#invite").val("Thank You");
				$("#inProgress>#invite").css("background", "#008000");
			}
			else{
				$("#inProgress>#invite").val("You are already in the list");
				$("#inProgress>#invite").css("background", "#FF8C00");
				$("#inProgress>#invite").css("color", "#151515");
			}
		}, 1000);
	});
	try{
		ga('send', 'event', 'button', 'click', 'opera');
	}
	catch(e){
		console.log("google analytics not installed properly");
	}
});

$("#playStore").click(function(){
	$("#inProgress>#invite").off("click");
	$("#inProgress").show();
	$("#inProgress>span>#thisBrowser").html("Android Phones");
	$("#inProgress>#invite").click(function(){
		Couch.updateDB("playStore",$("#inProgress>#email").val());
		setTimeout(function(){
			if(Couch.result == "true"){
				$("#inProgress>#invite").val("Thank You");
				$("#inProgress>#invite").css("background", "#008000");
			}
			else{
				$("#inProgress>#invite").val("You are already in the list");
				$("#inProgress>#invite").css("background", "#FF8C00");
				$("#inProgress>#invite").css("color", "#151515");
			}
		}, 1000);
	});
	try{
		ga('send', 'event', 'button', 'click', 'play store');
	}
	catch(e){
		console.log("google analytics not installed properly");
	}
});

$("#appleStore").click(function(){
	$("#inProgress>#invite").off("click");
	$("#inProgress").show();
	$("#inProgress>span>#thisBrowser").html("Apple Phones");
	$("#inProgress>#invite").click(function(){
		Couch.updateDB("appleStore",$("#inProgress>#email").val());
		setTimeout(function(){
			if(Couch.result == "true"){
				$("#inProgress>#invite").val("Thank You");
				$("#inProgress>#invite").css("background", "#008000");
			}
			else{
				$("#inProgress>#invite").val("You are already in the list");
				$("#inProgress>#invite").css("background", "#FF8C00");
				$("#inProgress>#invite").css("color", "#151515");
			}
		}, 1000);
	});
	try{
		ga('send', 'event', 'button', 'click', 'apple store');
	}
	catch(e){
		console.log("google analytics not installed properly");
	}
});

$("#portable").click(function(){
	try{
		ga('send', 'event', 'button', 'click', 'portable');
	}
	catch(e){
		console.log("google analytics not installed properly");
	}
});



$("#homeButton").click(function(){$("body").scrollTop( $("#home").offset().top );});
$("#knowMoreButton").click(function(){$("body").scrollTop( $("#knowMore").offset().top-100  );});
$("#installButton").click(function(){$("body").scrollTop( $("#install").offset().top-100  );});
$("#aboutButton").click(function(){$("body").scrollTop( $("#about").offset().top-100  );});
