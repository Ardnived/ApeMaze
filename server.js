var dispatch = require("./server/dispatch");
var debug = require("./shared/debug");

// Initialize the server.
dispatch.start(3000);

require("./server/socket");
