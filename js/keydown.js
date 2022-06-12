
let daku_kana_list = ["ゔ","が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で","ど","ば","び","ぶ","べ","ぼ"];
let handaku_kana_list = ["ぱ","ぴ","ぷ","ぺ","ぽ"];
let keys = ["Space","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0","Minus","Equal","IntlYen","BracketLeft","BracketRight","Semicolon","Quote","Backslash","Backquote","IntlBackslash","Comma","Period","Slash","IntlRo"]//keys.includes(event.code)
let tenkeys = ["Numpad1","Numpad2","Numpad3","Numpad4","Numpad5","Numpad6","Numpad7","Numpad8","Numpad9","Numpad0","NumpadDivide","NumpadMultiply","NumpadSubtract","NumpadAdd","NumpadDecimal"]//tenkeys.includes(event.code)
let youon_flick_list = ["ぁ","ぃ","ぅ","ぇ","ぉ","ゃ","ゅ","ょ","っ","ゎ"]
let youon_flick_list_large = ["あ","い","う","え","お","や","ゆ","よ","つ","わ"]
let hankaku_list = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "~", "&", "%", "!", "?", "@", "#", "$", "(", ")", "|", "{", "}", "`", "*", "+", ":", ";", "_", "<", ">", "=", "^"]
let flick_input_max_value = 0

//wordData
var already_input = "";
var already_input_roma = "";
var next_input = [];
var next_char = [];
var next_point = 0;

//playData

