// Funciones de uso comun
var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async');


// getPrefactura
// obtiene los datos de una única prefactura
module.exports.getPrefactura = function (id, fcallback) {
    // construimos tres llamadas asícronas para 
    // cabecera, lineas y bases
    async.series([
        function (callback) {
            // Obtener la cabecera
            var c = cm.getConnection();
            var sql = "SELECT";
            sql += " pf.prefacturaId, pf.ano, pf.numero, pf.serie, pf.fecha,";
            sql += " pf.empresaId, pf.clienteId, pf.contratoMantenimientoId,";
            sql += " pf.emisorNif, pf.emisorNombre, pf.emisorDireccion, pf.emisorCodPostal, pf.emisorPoblacion, pf.emisorProvincia,";
            sql += " pf.receptorNif, pf.receptorNombre, pf.receptorDireccion, pf.receptorCodPostal, pf.receptorPoblacion, pf.receptorProvincia,";
            sql += " pf.total, pf.totalConIva, fp.nombre AS formaPago, pf.observaciones";
            sql += " FROM prefacturas AS pf";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formapagoId";
            sql += " WHERE pf.prefacturaId = ?";
            sql = mysql.format(sql, id);
            c.query(sql, function (err, data) {
                cm.closeConnection(c);
                if (err) {
                    return callback(err, null);
                }
                if (data.length == 0) {
                    // no ha encontrado la cabecera
                    return callback(null, null);
                }
                // devuelve un único objeto
                callback(null, data[0]);
            })
        },
        function (callback) {
            // Obtener las líneas
            var c = cm.getConnection();
            var sql = "SELECT pfl.*, t.nombre AS tipoIva";
            sql += " FROM prefacturas_lineas AS pfl";
            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfl.tipoIvaId";
            sql += " WHERE pfl.prefacturaId = ?";
            sql = mysql.format(sql, id);
            c.query(sql, function (err, data) {
                cm.closeConnection(c);
                if (err) {
                    return callback(err, null);
                }
                // devuelve un vector de objectos
                callback(null, data);
            })
        },
        function (callback) {
            // Obtener las líneas
            var c = cm.getConnection();
            var sql = "SELECT pfb.*, t.nombre AS tipoIva";
            sql += " FROM prefacturas_bases AS pfb";
            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfb.tipoIvaId";
            sql += " WHERE pfb.prefacturaId = ?";
            sql = mysql.format(sql, id);
            c.query(sql, function (err, data) {
                cm.closeConnection(c);
                if (err) {
                    return callback(err, null);
                }
                // devuelve un vector de objectos
                callback(null, data);
            })
        }
    ],
        function (err, datos) {
            // Si se ha producido un error lo devolvemos directamente
            if (err) {
                return fcallback(err);
            }
            // datos es un vector con tres elementos
            // (1) La cabecera o nulo si no ha encontrado la prefactura
            // (2) las lineas de esa prefactura
            // (3) las bases de esa prefactura
            var cabecera = datos[0],
                lineas = datos[1],
                bases = datos[2],
                prefactura = {};
            if (!cabecera) {
                prefactura = null;
            } else {
                prefactura.cabecera = cabecera;
                prefactura.lineas = lineas;
                prefactura.bases = bases;
            }
            fcallback(null, prefactura);
        }
    );
}