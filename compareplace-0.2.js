//-----------------------------------
function onload() {
	reset_menu_table_color();
	var $before_text = localStorage.getItem("compareplace");
	$("#pre_phrase").val($before_text);

}//----------------------------------


//-----------------------------------
function change_menu_table(obj) {

	$("#target_operation").html($(obj).attr("flag"));
	reset_menu_table_color();

}//----------------------------------


//-----------------------------------
function reset_menu_table_color( ) {

	$('[name=menu_table]').removeClass('active');
	$('[name=menu_table]').removeClass('inactive');

	$('[name=menu_table]').addClass('inactive');

	target_flag = $("#target_operation").html();

	$('[flag=' + target_flag + ']').addClass('active');

	control_replace();

}//----------------------------------


//-----------------------------------
function control_replace() {
	num = $("#target_operation").html( );

	var pre_word = $("#pre_word").val();
	var pos_word = $("#pos_word").val();
	var pre_phrase = $("#pre_phrase").val(); //textarea
	var pos_phrase = "";


	if (pre_word != '') {
		switch (num) {

			//normal replace--------------
			case "1":

				pos_phrase = pre_phrase.split(pre_word).join(pos_word);
				localStorage.setItem("compareplace", pos_phrase);

				pos_phrase = encodeHTML(pos_phrase);
				$("#pos_phrase").html(pos_phrase);
			break;

				//regular expression replace--------------
			case "2":
				pos_phrase = pre_phrase.replace(new RegExp(pre_word, "g"), pos_word);
				localStorage.setItem("compareplace", pos_phrase);

				pos_phrase = encodeHTML(pos_phrase);
				$("#pos_phrase").html(pos_phrase);
			break;

			default:
			break;

		}

	} else {
		pos_phrase = pre_phrase;
		$("#pos_phrase").html(pos_phrase);
	}



}//----------------------------------


function encodeHTML(str) {

	return str
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			;
}//----------------------------------



$(function () {
	// 文字入力ファンクション
	function addStr(id, str) {
		var obj = document.getElementById(id); // オブジェクト取得
		var sPos = obj.selectionStart;		// 文字入力最初位置取得
		var ePos = obj.selectionEnd;		  // 文字入力最後位置取得
		// 指定された文字を入力する
		var addStr = obj.value.substr(0, sPos) + str + obj.value.substr(ePos);

		var cPos = sPos + str.length;
		jQuery(obj).val(addStr);	// 対象の値を変更
		obj.setSelectionRange(cPos, cPos); // 文字選択状態を初期の状態へ  
	}


	$("textarea")
		// フォーカス時の設定
		.focus(function () {
			window.document.onkeydown = function (e) {
				if (e.keyCode === 9) {   // 9 = Tab
					addStr(this.activeElement.id, "\t"); 　// \t = タブ
					e.preventDefault(); // デフォルト動作停止
				}
			}
		})
		// フォーカスが外れた時の設定
		.blur(function () {
			// 通常の動作を行うように再設定
			window.document.onkeydown = function (e) {
				return true;
			}
		});
});
