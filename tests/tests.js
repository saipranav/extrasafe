test( 'Hasher.passy("","")', function() {
	var testRuns = 10;
	var password = Hasher.passy("","");
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("",""), password, "Passed!" );
	}
});

test( 'Hasher.passy("e@1#$fpQc%**(","Extrasafe")', function() {
	equal( Hasher.passy("e@1#$fpQc%**(","Extrasafe"), "4664#63E79", "Passed!" );
});

test( 'Checking with option : Extra Security Sequence', function() {
	var testRuns = 100;
	changeHasherOptions("A#1-@26Z", 0, 10);
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("e@1#$fpQc%**(","Extrasafe"), "ebb37Cd#c9", "Passed!" );
	}
	changeHasherOptions("", 0, 10);
});

test( 'Checking with option : Start Index', function() {
	var testRuns = 10;
	changeHasherOptions("", 2, 10);
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("Extrasafe","e@1#$fpQc%**("), "8d61D*68", "Passed!" );
	}
	changeHasherOptions("", 0, 10);
});

test( 'Checking with option : End Index', function() {
	var testRuns = 10;
	changeHasherOptions("", 0, 128);
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("Extrasafe","e@1#$fpQc%**("), "db8d61d168cd621cb2a17079cf1701de38b3d6b474efc43467019841301ceedbE@b685140400b6c3aa1b034212a3eb83e162eede758de00b4bc139ce6cc51565", "Passed!" );
	}
	changeHasherOptions("", 0, 10);
});

/*test( 'Check for Special Characters, Upper Case, Lower Case, Numbers', function() {
	var testRuns = 0;
	//equal( checkFor_SpecialChars_UpperCase_LowerCase_Numbers( Hasher.passy("e@1#$fpQc%**(","Extrasafe") ), true, Hasher.passy("e@1#$fpQc%**(","Extrasafe")+"" );
	for(var i=0; i < testRuns; i++){
		equal( checkFor_SpecialChars_UpperCase_LowerCase_Numbers( Hasher.passy("Extrasafe"+i,""+i) ), true, "Passed!" );
	}
});*/

test( 'Check for Special Characters', function() {
	var testRuns = 1;
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		equal( checkForSpecialChars( Hasher.passy("Extrasafe"+i,""+i) ), true, "Passed!" );
	}
	changeHasherOptions("", 0, 10);
});

test( 'Check for Upper Case', function() {
	var testRuns = 1;
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		equal( checkForUpperCase( Hasher.passy("Extrasafe"+i,""+i) ), true, "Passed!" );
	}
	changeHasherOptions("", 0, 10);
});

test( 'Check for Lower Case', function() {
	var testRuns = 20000;
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		equal( checkForLowerCase( Hasher.passy("Extrasafe"+i,""+i) ), true, "Passed!" );
	}
	changeHasherOptions("", 0, 10);
});

test( 'Check for Numbers', function() {
	var testRuns = 20000;
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		equal( checkForNumbers( Hasher.passy("Extrasafe"+i,""+i) ), true, "Passed!" );
	}
	changeHasherOptions("", 0, 10);
});

var checkFor_SpecialChars_UpperCase_LowerCase_Numbers = function(password){
	if( (checkForSpecialChars(password) == true) && (checkForUpperCase(password) == true) && (checkForLowerCase(password) == true) && (checkForNumbers(password) == true)){
		return true;
	}
	else{
		return false;
	}
}

var checkForSpecialChars = function(password){
 	var pattern = /\W/g;
	var result = password.match(pattern);
	if(result != null){
		return true;
	}
	return false;
}

var checkForUpperCase = function(password){
 	var pattern = /[A-Z]/g;
	var result = password.match(pattern);
	if(result != null){
		return true;
	}
	return false;
}

var checkForLowerCase = function(password){
 	var pattern = /[a-z]/g;
	var result = password.match(pattern);
	if(result != null){
		return true;
	}
	return false;
}

var checkForNumbers = function(password){
 	var pattern = /[0-9]/g;
	var result = password.match(pattern);
	if(result != null){
		return true;
	}
	return false;
}

function changeHasherOptions(extraSequence, startIndex, endIndex){
	Hasher.extraSecuritySequence = extraSequence;
	Hasher.start = startIndex;
	Hasher.end = endIndex;
}
