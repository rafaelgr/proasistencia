// tipos_iva_db_mysql
// Manejo de la tabla tipos_iva de la base de datos
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
        updateTipoIvaConta(tipoIva, function (err) {
            if (err) return callback(err);
            callback(null, tipoIva);
        })
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
        updateTipoIvaConta(tipoIva, function (err) {
            if (err) return callback(err);
            callback(null, tipoIva);
        })

    });
}

// deleteTipoIva
// Elimina el tipoIva con el id pasado
module.exports.deleteTipoIva = function (id, callback) {
    // antes hay que borrar los de contabilidad
    borraTipoIvaConta(id, function (err) {
        if (err) return callback(err);
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
    });
}

// updateTipoIvaConta
// actualiza el tipo de iva pasado en todas las contabilidades
var updateTipoIvaConta = function (tipoIva, done) {
    // obtenemos la información contable que nos interesa
    contabilidadDb.getInfContable(function (err, result) {
        if (err) return done(err);
        var infContable = result;
        // primero trasformamos el tipo de iva de gestión en uno de contabilidades
        // esto implica crear las cuentas asociadas si no existen o modificarlas.
        var tipoIvaConta = null;
        transformaIvaGestionContable(tipoIva, infContable.numDigitos, function (err, result) {
            if (err) return done(err);
            tipoIvaConta = result;
            // obtenemos todas las contabilidades a actualizar
            var dbContas = [];
            for (var i = 0; i < infContable.contas.length; i++) {
                dbContas.push(infContable.contas[i].contabilidad);
            }
            // segun el modo creamos la plantilla de sql que se usará
            var sql = "INSERT INTO tiposiva SET ? ON DUPLICATE KEY UPDATE ?";
            // actualizamos todas las contabilidades
            async.each(dbContas, function (conta, callback) {
                var connection = comun.getConnectionDb(conta);
                sql = mysql.format(sql, [tipoIvaConta, tipoIvaConta]);
                connection.query(sql, function (err) {
                    comun.closeConnection(connection);
                    if (err) return callback(err);
                    callback();
                })
            }, function (err) {
                if (err) return done(err);
                done();
            });
        });
    })
}

// transformaIvaGestionContable
// a partir de un objeto tipoIva de la gestión crea y devuelve
// un objeto de tipo iva de la contabilidad
// esta función chequea si las cuentas contables existen  y si no las crea.
// si ya existen las modifica.
var transformaIvaGestionContable = function (tipoIva, numdigitos, done) {
    // tipo en contabilidad 
    var tipoIvaConta = {
        codigiva: tipoIva.codigoContable,
        nombriva: tipoIva.nombre,
        tipodiva: 0,
        porceiva: tipoIva.porcentaje,
        porcerec: 0
    };
    // comprobamos las cuentas de las que se trata en contabilidad
    // dándolas de alta si no existieran;
    var nom472 = "IVA SOPORTADO " + numeral(tipoIva.porcentaje).format('0,0.00') + " %";
    var nom477 = "IVA REPERCUTIDO " + numeral(tipoIva.porcentaje).format('0,0.00') + " %";
    async.series([
        function (callback) {
            // las 477
            montaCuentaContable('477', tipoIva.codigoContable, numdigitos, nom477, function (err, codmacta) {
                if (err) return callback(err);
                tipoIvaConta.cuentare = codmacta;
                tipoIvaConta.cuentarr = codmacta;
                tipoIvaConta.cuentasn = codmacta;
                callback(null);
            })
        },
        function (callback) {
            // las 472
            montaCuentaContable('472', tipoIva.codigoContable, numdigitos, nom472, function (err, codmacta) {
                if (err) return callback(err);
                tipoIvaConta.cuentaso = codmacta;
                tipoIvaConta.cuentasr = codmacta;
                tipoIvaConta.cuentasn = codmacta;
                callback(null);
            })
        }
    ], function (err) {
        if (err) return done(err);
        done(null, tipoIvaConta);
    })
}
// montaCuentaContable
// encadena el inicio y final añadiendo en medio tantos ceros
// como sean necesarios para llegar a longitud de numdigitos
var montaCuentaContable = function (inicio, final, numdigitos, nombre, done) {
    var s1 = '' + inicio + final;
    var n1 = s1.length;
    var n2 = numdigitos - n1 + 1;
    var s2 = Array(n2).join('0');
    var codmacta = '' + inicio + s2 + final;
    var cuenta = {
        codmacta: codmacta,
        nommacta: nombre,
        apudirec: 'S'
    };
    // obtenemos la famosa información contable
    contabilidadDb.getInfContable(function (err, result) {
        if (err) return done(err);
        async.each(result.contas, function (conta, callback) {
            var connection = comun.getConnectionDb(conta.contabilidad);
            var sql = "INSERT INTO cuentas SET ? ON DUPLICATE KEY UPDATE ?";
            sql = mysql.format(sql, [cuenta, cuenta]);
            connection.query(sql, function (err, result) {
                comun.closeConnection(connection);
                if (err) return callback(err);
                callback(null);
            });
        }, function (err) {
            if (err) return done(err);
            done(null, codmacta);
        });
    });

}

// borraTipoIvaConta
// cuando se elimina un tipo de iva en la gestión también hay que darlo
// de baja en las diferentes contabilidades
var borraTipoIvaConta = function (id, done) {
    // hay que buscar primero el tipo de iva para sacar su código contable
    var connection = comun.getConnection();
    var sql = "SELECT * FROM tipos_iva WHERE tipoIvaId = ?";
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