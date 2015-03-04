/*******************************************************************************************
Just Remember one Master Password text, Extrasafe takes care of the rest ;)
Extrasafe (C) 2014-2015  The Extra Labs
GNU General Public License v3
http://theextralabs.com
********************************************************************************************/
Hasher = {

	masterPassword: "", //input master password
	siteTag: "", //site name
	extraSecuritySequence: "", // extra string to be added with master password
	password: "", //output password
	start: 0, //start for triming
	end: 12, //end for triming
	specialCharacters : new Array("@","!","&","*","#","(",")","/"),
	capitalCharacters : new Array("A","B","C","D","E","F","G","H"),
	smallCharacters : new Array("a","b","c","d","e","f","g","h"),
	numbers : new Array("0","1","2","3","4","5","6","7","8","9"),
	specialCharactersPos : new Array(),
	numberPos : new Array(),
	smallCharactersPos : new Array(),
	capitalCharactersPos : new Array(),
	injectedChars: new Array(),
	iterator : 0,
	
	//Call the crypto graphic algorithm.
	hashy: function(){	
			Hasher.password = CryptoJS.SHA3( Hasher.siteTag + Hasher.masterPassword + Hasher.extraSecuritySequence).toString();
			},

	//It will be called after the Crypto returns.
	modify: function(){
				Hasher.password = Hasher.password.slice(Hasher.start, Hasher.end);
				Hasher.extrasafeModification();
			},
	
	//Extrasafe modification
	extrasafeModification: function(){
					Hasher.fillCountCharacters();
					Hasher.checker();
					Hasher.finalTrim();
					Hasher.iterator = 0;
				},

	checker: function(){
					//all small characters

					//Inside if structure:
					// derive replace index (password) from position array and charAt (denotes instance of injection) (should be within password length)
					// replaces the password at replaceIndex, with character taken from predefined array (take the password character at position (take from position array ) convert to integer value) (fold the integer with predefined array length so that it stays within predefined array)
					// add replaceIndex in deficit position array
					// remove replaceIndex from surplus position array
					// add replaceIndex in injectedChars so that its not replaced again with another injected character
					if(/^[a-z]*$/.test(Hasher.password) == true || Hasher.numberPos.length < 4){

						var replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.numbers[((Hasher.password[Hasher.smallCharactersPos[0]]).charCodeAt(0))%(Hasher.numbers.length-1)]);
						Hasher.numberPos.push(replaceIndex);
						Hasher.smallCharactersPos.splice(Hasher.smallCharactersPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 1);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.numbers[((Hasher.password[Hasher.smallCharactersPos[1]]).charCodeAt(0))%(Hasher.numbers.length-1)]);
						Hasher.numberPos.push(replaceIndex);
						Hasher.smallCharactersPos.splice(Hasher.smallCharactersPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 2);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.numbers[((Hasher.password[Hasher.smallCharactersPos[2]]).charCodeAt(0))%(Hasher.numbers.length-1)]);
						Hasher.numberPos.push(replaceIndex);
						Hasher.smallCharactersPos.splice(Hasher.smallCharactersPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);
					}
					//all numbers
					if(/^[0-9]*$/.test(Hasher.password) == true || Hasher.smallCharactersPos.length < 4){

						var replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.smallCharacters[((Hasher.password[Hasher.numberPos[0]]).charCodeAt(0))%(Hasher.smallCharacters.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
						Hasher.numberPos.splice(Hasher.numberPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 1);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.smallCharacters[((Hasher.password[Hasher.numberPos[1]]).charCodeAt(0))%(Hasher.smallCharacters.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
						Hasher.numberPos.splice(Hasher.numberPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 2);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.smallCharacters[((Hasher.password[Hasher.numberPos[2]]).charCodeAt(0))%(Hasher.smallCharacters.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
						Hasher.numberPos.splice(Hasher.numberPos.indexOf(replaceIndex), 1);
						Hasher.injectedChars.push(replaceIndex);
					}
					//capital characters not found
					if(/^([a-z]|(@|!|&|#|\*)|[0-9])*$/.test(Hasher.password) == true){
						var replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.capitalCharacters[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1]]).charCodeAt(0))%(Hasher.capitalCharacters.length-1)]);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 1);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.capitalCharacters[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-2]]).charCodeAt(0))%(Hasher.capitalCharacters.length-1)]);
						Hasher.injectedChars.push(replaceIndex);
					}
					//special characters not found
					if(/^([a-z]|[A-Z]|[0-9])*$/.test(Hasher.password) == true){
						var replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.specialCharacters[((Hasher.password[Hasher.numberPos[Hasher.numberPos.length-1]]).charCodeAt(0))%(Hasher.specialCharacters.length-1)]);
						Hasher.injectedChars.push(replaceIndex);
					}
				},

	//takes the passwords char code (int) at charAt, fold it to the size of array/2, to make sure index stays inside the password (because array elements are subset of password indexes)
	//it takes care of injected characters not being replaced
	//it might some times give undefined which makes the password grow by repeating chars at replaceAt function, but finalTrim takes care of this issue
	getReplaceIndex: function(array, charAt){
					var index = array[(Hasher.password.charCodeAt(charAt))%(Math.ceil(array.length/2))];
					if(Hasher.injectedChars.indexOf(index) != -1){
						index = undefined;
					}
					return index;
				},	
	
	//function to reduce the size of passwords if required
	finalTrim: function(){
					if(Hasher.password.length > (Hasher.end - Hasher.start)){
						Hasher.fillCountCharacters();
						//check whether numbers are more in number
						if( (Hasher.numberPos.length > 4 ) && (Hasher.numberPos.length > Hasher.smallCharactersPos.length || Hasher.numberPos.length > Hasher.capitalCharactersPos.length || Hasher.numberPos.length > Hasher.specialCharactersPos.length) ){
							//reduce the numbers but minimum of 4
							while(Hasher.password.length > (Hasher.end - Hasher.start) && Hasher.numberPos.length > 4){
								Hasher.password = Hasher.password.substr(0, Hasher.numberPos[Hasher.numberPos.length-1])+Hasher.password.substr((Hasher.numberPos[Hasher.numberPos.length-1])+1, Hasher.password.length);
								Hasher.numberPos.splice(-1,1);
							}
							Hasher.iterator++;
							//check to trim more for 4 times max then forcefully come out
							if(Hasher.iterator < 4){
								Hasher.finalTrim();
							}
						}
						//check whether small chars are more in number
						else if( (Hasher.smallCharactersPos.length > 4) && (Hasher.smallCharactersPos.length > Hasher.numberPos.length || Hasher.smallCharactersPos.length > Hasher.capitalCharactersPos.length || Hasher.smallCharactersPos.length > Hasher.specialCharactersPos.length) ){
							//reduce the small chars but minimum of 4
							while(Hasher.password.length > (Hasher.end - Hasher.start) && Hasher.smallCharactersPos.length > 4){
								Hasher.password = Hasher.password.substr(0, Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1])+Hasher.password.substr((Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1])+1, Hasher.password.length);
								Hasher.smallCharactersPos.splice(-1,1);
							}
							Hasher.iterator++;
							//check to trim more for 4 times max then forcefully come out
							if(Hasher.iterator < 4){
								Hasher.finalTrim();
							}
						}
						//check whether caps are more in number
						else if( (Hasher.capitalCharactersPos.length > 2) && (Hasher.capitalCharactersPos.length > Hasher.numberPos.length || Hasher.capitalCharactersPos.length > Hasher.smallCharactersPos.length || Hasher.capitalCharactersPos.length > Hasher.specialCharactersPos.length) ){
							//reduce the caps chars but minimum of 2
							while(Hasher.password.length > (Hasher.end - Hasher.start) && Hasher.capitalCharactersPos.length > 2){
								Hasher.password = Hasher.password.substr(0, Hasher.capitalCharactersPos[Hasher.capitalCharactersPos.length-1])+Hasher.password.substr((Hasher.capitalCharactersPos[Hasher.capitalCharactersPos.length-1])+1, Hasher.password.length);
								Hasher.capitalCharactersPos.splice(-1,1);
							}
							Hasher.iterator++;
							//check to trim more for 4 times max then forcefully come out
							if(Hasher.iterator < 4){
								Hasher.finalTrim();
							}
						}
						//check whether special chars are more in number
						else if( (Hasher.specialCharactersPos.length > 1) && (Hasher.specialCharactersPos.length > Hasher.numberPos.length || Hasher.specialCharactersPos.length > Hasher.smallCharactersPos.length || Hasher.specialCharactersPos.length > Hasher.capitalCharactersPos.length) ){
							//reduce the special chars but minimum of 2
							while(Hasher.password.length > (Hasher.end - Hasher.start) && Hasher.specialCharactersPos.length > 1){
								Hasher.password = Hasher.password.substr(0, Hasher.specialCharactersPos[Hasher.specialCharactersPos.length-1])+Hasher.password.substr((Hasher.specialCharactersPos[Hasher.specialCharactersPos.length-1])+1, Hasher.password.length);
								Hasher.specialCharactersPos.splice(-1,1);
							}
							Hasher.iterator++;
							//check to trim more for 4 times max then forcefully come out
							if(Hasher.iterator < 4){
								Hasher.finalTrim();
							}
						}
					}
				},

	//Utility Helper methods - replaceAt(index to be replaced, character to be placed)
	replaceAt: function(index, character) {
   							return Hasher.password.substr(0, index) + character + Hasher.password.substr(index+character.length);
						},

	//fill the position array buckets
	fillCountCharacters: function() {
					//reset array to 0
					Hasher.injectedChars.length = Hasher.specialCharactersPos.length = Hasher.numberPos.length = Hasher.smallCharactersPos.length = Hasher.capitalCharactersPos.length = 0;
					for(var iterator=0;iterator<Hasher.password.length;iterator++) {
						if(/^[a-z]$/.test(Hasher.password[iterator])){
							Hasher.smallCharactersPos[Hasher.smallCharactersPos.length++]=iterator;
						}
						else if(/^[0-9]$/.test(Hasher.password[iterator])){
							Hasher.numberPos[Hasher.numberPos.length++]=iterator;
						}
						else if(/^[A-Z]$/.test(Hasher.password[iterator])){
							Hasher.capitalCharactersPos[Hasher.capitalCharactersPos.length++]=iterator;
						}
						else if(/^\W$/.test(Hasher.password[iterator])){
							Hasher.specialCharactersPos[Hasher.specialCharactersPos.length++]=iterator;
						}
					}	
				},			

	
	//Single method to call from outside to return the hashed and modified password.
	passy: function(masterPassword, siteTag, extraSecuritySequence, startIndex, endIndex){ 
						Hasher.masterPassword = masterPassword;
						Hasher.siteTag = siteTag;
						Hasher.extraSecuritySequence = extraSecuritySequence;
						Hasher.start = startIndex;
						Hasher.end = endIndex;
						Hasher.hashy();
						Hasher.modify();
						return Hasher.password;
						}

};
