// facturas_db_mysql
// Manejo de la tabla facturas en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");
var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf

    var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");

//  leer la configurción de MySQL

//var config2 = require("../../config.json");
var fs = require('fs');




var sql = "";
var Stimulsoft = require('stimulsoft-reports-js');

var ioAPI = require('../ioapi/ioapi');

var correoAPI = require('../correoElectronico/correoElectronico');
var cobrosDb = require('../cobros/cobros_db_mysql');

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
		host: process.env.BASE_MYSQL_HOST,
		user: process.env.BASE_MYSQL_USER,
		password: process.env.BASE_MYSQL_PASSWORD,
		database: process.env.BASE_MYSQL_DATABASE,
		port: process.env.BASE_MYSQL_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}
// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function (err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function (err) {
        if (err) callback(err);
    });
}

// comprobarFactura
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarFactura(factura) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof factura;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && factura.hasOwnProperty("facturaId"));
    comprobado = (comprobado && factura.hasOwnProperty("empresaId"));
    comprobado = (comprobado && factura.hasOwnProperty("clienteId"));
    comprobado = (comprobado && factura.hasOwnProperty("fecha"));
    return comprobado;
}


// getFacturas
// lee todos los registros de la tabla facturas que no estén facturadosy
// los devuelve como una lista de objetos
module.exports.getFacturas = function (callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM facturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.contafich IS NULL";
    sql += " ORDER BY pf.fecha";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        facturas = result;
        callback(null, facturas);
    });
}

module.exports.getFacturasContrato = function (contratoId, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM facturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.contratoId = ?";
    sql += " ORDER BY pf.fecha";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        facturas = result;
        callback(null, facturas);
    });
}

module.exports.getFacturasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM facturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.contratoId = ?";
    sql += " AND pf.generada = 1"
    sql += " ORDER BY pf.fecha";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        facturas = result;
        callback(null, facturas);
    });
}

module.exports.deleteFacturasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "DELETE FROM facturas";
    sql += " WHERE contratoId = ? AND generada = 1"
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err);
        callback(null);
    });
}

module.exports.getFacPdf2 = function (dFecha, hFecha, empresaId, clienteId, callback) {
    var con = getConnection();
    var facturas = null;
    sql = "SELECT f.facturaId, f.serie, f.ano, f.numero, f.fecha, e.nombre, e.infFacturas,";
    sql += " CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId";
    // -- modificar sql según parámetros
    sql += " WHERE TRUE"
    if (clienteId != 0) {
        sql += " AND f.clienteId = " + clienteId;
    }
    if (empresaId != 0) {
        sql += " AND f.empresaId = " + empresaId;
    }
    if (dFecha) {
        sql += " AND f.fecha >= '" + dFecha + " 00:00:00'";
    }
    if (hFecha) {
        sql += " AND f.fecha <= '" + hFecha + " 23:59:59'";
    }
    //StiOptions.WebServer.url = "/api/streport";
    Stimulsoft.StiOptions.WebServer.url = "/api/streport";
    //Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../Localization/es.xml", true);
    Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    con.query(sql, function (err, result) {
        con.end();
        if (err) return callback(err, null);
        facturas = result;
        // generar el pdf por cada factura
        facturas.forEach(function (f) {
            var report = new Stimulsoft.Report.StiReport();
            var file = process.env.REPORTS_DIR + "\\" + f.infFacturas + ".mrt";
            report.loadFile(file);
            var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
            connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
            connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
            connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
            //report.dictionary.databases.list[0].connectionString = connectionString;
            var pos = 0;
            for (var i = 0; i < report.dataSources.items.length; i++) {
                var str = report.dataSources.items[i].sqlCommand;
                if (str.indexOf("pf.facturaId") > -1) pos = i;
            }
            var sql = report.dataSources.items[pos].sqlCommand;
            report.dataSources.items[0].sqlCommand = sql + " WHERE pf.facturaId = " + f.facturaId;
            // Renreding report
            report.renderAsync(function () {
                // Creating export settings
                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                // Creating export service
                var service = new Stimulsoft.Report.Export.StiPdfExportService();
                // Creating MemoryStream
                var stream = new Stimulsoft.System.IO.MemoryStream();

                // Exportong report into the MemoryStream
                service.exportToAsync(function () {
                    // Converting MemoryStream into Array
                    var data = stream.toArray();
                    // Converting Array into buffer
                    var buffer = new Buffer(data, "utf-8")

                    // File System module
                    var fs = require('fs');

                    // Saving string with rendered report in PDF into a file
                    fs.writeFileSync(process.env.FACTURA_DIR + "\\" + f.nomfich + ".pdf", buffer);
                    callback(null, facturas);

                }, report, stream, settings);
            });
        });
    });
}

// getFacturasAll
// lee todos los registros de la tabla facturas y
// los devuelve como una lista de objetos
module.exports.getFacturasAll = function (callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM facturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " ORDER BY pf.fecha";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        facturas = result;
        callback(null, facturas);
    });
}


// getPreEmisionFacturas
// obtiene las facturas no facturadas entre las fechas indicadas
module.exports.getPreEmisionFacturas = function (dFecha, hFecha, clienteId, agenteId, articuloId, tipoMantenimientoId, callback) {
    var connection = getConnection();
    var facturas = null;
    // primero las marcamos por defeto como facturables
    var sql = "UPDATE facturas SET sel = 1";
    sql += " WHERE fecha >= ? AND fecha <= ?";
    sql += " AND facturaId IS NULL";
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT pf.*,";
        sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
        sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
        sql += " fp.nombre AS vFPago,";
        sql += " c.comercialId as agenteId, cm.articuloId, cm.tipoMantenimientoId"
        sql += " FROM facturas AS pf";
        sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId"
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
        sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
        if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
        if (agenteId != 0) sql += " AND c.comercialId = " + agenteId;
        if (articuloId != 0) sql += " AND articuloId = " + articuloId;
        if (tipoMantenimientoId != 0) sql += " AND tipoMantenimientoId = " + tipoMantenimientoId;
        sql += " AND pf.facturaId IS NULL";
        sql += " ORDER BY pf.fecha";
        sql = mysql.format(sql, [dFecha, hFecha]);
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            res.forEach(function (pf) {
                pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
            });
            facturas = res;
            callback(null, facturas);
        });
    });
}

// getPreContaFacturas
// obtiene las facturas no contabilizadas entre las fechas indicadas
module.exports.getPreContaFacturas = function (dFecha, hFecha, departamentoId, usuarioId, callback) {
    var connection = getConnection();
    var facturas = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "UPDATE facturas SET sel = 1";
    sql += " WHERE fecha >= ? AND fecha <= ?";
    sql += " AND contafich IS NULL";
    if(departamentoId && departamentoId > 0) {
        sql += " AND departamentoId =" + departamentoId;
    } else {
        sql += " AND departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM facturas AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        sql += " AND f.contabilizada = 0";
        if(departamentoId && departamentoId > 0) {
            sql += " AND f.departamentoId = "+ departamentoId;
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
        }
        sql = mysql.format(sql, [dFecha, hFecha]);
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            facturas = res;
            callback(null, facturas);
        });
    });
}

