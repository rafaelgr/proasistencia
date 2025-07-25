// tipos_texto_db_mysql
// Manejo de la tabla tipos_texto de la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var comun = require("../comun/comun");
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");
var numeral = require("numeral");

// ponemos numeral en español
numeral.language('es', comun.numeralSpanish());
numeral.language('es');

//  leer la configurción de MySQL

var sql = "";

// comprobarTipoTexto
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipoTexto(tipoTexto) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tipoTexto;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tipoTexto.hasOwnProperty("tipoTextoId"));
    comprobado = (comprobado && tipoTexto.hasOwnProperty("nombre"));
    return comprobado;
}


// getTipoTextos
// lee todos los registros de la tabla tipoTextos y
// los devuelve como una lista de objetos
module.exports.getTiposTexto = function (callback) {
    var connection = comun.getConnection();
    var tipoTextos = null;
    sql = "SELECT * FROM tipos_texto";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposTexto = result;
        callback(null, tiposTexto);
    });
}

// getTipoTextosBuscar
// lee todos los registros de la tabla tipoTextos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposTextoBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var tipoTextos = null;
    var sql = "SELECT * from tipos_texto";
    if (nombre !== "*") {
        sql = "SELECT * from tipos_texto";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposTextos = result;
        callback(null, tiposTextos);
    });
}

// getTipoTexto
// busca  el tipoTexto con id pasado
module.exports.getTipoTexto = function (id, callback) {
    var connection = comun.getConnection();
    var tipoTextos = null;
    sql = "SELECT * from tipos_texto";
    sql += "  WHERE tipoTextoId = ?";
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


// postTipoTexto
// crear en la base de datos el tipoTexto pasado
module.exports.postTipoTexto = function (tipoTexto, callback) {
    if (!comprobarTipoTexto(tipoTexto)) {
        var err = new Error("El tipo de texto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    tipoTexto.tipoTextoId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tipos_texto SET ?";
    sql = mysql.format(sql, tipoTexto);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        tipoTexto.tipoTextoId = result.insertId;
        callback(null, tipoTexto);
    });
}

// putTipoTexto
// Modifica el tipoTexto según los datos del objeto pasao
module.exports.putTipoTexto = function (id, tipoTexto, callback) {
    if (!comprobarTipoTexto(tipoTexto)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tipoTexto.tipoTextoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE tipos_texto SET ? WHERE tipoTextoId = ?";
    sql = mysql.format(sql, [tipoTexto, tipoTexto.tipoTextoId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, tipoTexto);
    });
}

// deleteTipoTexto
// Elimina el tipoTexto con el id pasado
module.exports.deleteTipoTexto = function (id, callback) {
    var connection = comun.getConnection();
    sql = "DELETE from tipos_texto WHERE tipoTextoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


