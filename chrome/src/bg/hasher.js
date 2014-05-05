Hasher = {

	masterPassword: "", //input master password
	siteTag: "", //site name
	password: "", //output password
	start: 0, //start from triming
	end: 10, //end for triming
	specialCharacter : new Array("@","!","&","*","#"),
	injectCharacter : new Array("a","b","c","d","e","F","G","H","I","J"),
	noPos : new Array(),
	charPos : new Array(),
	iterator : 0,
	
	//Call the crypto graphic algorithm.
	hashy: function(){	
			Hasher.password = CryptoJS.SHA3( Hasher.siteTag + Hasher.masterPassword ).toString();
			},

	//It will be called after the Crypto returns.
	modify: function(){
				Hasher.password = Hasher.password.substr(Hasher.start, Hasher.end);
				Hasher.extrasafeModification();
			},
	
	//Extrasafe modification
	extrasafeModification: function(){
					Hasher.countNoAndChars();

					//all are numbers
					if(Hasher.charPos.length == 0){
						window.alert("numbers");
						Hasher.password = Hasher.replaceAt(Hasher.start, Hasher.injectCharacter[Hasher.password[Hasher.start]%(Hasher.injectCharacter.length/2)]);
						Hasher.password = Hasher.replaceAt(Hasher.end, Hasher.injectCharacter[(Hasher.password[Hasher.end-1]%(Hasher.injectCharacter.length/2))+5]);
					}

					//all are characters
					else if(Hasher.noPos.length == 0){
						window.alert("chars");
						Hasher.password = Hasher.replaceAt(0, '0');
						Hasher.password = Hasher.replaceAt(3, '3');
						Hasher.password = Hasher.replaceAt(9, '9');
					}

					Hasher.countNoAndChars();
					Hasher.addSpecialCharacters();
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

	
	//Single method to call from outside to return the hashed and modified password.
	passy: function(masterPassword, siteTag){ 
						Hasher.masterPassword = masterPassword;
						Hasher.siteTag = siteTag;
						Hasher.hashy();
						Hasher.modify();
						return Hasher.password;
						}

};
