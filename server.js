var dispatch = require("./server/dispatch");
var debug = require("./shared/debug");

// Initialize the server.
dispatch.start(8081);

require("./server/socket");
