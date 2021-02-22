// facturas_db_mysql
// Manejo de la tabla prefacturasauto en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");
var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf
    var comun = require('../comun/comun.js');

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
function comprobarFactura(prefacturaAuto) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof prefacturaAuto;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && prefacturaAuto.hasOwnProperty("prefacturaAutoId"));
    comprobado = (comprobado && prefacturaAuto.hasOwnProperty("empresaId"));
    comprobado = (comprobado && prefacturaAuto.hasOwnProperty("clienteId"));
    comprobado = (comprobado && prefacturaAuto.hasOwnProperty("fecha"));
    return comprobado;
}


// getPrefacturas
// lee todos los registros de la tabla prefacturasauto que no estén facturadosy
// los devuelve como una lista de objetos
module.exports.getPrefacturas = function (callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturasauto AS pf";
    sql += " LEFT JOIN prefacturasauto AS f ON f.prefacturaAutoId = pf.prefacturaAutoId";
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
        prefacturasauto = result;
        callback(null, prefacturasauto);
    });
}

module.exports.getPrefacturasContrato = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturasauto AS pf";
    sql += " LEFT JOIN prefacturasauto AS f ON f.prefacturaAutoId = pf.prefacturaAutoId";
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
        prefacturasauto = result;
        callback(null, prefacturasauto);
    });
}

module.exports.getPrefacturasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturasauto AS pf";
    sql += " LEFT JOIN prefacturasauto AS f ON f.prefacturaAutoId = pf.prefacturaAutoId";
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
        prefacturasauto = result;
        callback(null, prefacturasauto);
    });
}

module.exports.deletePrefacturasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "DELETE FROM prefacturasauto";
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
    var prefacturasauto = null;
    sql = "SELECT f.prefacturaAutoId, f.serie, f.ano, f.numero, f.fecha, e.nombre, e.infPrefacturasauto,";
    sql += " CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich";
    sql += " FROM prefacturasauto AS f";
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
        prefacturasauto = result;
        // generar el pdf por cada prefacturaAuto
        prefacturasauto.forEach(function (f) {
            var report = new Stimulsoft.Report.StiReport();
            var file = process.env.REPORTS_DIR + "\\" + f.infPrefacturasauto + ".mrt";
            report.loadFile(file);
            var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
            connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
            connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
            connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
            //report.dictionary.databases.list[0].connectionString = connectionString;
            var pos = 0;
            for (var i = 0; i < report.dataSources.items.length; i++) {
                var str = report.dataSources.items[i].sqlCommand;
                if (str.indexOf("pf.prefacturaAutoId") > -1) pos = i;
            }
            var sql = report.dataSources.items[pos].sqlCommand;
            report.dataSources.items[0].sqlCommand = sql + " WHERE pf.prefacturaAutoId = " + f.prefacturaAutoId;
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
                    callback(null, prefacturasauto);

                }, report, stream, settings);
            });
        });
    });
}

// getPrefacturasAll
// lee todos los registros de la tabla prefacturasauto y
// los devuelve como una lista de objetos
module.exports.getPrefacturasAll = function (callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturasauto AS pf";
    sql += " LEFT JOIN prefacturasauto AS f ON f.prefacturaAutoId = pf.prefacturaAutoId";
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
        prefacturasauto = result;
        callback(null, prefacturasauto);
    });
}


// getPreEmisionPrefacturas
// obtiene las prefacturasauto no facturadas entre las fechas indicadas
module.exports.getPreEmisionPrefacturas = function (dFecha, hFecha, clienteId, agenteId, articuloId, tipoMantenimientoId, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    // primero las marcamos por defeto como facturables
    var sql = "UPDATE prefacturasauto SET sel = 1";
    sql += " WHERE fecha >= ? AND fecha <= ?";
    sql += " AND prefacturaAutoId IS NULL";
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT pf.*,";
        sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
        sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
        sql += " fp.nombre AS vFPago,";
        sql += " c.comercialId as agenteId, cm.articuloId, cm.tipoMantenimientoId"
        sql += " FROM prefacturasauto AS pf";
        sql += " LEFT JOIN prefacturasauto AS f ON f.prefacturaAutoId = pf.prefacturaAutoId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId"
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
        sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
        if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
        if (agenteId != 0) sql += " AND c.comercialId = " + agenteId;
        if (articuloId != 0) sql += " AND articuloId = " + articuloId;
        if (tipoMantenimientoId != 0) sql += " AND tipoMantenimientoId = " + tipoMantenimientoId;
        sql += " AND pf.prefacturaAutoId IS NULL";
        sql += " ORDER BY pf.fecha";
        sql = mysql.format(sql, [dFecha, hFecha]);
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            res.forEach(function (pf) {
                pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
            });
            prefacturasauto = res;
            callback(null, prefacturasauto);
        });
    });
}

// getPreContaPrefacturas
// obtiene las prefacturasauto no contabilizadas entre las fechas indicadas
module.exports.getPreContaPrefacturas = function (dFecha, hFecha, departamentoId, usuarioId, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    
    var sql = "UPDATE prefacturasauto SET sel = 0";
    sql += " WHERE fecha >= ? AND fecha <= ?";
    sql += " AND contafich IS NULL AND noContabilizar = 0";
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
        sql += "  FROM prefacturasauto AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        if(departamentoId && departamentoId > 0) {
            sql += " AND f.departamentoId = "+ departamentoId;
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
        }
        sql = mysql.format(sql, [dFecha, hFecha]);
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            prefacturasauto = res;
            callback(null, prefacturasauto);
        });
    });
}

// getPreCorreoPrefacturas
// obtiene las prefacturasauto no enviadas entre las fechas indicadas
module.exports.getPreCorreoPrefacturas = function (dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId,callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "UPDATE prefacturasauto SET sel = 0";
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
        sql += "  FROM prefacturasauto AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
        sql += " LEFT JOIN clientes as cli ON cli.clienteId = f.clienteId";
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        sql += " AND cli.facturarPorEmail = 1";
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
            prefacturasauto = res;
            callback(null, prefacturasauto);
        });
    });
}

// getPreLiquidacionPrefacturas
// obtiene las prefacturasauto no contabilizadas entre las fechas indicadas
module.exports.getPreLiquidacionPrefacturas = function (dFecha, hFecha, departamentoId, empresaId, comercialId, usuarioId, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    var sql = "";
    // desmarcamos todas las prefacturasauto
    sql = "UPDATE prefacturasauto SET sel = 0";
    connection.query(sql, function (err) {
        if (err) { connection.end(); return callback(err) }
        // primero las marcamos por defeto como liquidables
        sql = "SELECT DISTINCT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum ";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += " FROM prefacturasauto AS f";
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
        sql += " ORDER BY f.serie, f.numero";
        connection.query(sql, function (err, res) {
            if (err) { connection.end(); return callback(err) }
            facturas2 = res;
            prefacturasauto = [];
            async.forEachSeries(facturas2, function (f, callback2) {
                cobrosDb.isFacturaCobrada(f.prefacturaAutoId, function (err, cobrada) {
                    if (err) return callback2(err);
                    if (cobrada){
                        f.sel = 1;
                        prefacturasauto.push(f);
                    } 
                    callback2();
                });
            }, function (err) {
                // --------------
                if (err) { connection.end(); return callback(err) }
                var inSQl = "0";
                prefacturasauto.forEach(function (f) {
                    inSQl += "," + f.prefacturaAutoId;
                });
                var sql = "UPDATE prefacturasauto SET sel = 1";
                sql += " WHERE prefacturaAutoId IN (" + inSQl + ")";
                connection.query(sql, function (err, res) {
                    connection.end();
                    if (err) return callback(err);
                    callback(null, prefacturasauto);
                });
                // ----------------
            });
        });
    })

}