// getPreCorreoFacturas
// obtiene las facturas no enviadas entre las fechas indicadas
module.exports.getPreCorreoFacturas = function (dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId,callback) {
    var connection = getConnection();
    var facturas = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "UPDATE facturas SET sel = 1";
    sql += " WHERE fecha >= ? AND fecha <= ?"; 
    if(clienteId > 0) {
        sql += " AND clienteId = ?";
    }
    sql += " AND enviadaCorreo = 0";
    sql = mysql.format(sql, [dFecha, hFecha, clienteId]);
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM facturas AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        sql += " AND f.enviadaCorreo = 0";
        sql = mysql.format(sql, [dFecha, hFecha]);
        if (clienteId > 0) {
            sql += " AND cnt.clienteId = ?";
            sql = mysql.format(sql, clienteId);
        }
        if (mantenedorId > 0) {
            sql += " AND cnt.mantenedorId = ?";
            sql = mysql.format(sql, mantenedorId);
        }
        if (comercialId > 0) {
            sql += " AND cnt.agenteId = ?";
            sql = mysql.format(sql, comercialId);
        }
        if (contratoId > 0) {
            sql += " AND cnt.contratoId = ?";
            sql = mysql.format(sql, contratoId);
        }

        if (empresaId > 0) {
            sql += " AND f.empresaId = ?";
            sql = mysql.format(sql, empresaId);
        }


        if (departamentoId > 0) {
            sql += " AND f.departamentoId = ?";
            sql = mysql.format(sql, departamentoId);
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")";
        }

        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            facturas = res;
            callback(null, facturas);
        });
    });
}

// getPreLiquidacionFacturas
// obtiene las facturas no contabilizadas entre las fechas indicadas
module.exports.getPreLiquidacionFacturas = function (dFecha, hFecha, departamentoId, empresaId, comercialId, usuarioId, callback) {
    var connection = getConnection();
    var facturas = null;
    var sql = "";
    // desmarcamos todas las facturas
    sql = "UPDATE facturas SET sel = 0";
    connection.query(sql, function (err) {
        if (err) { connection.end(); return callback(err) }
        // primero las marcamos por defeto como liquidables
        sql = "SELECT DISTINCT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum ";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += " FROM facturas AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " LEFT JOIN contratos_comisionistas as cms ON cms.contratoId = f.contratoId"
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
        if (departamentoId != 0) {
            sql += " AND f.departamentoId = " + departamentoId;
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"            
        }
        if (empresaId != 0) {
            sql += " AND f.empresaId = " + empresaId;
        }
        if (comercialId != 0) {
            sql += " AND (cnt.agenteId = " + comercialId + " OR cms.comercialId = " + comercialId + ")";
        }
        connection.query(sql, function (err, res) {
            if (err) { connection.end(); return callback(err) }
            facturas2 = res;
            facturas = [];
            async.forEachSeries(facturas2, function (f, callback2) {
                cobrosDb.isFacturaCobrada(f.facturaId, function (err, cobrada) {
                    if (err) return callback2(err);
                    if (cobrada){
                        f.sel = 1;
                        facturas.push(f);
                    } 
                    callback2();
                });
            }, function (err) {
                // --------------
                if (err) { connection.end(); return callback(err) }
                var inSQl = "0";
                facturas.forEach(function (f) {
                    inSQl += "," + f.facturaId;
                });
                var sql = "UPDATE facturas SET sel = 1";
                sql += " WHERE facturaId IN (" + inSQl + ")";
                connection.query(sql, function (err, res) {
                    connection.end();
                    if (err) return callback(err);
                    callback(null, facturas);
                });
                // ----------------
            });
        });
    })

}

// getFactura
// busca  el factura con id pasado
module.exports.getFactura = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM facturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.facturaId = ?";
    sql += " ORDER BY pf.fecha";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        callback(null, result[0]);
    });
}


// postFactura
// crear en la base de datos el factura pasado
module.exports.postFactura = function (factura, callback) {
    if (!comprobarFactura(factura)) {
        var err = new Error("El factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    factura.facturaId = 0; // fuerza el uso de autoincremento
    fnGetNumeroFactura(factura, function (err, res) {
        if (err) return callback(err);
        sql = "INSERT INTO facturas SET ?";
        sql = mysql.format(sql, factura);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            factura.facturaId = result.insertId;
            callback(null, factura);
        });
    });
}


/*module.exports.postContabilizarFacturas = function (dFecha, hFecha, done) {
    var con = getConnection();
    var sql = "";
    sql = "SELECT * FROM empresas;";
    con.query(sql, function (err, empresas) {
        async.eachSeries(empresas, function (empresa, callback) {
            contabilizarEmpresa(dFecha, hFecha, empresa, function (err) {
                if (err) return callback(err);
                callback();
            });
        }, function (err) {
            if (err) return done(err);
            done(null, 'OK');
        });
    });
}*/

module.exports.postContabilizarFacturas = function (dFecha, hFecha, departamentoId, usuarioId,done) {
    var con = getConnection();
    var sql = "SELECT f.*";
    sql += " FROM facturas as f";
    sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
    sql += " AND f.sel = 1 AND f.contabilizada = 0";
    if(departamentoId && departamentoId > 0) {
        sql += " AND f.departamentoId =" + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        contabilidadDb.contabilizarFacturas(rows, function (err, result) {
            if (err) return done(err);
            if(result.length > 0) {
                done(null, result)
            } else {
                done(null, 'OK');
            }
        });
    });
}


module.exports.postEnviarCorreos = function (dFecha, hFecha, facturas, done) {
    // TODO: Hay que montar los correos propiamente dichos
    crearCorreosAEnviar(dFecha, hFecha, facturas, (err, data) => {
        if (err) return done(err);
        var correos = data;
        enviarCorreos(correos, (err, msg) => {
            done(null, msg);
        });
    })
}

// putFactura
// Modifica el factura según los datos del objeto pasao
module.exports.putFactura = function (id, factura, callback) {
    if (!comprobarFactura(factura)) {
        var err = new Error("El factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != factura.facturaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    } 
    var connection = getConnection();
    if(factura.serie) {//si hay serie hay que actualizar el numero y la serie
        fnGetNumeroFactura(factura, function (err, res) {
            if(res) {
                factura = res;
                sql = "UPDATE facturas SET ? WHERE facturaId = ?";
                sql = mysql.format(sql, [factura, factura.facturaId]);
                connection.query(sql, function (err, result) {
                    closeConnectionCallback(connection, callback);
                    if (err) {
                        return callback(err);
                    }
                    callback(null, factura);
                });
            }
        });
    } else {
        delete factura.serie;//si la sertie es null no se actualiza
        sql = "UPDATE facturas SET ? WHERE facturaId = ?";
        sql = mysql.format(sql, [factura, factura.facturaId]);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            callback(null, factura);
        });
    }
}

// deleteFactura
// Elimina el factura con el id pasado
module.exports.deleteFactura = function (id, factura, callback) {
    var connection = getConnection();
    sql = "DELETE from facturas WHERE facturaId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// deleteFacturasContrato
// Elimina todas las facturas pertenecientes a un contrato.
module.exports.deleteFacturasContrato = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from facturas WHERE contratoClienteMantenimientoId = ? AND generada = 1";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// postDesmarcarPrefactura
module.exports.postDesmarcarFactura = function (id, done) {
    var con = getConnection();
    sql = "UPDATE prefacturas SET facturaId = NULL WHERE facturaId = ?";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, data) {
        con.end();
        if (err) return done(err);
        done(null, data);
    });
}

