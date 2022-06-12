
//playTime
var headtime = 0;
var nowTime = 0;

//countData
var count = 0;
var seeked_count = false;
var line_input = [];
var line_input_kana = [];
var line_input_roma = [];

//speed
var speed = 1;
var play_speed = 1.0;
var DefaultPlaySpeed = 1.0;

function playheadUpdate () {
	headtime = player.getCurrentTime() + player.difftime;
	nowTime = headtime/speed
	if(seeked_count != count && !next_char[0] || reset_flag){
		skipguide()
	}

	if(lyrics_array[count][0] <= headtime){
		if(lyrics_array[count][1] == "end") {
			gameover()
			return;
		}
		//if(next_char[0]){line_result_check()}

		if(play_mode == "practice" && count>=logcount-1){practice_mode_line_update()}
		add_line_typingword(count)
		if(line_input.length > 0){ add_next_char(false) }
		updateLineView_typing(true) //canvas_lyric_update()
		//document.getElementById("skip-guide").textContent = ""
		count ++;
		time_update()
		next_typing_kashi_check(count)
		playData['completed']=false;
		tsu_flag = false
		Continuous_xtu_flag = false
		n_flag = false
		time_calculation(true)
		
	}

	if(play_mode == 'practice'){
		//リプレイ再生
		if(OPTION_ACCESS_OBJECT['replay-mode'] && last_seek_line_count < count && !seek_line_flag && playData['lineTypingLog'][count-1][push_counter] != undefined && headtime >= playData['lineTypingLog'][count-1][push_counter][2]){ practice_replay_mode() }
		//0.5秒前に止めるモード
		if( !OPTION_ACCESS_OBJECT['replay-mode'] && OPTION_ACCESS_OBJECT['practice-stop'] && last_seek_line_count < count && !seek_line_flag && next_char[0] && lyrics_array[count][0] - 0.5 <= headtime) {
			if(player.getPlayerState() == 1) {
				if(!stop_time_flag){
					stop_time=(new Date).getTime()
					stop_time_flag=true
				}
				createjs.Ticker.addEventListener("tick", time_calculation);
				player.pauseVideo();
			}
			return;
		}
	}

	time_update()
}



///////////////////
/**playheadUpdate()
*@FPS単位で呼ぶ処理 ここから---
*/

let skip_code = "Space"
let reset_flag
function skipguide(){
	//スキップ案内を表示
	//if(OPTION_ACCESS_OBJECT['skip-guide-key'] === 'skip-guide-enter-key'){skip_code = "Enter";}else{skip_code = "Space";}
	if(reset_flag&&lyrics_array[logcount-1][0]-1<=headtime){reset_flag=false;}

	if(!document.getElementById("skip-guide").textContent.includes("skip")){
		if(playData['completed'] && line_remaining_time >= 3.0 || !playData['completed'] && line_remaining_time >= 3.0 && line_playing_time >= 0.4 && (document.getElementById("count-anime").textContent == "") || reset_flag){
			if(keyboard == "mac"){
				if(document.activeElement.id == "flick-input"){
					document.getElementById("skip-guide").innerHTML = "<span style='color:rgba(255,255,255,0.53);'><i>Tap to skip. ⏩</i></span>";
					document.getElementById("tap_here").style.display = "block"
					document.getElementById("tap_here").style.opacity = "0.5"
				}
			}else{
				document.getElementById("skip-guide").innerHTML = "<span style='color:rgba(255,255,255,0.53);'><i>Type "+ skip_code +" key to skip. ⏩</i></span>";
			}
		}
	}else if(!reset_flag&&( (line_remaining_time <= 3.0 && playData['completed'] || line_remaining_time <= 1.2 && !playData['completed'] || document.getElementById("count-anime").textContent != "") && document.getElementById("skip-guide").textContent != "") ){
		document.getElementById("skip-guide").textContent = "";//(ラインクリア時は3秒)
		if(keyboard == "mac" && document.activeElement.id == "flick-input" && !document.getElementById("skip-guide").textContent.includes("Tap")){
			document.getElementById("tap_here").style.display = "none"
			document.getElementById("tap_here").style.opacity = "1"
		}
	}


}

