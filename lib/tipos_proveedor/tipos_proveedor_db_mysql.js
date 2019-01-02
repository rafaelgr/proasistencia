// tipos_proveedor_db_mysql
// Manejo de la tabla tipos_proveedor de la base de datos
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

// comprobarTipoProveedor
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipoProveedor(tipoProveedor) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tipoProveedor;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tipoProveedor.hasOwnProperty("tipoProveedorId"));
    comprobado = (comprobado && tipoProveedor.hasOwnProperty("nombre"));
    return comprobado;
}


// getTipoProveedores
// lee todos los registros de la tabla tipoProveedores y
// los devuelve como una lista de objetos
module.exports.getTiposProveedores = function (callback) {
    var connection = comun.getConnection();
    var tipoProveedores = null;
    sql = "SELECT * FROM tipos_proveedor";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        TiposProveedores = result;
        callback(null, TiposProveedores);
    });
}

// getTipoProveedoresBuscar
// lee todos los registros de la tabla tipoProveedores cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposProveedoresBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var tipoProveedores = null;
    var sql = "SELECT * from tipos_proveedor";
    if (nombre !== "*") {
        sql = "SELECT * from tipos_proveedor";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        TiposProveedores = result;
        callback(null, TiposProveedores);
    });
}

// getTipoProveedor
// busca  el tipoProveedor con id pasado
module.exports.getTipoProveedor = function (id, callback) {
    var connection = comun.getConnection();
    var TipoProveedores = null;
    sql = "SELECT * from tipos_proveedor";
    sql += "  WHERE tipoProveedorId = ?";
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


// postTipoProveedor
// crear en la base de datos el tipoProveedor pasado
module.exports.postTipoProveedor = function (tipoProveedor, callback) {
    if (!comprobarTipoProveedor(tipoProveedor)) {
        var err = new Error("El tipo de via pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    tipoProveedor.tipoProveedorId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tipos_proveedor SET ?";
    sql = mysql.format(sql, tipoProveedor);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        tipoProveedor.tipoProveedorId = result.insertId;
        callback(null, tipoProveedor);
    });
}

// putTipoProveedor
// Modifica el tipoProveedor según los datos del objeto pasao
module.exports.putTipoProveedor = function (id, tipoProveedor, callback) {
    if (!comprobarTipoProveedor(tipoProveedor)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tipoProveedor.tipoProveedorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE tipos_proveedor SET ? WHERE tipoProveedorId = ?";
    sql = mysql.format(sql, [tipoProveedor, tipoProveedor.tipoProveedorId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, tipoProveedor);
    });
}

// deleteTipoProveedor
// Elimina el tipoProveedor con el id pasado
module.exports.deleteTipoProveedor = function (id, callback) {
    var connection = comun.getConnection();
    sql = "DELETE from tipos_proveedor WHERE tipoProveedorId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// borraTipoProveedorConta
// cuando se elimina un tipo de iva en la gestión también hay que darlo
// de baja en las diferentes contabilidades
var borraTipoProveedorConta = function (id, done) {
    // hay que buscar primero el tipo de iva para sacar su código contable
    var connection = comun.getConnection();
    var sql = "SELECT * FROM tipos_proveedor WHERE tipoProveedorId = ?";
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