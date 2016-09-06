// formaPagos_db_mysql
// Manejo de la tabla formaPagos en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var comun = require("../comun/comun");
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";



// comprobarFormaPago
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarFormaPago(formaPago) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof formaPago;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && formaPago.hasOwnProperty("formaPagoId"));
    comprobado = (comprobado && formaPago.hasOwnProperty("nombre"));
    comprobado = (comprobado && formaPago.hasOwnProperty("codigoContable"));
    return comprobado;
}


// getFormaPagos
// lee todos los registros de la tabla formaPagos y
// los devuelve como una lista de objetos
module.exports.getFormasPago = function (callback) {
    var connection = comun.getConnection();
    var formaPagos = null;
    sql = "SELECT fp.*, tfp.nombre AS tipoFormaPago FROM formas_pago AS fp LEFT JOIN tipos_forma_pago AS tfp ON tfp.tipoFormaPagoId = fp.tipoFormaPagoId";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        formasPago = result;
        callback(null, formasPago);
    });
}

// getFormaPagosBuscar
// lee todos los registros de la tabla formaPagos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getFormasPagoBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var formaPagos = null;
    var sql = "SELECT fp.*, tfp.nombre AS tipoFormaPago FROM formas_pago AS fp LEFT JOIN tipos_forma_pago AS tfp ON tfp.tipoFormaPagoId = fp.tipoFormaPagoId";
    if (nombre !== "*") {
        sql = "SELECT fp.*, tfp.nombre AS tipoFormaPago FROM formas_pago AS fp LEFT JOIN tipos_forma_pago AS tfp ON tfp.tipoFormaPagoId = fp.tipoFormaPagoId";
        sql += "  WHERE fp.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        formasPagos = result;
        callback(null, formasPagos);
    });
}

// getFormaPago
// busca  el formaPago con id pasado
module.exports.getFormaPago = function (id, callback) {
    var connection = comun.getConnection();
    var formaPagos = null;
    sql = "SELECT fp.*, tfp.nombre AS tipoFormaPago FROM formas_pago AS fp LEFT JOIN tipos_forma_pago AS tfp ON tfp.tipoFormaPagoId = fp.tipoFormaPagoId";
    sql += "  WHERE formaPagoId = ?";
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


// postFormaPago
// crear en la base de datos el formaPago pasado
module.exports.postFormaPago = function (formaPago, callback) {
    if (!comprobarFormaPago(formaPago)) {
        var err = new Error("La forma de pago pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    formaPago.formaPagoId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO formas_pago SET ?";
    sql = mysql.format(sql, formaPago);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        formaPago.formaPagoId = result.insertId;
        updateFormaPagoConta(formaPago, function (err) {
            if (err) return callback(err);
            callback(null, formaPago);
        });
    });
}

// putFormaPago
// Modifica el formaPago según los datos del objeto pasao
module.exports.putFormaPago = function (id, formaPago, callback) {
    if (!comprobarFormaPago(formaPago)) {
        var err = new Error("El forma de pago pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != formaPago.formaPagoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE formas_pago SET ? WHERE formaPagoId = ?";
    sql = mysql.format(sql, [formaPago, formaPago.formaPagoId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        updateFormaPagoConta(formaPago, function (err) {
            if (err) return callback(err);
            callback(null, formaPago);
        });
    });
}

// deleteFormaPago
// Elimina el formaPago con el id pasado
module.exports.deleteFormaPago = function (id, formaPago, callback) {
    deleteFormaPagoConta(id, function (err) {
        if (err) return callback(err);
        var connection = comun.getConnection();
        sql = "DELETE from formas_pago WHERE formaPagoId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            comun.closeConnection(connection);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
}

// updateFormaPagoConta
// actualiza la forma de pago pasada en todas las contabilidades
// si en el parámetro modo se le ha pasdo 'post' los intentará crear
// si se le ha pasado 'put' lo intentará modificar.
var updateFormaPagoConta = function (formaPago, done) {
    // obtenemos la información contable que nos interesa
    contabilidadDb.getInfContable(function (err, result) {
        if (err) return done(err);
        var infContable = result;
        // primero trasformamos el tipo de iva de gestión en uno de contabilidades
        var formaPagoConta = transformaFormaPagoGestionContable(formaPago);
        // obtenemos todas las contabilidades a actualizar
        var dbContas = [];
        for (var i = 0; i < infContable.contas.length; i++) {
            dbContas.push(infContable.contas[i].contabilidad);
        }
        // segun el modo creamos la plantilla de sql que se usará
        var sql = "INSERT INTO formapago SET ? ON DUPLICATE KEY UPDATE ?";
        // actualizamos todas las contabilidades
        async.each(dbContas, function (conta, callback) {
            var connection = comun.getConnectionDb(conta);
            sql = mysql.format(sql, [formaPagoConta, formaPagoConta]);
            connection.query(sql, function (err) {
                comun.closeConnection(connection);
                if (err) return callback(err);
                callback();
            })
        }, function (err) {
            if (err) return done(err);
            done();
        })
    })
}

// transformaFormaPagoGestionContable
// a partir de un objeto forma de pago de la gestión crea y devuelve
// un objeto de forma de pago de la contabilidad
var transformaFormaPagoGestionContable = function (formaPago) {
    // tipo en contabilidad 
    var formaPagoConta = {
        codforpa: formaPago.codigoContable,
        tipforpa: formaPago.tipoFormaPagoId,
        nomforpa: formaPago.nombre,
        numerove: formaPago.numeroVencimientos,
        primerve: formaPago.primerVencimiento,
        restoven: formaPago.restoVencimiento
    };
    return formaPagoConta;
}

// deleteFormaPagoConta
// borra de la contabilidad la forma de pago asociada (codigoContable)
var deleteFormaPagoConta = function (id, done) {
    // primero buscamos la forma de pago en la gestión para
    // obtener su código contable
    var connection = comun.getConnection();
    var sql = "SELECT * FROM formas_pago WHERE formaPagoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        if (err) return done(err);
        var codigoContable = result[0].codigoContable;
        // ahora el borrado de las contabilidades
        contabilidadDb.getInfContable(function (err, result) {
            if (err) return done(err);
            var infContable = result;
            var dbContas = [];
            for (var i = 0; i < infContable.contas.length; i++) {
                dbContas.push(infContable.contas[i].contabilidad);
            }
            async.each(dbContas, function (conta, callback) {
                var connection = comun.getConnectionDb(conta)
                var sql = "DELETE FROM formapago WHERE codforpa = ?";
                sql = mysql.format(sql, codigoContable);
                connection.query(sql, function (err) {
                    if (err) return callback(err);
                    callback();
                });
            }, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });
}