// postDescontabilizar
module.exports.postDescontabilizar = function (id, done) {
    var con = getConnection();
    sql = "UPDATE facturas SET contabilizada = 0 WHERE facturaId = ?";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, data) {
        con.end();
        if (err) return done(err);
        done(null, data);
    });
}

/*
|---------------------------------------|
|                                       |
|  LINEAS PREFACTURA                    |
|                                       |
|---------------------------------------|
*/


// comprobarFacturaLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarFacturaLinea(facturaLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof facturaLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && facturaLinea.hasOwnProperty("facturaId"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("facturaLineaId"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("linea"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("porcentaje"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("descripcion"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("cantidad"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("importe"));
    comprobado = (comprobado && facturaLinea.hasOwnProperty("totalLinea"));
    return comprobado;
}

// getNextFacturaLine
// busca el siguiente número de línea de la factura pasada
module.exports.getNextFacturaLineas = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT MAX(linea) as maxline FROM facturas_lineas"
    sql += " WHERE facturaId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        var maxline = result[0].maxline;
        if (!maxline) {
            return callback(null, 1.1);
        }
        callback(null, roundToTwo(maxline + 0.1));
    });
}

// getFacturaLineas
// Devuelve todas las líneas de una prefacttura
module.exports.getFacturaLineas = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM facturas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.facturaId = ?";
    sql += " ORDER by linea";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// getFacturaLinea
// Devuelve la línea de factura solcitada por su id.
module.exports.getFacturaLinea = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM facturas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.facturaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// postFacturaLinea
// crear en la base de datos la linea de factura pasada
module.exports.postFacturaLinea = function (facturaLinea, callback) {
    if (!comprobarFacturaLinea(facturaLinea)) {
        var err = new Error("La linea de factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    facturaLinea.facturaLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO facturas_lineas SET ?";
    sql = mysql.format(sql, facturaLinea);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        facturaLinea.facturaLineaId = result.insertId;
        // actualizar las bases y cuotas
        fnActualizarBases(facturaLinea.facturaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, facturaLinea);
        })
    });
}


// putFacturaLinea
// Modifica la linea de factura según los datos del objeto pasao
module.exports.putFacturaLinea = function (id, facturaLinea, callback) {
    if (!comprobarFacturaLinea(facturaLinea)) {
        var err = new Error("La linea de factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != facturaLinea.facturaLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE facturas_lineas SET ? WHERE facturaLineaId = ?";
    sql = mysql.format(sql, [facturaLinea, facturaLinea.facturaLineaId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(facturaLinea.facturaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, facturaLinea);
        })
    });
}

// deleteFacturaLinea
// Elimina la linea de factura con el id pasado
module.exports.deleteFacturaLinea = function (id, facturaLinea, callback) {
    var connection = getConnection();
    sql = "DELETE from facturas_lineas WHERE facturaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(facturaLinea.facturaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null);
        })
    });
}


// recalculo de línea de factura
module.exports.recalculoLineasFactura = function (facturaId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, done) {
    var con = getConnection();
    // Buscamos la líneas de la factura
    sql = " SELECT pf.coste as costeFacturaCompleta, pfl.*";
    sql += " FROM facturas as pf";
    sql += " LEFT JOIN facturas_lineas as pfl ON pfl.facturaId = pf.facturaId";
    sql += " WHERE pf.facturaId = ?";
    sql = mysql.format(sql, facturaId);
    con.query(sql, function (err, lineas) {
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
            var porcentajeDelCoste = linea.coste / linea.costeFacturaCompleta;
            var importeDelNuevoCoste = coste * porcentajeDelCoste;
            linea.coste = importeDelNuevoCoste;
            // Recalculamos el total de la línea en base a los nuevos datos
            linea.totalLinea = obtenerImporteAlClienteDesdeCoste(importeDelNuevoCoste, porcentajeBeneficio, porcentajeAgente, tipoClienteId);
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costeFacturaCompleta;
            // Actualizamos la línea lo que actualizará de paso la factura
            exports.putFacturaLinea(linea.facturaLineaId, linea, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        }, function (err) {
            if (err) return done(err);
            done(null);
        });
    });

}

var obtenerImporteAlClienteDesdeCoste = function (coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId) {
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeAlCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (porcentajeBeneficio) {
            importeBeneficio = roundToTwo(porcentajeBeneficio * coste / 100);
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (porcentajeAgente) {
        importeAlCliente = roundToTwo(ventaNeta / ((100 - porcentajeAgente) / 100));
        importeAgente = roundToTwo(importeAlCliente - ventaNeta);
    }
    importeAlCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    if (tipoClienteId == 1) {
        // es un mantenedor
        importeAlCliente = roundToTwo(importeAlCliente - ventaNeta + importeBeneficio);
    }
    return importeAlCliente;
}


// fnActualizarBases
// Actuliza la tabla de bases y cuotas de la factura pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBases = function (id, callback) {
    fnBorraBases(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
        sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
        sql += " SELECT pl.facturaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
        sql += " FROM";
        sql += " (SELECT facturaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
        sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
        sql += " FROM facturas_lineas";
        sql += " WHERE facturaId = ?";
        sql += " GROUP BY tipoIvaId) AS pl";
        sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            // Antes de volver actualizamos los totales y así está hecho
            fnActualizarTotales(id, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        });
    })
}

// fnActualizarTotales
// Actuliza los campos de totales de la cabecera de factura
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotales = function (id, callback) {
    var connection = getConnection();
    sql = "UPDATE facturas AS pf,";
    sql += " (SELECT facturaId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM facturas_bases GROUP BY 1) AS pf2,";
    sql += " (SELECT facturaId, SUM(coste) AS sc";
    sql += " FROM facturas_lineas GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
    sql += " pf.coste = pf3.sc";
    sql += " WHERE pf.facturaId = ?";
    sql += " AND pf2.facturaId = pf.facturaId";
    sql += " AND pf3.facturaId = pf.facturaId";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// fnBorraBases
// elimina las bases y cuotas de una factura
// antes de actualizarlas
var fnBorraBases = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM facturas_bases";
    sql += " WHERE facturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// getFacturaBases
// devuelve los regitros de bases y cutas de la 
// factura con el id pasado
module.exports.getFacturaBases = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pb.*, ti.nombre as tipo";
    sql += " FROM facturas_bases as pb";
    sql += " LEFT JOIN tipos_iva as ti ON ti.tipoIvaId = pb.tipoIvaId"
    sql += " WHERE facturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// -- Obtener número de factura
// La idea es devolver la factura con los campos ano, numero y serie
var fnGetNumeroFactura = function (factura, done) {
    var con = getConnection();
    // hay que obtener de la empresa la serie
    var sql = "SELECT * FROM empresas where empresaId = ?";
    sql = mysql.format(sql, factura.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(factura.fecha).year();
       
        var serie = res[0].seriePre;
        if(factura.serie) {
            serie = factura.serie;
        }
        
        sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM facturas";
        sql += " WHERE empresaId = ?";
        sql += " AND ano = ?";
        sql += " AND serie = ?";
        sql = mysql.format(sql, [factura.empresaId, ano, serie]);
        con.query(sql, function (err, res) {
            if (err) return done(err);
            // actualizar los campos del objeto factura
            factura.numero = res[0].n;
            factura.ano = ano;
            factura.serie = serie;
            
            done(null, factura);
        })
    });
}

