chat_module = document.getElementById('chat');
chat_module.innerHTML = '<p>Message</p>'
chat_module.innerHTML += '<textarea id="chat_module_content" cols="40" rows="10"></textarea><p></p>'
chat_module.innerHTML += '<textarea id="chat_module_text" cols="40"></textarea><p></p>'
chat_module.innerHTML += '<button onclick="chat_module_send()" id="chat_module_submit" cols="40">Submit</button>'

function add_chat_message(chat_message) {
	document.getElementById('chat_module_content').value += chat_message + '\n'
}

function chat_module_send() {
	var chat_message = document.getElementById('chat_module_text').value
	dispatch.emit('chat', {
			message: chat_message
		});
	document.getElementById('chat_module_text').value = ''
	add_chat_message(chat_message)
}

dispatch.on('chat', function(data) {
	debug.dispatch('Received Chat Message', data);
	add_chat_message(data.message)
});