// getFactura
// busca  el prefacturaAuto con id pasado
module.exports.getFactura = function (id, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturasauto AS pf";
    sql += " LEFT JOIN prefacturasauto AS f ON f.prefacturaAutoId = pf.prefacturaAutoId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.prefacturaAutoId = ?";
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
// crear en la base de datos el prefacturaAuto pasado
module.exports.postFactura = function (prefacturaAuto, callback) {
    if (!comprobarFactura(prefacturaAuto)) {
        var err = new Error("El prefacturaAuto pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    prefacturaAuto.prefacturaAutoId = 0; // fuerza el uso de autoincremento
    fnGetNumeroFactura(prefacturaAuto, function (err, res) {
        if (err) return callback(err);
        sql = "INSERT INTO prefacturasauto SET ?";
        sql = mysql.format(sql, prefacturaAuto);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            prefacturaAuto.prefacturaAutoId = result.insertId;
            callback(null, prefacturaAuto);
        });
    });
}


/*module.exports.postContabilizarPrefacturas = function (dFecha, hFecha, done) {
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

module.exports.postContabilizarPrefacturas = function (dFecha, hFecha, departamentoId, usuarioId,done) {
    var con = getConnection();
    var sql = "SELECT f.*";
    sql += " FROM prefacturasauto as f";
    sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
    sql += " AND f.sel = 1";
    if(departamentoId && departamentoId > 0) {
        sql += " AND f.departamentoId =" + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        contabilidadDb.contabilizarPrefacturas(rows, function (err, result) {
            if (err) return done(err);
            if(result.length > 0) {
                done(null, result)
            } else {
                done(null, 'OK');
            }
        });
    });
}


module.exports.postEnviarCorreos = function (dFecha, hFecha, prefacturasauto, done) {
    // TODO: Hay que montar los correos propiamente dichos
    crearCorreosAEnviar(dFecha, hFecha, prefacturasauto, (err, data) => {
        if (err) return done(err);
        var correos = data;
        enviarCorreos(correos, (err, msg) => {
            done(null, msg);
        });
    })
}

// putFactura
// Modifica el prefacturaAuto según los datos del objeto pasao
module.exports.putFactura = function (id, prefacturaAuto, callback) {
    if (!comprobarFactura(prefacturaAuto)) {
        var err = new Error("El prefacturaAuto pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != prefacturaAuto.prefacturaAutoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    } 
    var connection = getConnection();
    if(prefacturaAuto.serie) {//si hay serie hay que actualizar el numero y la serie
        fnGetNumeroFactura(prefacturaAuto, function (err, res) {
            if(res) {
                prefacturaAuto = res;
                sql = "UPDATE prefacturasauto SET ? WHERE prefacturaAutoId = ?";
                sql = mysql.format(sql, [prefacturaAuto, prefacturaAuto.prefacturaAutoId]);
                connection.query(sql, function (err, result) {
                    closeConnectionCallback(connection, callback);
                    if (err) {
                        return callback(err);
                    }
                    callback(null, prefacturaAuto);
                });
            }
        });
    } else {
        delete prefacturaAuto.serie;//si la sertie es null no se actualiza
        sql = "UPDATE prefacturasauto SET ? WHERE prefacturaAutoId = ?";
        sql = mysql.format(sql, [prefacturaAuto, prefacturaAuto.prefacturaAutoId]);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            callback(null, prefacturaAuto);
        });
    }
}
// postFacturaLineaDesdeParte
// Modifica la linea de prefacturaAuto  desde una linea de parte modificada
module.exports.postPrefacturaLineaDesdeParte = function (prefacturaAutoId, lineaParteId, callback) {
    var connection = getConnection();
    var sql = "SELECT par.prefacturaAutoId, pt.descripcion AS descripcion, pt.unidades AS cantidad,ar.articuloId AS articuloId,pt.tipoIvaClienteId AS tipoIvaId, pt.ivaCliente AS porcentaje, ar.unidadId,";
    sql += " pt.precioCliente AS importe, pt.importeCliente AS coste, pt.importeCliente AS totalLinea ,ga.nombre AS capituloLinea ";
    sql += " FROM partes AS par";
    sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
    sql += " LEFT JOIN partes_lineas AS pt ON pt.parteId = par.parteId"
    sql += " LEFT JOIN articulos AS ar ON ar.codigoReparacion = pt.codigoArticulo";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = ar.unidadId";
    sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoarticuloId = ar.grupoArticuloId"
    sql += " WHERE pt.parteLineaId = ?";
    sql = mysql.format(sql, lineaParteId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        //averigamos cuantas lineas tiene la prefacturaAuto 
        connection = getConnection();
        sql = "SELECT MAX(linea) AS num from prefacturasauto_lineas WHERE prefacturaAutoId = ?";
        sql = mysql.format(sql, prefacturaAutoId);
        connection.query(sql, function(err, rows) {
            connection.end();
            if(err) return callback(err);
            var num = rows[0].num
            if(num == 0) {
                result[0].linea = 1.1;
            } else {
                result[0].linea = num + 0.1;
            }
            connection = getConnection();
            sql = "INSERT INTO prefacturasauto_lineas SET ?";
            sql = mysql.format(sql, [result[0]]);
            connection.query(sql, function (err, result2) {
                connection.end();
                if (err) {
                    return callback(err);
                }
                //actualizamos la linea del parte con la id de la lineas de prefacturaAuto acabada de crear
                connection = getConnection();
                sql = "UPDATE partes_lineas set prefacturaAutoLineaId = ? WHERE parteLineaId = ?";
                sql = mysql.format(sql, [result2.insertId, lineaParteId]);
                connection.query(sql, function(err, result3) {
                    connection.end();
                    if(err) return callback(err);
                    // actualizar las bases y cuotas
                    fnActualizarBases(prefacturaAutoId, function (err, res) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, result2);
                    });

                });
            });
        });
    });
}

// putFacturaCabeceraDesdeParte
// Modifica la cabecera de prefacturaAuto  desde un parte 
module.exports.putPrefacturaCabeceraDesdeParte = function (datos, callback) {
    var prefacturaAutoId;
    var connection = getConnection();
    sql = "SELECT SUM(par.importe_cliente) AS totalAlCliente";
    sql += " FROM partes AS par";
    sql += " LEFT JOIN prefacturasauto AS fac ON fac.prefacturaAutoId = par.prefacturaAutoId";
    sql += " WHERE par.prefacturaAutoId = ?";
    sql += " GROUP BY par.prefacturaAutoId";
    sql = mysql.format(sql, [datos.prefacturaAutoId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        var obj = {
            totalAlCliente: result[0].totalAlCliente,
            formaPagoId: datos.formaPagoClienteId
        }
        connection = getConnection();
        sql = "UPDATE prefacturasauto SET ? WHERE prefacturaAutoId = ?";
        sql = mysql.format(sql, [obj, datos.prefacturaAutoId]);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    });
}

// deleteFactura
// Elimina el prefacturaAuto con el id pasado
module.exports.deleteFactura = function (id, prefacturaAuto, callback) {
    var connection = getConnection();
    sql = "DELETE from prefacturasauto WHERE prefacturaAutoId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// deleteFacturaParte
// Elimina el prefacturaAuto con el id pasado y actuliza los partes asociados
module.exports.deleteFacturaParte = function (id, prefacturaAuto, callback) {
    var connection = getConnection();
    if(prefacturaAuto.departamentoId == 7) {//Es de reparaciones así que actualizamos los partes asociados a la prefacturaAuto antes de borrar
                connection = getConnection();
                sql = "UPDATE partes set fecha_factura_cliente = NULL, numero_factura_cliente = NULL WHERE prefacturaAutoId = ?";
                sql = mysql.format(sql, id);
                connection.query(sql, function (err, result) {
                    closeConnectionCallback(connection, callback);
                    if (err) {
                        return callback(err);
                    }
                    connection = getConnection();
                    sql = "DELETE from prefacturasauto WHERE prefacturaAutoId = ?";
                    sql = mysql.format(sql, id);
                    connection.query(sql, function (err, result) {
                        closeConnectionCallback(connection, callback);
                        if (err) {
                            return callback(err);
                        }
                        callback(null);
                    });
                });


        /*sql = "SELECT prefacturaAutoLineaId FROM prefacturasauto_lineas  WHERE prefacturaAutoId = ?";//recuperamos las ids de las lineas asociadas a la prefacturaAuto
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            facturaLineas = result;
            async.eachSeries(facturaLineas, function (prefacturaAutoLinea, callback2) {//borramos las lineas de facprove
                deleteUnaFacturaLineaConParte(prefacturaAutoLinea.prefacturaAutoLineaId, prefacturaAuto, function(err, done) {
                    if(err) return callback(err)
                    callback2();
                });
            },function(err) {
                if(err) return callback(err);//una vez borradas las lineas correspondientes de la prefacturaAuto borraos la prefacturaAuto de proveedor
                connection = getConnection();
                sql = "UPDATE partes set fecha_factura_cliente = NULL, numero_factura_cliente = NULL WHERE prefacturaAutoId = ?";
                sql = mysql.format(sql, id);
                connection.query(sql, function (err, result) {
                    closeConnectionCallback(connection, callback);
                    if (err) {
                        return callback(err);
                    }
                    connection = getConnection();
                    sql = "DELETE from prefacturasauto WHERE prefacturaAutoId = ?";
                    sql = mysql.format(sql, id);
                    connection.query(sql, function (err, result) {
                        closeConnectionCallback(connection, callback);
                        if (err) {
                            return callback(err);
                        }
                        callback(null);
                    });
                });
            });
        });*/
    } else {
        sql = "DELETE from prefacturasauto WHERE prefacturaAutoId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    }
}

var borraFacproveAsociadas = (facproves, done) => {
    var con = getConnection();
    var sql;
    async.eachSeries(facproves, function (facprove, callback2) {
        if(facprove.facproveId != null) {
            sql = "UPDATE partes set fecha_factura_profesional = NULL, numero_factura_profesional = NULL  WHERE facproveId = ?";
            sql = mysql.format(sql, facprove.facproveId);
            con.query(sql, function (err) {
                if (err) return callback2(err);
                sql = "DELETE from facprove WHERE facproveId = ?;";
                sql = mysql.format(sql, facprove.facproveId);
                con.query(sql, function (err) {
                    if (err) return callback2(err);
                    callback2();
                })
            })
        } else {
            callback2();
        }
    }, function (err) {
            con.end();
            if(err) {return done(err);}
            return done(null,null);
        }
    );
}



// deletePrefacturasContrato
// Elimina todas las prefacturasauto pertenecientes a un contrato.
module.exports.deletePrefacturasContrato = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from prefacturasauto WHERE contratoClienteMantenimientoId = ? AND generada = 1";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
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
function comprobarFacturaLinea(prefacturaAutoLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof prefacturaAutoLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && prefacturaAutoLinea.hasOwnProperty("prefacturaAutoId"));
    comprobado = (comprobado && prefacturaAutoLinea.hasOwnProperty("prefacturaAutoLineaId"));
    comprobado = (comprobado && prefacturaAutoLinea.hasOwnProperty("linea"));
    comprobado = (comprobado && prefacturaAutoLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && prefacturaAutoLinea.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && prefacturaAutoLinea.hasOwnProperty("porcentaje"));
    comprobado = (comprobado && prefacturaAutoLinea.hasOwnProperty("descripcion"));
    comprobado = (comprobado && prefacturaAutoLinea.hasOwnProperty("cantidad"));
    comprobado = (comprobado && prefacturaAutoLinea.hasOwnProperty("importe"));
    comprobado = (comprobado && prefacturaAutoLinea.hasOwnProperty("totalLinea"));
    return comprobado;
}

// getNextFacturaLine
// busca el siguiente número de línea de la prefacturaAuto pasada
module.exports.getNextFacturaLineas = function (id, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT MAX(linea) as maxline FROM prefacturasauto_lineas"
    sql += " WHERE prefacturaAutoId = ?;";
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
module.exports.getFacturaLineas = function (id, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM prefacturasauto_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.prefacturaAutoId = ?";
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
// Devuelve la línea de prefacturaAuto solcitada por su id.
module.exports.getFacturaLinea = function (id, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM prefacturasauto_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.prefacturaAutoLineaId = ?";
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
// crear en la base de datos la linea de prefacturaAuto pasada
module.exports.postFacturaLinea = function (prefacturaAutoLinea, callback) {
    if (!comprobarFacturaLinea(prefacturaAutoLinea)) {
        var err = new Error("La linea de prefacturaAuto pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    prefacturaAutoLinea.prefacturaAutoLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO prefacturasauto_lineas SET ?";
    sql = mysql.format(sql, prefacturaAutoLinea);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        prefacturaAutoLinea.prefacturaAutoLineaId = result.insertId;
        // actualizar las bases y cuotas
        fnActualizarBases(prefacturaAutoLinea.prefacturaAutoId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, prefacturaAutoLinea);
        })
    });
}


// putFacturaLinea
// Modifica la linea de prefacturaAuto según los datos del objeto pasao
module.exports.putFacturaLinea = function (id, prefacturaAutoLinea, callback) {
    if (!comprobarFacturaLinea(prefacturaAutoLinea)) {
        var err = new Error("La linea de prefacturaAuto pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != prefacturaAutoLinea.prefacturaAutoLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE prefacturasauto_lineas SET ? WHERE prefacturaAutoLineaId = ?";
    sql = mysql.format(sql, [prefacturaAutoLinea, prefacturaAutoLinea.prefacturaAutoLineaId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(prefacturaAutoLinea.prefacturaAutoId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, prefacturaAutoLinea);
        })
    });
}

// deleteFacturaLinea
// Elimina la linea de prefacturaAuto con el id pasado
module.exports.deleteFacturaLinea = function (id, prefacturaAutoLinea, callback) {
    var connection = getConnection();
    sql = "DELETE from prefacturasauto_lineas WHERE prefacturaAutoLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(prefacturaAutoLinea.prefacturaAutoId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null);
        })
    });
}


// deleteFacturaLinea
// Elimina la linea de prefacturaAuto con el id pasado
module.exports.deletePrefacturaLinea = function (id, prefacturaAutoLinea, callback) {
    var connection = getConnection();
    sql = "DELETE from prefacturasauto_lineas WHERE prefacturaAutoLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(prefacturaAutoLinea.prefacturaAutoId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null);
        })
    });
}

module.exports.deleteFacturaLineaConParte = function (id, prefacturaAutoLinea, callback) {
    deleteUnaFacturaLineaConParte(id, prefacturaAutoLinea, function(err, done) {
        if(err) return callback(err)
        callback(null);
    });
}

