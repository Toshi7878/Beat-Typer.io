let bar_base_update_fps = 0 // total-timeの更新頻度
let movie_mm = 0 // 総合動画時間(分)
let movie_ss = 0 // 総合動画時間(秒)
let movieSpeed = 1 //動画のスピード
var movieTotalTime = 0;
var typing_array = [];
var typing_array_kana = [];
var typing_array_roma = [];
var score_per_char = 0.0;
//タイピングデータ作成
let lyricsData
function createTypingData() {
	fetch("lyrics/ロミオとシンデレラ.txt").then(function(response) {
		return response.text()
	}).then(function(data) {
		lyricsData = data.replace(/\r/g, "");
		parseLyrics(lyricsData);
		});
  }

function parseLyrics (data) {
	abridgement_word_length = 0
	let	array_generator = ""

	typing_array_kana = new Array;
	typing_array_roma = new Array;
	typing_array = new Array;
	lyrics_array = new Array;
	const lines = data.split("\n");
	const lines_length = lines.length
	const ROMA_MAP_length = ROMA_MAP.length
	for (let s=1; s<lines_length; s++){
		a = lines[s].split("\t");

		if(s == 1){
			if(!lyrics_array[0] && +a[0] > 0 ){
				a = ["0", "", ""]
				s--
			}
			map_style = a[1].match(/<style(?: .+?)?>.*?<\/style>/g)
		}

		if(a.length <= 2){
			a.push("")
		}

		array_generator += a[2].replace(/[ 　]+$/,"").replace(/^[ 　]+/,"")+"\n"
		lyrics_array.push(a);

		if(a[1] == "end" && !movieTotalTime) {
			movieTotalTime = parseInt(a[0]);
			document.getElementById("total-time").setAttribute('max', movieTotalTime);
			bar_base_update_fps = movieTotalTime/1700
			movie_mm =("00" + parseInt(parseInt(movieTotalTime) / 60)).slice(-2)
			movie_ss = ("00" +(parseInt(movieTotalTime) - movie_mm * 60)).slice(-2)
			speed = 1
			break;
		}
	};

	array_generator = array_generator
		.replace(/…/g,"...")
		.replace(/‥/g,"..")
		.replace(/･/g,"・")
		.replace(/〜/g,"～")
		.replace(/｢/g,"「")
		.replace(/｣/g,"」")
		.replace(/､/g,"、")
		.replace(/｡/g,"。")
		.replace(/　/g," ")
		.replace(/ヴ/g,"ゔ")
		.replace(/－/g,"ー")
	for (let i=0; i<ROMA_MAP_length; i++){
		if(ROMA_MAP[i].length > 1){
			array_generator = array_generator.replace(RegExp(ROMA_MAP[i][0],"g"),"\t"+i+"\t");
		}
	};

	array_generator = array_generator.split("\n")

	for(let m=0;m<lyrics_array.length;m++){
		if(array_generator[m] && lyrics_array[m][1] != "end"){
			const arr = hiraganaToRomaArray(array_generator[m]);
			typing_array.push(arr[0]);
			typing_array_kana.push(arr[1]);
			typing_array_roma.push(arr[2]);
		} else {
			typing_array.push([]);
			typing_array_kana.push([]);
			typing_array_roma.push([]);
		}
	}
	return lyrics_array;
}