var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};

// CREACION A PARTIR DE PREFACTURAS
module.exports.postCrearDesdePrefacturas = function (dFecha, hFecha, fechaFactura, clienteId, agenteId, tipoMantenimientoId, empresaId, rectificativas,done) {
    var con = getConnection();
    var sql = "";
    var facturaId = 0;
    var factura = null;
    // Transaccion general que protege todo el proceso
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // obtener las prefacturas que han de pasarse a factura
        sql = "SELECT pf.*, c.comercialId as agenteId, cm.tipoContratoId FROM prefacturas as pf";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId"
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
        sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
        sql += " AND pf.facturaId IS NULL AND pf.sel = 1";
        if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
        if (agenteId != 0) sql += " AND c.comercialId = " + agenteId; 
        if (tipoMantenimientoId != 0) sql += " AND cm.tipoContratoId = " + tipoMantenimientoId;
        if (rectificativas == 1) sql +=  " AND pf.total < 0"
        if (empresaId != 0) sql += " AND pf.empresaId = " + empresaId;
        sql += " ORDER BY fecha";
        sql = mysql.format(sql, [dFecha, hFecha]);
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function () { done(err) });
            prefacturas = res;
            async.eachSeries(prefacturas, function (pf, callback2) {
                // transformar un objeto prefactura en uno factura
                pf.facturaId = 0;
                async.series([
                    function (callback) {
                        // obtener el número de factura que le corresponde
                        fnGetNumeroFacturaTrans(pf, con, function (err, res) {
                            if (err) return callback(err);
                            factura = res;
                            callback(null);
                        }, con);
                    },
                    function (callback) {
                        // insertar la cabecera
                        // eliminar las columnas adcionales
                        delete factura.agenteId;
                        delete factura.tipoMantenimientoId;
                        delete factura.articuloId;
                        delete factura.tipoContratoId;
                        sql = "INSERT INTO facturas SET ?";
                        sql = mysql.format(sql, factura);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            factura.facturaId = result.insertId;
                            facturaId = result.insertId;
                            callback(null);
                        });
                    },
                    function (callback) {
                        // insertar las líneas
                        sql = "INSERT INTO facturas_lineas(linea, facturaId,unidadId,  articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea,";
                        sql += " coste, porcentajeBeneficio, porcentajeAgente, capituloLinea)";
                        sql += " SELECT linea, " + factura.facturaId + " AS  facturaId, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea,";
                        sql += " coste, porcentajeBeneficio, porcentajeAgente, capituloLinea";
                        sql += " FROM prefacturas_lineas";
                        sql += " WHERE prefacturas_lineas.prefacturaId = ?";
                        sql = mysql.format(sql, factura.prefacturaId);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        // insertar las bases
                        sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
                        sql += " SELECT  " + factura.facturaId + " AS  facturaId, tipoIvaId, porcentaje, base, cuota";
                        sql += " FROM prefacturas_bases";
                        sql += " WHERE prefacturas_bases.prefacturaId = ?";
                        sql = mysql.format(sql, factura.prefacturaId);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        // actualizar la prefactura indicando la factura en la que está.
                        sql = "UPDATE prefacturas SET facturaId = ? WHERE prefacturaId = ?";
                        sql = mysql.format(sql, [factura.facturaId, factura.prefacturaId]);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    }
                ], function (err) {
                    if (err) return callback2(err);
                    callback2(null);
                });
            }, function (err) {
                if (err) return con.rollback(function () { done(err) });
                con.commit(function (err) {
                    if (err) return con.rollback(function () { done(err) });
                    con.end();
                    done(null);
                })
            })
        });
    });
}