// deleteprefacturaAutoLineaConParte
// elimina un prefacturaAuto de la base de datos y su correspondiente prefacturaAuto de proveedor, si existe
var deleteUnaprefacturaAutoLineaConParte = function (id, prefacturaAutoLinea, callback) {
    var articuloId;
    var parteId;
    var facproveIds = [];
    var facproveId;
    var facproveLineaId;
    var connection = getConnection();
        sql = "SELECT DISTINCT facproveId FROM partes  WHERE prefacturaAutoId = ? AND prefacturaAutoId IS NOT NULL";//primero recuperamos las ids de las prefacturasauto de proveedores de los partes, si las tiene
        sql = mysql.format(sql, prefacturaAutoLinea.prefacturaAutoId);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            if(result.length > 0) {
                for(var i = 0; i <  result.length; i++) {
                    facproveIds.push(result[i].facproveId);
                }
                connection = getConnection();
                sql = "SELECT fl.articuloId,ar.codigoReparacion, fl.totalLinea, fl.prefacturaAutoId, par.parteId";//si hay prefacturasauto de proveedores recuperamosel codigo de reparacion del artiulo
                sql += " FROM prefacturasauto_lineas AS fl";
                sql += " LEFT JOIN articulos AS ar ON ar.articuloId = fl.articuloId";
                sql += " LEFT JOIN partes AS par ON par.prefacturaAutoId = fl.prefacturaAutoId";
                sql += " LEFT JOIN partes_lineas AS pl ON pl.parteId = par.parteId"              
                sql += " WHERE fl.prefacturaAutoId = ? AND fl.prefacturaAutoLineaId = ? AND pl.`importeCliente` = fl.totalLinea"
                sql = mysql.format(sql, [prefacturaAutoLinea.prefacturaAutoId, id]);
                connection.query(sql, function (err, result) {
                    closeConnectionCallback(connection, callback);
                    if (err) {
                        return callback(err);
                    }
                    if(result.length == 0) {
                        try{
                            throw new Error("Error borrado, sin lineas");
                        }catch(err){
                            return callback(err);
                        }
                    }
                    articuloId = result[0].articuloId;
                    parteId = result[0].parteId;
                    connection = getConnection();
                    sql = "SELECT facproveLineaId, fl.facproveId FROM facprove_lineas AS fl";//recuperamos la linea del la prefacturaAuto de proveedor que queremos borrar
                    sql += " LEFT JOIN partes AS par ON par.facproveId = fl.facproveId";
                    sql += " WHERE  articuloId = ? AND fl.facproveId IN (?) AND par.parteId = ?"
                    sql = mysql.format(sql, [articuloId, facproveIds, parteId]);
                    connection.query(sql, function (err, result) {
                        closeConnectionCallback(connection, callback);
                        if (err) {
                            return callback(err);
                        }
                        if(result.length > 0) {//si existe la linea en la prefacturaAuto de proveedor
                            facproveLineaId = result[0].facproveLineaId;
                            facproveId = result[0].facproveId;
                            //borramos la linea
                        connection = getConnection();
                        sql = "DELETE from prefacturasauto_lineas WHERE prefacturaAutoLineaId = ?";
                        sql = mysql.format(sql, id);
                        connection.query(sql, function (err, result) {
                            closeConnectionCallback(connection, callback);
                            if (err) {
                                return callback(err);
                            }
                            // actualizar las bases y cuotas
                            fnActualizarBases(prefacturaAutoLinea.prefacturaAutoId, function (err, res) {
                                if (err) {
                                    return callback(err);
                                }
                                connection = getConnection();//borramos la linea de facprove
                                sql = "DELETE from facprove_lineas WHERE facproveLineaId = ?";
                                sql = mysql.format(sql, facproveLineaId);
                                connection.query(sql, function (err, result) {
                                    closeConnectionCallback(connection, callback);
                                    if (err) {
                                        return callback(err);
                                    }
                                    // actualizar las bases y cuotas
                                    fnActualizarBasesFacprove(facproveId, function (err, res) {
                                        if (err) {
                                            return callback(err);
                                        }
                                        //actualizamos las retenciones
                                        fnActualizarRetencionesFacprove(facproveId, function (err, res) {
                                            if (err) {
                                                return callback(err);
                                            }
                                            //una vez borrada la linea comprobamos que la cabecera de la facprove tenga lineas
                                            connection = getConnection();
                                            var sql2 = " SELECT * FROM facprove_lineas where facproveId = ?"
                                            sql2 = mysql.format(sql2, facproveId)
                                            connection.query(sql2, function (err, result) { 
                                                closeConnectionCallback(connection, callback);
                                                if(err) return callback(err);
                                                if(result.length == 0) {
                                                    connection = getConnection();
                                                    sql2 = "UPDATE partes set fecha_factura_profesional = NULL, numero_factura_profesional = NULL  WHERE facproveId = ?";
                                                    sql2 = mysql.format(sql2, facproveId);
                                                    connection.query(sql2, function (err) { 
                                                        closeConnectionCallback(connection, callback);
                                                        if(err) return callback(err);
                                                        connection = getConnection();
                                                        sql2 = " DELETE FROM facprove where facproveId = ?"
                                                        sql2 = mysql.format(sql2, facproveId)
                                                        connection.query(sql2, function (err, result) { 
                                                            closeConnectionCallback(connection, callback);
                                                            if(err) return callback(err);
                                                            callback(null)
                                                        });

                                                    });
                                                }else {
                                                    callback(null);
                                                }
                                            });
                                        });
                                    });
                                });
                            })
                        });
                        } else {//si no existe la linbea de facprove correspondiente solo boramos la de la prefacturaAuto
                            connection = getConnection();
                            sql = "DELETE from prefacturasauto_lineas WHERE prefacturaAutoLineaId = ?";
                            sql = mysql.format(sql, id);
                            connection.query(sql, function (err, result) {
                                closeConnectionCallback(connection, callback);
                                if (err) {
                                    return callback(err);
                                }
                                // actualizar las bases y cuotas
                                fnActualizarBases(prefacturaAutoLinea.prefacturaAutoId, function (err, res) {
                                    if (err) {
                                        return callback(err);
                                    }
                                    callback(null);
                                })
                            });
                        }
                    });
                });

            } else {
                connection = getConnection();
                sql = "DELETE from prefacturasauto_lineas WHERE prefacturaAutoLineaId = ?";
                sql = mysql.format(sql, id);
                connection.query(sql, function (err, result) {
                    closeConnectionCallback(connection, callback);
                    if (err) {
                        return callback(err);
                    }
                    // actualizar las bases y cuotas
                    fnActualizarBases(prefacturaAutoLinea.prefacturaAutoId, function (err, res) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null);
                    })
                });
            }
        });
}

// fnActualizarBases
// Actuliza la tabla de bases y cuotas de la prefacturaAuto pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBasesFacprove = function (id, callback) {
    fnBorraBasesFacprove(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
        sql = "INSERT INTO facprove_bases (facproveId, tipoIvaId, porcentaje, base, cuota)";
        sql += " SELECT pl.facproveId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
        sql += " FROM";
        sql += " (SELECT facproveId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
        sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
        sql += " FROM facprove_lineas";
        sql += " WHERE facproveId = ?";
        sql += " GROUP BY tipoIvaId) AS pl";
        sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            callback(null);
            // Antes de volver actualizamos los totales y así está hecho
           /* fnActualizarTotales(id, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })*/
        });
    })
}



// fnActualizarRetenciones
// Actuliza la tabla de Retenciones y cuotas de la prefacturaAuto pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarRetencionesFacprove = function (id, callback) {
    fnBorraRetencionesFacproves(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
        sql = "INSERT INTO facprove_retenciones (facproveId, baseRetencion, porcentajeRetencion, importeRetencion, codigoRetencion, cuentaRetencion)";
        sql += " SELECT pl.facproveId, COALESCE(pl.baseRetencion, 0), pl.porcentajeRetencion, pl.importeRetencion, pl.codigoRetencion, pl.cuentaRetencion";
        sql += " FROM";
        sql += " (SELECT facproveId, SUM(importeRetencion) AS importeRetencion,  porcentajeRetencion, ROUND(SUM(totalLinea),2) AS baseRetencion, codigoRetencion, cuentaRetencion";
        sql += " FROM facprove_lineas";
        sql += " WHERE facproveId = ?";
        sql += " GROUP BY codigoRetencion) AS pl";
        sql += " ON DUPLICATE KEY UPDATE baseRetencion = pl.baseRetencion, importeRetencion = pl.importeRetencion, codigoRetencion = pl.codigoRetencion, cuentaRetencion = pl.cuentaRetencion";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            // Antes de volver actualizamos los totales y así está hecho
            fnActualizarTotalesFacprove(id, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        });
    })
}

// fnActualizarTotales
// Actuliza los campos de totales de la cabecera de prefacturaAuto de proveedores
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotalesFacprove = function (id, callback) {
    var connection = getConnection();
    var sql = "UPDATE facprove AS pf,";
    sql += " (SELECT facproveId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM facprove_bases GROUP BY 1) AS pf2,";


    sql += " (SELECT facproveId, COALESCE(SUM(importeRetencion), 0 ) AS ir";
    sql += " FROM facprove_retenciones GROUP BY 1) AS pf4,";



    sql += " (SELECT facproveId, SUM(coste) AS sc";
    sql += " FROM facprove_lineas GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c - pf4.ir,";
    sql += " pf.coste = pf3.sc, pf.importeRetencion = pf4.ir";
    sql += " WHERE pf.facproveId = ?";
    sql += " AND pf2.facproveId = pf.facproveId";
    sql += " AND pf3.facproveId = pf.facproveId";
    sql += " AND pf4.facproveId = pf.facproveId";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        //si no hay registros en facprove_retenciones actualizaremos directamente el importeRetencion = 0
        var connection2 = getConnection();
        sql = "SELECT COUNT(*) AS total FROM facprove_retenciones";
        sql += " WHERE facproveId = ?";
        sql = mysql.format(sql, id);
        connection2.query(sql, function (err, resultBis) {
            connection2.end();
            if (err) {
                return callback(err);
            }
            if(resultBis[0].total == 0){
                var connection3 = getConnection();
                sql = "UPDATE facprove SET importeRetencion = 0 WHERE facproveId = ? ";
                sql = mysql.format(sql, id);
                connection3.query(sql, function (err, resultado) {
                    connection3.end();
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            }else {
                callback(null);
            }
        });
    });
}

// fnBorraReyenciones
// elimina las retenciones de una prefacturaAuto de proveedor
// antes de actualizarlas
var fnBorraRetencionesFacproves = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM facprove_retenciones";
    sql += " WHERE facproveId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// fnBorraBases
// elimina las bases y cuotas de una prefacturaAuto de proveedor
// antes de actualizarlas
var fnBorraBasesFacprove = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM facprove_bases";
    sql += " WHERE facproveId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// recalculo de línea de prefacturaAuto
