test( 'Hasher.passy("","")', function() {
	var testRuns = 100000;
	var password = Hasher.passy("","");
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("",""), password, "Passed!" );
	}
});

test( 'Hasher.passy("Extrasafe","liveweave")', function() {
	equal( Hasher.passy("Extrasafe","liveweave"), "d163#A674a", "Passed!" );
});

test( 'Check for Special Characters and Upper Case', function() {
	var testRuns = 100000;
	for(var i=0; i < testRuns; i++){
		equal( checkForSpecialCharAndUpperCase( Hasher.passy("Extrasafe"+i,""+i) ), true, "Passed!" );
	}
	
});

var checkForSpecialCharAndUpperCase = function(password){
	if( (checkForSpecialChars(password) != null) && (checkForUpperCase(password) != null)){
		return true;
	}
	else{
		return false;
	}
}

var checkForSpecialChars = function(password){
 	var pattern = /\W/g;
	var result = password.match(pattern);
	return result;
}

var checkForUpperCase = function(password){
 	var pattern = /[A-Z]/g;
	var result = password.match(pattern);
	return result;
}