let playData = {
 completed : false,
 completeCount : 0,
 typingLog : [],
 lineTypingLog : [],
 score : 0,
 failure_count : 0,
 failer_count : 0,
 typingMissCount : 0,
 typing_count : 0,
 type_per_min : 0,
 combo : 0,
 miss_combo : 0,
 maxCombo : 0
}
function keydownfunc (event) {
	let tagname = event.type == "input" || document.activeElement.type == "range" ? true : document.activeElement.tagName
	if(document.activeElement.className == "caret"){tagname = "INPUT"}
	let c
	let flick_char = event.type == "input" && event.data != null ? event.data.slice(0.-1) : false
	const character_key = flick_char !== false || ((event.keyCode >= 65 && event.keyCode <= 90) || keys.includes(event.code) || tenkeys.includes(event.code)) && event.key != "Process" ? true : false
	if(character_key && tagname != "INPUT"  && next_char[0]){
		headtime = player.getCurrentTime() + player.difftime;
		time_calculation(false)
		if(kana_mode){

			let daku = daku_kana_list.includes(next_char[0][0]) ? daku_kana_list[daku_kana_list.indexOf(next_char[0][0])] : false
			let handaku = handaku_kana_list.includes(next_char[0][0]) ? handaku_kana_list[handaku_kana_list.indexOf(next_char[0][0])] : false
			if(event.type == "keydown"){
				kana_keymap = {
					0: function() { return ["わ"] },
					1: function() { return ["ぬ"] },
					"!": function() { return["ぬ"] },
					2: function() { return ["ふ"] },
					3: function() { return ["あ"] },
					4: function() { return ["う"] },
					5: function() { return ["え"] },
					6: function() { return ["お"] },
					7: function() { return ["や"] },
					8: function() { return ["ゆ"] },
					9: function() { return ["よ"] },
					"-": function() { return ["ほ","-"] },
					"q": function() { return ["た"] },
					"Q": function() { return ["た"] },
					"w": function() { return ["て"] },
					"W": function() { return ["て"] },
					"e": function() { return ["い"] },
					"E": function() { return ["い"] },
					"r": function() { return ["す"] },
					"R": function() { return ["す"] },
					"t": function() { return ["か"] },
					"T": function() { return ["か"] },
					"y": function() { return ["ん"] },
					"Y": function() { return ["ん"] },
					"u": function() { return ["な"] },
					"U": function() { return ["な"] },
					"i": function() { return ["に"] },
					"I": function() { return ["に"] },
					"o": function() { return ["ら"] },
					"O": function() { return ["ら"] },
					"p": function() { return ["せ"] },
					"P": function() { return ["せ"] },
					"a": function() { return ["ち"] },
					"A": function() { return ["ち"] },
					"s": function() { return ["と"] },
					"S": function() { return ["と"] },
					"d": function() { return ["し"] },
					"D": function() { return ["し"] },
					"f": function() { return ["は"] },
					"F": function() { return ["は"] },
					"g": function() { return ["き"] },
					"G": function() { return ["き"] },
					"h": function() { return ["く"] },
					"H": function() { return ["く"] },
					"j": function() { return ["ま"] },
					"J": function() { return ["ま"] },
					"k": function() { return ["の"] },
					"K": function() { return ["の"] },
					"l": function() { return ["り"] },
					"L": function() { return ["り"] },
					"z": function() { return ["つ"] },
					"Z": function() { return ["つ"] },
					"x": function() { return ["さ"] },
					"X": function() { return ["さ"] },
					"c": function() { return ["そ"] },
					"C": function() { return ["そ"] },
					"v": function() { return ["ひ"] },
					"V": function() { return ["ひ"] },
					"b": function() { return ["こ"] },
					"B": function() { return ["こ"] },
					"n": function() { return ["み"] },
					"N": function() { return ["み"] },
					"m": function() { return ["も"] },
					"M": function() { return ["も"] },
					",": function() { return ["ね",","] },
					"<": function() { return ["、"] },
					".": function() { return ["る","."] },
					">": function() { return ["。"] },
					"/": function() { return ["め","/"] },
					"?": function() { return ["・"] },
					"#": function() { return ["ぁ"] },
					"$": function() { return ["ぅ"] },
					"%": function() { return ["ぇ"] },
					"'": function() { return ["ゃ","’","'"] },
					"^": function() { return ["へ"] },
					"~": function() { return ["へ"] },
					"&": function() { return ["ぉ"] },
					"(": function() { return ["ゅ"] },
					")": function() { return ["ょ"] },
					'|': function() { return ["ー"] },
					"_": function() { return ["ろ"] },
					"=": function() { return ["ほ"] },
					"+": function() { return ["れ"] },
					";": function() { return ["れ"] },
					'"': function() { return ["ふ","”","“","\""] },
					"@": function() { return ["゛"] },
					'`': function() { return ["゛"] },
					"[": function() { return ["゜"] },
					']': function() { return ["む"] },
					"{": function() { return ["「"] },
					'}': function() { return ["」"] },
					":": function() { return ["け"] },
					"*": function() { return ["け"] }
				}
				windows_keymap = {
					'IntlYen': function() { return ["ー","￥","\\"] },
					"IntlRo": function() { return ["ろ","￥","\\"] },
					"Space": function() { return [" "] },
					"Numpad1": function() { return [] },
					"Numpad2": function() { return [] },
					"Numpad3": function() { return [] },
					"Numpad4": function() { return [] },
					"Numpad5": function() { return [] },
					"Numpad6": function() { return [] },
					"Numpad7": function() { return [] },
					"Numpad8": function() { return [] },
					"Numpad9": function() { return [] },
					"Numpad0": function() { return [] },
					"NumpadDivide": function() { return [] },
					"NumpadMultiply": function() { return [] },
					"NumpadSubtract": function() { return [] },
					"NumpadAdd": function() { return [] },
					"NumpadDecimal": function() { return [] }
				}
				c = windows_keymap[event.code] ? windows_keymap[event.code]() : kana_keymap[event.key]();
				if(event.shiftKey){
					if(event.code == "KeyE"){c[0] = "ぃ";}
					if(event.code == "KeyZ"){c[0] = "っ";}

					//ATOK入力 https://support.justsystems.com/faq/1032/app/servlet/qadoc?QID=024273
					if(event.code == "KeyV"){c.push("ゐ","ヰ")}
					if(event.code == "Equal"){c.push("ゑ","ヱ")}
					if(event.code == "KeyT"){c.push("ヵ")}
					if(event.code == "Quote"){c.push("ヶ")}
					if(event.code == "KeyF"){c.push("ゎ")}
				}
				if(hankaku_list.includes(event.key)){
					!OPTION_ACCESS_OBJECT['case-sensitive-mode'] ? c.push(event.key.toLowerCase() , event.key.toLowerCase().replace(event.key.toLowerCase(), function(s) {return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);})) : c.push(event.key , event.key.replace(event.key, function(s) {return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);}))
				}
				if(event.shiftKey && event.key === "0"){c = ["を"];}
			}else{
				if(flick_input_max_value == event.target.value){
					return;
				}
				if(flick_input_max_value.length > event.target.value.length){
					flick_input_max_value = event.target.value
					if( next_char[0] && (next_char[0][0] == "゛" || next_char[0][0] == "゜")){
						if(daku_kana_list.includes(next_char.slice(-1)[0]) || handaku_kana_list.includes(next_char.slice(-1)[0]) ){
							if(next_char.slice(-1)[0].normalize('NFD')[0]){
								next_char[0] = next_char.slice(-1)[0]+next_char[0].slice(1)
								next_char.pop()
								playData['typing_count']--
								updateLineView_typing(true)
							}
						}else if(already_input[already_input.length-1]){
							next_char[0] = already_input.slice(-1)+next_char[0]
							already_input = already_input.slice(0,-1)
							playData['typing_count']--
							updateLineView_typing(true)
						}
					}
					return;
				}
				flick_input_max_value = event.target.value
				c = [flick_char]
				if(c[0] == "~" || c[0] == "～"){
					c = ["~","～"]
				}
				if(c[0] == "\\" || c[0] == "￥"){
					c = ["\\","￥"]
				}
				if(c[0] == "　"){
					c = [" "]
				}
				if(c[0] == "！" || c[0] == "!"){
					c = ["!","！"]
				}
				if(c[0] == "？" || c[0] == "?"){
					c = ["?","？"]
				}
				if(next_char[0][0] == "゛" && daku_kana_list.includes(c[0]) || next_char[0][0] == "゜" && handaku_kana_list.includes(c[0])){
					if(c[0].normalize('NFD')[0] == already_input.slice(-1)||c[0] == next_char.slice(-1)[0]){
						c = [next_char[0][0]]
					}
				}
				const zenkaku = hankaku_list.indexOf(c[0])
				if(zenkaku > -1){
					c.push(c[0].replace(c[0], function(s) {return String.fromCharCode(s.charCodeAt(0) + 0xFEE0)}));
				}else if(c[0] == "\\"){
					c.push("￥")
				}else if(c[0] == "\""){
					c.push("“","”")
				}else if(c[0] == "'"){
					c.push("’")
				}


			}

			if(checkNextKana(c,daku,handaku,flick_char)){
				if(daku || handaku){
					c = daku ? daku.normalize('NFD')[0] : handaku.normalize('NFD')[0]
				}else{
					c = c[kana_key_objects]
				}
				Continuous_xtu_flag = false // ローマ字モードの「っ」連鎖判定
				add_typing_count(c);
				//type_effect();
			} else if(!playData["completed"] && (!flick_char || flick_char && ( !(youon_flick_list.includes(next_char[0][0]) && youon_flick_list_large.indexOf(c[0]) == youon_flick_list.indexOf(next_char[0][0])) && !(youon_flick_list.includes(c[0]) && next_char[0][0] == "゛") && !(daku_kana_list.includes(c[0]) && next_char[0][0] == "゜") ) )) {
				if(already_input.length != 0 || daku_kana_list.includes(next_char.slice(-1)[0]) || handaku_kana_list.includes(next_char.slice(-1)[0])) {
					if(flick_char && (next_char[0][0] == "゛" && c[0] != "゛"||next_char[0][0] == "゜" && c[0] != "゜") ){
						if(daku_kana_list.includes(next_char.slice(-1)[0]) || handaku_kana_list.includes(next_char.slice(-1)[0]) ){
							if(next_char.slice(-1)[0].normalize('NFD')[0] != c[0] ){
								next_char[0] = next_char.slice(-1)[0]+next_char[0].slice(1)
								next_char.pop()
								playData['typing_count']--
								updateLineView_typing(true)
							}
						}else if(already_input[already_input.length-1] != c[0]){
							next_char[0] = already_input.slice(-1)+next_char[0]
							already_input = already_input.slice(0,-1)
							playData['typing_count']--
							updateLineView_typing(true)
						}
					}
					if(!flick_char && /[!-~]/.test(next_char[0])){
						playData['typingLog'].push([headtime, event.key, Math.round(playData['score']-score_per_char/4), count, 0, 0]);
						playData['lineTypingLog'].push([event.key , 0 , headtime, kana_mode]);
					}else{
						playData['typingLog'].push([headtime, c[0], Math.round(playData['score']-score_per_char/4), count, 0, 0]);
						playData['lineTypingLog'].push([c[0] , 0 , headtime, kana_mode]);
					}
					add_typing_miss_count();
				}
				//miss_effect();
				//if(perfect_mode_judge(true)){return;}

			}


		}else{
			c = (event.key).toLowerCase()


			if(checkNextChar(c,z_command_roma_mode(c,event.code,event.shiftKey))){
				add_typing_count(c);

				//type_effect();

			}else if(!playData['completed']) {
				if(already_input_roma.length != 0) {
					add_typing_miss_count();
					playData['typingLog'].push([headtime, c, Math.round(playData['score']), count,0,0]);
					playData['lineTypingLog'].push([c , 0 , headtime, kana_mode]);
				}
				//miss_effect();
				//if(perfect_mode_judge(true)){return;}
			}


		}

		if(event.type == "keydown" && !(event.ctrlKey && event.code == "KeyC")){
			auto_scroll_flag = true
			event.preventDefault()
			return;
		}
	}
	if(tagname != "INPUT" && event.type == "keydown"){
		arrowkey(tagname);
	}
}

