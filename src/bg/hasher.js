Hasher = {

	masterPassword: "", //input master password
	siteTag: "", //site name
	password: "", //output password
	start: 0, //start from triming
	end: 10, //end for triming
	requireSpecialCharacters: true,
	specialCharacter : new Array("@","!","&","*","#"),
	noPos : new Array(),
	charPos : new Array(),
	iterator : 0,
	
	//Call the crypto graphic algorithm.
	hashy: function(){	
						Hasher.password = CryptoJS.SHA3( Hasher.masterPassword + Hasher.siteTag ).toString();
					 },
	//It will be called after the Crypto returns.
	modify: function(){
						Hasher.password = Hasher.password.substr(Hasher.start, Hasher.end);
						if(Hasher.requireSpecialCharacters == true){
							Hasher.addSpecialCharacters();
						}
					},
	
	addSpecialCharacters: function(){
						Hasher.noPos.length = Hasher.charPos.length = 0;
						for(iterator=0;iterator<Hasher.password.length;iterator++) {
							if (!isNaN(parseInt(Hasher.password[iterator]))) {
								Hasher.noPos[Hasher.noPos.length++]=iterator;
							}
							else {
								Hasher.charPos[Hasher.charPos.length++]=iterator;
							}
						}
						//Tweaking the password to include special characters (at the position of the middle digit)
						Hasher.password = Hasher.replaceAt(Hasher.noPos[Math.floor(Hasher.noPos.length/2)],Hasher.specialCharacter[Hasher.password[Hasher.noPos[Hasher.noPos.length-1]]%Hasher.specialCharacter.length]);
						//Capitalizing the middle letter		
						Hasher.password = Hasher.replaceAt(Hasher.charPos[Math.floor(Hasher.charPos.length/2)],Hasher.password[Hasher.charPos[Math.floor(Hasher.charPos.length/2)]].toUpperCase());
					},
	//Utility Helper method
	replaceAt: function(index, character) {
      										return Hasher.password.substr(0, index) + character + Hasher.password.substr(index+character.length);
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
