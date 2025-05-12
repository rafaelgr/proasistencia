var cm = require('../comun/comun'),
    mysql = require('mysql'),
    mysql2 = require('mysql2/promise'),
    async = require('async'),
    moment = require('moment');
    var fs = require("fs");

var empresaDb = require('../empresas/empresas_db_mysql');
var clienteDb = require('../clientes/clientes_db_mysql');
var prefacturasDb = require('../prefacturas/prefacturas_db_mysql');
const { resolve, Resolver } = require('dns');

const obtenerConfiguracion = function() {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET,
        multipleStatements: true
    }
}

module.exports.getExpedientesEstado = function (estadoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT ex.*,";
        sql += " em.nombre AS empresa,"; 
        sql += " cl.nombre AS cliente,";
        sql += " e.nombre AS estado,"; 
        sql += " com.nombre AS agente,";
        sql += " com2.nombre AS comercial,";
        sql += " com3.nombre AS jefeGrupo,";
        sql += " com4.nombre AS jefeObras,";
        sql += " com5.nombre AS oficinatecnica,";
        sql += " com6.nombre AS asesorTecnico";
        sql += " FROM expedientes AS ex";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = ex.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = ex.clienteId";
        sql += " LEFT JOIN estados_expediente AS e ON  e.estadoExpedienteId = ex.estadoExpedienteId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = ex.agenteId";
        sql += " LEFT JOIN comerciales AS com2 ON com2.comercialId = ex.comercialId";
        sql += " LEFT JOIN comerciales AS com3 ON com3.comercialId = ex.jefeGrupoId";
        sql += " LEFT JOIN comerciales AS com4 ON com4.comercialId = ex.jefeObrasId";
        sql += " LEFT JOIN comerciales AS com5 ON com5.comercialId = ex.oficinaTecnicaId";
        sql += " LEFT JOIN comerciales AS com6 ON com6.comercialId = ex.asesorTecnicoId";
        if(estadoId) sql += ` WHERE ex.estadoExpedienteId = ${estadoId}` 
        con.query(sql, function (err, expedientes) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, expedientes);
        })
    });
}

module.exports.getExpediente = function (expedienteId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT ex.*,";
        sql += " em.nombre AS empresa,"; 
        sql += " cl.nombre AS cliente,";
        sql += " e.nombre AS estado,"; 
        sql += " com.nombre AS agente,";
        sql += " com2.nombre AS comercial,";
        sql += " com3.nombre AS jefeGrupo,";
        sql += " com4.nombre AS jefeObras,";
        sql += " com5.nombre AS oficinatecnica,";
        sql += " com6.nombre AS asesorTecnico";
        sql += " FROM expedientes AS ex";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = ex.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = ex.clienteId";
        sql += " LEFT JOIN estados_expediente AS e ON  e.estadoExpedienteId = ex.estadoExpedienteId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = ex.agenteId";
        sql += " LEFT JOIN comerciales AS com2 ON com2.comercialId = ex.comercialId";
        sql += " LEFT JOIN comerciales AS com3 ON com3.comercialId = ex.jefeGrupoId";
        sql += " LEFT JOIN comerciales AS com4 ON com4.comercialId = ex.jefeObrasId";
        sql += " LEFT JOIN comerciales AS com5 ON com5.comercialId = ex.oficinaTecnicaId";
        sql += " LEFT JOIN comerciales AS com6 ON com6.comercialId = ex.asesorTecnicoId";
        sql += " WHERE ex.expedienteId = ?";
        sql = mysql.format(sql, expedienteId);
        con.query(sql, function (err, expedientes) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, expedientes);
        })
    });
}

module.exports.postExpediente = function (expediente, done) {
    actualizarEnBaseDatosExpediente('POST', expediente, done);
}

module.exports.putExpediente = function (expediente, done) {
    actualizarEnBaseDatosExpediente('PUT', expediente, done);
}

module.exports.deleteExpediente = function (expediente, done) {
    // actualizamos previamente las referencias de ese expediente
    // en las expedientes para evitar errores.
    cm.getConnectionCallback(function (err, con) {
        var sql = "UPDATE ofertas SET expedienteId = NULL WHERE expedienteId = ?";
        sql = mysql.format(sql, expediente.expedienteId);
        con.query(sql, function (err) {
            cm.closeConnection(con);
            if (err) return done(err);
            // una vez eliminada la referencia podemos borrar.
            actualizarEnBaseDatosExpediente('DELETE', expediente, done);
        });
    });
}


var actualizarEnBaseDatosExpediente = function (comando, expediente, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "";
        switch (comando) {
            case 'POST':
                sql = "INSERT INTO expedientes SET ?";
                sql = mysql.format(sql, expediente);
                break;
            case 'PUT':
                sql = "UPDATE expedientes SET ? WHERE expedienteId = ?";
                sql = mysql.format(sql, [expediente, expediente.expedienteId]);
                break;
            case 'DELETE':
                sql = "DELETE FROM expedientes WHERE expedienteId = ?";
                sql = mysql.format(sql, expediente.expedienteId);
                break;
            default:
                return done(new Error('Comando de actualización incorrecto'));
                break;
        }
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return done(err);
            if (comando == 'POST') expediente.expedienteId = result.insertId;
            done(null, expediente);
        })
    });
}