let line_score = 0
let Continuous_xtu_flag = false
let n_flag = false
function checkNextChar (c,z_command){
	let flag = false;
	let next_char_roma = next_char.slice(1)
	let kana_update_flag = z_command ? true : false
	//入力したキー == 打鍵パターン1文字目  確認
	for (let i=0; i<next_char_roma.length; i++){
		if(c == next_char_roma[i][0]){
			flag = true;
			break;}
	}


	//一致してなかったら中断
	if(Continuous_xtu_flag && c =="t"){
		continuous_xtu_adjust(c)
	}else if(tsu_flag && c =="s"){
		already_input_roma += c
		updateLineView_typing(kana_update_flag)
		return true;
	}else if(n_flag && line_input_kana[0][0] == "う" && c =="w"){
		add_next_char(true)
		updateLineView_typing(true)
	}else if(next_char[0] == "..." && c==","){
		next_char = ["..", ","]
		next_point = 2 * score_per_char
		line_input.unshift(".")
		line_input_roma.unshift(".")
		line_input_kana.unshift(".")
	}else if(!flag){
		return false;
	}

	Continuous_xtu_flag = false
	n_flag = false

	//xnで「ん」を入力する場合は[nn]のパターンを削除
	//nnの入力中にwu,whu,yi,yeの判定を追加。
	if(next_char[0]=='ん'){
		if(c=='x' && line_input_roma[0] && line_input_roma[0][0]!='n'){
			line_input[0] = line_input[0].filter(function(value) { return value.match(/^(?!(n)).*$/)})
		}else if(line_input_kana[0] && line_input_kana[0][0] == "う" && c=='n' && next_char[1]=='nn'){
			n_flag = true
		}
	}
	//打ってない方のパターン削除
	if(next_char.length >= 3){
		//拗音・促音クリア判定
		//先頭の文字(現在入力してるモノ)を削除
		for (let j=0; j<next_char.length; j++){
			if(j > 0){
				if(c==next_char[j][0]){
					next_char[j] = next_char[j].slice(1);
				}else{
					//入力したキーから始まる打鍵パターン以外を削除
					next_char.splice( j, 1 );
					j--
				}
			}
		}
	}else{
		next_char[1] = next_char[1].slice(1)
	}


	if(next_char[0].length >= 2){
		if(next_char[0][0] != 'っ' && (next_char[1][0] == 'x' || next_char[1][0] == 'l') || next_char[0][0] == 'っ' && (c == 'u' || next_char[1][0] == c)){
			if(next_char[0][0] == 'っ' && next_char[0][1] == 'っ' && (next_char[1][0] == 'x' || next_char[1][0] == 'l') && (c == "x"||c == "l")){
				Continuous_xtu_flag = true
			}
			roma_distinguish()
			kana_update_flag = true
			if(next_char[0][0] == 'っ' && c == 'u'){
				tsu_flag = false
			}
		}
	}


	already_input_roma += c;
	if(!next_char[1]) {
		add_next_char(true)
		kana_update_flag = true
	}

	updateLineView_typing(kana_update_flag)

	return true;
}

