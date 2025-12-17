// dataAdapterExpress.js – Adaptado a Express
/*
Stimulsoft.Reports.JS
Version: 2025.4.2
Build date: 2025.10.27
License: https://www.stimulsoft.com/en/licensing/reports
*/

var express = require('express');
var router = express.Router();

function getCommand(data) {
    var encryptResult = false;
    if (typeof data === "string" && !data.startsWith("{")) {
        data = Buffer.from(data.replace(/[A-Za-z]/g, function (c) {
            return String.fromCharCode(c.charCodeAt(0) + (c.toUpperCase() <= "M" ? 13 : -13));
        }), "base64").toString("utf8");
        encryptResult = true;
    }

    var command = JSON.parse(data.toString());
    command.encryptResult = encryptResult;
    return command;
}

function getResponse(result) {
    let encryptData = result.encryptData;
    delete result.encryptData;

    result = JSON.stringify(result);
    if (encryptData) {
        result = Buffer.from(result).toString("base64").replace(/[A-Za-z]/g, function (c) {
            return String.fromCharCode(c.charCodeAt(0) + (c.toUpperCase() <= "M" ? 13 : -13));
        });
    }

    return result;
}

function onProcess(onResult, encryptData, result) {
    result.handlerVersion = "2025.4.2";
    result.checkVersion = true;
    result.encryptData = encryptData;
    onResult(result);
}

// ===== Adapters =====
var MySQLAdapter = require('./MySqlAdapter');
var FirebirdAdapter = require('./FirebirdAdapter');
var MSSQLAdapter = require('./MsSqlAdapter');
var PostgreSQLAdapter = require('./PostgreSQLAdapter');
var OracleAdapter = require('./OracleAdapter');

// ==============================
//     RUTA POST EXPRESS
// ==============================
router.post('/', function (req, res) {

    req.setTimeout(300000);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    res.setHeader("Cache-Control", "no-cache");

    var data = "";

    req.on('data', buffer => data += buffer);

    req.on('end', function () {

        var command = getCommand(data);

        var onResult = function (result) {
            var responseData = getResponse(result);
            res.end(responseData);
        };

        var handler = onProcess.bind(null, onResult, command.encryptResult);

        // ----- Comando especial -----
        if (command.command === "GetSupportedAdapters") {
            handler({
                success: true,
                types: ["MySQL", "MS SQL", "Firebird", "PostgreSQL", "MongoDB", "Oracle"]
            });
            return;
        }

        // ----- Normalización de parámetros -----
        if (command.parameters) {
            command.parameters.forEach(p => {
                if (p.name.length > 1 && p.name[0] === "@") {
                    p.name = p.name.substring(1);
                }
            });
        }

        // ----- Selección de Adapter -----
        switch (command.database) {
            case "MySQL": return MySQLAdapter.process(command, handler);
            case "Firebird": return FirebirdAdapter.process(command, handler);
            case "MS SQL": return MSSQLAdapter.process(command, handler);
            case "PostgreSQL": return PostgreSQLAdapter.process(command, handler);
            case "Oracle": return OracleAdapter.process(command, handler);
            default:
                handler({
                    success: false,
                    notice: "Database '" + command.database + "' not supported!"
                });
        }
    });
});

module.exports = router;
