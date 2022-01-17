// tipos_profesional_db_mysql
// Manejo de la tabla tipos_profesional de la base de datos
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

// comprobarTipoGarantia
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipoGarantia(tiposGarantia) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tiposGarantia;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tiposGarantia.hasOwnProperty("tipoGarantiaId"));
    comprobado = (comprobado && tiposGarantia.hasOwnProperty("nombre"));
    return comprobado;
}


// getTipoGarantiales
// lee todos los registros de la tabla tiposGarantia y
// los devuelve como una lista de objetos
module.exports.getTiposGarantia = function (callback) {
    var connection = comun.getConnection();
    var tiposGarantia = null;
    sql = "SELECT * FROM tipos_garantia";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        TiposGarantia = result;
        callback(null, TiposGarantia);
    });
}

// getTipoGarantiaBuscar
// lee todos los registros de la tabla tiposGarantia cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposGarantiaBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var tiposGarantia = null;
    var sql = "SELECT * from tipos_garantia";
    if (nombre !== "*") {
        sql = "SELECT * from tipos_garantia";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        TiposGarantia = result;
        callback(null, TiposGarantia);
    });
}

// getTipoGarantia
// busca  el tiposGarantia con id pasado
module.exports.getTipoGarantia = function (id, callback) {
    var connection = comun.getConnection();
    sql = "SELECT * from tipos_garantia";
    sql += "  WHERE tipoGarantiaId = ?";
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


// postTipoGarantia
// crear en la base de datos el tiposGarantia pasado
module.exports.postTipoGarantia = function (tiposGarantia, callback) {
    if (!comprobarTipoGarantia(tiposGarantia)) {
        var err = new Error("El tipo de via pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    tiposGarantia.tipoGarantiaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tipos_garantia SET ?";
    sql = mysql.format(sql, tiposGarantia);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        tiposGarantia.tipoGarantiaId = result.insertId;
        callback(null, tiposGarantia);
    });
}

// putTipoGarantia
// Modifica el tiposGarantia según los datos del objeto pasao
module.exports.putTipoGarantia = function (id, tiposGarantia, callback) {
    if (!comprobarTipoGarantia(tiposGarantia)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tiposGarantia.tipoGarantiaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE tipos_garantia SET ? WHERE tipoGarantiaId = ?";
    sql = mysql.format(sql, [tiposGarantia, tiposGarantia.tipoGarantiaId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, tiposGarantia);
    });
}

// deleteTipoGarantia
// Elimina el tiposGarantia con el id pasado
module.exports.deleteTipoGarantia = function (id, callback) {
    var connection = comun.getConnection();
    sql = "DELETE from tipos_garantia WHERE tipoGarantiaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// borraTipoGarantiaConta
// cuando se elimina un tipo de iva en la gestión también hay que darlo
// de baja en las diferentes contabilidades
var borraTipoGarantiaConta = function (id, done) {
    // hay que buscar primero el tipo de iva para sacar su código contable
    var connection = comun.getConnection();
    var sql = "SELECT * FROM tipos_garantia WHERE tipoGarantiaId = ?";
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