// plantillas_correo_db_mysql
// Manejo de la tabla tipos_via de la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var comun = require("../comun/comun");
var numeral = require("numeral");

// ponemos numeral en español
numeral.language('es', comun.numeralSpanish());
numeral.language('es');

//  leer la configurción de MySQL

var sql = "";

// comprobarPlantillaCorreo
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarPlantillaCorreo(platillaCorreo) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof plantillaCorreo;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tipoVia.hasOwnProperty("plaCoFacId"));
    comprobado = (comprobado && tipoVia.hasOwnProperty("empresaId"));
    comprobado = (comprobado && tipoVia.hasOwnProperty("plaCoFacData"));
    return comprobado;
}


// getPlantillasCorreo
// lee todos los registros de la tabla tipoVias y
// los devuelve como una lista de objetos
module.exports.getPlantillasCorreo = function (callback) {
    var connection = comun.getConnection();
    var plantillasCorreo = null;
    sql = "SELECT * FROM plantillas_correo_facturas";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposVia = result;
        callback(null, plantillasCorreo);
    });
}

// getPlantillasCorreoBuscar
// lee todos los registros de la tabla tipoVias cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getPlantillasCorreoBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var tipoVias = null;
    var sql = "SELECT * from plantillas_correo_facturas";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposVias = result;
        callback(null, tiposVias);
    });
}

// getPlantillaCorreo
// busca  el tipoVia con id pasado
module.exports.getPlantillaCorreo = function (id, callback) {
    var connection = comun.getConnection();
    var plantillasCorreo = null;
    sql = "SELECT * from plantillas_correo_facturas";
    sql += "  WHERE plaCoFacId = ?";
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


// postPlantillaCorreo
// crear en la base de datos el tipoVia pasado
module.exports.postPlantillaCorreo = function (plantillaCorreo, callback) {
    if (!comprobarPlantillaCorreo(plantillaCorreo)) {
        var err = new Error("La plantilla pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    plantillaCorreo.plaCoFacId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tipos_via SET ?";
    sql = mysql.format(sql, plantillaCorreo);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        plantillaCorreo.plaCoFacId = result.insertId;
        callback(null, plantillaCorreo);
    });
}

// putPlantillaCorreo
// Modifica el tipoVia según los datos del objeto pasao
module.exports.putPlantillaCorreo = function (id, plantillaCorreo, callback) {
    if (!comprobarPlantillaCorreo(plantillaCorreo)) {
        var err = new Error("El tipo de plantilla es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != plantillaCorreo.plaCoFacId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE plantillas_correo_facturas SET ? WHERE plaCoFacId = ?";
    sql = mysql.format(sql, [plantillaCorreo, plantillaCorreo.plaCoFacId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, plantillaCorreo);
    });
}

// deletePlantillaCorreo
// Elimina la plantilla de correo con el id pasado
module.exports.deletePlantillaCorreo = function (id, callback) {
    var connection = comun.getConnection();
    sql = "DELETE from plantillas_correo_facturas WHERE tipoViaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