//typing_array,typing_array_roma,typing_array_kanaの生成
let abridgement_word_length = 0
let zenkaku_list = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９", "Ａ", "Ｂ", "Ｃ", "Ｄ", "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ", "Ｎ", "Ｏ", "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", "Ｙ", "Ｚ", "ａ", "ｂ", "ｃ", "ｄ", "ｅ", "ｆ", "ｇ", "ｈ", "ｉ", "ｊ", "ｋ", "ｌ", "ｍ", "ｎ", "ｏ", "ｐ", "ｑ", "ｒ", "ｓ", "ｔ", "ｕ", "ｖ", "ｗ", "ｘ", "ｙ", "ｚ", "～", "＆", "％", "！", "？", "＠", "＃", "＄", "（", "）", "｜", "｛", "｝", "｀", "＊", "＋", "：", "；", "＿", "＜", "＞", "＝", "＾"]
const sokuon_join = ["ヰ", "ゐ", "ヱ", "ゑ","ぁ", "ぃ", "ぅ", "ぇ", "ぉ","ゃ","ゅ","ょ","っ", "ゎ", "ヵ", "ヶ", "ゔ", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"]
const imperfect_sokuon_join = ["い", "う", "ん"]
const imperfect_sokuon_roma_list = ["i","u","n"]
const nn_list = ["あ", "い", "う", "え", "お", "な", "に", "ぬ", "ね", "の", "や", "ゆ", "よ", "ん", "'", "’"]
function hiraganaToRomaArray (str) {

	var str_array = [];
	var kana_array = [];
	var roma_array = [];
	str = str.split("\t").filter(word => word > "")
	const str_length = str.length

	for (let i=0; i<str_length; i++){
		if(ROMA_MAP[parseInt(str[i])]){
			kana_array.push(ROMA_MAP[parseInt(str[i])][0]);
			str_array.push(ROMA_MAP[parseInt(str[i])].slice(1));
			roma_array.push(ROMA_MAP[parseInt(str[i])][1]);
			//促音の打鍵パターン
			if(kana_array.length >= 2 && kana_array[kana_array.length-2][kana_array[kana_array.length-2].length-1]=="っ"){
				if(sokuon_join.includes(kana_array[kana_array.length-1][0])){
					const xtu_times = ( kana_array[kana_array.length-2].match( /っ/g ) || [] ).length

					kana_array[kana_array.length-1] = kana_array[kana_array.length-2] + kana_array[kana_array.length-1]
					kana_array.splice(-2,1)
					const length = str_array[str_array.length-1].length
					let repeat = []
					let xtu = []
					let ltu = []
					let xtsu = []
					let ltsu = []
					for(let s = 0;s<length;s++){
						repeat.push(str_array[str_array.length-1][s][0].repeat(xtu_times)+str_array[str_array.length-1][s])
						xtu.push("x".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
						ltu.push("l".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
						xtsu.push("x".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
						ltsu.push("l".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
					}

					str_array[str_array.length-1] = [...repeat,...xtu,...ltu,...xtsu,...ltsu]
					str_array.splice(-2,1)

					roma_array[roma_array.length-1] = str_array[str_array.length-1][0]
					roma_array.splice(-2,1)
				}else if(imperfect_sokuon_join.includes(kana_array[kana_array.length-1][0])){
					const xtu_times = ( kana_array[kana_array.length-2].match( /っ/g ) || [] ).length

					kana_array[kana_array.length-1] = kana_array[kana_array.length-2] + kana_array[kana_array.length-1]
					kana_array.splice(-2,1)

					const length = str_array[str_array.length-1].length
					let repeat = []
					let xtu = []
					let ltu = []
					let xtsu = []
					let ltsu = []
					for(let s = 0;s<length;s++){
						if(!imperfect_sokuon_roma_list.includes(str_array[str_array.length-1][s][0])){
							repeat.push(str_array[str_array.length-1][s][0].repeat(xtu_times)+str_array[str_array.length-1][s])
						}
						xtu.push("x".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
						ltu.push("l".repeat(xtu_times)+"tu"+str_array[str_array.length-1][s])
						xtsu.push("x".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
						ltsu.push("l".repeat(xtu_times)+"tsu"+str_array[str_array.length-1][s])
					}

					str_array[str_array.length-1] = [...repeat,...xtu,...ltu,...xtsu,...ltsu]
					str_array.splice(-2,1)

					roma_array[roma_array.length-1] = str_array[str_array.length-1][0]
					roma_array.splice(-2,1)
				}
			}


			//n→nn変換
			const n_kana_check = kana_array[kana_array.length-2]
			if(n_kana_check && n_kana_check[n_kana_check.length-1]=="ん"){
				if(nn_list.includes(kana_array[kana_array.length-1][0])){
					for(let n=0;n<str_array[str_array.length-2].length;n++){
						const str_pattern = str_array[str_array.length-2][n]
						if((str_pattern.length >= 2 && str_pattern[str_pattern.length-2] != "x" && str_pattern[str_pattern.length-1] == "n") || str_pattern=="n"){
							str_array[str_array.length-2][n] = str_array[str_array.length-2][n]+"n"
						}
					}
					roma_array[roma_array.length-2] = str_array[str_array.length-2][0]
					//それ以外の文字でもnnの入力を可能にする
				}else if(kana_array[kana_array.length-1]){
					const array_length = str_array[str_array.length-1].length
					for (let i=0; i<array_length; i++){
						str_array[str_array.length-1].push("n"+str_array[str_array.length-1][i])
						str_array[str_array.length-1].push("'"+str_array[str_array.length-1][i])
					}
				}
			}

		} else{

			//打鍵パターン生成を行わなくて良い文字はそのままtyping_arrayに追加
			for (let v=0; v<str[i].length; v++){
				kana_array.push( str[i][v] );
				let typing_character = str[i][v]
				if(zenkaku_list.includes(str[i][v])){
					typing_character = String.fromCharCode(typing_character.charCodeAt(0) - 0xFEE0);
				}
				roma_array.push(typing_character);
				if(/[A-Z]/.test(typing_character) ){
					typing_character = typing_character.toLowerCase()
				}
				str_array.push( [typing_character] );



				//n→nn変換
				if(v == 0){

					//ん
					const n_kana_check = kana_array[kana_array.length-2]
					//「アルファベット シングルクォート」の [n] 非対応の文字がkana_arrayに追加されたとき、 [n]→[nn] に置き換えます。
					if(n_kana_check && n_kana_check[n_kana_check.length-1]=="ん"){
						if(/[a-zA-Zａ-ｚＡ-Ｚ]/.test(kana_array[kana_array.length-1])||nn_list.includes(kana_array[kana_array.length-1][0])){
							for(let n=0;n<str_array[str_array.length-2].length;n++){
								const str_pattern = str_array[str_array.length-2][n]
								if((str_pattern.length >= 2 && str_pattern[str_pattern.length-2] != "x" && str_pattern[str_pattern.length-1] == "n") || str_pattern=="n"){
									str_array[str_array.length-2][n] = str_array[str_array.length-2][n]+"n"
								}
							}
							roma_array[roma_array.length-2] = str_array[str_array.length-2][0]
							//それ以外の文字でもnnの入力を可能にする
						}else if(kana_array[kana_array.length-1]){
							const array_length = str_array[str_array.length-1].length
							for (let i=0; i<array_length; i++){
								str_array[str_array.length-1].push("n"+str_array[str_array.length-1][i])
								str_array[str_array.length-1].push("'"+str_array[str_array.length-1][i])
							}
						}
					}
				}

			}
		}

	};

	//kana_array最後の文字が「ん」だった場合も[nn]に置き換えます。
	if(kana_array[kana_array.length-1] == "ん"){
		roma_array.splice(-1,1,'nn')
		str_array[str_array.length-1][0] = 'nn'
		str_array[str_array.length-1].push("n'")
	}
	return [str_array, kana_array, roma_array];
}



const ROMA_MAP = [
	["0", "0"],
	["1", "1"],
	["2", "2"],
	["3", "3"],
	["4", "4"],
	["5", "5"],
	["6", "6"],
	["7", "7"],
	["8", "8"],
	["9", "9"],
	["ぎゃ", "gya", "gilya", "gixya"],
	["ぎぃ", "gyi", "gili", "gixi", "gilyi", "gixyi"],
	["ぎゅ", "gyu", "gilyu", "gixyu"],
	["ぎぇ", "gye", "gile", "gixe", "gilye", "gixye"],
	["ぎょ", "gyo", "gilyo", "gixyo"],
	["きゃ", "kya", "kilya", "kixya"],
	["きぃ", "kyi", "kili", "kixi", "kilyi", "kixyi"],
	["きゅ", "kyu", "kilyu", "kixyu"],
	["きぇ", "kye", "kile", "kixe", "kilye", "kixye"],
	["きょ", "kyo", "kilyo", "kixyo"],
	["ぐぁ", "gwa", "gula", "guxa"],
	["ぐぃ", "gwi", "guli", "guxi", "gulyi", "guxyi"],
	["ぐぅ", "gwu", "gulu", "guxu"],
	["ぐぇ", "gwe", "gule", "guxe", "gulye", "guxye"],
	["ぐぉ", "gwo", "gulo", "guxo"],
	["しゃ", "sya", "sha", "silya", "sixya", "shilya", "shixya", "cilya", "cixya"],
	["しぃ", "syi", "sili", "sixi", "silyi", "shixyi", "shili", "shixi", "shilyi", "shixyi", "cili", "cixi", "cilyi", "cixyi"],
	["しゅ", "syu", "shu", "silyu", "sixyu", "shilyu", "shixyu", "cilyu", "cixyu"],
	["しぇ", "sye", "she", "sile", "sixe", "silye", "sixye", "shile", "shixe", "shilye", "shixye", "cile", "cixe", "cilye", "cixye"],
	["しょ", "syo", "sho", "silyo", "sixyo", "shilyo", "shixyo", "cilyo", "cixyo"],
	["じゃ", "ja", "zya", "jya", "jilya", "jixya", "zilya", "zixya"],
	["じぃ", "zyi", "jyi", "jili", "jixi", "jilyi", "jixyi", "zili", "zixi", "zilyi", "zixyi"],
	["じゅ", "ju", "zyu", "jyu", "jilyu", "jixyu", "zilyu", "zixyu"],
	["じぇ", "je", "zye", "jye", "jile", "jixe", "jilye", "jixye", "zile", "zixe", "zilye", "zixye"],
	["じょ", "jo", "zyo", "jyo", "jilyo", "jixyo", "zilyo", "zixyo"],
	["すぁ", "swa", "sula", "suxa"],
	["すぃ", "swi", "suli", "suxi", "sulyi", "suxyi"],
	["すぅ", "swu", "sulu", "suxu"],
	["すぇ", "swe", "sule", "suxe", "sulye", "suxye"],
	["すぉ", "swo", "sulo", "suxo"],
	["ちゃ", "tya", "cya", "cha", "tilya", "tixya", "chilya", "chixya"],
	["ちぃ", "tyi", "cyi", "tili", "tixi", "tilyi", "tixyi", "chili", "chixi", "chilyi", "chixyi"],
	["ちゅ", "tyu", "cyu", "chu", "tilyu", "tixyu", "chilyu", "chixyu"],
	["ちぇ", "tye", "cye", "che", "tile", "tixe", "tilye", "tixye", "chile", "chixe", "chilye", "chixye"],
	["ちょ", "tyo", "cyo", "cho", "tilyo", "tixyo", "chilyo", "chixyo"],
	["ぢゃ", "dya", "dilya", "dixya"],
	["ぢぃ", "dyi", "dili", "dixi", "dilyi", "dixyi"],
	["ぢゅ", "dyu", "dilyu", "dixyu"],
	["ぢぇ", "dye", "dile", "dixe", "dilye", "dixye"],
	["ぢょ", "dyo", "dilyo", "dixyo"],
	["つぁ", "tsa", "tula", "tuxa", "tsula", "tsuxa"],
	["つぃ", "tsi", "tuli", "tuxi", "tulyi", "tuxyi", "tsuli", "tsuxi", "tsulyi", "tsuxyi"],
	["つぇ", "tse", "tule", "tuxe", "tulye", "tuxye", "tsule", "tsuxe", "tsulye", "tsuxye"],
	["つぉ", "tso", "tulo", "tuxo", "tsulo", "tsuxo"],
	["てゃ", "tha", "telya", "texya"],
	["てぃ", "thi", "t'i", "teli", "texi", "telyi", "texyi"],
	["てゅ", "thu", "t'yu", "telyu", "texyu"],
	["てぇ", "the", "tele", "texe", "telye", "texye"],
	["てょ", "tho", "telyo", "texyo"],
	["でゃ", "dha", "delya", "dexya"],
	["でぃ", "dhi", "d'i", "deli", "dexi", "delyi", "dexyi"],
	["でゅ", "dhu", "d'yu", "delyu", "dexyu"],
	["でぇ", "dhe", "dele", "dexe", "delye", "dexye"],
	["でょ", "dho", "delyo", "dexyo"],
	["とぁ", "twa", "tola", "toxa"],
	["とぃ", "twi", "toli", "toxi", "tolyi", "toxyi"],
	["とぅ", "twu", "t'u", "tolu", "toxu"],
	["とぇ", "twe", "tole", "toxe", "tolye", "toxye"],
	["とぉ", "two", "tolo", "toxo"],
	["どぁ", "dwa", "dola", "doxa"],
	["どぃ", "dwi", "doli", "doxi", "dolyi", "doxyi"],
	["どぅ", "dwu", "d'u", "dolu", "doxu"],
	["どぇ", "dwe", "dole", "doxe", "dolye", "doxye"],
	["どぉ", "dwo", "dolo", "doxo"],
	["にゃ", "nya", "nilya", "nixya"],
	["にぃ", "nyi", "nili", "nixi", "nilyi", "nixyi"],
	["にゅ", "nyu", "nilyu", "nixyu"],
	["にぇ", "nye", "nile", "nixe", "nilye", "nixye"],
	["にょ", "nyo", "nilyo", "nixyo"],
	["ひゃ", "hya", "hilya", "hixya"],
	["ひぃ", "hyi", "hili", "hixi", "hilyi", "hixyi"],
	["ひゅ", "hyu", "hilyu", "hixyu"],
	["ひぇ", "hye", "hile", "hixe", "hilye", "hixye"],
	["ひょ", "hyo", "hilyo", "hixyo"],
	["ぴゃ", "pya", "pilya", "pixya"],
	["ぴぃ", "pyi", "pili", "pixi", "pilyi", "pixyi"],
	["ぴゅ", "pyu", "pilyu", "pixyu"],
	["ぴぇ", "pye", "pile", "pixe", "pilye", "pixye"],
	["ぴょ", "pyo", "pilyo", "pixyo"],
	["びゃ", "bya", "bilya", "bixya"],
	["びぃ", "byi", "bili", "bixi", "bilyi", "bixyi"],
	["びゅ", "byu", "bilyu", "bixyu"],
	["びぇ", "bye", "bile", "bixe", "bilye", "bixye"],
	["びょ", "byo", "bilyo", "bixyo"],
	["ゔぁ", "va", "vula", "vuxa"],
	["ゔぃ", "vi", "vyi", "vuli", "vuxi", "vulyi", "vuxyi"],
	["ゔぇ", "ve", "vye", "vule", "vuxe", "vulye", "vuxye"],
	["ゔぉ", "vo", "vulo", "vuxo"],
	["ゔゃ", "vya", "vulya", "vuxya"],
	["ゔゅ", "vyu", "vulyu", "vuxyu"],
	["ゔょ", "vyo", "vulyo", "vuxyo"],
	["ふぁ", "fa", "fwa", "hwa", "fula", "fuxa", "hula", "huxa"],
	["ふぃ", "fi", "fwi", "hwi", "fuli", "fuxi", "fulyi", "fuxyi", "huli", "huxi", "hulyi", "huxyi"],
	["ふぅ", "fwu", "fulu", "fuxu", "hulu", "huxu"],
	["ふぇ", "fe", "fwe", "fye", "hwe", "fule", "fuxe", "fulye", "fuxye", "hule", "huxe", "hulye", "huxye"],
	["ふぉ", "fo", "fwo", "hwo", "fulo", "fuxo", "hulo", "huxo"],
	["ふゃ", "fya", "fulya", "fuxya", "hulya", "huxya"],
	["ふゅ", "fyu", "hwyu", "fulyu", "fuxyu", "hulyu", "huxyu"],
	["ふょ", "fyo", "fulyo", "fuxyo", "hulyo", "huxyo"],
	["みゃ", "mya", "milya", "mixya"],
	["みぃ", "myi", "mili", "mixi", "milyi", "mixyi"],
	["みゅ", "myu", "milyu", "mixyu"],
	["みぇ", "mye", "mile", "mixe", "milye", "mixye"],
	["みょ", "myo", "milyo", "mixyo"],
	["りゃ", "rya", "rilya", "rixya"],
	["りぃ", "ryi", "rili", "rixi", "rilyi", "rixyi"],
	["りゅ", "ryu", "rilyu", "rixyu"],
	["りぇ", "rye", "rile", "rixe", "rilye", "rixye"],
	["りょ", "ryo", "rilyo", "rixyo"],
	["いぇ", "ye", "ile", "ixe", "ilye", "ixye", "yile", "yixe", "yilye", "yixye"],
	["うぁ", "wha", "ula", "uxa", "wula", "wuxa", "whula", "whuxa"],
	["うぃ", "wi", "whi", "uli", "uxi", "ulyi", "uxyi", "wuli", "wuxi", "wulyi", "wuxyi", "whuli", "whuxi", "whulyi", "whuxyi"],
	["うぇ", "we", "whe", "ule", "uxe", "ulye", "uxye", "wule", "wuxe", "wulye", "wuxye", "whule", "whuxe", "whulye", "whuxye"],
	["うぉ", "who", "ulo", "uxo", "wulo", "wuxo", "whulo", "whuxo"],
	["くぁ", "qa", "qwa", "kwa", "kula", "kuxa", "qula", "quxa", "cula", "cuxa"],
	["くぃ", "qi", "qwi", "qyi", "kwi", "kuli", "kuxi", "kulyi", "kuxyi", "quli", "quxi", "qulyi", "quxyi", "culi", "cuxi", "culyi", "cuxyi"],
	["くぅ", "qwu", "kwu", "kulu", "kuxu", "qulu", "quxu", "culu", "cuxu"],
	["くぇ", "qe", "qwe", "qye", "kwe", "kule", "kuxe", "kulye", "kuxye", "qule", "quxe", "qulye", "quxye", "cule", "cuxe", "culye", "cuxye"],
	["くぉ", "qo", "qwo", "kwo", "kulo", "kuxo", "qulo", "quxo", "culo", "cuxo"],
	["くゃ", "qya", "kulya", "kuxya", "qulya", "quxya", "culya", "cuxya"],
	["くゅ", "qyu", "kulyu", "kuxyu", "qulyu", "quxyu", "culyu", "cuxyu"],
	["くょ", "qyo", "kulyo", "kuxyo", "qulyo", "quxyo", "culyo", "cuxyo"],
	["あ", "a"],
	["い", "i", "yi"],
	["う", "u", "wu", "whu"],
	["え", "e"],
	["お", "o"],
	["か", "ka", "ca"],
	["き", "ki"],
	["く", "ku", "cu", "qu"],
	["け", "ke"],
	["こ", "ko", "co"],
	["さ", "sa"],
	["し", "si", "ci", "shi"],
	["す", "su"],
	["せ", "se", "ce"],
	["そ", "so"],
	["た", "ta"],
	["ち", "ti", "chi"],
	["つ", "tu", "tsu"],
	["て", "te"],
	["と", "to"],
	["な", "na"],
	["に", "ni"],
	["ぬ", "nu"],
	["ね", "ne"],
	["の", "no"],
	["は", "ha"],
	["ひ", "hi"],
	["ふ", "hu", "fu"],
	["へ", "he"],
	["ほ", "ho"],
	["ま", "ma"],
	["み", "mi"],
	["む", "mu"],
	["め", "me"],
	["も", "mo"],
	["や", "ya"],
	["ゆ", "yu"],
	["よ", "yo"],
	["ら", "ra"],
	["り", "ri"],
	["る", "ru"],
	["れ", "re"],
	["ろ", "ro"],
	["わ", "wa"],
	["を", "wo"],
	["ん", "n", "xn", "n'"],
	["ゔ", "vu"],
	["が", "ga"],
	["ぎ", "gi"],
	["ぐ", "gu"],
	["げ", "ge"],
	["ご", "go"],
	["ざ", "za"],
	["じ", "zi", "ji"],
	["ず", "zu"],
	["ぜ", "ze"],
	["ぞ", "zo"],
	["だ", "da"],
	["ぢ", "di"],
	["づ", "du"],
	["で", "de"],
	["ど", "do"],
	["ば", "ba"],
	["び", "bi"],
	["ぶ", "bu"],
	["べ", "be"],
	["ぼ", "bo"],
	["ぱ", "pa"],
	["ぴ", "pi"],
	["ぷ", "pu"],
	["ぺ", "pe"],
	["ぽ", "po"],
	["ぁ", "xa", "la"],
	["ぃ", "xi", "li", "lyi", "xyi"],
	["ぅ", "xu", "lu"],
	["ぇ", "xe", "le", "lye", "xye"],
	["ぉ", "xo", "lo"],
	["ゃ", "xya", "lya"],
	["ゅ", "xyu", "lyu"],
	["ょ", "xyo", "lyo"],
	["ゎ", "xwa", "lwa"],
	["っ", "xtu", "ltu", "xtsu", "ltsu"],
	["ヵ", "xka", "lka"],
	["ヶ", "xke", "lke"],
	["←", "zh"],
	["↓", "zj"],
	["↑", "zk"],
	["→", "zl"],
	["『", "z["],
	["』", "z]"],
	["ヰ", "wyi"],
	["ゐ", "wyi"],
	["ヱ", "wye"],
	["ゑ", "wye"],
	["ー", "-"],
	["、", ","],
	["。", "."],
	["・", "/" , "z/"],
	["”", "\""],
	["“", "\""],
	["’", "'"],
	["￥", "\\"],
	["「", "["],
	["」", "]"]
];
