// Funciones de uso comun
var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async');
var sql = "";

// comprobarClienteComisionista
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarClienteComisionista(clienteComisionista) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof clienteComisionista;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && clienteComisionista.hasOwnProperty("clienteComisionistaId"));
    comprobado = (comprobado && clienteComisionista.hasOwnProperty("clienteId"));
    comprobado = (comprobado && clienteComisionista.hasOwnProperty("comercialId"));
    return comprobado;
}


// getClienteComisionistas
// lee todos los registros de la tabla clienteComisionistas y
// los devuelve como una lista de objetos
module.exports.getClientesComisionistas = function (callback) {
    var connection = cm.getConnection();
    var clienteComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial";
    sql += " FROM clientes_comisionistas as cc";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cc.clienteId";
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

// getClienteComisionistasBuscar
// lee todos los registros de la tabla clienteComisionistas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getClienteComisionistasBuscar = function (nombre, callback) {
    var connection = cm.getConnection();
    var clientesComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial";
    sql += " FROM clientes_comisionistas as cc";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cc.clienteId";
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

// getClienteComisionista
// busca  el clienteComisionista con id pasado
module.exports.getClienteComisionista = function (id, callback) {
    var connection = cm.getConnection();
    var clienteComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial";
    sql += " FROM clientes_comisionistas as cc";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN comerciales as co ON co.comercialId = cc.comercialId";
    sql += "  WHERE cc.clienteComisionistaId = ?";
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

// getClienteComisionistas
// buscamos todos los comisionistas de un determinado cliente
module.exports.getClienteComisionistas = function (id, callback) {
    var connection = cm.getConnection();
    var clienteComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial";
    sql += " FROM clientes_comisionistas as cc";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN comerciales as co ON co.comercialId = cc.comercialId";
    sql += "  WHERE cc.clienteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

// getClienteComisionistaManSeg
// busca los comisionistas de un cliente y su valor de comisión según el contrato
// sea de mantenimiento o de seguros.
module.exports.getCLienteComisionistaManSeg = function (contratoMantenimientoId, clienteId, done) {
    var con = cm.getConnection();
    var sql = "SELECT cc.*, c.nombre AS cliente, co.nombre AS comercial, COALESCE(cco.manComision, 0) AS manComision, COALESCE(cco.segComision, 0) AS segComision, ccm.tipoMantenimientoId";
    sql += " FROM clientes_comisionistas AS cc";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN comerciales AS co ON co.comercialId = cc.comercialId";
    sql += " LEFT JOIN contrato_cliente_mantenimiento AS ccm ON ccm.contratoClienteMantenimientoId = ?";
    sql += " LEFT JOIN contrato_comercial AS cco ON cco.empresaId = ccm.empresaId AND cco.comercialId = cc.comercialId";
    sql += " WHERE cc.clienteId = ?";
    sql = mysql.format(sql, [contratoMantenimientoId, clienteId]);
    con.query(sql, function (err, result) {
        cm.closeConnection(con);
        if (err) {
            return done(err, null);
        }
        if (result.length == 0) {
            return done(null, null);
        }
        done(null, result);
    });
}

module.exports.getComisionistaAgente = function (contratoMantenimientoId, clienteId, done) {
    var con = cm.getConnection();
    var sql = "SELECT c2.comercialId, COALESCE(c2.porComer, 0) AS porComer, COALESCE(cc.manComision,0) AS manComision, COALESCE(cc.segComision,0) AS segComision";
    sql += " FROM contrato_cliente_mantenimiento AS ccm";
    sql += " LEFT JOIN comerciales AS c1 ON c1.comercialId = ccm.comercialId";
    sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = c1.ascComercialId";
    sql += " LEFT JOIN contrato_comercial AS cc ON (cc.empresaId = ccm.empresaId AND cc.comercialId = c2.comercialId)";
    sql += " WHERE ccm.contratoClienteMantenimientoId = ?";
    sql += " ORDER BY cc.fechaInicio DESC";
    sql = mysql.format(sql, contratoMantenimientoId);
    con.query(sql, function(err, res){
        cm.closeConnection(con);
        if (err) return done(err);
        if (res.length == 0) return done(null, res);
        // hemos ordenado por fecha con el fin de coger el contrato más reciente
        // por eso es cogemos el primer registro
        done(null, res[0]);
    })

}

// postClienteComisionista
// crear en la base de datos el clienteComisionista pasado
module.exports.postClienteComisionista = function (clienteComisionista, callback) {
    if (!comprobarClienteComisionista(clienteComisionista)) {
        var err = new Error("El registro pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = cm.getConnection();
    clienteComisionista.clienteComisionistaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO clientes_comisionistas SET ?";
    sql = mysql.format(sql, clienteComisionista);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        clienteComisionista.clienteComisionistaId = result.insertId;
        callback(null, clienteComisionista);
    });
}

// putClienteComisionista
// Modifica el clienteComisionista según los datos del objeto pasao
module.exports.putClienteComisionista = function (id, clienteComisionista, callback) {
    if (!comprobarClienteComisionista(clienteComisionista)) {
        var err = new Error("El registro pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != clienteComisionista.clienteComisionistaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = cm.getConnection();
    sql = "UPDATE clientes_comisionistas SET ? WHERE clienteComisionistaId = ?";
    sql = mysql.format(sql, [clienteComisionista, clienteComisionista.clienteComisionistaId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, clienteComisionista);
    });
}

// deleteClienteComisionista
// Elimina el clienteComisionista con el id pasado
module.exports.deleteClienteComisionista = function (id, clienteComisionista, callback) {
    var connection = cm.getConnection();
    sql = "DELETE from clientes_comisionistas WHERE clienteComisionistaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// getClienteComisionistaComercial
// busca  el clienteComisionista con id pasado
module.exports.getClienteComisionistaComercial = function (idCliente, idComercial, callback) {
    var connection = cm.getConnection();
    var clienteComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial";
    sql += " FROM clientes_comisionistas as cc";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN comerciales as co ON co.comercialId = cc.comercialId";
    sql += "  WHERE c.clienteId = ? AND co.comercialId = ?";
    sql = mysql.format(sql, [idCliente, idComercial]);
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