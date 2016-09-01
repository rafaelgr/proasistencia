// tipos_iva_db_mysql
// Manejo de la tabla tipos_iva de la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var comun = require("../comun/comun");

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";

// comprobarTipoIva
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipoIva(tipoIva) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tipoIva;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tipoIva.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && tipoIva.hasOwnProperty("nombre"));
    return comprobado;
}


// getTipoIvas
// lee todos los registros de la tabla tipoIvas y
// los devuelve como una lista de objetos
module.exports.getTiposIva = function (callback) {
    var connection = comun.getConnection();
    var tipoIvas = null;
    sql = "SELECT * FROM tipos_iva";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposIva = result;
        callback(null, tiposIva);
    });
}

// getTipoIvasBuscar
// lee todos los registros de la tabla tipoIvas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposIvaBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var tipoIvas = null;
    var sql = "SELECT * from tipos_iva";
    if (nombre !== "*") {
        sql = "SELECT * from tipos_iva";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposIvas = result;
        callback(null, tiposIvas);
    });
}

// getTipoIva
// busca  el tipoIva con id pasado
module.exports.getTipoIva = function (id, callback) {
    var connection = comun.getConnection();
    var tipoIvas = null;
    sql = "SELECT * from tipos_iva";
    sql += "  WHERE tipoIvaId = ?";
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


// postTipoIva
// crear en la base de datos el tipoIva pasado
module.exports.postTipoIva = function (tipoIva, callback) {
    if (!comprobarTipoIva(tipoIva)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    tipoIva.tipoIvaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tipos_iva SET ?";
    sql = mysql.format(sql, tipoIva);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        tipoIva.tipoIvaId = result.insertId;
        callback(null, tipoIva);
    });
}

// putTipoIva
// Modifica el tipoIva según los datos del objeto pasao
module.exports.putTipoIva = function (id, tipoIva, callback) {
    if (!comprobarTipoIva(tipoIva)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tipoIva.tipoIvaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE tipos_iva SET ? WHERE tipoIvaId = ?";
    sql = mysql.format(sql, [tipoIva, tipoIva.tipoIvaId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, tipoIva);
    });
}

// deleteTipoIva
// Elimina el tipoIva con el id pasado
module.exports.deleteTipoIva = function (id, tipoIva, callback) {
    var connection = comun.getConnection();
    sql = "DELETE from tipos_iva WHERE tipoIvaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// updateTipoIvaConta
// actualiza el tipo de iva pasado en todas las contabilidades
// si en el parámetro modo se le ha pasdo 'post' los intentará crear
// si se le ha pasado 'put' lo intentará modificar.
module.exports.updateTipoIvaConta = function (mode, tipoIva, done) {
    // primero trasformamos el tipo de iba de gestión en uno de contabilidades
    // obtenemos todas las contabilidades a actualizar
    // segun el modo creamos la plantilla de sql que se usará
    // actualizamos todas las contabilidades
}

var transformaIvaGestionContable = function (tipoIva) {
    // tipo en contabilidad 
    var tipoIvaConta = {
        codigiva: tipoIva.codigoContable,
        nombriva: tipoIva.nombre,
        tipodiva: 0,
        porceiva: porcentaje,
        cuentare: null,
        cuentarr: null,
        cuentaso: null,
        cuentasr: null,
        cuentasn: null
    };
    return tipoIvaConta;
}

var montaCuentaContable = function (inicio, final, numdigitos) {
    var s1 = '' + inicio + final;
    var n1 = s1.length;
    var n2 = numdigitos - n1;
    var s2 = Array(n2).join('0');
    return '' + inicio + s2 + final;
}