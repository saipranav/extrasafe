test( 'Hasher.passy("","")', function() {
	var testRuns = 10000;
	var password = Hasher.passy("","");
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("",""), password, "Passed!" );
	}
});

test( 'Hasher.passy("e@1#$fpQc%**(","Extrasafe")', function() {
	changeHasherOptions("", 0, 10);
	equal( Hasher.passy("e@1#$fpQc%**(","Extrasafe"), "4!b486Ae79", "Passed!" );
});

/*test( 'Summa', function() {
	changeHasherOptions("", 0, 15);
	equal( Hasher.passy("Extrasafe1681","1681"), "&3feeeeeff", "Passed!" );
	changeHasherOptions("", 0, 10);
});*/

test( 'Checking with option : Extra Security Sequence', function() {
	var testRuns = 1;
	changeHasherOptions("A#1-@26Z", 0, 10);
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("e@1#$fpQc%**(","Extrasafe"), "Fe!b37cd6c9", "Passed!" );
	}
	changeHasherOptions("", 0, 10);
});

test( 'Checking with option : Start Index', function() {
	var testRuns = 1;
	changeHasherOptions("", 2, 10);
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("Extrasafe","e@1#$fpQc%**("), "8B@1d168", "Passed!" );
	}
	changeHasherOptions("", 0, 10);
});

test( 'Checking with option : End Index', function() {
	var testRuns = 1;
	changeHasherOptions("", 0, 128);
	for(var i=0; i < testRuns; i++){
		equal( Hasher.passy("Extrasafe","e@1#$fpQc%**("), "dbBd61d16Bcd621cb2a17079cf1701de#8b3d6b474efc43467019841301ceedbe0b685140400b6c3aa1b034212a3eb83e162eede758de00b4bc139ce6cc51565", "Extrasafe"+" :: "+"e@1#$fpQc%**(" );
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
	var testRuns = 5000;
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		equal( checkForSpecialChars( Hasher.passy("Extrasafe"+i,""+i) ), true, Hasher.passy("Extrasafe"+i,""+i) );
	}
	changeHasherOptions("", 0, 10);
});

test( 'Check for Upper Case', function() {
	var testRuns = 5000;
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		equal( checkForUpperCase( Hasher.passy("Extrasafe"+i,""+i) ), true, Hasher.passy("Extrasafe"+i,""+i) );
	}
	changeHasherOptions("", 0, 10);
});

test( 'Check for Lower Case', function() {
	var testRuns = 5000;
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		equal( checkForLowerCase( Hasher.passy("Extrasafe"+i,""+i) ), true, Hasher.passy("Extrasafe"+i,""+i) );
	}
	changeHasherOptions("", 0, 10);
});

test( 'Check for Numbers', function() {
	var testRuns = 5000;
	changeHasherOptions("", 0, 15);
	for(var i=0; i < testRuns; i++){
		equal( checkForNumbers( Hasher.passy("Extrasafe"+i,""+i) ), true, Hasher.passy("Extrasafe"+i,""+i) );
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
