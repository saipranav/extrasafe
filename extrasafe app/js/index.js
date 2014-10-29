var store = window.localStorage;

var app = {
	initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        console.log("device ready!");
        if(store.getItem("extraSecuritySequence") == null){
        	store.setItem("extraSecuritySequence", "");
        }
        if(store.getItem("startIndex") == null){
        	store.setItem("startIndex", 0);
        }
        if(store.getItem("endIndex") == null){
        	store.setItem("endIndex", 12);
        }
        if(store.getItem("sites") == null){
        	store.setItem("sites", JSON.stringify(['google', 'facebook']));
        }
        $("#extra-security-sequence").val(store.getItem("extraSecuritySequence"));
		$("#start-index").val(store.getItem("startIndex"));
		$("#end-index").val(store.getItem("endIndex"));
    }
};

$("#options-page").hide();
$("#about-page").hide();

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substrRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });
 
    cb(matches);
  };
};

$('#site-name').typeahead({
  hint: true,
  highlight: true,
  minLength: 2
},
{
  name: 'sites',
  displayKey: 'value',
  source: substringMatcher(JSON.parse(store.getItem("sites")))
}
);

$("#site-password").click(function(){
	$("#site-password").select();
});

$("#options-button").click(function(){
	$("#home-page").hide();
	$("#about-page").hide();
	$("#options-page").show();
});

$("#about-button").click(function(){
	$("#home-page").hide();
	$("#options-page").hide();
	$("#about-page").show();
});

$(".back-button").click(function(){
	$("#options-page").hide();
	$("#about-page").hide();
	$("#home-page").show();
});

$("#start-index").focusout(function(){
	if($("#start-index").val() > 115 || $("#start-index").val() < 0){
		$("#start-index").parent().addClass("has-error");
		$("#start-index").siblings(".error").show();
		$("#start-index").keyup(function(){
			$("#start-index").parent().removeClass("has-error");
			$("#start-index").siblings(".error").hide();
		});
	}
});

$("#end-index").focusout(function(){
	if($("#end-index").val() > 128 || $("#end-index").val() < 12){
		$("#end-index").parent().addClass("has-error");
		$("#end-index").siblings(".error").show();
		$("#end-index").keyup(function(){
			$("#end-index").parent().removeClass("has-error");
			$("#end-index").siblings(".error").hide();
		});
	}
});

$("#about-button").click(function(){
	$("#home-page").hide();
	$("#options-page").hide();
	$("#about-page").show();
});

$("#generate-button").click(function(){

	var goAhead = false;
	//get all required parameters
	var masterPassword = $("#master-password").val();
	var siteName = $("#site-name").val();

	//check master password
	if(masterPassword == ""){
		$("#master-password").parent().addClass("has-error");
		$("#master-password").siblings(".error").show();
		$("#master-password").keyup(function(){
			$("#master-password").parent().removeClass("has-error");
			$("#master-password").siblings(".error").hide();
		});
		$("#master-password").focus();
	}
	else{
		$("#master-password").parent().removeClass("has-error");
		goAhead = true;
	}

	if(goAhead){
		//check site name
		if(siteName == ""){
			$("#site-name").parent().addClass("has-error");
			$("#site-name").siblings(".error").show();
			$("#site-name").keyup(function(){
				$("#site-name").parent().removeClass("has-error");
				$("#site-name").siblings(".error").hide();
			});
			$("#site-name").focus();
			goAhead = false;
		}
		else{
			$("#site-name").parent().removeClass("has-error");
			goAhead = true;
		}
	}

	var extraSequence = store.getItem("extraSecuritySequence");
	var startIndex = store.getItem("startIndex");
	var endIndex = store.getItem("endIndex");			

	if(goAhead){
		Hasher.start = startIndex;
		Hasher.end = endIndex;
		Hasher.extraSecuritySequence = extraSequence;
		$("#site-password").val( Hasher.passy($("#master-password").val(), $("#site-name").val()) );
		$("#tooltip").html("Your site password is generated, please copy it from the Site Password box").fadeIn();
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},2000);
		var sites = JSON.parse(store.getItem("sites"));
		if($.inArray($("#site-name").val(),sites) == -1){
			sites.push($("#site-name").val());
		}
		store.setItem("sites", JSON.stringify(sites));
		return;
	}
	else{
		$("#site-password").val("");
	}

});

$("#save-button").click(function(){
	var extraSequence = $("#extra-security-sequence").val();
	var startIndex = parseInt($("#start-index").val());
	var endIndex = parseInt($("#end-index").val());
	if( (startIndex<0) || (endIndex>128) || (startIndex>=endIndex) || (startIndex>115) || (endIndex<12) || ((endIndex-startIndex)<12) ){
		$("#tooltip").html("Failed to save your options, please rectify the errors in red input boxes").fadeIn();
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},2000);
		return;
	}
	if( (isNaN(startIndex)) || (isNaN(endIndex))  ){
		$("#tooltip").html("Failed to save your options, please enter your options").fadeIn();
		setTimeout(function(){
			$("#tooltip").fadeOut();
		},2000);
		return;
	}

	store.setItem("extraSecuritySequence", extraSequence);
	store.setItem("startIndex", startIndex);
	store.setItem("endIndex", endIndex);

	$("#tooltip").html("All your options are saved").fadeIn();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2000);
});

$("#cancel-button").click(function(){
	var extraSequence = store.getItem("extraSecuritySequence");
	var startIndex = store.getItem("startIndex");
	var endIndex = store.getItem("endIndex");
	$("#extra-security-sequence").val(extraSequence);
	$("#start-index").val(startIndex);
	$("#end-index").val(endIndex);
	$("#tooltip").html("Your operations are canceled").fadeIn();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2000);
});

$("#reset-button").click(function(){
	var extraSequence = "";
	var startIndex = 0;
	var endIndex = 12;
	store.setItem("extraSecuritySequence", extraSequence);
	store.setItem("startIndex", startIndex);
	store.setItem("endIndex", endIndex);
	$("#extra-security-sequence").val(extraSequence);
	$("#start-index").val(startIndex);
	$("#end-index").val(endIndex);
	$("#tooltip").html("All your options are reset to default").fadeIn();
	setTimeout(function(){
		$("#tooltip").fadeOut();
	},2500);
});

$("#show-password").click(function(){
	var type = ( $("#master-password").attr("type") == "text" ) ? "password" : "text";
	$("#master-password").attr("type",type);
});
