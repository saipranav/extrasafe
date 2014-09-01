Hasher = {

	masterPassword: "",
	siteTag: "",
	extraSecuritySequence: "",
	password: "",
	start: 0,
	end: 12,
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


	hashy: function(){	
			Hasher.password = CryptoJS.SHA3( Hasher.siteTag + Hasher.masterPassword + Hasher.extraSecuritySequence).toString();
			},


	modify: function(){
				Hasher.password = Hasher.password.slice(Hasher.start, Hasher.end);
				Hasher.extrasafeModification();
			},
	

	extrasafeModification: function(){
					Hasher.fillCountCharacters();
					Hasher.checker();
					Hasher.finalTrim();
					Hasher.iterator = 0;
				},

	checker: function(){

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

					if(/^([a-z]|(@|!|&|#|\*)|[0-9])*$/.test(Hasher.password) == true){
						var replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.capitalCharacters[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1]]).charCodeAt(0))%(Hasher.capitalCharacters.length-1)]);
						Hasher.injectedChars.push(replaceIndex);

						replaceIndex = Hasher.getReplaceIndex(Hasher.smallCharactersPos, 1);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.capitalCharacters[((Hasher.password[Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-2]]).charCodeAt(0))%(Hasher.capitalCharacters.length-1)]);
						Hasher.injectedChars.push(replaceIndex);
					}

					if(/^([a-z]|[A-Z]|[0-9])*$/.test(Hasher.password) == true){
						var replaceIndex = Hasher.getReplaceIndex(Hasher.numberPos, 0);
						Hasher.password = Hasher.replaceAt(replaceIndex, Hasher.specialCharacters[((Hasher.password[Hasher.numberPos[Hasher.numberPos.length-1]]).charCodeAt(0))%(Hasher.specialCharacters.length-1)]);
						Hasher.injectedChars.push(replaceIndex);
					}
				},


	getReplaceIndex: function(array, charAt){
					var index = array[(Hasher.password.charCodeAt(charAt))%(Math.ceil(array.length/2))];
					if(Hasher.injectedChars.indexOf(index) != -1){
						index = undefined;
					}
					return index;
				},	
	

	finalTrim: function(){
					if(Hasher.password.length > Hasher.end){
						Hasher.fillCountCharacters();

						if(Hasher.numberPos.length > Hasher.smallCharactersPos.length){

							while(Hasher.password.length > Hasher.end && Hasher.numberPos.length > 4){
								Hasher.password = Hasher.password.substr(0, Hasher.numberPos[Hasher.numberPos.length-1])+Hasher.password.substr((Hasher.numberPos[Hasher.numberPos.length-1])+1, Hasher.password.length);
								Hasher.numberPos.splice(-1,1);
							}
							Hasher.iterator++;

							if(Hasher.iterator < 2){
								Hasher.finalTrim();
							}
						}
						else{

							while(Hasher.password.length > Hasher.end && Hasher.smallCharactersPos.length > 4){
								Hasher.password = Hasher.password.substr(0, Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1])+Hasher.password.substr((Hasher.smallCharactersPos[Hasher.smallCharactersPos.length-1])+1, Hasher.password.length);
								Hasher.smallCharactersPos.splice(-1,1);
							}
							Hasher.iterator++;

							if(Hasher.iterator < 2){
								Hasher.finalTrim();
							}
						}
					}
				},


	replaceAt: function(index, character) {
   							return Hasher.password.substr(0, index) + character + Hasher.password.substr(index+character.length);
						},


	fillCountCharacters: function() {

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

	

	passy: function(masterPassword, siteTag){ 
						Hasher.masterPassword = masterPassword;
						Hasher.siteTag = siteTag;
						Hasher.hashy();
						Hasher.modify();
						return Hasher.password;
						}

};