let tsu_flag = false
function continuous_xtu_adjust(c){

	const xtu_times = ( xtu_chain[0].match( /っ/g ) || [] ).length-( next_char[0].match( /っ/g ) || [] ).length
	if(Continuous_xtu_flag){
		next_char[0] = already_input.slice(-1)+next_char[0]
		already_input = already_input.slice(0,-1)
		tsu_flag = true
	}
	for(let h=1;h<xtu_chain.length;h++){
		next_char[h] = (Continuous_xtu_flag?"tu":"")+xtu_chain[h].slice(xtu_times)
	}
	if(Continuous_xtu_flag){updateLineView_typing(true)}
}

function z_command_roma_mode(c,pushkey,shiftkey,replay_judge){
	if(replay_judge){ pushkey = "KeyZ" }
	if(pushkey == "KeyZ" && !shiftkey){
		if(next_char[0] == "." && line_input_kana[0] == "."){
			if(line_input_kana[1] == "."){
				next_char = ["...", c+"."]
				next_point = 3 * score_per_char
				line_input.splice(0, 2)
				line_input_roma.splice(0, 2)
				line_input_kana.splice(0, 2)
			}else{
				next_char = ["..", c+","]
				next_point = 2 * score_per_char
				line_input.splice(0, 1)
				line_input_roma.splice(0, 1)
				line_input_kana.splice(0, 1)
			}
			return true
		}else if(next_char[0] == "～" && next_char[1] != "-"){
			next_char[1] = c+"-"
		}
	}
}
function roma_distinguish(){
	already_input += kana_mode && !OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode'] && ["゛", "゜"].includes(next_char[0][0]) ? next_char[next_char.length-1] : next_char[0].slice( 0, 1 )
	next_char[0] = next_char[0].slice(1)
}


