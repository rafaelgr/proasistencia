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
var config = require("../../configMySQL.json");
var sql = "";

// comprobarTipoProfesional
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipoProfesional(tipoProfesional) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tipoProfesional;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tipoProfesional.hasOwnProperty("tipoProfesionalId"));
    comprobado = (comprobado && tipoProfesional.hasOwnProperty("nombre"));
    return comprobado;
}


// getTipoProfesionales
// lee todos los registros de la tabla tipoProfesionales y
// los devuelve como una lista de objetos
module.exports.getTiposProfesionales = function (callback) {
    var connection = comun.getConnection();
    var tipoProfesionales = null;
    sql = "SELECT * FROM tipos_profesionales";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        TiposProfesionales = result;
        callback(null, TiposProfesionales);
    });
}

// getTipoProfesionalesBuscar
// lee todos los registros de la tabla tipoProfesionales cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposProfesionalesBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var tipoProfesionales = null;
    var sql = "SELECT * from tipos_profesionales";
    if (nombre !== "*") {
        sql = "SELECT * from tipos_profesionales";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        TiposProfesionales = result;
        callback(null, TiposProfesionales);
    });
}

// getTipoProfesional
// busca  el tipoProfesional con id pasado
module.exports.getTipoProfesional = function (id, callback) {
    var connection = comun.getConnection();
    var TipoProfesionales = null;
    sql = "SELECT * from tipos_profesionales";
    sql += "  WHERE tipoProfesionalId = ?";
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


// postTipoProfesional
// crear en la base de datos el tipoProfesional pasado
module.exports.postTipoProfesional = function (tipoProfesional, callback) {
    if (!comprobarTipoProfesional(tipoProfesional)) {
        var err = new Error("El tipo de via pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    tipoProfesional.tipoProfesionalId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tipos_profesionales SET ?";
    sql = mysql.format(sql, tipoProfesional);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        tipoProfesional.tipoProfesionalId = result.insertId;
        callback(null, tipoProfesional);
    });
}

// putTipoProfesional
// Modifica el tipoProfesional según los datos del objeto pasao
module.exports.putTipoProfesional = function (id, tipoProfesional, callback) {
    if (!comprobarTipoProfesional(tipoProfesional)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tipoProfesional.tipoProfesionalId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE tipos_profesionales SET ? WHERE tipoProfesionalId = ?";
    sql = mysql.format(sql, [tipoProfesional, tipoProfesional.tipoProfesionalId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, tipoProfesional);
    });
}

// deleteTipoProfesional
// Elimina el tipoProfesional con el id pasado
module.exports.deleteTipoProfesional = function (id, callback) {
    var connection = comun.getConnection();
    sql = "DELETE from tipos_profesionales WHERE tipoProfesionalId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// borraTipoProfesionalConta
// cuando se elimina un tipo de iva en la gestión también hay que darlo
// de baja en las diferentes contabilidades
var borraTipoProfesionalConta = function (id, done) {
    // hay que buscar primero el tipo de iva para sacar su código contable
    var connection = comun.getConnection();
    var sql = "SELECT * FROM tipos_profesionales WHERE tipoProfesionalId = ?";
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