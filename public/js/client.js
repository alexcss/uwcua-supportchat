(function ($) {
	$('body').append('<button class="get-support">Онлайн<br>поддержка</button>');
	$('.get-support').click(function () {
		$(this).removeAttr('disabled').attr('disabled', 'disabled');
		$('<div></div>', {
			id: 'support',
			html: '<h5>Онлайн поддежка</h5><div id="chat-room"><div><ul id="chat-log"><li class="sup"><b>Оператор: </b>Чем могу помочь?</li></ul></div><textarea id="chat-box" placeholder="Ваш вопрос"></textarea><button id="send">Отправить</button></div><div class="loading">Соединяем со<br>службой поддержки...</div><div class="close">x</div>'
		}).appendTo('body');
	$('#support').animate({'left':0},100);
	initChat();
	});

	var initChat = function() {

		var chatMessage = function(message, type) {
			if(!message) return false;
			var $li;
			if (type === 'sup') {
				$li = '<li class="sup"><b>Оператор: </b> ' + message + '</li>';			
			} else if (type === 'cli') {
				$li = '<li class="client"><b>Вы:</b> ' + message + '</li>';
			}
			$('#chat-log').append($li);			
		};
		
		var sendMessage = function() {
			var $message = $('#chat-box').val();
			socket.emit('message', {
				me: 'client',
				chatlog: $message
			});
			chatMessage($message, 'cli');
			$('#chat-box').val('').focus();			
		}
		
		var showClick = function(x, y) {
			if(!x) return false;
			$('.cursor').css({
				"left": x,
				"top": y
			}).stop(true).fadeIn(300).fadeOut(300);
		}
		
		var socket = io.connect('http://localhost:8080');

		socket.emit('message', {
			me: 'client',
			request: 'support'
		});
		socket.on('message', function (message) {
			if (message.request == 'accept') {
				$('.loading').fadeOut(200).remove();
				$('#chat-room').fadeIn(200);
				$('body .container').append('<div class="cursor"></div>');
				html2canvas($('.container'), {
					onrendered: function (canvas) {
						//получаем картинку из canvas
						var $screenshotUrl = canvas.toDataURL();
						//отправляем URL скриншота на сервер
						socket.emit('message', {
							me: 'client',
							userScreen: $screenshotUrl
						});
					}
				});
			} else if (message.request == 'reject') {
				$('.loading').text('Ваш запрос отклонен');
				return false;
			}
			chatMessage(message.chatlog,'sup');
			showClick(message.clickX, message.clickY);
		});

		$('#chat-box').keypress(function(e) {
			if (e.which == 13) 
				sendMessage()
		});		
		$('#send').click(sendMessage);
		
		$('#support .close').click(function() {
			$('#support').animate({'left':-255},200,function(){
				$('#support').remove();
				$('.get-support').removeAttr('disabled');					
			});
		});
	};
})(jQuery);