var kana_key_objects = 0;
let daku_kana_flag = false
function checkNextKana (c,daku,handaku,flick_flag){
	let yoon = ""
	if(next_char[0].length >= 2){
		kana_key_objects = [].indexOf.call(c, next_char[0][0].toLowerCase())
		if(daku || handaku){
			yoon = next_char[0][1]
		}
	}else{
		kana_key_objects = [].indexOf.call(c, next_char[0].toLowerCase())
	}

	if(daku_kana_flag && c[kana_key_objects] && (next_char[0][0] == "゛" || next_char[0][0] == "゜")){
		kana_combo --
		daku_kana_flag = false
	}

	if(flick_flag){
		if(OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode'] && c[0] && next_char[0].length >= 2){
			const boin = (daku_kana_list.includes(c[0]) || handaku_kana_list.includes(c[0])) ? c[0] : false
			if(boin && next_char[0][0] == boin.normalize('NFD')[0] && ( (next_char[0][1] == "゛" && daku_kana_list.includes(c[0])) || (next_char[0][1] == "゜" || handaku_kana_list.includes(c[0])) ) ){
				add_next_char(true)
				updateLineView_typing(true)
				return true
			}
		}
	}
	//return trueは正解　return falseは不正解。
	if(daku && c.includes(daku.normalize('NFD')[0])) {
		next_char = ["゛"+yoon, ...next_char.slice(1),daku];
		updateLineView_typing(true)
		kana_combo ++
		daku_kana_flag = true
		return true;
	}else if (handaku && c.includes(handaku.normalize('NFD')[0])) {
		next_char = ["゜"+yoon, ...next_char.slice(1),handaku];
		updateLineView_typing(true)
		kana_combo ++
		daku_kana_flag = true
		return true;
	}else if(kana_key_objects > -1) {
		if(next_char[0].length >= 2 && next_char[0][1] != " "){
			roma_distinguish()
		}else{
			add_next_char(true)
		}
		updateLineView_typing(true)
		return true
	}


	return false;
}

let xtu_chain = ""
function add_next_char(flag){
	if(flag){
		already_input += kana_mode && !OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode'] && ["゛", "゜"].includes(next_char[0]) ? next_char[next_char.length-1] : next_char[0];
		//スコア加算
		if(play_speed<DefaultPlaySpeed){
			line_score += next_point*play_speed;
			if(OPTION_ACCESS_OBJECT['replay-mode'] || line_score_log[count-1][0] < line_score){
				//SELECTOR_ACCESS_OBJECT['score-value'].textContent = ((playData['score'] + line_score)/2000).toFixed(2)
			}
		}else{
			line_score += next_point;
		}
		if(play_mode == "normal" && play_speed>=1 || play_mode == "practice" && play_speed >= DefaultPlaySpeed && (OPTION_ACCESS_OBJECT['replay-mode'] || line_score_log[count-1][0] < line_score) || title_speed){
			playData['score'] += next_point;
			//SELECTOR_ACCESS_OBJECT['score-value'].textContent = (playData['score']/2000).toFixed(2)
		}
	}

	if(kana_mode && flag && next_char.length >= 2 && next_char[0].length == 1){
		already_input_roma += next_char[1]
		line_input_roma.shift(1)
	}else if(!kana_mode || !flag){
		line_input_roma.shift(1)
	}
	xtu_chain = ""
	next_char = !line_input[0] ? ["",""] : [line_input_kana.shift(1), ...line_input.shift(1)]
	if(next_char[0][0] == "っ" && next_char[0][1] == "っ"){xtu_chain = next_char.concat()}

	if(!next_char[0]) {
		line_completed()
	}else{
		next_point = next_char[1].length * score_per_char
		//if(!kana_mode){ keystroke_pattern_optimisation() }
	}

}

