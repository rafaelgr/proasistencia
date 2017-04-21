var express = require('express');
var router = express.Router();

var MySQLAdapter = require('./MySQLAdapter');
var FirebirdAdapter = require('./FirebirdAdapter');
var MSSQLAdapter = require('./MSSQLAdapter');
var PostgreSQLAdapter = require('./PostgreSQLAdapter');
var OracleAdapter = require('./OracleAdapter');

router.post('/', function (req, res) {
    var command = req.body;
    console.log("Command: ", command.database);
    if (command.database == "MySQL") MySQLAdapter.process(command, function(result){
        res.json(result);
    });
    if (command.database == "Firebird") FirebirdAdapter.process(command, onProcess);
    if (command.database == "MS SQL") MSSQLAdapter.process(command, onProcess);
    if (command.database == "PostgreSQL") PostgreSQLAdapter.process(command, onProcess);
    if (command.database == "Oracle") OracleAdapter.process(command, onProcess);
});

module.exports = router;