// CREACION DE FACTURA A PARTIR DE PARTE
module.exports.postCrearFactCliDesdeParte = function (seleccionados, deFecha, aFecha, done) {
    deFecha = moment(deFecha, 'DD.MM.YYYY').format('DD/MM/YYYY');
    aFecha = moment(aFecha, 'DD.MM.YYYY HH:mm').format('DD/MM/YYYY');
    var periodo = deFecha + "-" + aFecha;
    var con = getConnection();
    var numFact;
    var partesActualiza = [];
    var lineasFactura;
    var ano = moment(new Date()).year();
    var sql =""
    var partes = []
    // Transaccion general que protege todo el proceso
    for (var i= 0; i< seleccionados.length; i++) {
        partes.push(seleccionados[i].parteId);
    }
    //OBTENEMOS LAS CABECERAS
    sql = "SELECT YEAR(NOW()) AS ano, NOW() AS fecha, ser.clienteId, '"+ periodo +"' AS periodo,";
    sql += " ser.empresaId, emp.nombre AS emisorNombre, emp.nif AS emisorNif, emp.`direccion` AS emisorDireccion,";
    sql += " emp.`codPostal` AS emisorCodpostal, emp.`poblacion` AS emisorPoblacion, emp.`provincia` AS emisorProvincia,";
    sql += " cli.`nombre` AS receptorNombre, cli.`nif` AS receptorNif, cli.`codPostal2` AS receptorCodPostal,";
    sql += " cli.`poblacion2` AS receptorPoblacion, cli.`provincia2` AS receptorProvincia, ser.`direccionTrabajo` AS receptorDireccion,";
    sql += " par.formaPagoClienteId AS formaPagoId, SUM(par.`importe_cliente`) AS coste, SUM(par.`importe_cliente`) AS totalAlCliente, SUM(par.`importe_cliente`) AS total, 0 AS porcentajeBeneficio,";
    sql += " 0 AS porcentajeAgente, SUM(par.importe_cliente_iva) AS totalConIva, 7 AS departamentoId, 1 AS noCalculadora";
    sql += " FROM servicios AS ser";
    sql += " LEFT JOIN partes AS par ON par.servicioId = ser.servicioId";
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
    sql += " LEFT JOIN empresas AS emp ON emp.empresaId = ser.empresaId";
    sql += " WHERE par.parteId IN (?) GROUP BY ser.clienteId, par.formaPagoClienteId"
    sql = mysql.format(sql, [partes]);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        cabFacturas = res;
        con.beginTransaction(function (err) {
            if (err) return done(err);
           
                async.eachSeries(cabFacturas, function (sel, callback2) {
                    
                    async.series([
                        function (callback) {
                            // obtener Las series de factura correspondientes
                            sql = "SELECT * FROM empresas where empresaId = ?";
            
                            sql = mysql.format(sql, sel.empresaId);
                            con.query(sql, function (err, res) {
                                if (err) return callback(err);
                                sel.serie = res[0].serieFacRep;
                                callback(null);
                            });
                        },
                        function (callback) {
                            // obtener el número de factura que le corresponde
                            sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM facturas";
                            sql += " WHERE empresaId = ?";
                            sql += " AND ano = ?";
                            sql += " AND serie = ?";
                            sql = mysql.format(sql, [sel.empresaId, ano, sel.serie]);
                            con.query(sql, function (err, res) {
                                if (err) return callback(err);
                                sel.numero = res[0].n
                                numFact = sel.serie+'-'+sel.ano+'-'+sel.numero
                                callback(null)
                            });
                        },
                        
                        function (callback) {
                           //SE CREA LA CABECERA DE LA FACTURA
                           sel.facturaId = 0//forzamos el autoincremento
                           var sql2 = "INSERT INTO facturas SET ?"
                           sql2 = mysql.format(sql2, sel);
                           con.query(sql2, function(err, res) {
                                if (err) return callback(err);
                                sel.facturaId = res.insertId;
                                callback(null)
                           });
                        },
                        function(callback) {
                             //TRANSFORMAR LOS CAMPOS DEL PARTE_LINEA EN CAMPOS DE FACTURA_LINEA
                             sql = " SELECT pt.descripcion AS descripcion, pt.unidades AS cantidad,ar.articuloId AS articuloId,pt.tipoIvaClienteId AS tipoIvaId, pt.ivaCliente AS porcentaje, ar.unidadId,";
                             sql += " pt.importeCliente AS importe, pt.importeCliente AS coste, pt.importeCliente AS totalLinea ,ga.nombre AS capituloLinea ";
                             sql += " FROM partes AS par";
                             sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
                             sql += " LEFT JOIN partes_lineas AS pt ON pt.parteId = par.parteId"
                             sql += " LEFT JOIN articulos AS ar ON ar.codigoReparacion = pt.codigoArticulo";
                             sql += " LEFT JOIN unidades AS u ON u.unidadId = ar.unidadId";
                             sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoarticuloId = ar.grupoArticuloId"
                             sql += " WHERE ser.clienteId = ? AND ser.empresaId = ? AND par.formaPagoClienteId = ? AND par.parteId IN (?)";
                             sql += " ORDER BY pt.parteLineaId"
                             sql = mysql.format(sql, [sel.clienteId, sel.empresaId, sel.formaPagoId, partes]);
                             con.query(sql, function (err, res) {
                                if (err) return callback(err);
                                lineasFactura = res
                                //procesamos las lineas
                                var cont = 0;
                                lineasFactura.forEach( function(l){
                                    cont ++;
                                    l.facturaLineaId = 0//forzamos autoincremento
                                    l.facturaId = sel.facturaId;
                                    var str = cont.toString();
                                    l.linea = "1." + str;
    
                                });
                                callback(null)
                            });
                        },
                        function (callback) {
                            //SE CREAN LAS lINEAS DE LA FACTURA
                           async.eachSeries(lineasFactura, function (f, done2) {
                            var sql2 = "INSERT INTO facturas_lineas SET ?"
                            sql2 = mysql.format(sql2, f);
                                con.query(sql2, function(err, res) {
                                    if (err) return done2(err);
                                    f.facturaLineaId = res.insertId;
                                    done2(null);
    
                                });
                            },function (err) {
                                if (err) return callback(err);
                                callback(null);
                            });
                        },
                        function(callback) {//SE INSERTAN LAS BASES DE LA FACTURA
                            sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
                            sql += " SELECT pl.facturaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
                            sql += " FROM";
                            sql += " (SELECT facturaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
                            sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
                            sql += " FROM facturas_lineas";
                            sql += " WHERE facturaId = ?";
                            sql += " GROUP BY tipoIvaId) AS pl";
                            sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
                            sql = mysql.format(sql, sel.facturaId);
                            con.query(sql, function(err, res) { 
                                if (err) return callback(err);
                                callback(null);
                            });
                        },
                        function(callback) {//SELECCIONAMOS LA ID DEL PARTE QUE SE TIENE QUE ACTUALIZAR
                            sql = " SELECT par.parteId";
                             sql += " FROM partes AS par";
                             sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
                             sql += " WHERE ser.clienteId = ? AND ser.empresaId = ? AND par.formaPagoClienteId = ? AND par.parteId IN (?)";
                             sql = mysql.format(sql, [sel.clienteId, sel.empresaId, sel.formaPagoId, partes]);
                             con.query(sql, function(err, res) { 
                                if (err) return callback(err);
                                partesActualiza = res
                                callback(null);
                            });
                        },
                        function(callback) {//ACTUALIZAMOS EL PARTE CON EL NIUMERO DE FACTURA CORRESPONDIENTE
                            async.eachSeries(partesActualiza, function (f, done3) {
                                var sql3 = "UPDATE PARTES SET numero_factura_cliente = ?, fecha_factura_cliente = NOW() WHERE parteId = ?"
                                sql3 = mysql.format(sql3, [numFact,f.parteId]);
                                    con.query(sql3, function(err, res) {
                                        if (err) return done3(err);
                                        done3(null);
        
                                    });
                                },function (err) {
                                    if (err) return callback(err);
                                    callback(null);
                                });
                        }
                        
                    ], function (err) {
                        if (err) return callback2(err);
                        callback2(null);
                    });
                }, function (err) {
                    if (err) return con.rollback(function () { done(err) });
                    con.commit(function (err) {
                        if (err) return con.rollback(function () { done(err) });
                        con.end();
                        done(null);
                    })
                })
            });
    });
}





var fnGetNumeroFacturaTrans = function (factura, con, done) {
    // hay que obtener de la empresa la serie
    var sql = "SELECT * FROM empresas where empresaId = ?";
    sql = mysql.format(sql, factura.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(factura.fecha).year();
        var serie = res[0].serieFac;
        if (factura.departamentoId == 2) {
            serie = res[0].serieFacS;
        }
        if(factura.total < 0) {
            serie = res[0].serieFacR;
        }
        fnComprobarOrdenCorrecto(serie, ano, factura.fecha, function (err, res) {
            if (err) return done(err);
            sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM facturas";
            sql += " WHERE empresaId = ?";
            sql += " AND ano = ?";
            sql += " AND serie = ?";
            sql = mysql.format(sql, [factura.empresaId, ano, serie]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                // actualizar los campos del objeto factura
                factura.numero = res[0].n;
                factura.ano = ano;
                factura.serie = serie;
                done(null, factura);
            })
        }, con);
    });
}

// fnComprobarOrderCorrecto:
// es llamada desde obtener numero de factura, porque es en ese momento cuando sabemos
// la serie correspondiente.
var fnComprobarOrdenCorrecto = function (serie, ano, fecha, done, con) {
    var passedConnection = true;
    var con = con;
    if (!con) {
        // si no nos han pasado una conexión la creamos.
        con = getConnection();
        passedConnection = false;
    }
    var sql = "SELECT * FROM facturas";
    sql += " WHERE ano = ? AND serie = ? AND fecha > ?"
    sql = mysql.format(sql, [ano, serie, fecha]);
    con.query(sql, function (err, res) {
        if (!passedConnection) closeConnection(con);
        if (err) return done(err);
        if (res.length == 0) {
            done(null, true);
        } else {
            done(new Error('Ya hay facturas posteriores a ' + moment(fecha).format('DD/MM/YYYY') + ' dadas de alta para la serie ' + serie));
        }
    })
}