//練習モード
let stop_time=0 //止まった時間
let stop_time_flag=false //止まったフラグ
let practice_time = 0 //ライン練習タイム
let practice_time_current = 0 //蓄積ラインタイム
let practice_speed_time = 0 //打鍵速度更新頻度フラグ



let latency = 0; //反応するまでにかかった時間
let line_playing_time = 0;//ライン経過時間
let past_playing_time = 0;//(過去の入力時間合計)
let line_remaining_time = 0;//ライン残り時間
let playing_time_current = 0;//入力時間(ライン経過時間 + 過去の入力時間合計)


function time_calculation(interval_update){
	line_remaining_time = (lyrics_array[count][0] - headtime)/speed; //ライン残り時間


	if(!playData['completed']){
		if(stop_time_flag){practice_time=(((new Date).getTime()-stop_time)/1000)+practice_time_current}
		line_playing_time = (count - 1) > -1 ? (headtime - lyrics_array[count - 1][0])/speed+practice_time:headtime/speed+practice_time //経過ライン時間(裏ステータス)
		if(next_char[0]){
			if(playData['typing_count']-typing_count_save == 0){
				latency = line_playing_time
			}
			playing_time_current = line_playing_time + past_playing_time //タイピングワードが存在していた累計時間(裏ステータス)
			//if(interval_update && !seek_line_flag && (!stop_time_flag || stop_time_flag && practice_time - practice_speed_time >= 0.1)){
			//	typing_speed_calculation()
			//}
		}else if(!next_char){
			latency = 0
		}

	}

	if(!stop_time_flag || stop_time_flag && practice_time - practice_speed_time >= 0.1){
		//SELECTOR_ACCESS_OBJECT['remaining-time'].textContent = "残り" + line_remaining_time.toFixed(1) + "秒"
		practice_speed_time = practice_time
		line_time_count = nowTime
	}

}


function total_time_calculation(){
	//SELECTOR_ACCESS_OBJECT['total-time'].textContent = ("00" + parseInt(parseInt(nowTime) / 60)).slice(-2) + ':' + ("00" +(parseInt(nowTime) - ("00" + parseInt(parseInt(nowTime) / 60)).slice(-2) * 60)).slice(-2) + " / " + movie_mm+':'+movie_ss;
	time_count = nowTime
}




let speed_marker= "" //平均より、速ければ▲。遅ければ▼。


let typing_speed = 0; //累計打鍵速度
let line_typingspeed = 0; //ラインの打鍵速度
let line_typingspeed_rkpm = 0; //初速を無視したライン打鍵速度

let falilue_line_set_count = -1

function typing_speed_calculation(){
	line_typingspeed = Math.round( ((playData['typing_count']-typing_count_save) / line_playing_time) * 100) / 100
	line_typingspeed_rkpm = playData['typing_count']-typing_count_save == 0 ? line_typingspeed : Math.round( ((playData['typing_count']-typing_count_save) / (line_playing_time-latency)) * 100) / 100
	typing_speed = Math.round( (playData['typing_count']/playing_time_current) * 100) / 100

	if(line_playing_time <=1 && !playData['completed'] || line_typingspeed == typing_speed || !next_char){
		speed_marker=""
	}else if(typing_speed>line_typingspeed || (typing_speed>line_typingspeed&&playData['completed'])){
		speed_marker="▼"
	}else if(typing_speed<line_typingspeed || (typing_speed<line_typingspeed&&playData['completed'])){
		speed_marker="▲"
	}
	//DOMに打鍵時間を表示
	//SELECTOR_ACCESS_OBJECT['type-speed'].textContent = typing_speed.toFixed(2);
	//SELECTOR_ACCESS_OBJECT['line-speed'].textContent = line_typingspeed.toFixed(2) + "打/秒" + speed_marker;
}


let time_count = 0
let line_time_count = 0




let bar_base_update_count = 0

//playheadUpdateの時間処理
function time_update(){

	if(countdown_anime){sec_countdownanime()}



	const line_meter = (count > 0 ? headtime - lyrics_array[count-1][0] : 0)
	document.getElementById("lyric-time").setAttribute('value',line_meter); //ラインバー蓄積



	if(nowTime - bar_base_update_count >= bar_base_update_fps){//ライン経過時間 ＆ 打鍵速度計算
		document.getElementById("total-time").setAttribute('value', headtime); //累計時間バー蓄積
		bar_base_update_count = nowTime
	}

	if(nowTime - line_time_count >= 0.1){//ライン経過時間 ＆ 打鍵速度計算
		time_calculation(true)
		if(nowTime - time_count >= 1){//曲の経過時間を[分:秒]で表示}
			total_time_calculation()
		}
	}


}


