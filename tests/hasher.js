Hasher = {

	masterPassword: "", //input master password
	siteTag: "", //site name
	extraSecuritySequence: "", // extra string to be added with master password
	password: "", //output password
	start: 0, //start from triming
	end: 10, //end for triming
	specialCharacters : new Array("@","!","&","*","#","(",")","/"),
	capitalCharacters : new Array("A","B","C","D","E","F","G","H"),
	smallCharacters : new Array("a","b","c","d","e","f","g","h"),
	numbers : new Array("0","1","2","3","4","5","6","7","8","9"),
	specialCharactersPos : new Array(),
	numberPos : new Array(),
	smallCharactersPos : new Array(),
	capitalCharactersPos : new Array(),
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
					/*Hasher.countNoAndChars();

					//all are numbers
					if(Hasher.charPos.length == 0){
						Hasher.password = Hasher.replaceAt(Hasher.start, Hasher.injectCharacter[Hasher.password[Hasher.start]%(Hasher.injectCharacter.length/2)]);
						Hasher.password = Hasher.replaceAt(Hasher.end-1, Hasher.injectCharacter[(Hasher.password[Hasher.end-1]%(Hasher.injectCharacter.length/2))+5]);
					}

					//all are characters
					else if(Hasher.noPos.length == 0){
						Hasher.password = Hasher.replaceAt(0, '0');
						Hasher.password = Hasher.replaceAt(3, '3');
						Hasher.password = Hasher.replaceAt(6, '6');
					}

					Hasher.countNoAndChars();
					Hasher.addSpecialCharacters();*/
					Hasher.fillCountCharacters();
					Hasher.checker();
				},

	checker: function(){
					//all small characters
					if(/^[a-z]*$/.test(Hasher.password) == true || Hasher.numberPos.length < 4){
						var replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.numbers[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1]]).charCodeAt(0))%(Hasher.numbers.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
						replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 1);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.numbers[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1]]).charCodeAt(0))%(Hasher.numbers.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
						replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 2);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.numbers[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1]]).charCodeAt(0))%(Hasher.numbers.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
					}
					//all numbers
					if(/^[0-9]*$/.test(Hasher.password) == true || Hasher.smallCharactersPos.length < 4){
						var replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.smallCharacters[((Hasher.password[Hasher.numberPos[Hasher.numberPos.length-1]]).charCodeAt(0))%(Hasher.smallCharacters.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
						replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 1);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.smallCharacters[((Hasher.password[Hasher.numberPos[Hasher.numberPos.length-1]]).charCodeAt(0))%(Hasher.smallCharacters.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
						replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 2);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.smallCharacters[((Hasher.password[Hasher.numberPos[Hasher.numberPos.length-1]]).charCodeAt(0))%(Hasher.smallCharacters.length-1)]);
						Hasher.smallCharactersPos.push(replaceIndex);
					}
					//capital characters not found
					if(/^([a-z]|(@|!|&|#|\*)|[0-9])*$/.test(Hasher.password) == true){
						var replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.capitalCharacters[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1]]).charCodeAt(0))%(Hasher.capitalCharacters.length-1)]);
						replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 1);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.capitalCharacters[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1]]).charCodeAt(0))%(Hasher.capitalCharacters.length-1)]);
						//replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 2);
						//Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.capitalCharacters[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1]]).charCodeAt(0))%(Hasher.capitalCharacters.length-1)]);
					}
					//special characters not found
					if(/^([a-z]|[A-Z]|[0-9])*$/.test(Hasher.password) == true){
						var replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.specialCharacters[((Hasher.password[Hasher.numberPos[Hasher.numberPos.length-1]]).charCodeAt(0))%(Hasher.specialCharacters.length-1)]);
						//replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 1);
						//Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.specialCharacters[((Hasher.password[Hasher.numberPos[Hasher.numberPos.length-1]]).charCodeAt(0))%(Hasher.specialCharacters.length-1)]);
					}
				},

	getReplaceIndex: function(array, charAt){
					var index = array[(Hasher.password.charCodeAt(charAt))%(Math.ceil(array.length/2))];
					if(index == 0){
						Hasher.password = "."+Hasher.password;
						index = 1;
					}
					index = index - 1;
					return index;
				},			
	
	addSpecialCharacters: function(){
					//Tweaking the password to include special characters (at the position of the middle digit)
					Hasher.password = Hasher.replaceAt(Hasher.noPos[Math.floor(Hasher.noPos.length/2)],Hasher.specialCharacter[Hasher.password[Hasher.noPos[Hasher.noPos.length-1]]%Hasher.specialCharacter.length]);
						
					//Capitalizing the middle letter
					Hasher.password = Hasher.replaceAt(Hasher.charPos[Math.floor(Hasher.charPos.length/2)],Hasher.password[Hasher.charPos[Math.floor(Hasher.charPos.length/2)]].toUpperCase());		
					},

	//Utility Helper methods - replaceAt(index to be replaced, character to be placed)
	replaceAt: function(index, character) {
   							return Hasher.password.substr(0, index) + character + Hasher.password.substr(index+character.length);
						},

	//Utility Helper methods - replaceAt(index to be replaced, character to be placed)
	countNoAndChars: function() {
					Hasher.noPos.length = Hasher.charPos.length = 0;
					for(var iterator=0;iterator<Hasher.password.length;iterator++) {
						if (!isNaN(parseInt(Hasher.password[iterator]))) {
							Hasher.noPos[Hasher.noPos.length++]=iterator;
						}
						else {
							Hasher.charPos[Hasher.charPos.length++]=iterator;
						}
					}	
				},

	fillCountCharacters: function() {
					Hasher.specialCharactersPos.length = Hasher.numberPos.length = Hasher.smallCharactersPos.length = Hasher.capitalCharactersPos.length = 0;
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
							Hasher.capitalCharactersPos[Hasher.capitalCharactersPos.length++]=iterator;
						}
					}	
				},			

	
	//Single method to call from outside to return the hashed and modified password.
	passy: function(masterPassword, siteTag){ 
						Hasher.masterPassword = masterPassword;
						Hasher.siteTag = siteTag;
						Hasher.hashy();
						Hasher.modify();
						return Hasher.password;
						}

};
