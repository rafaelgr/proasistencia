var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async'),
    moment = require('moment');

module.exports.getOfertas = function (done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getOferta = function (ofertaId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";        
        sql += " WHERE of.ofertaId = ?";
        sql = mysql.format(sql, ofertaId);
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.postOferta = function (oferta, done) {
    actualizarEnBaseDeDatos('POST',oferta, done);
}

module.exports.putOferta = function (oferta, done) {
    actualizarEnBaseDeDatos('PUT', oferta, done);
}

module.exports.deleteOferta = function (oferta, done) {
    actualizarEnBaseDeDatos('DELETE', oferta, done);
}

// private functions
var actualizarEnBaseDeDatos = function (comando, oferta, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "";
        switch (comando) {
            case 'POST':
                sql = "INSERT INTO ofertas SET ?";
                sql = mysql.format(sql, oferta);
                break;
            case 'PUT':
                sql = "UPDATE ofertas SET ? WHERE ofertaId = ?";
                sql = mysql.format(sql, [oferta, oferta.ofertaId]);
                break;
            case 'DELETE':
                sql = "DELETE FORM ofertas WHERE ofertaId = ?";
                sql = mysql.format(sql, oferta.ofertaId);
                break;
            default:
                return done(new Error('Comado de actualización incorrecto'));
                break;
        }
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, oferta);
        })
    });
}