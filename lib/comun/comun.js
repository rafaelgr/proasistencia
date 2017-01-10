// Contiene librerias comunes que sirven de apoyo
// a otras librerías

//----------------------------
// MYSQL
// ----------------------------
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var config = require("../../configMySQL.json"); //  leer la configurción de MySQL
// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
module.exports.getConnection = function () {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) throw err;
    });
    return connection;
}

// getConnectionDb
// obtiene una conexión a la base de datos proporcionada en parámetros
// se asume que la base de datos está en el mismo servidor y el usario
// por defecto de la configuración tiene derechos sobre ella.
module.exports.getConnectionDb = function (db) {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: db,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
module.exports.closeConnection = function (connection) {
    connection.end(function (err) {
        if (err) {
            throw err;
        }
    });
}
// 
module.exports.closeConnectionCallback = function (connection, callback) {
    connection.end(function (err) {
        if (err) callback(err);
    });
}

// numeralSpanish
// prepara numeral para español

module.exports.numeralSpanish = function () {
    return {
        delimiters: {
            thousands: '.',
            decimal: ','
        },
        abbreviations: {
            thousand: 'k',
            million: 'mm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            var b = number % 10;
            return (b === 1 || b === 3) ? 'er' :
                (b === 2) ? 'do' :
                    (b === 7 || b === 0) ? 'mo' :
                        (b === 8) ? 'vo' :
                            (b === 9) ? 'no' : 'to';
        },
        currency: {
            symbol: '€'
        }
    };
}


//
module.exports.getConnectionCallback = function (done) {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) return done(err);
        done(null, connection);
    });
}

module.exports.getConnectionCallbackTransaction = function (done) {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) return done(err);
        connection.beginTransaction(function (err) {
            if (err) return done(err);
            done(null, connection);
        })
    });
}