module.exports.recalculoLineasFactura = function (prefacturaAutoId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, done) {
    var con = getConnection();
    // Buscamos la líneas de la prefacturaAuto
    sql = " SELECT pf.coste as costeFacturaCompleta, pfl.*";
    sql += " FROM prefacturasauto as pf";
    sql += " LEFT JOIN prefacturasauto_lineas as pfl ON pfl.prefacturaAutoId = pf.prefacturaAutoId";
    sql += " WHERE pf.prefacturaAutoId = ?";
    sql = mysql.format(sql, prefacturaAutoId);
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
            // Actualizamos la línea lo que actualizará de paso la prefacturaAuto
            exports.putFacturaLinea(linea.prefacturaAutoLineaId, linea, function (err, result) {
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
// Actuliza la tabla de bases y cuotas de la prefacturaAuto pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBases = function (id, callback) {
    fnBorraBases(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
        sql = "INSERT INTO prefacturasauto_bases (prefacturaAutoId, tipoIvaId, porcentaje, base, cuota)";
        sql += " SELECT pl.prefacturaAutoId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
        sql += " FROM";
        sql += " (SELECT prefacturaAutoId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
        sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
        sql += " FROM prefacturasauto_lineas";
        sql += " WHERE prefacturaAutoId = ?";
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
// Actuliza los campos de totales de la cabecera de prefacturaAuto
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotales = function (id, callback) {
    var connection = getConnection();
    sql = "UPDATE prefacturasauto AS pf,";
    sql += " (SELECT prefacturaAutoId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM prefacturasauto_bases GROUP BY 1) AS pf2,";
    sql += " (SELECT prefacturaAutoId, SUM(coste) AS sc";
    sql += " FROM prefacturasauto_lineas GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
    sql += " pf.coste = pf3.sc,";
    sql += ' pf.restoCobrar = pf2.b + pf2.c - pf.importeAnticipo';
    sql += " WHERE pf.prefacturaAutoId = ?";
    sql += " AND pf2.prefacturaAutoId = pf.prefacturaAutoId";
    sql += " AND pf3.prefacturaAutoId = pf.prefacturaAutoId";
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
// elimina las bases y cuotas de una prefacturaAuto
// antes de actualizarlas
var fnBorraBases = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM prefacturasauto_bases";
    sql += " WHERE prefacturaAutoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// getprefacturaAutoBases
// devuelve los regitros de bases y cutas de la 
// prefacturaAuto con el id pasado
module.exports.getprefacturaAutoBases = function (id, callback) {
    var connection = getConnection();
    var prefacturasAuto = null;
    sql = "SELECT pb.*, ti.nombre as tipo";
    sql += " FROM prefacturasAuto_bases as pb";
    sql += " LEFT JOIN tipos_iva as ti ON ti.tipoIvaId = pb.tipoIvaId"
    sql += " WHERE prefacturaAutoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// -- Obtener número de prefacturaAuto
// La idea es devolver la prefacturaAuto con los campos ano, numero y serie
var fnGetNumeroFactura = function (prefacturaAuto, done) {
    var con = getConnection();
    // hay que obtener de la empresa la serie
    var sql = "SELECT * FROM empresas where empresaId = ?";
    sql = mysql.format(sql, prefacturaAuto.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(prefacturaAuto.fecha).year();
       
        var serie = res[0].seriePre;
        if(prefacturaAuto.serie) {
            serie = prefacturaAuto.serie;
        }
        
        sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM prefacturasAuto";
        sql += " WHERE empresaId = ?";
        sql += " AND ano = ?";
        sql += " AND serie = ?";
        sql = mysql.format(sql, [prefacturaAuto.empresaId, ano, serie]);
        con.query(sql, function (err, res) {
            if (err) return done(err);
            // actualizar los campos del objeto prefacturaAuto
            prefacturaAuto.numero = res[0].n;
            prefacturaAuto.ano = ano;
            prefacturaAuto.serie = serie;
            done(null, prefacturaAuto);
        })
    });
}

var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};

// CREACION A PARTIR DE PREFACTURAS
module.exports.postCrearDesdePreprefacturasAuto = function (dFecha, hFecha, fechaFactura, clienteId, agenteId, tipoMantenimientoId, empresaId, rectificativas,done) {
    var con = getConnection();
    var sql = "";
    var prefacturaAutoId = 0;
    var prefacturaAuto = null;
    // Transaccion general que protege todo el proceso
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // obtener las prefacturas que han de pasarse a prefacturaAuto
        sql = "SELECT pf.*, c.comercialId as agenteId, cm.tipoContratoId FROM prefacturas as pf";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId"
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
        sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
        sql += " AND pf.prefacturaAutoId IS NULL AND pf.sel = 1";
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
                // transformar un objeto prefactura en uno prefacturaAuto
                pf.prefacturaAutoId = 0;
                async.series([
                    function (callback) {
                        // obtener el número de prefacturaAuto que le corresponde
                        fnGetNumeroFacturaTrans(pf, con, function (err, res) {
                            if (err) return callback(err);
                            prefacturaAuto = res;
                            callback(null);
                        }, con);
                    },
                    function (callback) {
                        // insertar la cabecera
                        // eliminar las columnas adcionales
                        delete prefacturaAuto.agenteId;
                        delete prefacturaAuto.tipoMantenimientoId;
                        delete prefacturaAuto.articuloId;
                        delete prefacturaAuto.tipoContratoId;
                        sql = "INSERT INTO prefacturasauto SET ?";
                        sql = mysql.format(sql, prefacturaAuto);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            prefacturaAuto.prefacturaAutoId = result.insertId;
                            prefacturaAutoId = result.insertId;
                            callback(null);
                        });
                    },
                    function (callback) {
                        // insertar las líneas
                        sql = "INSERT INTO prefacturasauto_lineas(linea, prefacturaAutoId,unidadId,  articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea,";
                        sql += " coste, porcentajeBeneficio, porcentajeAgente, capituloLinea)";
                        sql += " SELECT linea, " + prefacturaAuto.prefacturaAutoId + " AS  prefacturaAutoId, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea,";
                        sql += " coste, porcentajeBeneficio, porcentajeAgente, capituloLinea";
                        sql += " FROM prefacturas_lineas";
                        sql += " WHERE prefacturas_lineas.prefacturaId = ?";
                        sql = mysql.format(sql, prefacturaAuto.prefacturaId);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        // insertar las bases
                        sql = "INSERT INTO prefacturasauto_bases (prefacturaAutoId, tipoIvaId, porcentaje, base, cuota)";
                        sql += " SELECT  " + prefacturaAuto.prefacturaAutoId + " AS  prefacturaAutoId, tipoIvaId, porcentaje, base, cuota";
                        sql += " FROM prefacturas_bases";
                        sql += " WHERE prefacturas_bases.prefacturaId = ?";
                        sql = mysql.format(sql, prefacturaAuto.prefacturaId);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        // actualizar la prefactura indicando la prefacturaAuto en la que está.
                        sql = "UPDATE prefacturas SET prefacturaAutoId = ? WHERE prefacturaId = ?";
                        sql = mysql.format(sql, [prefacturaAuto.prefacturaAutoId, prefacturaAuto.prefacturaId]);
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


// CREACION DE PREFACTURA A PARTIR DE PARTE
module.exports.postCrearPrefactCliDesdeParte = function (seleccionados, deFecha, aFecha, fechaPrefactura, done) {
    var con = getConnection();
    var numFact;
    var partesActualiza = [];
    var lineasFactura;
   
    var sql =""
    var partes = [];
    var porSeparado;
    var parteId;
    var fechaPrefacturaAno;
    var parId = [];
    var contador = 0;//contador del numero de anticipo
    var clientesErroneos = [];
 

    deFecha = moment(deFecha, 'DD.MM.YYYY').format('DD/MM/YYYY');
    aFecha = moment(aFecha, 'DD.MM.YYYY HH:mm').format('DD/MM/YYYY');
    if(fechaPrefactura != "") {
        fechaPrefactura =  moment(fechaPrefactura, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD');
        fechaPrefacturaAno =  moment(fechaPrefactura, 'YYYY-MM-DD').format('YYYY');
    } else {
        fechaPrefactura = new Date();
        fechaPrefacturaAno =  moment(fechaPrefactura, 'YYYY-MM-DD').format('YYYY');
    }
    var periodo = deFecha + "-" + aFecha;
    
    for (var i= 0; i< seleccionados.length; i++) {
        partes.push(seleccionados[i].parteId);
    }
    //OBTENEMOS LAS CABECERAS de las prefacturasauto que no tienen seleccionada la casilla de prefacturaAuto propia y de las que si la tienene
    sql = "(SELECT '"+fechaPrefacturaAno+"' AS ano, '"+fechaPrefactura+"' AS fecha, ser.clienteId, '"+ periodo +"' AS periodo,  par.parteId, par.factPropiaCli,";
    sql += " par.empresaParteId AS empresaId, emp.nombre AS emisorNombre, emp.nif AS emisorNif, emp.`direccion` AS emisorDireccion,";
    sql += " emp.`codPostal` AS emisorCodpostal, emp.`poblacion` AS emisorPoblacion, emp.`provincia` AS emisorProvincia,";
    sql += " cli.`nombreComercial` AS receptorNombre, cli.`nif` AS receptorNif, cli.`codPostal` AS receptorCodPostal,";
    sql += " cli.`poblacion` AS receptorPoblacion, cli.`provincia` AS receptorProvincia, cli.`direccion` AS receptorDireccion,";
    sql += " par.formaPagoClienteId AS formaPagoId, SUM(par.`importe_cliente`) AS coste, SUM(par.`importe_cliente`) AS totalAlCliente, SUM(par.`importe_cliente`) AS total, 0 AS porcentajeBeneficio,";
    sql += " 0 AS porcentajeAgente, SUM(par.importe_cliente_iva) AS totalConIva, 7 AS departamentoId,  0 AS importeAnticipo,";
    sql += " (SUM(par.importe_cliente_iva)) AS restoCobrar,  0 AS porcentajeRetencion, 0 AS importeRetencion";
    sql += " FROM servicios AS ser";
    sql += " LEFT JOIN partes AS par ON par.servicioId = ser.servicioId";
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
    sql += " LEFT JOIN empresas AS emp ON emp.empresaId = par.empresaParteId";
    sql += " WHERE par.parteId IN (?) AND par.FactPropiaCli = 0 GROUP BY ser.clienteId, par.empresaParteId, par.formaPagoClienteId)"
    sql += " UNION"
    sql += " (SELECT '"+fechaPrefacturaAno+"' AS ano, '"+fechaPrefactura+"' AS fecha, ser.clienteId, '"+ periodo +"' AS periodo,  par.parteId, par.factPropiaCli,";
    sql += " par.empresaParteId AS empresaId, emp.nombre AS emisorNombre, emp.nif AS emisorNif, emp.`direccion` AS emisorDireccion,";
    sql += " emp.`codPostal` AS emisorCodpostal, emp.`poblacion` AS emisorPoblacion, emp.`provincia` AS emisorProvincia,";
    sql += " cli.`nombreComercial` AS receptorNombre, cli.`nif` AS receptorNif, cli.`codPostal` AS receptorCodPostal,";
    sql += " cli.`poblacion` AS receptorPoblacion, cli.`provincia` AS receptorProvincia, cli.`direccion` AS receptorDireccion,";
    sql += " par.formaPagoClienteId AS formaPagoId, par.`importe_cliente` AS coste, par.`importe_cliente` AS totalAlCliente, par.`importe_cliente` AS total, 0 AS porcentajeBeneficio,";
    sql += " 0 AS porcentajeAgente,par.importe_cliente_iva AS totalConIva, 7 AS departamentoId, 0 AS importeAnticipo,";
    sql += " par.importe_cliente_iva AS restoCobrar, 0 AS porcentajeRetencion, 0 AS importeRetencion"; 
    sql += " FROM servicios AS ser";
    sql += " LEFT JOIN partes AS par ON par.servicioId = ser.servicioId";
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
    sql += " LEFT JOIN empresas AS emp ON emp.empresaId = par.empresaParteId";
    sql += " WHERE par.parteId IN (?) AND par.FactPropiaCli = 1)"
    sql = mysql.format(sql, [partes, partes]);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        cabPrefacturasauto = res;
        con.beginTransaction(function (err) {// Transaccion general que protege todo el proceso
            if (err) return done(err);
            //antes de nada comprobamos que los clientes de las prefacturasauto tengan los campos obligatorios de facturación
            for(var i = 0; i < cabPrefacturasauto.length; i++) {
                if( (!cabPrefacturasauto[i].receptorDireccion || cabPrefacturasauto[i].receptorDireccion == '') || 
                                (!cabPrefacturasauto[i].receptorCodPostal || cabPrefacturasauto[i].receptorCodPostal == '') ||
                                (!cabPrefacturasauto[i].receptorPoblacion || cabPrefacturasauto[i].receptorPoblacion == '') || 
                                (!cabPrefacturasauto[i].receptorProvincia || cabPrefacturasauto[i].receptorProvincia == '') ||
                                (!cabPrefacturasauto[i].receptorNombre || cabPrefacturasauto[i].receptorNombre == '') ) 
                                {
                                    
                                    var obj = {
                                        nombre: cabPrefacturasauto[i].receptorNombre,
                                        DNI: cabPrefacturasauto[i].receptorNif
                                    }
                                    clientesErroneos.push(obj);
                                }
            }
           
                async.eachSeries(cabPrefacturasauto, function (sel, callback2) {
                    porSeparado = sel.factPropiaCli;
                    parteId = sel.parteId;
                    var lineaFactura = {
                        parteLineaId: 0,
                        prefacturaAutoLineaId:0,
                    };
                    var lineasObj = [];
                    async.series([
                        function (callback) {
                            //Si hay clientes erroneos lanzamos un error e interrumpimos el proceso
                            if( clientesErroneos.length > 0 ) 
                                {
                                    try{
                                        var lista = JSON.stringify(clientesErroneos);
                                        lista.replace(/}/g, "<br\>").replace(/[\]\[{()}"]/g, '').replace(/[_\s]/g, '-');
                                        throw new Error("Los clientes Sigientes  no tiene configurados correctamente sus datos"
                                         +" personales de facturación, el proceso se ha interrumpido.<br>" + lista);
                                    } catch(e) {
                                        return callback(e);
                                    }

                                }
                                callback(null);

                        },
                        function (callback) {
                            // obtener el número de prefacturaAuto que le corresponde
                            fnGetNumeroPrefacturaTrans(sel, con, function (err, res) {
                                if (err) return callback(err);
                                prefacturaAuto = res;
                                sel.serie = sel.serie;
                                numFact = sel.serie+'-'+sel.ano+'-'+sel.numero;
                                callback(null);
                            }, con);
                        },
                        function (callback) {
                           //SE CREA LA CABECERA DE LA PREFACTURA
                           sel.prefacturaAutoId = 0//forzamos el autoincremento
                           //borramos los campos adicioneles
                           delete sel.factPropiaCli;
                           delete sel.parteId;
                           var sql2 = "INSERT INTO prefacturasauto SET ?"
                           sql2 = mysql.format(sql2, sel);
                           con.query(sql2, function(err, res) {
                                if (err) return callback(err);
                                sel.prefacturaAutoId = res.insertId;
                                callback(null)
                           });
                        },
                        function(callback) {
                             //TRANSFORMAR LOS CAMPOS DEL PARTE_LINEA EN CAMPOS DE FACTURA_LINEA
                             parId = [];
                             var sql = " SELECT pt.parteId, pt.parteLineaId, pt.descripcion AS descripcion, pt.unidades AS cantidad,ar.articuloId AS articuloId,pt.tipoIvaClienteId AS tipoIvaId, pt.ivaCliente AS porcentaje, ar.unidadId,";
                             sql += " pt.precioCliente AS importe, pt.importeCliente AS coste, pt.importeCliente AS totalLinea ,ga.nombre AS capituloLinea";
                             sql += " FROM partes AS par";
                             sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
                             sql += " LEFT JOIN partes_lineas AS pt ON pt.parteId = par.parteId"
                             sql += " LEFT JOIN articulos AS ar ON ar.codigoReparacion = pt.codigoArticulo";
                             sql += " LEFT JOIN unidades AS u ON u.unidadId = ar.unidadId";
                             sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoarticuloId = ar.grupoArticuloId"
                             sql += " WHERE ser.clienteId = ? AND par.empresaParteId = ? AND par.formaPagoClienteId = ? AND par.parteId IN (?)";
                             if(porSeparado == 1) {
                                 sql += " AND par.parteId = " + parteId;
                             } else {
                                 sql += " AND par.factPropiaCli = 0"
                             }
                             sql += " ORDER BY pt.parteLineaId"
                             sql = mysql.format(sql, [sel.clienteId, sel.empresaId, sel.formaPagoId, partes]);
                             con.query(sql, function (err, res) {
                                if (err) return callback(err);
                                lineasFactura = res
                                //procesamos las lineas
                                var cont = 0;
                                lineasFactura.forEach( function(l){
                                    lineaFactura = {
                                        parteLineaId: 0,
                                        prefacturaAutoLineaId:0,
                                    };
                                    parId.push(l.parteId); //guardamos las ids de los partes implicados en esta prefacturaAuto
                                    delete l.parteId; //borramos la propiedad para que no de error al crear la linea
                                    lineaFactura.parteLineaId = l.parteLineaId
                                    lineasObj.push(lineaFactura); //guardanmos las ids de partelineaId y facproveLineaId para actualizar la linea del parte mas adelante
                                    cont ++;
                                    l.prefacturaAutoLineaId = 0//forzamos autoincremento
                                    l.prefacturaAutoId = sel.prefacturaAutoId;
                                    var str = cont.toString();
                                    l.linea = "1." + str;
    
                                });
                                callback(null)
                            });
                        },
                        function (callback) {
                            //SE CREAN LAS lINEAS DE LA PREFACTURA
                            var cont = 0;
                           async.eachSeries(lineasFactura, function (f, done2) {
                            var id = f.parteLineaId //guardamos la propiedad
                            //var anticipo = f.anticipo;//guardamos la propiedad
                            //delete f.anticipo;//borramos la propiedad ya que no nos hace falta para crear la linea de prefacturaAuto
                            delete f.parteLineaId //borramos la propiedad ya que no nos hace falta para crear la linea de prefacturaAuto
                            var sql2 = "INSERT INTO prefacturasauto_lineas SET ?"
                            sql2 = mysql.format(sql2, f);
                                con.query(sql2, function(err, res) {
                                    if (err) return done2(err);
                                    f.prefacturaAutoLineaId = res.insertId;
                                    f.parteLineaId = id // recuperamos la id del la linea del parte que nos servirá para los anticipos
                                    //f.anticipo = anticipo // recuperomos el anticipo del la linea del parte que nos servirá para los anticipos
                                    lineasObj[cont].prefacturaAutoLineaId = f.prefacturaAutoLineaId; //guardanmos las ids de partelineaId y prefacturaAutoLineaId para actualizar la linea del parte mas adelante
                                    cont++;
                                    done2(null);
    
                                });
                            },function (err) {
                                if (err) return callback(err);
                                callback(null);
                            });
                        },
                        function(callback) {//SE INSERTAN LAS BASES DE LA PREFACTURA
                            var sql = "INSERT INTO prefacturasauto_bases (prefacturaAutoId, tipoIvaId, porcentaje, base, cuota)";
                            sql += " SELECT pl.prefacturaAutoId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
                            sql += " FROM";
                            sql += " (SELECT prefacturaAutoId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
                            sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
                            sql += " FROM prefacturasauto_lineas";
                            sql += " WHERE prefacturaAutoId = ?";
                            sql += " GROUP BY tipoIvaId) AS pl";
                            sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
                            sql = mysql.format(sql, sel.prefacturaAutoId);
                            con.query(sql, function(err, res) { 
                                if (err) return callback(err);
                                callback(null);
                            });
                        },
                         function (callback) {//SE ACTUALIZAN LOS TOTALES DE LA CABECERA
                            var connection = getConnection();
                            var sql = "UPDATE prefacturasauto AS pf,";
                            sql += " (SELECT prefacturaAutoId, SUM(base) AS b, SUM(cuota) AS c";
                            sql += " FROM prefacturasauto_bases GROUP BY 1) AS pf2,";
                            sql += " (SELECT prefacturaAutoId, SUM(coste) AS sc";
                            sql += " FROM prefacturasauto_lineas GROUP BY 1) AS pf3";
                            sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
                            sql += " pf.coste = pf3.sc,";
                            sql += ' pf.restoCobrar = pf2.b + pf2.c - pf.importeAnticipo';
                            sql += " WHERE pf.prefacturaAutoId = ?";
                            sql += " AND pf2.prefacturaAutoId = pf.prefacturaAutoId";
                            sql += " AND pf3.prefacturaAutoId = pf.prefacturaAutoId";
                            sql = mysql.format(sql, sel.prefacturaAutoId);
                            con.query(sql, function (err, res) {
                                if (err) return callback(err);
                                callback(null);
                            });
                        },
                        function(callback) {
                            //se vinculan anticipos ya creados
                            //se obtienen las ids de los servicios que pertenecen a los partes de la prefacturaAuto
                            var antcliens = [];
                            var sql = "SELECT DISTINCT servicioId from partes WHERE parteId IN (?)";                                          
                            sql = mysql.format(sql, [parId]);
                            con.query(sql, function (err, res) {
                                if (err) return callback(err);
                                //comprovamos qué servicios tienen anticipos con la misma referencia y no estén vinculados ya.
                                async.eachSeries(res, function(r, done2) {
                                 var sql2 = "SELECT DISTINCT a.antClienId, a.totalConIva,o.referencia, a.contratoId, COALESCE(p.refPresupuesto, '') AS refPresupuesto";
                                 sql2 += " FROM antClien AS a";
                                 sql2 += " LEFT JOIN contratos AS c ON c.contratoId = a.contratoId";
                                 sql2 += " LEFT JOIN ofertas AS o ON o.ofertaId = c.ofertaId";
                                 sql2 += " LEFT JOIN partes AS p ON p.ofertaId = o.ofertaId";
                                 sql2 += " WHERE o.servicioId = ? AND p.parteId IN (?) AND o.referencia = c.referencia";
                                 sql2 += " AND refPresupuesto <> '' AND NOT a.antClienId IN (SELECT antCLienId from factura_antCliens)";
                                 sql2 = mysql.format(sql2, [r.servicioId, parId]);
                                 con.query(sql2, function (err, result) {
                                     if (err) return done2(err);
                                        if(result.length > 0) {// si hay anticipos sin vincular añadimos su id al arry
                                            for (var i = 0; i < result.length; i++) {
                                                antcliens.push(result[i]);
                                            }
                                            done2(null);
                                     } else {
                                         done2(null);
                                     }
                                 });
                                },function (err) {
                                    if (err) return callback(err);
                                    //se comprueba que haya anticipos para el servicio
                                        if(antcliens.length > 0) {
                                            async.eachSeries(antcliens, function(a, done3) {
                                                //si no está vinculado lo vinculamos
                                                var obj = {
                                                    prefacturaAntclienId: 0,
                                                    antClienId: a.antClienId,
                                                    prefacturaAutoId: sel.prefacturaAutoId
                                                }
                                                var sql3 = "INSERT INTO prefacturaauto_antcliens SET ?"
                                                sql3 = mysql.format(sql3, obj);
                                                con.query(sql3, function (err, res) {
                                                    if (err) return done3(err);
                                                    //actualizamos la prefacturaAuto a la que le hemos vinculado el anticipo 
                                                    var sql4 = "UPDATE prefacturasauto SET";
                                                    sql4 += " importeAnticipo = (SELECT tmp2.suma FROM (SELECT importeAnticipo+? AS suma FROM prefacturasauto WHERE prefacturaAutoId = ?) AS tmp2),";
                                                    sql4 += " restoCobrar = (SELECT tmp.resta FROM (SELECT restoCobrar-? AS resta FROM prefacturasauto WHERE prefacturaAutoId = ?) AS tmp)";
                                                    sql4 += " WHERE prefacturaAutoId = ?";                                             
                                                    sql4 = mysql.format(sql4, [a.totalConIva, sel.prefacturaAutoId, a.totalConIva, sel.prefacturaAutoId, sel.prefacturaAutoId]);
                                                    con.query(sql4, function (err, res) {
                                                        if (err) return done3(err);
                                                        done3(null);
                                                    });
                                                });
                                            }, function (err) {
                                                if(err) return callback(err);
                                                callback(null)
                                            });
                                        } else {
                                            callback(null);
                                        }
                                });
                            });
                        },
                        function(callback) {//SELECCIONAMOS LA ID DEL PARTE QUE SE TIENE QUE ACTUALIZAR
                            sql = " SELECT par.parteId";
                             sql += " FROM partes AS par";
                             sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
                             if(porSeparado == 1) {
                                sql += " WHERE par.parteId = " + parteId;
                            } else {
                                sql += " WHERE ser.clienteId = ? AND par.empresaParteId = ? AND par.formaPagoClienteId = ? AND par.parteId IN (?)";
                                sql = mysql.format(sql, [sel.clienteId, sel.empresaId, sel.formaPagoId, partes]);
                            }
                             con.query(sql, function(err, res) { 
                                if (err) return callback(err);
                                partesActualiza = res
                                callback(null);
                            });
                        },
                        function(callback) {//ACTUALIZAMOS EL PARTE CON EL NUMERO E ID DE LA PREFACTURA CORRESPONDIENTE 
                            async.eachSeries(partesActualiza, function (f, done3) {
                                var sql3 = "UPDATE partes SET numero_factura_cliente = ?, fecha_factura_cliente = ?, prefacturaAutoId = ? WHERE parteId = ?"
                                sql3 = mysql.format(sql3, [numFact, fechaPrefactura, sel.prefacturaAutoId, f.parteId]);
                                    con.query(sql3, function(err, res) {
                                        if (err) return done3(err);
                                        done3(null);
        
                                    });
                                },function (err) {
                                    if (err) return callback(err);
                                    callback(null);
                                });
                        },
                        function (callback) {//ACTUALIZAMOS LAS LINEAS DEL PARTE CON LAS IDS DE LAS LINEAS DE PREFACTURA  CORRESPONDIENTE 
                            //SE CREAN LAS lINEAS DE LA PREFACTURA
                           async.eachSeries(lineasObj, function (f, done2) {
                            var sql2 = "UPDATE partes_lineas SET prefacturaAutoLineaId = ? WHERE parteLineaId = ? "
                            sql2 = mysql.format(sql2, [ f.prefacturaAutoLineaId, f.parteLineaId]);
                                con.query(sql2, function(err, res) {
                                    if (err) return done2(err);
                                    done2(null);
    
                                });
                            },function (err) {
                                if (err) return callback(err);
                                callback(null);
                            });
                        },
                        
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





var fnGetNumeroFacturaTrans = function (prefacturaAuto, con, done) {
    // hay que obtener de la empresa la serie
    var sql = "SELECT es.*, emp.serieFacR FROM empresas as emp";
    sql += " LEFT JOIN empresas_series AS es ON es.empresaId = emp.empresaId";
    sql += " WHERE emp.empresaId = ?";
    sql = mysql.format(sql, prefacturaAuto.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(prefacturaAuto.fecha).year();
        var serie;
        for(var i=0; i < res.length; i++) {
            if (res[i].tipoProyectoId) {
                if(prefacturaAuto.tipoProyectoId == res[i].tipoProyectoId) {
                    if(res[i].serie_factura && res[i].serie_factura != '') {
                        if(res[i].serie_factura && res[i].serie_factura != '') {
                            serie = res[i].serie_factura;
                            break;
                        }
                    }
                }
            } 
            if(res[i].departamentoId) {
                if(prefacturaAuto.departamentoId == res[i].departamentoId) {
                    if(res[i].serie_factura && res[i].serie_factura != '') {
                        if(res[i].serie_factura && res[i].serie_factura != '') {
                            serie = res[i].serie_factura;
                            break;
                        }
                    }
                }
            }
        }
        if(prefacturaAuto.total < 0) {
            serie = res[0].serieFacR;
        }

        if (!serie || serie == '') return done(new Error('No existe una serie de facturación para esta empresa'));
        fnComprobarOrdenCorrectoFactura(prefacturaAuto.empresaId, serie, ano, prefacturaAuto.fecha, function (err, res) {
            if (err) return done(err);
            sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM facturas";
            sql += " WHERE empresaId = ?";
            sql += " AND ano = ?";
            sql += " AND serie = ?";
            sql = mysql.format(sql, [prefacturaAuto.empresaId, ano, serie]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                // actualizar los campos del objeto prefacturaAuto
                prefacturaAuto.numero = res[0].n;
                prefacturaAuto.ano = ano;
                prefacturaAuto.serie = serie;
                done(null, prefacturaAuto);
            })
        }, con);
    });
}

var fnGetNumeroPrefacturaTrans = function (prefacturaAuto, con, done) {
    // hay que obtener de la empresa la serie
    var sql = "SELECT es.*, emp.serieFacR FROM empresas as emp";
    sql += " LEFT JOIN empresas_series AS es ON es.empresaId = emp.empresaId";
    sql += " WHERE emp.empresaId = ?";
    sql = mysql.format(sql, prefacturaAuto.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(prefacturaAuto.fecha).year();
        var serie;
        for(var i=0; i < res.length; i++) {
            if(res[i].departamentoId) {
                if(prefacturaAuto.departamentoId == res[i].departamentoId) {
                    serie = res[i].serie_prefactura;          
                    break;
                }
                    
            }
        }
        if(prefacturaAuto.total < 0) {
            serie = res[0].serieFacR;
        }

        if (!serie || serie == '') return done(new Error('No existe una serie de facturación para esta empresa'));
            sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM prefacturasauto";
            sql += " WHERE empresaId = ?";
            sql += " AND ano = ?";
            sql += " AND serie = ?";
            sql = mysql.format(sql, [prefacturaAuto.empresaId, ano, serie]);
            con.query(sql, function (err, res) {
                if (err) return done(err);
                // actualizar los campos del objeto prefacturaAuto
                prefacturaAuto.numero = res[0].n;
                prefacturaAuto.ano = ano;
                prefacturaAuto.serie = serie;
                done(null, prefacturaAuto);
            })
    });
}

// fnComprobarOrderCorrecto:
// es llamada desde obtener numero de prefacturaAuto, porque es en ese momento cuando sabemos
// la serie correspondiente.
var fnComprobarOrdenCorrecto = function (empresaId, serie, ano, fecha, done, con) {
    var passedConnection = true;
    var con = con;
    if (!con) {
        // si no nos han pasado una conexión la creamos.
        con = getConnection();
        passedConnection = false;
    }
    var sql = "SELECT * FROM prefacturasauto";
    sql += " WHERE EmpresaId = ? AND ano = ? AND serie = ? AND fecha > ?"
    sql = mysql.format(sql, [empresaId, ano, serie, fecha]);
    con.query(sql, function (err, res) {
        if (!passedConnection) closeConnection(con);
        if (err) return done(err);
        if (res.length == 0) {
            done(null, true);
        } else {
            done(new Error('Ya hay prefacturasauto posteriores a ' + moment(fecha).format('DD/MM/YYYY') + ' dadas de alta para la serie ' + serie));
        }
    })
}

// fnComprobarOrderCorrecto:
// es llamada desde obtener numero de prefacturaAuto, porque es en ese momento cuando sabemos
// la serie correspondiente.
var fnComprobarOrdenCorrectoFactura = function (empresaId, serie, ano, fecha, done, con) {
    var passedConnection = true;
    var con = con;
    if (!con) {
        // si no nos han pasado una conexión la creamos.
        con = getConnection();
        passedConnection = false;
    }
    var sql = "SELECT * FROM facturas";
    sql += " WHERE EmpresaId = ? AND ano = ? AND serie = ? AND fecha > ?"
    sql = mysql.format(sql, [empresaId, ano, serie, fecha]);
    con.query(sql, function (err, res) {
        if (!passedConnection) closeConnection(con);
        if (err) return done(err);
        if (res.length == 0) {
            done(null, true);
        } else {
            done(new Error('Ya hay factura posteriores a ' + moment(fecha).format('DD/MM/YYYY') + ' dadas de alta para la serie ' + serie));
        }
    })
}


// Contabilización como función serparada
var contabilizarEmpresa = function (dFecha, hFecha, empresa, done) {
    if (!empresa.contabilidad) return done(null, null);
    var con = getConnection();
    var sql = "";
    sql = "SELECT f.serie AS serie,";
    sql += " CONCAT(ano, RIGHT(CONCAT('000000',numero),6)) AS prefacturaAuto,";
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
    sql += " FROM prefacturasauto  AS f";
    sql += " LEFT JOIN prefacturasauto_bases AS fb ON fb.prefacturaAutoId = f.prefacturaAutoId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
    sql += " WHERE f.sel = 1 AND f.empresaId = ?";
    sql += " AND f.fecha >= ? AND f.fecha <= ?";
    sql += " AND f.contafich IS NULL";
    sql += " ORDER BY serie, prefacturaAuto";
    sql = mysql.format(sql, [empresa.empresaId, dFecha, hFecha]);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(null, '');
        prefacturasauto = res;
        var facs = "serie;prefacturaAuto;fecha;cuenta_cli;fpago;tipo_operacion;";
        facs += "cuenta_ret;imp_ret;tipo_ret;cuenta_ventas;centro_coste;imp_venta;";
        facs += "por_iva;imp_iva;por_rec;imp_rec;total_factura;integracion;iban;observacion\r\n";
        var f1 = "%s;%s;%s;%s;%s;%s;";
        var f2 = "%s;%s;%s;%s;%s;%s;";
        var f3 = "%s;%s;%s;%s;%s;%s;%s;%s\r\n";
        prefacturasauto.forEach(function (f) {
            // vamos cargando una a una las líneas de prefacturasauto;
            facs += sprintf(f1, f.serie, f.prefacturaAuto, f.fecha, f.cuenta_cli, f.fpago, f.tipo_operacion);
            facs += sprintf(f2, f.cuenta_ret, f.imp_ret, f.tipo_ret, f.cuenta_ventas, f.centro_coste, f.imp_venta);
            facs += sprintf(f3, f.por_iva, f.imp_iva, f.por_rec, f.imp_rec, f.total_factura, f.integracion, f.iban, f.observacion);
        });
        // montamos el nombre del fichero.
        var fichero = moment(dFecha).format('YYYYMMDD') + "_" + moment(hFecha).format('YYYYMMDD') + ".csv";
        var nomfich = process.env.CONTA_DIR + "\\" + empresa.contabilidad + "_" + fichero;
        fs.writeFile(nomfich, facs, function (err) {
            if (err) return done(err);
            // actualizar las prefacturasauto como generadas
            sql = "UPDATE prefacturasauto as f SET f.contafich = ?"
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
    var prefacturasauto = null;
    var finalizado = 0;
    sql = "SELECT f.prefacturaAutoId, f.serie, f.ano, f.numero, f.fecha, e.nombre, e.infPrefacturasauto,";
    sql += " CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich";
    sql += " FROM prefacturasauto AS f";
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
        prefacturasauto = result;
        async.forEachSeries(prefacturasauto, function (f, done1) {
            var report = new Stimulsoft.Report.StiReport();
            var file = process.env.REPORTS_DIR + "\\" + f.infPrefacturasauto + ".mrt";
            report.loadFile(file);
            var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
            connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
            connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
            connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
            report.dictionary.databases.list[0].connectionString = connectionString;
            var pos = 0;
            for (var i = 0; i < report.dataSources.items.length; i++) {
                var str = report.dataSources.items[i].sqlCommand;
                if (str.indexOf("pf.prefacturaAutoId") > -1) pos = i;
            }
            var sql = report.dataSources.items[pos].sqlCommand;
            report.dataSources.items[pos].sqlCommand = sql + " WHERE pf.prefacturaAutoId = " + f.prefacturaAutoId;
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
                if(finalizado == 0) {
                    done1();
                } else {
                    return;
                }
            });

        }, function (err) {
            if (err) return callback(err);
            finalizado = 1;
            callback(null);
        })
    });
}

//METODOS DE FACTURAS POR DEPARTAMENTOL DE USUARIO

// getPrefacturas
// lee todos los registros de la tabla prefacturasauto que no estén facturadosy
// los devuelve como una lista de objetos
module.exports.getPrefacturasUsuario = function (usuarioId, departamentoId, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturasauto AS pf";
    sql += " LEFT JOIN prefacturasauto AS f ON f.prefacturaAutoId = pf.prefacturaAutoId";
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
    sql += " ORDER BY pf.fecha DESC, f.receptorNombre ASC, pf.numero ASC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        prefacturasauto = result;
        callback(null, prefacturasauto);
    });
}

// getPrefacturasAll
// lee todos los registros de la tabla prefacturasauto y
// los devuelve como una lista de objetos
module.exports.getPrefacturasAllUsuario = function (usuarioId, departamentoId, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturasauto AS pf";
    sql += " LEFT JOIN prefacturasauto AS f ON f.prefacturaAutoId = pf.prefacturaAutoId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = cm.tipoContratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    if(departamentoId > 0) {
        sql += " WHERE pf.departamentoId = " + departamentoId;
    } else {
        sql += " WHERE pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    sql += " ORDER BY pf.fecha DESC, f.receptorNombre ASC, pf.numero ASC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        prefacturasauto = result;
        callback(null, prefacturasauto);
    });
}

// getPrefacturasAll
// lee todos los registros de la tabla prefacturasauto y
// los devuelve como una lista de objetos
module.exports.getPrefacturasReparaciones = function (callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS numero,";
    sql += " fp.nombre AS formaPagoNombre";
    sql += " FROM prefacturasauto AS pf";
    sql += " LEFT JOIN prefacturasauto AS f ON f.prefacturaAutoId = pf.prefacturaAutoId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = pf.departamentoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.departamentoId = 7";
    sql += " ORDER BY pf.fecha DESC, pf.numero ASC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        
        result.forEach(function (pf) {
            pf.numero = pf.numero.toString();
        });
        prefacturasauto = result;
        callback(null, prefacturasauto);
    });
}

// CREACION A PARTIR DE PREFACTURAS
module.exports.postCrearDesdePrefacturas = function (dFecha, hFecha, seleccionados, done) {
    var con = getConnection();
    var sql = "";
    var facturaId = 0;
    var factura = null;
    var numFact;
    var sel = [];
    dFecha = moment(dFecha, 'DD.MM.YYYY').format('YYYY-MM-DD HH:mm');
	hFecha = moment(hFecha, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm');
    if(seleccionados) {
        for(var i = 0; i < seleccionados.length; i++) {
            sel.push(seleccionados[i].rowId);
        }
    }
    // Transaccion general que protege todo el proceso
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // obtener las prefacturas que han de pasarse a prefacturaAuto
        sql = "SELECT pf.*, pf.totalConIva as restoCobrar  FROM prefacturasauto as pf";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId"
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
        sql += " WHERE pf.fecha >= '" + dFecha + "' AND pf.fecha <= '" + hFecha + "'";
        sql += " AND pf.prefacturaAutoId IN (?)";
        sql = mysql.format(sql, [sel]);
        sql += " ORDER BY fecha";
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function () { done(err) });
            prefacturas = res;
            async.eachSeries(prefacturas, function (pf, callback2) {
                var primeraLineaId = 0; //variable para guardar la ID de la primera linea de la prefacturaAuto que se crea
                var numLineas = 0; // variable que almacena el nunmero de lineas insertadas
                // transformar un objeto prefactura en uno prefacturaAuto
                pf.facturaId = 0;
                async.series([
                    function (callback) {
                        // obtener el número de factura que le corresponde
                        fnGetNumeroFacturaTrans(pf, con, function (err, res) {
                            if (err) return callback(err);
                            factura = res;
                            numFact = factura.serie + "-" + factura.ano + "-" + factura.numero;
                            callback(null);
                        }, con);
                    },
                    function (callback) {
                        // insertar la cabecera
                        delete factura.contratoPorcenId // eliminamos campo no necesario
                        delete factura.facturada;
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
                        sql += " SELECT linea, " + factura.facturaId + " AS  prefacturaAutoId, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea,";
                        sql += " coste, porcentajeBeneficio, porcentajeAgente, capituloLinea";
                        sql += " FROM prefacturasauto_lineas";
                        sql += " WHERE prefacturasauto_lineas.prefacturaAutoId = ?";
                        sql += " ORDER BY prefacturasauto_lineas.prefacturaAutoLineaId ASC";
                        sql = mysql.format(sql, pf.prefacturaAutoId);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            primeraLineaId = result.insertId;
                            numLineas = result.affectedRows;
                            callback(null);
                        });
                    },
                    function (callback) {
                        // insertar las bases
                        sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
                        sql += " SELECT  " + factura.facturaId + " AS  prefacturaAutoId, tipoIvaId, porcentaje, base, cuota";
                        sql += " FROM prefacturasauto_bases";
                        sql += " WHERE prefacturasauto_bases.prefacturaAutoId = ?";
                        sql = mysql.format(sql, pf.prefacturaAutoId);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        // actualizar la prefactura indicando la prefacturaAuto en la que está.
                        sql = "UPDATE prefacturasauto SET facturaId = ? WHERE prefacturaAutoId = ?";
                        sql = mysql.format(sql, [factura.facturaId, pf.prefacturaAutoId]);
                        con.query(sql, function (err, result) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function(callback) {
                        // si la prefactura es de reparaciones  actualizamos los partes correspondientes
                        if(factura.departamentoId == 7 && !factura.contratoId) {
                            sql = "UPDATE partes SET numero_factura_cliente = ?, fecha_factura_cliente = ?, facturaId = ? WHERE prefacturaAutoId = ?"
                            sql = mysql.format(sql, [numFact, factura.fecha, factura.facturaId, pf.prefacturaAutoId]);
                            con.query(sql, function (err, result) {
                                if (err) return callback(err);
                                //actualizamos los partes_lineas con la prefacturaAutoLineaId correspondiente
                                sql = "SELECT pl.prefacturaAutoLineaId";
                                sql += " FROM servicios ser, partes p, partes_lineas pl WHERE";
                                sql += " ser.servicioId = p.servicioId AND p.parteId = pl.parteId AND  p.prefacturaAutoId = ? AND p.facturaId = ?";
                                sql = mysql.format(sql,  [pf.prefacturaAutoId, factura.facturaId]);
                                con.query(sql, function (err, result2) {
                                    if (err) return callback(err);
                                    if( result2.length != numLineas){
                                        return callback(null);
                                    } 
                                    var ids = result2;
                                    async.forEachSeries(ids, function (id, done2) {
                                        //var con2 = getConnection();
                                        sql = " UPDATE partes_lineas set facturaLineaId = ? WHERE prefacturaAutoLineaId = ?";
                                        sql = mysql.format(sql, [primeraLineaId, id.prefacturaAutoLineaId]);
                                        con.query(sql, function(err, resultado) {
                                            //con2.end();
                                            if (err) return done2(err);
                                            primeraLineaId++;
                                            done2();
                                        });
                                    }, function (err) {
                                        if(err) return callback(err);
                                        callback(null);
                                    });
                                });
                            });

                        } else {
                            callback(null);
                        }
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
                    done(null, 'OK');
                })
            })
        });
    });
}


//creacion d e report json
module.exports.postCrearReport = function (dFecha, hFecha, clienteId, empresaId, tipoIvaId, conta, orden, serie, departamentoId, usuarioId,callback) {
    var connection = getConnection();
    var obj = 
        {
            libCli: ""
        }
    var sql = "SELECT  f.empresaId,  emp.nombre AS empresaNombre, f.prefacturaAutoId, fecha, f.observaciones, c.referencia,";
	sql += " `emisorNombre`,  ti.nombre AS tipoIva, f.totalConIva, cli.cuentaContable,  fb.porcentaje AS porcentaje,  IF(ti.nombre='SUPLIDOS', 0, fb.base)  AS basFact,";
    sql += " fb.cuota, f.`importeRetencion`, f.ano, f.numero, f.serie, f.receptorNombre, IF(ti.nombre='SUPLIDOS', fb.base, 0)  AS suplidos";
    sql += " FROM prefacturasauto AS f";
    sql += " LEFT JOIN prefacturasauto_bases AS fb ON fb.prefacturaAutoId = f.prefacturaAutoId";
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = f.clienteId"
    sql += "  LEFT JOIN `tipos_iva` AS ti ON ti.tipoIvaId = fb.tipoIvaId";
    sql += " LEFT JOIN empresas AS emp ON emp.empresaId = f.empresaId";
    sql += " LEFT JOIN contratos AS c ON c.contratoId = f.contratoId";

    if(departamentoId && departamentoId > 0) {
        sql += " WHERE f.departamentoId =" + departamentoId;
    } else {
        sql += " WHERE f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
   
    if (clienteId > 0) {
        sql += " AND f.clienteId IN (" + clienteId + ")";
    }
    if (empresaId) {
        sql += " AND f.empresaId IN (" + empresaId + ")";
    }
    if (dFecha) {
        sql += " AND f.fecha >= '" + dFecha + " 00:00:00'";
    }
    if (hFecha) {
        sql += " AND f.fecha <= '" + hFecha + " 23:59:59'";
    }
    if (tipoIvaId > 0) {
        sql += " AND ti.tipoIvaId IN (" + tipoIvaId + ")";
    }
    if(serie != 100) {
        sql += " AND f.serie = " + "'" + serie + "'"
    }

    sql += " ORDER BY   f.serie," +  orden + ", f.prefacturaAutoId";

    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        obj.libCli = procesaResultado(result);

       /*  var resultado = JSON.stringify(obj);
        fs.writeFile(process.env.REPORTS_DIR + "\\listado.json", resultado, function(err) {
            if(err) return callback(err);
            //return callback(null, true);
        });
         */
        callback(null, obj);
    });
 
}




