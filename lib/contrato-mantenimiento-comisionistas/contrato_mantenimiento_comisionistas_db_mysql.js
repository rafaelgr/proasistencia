// Funciones de uso comun
var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async');

var clientesComisionistasDb = require("../clientes-comisionistas/clientes_comisionistas_db_mysql");

var sql = "";

// comprobarContratoMantenimientoComisionista
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarContratoMantenimientoComisionista(contratoMantenimientoComisionista) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof contratoMantenimientoComisionista;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && contratoMantenimientoComisionista.hasOwnProperty("contratoClienteMantenimientoComisionistaId"));
    comprobado = (comprobado && contratoMantenimientoComisionista.hasOwnProperty("contratoClienteMantenimientoId"));
    comprobado = (comprobado && contratoMantenimientoComisionista.hasOwnProperty("comercialId"));
    return comprobado;
}


// getContratoMantenimientoComisionistas
// lee todos los registros de la tabla contratoMantenimientoComisionistas y
// los devuelve como una lista de objetos
module.exports.getContratosMantenimientoComisionistas = function (callback) {
    var connection = cm.getConnection();
    var contratoMantenimientoComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial";
    sql += " FROM contrato_cliente_mantenimiento_comisionistas as cc";
    sql += " LEFT JOIN contrato_cliente_mantenimiento as cm ON cm.contratoClienteMantenimientoId = cc.contratoClienteMantenimientoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " LEFT JOIN comerciales as co ON co.comercialId = cc.comercialId";
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientesComisionistas = result;
        callback(null, clientesComisionistas);
    });
}

// getContratoMantenimientoComisionistasBuscar
// lee todos los registros de la tabla contratoMantenimientoComisionistas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getContratoMantenimientoComisionistasBuscar = function (nombre, callback) {
    var connection = cm.getConnection();
    var clientesComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial";
    sql += " FROM contrato_cliente_mantenimiento_comisionistas as cc";
    sql += " LEFT JOIN contrato_cliente_mantenimiento as cm ON cm.contratoClienteMantenimientoId = cc.contratoClienteMantenimientoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " LEFT JOIN comerciales as co ON co.comercialId = cc.comercialId";
    if (nombre !== "*") {
        sql += "  WHERE c.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientesComisionistas = result;
        callback(null, clientesComisionistas);
    });
}

// getContratoMantenimientoComisionista
// busca  el contratoMantenimientoComisionista con id pasado
module.exports.getContratoMantenimientoComisionista = function (id, callback) {
    var connection = cm.getConnection();
    var contratoMantenimientoComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial";
    sql += " FROM contrato_cliente_mantenimiento_comisionistas as cc";
    sql += " LEFT JOIN contrato_cliente_mantenimiento as cm ON cm.contratoClienteMantenimientoId = cc.contratoClienteMantenimientoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " LEFT JOIN comerciales as co ON co.comercialId = cc.comercialId";
    sql += "  WHERE cc.contratoClienteMantenimientoComisionistaId = ?";
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

// getComisionistasMantenimiento
// busca  el contratoMantenimientoComisionista con id pasado
module.exports.getComisionistasMantenimiento = function (id, callback) {
    var connection = cm.getConnection();
    var contratoMantenimientoComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial";
    sql += " FROM contrato_cliente_mantenimiento_comisionistas as cc";
    sql += " LEFT JOIN contrato_cliente_mantenimiento as cm ON cm.contratoClienteMantenimientoId = cc.contratoClienteMantenimientoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " LEFT JOIN comerciales as co ON co.comercialId = cc.comercialId";
    sql += "  WHERE cc.contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


// postContratoMantenimientoComisionista
// crear en la base de datos el contratoMantenimientoComisionista pasado
module.exports.postContratoMantenimientoComisionista = function (contratoMantenimientoComisionista, callback) {
    if (!comprobarContratoMantenimientoComisionista(contratoMantenimientoComisionista)) {
        var err = new Error("El registro pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = cm.getConnection();
    contratoMantenimientoComisionista.contratoClienteMantenimientoComisionistaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO contrato_cliente_mantenimiento_comisionistas SET ?";
    sql = mysql.format(sql, contratoMantenimientoComisionista);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        contratoMantenimientoComisionista.contratoClienteMantenimientoComisionistaId = result.insertId;
        callback(null, contratoMantenimientoComisionista);
    });
}

// putContratoMantenimientoComisionista
// Modifica el contratoMantenimientoComisionista según los datos del objeto pasao
module.exports.putContratoMantenimientoComisionista = function (id, contratoMantenimientoComisionista, callback) {
    if (!comprobarContratoMantenimientoComisionista(contratoMantenimientoComisionista)) {
        var err = new Error("El registro pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != contratoMantenimientoComisionista.contratoClienteMantenimientoComisionistaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = cm.getConnection();
    sql = "UPDATE contrato_cliente_mantenimiento_comisionistas SET ? WHERE contratoClienteMantenimientoComisionistaId = ?";
    sql = mysql.format(sql, [contratoMantenimientoComisionista, contratoMantenimientoComisionista.contratoClienteMantenimientoComisionistaId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, contratoMantenimientoComisionista);
    });
}

// deleteContratoMantenimientoComisionista
// Elimina el contratoMantenimientoComisionista con el id pasado
module.exports.deleteContratoMantenimientoComisionista = function (id, contratoMantenimientoComisionista, callback) {
    var connection = cm.getConnection();
    sql = "DELETE from contrato_cliente_mantenimiento_comisionistas WHERE contratoClienteMantenimientoComisionistaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// Cargar comisionistas del cliente por defecto
module.exports.cargarComisionistasPorDefecto = function (contratoClienteMantenimientoId, clienteId, callback) {
    clientesComisionistasDb.getComisionistaAgente(contratoClienteMantenimientoId, clienteId, function (err, result) {
        if (err) {
            return callback(err);
        }
        // como solo va a devolver uno montamos una serie de 1
        var res = [];
        res.push(result);
        // -- BEGIN async.each
        async.each(res, function (comisionista, callback2) {
            // hay que dar de alta cada uno de ellos
            var contratoMantenimientoComisionista = {
                contratoClienteMantenimientoComisionistaId: 0,
                contratoClienteMantenimientoId: contratoClienteMantenimientoId,
                comercialId: comisionista.comercialId,
                porVentaNeta: comisionista.manPorVentaNeta,
                porBeneficio: comisionista.manPorBeneficio,
                porComer: comisionista.porComer
            };
            if (comisionista.tipoMantenimientoId == 1) {
                contratoMantenimientoComisionista.porComer = comisionista.manComision;
            }
            if (comisionista.tipoMantenimientoId == 2) {
                contratoMantenimientoComisionista.porComer = comisionista.segComision;
            }
            // si no ha encontrado valor le ponemos el por defecto
            if (contratoMantenimientoComisionista.porComer == 0){
                contratoMantenimientoComisionista.porComer = comisionista.porComer;
            }
            var connection = cm.getConnection();
            sql = "INSERT INTO contrato_cliente_mantenimiento_comisionistas SET ?";
            sql = mysql.format(sql, contratoMantenimientoComisionista);
            connection.query(sql, function (err, result) {
                cm.closeConnection(connection);
                if (err) {
                    return callback2(err);
                }
                contratoMantenimientoComisionista.contratoClienteMantenimientoComisionistaId = result.insertId;
                callback2(null);
            });
        }, function (err) {
            // aquí llega cuando acaba con todos
            if (err) {
                return callback(err);
            }
            callback(null, null);
        })
        //-- END asyn.each
    });
}