// Contabilización como función serparada
var contabilizarEmpresa = function (dFecha, hFecha, empresa, done) {
    if (!empresa.contabilidad) return done(null, null);
    var con = getConnection();
    var sql = "";
    sql = "SELECT f.serie AS serie,";
    sql += " CONCAT(ano, RIGHT(CONCAT('000000',numero),6)) AS factura,";
    sql += " DATE_FORMAT(fecha, '%d/%m/%y') AS fecha,";
    sql += " c.cuentaContable AS cuenta_cli, c.iban, '' as observacion,";
    sql += " fp.codigoContable AS fpago,";
    sql += " 0 AS tipo_operacion,";
    sql += " '' AS cuenta_ret, '' AS imp_ret, '' AS tipo_ret,";
    sql += " 700000001 AS cuenta_ventas,";
    sql += " '' AS centro_coste,";
    sql += " fb.base AS imp_venta, fb.porcentaje AS por_iva, fb.cuota AS imp_iva,";
    sql += " '' AS por_rec, '' AS imp_rec,";
    sql += " f.totalConIva AS total_factura, 0 AS integracion";
    sql += " FROM facturas  AS f";
    sql += " LEFT JOIN facturas_bases AS fb ON fb.facturaId = f.facturaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
    sql += " WHERE f.sel = 1 AND f.empresaId = ?";
    sql += " AND f.fecha >= ? AND f.fecha <= ?";
    sql += " AND f.contafich IS NULL";
    sql += " ORDER BY serie, factura";
    sql = mysql.format(sql, [empresa.empresaId, dFecha, hFecha]);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(null, '');
        facturas = res;
        var facs = "serie;factura;fecha;cuenta_cli;fpago;tipo_operacion;";
        facs += "cuenta_ret;imp_ret;tipo_ret;cuenta_ventas;centro_coste;imp_venta;";
        facs += "por_iva;imp_iva;por_rec;imp_rec;total_factura;integracion;iban;observacion\r\n";
        var f1 = "%s;%s;%s;%s;%s;%s;";
        var f2 = "%s;%s;%s;%s;%s;%s;";
        var f3 = "%s;%s;%s;%s;%s;%s;%s;%s\r\n";
        facturas.forEach(function (f) {
            // vamos cargando una a una las líneas de facturas;
            facs += sprintf(f1, f.serie, f.factura, f.fecha, f.cuenta_cli, f.fpago, f.tipo_operacion);
            facs += sprintf(f2, f.cuenta_ret, f.imp_ret, f.tipo_ret, f.cuenta_ventas, f.centro_coste, f.imp_venta);
            facs += sprintf(f3, f.por_iva, f.imp_iva, f.por_rec, f.imp_rec, f.total_factura, f.integracion, f.iban, f.observacion);
        });
        // montamos el nombre del fichero.
        var fichero = moment(dFecha).format('YYYYMMDD') + "_" + moment(hFecha).format('YYYYMMDD') + ".csv";
        var nomfich = process.env.CONTA_DIR + "\\" + empresa.contabilidad + "_" + fichero;
        fs.writeFile(nomfich, facs, function (err) {
            if (err) return done(err);
            // actualizar las facturas como generadas
            sql = "UPDATE facturas as f SET f.contafich = ?"
            sql += " WHERE empresaId = ?";
            sql += " AND f.fecha >= ? AND f.fecha <= ?";
            sql += " AND f.contafich IS NULL";
            sql = mysql.format(sql, [fichero, empresa.empresaId, dFecha, hFecha]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                done(null, fichero);
            });
        });
    });
}

//-------------------------------
module.exports.getFacPdf = function (dFecha, hFecha, empresaId, clienteId, callback) {
    var con = getConnection();
    var facturas = null;
    sql = "SELECT f.facturaId, f.serie, f.ano, f.numero, f.fecha, e.nombre, e.infFacturas,";
    sql += " CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId";
    // -- modificar sql según parámetros
    sql += " WHERE TRUE"
    if (clienteId != 0) {
        sql += " AND f.clienteId = " + clienteId;
    }
    if (empresaId != 0) {
        sql += " AND f.empresaId = " + empresaId;
    }
    if (dFecha) {
        sql += " AND f.fecha >= '" + dFecha + " 00:00:00'";
    }
    if (hFecha) {
        sql += " AND f.fecha <= '" + hFecha + " 23:59:59'";
    }
    //StiOptions.WebServer.url = "/api/streport";
    Stimulsoft.StiOptions.WebServer.url = "http://" + process.env.API_HOST + ":" + process.env.STI_PORT;
    //console.log("SSTISER: ", Stimulsoft.StiOptions.WebServer.url);
    //Stimulsoft.StiOptions.WebServer.url = "http://localhost:5000/api/streport";
    //Stimulsoft.StiOptions.WebServer.url = "http://localhost:9615";
    //Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../Localization/es.xml", true);
    Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    con.query(sql, function (err, result) {
        con.end();
        if (err) return callback(err, null);
        facturas = result;
        async.forEachSeries(facturas, function (f, done1) {
            var report = new Stimulsoft.Report.StiReport();
            var file = process.env.REPORTS_DIR + "\\" + f.infFacturas + ".mrt";
            report.loadFile(file);
            var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
            connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
            connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
            connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
            report.dictionary.databases.list[0].connectionString = connectionString;
            var pos = 0;
            for (var i = 0; i < report.dataSources.items.length; i++) {
                var str = report.dataSources.items[i].sqlCommand;
                if (str.indexOf("pf.facturaId") > -1) pos = i;
            }
            var sql = report.dataSources.items[pos].sqlCommand;
            report.dataSources.items[pos].sqlCommand = sql + " WHERE pf.facturaId = " + f.facturaId;
            report.renderAsync(function () {
                // Creating export settings
                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                // Creating export service
                var service = new Stimulsoft.Report.Export.StiPdfExportService();
                // Creating MemoryStream
                var stream = new Stimulsoft.System.IO.MemoryStream();
                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                var service = new Stimulsoft.Report.Export.StiPdfExportService();
                var stream = new Stimulsoft.System.IO.MemoryStream();

                service.exportTo(report, stream, settings);

                var data = stream.toArray();

                var buffer = new Buffer(data, "utf-8");

                fs.writeFileSync(process.env.FACTURA_DIR + "\\" + f.nomfich + ".pdf", buffer);
                done1();
            });

        }, function (err) {
            if (err) return callback(err);
            callback(null);
        })
    });
}

//METODOS DE FACTURAS POR DEPARTAMENTOL DE USUARIO

// getFacturas
// lee todos los registros de la tabla facturas que no estén facturadosy
// los devuelve como una lista de objetos
module.exports.getFacturasUsuario = function (usuarioId, departamentoId, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM facturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cm.tipoContratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.contafich IS NULL";
    if(departamentoId > 0) {
        sql += " AND pf.departamentoId = " + departamentoId;
    } else {
        sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    sql += " ORDER BY pf.fecha";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        facturas = result;
        callback(null, facturas);
    });
}

// getFacturasAll
// lee todos los registros de la tabla facturas y
// los devuelve como una lista de objetos
module.exports.getFacturasAllUsuario = function (usuarioId, departamentoId, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM facturas AS pf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cm.tipoContratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    if(departamentoId > 0) {
        sql += " WHERE pf.departamentoId = " + departamentoId;
    } else {
        sql += " WHERE pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    sql += " ORDER BY pf.fecha";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        facturas = result;
        callback(null, facturas);
    });
}

