// contratosClientesMantenimiento_db_mysql
// Funciones de uso comun
var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async');

// comprobarContratoClienteMantenimiento
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarContratoClienteMantenimiento(contratoClienteMantenimiento) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof contratoClienteMantenimiento;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && contratoClienteMantenimiento.hasOwnProperty("contratoClienteMantenimientoId"));
    comprobado = (comprobado && contratoClienteMantenimiento.hasOwnProperty("empresaId"));
    comprobado = (comprobado && contratoClienteMantenimiento.hasOwnProperty("clienteId"));
    return comprobado;
}


// getContratosClientesMantenimiento
// lee todos los registros de la tabla contratosClientesMantenimiento y
// los devuelve como una lista de objetos
module.exports.getContratosClientesMantenimiento = function (callback) {
    var connection = cm.getConnection();
    var contratosClientesMantenimiento = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS cliente, m.nombre as mantenedor, a.nombre as articulo";
    sql += " FROM contrato_cliente_mantenimiento AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN clientes AS m ON m.clienteId = cc.mantenedorId";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = cc.articuloId";
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        contratosClientesMantenimiento = result;
        callback(null, contratosClientesMantenimiento);
    });
}


// getContratoClienteMantenimiento
// busca  el contrato comercial con id pasado
module.exports.getContratoClienteMantenimiento = function (id, callback) {
    var connection = cm.getConnection();
    var contratosClientesMantenimiento = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS cliente, m.nombre AS mantenedor, a.nombre as articulo";
    sql += " FROM contrato_cliente_mantenimiento AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN clientes AS m ON m.clienteId = cc.mantenedorId";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = cc.articuloId";
    sql += " WHERE cc.contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}


// postContratoClienteMantenimiento
// crear en la base de datos el contrato comercial pasado
module.exports.postContratoClienteMantenimiento = function (contratoClienteMantenimiento, callback) {
    if (!comprobarContratoClienteMantenimiento(contratoClienteMantenimiento)) {
        var err = new Error("El contrato pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = cm.getConnection();
    contratoClienteMantenimiento.contratoClienteMantenimientoId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO contrato_cliente_mantenimiento SET ?";
    sql = mysql.format(sql, contratoClienteMantenimiento);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        contratoClienteMantenimiento.contratoClienteMantenimientoId = result.insertId;
        callback(null, contratoClienteMantenimiento);
    });
}

// putContratoClienteMantenimiento
// Modifica el contrato comercial según los datos del objeto pasao
module.exports.putContratoClienteMantenimiento = function (id, contratoClienteMantenimiento, callback) {
    if (!comprobarContratoClienteMantenimiento(contratoClienteMantenimiento)) {
        var err = new Error("El contato pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != contratoClienteMantenimiento.contratoClienteMantenimientoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = cm.getConnection();
    sql = "UPDATE contrato_cliente_mantenimiento SET ? WHERE contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, [contratoClienteMantenimiento, contratoClienteMantenimiento.contratoClienteMantenimientoId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, contratoClienteMantenimiento);
    });
}

// deleteContratoClienteMantenimiento
// Elimina el contrato comercial con el id pasado
module.exports.deleteContratoClienteMantenimiento = function (id, contratoClienteMantenimiento, callback) {
    var connection = cm.getConnection();
    // primero borramos las líneas 
    sql = "DELETE from contrato_cliente_mantenimiento_comisionistas WHERE contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        if (err) {
            return callback(err);
        }
        // ahora borramos la cabecera
        sql = "DELETE from contrato_cliente_mantenimiento WHERE contratoClienteMantenimientoId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            cm.closeConnection(connection);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
}

/*-------------------------------------------------------------------
    Manejo de la generación de las prefacturas de 
    los cmantenimientos
---------------------------------------------------------------------*/

// postGenerarPrefacturas
// Generar las prefacturas asociadas a un contrato.
module.exports.postGenerarPrefacturas = function (lista, callback) {
    var listaPrefacturas = []; // nueva lista a devolver    
    // la lista lleva prefacturas previas
    async.each(lista, function (pf, callback2) {
        fnCreaUnaPrefactura(pf, function (err, prefactura) {
            if (err) return callback3(err);
            listaPrefacturas.push(prefactura);
            callback2();
        })
    }, function (err) {
        if (err) return callback(err);
        callback(null, listaPrefacturas);
    })
}

var fnCreaUnaPrefactura = function (prefactura, callback) {
    var pf = prefactura;
    async.series({
        pfCabecera: function (cbk) {
            // 
            pf.ano = moment(pf.fecha, 'DD/MM/YYYY').year();
            var c = cm.getConnection();
            pf.prefacturaId = 0; // fuerza el uso de autoincremento
            async.series({
                buscaEmpresa: fnBuscarEmpresa(pf.empresaId, function(err, result){
                    if (err) return cbk(err);
                    if (result.length == 0){
                        var error = new Error('No se encuentra la empresa: ' + empresaId);
                        return cbk(error);
                    }
                    // ya tenemos la empresa ponemos los datos
                    var e = result[0];
                    pf.
                }),
                buscaCliente: fnBuscarCliente(pf.clienteId, function(err, result){

                })
            }, function(err, result){

            });
            sql = "INSERT INTO prefacturas SET ?";
            sql = mysql.format(sql, pf);
            connection.query(sql, function (err, result) {
                c.closeConnection(connection);
                if (err) {
                    return cbk(err);
                }
                pf.prefacturaId = result.insertId;
                callback(null, pf);
            });
        },
        pfLineas: function (cbk) {
            // Crear las líneas
        },
        pfBases: function (cbk) {
            // Crear las bases
        }

    }, function (err, result) {
        if (err) return callback(err);
        callback(null, pf);
    });
};

var fnBuscarEmpresa = function (empresaId, callback){
    var sql = "SELECT * FROM empresas WHERE empresaId = ?";
    var c = cm.getConnection();
    sql = sql.format(sql, empresaId);
    c.query(sql, function(err, result){
        c.closeConnection();
        if (err) return callback(err);
        callback(null, result);
    });
}
var fnBuscarCliente = function (clienteId, callback){
    var sql = "SELECT * FROM clientes WHERE clienteId = ?";
    var c = cm.getConnection();
    sql = sql.format(sql, empresaId);
    c.query(sql, function(err, result){
        c.closeConnection();
        if (err) return callback(err);
        callback(null, result);
    });
}