function add_typing_count(c){
	playData['typing_count']++;

	//practice_typing_count++
	playData['combo']++;
	if(playData['maxCombo'] < playData['combo']){playData['maxCombo'] = playData['combo'];}
	miss_combo = 0;
	if(playData['score'] > 199999){playData['score'] = 200000}

	playData['lineTypingLog'].push([c , 1 , headtime+practice_time , kana_mode]);



	if(!next_char[0]) { //ラインクリア時の打鍵タイム加算
		if(stop_time_flag) {
			practice_time_current += ((new Date).getTime()-stop_time)/1000
			practice_speed_time = 0
			createjs.Ticker.removeEventListener("tick", time_calculation);
			time_calculation(false)
			player.playVideo();
		}
		playData['completed'] = true;
		//clear_time_log.splice(count-1, 1, line_playing_time);
		/*
		if(playData['completed'] && escape_word_length_log[count-1][2] != 1){
			playData['completeCount'] ++;
			//StatusCountsUpdate(["Line"])

		}
		

		line_clear_effect()
		past_playing_time += clear_time_log[count-1]
		line_result_check()
		stop_time_flag = false
		*/
	}
	//StatusCountsUpdate(["Type","Correct"])
	typing_speed_calculation()
	playData['typingLog'].push([headtime, c, Math.round(playData['score']), count, playData['completed'] ? 1 : 0, 1]);
}


function line_completed(){
	next_point = 0;

	//クリア時は現在のライン経過時間を加算

	for(let i=0;i<document.getElementsByClassName("correct-input").length;i++){
		document.getElementsByClassName("correct-input")[i].style.color = "#1eff52"
	}
}

function updateLineView_typing(kana_update_flag) {

	let kana_first_letter = ""
	let kana_words = ""

	let roma_first_letter = ""
	let roma_words = ""
	let space_disable_space_html = ""
	if(next_char.length > 1){
		kana_first_letter = (next_char[0][0] || "")
		if(kana_update_flag){
			kana_words = next_char[0].slice(1)
		}
		if(!kana_mode){
			roma_first_letter = next_char[1][0] || ""
			roma_words = (next_char[1].slice(1) +space_disable_space_html+ line_input_roma.join(''))
		}
	}




		if(kana_update_flag){
			document.getElementById("kana-first-word").innerHTML = kana_first_letter;
			document.getElementById("kana-second-word").innerHTML = kana_words
			document.getElementById("correct-input-kana").innerHTML = already_input.substr(-15,15).replace(/</g, '&lt;').replace(/ /g, "<span class=underline>&nbsp;</span>" )
		}
		if(!kana_mode){
			document.getElementById("roma-first-word").innerHTML = roma_first_letter
			document.getElementById("typing-word-roma").innerHTML = roma_words
		}
		document.getElementById("correct-input-roma").innerHTML = already_input_roma.substr(-15,15).replace(/</g, '&lt;').replace(/ /g, "<span class=underline>&nbsp;</span>" )
		document.getElementById("typing-word-kana").innerHTML = line_input_kana.join('')
	}

//ミスタイピング処理
function add_typing_miss_count(){
	playData['typing_miss_count'] ++;
	playData['missCombo'] ++;
	playData['combo'] = 0;

	if(playData['score']>0){
		line_score -= score_per_char/4
		if(play_mode == "normal" || play_mode == "practice" && play_speed >= DefaultPlaySpeed && (OPTION_ACCESS_OBJECT['replay-mode'] || line_score_log[count-1][0] < line_score)){
			playData['score'] -= score_per_char/4
			escape_score += (score_per_char/4)
		}
	}
	if(playData['score']<0){
		line_score =0
		if(play_mode == "normal" || play_mode == "practice" && play_speed >= DefaultPlaySpeed && (OPTION_ACCESS_OBJECT['replay-mode'] || line_score_log[count-1][0] < line_score)){
			playData['score'] = 0
		}
	}

	if(play_mode == "practice" && OPTION_ACCESS_OBJECT['seek-line-miss'] && !push_counter){
		practice_missline_auto_set()
	}

	//StatusCountsUpdate(["Score","Rank","Miss","Correct"])
	typing_speed_calculation()

}

