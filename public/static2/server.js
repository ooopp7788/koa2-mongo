global.log = global.console.log;
const express = require('express'),
	  fs = require('fs'),
	  path = require('path'),
	  app = express(),
	  port = 9999,
	  rootUrl = require('./config/config').root;


const msg = {
	run: `server run at ${rootUrl}/${port}`
}
app.use(express.static(path.join(__dirname, 'src')));
app.listen(9999, function(){
	log(msg.run);
});


