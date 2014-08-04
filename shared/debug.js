var debug = {};

debug.chat = function() {
	var params = ["chat     -"];
	Array.prototype.push.apply(params, arguments);
	console.log.apply(console, params);
};

debug.game = function() {
	var params = ["game     -"];
	Array.prototype.push.apply(params, arguments);
	console.log.apply(console, params);
};

debug.dispatch = function() {
	var params = ["dispatch -"];
	Array.prototype.push.apply(params, arguments);
	console.log.apply(console, params);
};

debug.parse = function() {
	return;
	var params = ["parse    -"];
	Array.prototype.push.apply(params, arguments);
	console.log.apply(console, params);
};

debug.warn = function() {
	var params = ["warn    -"];
	Array.prototype.push.apply(params, arguments);
	console.error.apply(console, params);
};

debug.error = function() {
	var params = ["error    -"];
	Array.prototype.push.apply(params, arguments);
	console.error.apply(console, params);
};

// Export data for a nodejs module.
if (typeof exports !== 'undefined') {
	exports.chat = debug.chat;
	exports.game = debug.game;
	exports.dispatch = debug.dispatch;
	exports.parse = debug.parse;
	exports.warn = debug.warn;
	exports.error = debug.error;
}