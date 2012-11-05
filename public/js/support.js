(function ($) {
	var chatMessage = function  (message, type) {
		if(!message) return false;
		var $li;
		if (type === 'sup') {
			$li = '<li class="sup"><b>Вы: </b> ' + message + '</li>';			
		} else if (type === 'cli') {
			$li = '<li class="client"><b>Клиент:</b> ' + message + '</li>';
		}
		$('#chat-log').append($li);			
	};
	var sendMessage = function() {
		var $message = $('#chat-box').val();
		socket.emit('message', {
			me: 'support',
			chatlog: $message
		});
		chatMessage($message, 'sup');
		$('#chat-box').val('').focus();			
	}
	var getUserScreen = function(url) {
		if(!url) return false;
		$('#viewport').html('');
		$('#viewport').append('<img src="' + url + '" />');
		$('<div></div>',{
			class : 'cursor'
			}).appendTo('#viewport');
	}
			
	var showClick = function(x, y) {
		$('.cursor').css({
			"left": x,
			"top": y
		}).stop(true).fadeIn(300).fadeOut(300);
	}
	
	var requestSupport = function(request) {
		if(!request) return false;
		$('#request').fadeIn(200);
		$('#overlay').fadeIn(200);		
		$('#request button').on('click', function () {
			var $this = $(this),
				$request = $this.data('request');
			socket.emit('message', {
				me: 'support',
				request: $request
			});
			$('#request').fadeOut(200);
			$('#overlay').fadeOut(200);
		});
	}
		
	var socket = io.connect('http://localhost:8080');
	
	socket.on('message', function (message) {
		requestSupport(message.request);
		getUserScreen(message.userScreen);
		chatMessage(message.chatlog,'cli');
	});

	$('#chat-box').keypress(function(e) {
		if (e.which == 13) 
			sendMessage()
	});		
	$('#send').click(sendMessage);

	$('#viewport').click(function (e) {
		var x = e.pageX - this.offsetLeft + this.scrollLeft;
		var y = e.pageY - this.offsetTop + this.scrollTop;
		socket.emit('message', {
			me: 'support',
			clickX: x,
			clickY: y
		});
		showClick(x,y);
	});
})(jQuery);