let line_move_flag = false
//タイピング時のショートカットキー
function arrowkey(tagname){

	switch(event.key){
		case "ArrowDown":
			if(event.shiftKey){
				skip = false;
				update_skip();
				event.preventDefault();
				return;
			}else{

				if(OPTION_ACCESS_OBJECT['disable-up-down-shortcut']){
					event.preventDefault();
					return;
				}
				volume = player.getVolume();
				volume -= 10;
			}
			if(volume < 0) {volume = 0;}
			player.setVolume(volume);
			localStorage.setItem('volume_storage', volume);
			document.getElementById("volume").textContent = volume;
			document.getElementById("volume_control").value = volume
			replace_complete_area("音量: "+volume+"%")
			event.preventDefault();
			break;
		case "ArrowUp":
			if(event.shiftKey){
				skip = 2;
				update_skip();
				event.preventDefault();
				return;
			}else{

				if(OPTION_ACCESS_OBJECT['disable-up-down-shortcut']){
					event.preventDefault();
					return;
				}
				volume = player.getVolume();
				volume += 10;
			}
			if(volume > 100) {volume = 100;}
			player.setVolume(volume);
			localStorage.setItem('volume_storage', volume);
			document.getElementById("volume").textContent = volume;
			document.getElementById("volume_control").value = volume
			replace_complete_area("音量: "+volume+"%")
			event.preventDefault();
			break;
		case "ArrowLeft" :
			if(!event.altKey){
				if(event.ctrlKey && event.shiftKey){
					player.difftime -= 0.01
				}else if(play_mode == "practice" && event.ctrlKey) {
					if(!seek_line_flag){
						line_move_flag = true
					}
					n = seek_line_flag || count == logcount ? -1 : -2

					if(last_seek_line_count == count){
						n++;
					}
					let count_adjust = line_move_flag && count > logcount ? count + 1 : count
					let clone
					while ( document.querySelector('[number="'+(count_adjust+n)+'"]') == null && (count_adjust+n) >= logcount) {n--;}
					if(count_adjust < logcount){return;}
					if(count_adjust > logcount){
						last_seek_time = document.querySelector('[number="'+(count_adjust+n)+'"]').getAttribute('value') - (count_adjust+n > 0 ? 1 : 0)
						last_seek_line_count = Number(document.querySelector('[number="'+(count_adjust+n)+'"]').getAttribute('number')) - (count_adjust+n > 0 ? 1 : 0)
						clone = document.querySelector('[number="'+(last_seek_line_count+(count_adjust+n > 0 ? 1 : 0))+'"]').cloneNode(true)
					}else{
						last_seek_time = document.querySelector("#typing-line-result [number]").getAttribute('value')-1
						last_seek_line_count = Number(document.querySelector("#typing-line-result [number]").getAttribute('number')) - (logcount-1?1:0)
						clone = document.querySelector("#typing-line-result [number]").cloneNode(true)
					}
					seek_line_set(clone)
					seek_practice_line(last_seek_time,last_seek_line_count)
					replace_complete_area("◁")
					time_count = 0
					bar_base_update_count = 0
					count_adjust = line_move_flag ? count : count

					add_line_typingword(count_adjust)
					if(line_input.length > 0){ add_next_char(false) }
					updateLineView_typing(true)
					next_typing_kashi_check(count_adjust+1)
					line_move_flag = false
					event.preventDefault();
					break;
				}else{

					if(OPTION_ACCESS_OBJECT['disable-left-right-shortcut']){
						event.preventDefault();
						return;
					}
					player.difftime -= 0.1
				}
				if(player.difftime < -4.0) {player.difftime = -4.0;}
				player.difftime = Math.round(player.difftime* 100)/100
				document.getElementById("time_diff").textContent = player.difftime.toFixed(2);
				replace_complete_area(`時間調整　`+player.difftime.toFixed(2))
			}
			event.preventDefault();
			break;
		case"ArrowRight":
			if(!event.altKey){
				if(event.ctrlKey && event.shiftKey){
					player.difftime += 0.01
				}else if(play_mode == "practice" && event.ctrlKey){
					n = seek_line_flag || count - logcount == -1 ? 1 : 0
					if(last_seek_line_count == count){
						n++;
					}
					while ( document.querySelector('[number="'+(count+n)+'"]') == null && lyrics_array.length-1 > (count+n)) {n++;}
					if(lyrics_array.length-2 < (count+n)){return;}
					let clone
					if(count>=logcount || seek_line_flag){
						last_seek_time = document.querySelector('[number="'+(count+n)+'"]').getAttribute('value')-1
						last_seek_line_count = Number(document.querySelector('[number="'+(count+n)+'"]').getAttribute('number'))-1
						clone = document.querySelector('[number="'+(last_seek_line_count+1)+'"]').cloneNode(true)
					}else{
						last_seek_time = document.querySelector("#typing-line-result [number]").getAttribute('value')-1
						last_seek_line_count = Number(document.querySelector("#typing-line-result [number]").getAttribute('number'))-1
						clone = document.querySelector("#typing-line-result [number]").cloneNode(true)
					}
					seek_line_set(clone)
					seek_practice_line(last_seek_time,last_seek_line_count)
					replace_complete_area("▷")
					add_line_typingword(count)
					if(line_input.length > 0){ add_next_char(false) }
					updateLineView_typing(true)
					next_typing_kashi_check(count+1)
					event.preventDefault();
					break;
				}else{

					if(OPTION_ACCESS_OBJECT['disable-left-right-shortcut']){
						event.preventDefault();
						return;
					}
					player.difftime += 0.1
				}
				if(player.difftime > 4.0) {player.difftime = 4.0;}
				player.difftime = Math.round(player.difftime* 100)/100
				document.getElementById("time_diff").textContent = player.difftime.toFixed(2);
				replace_complete_area(`時間調整　`+player.difftime.toFixed(2))			}
			event.preventDefault();
			break;
		case "F4": //F4でやり直し
			(play_mode == "normal" ? song_reset:practice_retry)();
			event.preventDefault();
			break;
		case "F7": //F7で練習モードに切り替え
			if(play_mode == "normal"){
				if(document.getElementById("typing-line-list-container") != null){document.getElementById("typing-line-list-container").remove()}
				move_practice_mode()
			}
			event.preventDefault();
			break;
		case "F9": //F9で低速(練習モード)
			if(play_mode=="practice"){
				play_speed_down()
				replace_complete_area("x"+speed.toFixed(2))
			}
			event.preventDefault();
			break;
		case "F10" ://F10で倍速
			if(play_mode=="normal"){
				speedup();
			}else{
				play_speed_up()
				replace_complete_area("x"+speed.toFixed(2))
			}
			event.preventDefault();
			break;
		case "Escape" : //Escでポーズ
			player.pauseVideo()
			event.preventDefault();
			break;
		case "KanaMode" :
		case "Romaji" :
			if(keyboard != "mac" && !OPTION_ACCESS_OBJECT['disable-change-mode']){
				input_mode_change()
				event.preventDefault();
				break;
			}
	}
	if(event.code == skip_code && (document.getElementById("skip-guide").textContent.includes(skip_code) || document.getElementById("skip-guide").textContent.includes("Tap")) ){
		press_skip()
		if(keyboard != "mac"){
			event.preventDefault();
		}
	}
	if(event.altKey && (event.key == "ArrowLeft" || event.key == "ArrowRight")) {
		return;
	}else if(tagname != "INPUT" && (event.code=="CapsLock" || event.code=="Backquote" || event.key=="Tab" || event.key=="F3" || event.altKey || (event.code=="Space"&& keyboard != "mac") || event.code=="Backspace" || window.navigator.userAgent.indexOf('Firefox') != -1 && (event.key=="'" || event.key=="/")) ) {
		event.preventDefault();
		return;
	}
}

function press_skip(){
	if(!reset_flag){
		player.seekTo( (parseFloat(lyrics_array[count][0]) - player.difftime - 1) + (1-speed) );
	}else{
		player.seekTo( ((lyrics_array[logcount-1][0]) - player.difftime-1) + (1-speed) )
		count= logcount-2>=0 ? logcount-2 : 0
	}
	reset_flag=false;
	seeked_count = count;
	stop_count = 0;
	if(keyboard == "mac"){
		document.getElementById("tap_here").style.display = "none"
		document.getElementById("tap_here").style.opacity = "1"
	}
	document.getElementById("skip-guide").textContent = "";
	playheadUpdate();
}