// CREACION A PARTIR DE PREFACTURAS
module.exports.postCrearDesdePrefacturasUsuario = function (dFecha, hFecha, fechaFactura, usuarioId, clienteId, agenteId, departamentoId, empresaId, rectificativas,done) {
    var con = getConnection();
    var sql = "";
    var facturaId = 0;
    var factura = null;
    // Transaccion general que protege todo el proceso
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // obtener las prefacturas que han de pasarse a factura
        sql = "SELECT pf.*  FROM prefacturas as pf";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId"
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
        sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
        sql += " AND pf.facturaId IS NULL AND pf.sel = 1";
        if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
        if (agenteId != 0) sql += " AND c.comercialId = " + agenteId; 
        if (departamentoId > 0) {
            sql += " AND pf.departamentoId = " + departamentoId;
        } else {
            sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+usuarioId+")"
        }
        if (rectificativas == 1) sql +=  " AND pf.total < 0"
        if (empresaId != 0) sql += " AND pf.empresaId = " + empresaId;
        sql += " ORDER BY fecha";
        sql = mysql.format(sql, [dFecha, hFecha]);
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function () { done(err) });
            prefacturas = res;
            async.eachSeries(prefacturas, function (pf, callback2) {
                // transformar un objeto prefactura en uno factura
                pf.facturaId = 0;
                async.series([
                    function (callback) {
                        // obtener el número de factura que le corresponde
                        fnGetNumeroFacturaTrans(pf, con, function (err, res) {
                            if (err) return callback(err);
                            factura = res;
                            callback(null);
                        }, con);
                    },
                    function (callback) {
                        // insertar la cabecera
                        sql = "INSERT INTO facturas SET ?";
                        sql = mysql.format(sql, factura);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            factura.facturaId = result.insertId;
                            facturaId = result.insertId;
                            callback(null);
                        });
                    },
                    function (callback) {
                        // insertar las líneas
                        sql = "INSERT INTO facturas_lineas(linea, facturaId,unidadId,  articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea,";
                        sql += " coste, porcentajeBeneficio, porcentajeAgente, capituloLinea)";
                        sql += " SELECT linea, " + factura.facturaId + " AS  facturaId, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea,";
                        sql += " coste, porcentajeBeneficio, porcentajeAgente, capituloLinea";
                        sql += " FROM prefacturas_lineas";
                        sql += " WHERE prefacturas_lineas.prefacturaId = ?";
                        sql = mysql.format(sql, factura.prefacturaId);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        // insertar las bases
                        sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
                        sql += " SELECT  " + factura.facturaId + " AS  facturaId, tipoIvaId, porcentaje, base, cuota";
                        sql += " FROM prefacturas_bases";
                        sql += " WHERE prefacturas_bases.prefacturaId = ?";
                        sql = mysql.format(sql, factura.prefacturaId);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        // actualizar la prefactura indicando la factura en la que está.
                        sql = "UPDATE prefacturas SET facturaId = ? WHERE prefacturaId = ?";
                        sql = mysql.format(sql, [factura.facturaId, factura.prefacturaId]);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    }
                ], function (err) {
                    if (err) return callback2(err);
                    callback2(null);
                });
            }, function (err) {
                if (err) return con.rollback(function () { done(err) });
                con.commit(function (err) {
                    if (err) return con.rollback(function () { done(err) });
                    con.end();
                    done(null);
                })
            })
        });
    });
}



// plantillaFactura
// obtiene la la plantilla de informe de una determinada factura
// especificando su id.
var plantillaFactura = (facturaId, done) => {
    var con = getConnection();
    var infFacturas = "";
    var sql = "SELECT e.infFacturas FROM facturas AS f LEFT JOIN empresas AS e ON e.empresaId = f.empresaId";
    sql += " WHERE f.facturaId = ?";
    sql = mysql.format(sql, facturaId);
    con.query(sql, (err, data) => {
        con.end();
        if (err) return done(err);
        infFacturas = data[0].infFacturas;
        done(null, infFacturas);
    });
}

module.exports.postPrepararCorreos = function (dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId, done) {
    crearPdfsFactura(dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId, (err, facturas) => {
        if (err) return done(err);
        done(null, facturas);
    });
}

// grabarPdfDeFactura
var grabarPdfDeFactura = (facturaId, infFacturas, nomfich, done) => {
    // Parámetros generales stimultsoft
    Stimulsoft.StiOptions.WebServer.url = "http://" + process.env.API_HOST + ":" + process.env.STI_PORT;
    Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    //
    var report = new Stimulsoft.Report.StiReport();
    var file = process.env.REPORTS_DIR + "\\" + infFacturas + ".mrt";
    report.loadFile(file);
    var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
            connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
            connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
            connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
    report.dictionary.databases.list[0].connectionString = connectionString;
    var pos = 0;
    for (var i = 0; i < report.dataSources.items.length; i++) {
        var str = report.dataSources.items[i].sqlCommand;
        if (str.indexOf("pf.facturaId") > -1) pos = i;
    }
    var sql = report.dataSources.items[pos].sqlCommand;
    report.dataSources.items[pos].sqlCommand = sql + " WHERE pf.facturaId = " + facturaId;
    report.renderAsync(function () {
        // Creating export settings
        var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
        // Creating export service
        var service = new Stimulsoft.Report.Export.StiPdfExportService();
        // Creating MemoryStream
        var stream = new Stimulsoft.System.IO.MemoryStream();
        var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
        var service = new Stimulsoft.Report.Export.StiPdfExportService();
        var stream = new Stimulsoft.System.IO.MemoryStream();

        service.exportTo(report, stream, settings);

        var data = stream.toArray();

        var buffer = new Buffer(data, "utf-8");

        fs.writeFileSync(process.env.FACTURA_DIR + "\\" + nomfich + ".pdf", buffer);
        done(null, process.env.FACTURA_DIR + "\\" + nomfich + ".pdf")
    });
}

// obtenerFacturasParaCorreo
var obtenerFacturasParaCorreo = (dFecha, hFecha, done) => {
    var con = getConnection();
    var sql = "SELECT ";
    sql += " f.facturaId, CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich,";
    sql += " e.nombre AS nombreEmpresa, e.email AS correoEmpresa, e.infFacturas,";
    sql += " c.nombre AS nombreCliente, c.email AS correoCliente";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
    sql += " WHERE f.fecha BETWEEN ? AND ?";
    sql += " ORDER BY nombreEmpresa, nombreCliente";
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, data) {
        con.end();
        if (err) return done(err);
        done(null, data);
    });
}



// crearCorreosAEnviar
var crearCorreosAEnviar = (dFecha, hFecha, facturas, done) => {
    var numReg = 0;
    var totalReg = facturas.length;
    var primerRegistro = true;
    var antEmpresa = "";
    var antCliente = "";
    var asuntoCorreo = "";
    var plantilla = "";
    var c0 = "";
    var c1 = "";
    var correo = {};
    var correos = [];
    facturas.forEach((factura) => {
        ioAPI.sendProgress("Procesando correos...", ++numReg, totalReg);
        if (antEmpresa != factura.nombreEmpresa) {
            // nuevo correo, cada empresa manda el suyo
            correo.emisor = factura.correoEmpresa;
            antEmpresa = factura.nombreEmpresa;
        }
        if (antCliente != factura.nombreCliente) {
            // nuevo cliente, un correo por cliente
            if (!primerRegistro) {
                // antes de guardar montamos la plantilla
                plantilla = plantilla.replace('{0}', c0);
                plantilla = plantilla.replace('{1}', c1);
                correo.cuerpo = plantilla;
                c0 = ""; c1 = ""; plantilla = "";

                // ya podemos guardar el correo anterior en la lista
                correos.push(correo);
            }
            antCliente = factura.nombreCliente;
            primerRegistro = false;
            if (!factura.asuntoCorreo || factura.asuntoCorreo == "") {
                factura.asuntoCorreo = "Envio de facturas"
            }
            asuntoCorreo = factura.asuntoCorreo;
            asuntoCorreo = asuntoCorreo.replace('{0}', factura.nombreEmpresa);
            asuntoCorreo = asuntoCorreo.replace('{1}', dFecha);
            asuntoCorreo = asuntoCorreo.replace('{2}', hFecha);

            correo = {
                nombreEmpresa: factura.nombreEmpresa,
                emisor: factura.correoEmpresa,
                destinatario: factura.correoCliente,
                asunto: asuntoCorreo,
                ficheros: [],
                facturas: []
            }
            c0 = factura.nombreCliente;
        }
        c1 += " FACTURA: " + factura.nomfich + " IMPORTE: " + factura.totalConIva + "<br/>";
        plantilla = factura.plantillaCorreoFacturas;
        correo.ficheros.push(factura.pdf);
        correo.facturas.push(factura);
    });
    if (!primerRegistro) {
        // antes de guardar montamos la plantilla
        plantilla = plantilla.replace('{0}', c0);
        plantilla = plantilla.replace('{1}', c1);
        correo.cuerpo = plantilla;
        c0 = ""; c1 = ""; plantilla = "";
        // guardamos el último correo que quedaría pendiente
        correos.push(correo);
    }
    done(null, correos);
}


