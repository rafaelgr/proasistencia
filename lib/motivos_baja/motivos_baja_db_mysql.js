// motivos_baja_db_mysql
// Manejo de la tabla motivos_baja de la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var comun = require("../comun/comun");
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");
var numeral = require("numeral");

// ponemos numeral en español
numeral.language('es', comun.numeralSpanish());
numeral.language('es');

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";

// comprobarMotivoBaja
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarMotivoBaja(motivoBaja) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof motivoBaja;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && motivoBaja.hasOwnProperty("motivoBajaId"));
    comprobado = (comprobado && motivoBaja.hasOwnProperty("nombre"));
    return comprobado;
}


// getMotivoBajas
// lee todos los registros de la tabla motivoBajas y
// los devuelve como una lista de objetos
module.exports.getMotivosBaja = function (callback) {
    var connection = comun.getConnection();
    var motivoBajas = null;
    sql = "SELECT * FROM motivos_baja";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposVia = result;
        callback(null, tiposVia);
    });
}

// getMotivoBajasBuscar
// lee todos los registros de la tabla motivoBajas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getMotivosBajaBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var motivoBajas = null;
    var sql = "SELECT * from motivos_baja";
    if (nombre !== "*") {
        sql = "SELECT * from motivos_baja";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposVias = result;
        callback(null, tiposVias);
    });
}

// getMotivoBaja
// busca  el motivoBaja con id pasado
module.exports.getMotivoBaja = function (id, callback) {
    var connection = comun.getConnection();
    var motivoBajas = null;
    sql = "SELECT * from motivos_baja";
    sql += "  WHERE motivoBajaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}


// postMotivoBaja
// crear en la base de datos el motivoBaja pasado
module.exports.postMotivoBaja = function (motivoBaja, callback) {
    if (!comprobarMotivoBaja(motivoBaja)) {
        var err = new Error("El motivo de baja pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    motivoBaja.motivoBajaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO motivos_baja SET ?";
    sql = mysql.format(sql, motivoBaja);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        motivoBaja.motivoBajaId = result.insertId;
        callback(null, motivoBaja);
    });
}

// putMotivoBaja
// Modifica el motivoBaja según los datos del objeto pasao
module.exports.putMotivoBaja = function (id, motivoBaja, callback) {
    if (!comprobarMotivoBaja(motivoBaja)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != motivoBaja.motivoBajaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE motivos_baja SET ? WHERE motivoBajaId = ?";
    sql = mysql.format(sql, [motivoBaja, motivoBaja.motivoBajaId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, motivoBaja);
    });
}

// deleteMotivoBaja
// Elimina el motivoBaja con el id pasado
module.exports.deleteMotivoBaja = function (id, callback) {
    var connection = comun.getConnection();
    sql = "DELETE from motivos_baja WHERE motivoBajaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