function add_line_typingword(line_number){

	line_score = 0
	practice_time = 0
	playData['lineTypingLog'] = []
	miss_count_save = playData['typingMissCount']
	typing_count_save = playData['typing_count']
	countdown_anime = false //カウントダウンフラグOFF
	already_input = "";
	already_input_roma = "";
	next_char = ""

	for(let i=0;i<document.getElementsByClassName("correct-input").length;i++){
		document.getElementsByClassName("correct-input")[i].style.color = "#0099CC"
	}
	line_input = typing_array[line_number].slice();
	line_input_roma = typing_array_roma[line_number].slice();
	line_input_kana = typing_array_kana[line_number].slice();
	if(kana_mode){
		if(/←|↓|↑|→|『|』/.test(line_input_kana.join(""))){
			for(h=0;h<line_input_kana.length;h++){
				const convert_target = kana_mode_convert_rule_before.indexOf(line_input_kana[h])
				if(convert_target >= 0){
					line_input_kana[h] = kana_mode_convert_rule_after[convert_target]
				}
			}
		}

		if(OPTION_ACCESS_OBJECT['dakuten-handakuten-split-mode']){
			line_input_kana = daku_handaku_join(false,false,line_input_kana)
		}
	}

}


	function next_typing_kashi_check(line_number){

		/*
		if(typing_array_kana[line_number-1].join("").indexOf(" ") < 0){
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.remove('eng_word')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.remove('eng_word')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.add('jp_word')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.add('jp_word')
		}else{
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.remove('jp_word')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.remove('jp_word')
			SELECTOR_ACCESS_OBJECT['kashi_sub'].classList.add('eng_word')
			SELECTOR_ACCESS_OBJECT['kashi_roma'].classList.add('eng_word')
		}
		*/
	
		document.getElementById("lyric-time").setAttribute('max', lyrics_array[line_number][0] - lyrics_array[line_number-1][0]);
		document.getElementById("lyrics").innerHTML = '<ruby>　<rt>　</rt></ruby>'+lyrics_array[line_number-1][1];
	
		/*
		//次の歌詞を表示↓
		//displayNextLyric(line_number)
		if(typing_array_kana[line_number][0]){
			if(!next_char && OPTION_ACCESS_OBJECT['countdown-effect'] && !lyrics_array[line_number-1][1]){countdown_anime = true}
			//次ラインの打鍵速度を計算して表示
			next_kpm = (line_difficulty_data[line_number]*speed)
			SELECTOR_ACCESS_OBJECT['next-kpm'].innerHTML = "<span id='kpm_color' style='color:"+OPTION_ACCESS_OBJECT['next-lyric-color']+";'>&nbsp;NEXT:<span class='next_kpm_value'>"+next_kpm.toFixed(2)+"</span>打/秒</span>";
		}else{
			SELECTOR_ACCESS_OBJECT['next-kpm'].innerHTML = "&nbsp;";
		}
		*/
	}

	function displayNextLyric(lineCount){
		if(OPTION_ACCESS_OBJECT['next-lyric-display-option'] === 'next-text-kana'){
			SELECTOR_ACCESS_OBJECT['kashi_next'].innerHTML = lyrics_array[lineCount][1] != 'end' && !typing_array_kana[lineCount][0] && lyrics_array[lineCount][0].substr( -6, 1 ) != "." ? '<ruby>　<rt>　</rt></ruby>' : '<ruby>　<rt>　</rt></ruby>'+typing_array_kana[lineCount].join('');
		}else{
			SELECTOR_ACCESS_OBJECT['kashi_next'].innerHTML = lyrics_array[lineCount][1] != 'end' && !typing_array_kana[lineCount][0] && lyrics_array[lineCount][0].substr( -6, 1 ) != "." ? '<ruby>　<rt>　</rt></ruby>' : '<ruby>　<rt>　</rt></ruby>'+lyrics_array[lineCount][1];
		}
	}