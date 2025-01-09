var express = require('express');
var router = express.Router();

var MySQLAdapter = require('./MySqlAdapter');
var FirebirdAdapter = require('./FirebirdAdapter');
var MSSQLAdapter = require('./MsSqlAdapter');
var PostgreSQLAdapter = require('./PostgreSQLAdapter');
var OracleAdapter = require('./OracleAdapter');

var connectionStringBuilder;
var response;

router.post('/', function (req, res) {
    // Aumenta el tiempo de espera a 5 minutos (300000 ms)
    req.setTimeout(300000);  // 5 minutos en milisegundos

    console.log("POST :", req.body);
    response = res;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Cache-Control", "no-cache");

    var data = "";
    req.on('data', function (buffer) {
        data += buffer;
    });

    req.on('end', async function () {
        let command = JSON.parse(data.toString());

        // Procesamiento según el tipo de base de datos
        if (command.database == "MySQL")  MySQLAdapter.process(command, onProcess);
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
