// tipos_via_db_mysql
// Manejo de la tabla tipos_via de la base de datos
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

// comprobarTipoVia
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipoVia(tipoVia) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tipoVia;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tipoVia.hasOwnProperty("tipoViaId"));
    comprobado = (comprobado && tipoVia.hasOwnProperty("nombre"));
    return comprobado;
}


// getTipoVias
// lee todos los registros de la tabla tipoVias y
// los devuelve como una lista de objetos
module.exports.getTiposVia = function (callback) {
    var connection = comun.getConnection();
    var tipoVias = null;
    sql = "SELECT * FROM tipos_via";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposVia = result;
        callback(null, tiposVia);
    });
}

// getTipoViasBuscar
// lee todos los registros de la tabla tipoVias cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposViaBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var tipoVias = null;
    var sql = "SELECT * from tipos_via";
    if (nombre !== "*") {
        sql = "SELECT * from tipos_via";
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

// getTipoVia
// busca  el tipoVia con id pasado
module.exports.getTipoVia = function (id, callback) {
    var connection = comun.getConnection();
    var tipoVias = null;
    sql = "SELECT * from tipos_via";
    sql += "  WHERE tipoViaId = ?";
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


// postTipoVia
// crear en la base de datos el tipoVia pasado
module.exports.postTipoVia = function (tipoVia, callback) {
    if (!comprobarTipoVia(tipoVia)) {
        var err = new Error("El tipo de via pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    tipoVia.tipoViaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tipos_via SET ?";
    sql = mysql.format(sql, tipoVia);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        tipoVia.tipoViaId = result.insertId;
        callback(null, tipoVia);
    });
}

// putTipoVia
// Modifica el tipoVia según los datos del objeto pasao
module.exports.putTipoVia = function (id, tipoVia, callback) {
    if (!comprobarTipoVia(tipoVia)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tipoVia.tipoViaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE tipos_via SET ? WHERE tipoViaId = ?";
    sql = mysql.format(sql, [tipoVia, tipoVia.tipoViaId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, tipoVia);
    });
}

// deleteTipoVia
// Elimina el tipoVia con el id pasado
module.exports.deleteTipoVia = function (id, callback) {
    var connection = comun.getConnection();
    sql = "DELETE from tipos_via WHERE tipoViaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// borraTipoViaConta
// cuando se elimina un tipo de iva en la gestión también hay que darlo
// de baja en las diferentes contabilidades
var borraTipoViaConta = function (id, done) {
    // hay que buscar primero el tipo de iva para sacar su código contable
    var connection = comun.getConnection();
    var sql = "SELECT * FROM tipos_via WHERE tipoViaId = ?";
    var codigoContable = null;
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) return done(err);
        codigoContable = result[0].codigoContable;
        // ahora ya podemos borrar el de contabilidad
        contabilidadDb.getInfContable(function (err, result) {
            if (err) return done(err);
            var infContable = result;
            var dbContas = [];
            for (var i = 0; i < infContable.contas.length; i++) {
                dbContas.push(infContable.contas[i].contabilidad);
            }
            async.each(dbContas, function (conta, callback) {
                var connection = comun.getConnectionDb(conta)
                var sql = "DELETE FROM cuentas"
                sql += " WHERE codmacta LIKE '477%" + codigoContable + "'";
                sql += " OR codmacta LIKE '472%" + codigoContable + "'";
                connection.query(sql, function (err) {
                    if (err) return callback(err);
                    var connection = comun.getConnectionDb(conta);
                    var sql = "DELETE FROM tiposiva WHERE codigiva = ?"
                    sql = mysql.format(sql, codigoContable);
                    connection.query(sql, function (err) {
                        comun.closeConnection(connection);
                        if (err) return callback(err);
                        callback();
                    })
                });
            }, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });

}