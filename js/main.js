





//mode
var mode = "kana";
var play_mode = "normal";
var keyboard = 'normal';
var kana_mode = false;

//play
var is_played = false;
var finished = false;
var pause_flag = false;




function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
	  height: '180',
	  width: '360',
	playerVars: {
	  start: 0,
	  startSeconds: 0,
	  playsinline: 1,
	  controls: 0,
	  fs: 20,
	  disablekb: 1,
	  rel: 0,
	  origin: location.protocol + '//' + location.hostname + "/"
	},
	videoId: 'kp-plPYAPq8',
	events: {
	  'onReady': onPlayerReady,
	  'onStateChange': onPlayerStateChange,
	}
  });
  player.difftime = 0.0;
}
//YouTubeプレイヤーの準備が完了した時に処理
function onPlayerReady (event) {
	player.setVolume(70);
	createTypingData();
}

function onPlayerStateChange (event) {

	switch(event.data){
		case 1: //再生(player.playVideo)
			if(!is_played) {//プレイ開始
				is_played = true;
				play_movie();
				document.activeElement.blur();
			} else {//ポーズから復帰
				if(pause_flag && (!OPTION_ACCESS_OBJECT['replay-mode'] ||OPTION_ACCESS_OBJECT['replay-mode'] && !playData['lineTypingLog'][count-1][push_counter])){
					replace_complete_area("▶")
				}
				pause_flag = false
				createjs.Ticker.addEventListener("tick", playheadUpdate);
				window.removeEventListener('keydown',esc_play_movie,true);
				window.removeEventListener('keydown',miss_limit_mode_space_disable,true);
				window.removeEventListener("keyup", set_preview_video,true);
				if(keyboard == "mac"){
					document.getElementById("kashi_area").addEventListener("click",press_skip,false)
				}else{
					document.getElementById("skip-guide").addEventListener("click",press_skip,false)
				}
				if(SELECTOR_ACCESS_OBJECT['flick-input']){
					window.addEventListener("keydown",key_device_disabled)
					SELECTOR_ACCESS_OBJECT['flick-input'].addEventListener('input',keydownfunc,true);
					SELECTOR_ACCESS_OBJECT['flick-input-second'].addEventListener('input',keydownfunc,true);
				}else{
					window.addEventListener('keydown',keydownfunc,true);
				}
			}

			break;
		case 0 && !finished ://プレイ終了(player.stopVideo)
		case -1 && finished && !type_per_min:
		case finished && 2 :
			finished = true;

			if(!type_per_min){
				document.getElementById("movie_cover_black_layer").style.display = "block"
				document.getElementById("movie_cover").style.display = "block"

				document.getElementById("movie_cover").classList.remove('anim-box_out','fadeout','is-animated_out');

				document.getElementById("movie_cover").classList.add('anim-box','fadein','is-animated');
				not_play_event()
				window.addEventListener('keydown',retry_movie,true);
				type_per_min=typing_speed*60
				if(SELECTOR_ACCESS_OBJECT['flick-input']){kana_mode=false}
				if(next_char[0]){line_result_check()}
				if(play_mode != "practice"){
					window.addEventListener('keydown',enter_ranking_entry,true);
					typing_result_status();
					typing_result_generator()
				}
				window.addEventListener("keyup", set_preview_video,true);
				document.getElementById("preview_shortcut").style.visibility = "visible"
				finish_comment();
			}
			break;
		case !finished && 2 : //一時停止(player.pauseVideo)
			if(!OPTION_ACCESS_OBJECT['replay-mode'] ||OPTION_ACCESS_OBJECT['replay-mode'] && !playData['lineTypingLog'][count-1][push_counter]){
				replace_complete_area("ll")
			}

			pause_flag = true
			if(!SELECTOR_ACCESS_OBJECT['flick-input']){play_focus()}
			if (!stop_time_flag) { //練習モードで止まってない
				window.addEventListener('keydown',esc_play_movie,true);
				window.addEventListener("keyup", set_preview_video,true);
				document.getElementById("preview_shortcut").style.visibility = "visible"
				not_play_event()
			}
			break;
		case 3 : //スキップ(player.seekTo)
			break;
	}
}


function play_movie () {

	createjs.Ticker.addEventListener("tick", playheadUpdate);
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
		window.addEventListener('keydown',keydownfunc,true);
	add_line_typingword(count)
}

