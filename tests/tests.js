/*test( 'Summa', function() {
	changeHasherOptions("", 0, 15);
	equal( Hasher.passy("Extrasafe52496","52496"), "&3feeeeeff", "Passed!" );
	changeHasherOptions("", 0, 10);
});*/

test( 'Consistency check for master password - "", site name - ""', function() {
	var testRuns = 100000;
	var password = Hasher.passy("","");
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("",""), password, "Passed!" );
	}
});

test( 'Consistency check for master password - "e@1#$fpQc%**(", site name - "Extrasafe"', function() {
	var testRuns = 100000;
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("e@1#$fpQc%**(","Extrasafe"), "4664*6CcedDCced", "Passed!" );
	}
});

test( 'Consistency check with option : Extra Security Sequence - "A#1-@26Z"', function() {
	var testRuns = 100000;
	changeHasherOptions("A#1-@26Z", 0, 15);
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("e@1#$fpQc%**(","Extrasafe"), "eCA37cd)c9b7cbd", "Passed!" );
	}
});

test( 'Consistency check with option : Start Index - "2"', function() {
	var testRuns = 100000;
	changeHasherOptions("", 2, 15);
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("Extrasafe","e@1#$fpQc%**("), "8C@1B168cd621", "Passed!" );
	}
});

test( 'Consistency check with option : End Index - "128"', function() {
	var testRuns = 100000;
	changeHasherOptions("", 0, 128);
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("Extrasafe","e@1#$fpQc%**("), "db8B61d168Bd621cb2a17079cf1701de3#b3d6b474efc43467019841301ceedbe0b685140400b6c3aa1b034212a3eb83e162eede758de00b4bc139ce6cc51565", "Extrasafe"+" :: "+"e@1#$fpQc%**(" );
	}
});

test( 'Consistency check for Special Characters, Upper Case, Lower Case, Numbers', function() {
	var testRuns = 100000;
	var result;
	//equal( checkFor_SpecialChars_UpperCase_LowerCase_Numbers( Hasher.passy("e@1#$fpQc%**(","Extrasafe") ), true, Hasher.passy("e@1#$fpQc%**(","Extrasafe")+"" );
	for(var i=0; i < testRuns; i++){
		result = Hasher.passy(""+i,""+i);
		equal( checkFor_SpecialChars_UpperCase_LowerCase_Numbers( result ), true, result );
	}
});

test( 'Consistency check for Special Characters', function() {
	var testRuns = 100000;
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		var result = Hasher.passy("Extrasafe"+i,""+i);
		equal( checkForSpecialChars( result ), true, result );
	}
});

test( 'Consistency check for Upper Case', function() {
	var testRuns = 100000;
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		var result = Hasher.passy("Extrasafe"+i,""+i);
		equal( checkForUpperCase( result ), true, result );
	}
});

test( 'Consistency check for Lower Case', function() {
	var testRuns = 100000
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		var result = Hasher.passy("Extrasafe"+i,""+i);
		equal( checkForLowerCase( result ), true, result );
	}
});

test( 'Consistency check for Numbers', function() {
	var testRuns = 100000;
	var result = "";
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		result = Hasher.passy("Extrasafe"+i,""+i);
		equal( checkForNumbers( result ), true, result );
	}
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
	return /\W/g.test(password);
}

var checkForUpperCase = function(password){
	return /[A-Z]/g.test(password);
}

var checkForLowerCase = function(password){
	return /[a-z]/g.test(password);
}

var checkForNumbers = function(password){
 	return /[0-9]/g.test(password);
}

function changeHasherOptions(extraSequence, startIndex, endIndex){
	Hasher.extraSecuritySequence = extraSequence;
	Hasher.start = startIndex;
	Hasher.end = endIndex;
}