// putFacturaLineaDesdeParte
// Modifica la linea de prefacturaAuto  desde una linea de parte modificada
module.exports.putPrefacturaLineaDesdeParte = function (datos, callback) {
    var prefacturaAutoId;
    var connection = getConnection();
    sql = " SELECT par.prefacturaAutoId, pt.descripcion AS descripcion, pt.unidades AS cantidad,ar.articuloId AS articuloId,pt.tipoIvaClienteId AS tipoIvaId, pt.ivaCliente AS porcentaje, ar.unidadId,";
    sql += " pt.precioCliente AS importe, pt.importeCliente AS coste, pt.importeCliente AS totalLinea ,ga.nombre AS capituloLinea ";
    sql += " FROM partes AS par";
    sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
    sql += " LEFT JOIN partes_lineas AS pt ON pt.parteId = par.parteId"
    sql += " LEFT JOIN articulos AS ar ON ar.codigoReparacion = pt.codigoArticulo";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = ar.unidadId";
    sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoarticuloId = ar.grupoArticuloId"
    sql += " WHERE pt.prefacturaAutoLineaId = ?";
    sql = mysql.format(sql, [datos.prefacturaAutoLineaId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        prefacturaAutoId = result[0].prefacturaAutoId;
        delete result[0].prefacturaAutoId;
        connection = getConnection();
        sql = "UPDATE prefacturasauto_lineas SET ? WHERE prefacturaAutoLineaId = ?";
        sql = mysql.format(sql, [result[0], datos.prefacturaAutoLineaId]);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            // actualizar las bases y cuotas
            fnActualizarBases(prefacturaAutoId, function (err, res) {
                if (err) {
                    return callback(err);
                }
                callback(null, result);
            })
            
        });
    });
}


