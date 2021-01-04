var data = '';
var recipient = ''
var table = '';
$(function() {
	table = $('#example').DataTable({
		language : {
			"paginate" : {
				"first" : "ホーム",
				"last" : "最後のページ",
				"previous" : "前のページ",
				"next" : "次のページ"
			},
			"processing" : "ロード中...",
			"emptyTable" : "まだデータがありません",
			"info" : "合計 _PAGES_ ページ  _TOTAL_ 個ディバイス",
			"infoEmpty" : "まだデータがありません",
			"emptyTable" : "処理するデータがありません...",
			"search" : "検索：",
			"infoFiltered" : " ——   _MAX_ 個のデータから絞り込む",
			"zeroRecords" : "レコードが見つかりません"
		},
		ajax : "/ajax/list",
		columns : [ {
			"orderable" : true,
			"data" : "no",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "ukeirebi",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "kubun",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "imei",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "kanribango",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "tenwabango",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "hakkotanto",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "hakkobi",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "hakkosaki",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "hakkosakitantosha",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "renrakusen",
			'sClass' : "text-center"
		}, {
			"orderable" : true,
			"data" : "riyokaishibi",
			'sClass' : "text-center"
		} ]
	});
	$('#example tbody').on(
			'click',
			'tr',
			function() {
				data = table.row(this).data();
				console.log(data);
				if(data != null){
					document.getElementById("deviceUpdbtn").removeAttribute("disabled");
					document.getElementById("deviceDelbtn").removeAttribute("disabled");
			        if ( $(this).hasClass('selected') ) {
			            $(this).removeClass('selected');
			            setButtonDis();
			        }
			        else {
			        	table.$('tr.selected').removeClass('selected');
			            $(this).addClass('selected');
			        }
				}
			});
	setButtonDis();
	$("#btnIdents").click(function() {
		var input = document.querySelector(".controls input[type=file]");
		if (input.files) {
			decode(URL.createObjectURL(input.files[0]));
		}
	});

	$("#addedit").on("show.bs.modal", function(e) {
		var button = $(e.relatedTarget);
		recipient = button.data("whatever");
		console.log(data);
		if (recipient == "add") {
			$('#no').val('');
			$('#ukeirebi').val('');
			$('#kubun').val('SimCard');
			$('#kubun').selectpicker('val',('SimCard'));
			$('#imei').val('');
			$('#kanribango').val('');
			$('#tenwabango').val('');
			$('#hakkotanto').val('');
			$('#hakkobi').val('');
			$('#hakkosaki').val('');
			$('#hakkosakitantosha').val('');
			$('#renrakusen').val('');
			$('#riyokaishibi').val('');
			$('#riyomokuteki').val('');
			$('#gaiyo').val('');
			$('#biko').val('');
		}else {
			$('#no').val(data.no);
			$('#ukeirebi').val(data.ukeirebi);
			$('#kubun').val(data.kubun);
			$('#kubun').selectpicker('val',(data.kubun));
			$('#imei').val(data.imei);
			$('#kanribango').val(data.kanribango);
			$('#tenwabango').val(data.tenwabango);
			$('#hakkotanto').val(data.hakkotanto);
			$('#hakkobi').val(data.hakkobi);
			$('#hakkosaki').val(data.hakkosaki);
			$('#hakkosakitantosha').val(data.hakkosakitantosha);
			$('#renrakusen').val(data.renrakusen);
			$('#riyokaishibi').val(data.riyokaishibi);
			$('#riyomokuteki').val(data.riyomokuteki);
			$('#gaiyo').val(data.gaiyo);
			$('#biko').val(data.biko);

		}
	});

	$("#delete").on("show.bs.modal", function(e) {
		var button = $(e.relatedTarget);
		recipient = button.data("whatever");
		$('#no').val(data.no);

	});
	$('#datetimepicker1').datetimepicker({
		format : 'YYYY-MM-DD',
		locale : moment.locale('ja')
	});
	$('#datetimepicker2').datetimepicker({
		format : 'YYYY-MM-DD',
		locale : moment.locale('ja')
	});
	$('#datetimepicker3').datetimepicker({
		format : 'YYYY-MM-DD',
		locale : moment.locale('ja')
	});

});

function decode(src) {
	var config = {
		inputStream : {
			size : 800,
			singleChannel : false
		},
		locator : {
			patchSize : "medium",
			halfSample : true
		},
		decoder : {
			readers : [ {
				format : "code_128_reader",
				config : {}
			} ]
		},
		locate : true,
		src : src
	}

	Quagga.decodeSingle(config, function(result) {
		if (!result) {
			alert("写真にバーコードはありません！");
			return false;
		}
		if (result.codeResult) {
			document.getElementById("imei").value = result.codeResult.code;
		} else {
			alert("画像内のバーコードが認識されない！");
		}
	});
}

function kakuninn() {
	if (recipient == "add") {
		$.post("ajax/adddev",setData(),function(result){
			table.ajax.reload(null, false);
			$('#addedit').modal('hide');
		});
	}

	if (recipient == "edit") {
		$.post("/ajax/editdev",setData(),function(result){
			table.ajax.reload(null, false);
			$('#addedit').modal('hide');
		});
	}

	if (recipient == "del") {
		$.post("/ajax/deldev",setData(),function(result){
			table.ajax.reload(null, false);
			$('#delete').modal('hide');
		});
	}
	setButtonDis();
}

function setData() {
	var data = {
		"no":$('#no').val(),
		"ukeirebi" :$('#ukeirebi').val(),
		"kubun" : $('#kubun').val(),
		"imei" :$('#imei').val(),
		"kanribango" :$('#kanribango').val(),
		"tenwabango" :$('#tenwabango').val(),
		"hakkotanto" :$('#hakkotanto').val(),
		"hakkobi" :$('#hakkobi').val(),
		"hakkosaki" :$('#hakkosaki').val(),
		"hakkosakitantosha" :$('#hakkosakitantosha').val(),
		"renrakusen" :$('#renrakusen').val(),
		"riyokaishibi" :$('#riyokaishibi').val(),
		"riyomokuteki" :$('#riyomokuteki').val(),
		"gaiyo" :$('#gaiyo').val(),
		"biko" :$('#biko').val()
	}
	return data;
}

function setButtonDis() {
	document.getElementById("deviceUpdbtn").setAttribute("disabled", true);
	document.getElementById("deviceDelbtn").setAttribute("disabled", true);
}
