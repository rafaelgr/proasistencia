var express = require('express');
var router = express.Router();

var MySQLAdapter = require('/usr/src/app/report-controller/MySqlAdapter');
var FirebirdAdapter = require('/usr/src/app/report-controller/FirebirdAdapter');
var MSSQLAdapter = require('/usr/src/app/report-controller/MsSqlAdapter');
var PostgreSQLAdapter = require('/usr/src/app/report-controller/PostgreSQLAdapter');
var OracleAdapter = require('(/usr/src/app/report-controller/OracleAdapter');

var connectionStringBuilder;
var response;


router.post('/', function (req, res) {
    console.log("POST :" ,req.body);
    response = res;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Cache-Control", "no-cache");
    var data = "";
    req.on('data', function (buffer) {
        data += buffer;
    });

    req.on('end', function () {
        command = JSON.parse(data.toString());

        if (command.database == "MySQL") MySQLAdapter.process(command, onProcess);
        if (command.database == "Firebird") FirebirdAdapter.process(command, onProcess);
        if (command.database == "MS SQL") MSSQLAdapter.process(command, onProcess);
        if (command.database == "PostgreSQL") PostgreSQLAdapter.process(command, onProcess);
        if (command.database == "Oracle") OracleAdapter.process(command, onProcess);
    });
});


var onProcess = function (result){
    response.end(JSON.stringify(result));
}

module.exports = router;