module.exports.getFechaCobroConta = function (numfactu, empresaId, callback) {
    contabilidadDb.getContaEmpresa(empresaId, function (err, conta) {
        if (err) return callback(err);
        try{
            var array = numfactu.split("-");
            var serie = array[0];
            var numero = array[2].length;
            var num = 6 - numero;
            var composicion = "0"
            if(num < 6) {
                for(var i = 0; i < num-1; i++) {
                    composicion = composicion + "0"
                }
                composicion = composicion + array[2]
            }
        
            numfactu = array[1]+composicion;
        }catch(e) {
            return callback(null, null);
        }
        
       
        var connection = comun.getConnectionDb(conta);
            var sql = "SELECT fecultco FROM cobros WHERE numfactu = ? AND numserie = ?";
            sql = mysql.format(sql,[numfactu, serie]);
            connection.query(sql, function (err, result) {
                connection.end();
                if (err) return callback(err);
                if(result.length == 0) return callback(null, null);
                callback(null, result[0]);
        })
    });
}

module.exports.getPrefacturasCliente = function (clienteId, callback) {
    var connection = getConnection();
    var sql = "SELECT * FROM prefacturasauto WHERE clienteId = ?";
    sql = mysql.format(sql,clienteId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, result);
    })
}

module.exports.getPrefacturasClienteAgenteDepartamento = function (id, departamentoId, esCliente, callback) {
    var connection = getConnection();
    var sql = "SELECT f.*, fp.nombre AS formaPagoNombre, CONCAT(COALESCE(CAST(f.serie AS CHAR(50)),' '),'-',COALESCE(f.ano,' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS numeroFactura FROM prefacturasauto AS f";
    sql += " LEFT JOIN clientes AS cl ON cl.clienteId = f.clienteId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId"
    if(esCliente == 'true') {
        sql += "  WHERE f.clienteId = ?";
        sql = mysql.format(sql, id);
    } else {
        sql += "  WHERE cl.comercialId = ?";
        sql = mysql.format(sql, id);
    }
    if(departamentoId > 0) {
        sql += " AND departamentoId = ?";
        sql += " ORDER BY f.fecha DESC"
        sql = mysql.format(sql, departamentoId);
    }
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        result.forEach(function (f) {
            f.numeroFactura = f.numeroFactura.toString();
        });
        callback(null, result);
    })
}

