function chat_module_send() {
	var chat_message = document.getElementById('chat_module_text').value
	dispatch.emit('chat', {
			message: chat_message
		});
	document.getElementById('chat_module_text').value = ''
	document.getElementById('chat_module_content').value += 'Player ' + player.id + ' (You) say (' + (new Date()).toString() + '):\n' + chat_message + '\n'
	document.getElementById("chat_module_content").scrollTop = document.getElementById("chat_module_content").scrollHeight
}

function char_module_keypress(e) {
    if (e.keyCode == 13) {
        chat_module_send();
    }
}

dispatch.on('chat', function(data) {
	debug.dispatch('Received Chat Message', data);
	document.getElementById('chat_module_content').value += 'Player ' + data.sender_id + ' says (' + data.send_date + '):\n' + data.message + '\n'
	document.getElementById("chat_module_content").scrollTop = document.getElementById("chat_module_content").scrollHeight
});

dispatch.on('chats', function(data) {
	debug.dispatch('Received Chat Messages', data);
	for(var i=0;i<data.length;i++)
	{
		document.getElementById('chat_module_content').value += 'Player ' + data[i].sender_id + ' says (' + data[i].send_date + '):\n' + data[i].message + '\n'
		document.getElementById("chat_module_content").scrollTop = document.getElementById("chat_module_content").scrollHeight
	}
});