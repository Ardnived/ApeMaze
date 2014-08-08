
var chat = {
	rename: function() {
		player.name = document.getElementById('name_input').value;
		dispatch.emit('meta', {
			name: player.name
		});
	},
	on_rename_keypress: function(event) {
		if (event.keyCode == 13) { // Return key
			chat.rename();
		}
	},
	send: function() {
		var chat_message = document.getElementById('chat_input').value
		var date = new Date();

		dispatch.emit('chat', {
			message: chat_message
		});

		document.getElementById('chat_input').value = '';
		document.getElementById('chat_list').innerHTML += date.getHours()+":"+(date.getMinutes()<10?'0':'') + date.getMinutes()+" - "+player.name+"."+player.id+" (You) say:<br />"+chat_message+"<br />";
		document.getElementById("chat_list").scrollTop = document.getElementById("chat_list").scrollHeight;
	},
	on_send_keypress: function(event) {
		if (event.keyCode == 13) { // Return key
			chat.send();
		}
	},
	display: function(data) {
		if (typeof data.name != 'undefined') {
			document.getElementById('chat_list').innerHTML += data.send_date+' - '+ data.name + ' says:<br />' + data.message + '<br />';
		} else {
			document.getElementById('chat_list').innerHTML += "<em>"+data.message+"</em>" + '<br />';
		}

		document.getElementById("chat_list").scrollTop = document.getElementById("chat_list").scrollHeight;
	}
}

dispatch.on('chat', chat.display);
dispatch.on('chats', function(data) {
	for (var i = 0; i < data.length; i++) {
		chat.display(data[i]);
	}
});