// getPrefacturasAll
// lee todos los registros de la tabla prefacturasauto y
// los devuelve como una lista de objetos
module.exports.getPrefacturasFactCli = function (dFecha, hFecha, clienteId, empresaId, callback) {
    var connection = getConnection();
    var prefacturasauto = null;
    dFecha = moment(dFecha, 'DD.MM.YYYY').format('YYYY-MM-DD HH:mm');
	hFecha = moment(hFecha, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm');
	clienteId = parseInt(clienteId);
	empresaId = parseInt(empresaId);
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS numero,";
    sql += " fp.nombre AS formaPagoNombre, emp.nombre AS empresa";
    sql += " FROM prefacturasauto AS pf";
    sql += " LEFT JOIN prefacturasauto AS f ON f.prefacturaAutoId = pf.prefacturaAutoId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN departamentos AS dp ON dp.departamentoId = pf.departamentoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " LEFT JOIN empresas as emp ON emp.empresaId = pf.empresaId";
    sql += " WHERE pf.facturaId IS NULL AND pf.fecha >= '" + dFecha + "' AND pf.fecha <= '"+ hFecha+"'";
    if(clienteId) {
        sql += " AND c.clienteId = "+clienteId
    }
   if(empresaId) {
       sql += " AND emp.empresaId = "+ empresaId
   }
    sql += " ORDER BY pf.fecha DESC, pf.numero ASC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err)    return callback(err, null);
        
        result.forEach(function (pf) {
            pf.numero = pf.numero.toString();
        });
        prefacturasauto = result;
        callback(null, prefacturasauto);
    });
}
var procesaResultado = (result) => {
    var antfacid = null;
    result.forEach(e => {
        e.duplicado = false;
        e.fecha = moment(e.fecha).format('DD/MM/YYYY');
        if(e.prefacturaAutoId == antfacid) {
            e.importeRetencion = 0;
            e.duplicado = true;
            e.observaciones = null;
        }
        antfacid = e.prefacturaAutoId;
    });
    return result;
}


// plantillaFactura
// obtiene la la plantilla de informe de una determinada prefacturaAuto
// especificando su id.
var plantillaFactura = (prefacturaAutoId, done) => {
    var con = getConnection();
    var infPrefacturasauto = "";ç
    var sql = "SELECT e.infPrefacturasauto FROM prefacturasauto AS f LEFT JOIN empresas AS e ON e.empresaId = f.empresaId";
    sql += " WHERE f.prefacturaAutoId = ?";
    sql = mysql.format(sql, prefacturaAutoId);
    con.query(sql, (err, data) => {
        con.end();
        if (err) return done(err);
        infPrefacturasauto = data[0].infPrefacturasauto;
        done(null, infPrefacturasauto);
    });
}

module.exports.postPrepararCorreos = function (dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId, done) {
    crearPdfsFactura(dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId, (err, prefacturasauto) => {
        if (err) return done(err);
        done(null, prefacturasauto);
    });
}

