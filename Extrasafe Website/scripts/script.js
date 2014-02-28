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
		$(this).children("p").css("opacity","1.0");	
	}
	,
	function(){
		$(this).children("p").css("opacity","0.5");
	}
);