var crearPdfsFactura = function (dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId,callback) {
    var con = getConnection();
    var facturas = null;
    var facturas2 = [];
    sql = "SELECT f.facturaId, f.serie, f.ano, f.numero, f.fecha, f.total, f.totalConIva,";
    sql += " e.nombre as nombreEmpresa, e.email as correoEmpresa, e.infFacturas, e.plantillaCorreoFacturas, e.asuntoCorreo, ";
    sql += " c.nombre as nombreCliente, c.email as correoCliente,";
    sql += " CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
    sql += " LEFT JOIN contratos AS co ON co.contratoId = f.contratoId "
    // -- modificar sql según parámetros
    sql += " WHERE f.sel = 1 AND f.enviadaCorreo = 0";
    if (dFecha) {
        sql += " AND f.fecha >= '" + dFecha + " 00:00:00'";
    }
    if (hFecha) {
        sql += " AND f.fecha <= '" + hFecha + " 23:59:59'";
    }
    if (clienteId > 0) sql += " AND co.clienteId = " + clienteId;

    if (mantenedorId > 0) sql += " AND co.mantenedorId = " + mantenedorId;

    if (comercialId > 0) sql += " AND co.agenteId = " + comercialId;

    if (contratoId > 0) sql += " AND co.contratoId = " + contratoId;

    if (empresaId > 0) sql += " AND f.empresaId = " + empresaId;

    if (departamentoId > 0) {
        sql += " AND f.departamentoId = " + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }

    sql += " ORDER by e.nombre, c.nombre";
    //StiOptions.WebServer.url = "/api/streport";
    Stimulsoft.StiOptions.WebServer.url = "http://" + process.env.API_HOST + ":" + process.env.STI_PORT;
    //console.log("SSTISER: ", Stimulsoft.StiOptions.WebServer.url);
    //Stimulsoft.StiOptions.WebServer.url = "http://localhost:5000/api/streport";
    //Stimulsoft.StiOptions.WebServer.url = "http://localhost:9615";
    //Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../Localization/es.xml", true);
    Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    con.query(sql, function (err, result) {
        con.end();
        if (err) return callback(err, null);
        facturas = result;
        var numReg = 0;
        var totalReg = facturas.length;
        ioAPI.sendProgress("Procesando pdfs...", numReg, totalReg);
        async.forEachSeries(facturas, function (f, done1) {
            ioAPI.sendProgress("Procesando pdfs...", ++numReg, totalReg);
            var report = new Stimulsoft.Report.StiReport();
            var file = process.env.REPORTS_DIR + "\\" + f.infFacturas + ".mrt";
            report.loadFile(file);
            var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
            connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
            connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
            connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
            report.dictionary.databases.list[0].connectionString = connectionString;
            var pos = 0;
            for (var i = 0; i < report.dataSources.items.length; i++) {
                var str = report.dataSources.items[i].sqlCommand;
                if (str.indexOf("pf.facturaId") > -1) pos = i;
            }
            var sql = report.dataSources.items[pos].sqlCommand;
            report.dataSources.items[pos].sqlCommand = sql + " WHERE pf.facturaId = " + f.facturaId;
            report.renderAsync(function () {
                // Creating export settings
                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                // Creating export service
                var service = new Stimulsoft.Report.Export.StiPdfExportService();
                // Creating MemoryStream
                var stream = new Stimulsoft.System.IO.MemoryStream();
                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                var service = new Stimulsoft.Report.Export.StiPdfExportService();
                var stream = new Stimulsoft.System.IO.MemoryStream();

                service.exportTo(report, stream, settings);

                var data = stream.toArray();

                var buffer = new Buffer(data, "utf-8");



                fs.writeFileSync(process.env.FACTURA_DIR + "\\" + f.nomfich + ".pdf", buffer);
                f.pdf = process.env.FACTURA_DIR + "\\" + f.nomfich + ".pdf";
                f.nomfich = f.nomfich.toString();
                facturas2.push(f);
                done1();
            });

        }, function (err) {
            if (err) return callback(err);
            callback(null, facturas2);
        })
    });
}

var enviarCorreos = (correos, done) => {
    var resEnvio = "Resultados del envío: <br/>";
    var numReg = 0;
    var totalReg = correos.length;
    async.forEachSeries(correos,
        (c, done1) => {
            recuperaParametros(c.nombreEmpresa, (err, parametros) => {
                if (err) {
                    resEnvio += "ERROR: " + err.message + "<br/>";
                    done1();
                } else {
                    correoAPI.sendCorreo(c, parametros, (err) => {
                        ioAPI.sendProgress("Enviado correos... ", ++numReg, totalReg);
                        resEnvio += c.facturas[0].nombreCliente + "(" + c.facturas[0].correoCliente + ") // ";
                        if (err) {
                            resEnvio += "ERROR: " + err.message + "<br/>";
                            done1();
                        } else {
                            resEnvio += "CORRECTO " + "<br/>";
                            actualizaFacturaComoEnviadaPorCorreo(c, (err) => {
                                if (err) return done1(err);
                                done1();
                            });
                        }
                    });
                }
            });

        },
        (err) => {
            done(null, resEnvio);
        });
}

var recuperaParametros = (nombreEmpresa, callback) => {
    var connection = getConnection();
    var sql = "SELECT hostCorreo, portCorreo, secureCorreo, usuCorreo, passCorreo from empresas";
    sql += " WHERE nombre = " + "'" + nombreEmpresa + "'";
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
}

var actualizaFacturaComoEnviadaPorCorreo = (correo, done) => {
    if (!correo.facturas) return done(); // no hay facturas que actualizar
    async.forEachSeries(correo.facturas,
        (factura, done1) => {
            var con = getConnection();
            var sql = "UPDATE facturas SET enviadaCorreo = 1 WHERE facturaId = ?";
            sql = mysql.format(sql, factura.facturaId);
            con.query(sql, (err) => {
                con.end();
                if (err) return done1(err);
                done1();
            })

        },
        (err) => {
            if (err) return done(err);
            done();
        })
}