// grabarPdfDeFactura
var grabarPdfDeFactura = (prefacturaAutoId, infPrefacturasauto, nomfich, done) => {
    // Parámetros generales stimultsoft
    Stimulsoft.StiOptions.WebServer.url = "http://" + process.env.API_HOST + ":" + process.env.STI_PORT;
    Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    //
    var report = new Stimulsoft.Report.StiReport();
    var file = process.env.REPORTS_DIR + "\\" + infPrefacturasauto + ".mrt";
    report.loadFile(file);
    var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
            connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
            connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
            connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
    report.dictionary.databases.list[0].connectionString = connectionString;
    var pos = 0;
    for (var i = 0; i < report.dataSources.items.length; i++) {
        var str = report.dataSources.items[i].sqlCommand;
        if (str.indexOf("pf.prefacturaAutoId") > -1) pos = i;
    }
    var sql = report.dataSources.items[pos].sqlCommand;
    report.dataSources.items[pos].sqlCommand = sql + " WHERE pf.prefacturaAutoId = " + prefacturaAutoId;
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

// obtenerPrefacturasParaCorreo
var obtenerPrefacturasParaCorreo = (dFecha, hFecha, done) => {
    var con = getConnection();
    var sql = "SELECT ";
    sql += " f.prefacturaAutoId, CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich,";
    sql += " e.nombre AS nombreEmpresa, e.email AS correoEmpresa, e.infPrefacturasauto,";
    sql += " c.nombre AS nombreCliente, c.emailPrefacturasauto AS correoCliente";
    sql += " FROM prefacturasauto AS f";
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
var crearCorreosAEnviar = (dFecha, hFecha, prefacturasauto, done) => {
    var numReg = 0;
    var totalReg = prefacturasauto.length;
    var primerRegistro = true;
    var antEmpresa = "";
    var antCliente = "";
    var asuntoCorreo = "";
    var plantilla = "";
    var c0 = "";
    var c1 = "";
    var correo = {};
    var correos = [];
    prefacturasauto.forEach((prefacturaAuto) => {
        //ioAPI.sendProgress("Procesando correos...", ++numReg, totalReg);
        if (antEmpresa != prefacturaAuto.nombreEmpresa) {
            // nuevo correo, cada empresa manda el suyo
            correo.emisor = prefacturaAuto.correoEmpresa;
            antEmpresa = prefacturaAuto.nombreEmpresa;
        }
        if (antCliente != prefacturaAuto.nombreCliente) {
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
            antCliente = prefacturaAuto.nombreCliente;
            primerRegistro = false;
            if (!prefacturaAuto.asuntoCorreo || prefacturaAuto.asuntoCorreo == "") {
                prefacturaAuto.asuntoCorreo = "Envio de prefacturasauto"
            }
            asuntoCorreo = prefacturaAuto.asuntoCorreo;
            asuntoCorreo = asuntoCorreo.replace('{0}', prefacturaAuto.nombreEmpresa);
            asuntoCorreo = asuntoCorreo.replace('{1}', dFecha);
            asuntoCorreo = asuntoCorreo.replace('{2}', hFecha);

            correo = {
                nombreEmpresa: prefacturaAuto.nombreEmpresa,
                emisor: prefacturaAuto.correoEmpresa,
                destinatario: prefacturaAuto.correoCliente,
                asunto: asuntoCorreo,
                ficheros: [],
                prefacturasauto: []
            }
            c0 = prefacturaAuto.nombreCliente;
        }
        c1 += " PREFACTURA: " + prefacturaAuto.nomfich + " IMPORTE: " + prefacturaAuto.totalConIva + "<br/>";
        plantilla = prefacturaAuto.plantillaCorreoPrefacturasauto;
        correo.ficheros.push(prefacturaAuto.pdf);
        correo.prefacturasauto.push(prefacturaAuto);
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
    var prefacturasauto = null;
    var facturas2 = [];
    sql = "SELECT f.prefacturaAutoId, f.serie, f.ano, f.numero, f.fecha, f.total, f.totalConIva, f.departamentoId,";
    sql += " e.nombre as nombreEmpresa, e.email as correoEmpresa, e.infPrefacturasauto, e.infFacCliRep, e.infFacCliObr, e.plantillaCorreoPrefacturasauto, e.asuntoCorreo, ";
    sql += " c.nombre as nombreCliente, c.emailPrefacturasauto as correoCliente,";
    sql += " CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich";
    sql += " FROM prefacturasauto AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId"; 
    sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
    sql += " LEFT JOIN contratos AS co ON co.contratoId = f.contratoId "
    // -- modificar sql según parámetros
    sql += " WHERE f.sel = 1 AND f.enviadaCorreo = 0 AND c.facturarPorEmail = 1";
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
        prefacturasauto = result;
        var numReg = 0;
        var totalReg = prefacturasauto.length;
        ioAPI.sendProgress("Procesando pdfs...", numReg, totalReg);
            async.forEachSeries(prefacturasauto, function (f, done1) {
                ioAPI.sendProgress("Procesando pdfs...", ++numReg, totalReg);
                var report = new Stimulsoft.Report.StiReport();
                var file = "";
                if(f.departamentoId == 7) {
                    file = process.env.REPORTS_DIR + "\\" + f.infFacCliRep + ".mrt";
                }else if (f.departamentoId == 8) {
                    file = process.env.REPORTS_DIR + "\\" + f.infFacCliObr + ".mrt";
                 } else {
                        file = process.env.REPORTS_DIR + "\\" + f.infPrefacturasauto + ".mrt";
                    }
                report.loadFile(file);
                var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
                connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
                connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
                connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
                report.dictionary.databases.list[0].connectionString = connectionString;
                var pos = 0;
                for (var i = 0; i < report.dataSources.items.length; i++) {
                    var str = report.dataSources.items[i].sqlCommand;
                    if (str.indexOf("pf.prefacturaAutoId") > -1) pos = i;
                }
                var sql = report.dataSources.items[pos].sqlCommand;
                report.dataSources.items[pos].sqlCommand = sql + " WHERE pf.prefacturaAutoId = " + f.prefacturaAutoId;
                report.renderAsync(function () {
                        // Creating export settings
                        var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                        // Creating export service
                        var service = new Stimulsoft.Report.Export.StiPdfExportService();
                        // Creating MemoryStream
                        var stream = new Stimulsoft.System.IO.MemoryStream();
                        service.exportTo(report, stream, settings);
    
                        var data = stream.toArray();
    
                        var buffer = new Buffer(data, "utf-8");
    
                        try {
                            fs.writeFileSync(process.env.FACTURA_DIR + "\\" + f.nomfich + ".pdf", buffer);
                            f.pdf = process.env.FACTURA_DIR + "\\" + f.nomfich + ".pdf";
                            f.nomfich = f.nomfich.toString();
                            facturas2.push(f);
                            done1();
                        } catch(e) {
                            return done1(e);
                        }
                });
    
            }, function (err) {
                if (err) return callback(err);
                callback(null, facturas2);
            })
        
    });
}



//creacion de report json
module.exports.postCrearReportRep = function (id ,callback) {
    var connection = getConnection();
    var obj = 
        {
            cabecera: "",
            bases: "",
            lineas: ""
        }
    var sql = "SELECT pf.prefacturaAutoId, pf.ano, pf.numero, pf.serie,  DATE_FORMAT(pf.fecha,'%d-%m-%Y') AS fecha, pf.empresaId, pf.clienteId, ";
	sql += "  pf.contratoClienteMantenimientoId,pf.importeAnticipo, pf.restoCobrar, pf.emisorNif, pf.emisorNombre, pf.emisorDireccion, pf.emisorCodPostal,";
    sql += " pf.emisorPoblacion, pf.emisorProvincia, tpv1.nombre AS receptorTipoVia,pf.receptorNif, pf.receptorNombre, pf.receptorDireccion, pf.receptorCodPostal, pf.receptorPoblacion,";
    sql += " pf.receptorProvincia,pf.total, pf.totalConIva, fp.nombre AS formaPago, pf.observaciones, pf.periodo, pf.porcentajeRetencion, pf.importeRetencion,";
    sql += " fp.numeroVencimientos, fp.primerVencimiento, fp.restoVencimiento, cl.proId, tpv.nombre AS postalTipoVia, cl.direccion3 AS postalDireccion,";
    sql += " cl.codPostal3 AS postalCodPostal, cl.poblacion3 AS postalPoblacion, cl.provincia3 AS postalProvincia,cl.iban,"
    sql += "  DATE_FORMAT(DATE_ADD(pf.fecha,INTERVAL fp.primerVencimiento DAY), '%d-%m-%Y') AS vencimiento,";
    sql += " CONCAT(SUBSTR(cl.iban,1,20), '****')  AS cuenta,";
    sql += " cl.direccion2 AS direccion2, cl.codPostal2 AS codPostal2, cl.poblacion AS poblacion2, cl.provincia AS provincia2,";
    sql += " com.direccion AS direccionAgente, com.poblacion AS poblacionAgente, com.provincia AS provinciaAgente, com.codPostal AS codPostalAgente,"
    sql += " com.nif AS nifAgente, com.nombre AS nombreAgente, tpv2.nombre AS agenteTipoVia";
    sql += " FROM prefacturasauto AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formapagoId";
    sql += " LEFT JOIN clientes AS cl ON cl.clienteId = pf.clienteId";
    sql += " LEFT JOIN tipos_via AS tpv ON tpv.tipoViaId = cl.tipoViaId3";
    sql += " LEFT JOIN tipos_via AS tpv1 ON tpv1.tipoViaId = cl.tipoViaId";
    sql += " LEFT JOIN comerciales AS com ON com.comercialId = cl.comercialId";
    sql += " LEFT JOIN tipos_via AS tpv2 ON tpv2.tipoViaId = com.tipoViaId";
    if(id) {
        sql += " WHERE pf.prefacturaAutoId =" + id;
    } 
    connection.query(sql, function (err, result) {
        if (err)    return callback(err, null);
        result[0].fecha = result[0].fecha.toString();
        result[0].vencimiento = result[0].vencimiento.toString();
        obj.cabecera = result[0];
        sql = "SELECT pfl.*, t.nombre AS tipoIva, ga.nombre AS grupo, par.numparte, ser.numservicio, u.abrev, pl.codigoArticulo, ser.direccionTrabajo";
        sql += "  FROM prefacturasauto_lineas AS pfl";
        sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfl.tipoIvaId";
        sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
        sql += " LEFT JOIN partes_lineas AS pl ON pl.prefacturaAutoLineaId = pfl.prefacturaAutoLineaId"
        sql += " LEFT JOIN partes AS par ON par.parteId = pl.parteId";
        sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId";
        sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId";
        if(id) {
            sql += " WHERE pfl.prefacturaAutoId =" + id;
        } 
        connection.query(sql, function (err, result2) {
            if (err)    return callback(err, null);
            obj.lineas = result2;
            sql = "SELECT pfb.*, t.nombre AS tipoIva, pfb.base AS baseImp ";
            sql += " FROM prefacturasauto_bases AS pfb";
            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfb.tipoIvaId";
            if(id) {
                sql += " WHERE pfb.prefacturaAutoId =" + id;
            } 
            connection.query(sql, function (err, result3) {
                closeConnectionCallback(connection, callback);
                if (err)    return callback(err, null);
                obj.bases = result3;
                /*  var resultado = JSON.stringify(obj);
                fs.writeFile(process.env.REPORTS_DIR + "\\listado.json", resultado, function(err) {
                if(err) return callback(err);
                //return callback(null, true);
                });*/
                callback(null, obj);
            });
        });
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
                    correoAPI.sendCorreo(c, parametros, false, (err) => {
                        ioAPI.sendProgress("Enviado correos... ", ++numReg, totalReg);
                        resEnvio += c.prefacturasauto[0].nombreCliente + "(" + c.prefacturasauto[0].correoCliente + ") // ";
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
    if (!correo.prefacturasauto) return done(); // no hay prefacturasauto que actualizar
    async.forEachSeries(correo.prefacturasauto,
        (prefacturaAuto, done1) => {
            var con = getConnection();
            var sql = "UPDATE prefacturasauto SET enviadaCorreo = 1 WHERE prefacturaAutoId = ?";
            sql = mysql.format(sql, prefacturaAuto.prefacturaAutoId);
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

var fnGetNumeroantClien = function (antClien, contador, done) {
    if(contador > 0) {
        antClien.numero = contador;
        return done(null, antClien);
    }
    var con = getConnection();
    var ano = moment(antClien.fecha).year();
    sql = "SELECT MAX(numero) AS n FROM antClien";
    sql += " WHERE ano = ? AND empresaId = ? AND serie = 'ANT'";
    sql = mysql.format(sql, [ano, antClien.empresaId]);
    con.query(sql, function (err, res) {
        con.end()
        if (err) return done(err);
        // actualizar los campos del objeto antClien
        antClien.numero = res[0].n +1;
        contador = res[0].n +1;
        antClien.ano = ano;
        done(null, antClien);
    });
}
