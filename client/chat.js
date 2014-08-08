function chat_module_send() {
	var chat_message = document.getElementById('chat_module_text').value
	var date = new Date();

	dispatch.emit('chat', {
		message: chat_message
	});

	document.getElementById('chat_module_text').value = ''
	document.getElementById('chat_module_content').value += date.getHours()+":"+date.getMinutes()+' - Player ' + player.id + ' (You) say:\n' + chat_message + '\n'
	document.getElementById("chat_module_content").scrollTop = document.getElementById("chat_module_content").scrollHeight
}

function char_module_keypress(e) {
    if (e.keyCode == 13) {
        chat_module_send();
    }
}

dispatch.on('chat', function(data) {
	debug.dispatch('Received Chat Message', data);
	document.getElementById('chat_module_content').value += data.send_date+' - Player ' + data.sender_id + ' says:\n' + data.message + '\n'
	document.getElementById("chat_module_content").scrollTop = document.getElementById("chat_module_content").scrollHeight
});

dispatch.on('chats', function(data) {
	debug.dispatch('Received Chat Messages', data);
	for(var i=0;i<data.length;i++)
	{
		document.getElementById('chat_module_content').value += data[i].send_date+' - Player ' + data[i].sender_id + ' says:\n' + data[i].message + '\n'
		document.getElementById("chat_module_content").scrollTop = document.getElementById("chat_module_content").scrollHeight
	}
});