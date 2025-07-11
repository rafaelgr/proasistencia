// facturas_db_mysql
// Manejo de la tabla facturas en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
const mysql2 = require('mysql2/promise') ;
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");
var sprintf = require("sprintf-js").sprintf;
var parametrosDb = require("../parametros/parametros_db_mysql");
var comun = require('../comun/comun.js');
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");
var AWS = require('aws-sdk');
const fsp = require('fs').promises;
var path = require('path');

//  leer la configurción de MySQL

//var config2 = require("../../config.json");
var fs = require('fs');





var sql = "";
var Stimulsoft = require('stimulsoft-reports-js');

var ioAPI = require('../ioapi/ioapi');

var correoAPI = require('../correoElectronico/correoElectronico');
var cobrosDb = require('../cobros/cobros_db_mysql');
const { resolve } = require("dns");
const { error } = require("console");
const { json } = require("body-parser");


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

const obtenerConfiguracion = function() {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET
    }
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
                    var buffer = new Buffer.from(data, "utf-8")

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
        closeConnection(connection);
        if (err) return callback(err);
        connection = getConnection();
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
    //primero comprobamos las facturas que se van a contabilizar



    var sql = "UPDATE facturas SET sel = 0";
    sql += " WHERE fecha >= ? AND fecha <= ?";
    sql += " AND contafich IS NULL AND noContabilizar = 0";
    if(departamentoId && departamentoId > 0) {
        sql += " AND departamentoId =" + departamentoId;
    } else {
        sql += " AND departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        closeConnection(connection);
        if (err) return callback(err);
        connection = getConnection();
        sql = "SELECT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM facturas AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        sql += " AND f.contabilizada = 0 AND  noContabilizar = 0";
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

// getPreContaFacturas
// obtiene las facturas no contabilizadas entre las fechas indicadas
module.exports.getPreContaFacturas2 = async (dFecha, hFecha, departamentoId, usuarioId) => {
    let connection = undefined
    var sql = "";
    var facturas = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            // comprobamos primero las facturas que se van a contabilizar 
            let contas = await getContas(dFecha, hFecha, departamentoId, usuarioId, connection);
            if(contas) {
                if(contas.length == 0) {
                    let e = new Error("No se han encontrado registros.");
                    throw e;
                }
            }
          

            let [ result3 ] = await compruebaCodmacta(dFecha, hFecha, departamentoId, usuarioId, contas, connection);

            if( result3.error.length > 0) {
                return resolve(result3)
            }

            let [ result4 ] = await compruebaCodmactaVentas(dFecha, hFecha, departamentoId, usuarioId, contas, connection);

            if( result4.error.length > 0) {
                return resolve(result4)
            }

            sql = "UPDATE facturas SET sel = 0";
            sql += " WHERE fecha >= ? AND fecha <= ?";
            sql += " AND contabilizada = 0 AND  noContabilizar = 0";
            if(departamentoId && departamentoId > 0) {
                sql += " AND departamentoId =" + departamentoId;
            } else {
                sql += " AND departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
            }
            
            sql = mysql2.format(sql, [dFecha, hFecha]);
            const [result] = await connection.query(sql);

            sql = "SELECT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum";
            sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
            sql += "  FROM facturas AS f";
            sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
            sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
            sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
            sql += " AND f.contabilizada = 0 AND  noContabilizar = 0";
            if(departamentoId && departamentoId > 0) {
                sql += " AND f.departamentoId = "+ departamentoId;
            } else {
                sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
            }
            sql = mysql2.format(sql, [dFecha, hFecha]);
            const [result2] = await connection.query(sql);
            await connection.end();
            resolve(result2);

        }catch(e) {
            if(connection) {
                if (!connection.connection._closing) {
					await connection.end();
                } 
            }
            reject (e);

        }
    });
}


let getContas = async (dFecha, hFecha, departamentoId, usuarioId, connection) => {
    let sql = "";
    return new Promise( async(resolve, reject) => {
        try {
            sql = "SELECT  e.contabilidad, e.empresaId";
            sql += " FROM empresas AS e ";
            sql += " INNER JOIN facturas AS f ON f.empresaId = e.empresaId";
            sql += " WHERE f.fecha >= ? AND f.fecha <= ? AND f.contabilizada = 0";
            sql += "  AND  f.noContabilizar = 0";
            if(departamentoId && departamentoId > 0) {
                sql += " AND f.departamentoId = "+ departamentoId;
            } else {
                sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
            }
            sql += " GROUP BY 1";
            sql = mysql2.format(sql, [dFecha, hFecha]);
            const [result] = await connection.query(sql);
            resolve(result)
        } catch(e) {
           reject(e)
        }
    });
}


let compruebaCodmacta = async (dFecha, hFecha, departamentoId, usuarioId, contas, connection) => {
    let sql = "";
    let data = [{ error: []} ];
    var resultado = {};
    return new Promise( async(resolve, reject) => {
        try {
            for(let conta of contas) {
                sql = "SELECT  cuentacontable, c.nombre, ";
                sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS numero";
                sql += " FROM clientes AS c ";
                sql += " INNER JOIN facturas AS f ON c.clienteId = f.clienteId";
                sql += " WHERE f.fecha >= ? AND f.fecha <= ? AND f.contabilizada = 0";
                sql += " AND contafich IS NULL AND f.noContabilizar = 0";
                sql += " AND f.empresaId = " + conta.empresaId
                if(departamentoId && departamentoId > 0) {
                sql += " AND f.departamentoId = "+ departamentoId;
                } else {
                    sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
                }
                sql += " AND NOT COALESCE(cuentacontable,'') IN (SELECT codmacta FROM " + conta.contabilidad + ".cuentas WHERE apudirec='S' )";
                sql += " GROUP BY 1";

                sql = mysql2.format(sql, [dFecha, hFecha]);
                let [result] = await connection.query(sql);
                if(result.length > 0) {
                    data[0].error.push(result);
                }
            };
            resolve(data)

        } catch(e) {
            reject(e);
        }
    });
}

let compruebaCodmactaVentas = async (dFecha, hFecha, departamentoId, usuarioId, contas, connection) => {
    let sql = "";
    let data = [{ error: []} ];
    var resultado = {};
    return new Promise( async(resolve, reject) => {
        try {
            for(let conta of contas) {
                sql = "SELECT DISTINCT";
                sql += " ga.cuentaventas AS cuentaVentas,";
                sql += " f.receptorNombre,";
                sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS numero";
                sql += " FROM facturas_lineas AS fl";
                sql += " LEFT JOIN facturas AS f ON f.facturaId = fl.facturaId";
                sql += " LEFT JOIN articulos AS a ON a.articuloId = fl.articuloId";
                sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
                sql += " LEFT JOIN tipos_iva AS tp ON tp.tipoIvaId = fl.tipoIvaId";
                sql += " WHERE f.fecha >= ? AND f.fecha <= ? AND f.contabilizada = 0";
                sql += " AND contafich IS NULL AND f.noContabilizar = 0";
                sql += " AND f.empresaId = " + conta.empresaId
                if(departamentoId && departamentoId > 0) {
                sql += " AND f.departamentoId = "+ departamentoId;
                } else {
                    sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
                }
                sql += " AND NOT COALESCE(ga.cuentaventas,'') IN (SELECT codmacta FROM " + conta.contabilidad + ".cuentas WHERE apudirec='S' )";
                sql += " GROUP BY 3";

                sql = mysql2.format(sql, [dFecha, hFecha]);
                let [result] = await connection.query(sql);
                if(result.length > 0) {
                    data[0].error.push(result);
                }
            };
            resolve(data)

        } catch(e) {
            reject(e);
        }
    });
}


// getPreCorreoFacturas
// obtiene las facturas no enviadas entre las fechas indicadas
module.exports.getPreCorreoFacturas = function (dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId,callback) {
    var connection = getConnection();
    var facturas = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "UPDATE facturas AS f"
    sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
    sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
    sql += " LEFT JOIN clientes as cli ON cli.clienteId = f.clienteId";
    sql += " LEFT JOIN partes as p ON p.facturaId = f.facturaId";
    sql += " LEFT JOIN servicios as s ON s.servicioId = p.servicioId";
    sql += " SET f.sel = 0";
    sql += " WHERE f.fecha >= ? AND f.fecha <= ?"; 
    sql = mysql.format(sql, [dFecha, hFecha]);
    if (clienteId > 0) {
        if(departamentoId == 7) {
            sql += " AND f.clienteId = ?";
        } else {
            sql += " AND cnt.clienteId = ?";
        }
        sql = mysql.format(sql, clienteId);
    }
    if (mantenedorId > 0) {
        sql += " AND cnt.mantenedorId = ?";
        sql = mysql.format(sql, mantenedorId);
    }
    if (comercialId > 0) {
        if(departamentoId == 7) {
            sql += " AND s.agenteId = ?";
        } else {
            sql += " AND cnt.agenteId = ?";
        }
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
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + " AND departamentoId != 7)";
    }
    sql += " AND f.enviadaCorreo = 0";
    
   
    connection.query(sql, function (err, res) {
        closeConnection(connection);
        if (err) return callback(err);
        connection = getConnection();
        sql = "SELECT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM facturas AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
        sql += " LEFT JOIN clientes as cli ON cli.clienteId = f.clienteId";
        sql += " LEFT JOIN partes as p ON p.facturaId = f.facturaId";
        sql += " LEFT JOIN servicios as s ON s.servicioId = p.servicioId";
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        sql += " AND cli.facturarPorEmail = 1";
        sql += " AND f.enviadaCorreo = 0";
        sql = mysql.format(sql, [dFecha, hFecha]);
        if (clienteId > 0) {
            if(departamentoId == 7) {
                sql += " AND f.clienteId = ?";
            } else {
                sql += " AND cnt.clienteId = ?";
            }
            sql = mysql.format(sql, clienteId);
        }
        if (mantenedorId > 0) {
            sql += " AND cnt.mantenedorId = ?";
            sql = mysql.format(sql, mantenedorId);
        }
        if (comercialId > 0) {
            if(departamentoId == 7) {
                sql += " AND s.agenteId = ?";
            } else {
                sql += " AND cnt.agenteId = ?";
            }
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
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+" AND departamentoId != 7)";
        }
        sql += " GROUP BY f.facturaId"

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
    sql = "UPDATE facturas AS f";
    sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
    sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";  
    sql += " SET f.sel = 0";
    sql += " WHERE (f.fecha >= ? AND f.fecha <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
        if (departamentoId != 0) {
            sql += " AND f.departamentoId = " + departamentoId;
        }
        if (empresaId != 0) {
            sql += " AND f.empresaId = " + empresaId;
        }
        if (comercialId != 0) {
            sql += " AND (cnt.agenteId = " + comercialId;
        }
        sql += ") OR";
        sql += " (f.fecha < ?";
        sql = mysql.format(sql, [dFecha]);
        if (departamentoId != 0) {
            sql += " AND f.departamentoId = " + departamentoId;
        } 
        if (empresaId != 0) {
            sql += " AND f.empresaId = " + empresaId;
        }
        if (comercialId != 0) {
            sql += " AND cnt.agenteId = " + comercialId;
        }
        sql += ")"
    connection.query(sql, function (err, result) {
        if (err) { connection.end(); return callback(err) }
        // primero las marcamos por defecto como liquidables
        sql = "SELECT DISTINCT f.*, CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vNum ";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += " FROM facturas AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " WHERE (f.fecha >= ?  AND f.fecha <= ? AND f.liquidadaAgente = 0";
        if (departamentoId != 0) {
            sql += " AND f.departamentoId = " + departamentoId;
        } 
        if (empresaId != 0) {
            sql += " AND f.empresaId = " + empresaId;
        }
        if (comercialId != 0) {
            sql += " AND cnt.agenteId = " + comercialId;
        }
        sql += "  AND liquidadaAgente = 0)";
        sql = mysql.format(sql, [dFecha, hFecha]);

        sql += " OR (f.fecha < ?";
        sql = mysql.format(sql, dFecha);
        if (departamentoId != 0) {
            sql += " AND f.departamentoId = " + departamentoId;
        } 
        if (empresaId != 0) {
            sql += " AND f.empresaId = " + empresaId;
        }
        if (comercialId != 0) {
            sql += " AND (cnt.agenteId = " + comercialId;
        }
        sql += " AND liquidadaAgente= 0)";

        sql += " ORDER BY f.serie, f.numero";
        connection.query(sql, function (err, res) {
            if (err) { connection.end(); return callback(err) }
            facturas2 = res;
            facturas = [];
            async.forEachSeries(facturas2, function (f, callback2) {
                cobrosDb.isFacturaCobrada(f.facturaId, dFecha, hFecha, function (err, cobrada) {
                    if (err) return callback2(err);
                    if (cobrada){
                        f.esSegura = 1;
                       
                    } else {
                        f.esSegura = 0;
                    }
                    if (f.formaPagoId == 6 && f.departamentoId == 7){
                        f.esSegura = 1;
                       
                    } 
                    if (f.departamentoId == 1 && f.noCobro == 1){
                        f.esSegura = 1;
                       
                    } 
                    f.sel = 1;
                    //actulizamos la propiedad esSegura de la factura
                    sql = "UPDATE facturas SET esSegura = ?";
                    sql += " WHERE facturaId = ?";
                    sql = mysql.format(sql, [f.esSegura, f.facturaId]);
                    connection.query(sql, function (err, res) {
                        if (err) { connection.end(); return callback(err) }
                        facturas.push(f);
                        callback2();
                    });
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
module.exports.getFactura = async function (id, callback) {
    const connection = getConnection();
    try {
        // Construcción de la consulta SQL
        let sql = `
            SELECT 
                pf.*,
                CONCAT(
                    COALESCE(pf.ano, ' '), '-',
                    COALESCE(CAST(pf.serie AS CHAR(50)), ' '), '-',
                    COALESCE(CAST(pf.numero AS CHAR(50)), ' ')
                ) AS vNum,
                CONCAT(
                    COALESCE(f.serie, ' '), '-',
                    COALESCE(CAST(f.ano AS CHAR(50)), ' '), '-',
                    COALESCE(CAST(f.numero AS CHAR(50)), ' ')
                ) AS vFac,
                fp.nombre AS vFPago, 
                cm.referencia, 
                c.direccion2 AS dirTrabajo
            FROM facturas AS pf
            LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId
            LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId
            LEFT JOIN contratos AS cm ON cm.contratoId = pf.contratoId
            LEFT JOIN clientes AS c ON c.clienteId = cm.clienteId
            WHERE pf.facturaId = ?
            ORDER BY pf.fecha
        `;

        sql = mysql.format(sql, [id]);

        // Ejecución de la consulta
        const facturas = await new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) return resolve(null);
                resolve(
                    result.map(pf => ({
                        ...pf,
                        vNum: `${pf.serie}-${pf.ano}-${pf.numero}`,
                    }))
                );
            });
        });

        // Verificar si se encontraron facturas
        if (!facturas) {
            return callback(null, null);
        }

        // Procesar la factura con asignaAgenteFactura
        const facturasConAgente = await asignaAgenteFactura(facturas);

        // Devolver el resultado al callback
        callback(null, facturasConAgente[0]);
    } catch (err) {
        // Manejo de errores
        callback(err, null);
    } finally {
        // Cerrar la conexión
        if (connection) connection.end();
    }
};



module.exports.getFacturaAgente = async function (id, callback) {
    const connection = getConnection();
    try {
        // Construcción de la consulta SQL
        let sql = `
            SELECT 
                pf.*, 
                0 AS agenteId, 
                '' AS nombreAgente,
                CONCAT(
                    COALESCE(pf.ano, ' '), '-',
                    COALESCE(CAST(pf.serie AS CHAR(50)), ' '), '-',
                    COALESCE(CAST(pf.numero AS CHAR(50)), ' ')
                ) AS vNum,
                CONCAT(
                    COALESCE(f.serie, ' '), '-',
                    COALESCE(CAST(f.ano AS CHAR(50)), ' '), '-',
                    COALESCE(CAST(f.numero AS CHAR(50)), ' ')
                ) AS vFac,
                fp.nombre AS vFPago, 
                cm.referencia, 
                c.direccion2 AS dirTrabajo
            FROM facturas AS pf
            LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId
            LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId
            LEFT JOIN contratos AS cm ON cm.contratoId = pf.contratoId
            LEFT JOIN clientes AS c ON c.clienteId = cm.clienteId
            WHERE pf.facturaId = ?
            ORDER BY pf.fecha
        `;

        sql = mysql.format(sql, [id]);

        // Ejecución de la consulta
        const facturas = await new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) return resolve(null);
                resolve(
                    result.map(pf => ({
                        ...pf,
                        vNum: `${pf.serie}-${pf.ano}-${pf.numero}`,
                    }))
                );
            });
        });

        // Verificar si se encontraron facturas
        if (!facturas) {
            return callback(null, null);
        }

        // Procesar las facturas con asignaAgenteFactura
        const facturasConAgente = await asignaAgenteFactura(facturas);

        // Devolver el resultado al callback
        callback(null, facturasConAgente);
    } catch (err) {
        // Manejo de errores
        callback(err, null);
    } finally {
        // Cerrar la conexión
        if (connection) connection.end();
    }
};

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
    sql += " AND f.sel = 1 AND f.contabilizada = 0 AND noContabilizar = 0";
    if(departamentoId && departamentoId > 0) {
        sql += " AND f.departamentoId =" + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        try{
            if(rows.length == 0) {
                throw new Error("No se ha seleccionado ningún registro");
            }
            
        } catch(e) {
            return done(e);
        }
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
            if(err) return done(err);
            done(null, msg);
        });
    });
}

module.exports.postEnviarCorreosReparaciones = function (dFecha, hFecha, facturas, done) {
    // TODO: Hay que montar los correos propiamente dichos
    crearCorreosAEnviarReparaciones(dFecha, hFecha, facturas, (err, data) => {
        if (err) return done(err);
        var correos = data;
        enviarCorreos(correos, (err, msg) => {
            if(err) return done(err);
            done(null, msg);
        });
    })
}

module.exports.borrarDirectorio = async () => {
	return new Promise(async (resolve, reject) => {
        //vaciamos el directorio de facturas de proveedores eliminando los archiivos
		fsp.readdir(process.env.FACTURA_DIR)
		.then(files => {
		  const unlinkPromises3 = files.map(file => {
			const filePath3 = path.join(process.env.FACTURA_DIR, file)
			return fsp.unlink(filePath3)
			
		  })
		  let result3 = Promise.all(unlinkPromises3);
		  resolve(result3);
		}).catch(err => {
			reject(err);
		}); 
	});
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
// postFacturaLineaDesdeParte
// Modifica la linea de factura  desde una linea de parte modificada
module.exports.postFacturaLineaDesdeParte = function (facturaId, lineaParteId, callback) {
    var connection = getConnection();
    var sql = "SELECT par.facturaId, pt.descripcion AS descripcion, pt.unidades AS cantidad,ar.articuloId AS articuloId,pt.tipoIvaClienteId AS tipoIvaId, pt.ivaCliente AS porcentaje, ar.unidadId,";
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
        //averigamos cuantas lineas tiene la factura 
        connection = getConnection();
        sql = "SELECT MAX(linea) AS num from facturas_lineas WHERE facturaId = ?";
        sql = mysql.format(sql, facturaId);
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
            sql = "INSERT INTO facturas_lineas SET ?";
            sql = mysql.format(sql, [result[0]]);
            connection.query(sql, function (err, result2) {
                connection.end();
                if (err) {
                    return callback(err);
                }
                //actualizamos la linea del parte con la id de la lineas de factura acabada de crear
                connection = getConnection();
                sql = "UPDATE partes_lineas set facturaLineaId = ? WHERE parteLineaId = ?";
                sql = mysql.format(sql, [result2.insertId, lineaParteId]);
                connection.query(sql, function(err, result3) {
                    connection.end();
                    if(err) return callback(err);
                    // actualizar las bases y cuotas
                    fnActualizarBases(facturaId, function (err, res) {
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
// Modifica la cabecera de factura  desde un parte 
module.exports.putFacturaCabeceraDesdeParte = function (datos, callback) {
    var facturaId;
    var connection = getConnection();
    sql = "SELECT SUM(par.importe_cliente) AS totalAlCliente";
    sql += " FROM partes AS par";
    sql += " LEFT JOIN facturas AS fac ON fac.facturaId = par.facturaId";
    sql += " WHERE par.facturaId = ?";
    sql += " GROUP BY par.facturaId";
    sql = mysql.format(sql, [datos.facturaId]);
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
        sql = "UPDATE facturas SET ? WHERE facturaId = ?";
        sql = mysql.format(sql, [obj, datos.facturaId]);
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

// deleteFacturaParte
// Elimina el factura con el id pasado y actuliza los partes asociados
module.exports.deleteFacturaParte = function (id, factura, callback) {
    var connection = getConnection();
    if(factura.departamentoId == 7) {//Es de reparaciones así que actualizamos los partes asociados a la factura antes de borrar
                sql = "UPDATE partes set fecha_factura_cliente = NULL, numero_factura_cliente = NULL WHERE facturaId = ?";
                sql = mysql.format(sql, id);
                connection.query(sql, function (err, result) {
                    closeConnectionCallback(connection, callback);
                    if (err) {
                        return callback(err);
                    }
                    connection = getConnection();
                    sql = "DELETE from facturas WHERE facturaId = ?";
                    sql = mysql.format(sql, id);
                    connection.query(sql, function (err, result) {
                        closeConnectionCallback(connection, callback);
                        if (err) {
                            return callback(err);
                        }
                        callback(null);
                    });
                });


        /*sql = "SELECT facturaLineaId FROM facturas_lineas  WHERE facturaId = ?";//recuperamos las ids de las lineas asociadas a la factura
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            facturaLineas = result;
            async.eachSeries(facturaLineas, function (facturaLinea, callback2) {//borramos las lineas de facprove
                deleteUnaFacturaLineaConParte(facturaLinea.facturaLineaId, factura, function(err, done) {
                    if(err) return callback(err)
                    callback2();
                });
            },function(err) {
                if(err) return callback(err);//una vez borradas las lineas correspondientes de la factura borraos la factura de proveedor
                connection = getConnection();
                sql = "UPDATE partes set fecha_factura_cliente = NULL, numero_factura_cliente = NULL WHERE facturaId = ?";
                sql = mysql.format(sql, id);
                connection.query(sql, function (err, result) {
                    closeConnectionCallback(connection, callback);
                    if (err) {
                        return callback(err);
                    }
                    connection = getConnection();
                    sql = "DELETE from facturas WHERE facturaId = ?";
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
        sql = "DELETE from facturas WHERE facturaId = ?";
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


// getFacturaLinea
// Devuelve la línea de factura solcitada por su id.
module.exports.getFacturaLineaNuevo = async (id) => {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            conn = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM facturas_lineas as pfl";
            sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
            sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
            sql += " WHERE pfl.facturaLineaId = ?";
            sql = mysql2.format(sql, id);
            const [result] = await conn.query(sql);
            await conn.end();
            resolve(result);
        } catch(error) {
            if(conn) {
                if (!conn.connection._closing) {
					await conn.end();
                } 
            }
            reject (error);
        }
    });
    
}
// getFacturas
// lee todos los registros de la tabla facturas que no estén facturadosy
// los devuelve como una lista de objetos
module.exports.getFacturasDocumentacion = async (empresaId, ano) => {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            conn = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT ";
            sql += " CONCAT('facturas/', COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(LPAD(f.numero, 6, '0') AS CHAR(50)),' '), '.pdf') AS vFact";
            sql += " FROM facturas AS pf";
            sql += " LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
            sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
            sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
            sql += " WHERE pf.empresaId = ? AND pf.ano = ?";
            sql += " ORDER BY pf.serie, pf.fecha, pf.numero ASC";
            sql = mysql2.format(sql, [empresaId, ano]);
            const [result] = await conn.query(sql);
            await conn.end();
            resolve(result);

        }catch(error) {
            if(conn) {
                if (!conn.connection._closing) {
					await conn.end();
                } 
            }
            reject (error);
        }
    });
   
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

// postFacturaLineaNuevo
// crear en la base de datos la linea de factura pasada
module.exports.postFacturaLineaNuevo = async (facturaLinea) => {
    let conn = undefined
    var sql = "";
    var id = null;
    return new Promise(async (resolve, reject) => {
        try {
            if (!comprobarFacturaLinea(facturaLinea)) {
                throw new Error("La linea de factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
            }
            conn = await mysql2.createConnection(obtenerConfiguracion());
            await conn.beginTransaction();
            facturaLinea.facturaLineaId = 0; // fuerza el uso de autoincremento
            //insertamos la linea
            sql = "INSERT INTO facturas_lineas SET ?";
            sql = mysql2.format(sql, facturaLinea);
            const [result] = await conn.query(sql);
            facturaLinea.facturaLineaId = result.insertId;
            id = facturaLinea.facturaId;
            // elimina las bases y cuotas de una factura
            // antes de actualizarlas
            sql = "DELETE FROM facturas_bases";
            sql += " WHERE facturaId = ?";
            sql = mysql2.format(sql, id);
            const [result2] = await conn.query(sql);
 
             //actulizamos las bases
             sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
             sql += " SELECT pl.facturaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
             sql += " FROM";
             sql += " (SELECT facturaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
             sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
             sql += " FROM facturas_lineas";
             sql += " WHERE facturaId = ?";
             sql += " GROUP BY tipoIvaId) AS pl";
             sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
             sql = mysql2.format(sql, id);
             const [result3] = await conn.query(sql);
 
            //actulizamos los totales de la cabecera
            sql = "UPDATE facturas AS pf,";
            sql += " (SELECT facturaId, SUM(base) AS b, SUM(cuota) AS c";
            sql += " FROM facturas_bases GROUP BY 1) AS pf2,";
            sql += " (SELECT facturaId, SUM(coste) AS sc";
            sql += " FROM facturas_lineas GROUP BY 1) AS pf3";
            sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
            sql += " pf.coste = pf3.sc,";
            sql += ' pf.restoCobrar = pf2.b + pf2.c - pf.importeAnticipo';
            sql += " WHERE pf.facturaId = ?";
            sql += " AND pf2.facturaId = pf.facturaId";
            sql += " AND pf3.facturaId = pf.facturaId";
            sql = mysql2.format(sql, id);
            const [result4] = await conn.query(sql);
 
            await conn.commit();
            await conn.end();
            resolve(facturaLinea);

        } catch (error) {
            if(conn) {
                if (!conn.connection._closing) {
                    await conn.rollback();
					await conn.end();
                } 
            }
            reject (error);
        }
    });
}



// putFacturaLinea
// Modifica la linea de factura según los datos del objeto pasado
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

// putFacturaLineaNuevo
// Modifica la linea de factura según los datos del objeto pasado
module.exports.putFacturaLineaNuevo = async (id, facturaLinea) => {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            if (!comprobarFacturaLinea(facturaLinea)) {
                throw new Error("La linea de factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
            }
            if (id != facturaLinea.facturaLineaId) {
                throw new Error("El ID del objeto y de la url no coinciden");
            }
            conn = await mysql2.createConnection(obtenerConfiguracion());
            await conn.beginTransaction();
            //actualizamos la linea
            sql = "UPDATE facturas_lineas SET ? WHERE facturaLineaId = ?";
            sql = mysql.format(sql, [facturaLinea, facturaLinea.facturaLineaId]);
            const [result] = await conn.query(sql);
            id = facturaLinea.facturaId;
            // elimina las bases y cuotas de una factura
            // antes de actualizarlas
            sql = "DELETE FROM facturas_bases";
            sql += " WHERE facturaId = ?";
            sql = mysql2.format(sql, id);
            const [result2] = await conn.query(sql);
 
             //actulizamos las bases
             sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
             sql += " SELECT pl.facturaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
             sql += " FROM";
             sql += " (SELECT facturaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
             sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
             sql += " FROM facturas_lineas";
             sql += " WHERE facturaId = ?";
             sql += " GROUP BY tipoIvaId) AS pl";
             sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
             sql = mysql2.format(sql, id);
             const [result3] = await conn.query(sql);
 
            //actulizamos los totales de la cabecera
            sql = "UPDATE facturas AS pf,";
            sql += " (SELECT facturaId, SUM(base) AS b, SUM(cuota) AS c";
            sql += " FROM facturas_bases GROUP BY 1) AS pf2,";
            sql += " (SELECT facturaId, SUM(coste) AS sc";
            sql += " FROM facturas_lineas GROUP BY 1) AS pf3";
            sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
            sql += " pf.coste = pf3.sc,";
            sql += ' pf.restoCobrar = pf2.b + pf2.c - pf.importeAnticipo';
            sql += " WHERE pf.facturaId = ?";
            sql += " AND pf2.facturaId = pf.facturaId";
            sql += " AND pf3.facturaId = pf.facturaId";
            sql = mysql2.format(sql, id);
            const [result4] = await conn.query(sql);
 
            await conn.commit();
            await conn.end();
            resolve(facturaLinea);

        } catch (error) {
            if(conn) {
                if (!conn.connection._closing) {
                    await conn.rollback();
					await conn.end();
                } 
            }
            reject (error);
        }
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

// deleteFacturaLinea
// Elimina la linea de factura con el id pasado
module.exports.deleteFacturaLineaNuevo = async (id, facturaLinea) => {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            conn = await mysql2.createConnection(obtenerConfiguracion());
            await conn.beginTransaction();
            //borramos la linea
            sql = "DELETE from facturas_lineas WHERE facturaLineaId = ?";
            sql = mysql.format(sql, id);
            const [result] = await conn.query(sql);
            id = facturaLinea.facturaId;
            // elimina las bases y cuotas de una factura
            // antes de actualizarlas
            sql = "DELETE FROM facturas_bases";
            sql += " WHERE facturaId = ?";
            sql = mysql2.format(sql, id);
            const [result2] = await conn.query(sql);
 
             //actulizamos las bases
             sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
             sql += " SELECT pl.facturaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
             sql += " FROM";
             sql += " (SELECT facturaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
             sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
             sql += " FROM facturas_lineas";
             sql += " WHERE facturaId = ?";
             sql += " GROUP BY tipoIvaId) AS pl";
             sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
             sql = mysql2.format(sql, id);
             const [result3] = await conn.query(sql);
 
            //actulizamos los totales de la cabecera
            sql = "UPDATE facturas AS pf,";
            sql += " (SELECT facturaId, SUM(base) AS b, SUM(cuota) AS c";
            sql += " FROM facturas_bases GROUP BY 1) AS pf2,";
            sql += " (SELECT facturaId, SUM(coste) AS sc";
            sql += " FROM facturas_lineas GROUP BY 1) AS pf3";
            sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
            sql += " pf.coste = pf3.sc,";
            sql += ' pf.restoCobrar = pf2.b + pf2.c - pf.importeAnticipo';
            sql += " WHERE pf.facturaId = ?";
            sql += " AND pf2.facturaId = pf.facturaId";
            sql += " AND pf3.facturaId = pf.facturaId";
            sql = mysql2.format(sql, id);
            const [result4] = await conn.query(sql);
 
            await conn.commit();
            await conn.end();
            resolve(facturaLinea);

        } catch (error) {
            if(conn) {
                if (!conn.connection._closing) {
                    await conn.rollback();
					await conn.end();
                } 
            }
            reject (error);
        }
    });
}

module.exports.deleteFacturaLineaConParte = function (id, facturaLinea, callback) {
    deleteUnaFacturaLineaConParte(id, facturaLinea, function(err, done) {
        if(err) return callback(err)
        callback(null);
    });
}

// deleteFacturaLineaConParte
// elimina un factura de la base de datos y su correspondiente factura de proveedor, si existe
var deleteUnaFacturaLineaConParte = function (id, facturaLinea, callback) {
    var articuloId;
    var parteId;
    var facproveIds = [];
    var facproveId;
    var facproveLineaId;
    var connection = getConnection();
        sql = "SELECT DISTINCT facproveId FROM partes  WHERE facturaId = ? AND facturaId IS NOT NULL";//primero recuperamos las ids de las facturas de proveedores de los partes, si las tiene
        sql = mysql.format(sql, facturaLinea.facturaId);
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
                sql = "SELECT fl.articuloId,ar.codigoReparacion, fl.totalLinea, fl.facturaId, par.parteId";//si hay facturas de proveedores recuperamosel codigo de reparacion del artiulo
                sql += " FROM facturas_lineas AS fl";
                sql += " LEFT JOIN articulos AS ar ON ar.articuloId = fl.articuloId";
                sql += " LEFT JOIN partes AS par ON par.facturaId = fl.facturaId";
                sql += " LEFT JOIN partes_lineas AS pl ON pl.parteId = par.parteId"              
                sql += " WHERE fl.facturaId = ? AND fl.facturaLineaId = ? AND pl.`importeCliente` = fl.totalLinea"
                sql = mysql.format(sql, [facturaLinea.facturaId, id]);
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
                    sql = "SELECT facproveLineaId, fl.facproveId FROM facprove_lineas AS fl";//recuperamos la linea del la factura de proveedor que queremos borrar
                    sql += " LEFT JOIN partes AS par ON par.facproveId = fl.facproveId";
                    sql += " WHERE  articuloId = ? AND fl.facproveId IN (?) AND par.parteId = ?"
                    sql = mysql.format(sql, [articuloId, facproveIds, parteId]);
                    connection.query(sql, function (err, result) {
                        closeConnectionCallback(connection, callback);
                        if (err) {
                            return callback(err);
                        }
                        if(result.length > 0) {//si existe la linea en la factura de proveedor
                            facproveLineaId = result[0].facproveLineaId;
                            facproveId = result[0].facproveId;
                            //borramos la linea
                        connection = getConnection();
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
                                                        sql2 = " DELETE FROM facprove where facproveId = ?"
                                                        sql2 = mysql.format(sql2, facproveId)
                                                        connection.query(sql2, function (err, result) { 
                                                            closeConnectionCallback(connection, callback);
                                                            if(err) return callback(err);
                                                            callback(null)
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
                        } else {//si no existe la linbea de facprove correspondiente solo boramos la de la factura
                            connection = getConnection();
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
                    });
                });

            } else {
                connection = getConnection();
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
        });
}

// fnActualizarBases
// Actuliza la tabla de bases y cuotas de la factura pasada
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
// Actuliza la tabla de Retenciones y cuotas de la factura pasada
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
// Actuliza los campos de totales de la cabecera de factura de proveedores
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
// elimina las retenciones de una factura de proveedor
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
// elimina las bases y cuotas de una factura de proveedor
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
        con.end();
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
            /* var porcentajeDelCoste = linea.coste / linea.costeFacturaCompleta;
            var importeDelNuevoCoste = coste * porcentajeDelCoste;
            linea.coste = importeDelNuevoCoste; */
            // Recalculamos el total de la línea en base a los nuevos datos
            linea.totalLinea = obtenerImporteAlClienteDesdeCoste(linea.coste , porcentajeBeneficio, porcentajeAgente, tipoClienteId);
            linea.porcentajeBeneficio = porcentajeBeneficio;
            linea.porcentajeAgente = porcentajeAgente;
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costeFacturaCompleta;
            // Actualizamos la línea lo que actualizará de paso la factura
            exports.putFacturaLinea(linea.facturaLineaId, linea, function (err, result) {
                if (err) return callback(err);
                ActulizaPorcentajesCalculadora(porcentajeBeneficio, porcentajeAgente, facturaId, function(err, result) {
                    if(err) return callback(err);
                    callback(null);
                });
            })
        }, function (err) {
            if (err) return done(err);
            done(null);
        });
    });

}

// recalculo de línea de prefactura
module.exports.recalculoLineasfacturaLineal = function (facturaId, porcentajeAgente, tipoClienteId, done) {
    var con = getConnection();
    // Buscamos la líneas de la prefactura
    sql = " SELECT pf.coste as costeFacturaCompleta, pfl.*";
    sql += " FROM facturas as pf";
    sql += " LEFT JOIN facturas_lineas as pfl ON pfl.facturaId = pf.facturaId";
    sql += " WHERE pf.facturaId = ?";
    sql = mysql.format(sql, facturaId);
    con.query(sql, function (err, lineas) {
        con.end();
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            linea.porcentajeAgente = porcentajeAgente;
            // Recalculamos el total de la línea en base a los nuevos datos
            var obj = obtenerImporteAlClienteDesdeCosteLineal(linea, porcentajeAgente, tipoClienteId);
            linea.totalLinea = obj.totalLinea;
            linea.importeAgenteLinea = obj.importeAgenteLinea;
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costeFacturaCompleta;
            // Actualizamos la línea lo que actualizará de paso la prefactura
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

var ActulizaPorcentajesCalculadora = function(porcentajeBeneficio, porcentajeAgente, facturaId, callback) {
    var connection = getConnection();
    sql = "UPDATE facturas SET porcentajeBeneficio = ?, porcentajeAgente = ? WHERE facturaId = ?";
    sql = mysql.format(sql, [porcentajeBeneficio, porcentajeAgente, facturaId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, 'OK');
    });
}
var obtenerImporteAlClienteDesdeCoste = function (coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId) {
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeAlCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (porcentajeBeneficio) {
            importeBeneficio = porcentajeBeneficio * coste / 100;
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

var obtenerImporteAlClienteDesdeCosteLineal = function (linea, porcentajeAgente, tipoClienteId) {
    var totalLinea = 0;
    var importeAgenteLinea = 0;
   
    if (porcentajeAgente) {
        //vm.importeCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100)));
        totalLinea = roundToTwo(linea.ventaNetaLinea / ((100 - porcentajeAgente) / 100));
        //coste = roundToTwo((linea.ventaNetaLinea / ((100 - porcentajeAgente) / 100))/linea.cantidad);
        //importe = roundToTwo((linea.ventaNetaLinea / ((100 - porcentajeAgente) / 100))/linea.cantidad);
        importeAgenteLinea = roundToTwo(totalLinea - linea.ventaNetaLinea);
        if (tipoClienteId == 1){
            // es un mantenedor
            totalLinea = roundToTwo(totalLinea - linea.ventaNetaLinea + linea.importeBeneficioLinea);
        }
    }
    var obj = {
        totalLinea: totalLinea,
        importeAgenteLinea: importeAgenteLinea
    }
    return obj;
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
    sql += " pf.coste = pf3.sc,";
    sql += ' pf.restoCobrar = pf2.b + pf2.c - pf.importeAnticipo';
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
            fnComprobarOrdenCorrecto(factura.empresaId, factura.serie, factura.ano, factura.fecha, function (err, res) {
                if (err) return done(err);
                done(null, factura);
            }, con);
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
module.exports.postCrearFactCliDesdeParte = function (seleccionados, deFecha, aFecha, fechaFactura, done) {
    var con = getConnection();
    var numFact;
    var partesActualiza = [];
    var lineasFactura;
   
    var sql =""
    var partes = [];
    var porSeparado;
    var parteId;
    var fechaFacturaAno;
    var parId = [];
    var contador = 0;//contador del numero de anticipo
    var clientesErroneos = [];
 

    deFecha = moment(deFecha, 'DD.MM.YYYY').format('DD/MM/YYYY');
    aFecha = moment(aFecha, 'DD.MM.YYYY HH:mm').format('DD/MM/YYYY');
    if(fechaFactura != "") {
        fechaFactura =  moment(fechaFactura, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD');
        fechaFacturaAno =  moment(fechaFactura, 'YYYY-MM-DD').format('YYYY');
    } else {
        fechaFactura = new Date();
        fechaFacturaAno =  moment(fechaFactura, 'YYYY-MM-DD').format('YYYY');
    }
    var periodo = deFecha + "-" + aFecha;
    
    for (var i= 0; i< seleccionados.length; i++) {
        partes.push(seleccionados[i].parteId);
    }
    //OBTENEMOS LAS CABECERAS de las facturas que no tienen seleccionada la casilla de factura propia y de las que si la tienene
    sql = "(SELECT '"+fechaFacturaAno+"' AS ano, '"+fechaFactura+"' AS fecha, ser.clienteId, '"+ periodo +"' AS periodo,  par.parteId, par.factPropiaCli,";
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
    sql += " (SELECT '"+fechaFacturaAno+"' AS ano, '"+fechaFactura+"' AS fecha, ser.clienteId, '"+ periodo +"' AS periodo,  par.parteId, par.factPropiaCli,";
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
        cabFacturas = res;
        con.beginTransaction(function (err) {// Transaccion general que protege todo el proceso
            if (err) return done(err);
            //antes de nada comprobamos que los clientes de las facturas tengan los campos obligatorios de facturación
            for(var i = 0; i < cabFacturas.length; i++) {
                if( (!cabFacturas[i].receptorDireccion || cabFacturas[i].receptorDireccion == '') || 
                                (!cabFacturas[i].receptorCodPostal || cabFacturas[i].receptorCodPostal == '') ||
                                (!cabFacturas[i].receptorPoblacion || cabFacturas[i].receptorPoblacion == '') || 
                                (!cabFacturas[i].receptorProvincia || cabFacturas[i].receptorProvincia == '') ||
                                (!cabFacturas[i].receptorNombre || cabFacturas[i].receptorNombre == '') ) 
                                {
                                    
                                    var obj = {
                                        nombre: cabFacturas[i].receptorNombre,
                                        DNI: cabFacturas[i].receptorNif
                                    }
                                    clientesErroneos.push(obj);
                                }
            }
           
                async.eachSeries(cabFacturas, function (sel, callback2) {
                    porSeparado = sel.factPropiaCli;
                    parteId = sel.parteId;
                    var lineaFactura = {
                        parteLineaId: 0,
                        facturaLineaId:0,
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
                            // obtener el número de factura que le corresponde
                            fnGetNumeroFacturaTrans(sel, con, function (err, res) {
                                if (err) return callback(err);
                                factura = res;
                                sel.serie = sel.serie;
                                numFact = sel.serie +'-'+ sel.ano+'-'+ sel.numero;
                                callback(null);
                            }, con);
                        },
                        function (callback) {
                           //SE CREA LA CABECERA DE LA FACTURA
                           sel.facturaId = 0//forzamos el autoincremento
                           //borramos los campos adicioneles
                           delete sel.factPropiaCli;
                           delete sel.parteId;
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
                                        facturaLineaId:0,
                                    };
                                    parId.push(l.parteId); //guardamos las ids de los partes implicados en esta factura
                                    delete l.parteId; //borramos la propiedad para que no de error al crear la linea
                                    lineaFactura.parteLineaId = l.parteLineaId
                                    lineasObj.push(lineaFactura); //guardanmos las ids de partelineaId y facproveLineaId para actualizar la linea del parte mas adelante
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
                            var cont = 0;
                           async.eachSeries(lineasFactura, function (f, done2) {
                            var id = f.parteLineaId //guardamos la propiedad
                            //var anticipo = f.anticipo;//guardamos la propiedad
                            //delete f.anticipo;//borramos la propiedad ya que no nos hace falta para crear la linea de factura
                            delete f.parteLineaId //borramos la propiedad ya que no nos hace falta para crear la linea de factura
                            var sql2 = "INSERT INTO facturas_lineas SET ?"
                            sql2 = mysql.format(sql2, f);
                                con.query(sql2, function(err, res) {
                                    if (err) return done2(err);
                                    f.facturaLineaId = res.insertId;
                                    f.parteLineaId = id // recuperamos la id del la linea del parte que nos servirá para los anticipos
                                    //f.anticipo = anticipo // recuperomos el anticipo del la linea del parte que nos servirá para los anticipos
                                    lineasObj[cont].facturaLineaId = f.facturaLineaId; //guardanmos las ids de partelineaId y facturaLineaId para actualizar la linea del parte mas adelante
                                    cont++;
                                    done2(null);
    
                                });
                            },function (err) {
                                if (err) return callback(err);
                                callback(null);
                            });
                        },
                        function(callback) {//SE INSERTAN LAS BASES DE LA FACTURA
                            var sql = "INSERT INTO facturas_bases (facturaId, tipoIvaId, porcentaje, base, cuota)";
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
                         function (callback) {//SE ACTUALIZAN LOS TOTALES DE LA CABECERA
                            var sql = "UPDATE facturas AS pf,";
                            sql += " (SELECT facturaId, SUM(base) AS b, SUM(cuota) AS c";
                            sql += " FROM facturas_bases GROUP BY 1) AS pf2,";
                            sql += " (SELECT facturaId, SUM(coste) AS sc";
                            sql += " FROM facturas_lineas GROUP BY 1) AS pf3";
                            sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
                            sql += " pf.coste = pf3.sc,";
                            sql += ' pf.restoCobrar = pf2.b + pf2.c - pf.importeAnticipo';
                            sql += " WHERE pf.facturaId = ?";
                            sql += " AND pf2.facturaId = pf.facturaId";
                            sql += " AND pf3.facturaId = pf.facturaId";
                            sql = mysql.format(sql, sel.facturaId);
                            con.query(sql, function (err, res) {
                                if (err) return callback(err);
                                callback(null);
                            });
                        },
                        function(callback) {
                            //se vinculan anticipos ya creados
                            //se obtienen las ids de los servicios que pertenecen a los partes de la factura
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
                                                    facturaAntclienId: 0,
                                                    antClienId: a.antClienId,
                                                    facturaId: sel.facturaId
                                                }
                                                var sql3 = "INSERT INTO factura_antcliens SET ?"
                                                sql3 = mysql.format(sql3, obj);
                                                con.query(sql3, function (err, res) {
                                                    if (err) return done3(err);
                                                    //actualizamos la factura a la que le hemos vinculado el anticipo 
                                                    var sql4 = "UPDATE facturas SET";
                                                    sql4 += " importeAnticipo = (SELECT tmp2.suma FROM (SELECT importeAnticipo+? AS suma FROM facturas WHERE facturaId = ?) AS tmp2),";
                                                    sql4 += " restoCobrar = (SELECT tmp.resta FROM (SELECT restoCobrar-? AS resta FROM facturas WHERE facturaId = ?) AS tmp)";
                                                    sql4 += " WHERE facturaId = ?";                                             
                                                    sql4 = mysql.format(sql4, [a.totalConIva, sel.facturaId, a.totalConIva, sel.facturaId, sel.facturaId]);
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
                        function(callback) {//ACTUALIZAMOS EL PARTE CON EL NUMERO E ID DE LA FACTURA CORRESPONDIENTE 
                            async.eachSeries(partesActualiza, function (f, done3) {
                                var sql3 = "UPDATE partes SET numero_factura_cliente = ?, fecha_factura_cliente = ?, facturaId = ? WHERE parteId = ?"
                                sql3 = mysql.format(sql3, [numFact, fechaFactura, sel.facturaId, f.parteId]);
                                    con.query(sql3, function(err, res) {
                                        if (err) return done3(err);
                                        done3(null);
        
                                    });
                                },function (err) {
                                    if (err) return callback(err);
                                    callback(null);
                                });
                        },
                        function (callback) {//ACTUALIZAMOS LAS LINEAS DEL PARTE CON LAS IDS DE LAS LINEAS DE FACTURA  CORRESPONDIENTE 
                            //SE CREAN LAS lINEAS DE LA FACTURA
                           async.eachSeries(lineasObj, function (f, done2) {
                            var sql2 = "UPDATE partes_lineas SET facturaLineaId = ? WHERE parteLineaId = ? "
                            sql2 = mysql.format(sql2, [ f.facturaLineaId, f.parteLineaId]);
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





var fnGetNumeroFacturaTrans = function (factura, con, done) {
    // hay que obtener de la empresa la serie
    var sql = "SELECT es.*, emp.serieFacR FROM empresas as emp";
    sql += " LEFT JOIN empresas_series AS es ON es.empresaId = emp.empresaId";
    sql += " WHERE emp.empresaId = ?";
    sql = mysql.format(sql, factura.empresaId);
    con.query(sql, function (err, res) {
        if (err) return done(err);
        if (res.length == 0) return done(new Error('Empresa no encontrada'));
        // con el año y la serie hay que obtener el número
        var ano = moment(factura.fecha).year();
        var serie;
        for(var i=0; i < res.length; i++) {
            if (res[i].tipoProyectoId) {
                if(factura.tipoProyectoId == res[i].tipoProyectoId) {
                    if(res[i].serie_factura && res[i].serie_factura != '') {
                        if(res[i].serie_factura && res[i].serie_factura != '') {
                            serie = res[i].serie_factura;
                            break;
                        }
                    }
                }
            } 
            if(res[i].departamentoId) {
                if(factura.departamentoId == res[i].departamentoId) {
                    if(res[i].serie_factura && res[i].serie_factura != '') {
                        if(res[i].serie_factura && res[i].serie_factura != '') {
                            serie = res[i].serie_factura;
                            break;
                        }
                    }
                }
            }
        }
        if(factura.total < 0) {
            serie = res[0].serieFacR;
        }

        if (!serie || serie == '') return done(new Error('No existe una serie de facturación para esta empresa'));
        fnComprobarOrdenCorrecto(factura.empresaId, serie, ano, factura.fecha, function (err, res) {
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
var fnComprobarOrdenCorrecto = function (empresaId, serie, ano, fecha, done, con) {
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
module.exports.getFacPdf = function (dFecha, hFecha, empresaId, clienteId, departamentoId, callback) {
    var con = null;
    con = getConnection();
    var facturas = null;
    var finalizado = 0;
    //RECUPERAMOS PRIMERO LOS PARAMETROS
    parametrosDb.getParametros(function(err, parametros) {
        if (err) return callback(err);
        var p = parametros[0];
        sql = "SELECT f.facturaId, f.serie, f.ano, f.numero, f.fecha, e.nombre,  e.infFacturas, e.infFacCliRep, e.infFacCliObr, e.infFacCliAlq,";
    sql += " CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0'), '_', f.empresaId) AS nomfich, f.departamentoId";
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
    if (departamentoId != 0) {
        sql += " AND f.departamentoId = " + departamentoId;
    }
    if (dFecha) {
        sql += " AND f.fecha >= '" + dFecha + " 00:00:00'";
    }
    if (hFecha) {
        sql += " AND f.fecha <= '" + hFecha + " 23:59:59'";
    }
   
    Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    con.query(sql, function (err, result) {
        //con.end();
        if (err) {
            if(con) con.end()
            return callback(err, null);
        }
        facturas = result;

        //AWS
        AWS.config.region = p.bucket_region_server;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId:  p.identity_pool_server,
        });
        
        async.forEachSeries(facturas, function (f, done1) {
            crearObjJson(f, function(err, obj) {
                if (err) {
                    if(con) con.end()
                    return callback(err, null);
                }
                var report = new Stimulsoft.Report.StiReport();
                if(f.departamentoId == 7) {
                    file = process.env.REPORTS_DIR + "\\" + f.infFacCliRep + "_json.mrt";
                }else if (f.departamentoId == 8) {
                    file = process.env.REPORTS_DIR + "\\" + f.infFacCliObr + "_json.mrt";
                } else if (f.departamentoId == 3) {
                    file = process.env.REPORTS_DIR + "\\" + f.infFacCliAlq + "_json.mrt";
                } else {
                    file = process.env.REPORTS_DIR + "\\" + f.infFacturas + "_json.mrt";
                }
                report.loadFile(file);
                
                var dataSet = new Stimulsoft.System.Data.DataSet("liq_ant");
                dataSet.readJson(obj);
                        
                // Remove all connections from the report template
                report.dictionary.databases.clear();
                 //
                 report.regData(dataSet.dataSetName, "", dataSet);
                 report.dictionary.synchronize();
                    
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
    
                    var buffer = new Buffer.from(data, "utf-8");
    
                    //fs.writeFileSync(process.env.FACTURA_DIR + "\\" + f.nomfich + ".pdf", buffer);
                    if(finalizado == 0) { 
                            //src = process.env.FACTURA_DIR + "\\" + f.nomfich + ".pdf";
                            var fileKey =  "facturas/" + f.nomfich + ".pdf";
                            //const fileContent = fs.readFileSync(src);
                            
                        var params = {
                            Bucket: p.bucket_server,
                            Key: fileKey,
                            Body: buffer,
                            ACL: "public-read",
                            ContentType: 'application/pdf'
                        }
                        // Use S3 ManagedUpload class as it supports multipart uploads
                        var upload = new AWS.S3.ManagedUpload({
                            params: params
                        });
                        var promise = upload.promise();
                        promise
                        .then (
                            data => {
                                if(data) {
                                    sql = "UPDATE facturas SET nombreFacturaPdf = '" + f.nomfich + ".pdf'";
                                    sql += " WHERE facturaId = " + f.facturaId;
                                    con.query(sql, function (err, result) {
                                        if (err) {
                                            if(con) con.end();
                                            return callback(err, null);
                                        }
                                        done1();
                                    });
                                }
                                
                            },
                            err =>{
                            if(con) con.end();
                             return callback(err);
                            }
                        );
                    } else {
                        return;
                    }
                });
            });
        }, function (err) {
            if(con) con.end();
            if (err) return callback(err);
            finalizado = 1;
            callback(null);
        })
    });
    });
}

//DECODIFICAR FOTOS
module.exports.decodeData = (b64, callback) => {
	//pasamos el objeto de base64 a blob
	var src = ""
	try {
		
		
		let data = b64.datos;

		let buff = new Buffer.from(data, 'base64');
		//fs.writeFileSync('stack-abuse-logo-out.png', buff);

		
		fs.writeFileSync(process.env.FACTURA_DIR + "\\" + b64.nombre , buff);

		
		
		} catch(err) {
			console.log(err);
			return callback(err);
		}
}


//-------------------------------
module.exports.getFacVisior = function (dFecha, hFecha, facturaId, empresaId, clienteId, agenteId, departamentoId, callback) {
    var con = getConnection();
    var facturas = null;
    var finalizado = 0;
    var objs = []
    sql = "SELECT f.facturaId, f.serie, f.ano, f.numero, f.fecha, e.nombre, e.infFacturas,";
    sql += " CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId";
    sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = f.contratoId";
    // -- modificar sql según parámetros
    sql += " WHERE TRUE"
    if (facturaId) {
        sql += " AND f.facturaId IN (" + facturaId + ")";
    } else {
        if (clienteId) {
            sql += " AND f.clienteId IN (" + clienteId + ")";
        }
        if (empresaId) {
            sql += " AND f.empresaId IN (" + empresaId + ")";
        }
        if(agenteId) {
            sql += " AND cnt.agenteId IN (" + agenteId + ")";
        }
        if (dFecha) {
            sql += " AND f.fecha >= '" + dFecha + " 00:00:00'";
        }
        if (hFecha) {
            sql += " AND f.fecha <= '" + hFecha + " 23:59:59'";
        }
        if(departamentoId && departamentoId > 0) {
            sql += " AND f.departamentoId =" + departamentoId;
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario.usuarioId+")"
        }

    }
    con.query(sql, function (err, result) {
        con.end();
        if (err) return callback(err, null);
        facturas = result;
        async.forEachSeries(facturas, function (f, done1) {
            crearObjJsonVisor(f, function(err, obj) {
                if (err) return callback(err, null);    
                objs.push(obj); 
                done1();               
            });
        }, function (err) {
            if (err) return callback(err);
             
             var resultado = {
                 data: objs
             }
          /*    var resul = JSON.stringify(resultado);
        fs.writeFile(process.env.REPORTS_DIR + "\\facturaArray.json", resul, function(err) {
            if(err) return callback(err);
            //return callback(null, true);
        }); */
        
            callback(null, objs);
        })
    });
}
//METODOS DE FACTURAS POR DEPARTAMENTOL DE USUARIO

module.exports.getFacturasUsuario = async function (usuarioId, departamentoId, dFecha, hFecha, empresaId, callback) {
    const connection = getConnection();
    try {
        // Construcción de la consulta SQL
        let sql = `
            SELECT 
                pf.*, 
                0 AS agenteId, 
                '' AS nombreAgente,
                CONCAT(
                    COALESCE(pf.ano, ' '), '-',
                    COALESCE(CAST(pf.serie AS CHAR(50)), ' '), '-',
                    COALESCE(CAST(pf.numero AS CHAR(50)), ' ')
                ) AS vNum,
                CONCAT(
                    COALESCE(f.serie, ' '), '-',
                    COALESCE(CAST(f.ano AS CHAR(50)), ' '), '-',
                    COALESCE(CAST(f.numero AS CHAR(50)), ' ')
                ) AS vFac,
                fp.nombre AS vFPago, 
                cm.referencia, 
                c.direccion2 AS dirTrabajo
            FROM facturas AS pf
            LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId
            LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId
            LEFT JOIN contratos AS cm ON cm.contratoId = pf.contratoId
            LEFT JOIN departamentos AS dp ON dp.departamentoId = cm.tipoContratoId
            LEFT JOIN clientes AS c ON c.clienteId = cm.clienteId
            WHERE pf.contafich IS NULL 
                AND pf.contabilizada = 0 
                AND pf.fecha >= ?
        `;

        // Agregar filtros condicionales
        const params = [dFecha];
        if (hFecha && hFecha !== 'null') {
            sql += " AND pf.fecha <= ?";
            params.push(hFecha);
        }
        if (departamentoId > 0) {
            sql += " AND pf.departamentoId = ?";
            params.push(departamentoId);
        } else {
            sql += `
                AND pf.departamentoId IN (
                    SELECT departamentoId 
                    FROM usuarios_departamentos 
                    WHERE usuarioId = ?
                )
            `;
            params.push(usuarioId);
        }
        if (empresaId > 0) {
            sql += " AND pf.empresaId = ?";
            params.push(empresaId);
        }

        sql += `
            ORDER BY 
                pf.fecha DESC, 
                pf.numero ASC, 
                f.receptorNombre ASC
        `;

        // Ejecutar la consulta
        const facturas = await new Promise((resolve, reject) => {
            connection.query(sql, params, (err, result) => {
                if (err) return reject(err);
                resolve(
                    result.map(pf => ({
                        ...pf,
                        vNum: `${pf.serie}-${pf.ano}-${pf.numero.toString().padStart(6, "0")}`,
                    }))
                );
            });
        });

        // Procesar las facturas con asignaAgenteFactura
        const facturasConAgente = await asignaAgenteFactura(facturas);

        // Devolver el resultado
        callback(null, facturasConAgente);
    } catch (err) {
        // Manejo de errores
        callback(err, null);
    } finally {
        // Cerrar conexión a la base de datos
        if (connection) connection.end();
    }
};


const asignaAgenteFactura = async (facturas) => {
    const con = getConnection();
    try {
        // Procesa cada factura individualmente
        for (const f of facturas) {
            let sql;
            if (f.departamentoId == 7) {
                sql = "SELECT";
                sql += " ca.comercialId AS histComercialId,";
                sql += " c2.nombre AS nombrehistComercial,";
                sql += " ca.fechaCambio AS fechaCambio, f.facturaId,";
                sql += " f.fecha AS fecha,";
                sql += " co.comercialId AS agenteId,";
                sql += " co.nombre AS nombreAgente";
                sql += " FROM facturas AS f";
                sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
                sql += " LEFT JOIN clientes_agentes AS ca ON ca.clienteId = c.clienteId";
                sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = ca.comercialId";
                sql += " LEFT JOIN comerciales AS co ON co.comercialId = c.comercialId";
                sql += " WHERE f.facturaId = ?";
                sql += " ORDER BY ca.comercialId, ca.fechaCambio ASC";
                sql = mysql.format(sql, f.facturaId);
            } else {
                sql = " SELECT ";
                sql += " ca.comercialId AS histComercialId,";
                sql += " c2.nombre AS nombrehistComercial,";
                sql += " ca.fechaCambio AS fechaCambio, f.facturaId,";
                sql += " f.fecha AS fecha,";
                sql += " cm.agenteId AS agenteId,";
                sql += " c.nombre AS nombreAgente";
                sql += " FROM facturas AS f";
                sql += " LEFT JOIN contratos AS cm ON cm.contratoId = f.contratoId";
                sql += " LEFT JOIN comerciales AS c ON c.comercialId = cm.agenteId";
                sql += " LEFT JOIN clientes_agentes AS ca ON ca.clienteId = cm.clienteId";
                sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = ca.comercialId";
                sql += " WHERE f.facturaId = ?";
                sql += " ORDER BY ca.comercialId, ca.fechaCambio ASC";
                sql = mysql.format(sql, f.facturaId);
            }

            // Ejecuta la consulta para la factura actual
            const results = await new Promise((resolve, reject) => {
                con.query(sql, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

            // Procesa los resultados obtenidos para la factura actual
            const histAgentes = results.map(r => ({
                histComercialId: r.histComercialId,
                fechaCambio: r.fechaCambio,
                nombrehistComercial: r.nombrehistComercial,
            }));

            const matchingAgent = histAgentes.find(h => f.fecha <= h.fechaCambio) || results[0];
            if (matchingAgent) {
                f.agenteId = matchingAgent.histComercialId || matchingAgent.agenteId;
                f.nombreAgente = matchingAgent.nombrehistComercial || matchingAgent.nombreAgente;
            } else {
                f.agenteId = 0;
                f.nombreAgente = "";
            }

            f.histAgentes = histAgentes; // Asigna el historial completo a la factura
        }

        return facturas; // Retorna las facturas procesadas
    } catch (err) {
        throw err; // Propaga el error
    } finally {
        if (con) con.end(); // Cierra la conexión
    }
};


// getFacturasAllUsuario
// lee todos los registros de la tabla facturas y
// los devuelve como una lista de objetos
module.exports.getFacturasAllUsuario = async function (
    usuarioId,
    departamentoId,
    dFecha,
    hFecha,
    empresaId,
    callback
) {
    const connection = getConnection();
    try {
        // Construcción de la consulta SQL
        let sql = `
            SELECT
                pf.facturaId,
                pf.emisorNombre,
                pf.receptorNombre,
                pf.fecha,
                pf.total,
                pf.totalConIva,
                pf.observaciones,
                pf.numero,
                pf.serie,
                pf.ano,
                0 AS agenteId,
                '' AS nombreAgente,
                CONCAT(COALESCE(pf.ano, ' '), '-', COALESCE(CAST(pf.serie AS CHAR(50)), ' '), '-', COALESCE(CAST(pf.numero AS CHAR(50)), ' ')) AS vNum,
                CONCAT(COALESCE(f.serie, ' '), '-', COALESCE(CAST(f.ano AS CHAR(50)), ' '), '-', COALESCE(CAST(f.numero AS CHAR(50)), ' ')) AS vFac,
                fp.nombre AS vFPago,
                cm.referencia,
                c.direccion2 AS dirTrabajo
            FROM facturas AS pf
            LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId
            LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId
            LEFT JOIN contratos AS cm ON cm.contratoId = pf.contratoId
            LEFT JOIN departamentos AS dp ON dp.departamentoId = cm.tipoContratoId
            LEFT JOIN clientes AS c ON c.clienteId = cm.clienteId
        `;

        if (departamentoId > 0) {
            sql += `
                WHERE pf.departamentoId = ${departamentoId} AND pf.fecha >= '${dFecha}'
            `;
            if (hFecha && hFecha !== "null") {
                sql += ` AND pf.fecha <= '${hFecha}'`;
            }
            if (empresaId > 0) {
                sql += ` AND pf.empresaId = ${empresaId}`;
            }
        } else {
            sql += `
                WHERE pf.departamentoId IN (
                    SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = ${usuarioId}
                ) AND pf.fecha >= '${dFecha}'
            `;
            if (hFecha && hFecha !== "null") {
                sql += ` AND pf.fecha <= '${hFecha}'`;
            }
            if (empresaId > 0) {
                sql += ` AND pf.empresaId = ${empresaId}`;
            }
        }

        sql += " ORDER BY pf.fecha DESC, pf.numero ASC, f.receptorNombre ASC";

        // Ejecución de la consulta
        const facturas = await new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result.map(pf => {
                    const numero = pf.numero.toString().padStart(6, "0");
                    pf.vNum = `${pf.serie}-${pf.ano}-${numero}`;
                    return pf;
                }));
            });
        });

        // Llamada a asignaAgenteFactura para procesar las facturas
        const facturasConAgente = await asignaAgenteFactura(facturas);

        // Devuelve el resultado
        callback(null, facturasConAgente);
    } catch (err) {
        callback(err, null);
    } finally {
        if (connection) connection.end();
    }
};

module.exports.getFacturasReparaciones = async function (callback) {
    const connection = getConnection();
    try {
        // Construcción de la consulta SQL
        const sql = `
            SELECT 
                pf.*,
                CONCAT(
                    COALESCE(CAST(pf.serie AS CHAR(50)), ' '), '-',
                    COALESCE(pf.ano, ' '), '-',
                    COALESCE(CAST(pf.numero AS CHAR(50)), ' ')
                ) AS numero,
                fp.nombre AS formaPagoNombre
            FROM facturas AS pf
            LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId
            LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId
            LEFT JOIN contratos AS cm ON cm.contratoId = pf.contratoId
            LEFT JOIN departamentos AS dp ON dp.departamentoId = pf.departamentoId
            LEFT JOIN clientes AS c ON c.clienteId = cm.clienteId
            WHERE pf.departamentoId = 7
            ORDER BY pf.fecha DESC, pf.numero ASC
        `;

        // Ejecutar la consulta
        const facturas = await new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(
                    result.map(pf => {
                        pf.numero = pf.numero.toString();
                        return pf;
                    })
                );
            });
        });

        // Procesar las facturas con asignaAgenteFactura
        const facturasConAgente = await asignaAgenteFactura(facturas);

        // Devolver el resultado al callback
        callback(null, facturasConAgente);
    } catch (err) {
        // Manejo de errores
        callback(err, null);
    } finally {
        // Cerrar la conexión
        if (connection) connection.end();
    }
};



module.exports.getFacturasReparacionesFiltros = async function (
    dFecha,
    hFecha,
    clienteId,
    empresaId,
    callback
) {
    const connection = getConnection();
    try {
        // Formateo de fechas
        const deFecha = moment(dFecha, 'DD.MM.YYYY').format('YYYY-MM-DD');
        const aFecha =
            hFecha && hFecha !== 0
                ? moment(hFecha, 'DD.MM.YYYY').format('YYYY-MM-DD')
                : null;

        clienteId = parseInt(clienteId);
        empresaId = parseInt(empresaId);

        // Construcción de la consulta SQL
        let sql = `
            SELECT 
                pf.*,
                CONCAT(
                    COALESCE(CAST(pf.serie AS CHAR(50)), ' '), '-',
                    COALESCE(pf.ano, ' '), '-',
                    COALESCE(CAST(pf.numero AS CHAR(50)), ' ')
                ) AS numero,
                fp.nombre AS formaPagoNombre
            FROM facturas AS pf
            LEFT JOIN facturas AS f ON f.facturaId = pf.facturaId
            LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId
            LEFT JOIN contratos AS cm ON cm.contratoId = pf.contratoId
            LEFT JOIN departamentos AS dp ON dp.departamentoId = pf.departamentoId
            LEFT JOIN clientes AS c ON c.clienteId = cm.clienteId
            WHERE pf.departamentoId = 7
        `;

        if (dFecha) {
            sql += ` AND pf.fecha >= '${deFecha}'`;
        }
        if (aFecha) {
            sql += ` AND pf.fecha <= '${aFecha}'`;
        }
        if (clienteId) {
            sql += ` AND pf.clienteId = ${clienteId}`;
        }
        if (empresaId) {
            sql += ` AND pf.empresaId = ${empresaId}`;
        }

        sql += " ORDER BY pf.fecha DESC, pf.numero ASC";

        // Ejecución de la consulta
        const facturas = await new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(
                    result.map(pf => {
                        pf.numero = pf.numero.toString();
                        return pf;
                    })
                );
            });
        });

        // Procesar las facturas con asignaAgenteFactura
        const facturasConAgente = await asignaAgenteFactura(facturas);

        // Devolver el resultado al callback
        callback(null, facturasConAgente);
    } catch (err) {
        // Manejo de errores
        callback(err, null);
    } finally {
        // Cerrar la conexión
        if (connection) connection.end();
    }
};


// CREACION A PARTIR DE PREFACTURAS
module.exports.postCrearDesdePrefacturasUsuario = function (dFecha, hFecha, fechaFactura, usuarioId, clienteId, agenteId, departamentoId, empresaId, rectificativas,done) {
    var con = getConnection();
    var sql = "";
    var facturaId = 0;
    var factura = null;
    var numFact;
    var contPlanificacionId = null
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
            if(res.length == 0) {
                var e = new Error("No se han obtenido registros.");
                return con.rollback(function () { done(e) });
            }
            prefacturas = res;
            async.eachSeries(prefacturas, function (pf, callback2) {
                var primeraLineaId = 0; //variable para guardar la ID de la primera linea de la factura que se crea
                var numLineas = 0; // variable que almacena el nunmero de lineas insertadas
                // transformar un objeto prefactura en uno factura
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
                        contPlanificacionId = factura.contPlanificacionId;
                        delete factura.contPlanificacionId; // eliminamos campo no necesario
                        delete factura.contratoPorcenId // eliminamos campo no necesario
                        delete factura.fechaRecibida;
                        delete factura.fechaGestionCobros
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
                        sql += " coste, porcentajeBeneficio, importeBeneficioLinea, porcentajeAgente, importeAgenteLinea, ventaNetaLinea, capituloLinea)";
                        sql += " SELECT linea, " + factura.facturaId + " AS  facturaId, unidadId, articuloId, tipoIvaId, porcentaje, descripcion, cantidad, importe, totalLinea,";
                        sql += " coste, porcentajeBeneficio, importeBeneficioLinea, porcentajeAgente, importeAgenteLinea, ventaNetaLinea, capituloLinea";
                        sql += " FROM prefacturas_lineas";
                        sql += " WHERE prefacturas_lineas.prefacturaId = ?";
                        sql += " ORDER BY prefacturas_lineas.prefacturaLineaId ASC";
                        sql = mysql.format(sql, factura.prefacturaId);
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
                    },
                    function(callback) {
                        // si la prefactura es de reparaciones  actualizamos los partes correspondientes
                        if(factura.departamentoId == 7 && !factura.contratoId) {
                            sql = "UPDATE partes SET numero_factura_cliente = ?, fecha_factura_cliente = ?, facturaId = ? WHERE prefacturaId = ?"
                            sql = mysql.format(sql, [numFact, factura.fecha, factura.facturaId, factura.prefacturaId]);
                            con.query(sql, function (err, result) {
                                if (err) return callback(err);
                                //actualizamos los partes_lineas con la facturaLineaId correspondiente
                                sql = "SELECT pl.prefacturaLineaId";
                                sql += " FROM servicios ser, partes p, partes_lineas pl WHERE";
                                sql += " ser.servicioId = p.servicioId AND p.parteId = pl.parteId AND  p.prefacturaId = ? AND p.facturaId = ?";
                                sql = mysql.format(sql, [factura.prefacturaId, factura.facturaId]);
                                con.query(sql, function (err, result2) {
                                    if (err) return callback(err);
                                    if( result2.length != numLineas){
                                        return callback(null);
                                    } 
                                    var ids = result2;
                                    async.forEachSeries(ids, function (id, done) {
                                        var con2 = getConnection();
                                        sql = " UPDATE partes_lineas set facturaLineaId = ? WHERE prefacturaLineaId = ?";
                                        sql = mysql.format(sql, [primeraLineaId, id.prefacturaLineaId]);
                                        con2.query(sql, function(err, resultado) {
                                            con2.end();
                                            if (err) return done(err);
                                            primeraLineaId++;
                                            done();
                                        });
                                    }, function (err) {
                                        if(err) return callback(err);
                                    });
                                });
                            });

                        } else {
                            callback(null);
                        }
                    },
                    function(callback) {
                        // si la prefactura es de obras actulizamos el importe en la tabla contrato_planificacion
                        if(pf.departamentoId == 8 && contPlanificacionId) {
                            sql = "UPDATE contrato_planificacion SET importeFacturado = importeFacturado + ?, importeFacturadoIva = importeFacturadoIva + ?  WHERE contPlanificacionId = ?"
                            sql = mysql.format(sql, [factura.total, factura.totalConIva, contPlanificacionId]);
                            con.query(sql, function (err, result) {
                                if (err) return callback(err);
                                callback(null);
                            });

                        } else {
                            callback(null);
                        }
                    },
                    function (callback) {
                        //una vez finalizado el proceso la desmarcamos
                        sql = "UPDATE prefacturas SET sel =  0 WHERE prefacturaId = ?";
                        sql = mysql.format(sql, factura.prefacturaId);
                        con.query(sql, function (err, result) {
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


//creacion de report json
module.exports.postCrearReport = function (dFecha, hFecha, clienteId, empresaId, tipoIvaId, conta, orden, serie, departamentoId, usuarioId,callback) {
    var connection = getConnection();
    var obj = 
        {
            libCli: ""
        }
    var sql = "SELECT  f.empresaId,  emp.nombre AS empresaNombre, f.facturaId, fecha, f.observaciones, c.referencia,";
	sql += " `emisorNombre`,  ti.nombre AS tipoIva, f.totalConIva, cli.cuentaContable,  fb.porcentaje AS porcentaje,  IF(ti.nombre='SUPLIDOS', 0, fb.base)  AS basFact,";
    sql += " fb.cuota, f.`importeRetencion`, f.ano, f.numero, f.serie, f.receptorNombre, IF(ti.nombre='SUPLIDOS', fb.base, 0)  AS suplidos";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN facturas_bases AS fb ON fb.facturaId = f.facturaId";
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
    if(conta == "sinConta") {
        sql += " AND f.contabilizada = 0"
    }
    if(conta == "conta") {
        sql += " AND f.contabilizada = 1"
    }
    if(serie != 100) {
        sql += " AND f.serie = " + "'" + serie + "'"
    }

    sql += " ORDER BY   f.serie," +  orden + ", f.numero";

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
// Modifica la linea de factura  desde una linea de parte modificada
module.exports.putFacturaLineaDesdeParte = function (datos, callback) {
    var facturaId;
    var connection = getConnection();
    sql = " SELECT par.facturaId, pt.descripcion AS descripcion, pt.unidades AS cantidad,ar.articuloId AS articuloId,pt.tipoIvaClienteId AS tipoIvaId, pt.ivaCliente AS porcentaje, ar.unidadId,";
    sql += " pt.precioCliente AS importe, pt.importeCliente AS coste, pt.importeCliente AS totalLinea ,ga.nombre AS capituloLinea ";
    sql += " FROM partes AS par";
    sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
    sql += " LEFT JOIN partes_lineas AS pt ON pt.parteId = par.parteId"
    sql += " LEFT JOIN articulos AS ar ON ar.codigoReparacion = pt.codigoArticulo";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = ar.unidadId";
    sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoarticuloId = ar.grupoArticuloId"
    sql += " WHERE pt.facturaLineaId = ?";
    sql = mysql.format(sql, [datos.facturaLineaId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        facturaId = result[0].facturaId;
        delete result[0].facturaId;
        connection = getConnection();
        sql = "UPDATE facturas_lineas SET ? WHERE facturaLineaId = ?";
        sql = mysql.format(sql, [result[0], datos.facturaLineaId]);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            // actualizar las bases y cuotas
            fnActualizarBases(facturaId, function (err, res) {
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

module.exports.getFacturasCliente = function (clienteId, callback) {
    var connection = getConnection();
    var sql = "SELECT * FROM facturas WHERE clienteId = ?";
    sql = mysql.format(sql,clienteId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, result);
    })
}

module.exports.getFacturasClienteAgenteDepartamento = function (id, departamentoId, esCliente, tipoComercialId, callback) {
    var connection = getConnection();
    var sql = "SELECT"; 
    sql += " f.facturaId," 
    sql += " f.empresaId,";
    sql += " CONCAT(COALESCE(CAST(f.serie AS CHAR(50)),' '),'-',COALESCE(f.ano,' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS numeroFactura,";
    sql += " f.emisorNombre,";
    sql += " f.receptorNombre,";
    sql += " f.fecha,";
    sql += " f.totalConIva,";
    sql += " f.total,";
    sql += " fp.nombre AS formaPagoNombre"; 
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN clientes AS cl ON cl.clienteId = f.clienteId";
    sql += " LEFT JOIN servicios  AS s ON s.clienteId = cl.clienteId"
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = s.agenteId";
    sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId"
    if(esCliente == 'true') {
        sql += "  WHERE f.clienteId = ?";
        sql = mysql.format(sql, id);
    } else {
        if(tipoComercialId == 1) {
            sql += "  WHERE s.agenteId = ?";
            sql = mysql.format(sql, id);
        } else {
            sql += "  WHERE c.ascComercialId = ?";
            sql = mysql.format(sql, id);
        }
       
    }
    if(departamentoId > 0) {
        sql += " AND departamentoId = ?";
        sql = mysql.format(sql, departamentoId);
    }
    sql += "AND f.empresaId IN (7, 3, 2)"
    sql += " ORDER BY f.fecha DESC"
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        result.forEach(function (f) {
            f.numeroFactura = f.numeroFactura.toString();
        });
        callback(null, result);
    })
}

module.exports.getUltimoNumero = function (facturaId, callback) {
    var connection = getConnection();
    var sql = "SELECT * FROM facturas WHERE facturaId = " + facturaId;
    connection.query(sql, function (err, factura) {
        connection.end();
        if (err) return callback(err);
        var f = factura[0];
        var connection2 = getConnection();
        sql = "SELECT COALESCE(MAX(numero), 1) AS numero FROM facturas";
        sql += " WHERE empresaId = ? AND ano = ? AND serie = ?";
        sql = mysql.format(sql, [f.empresaId, f.ano, f.serie]);
        connection2.query(sql, function (err, result) {
            connection2.end();
            if (err) return callback(err);
            if(result[0].numero == f.numero) {
                callback(null, 'OK');

            } else {
                callback(null, 'REPETIDO')
            }
        })
        
    })
}

module.exports.getFacturasBeneficioComercial = function (dFecha, hFecha, departamentoId, empresaId, comercialId, usuarioId, done) {
        var connection = getConnection();
        var sql = "";
        sql = "UPDATE facturas SET sel = 0";
        connection.query(sql, function (err) {
            connection.end();
            if (err) return done(err);
            connection = getConnection();
                var facturas = null;
                sql = " SELECT DISTINCT ";
                sql += " f.facturaId,";
                sql += " f.clienteId,"
                sql += " f.numero,";
                sql += " f.serie,";
                sql += " f.ano,";
                sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
                sql += " f.fecha,";
                sql += " f.total,";
                sql += " f.empresaId,";
                sql += " f.departamentoId,";
                sql += " f.liquidadaComercial,";
                sql += " f.observaciones,";
                sql += " cms.comercialId,";
                sql += " fp.nombre AS formaPago,"
                sql += " emp.nombre AS nombreEmpresa,";
                sql += " tpm.nombre AS tipoProyectoNombre,"
                sql += " cli.nombre AS nombreCliente,";
                sql += " 'factura' AS tipoRegistro";
                sql += " FROM facturas AS f ";
                sql += " LEFT JOIN clientes AS cli ON cli.clienteId = f.clienteId ";
                sql += " LEFT JOIN comerciales AS cms ON cms.comercialId = cli.comercialId ";
                sql += " LEFT JOIN comerciales AS cms2 ON cms2.comercialId = cms.ascComercialId ";
                sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId ";
                sql += " LEFT JOIN empresas AS emp ON emp.empresaId = f.empresaId ";
                sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = f.departamentoId";
                sql += " WHERE f.fecha >= ? AND f.fecha <= ? AND f.liquidadaComercial = 0";
                sql = mysql.format(sql, [dFecha, hFecha]);
                sql += " AND f.departamentoId = " + departamentoId;
                if (empresaId != 0) {
                    sql += " AND f.empresaId = " + empresaId;
                }
                if (comercialId != 0) {
                    sql += " AND  cms2.comercialId = " + comercialId;
                }
               
                connection.query(sql, function (err, res) {
                    connection.end();
                    if (err) return done(err);
                    facturas = res;
                    facturas.forEach(function (f) {
                        //inSQl += "," + f.facturaId;
                        var numero = f.numero.toString().padStart(6, "0");
                        f.vFac = f.serie + '-' + f.ano + '-' + numero;
                    });
                    done(null, facturas);
                    /* connection = getConnection();
                    var sql = "UPDATE facturas SET sel = 1";
                    sql += " WHERE facturaId IN (" + inSQl + ")";
                    connection.query(sql, function (err, res) {
                       connection.end();
                        if (err) return done(err);
                        facturasMarcadas = [];
                        facturas.forEach(function (c) {
                            c.sel = 1;
                            facturasMarcadas.push(c);
                        });
                        done(null, facturasMarcadas);
                    }); */
                });
        });
}


var procesaResultado = (result) => {
    var antfacid = null;
    result.forEach(e => {
        e.duplicado = false;
        e.fecha = moment(e.fecha).format('DD/MM/YYYY');
        if(e.facturaId == antfacid) {
            e.importeRetencion = 0;
            e.duplicado = true;
            e.observaciones = null;
        }
        antfacid = e.facturaId;
    });
    return result;
}


// plantillaFactura
// obtiene la la plantilla de informe de una determinada factura
// especificando su id.
var plantillaFactura = (facturaId, done) => {
    var con = getConnection();
    var infFacturas = "";ç
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
    if(departamentoId != 7) {
        crearPdfsFactura(dFecha, hFecha, clienteId, mantenedorId, comercialId, contratoId, empresaId, departamentoId, usuarioId, (err, facturas) => {
            if (err) return done(err);
            done(null, facturas);
        });
    } else {
        buscarFacturas(dFecha, hFecha, clienteId, comercialId, empresaId, departamentoId, (err, facturas) => {
            if (err) return done(err);
            done(null, facturas);
        });
    }
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

        var buffer = new Buffer.from(data, "utf-8");

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
    sql += " c.nombre AS nombreCliente, c.emailFacturas AS correoCliente";
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
var crearCorreosAEnviarReparaciones = (dFecha, hFecha, facturas, done) => {
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
                factura.asuntoCorreo = "Factura disponible"
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
                nombreCliente: factura.nombreCliente,
                facturas: []
            }
            c0 = factura.nombreCliente;
        }
        //c1 += " FACTURA: " + factura.nomfich + " IMPORTE: " + factura.totalConIva + "<br/>";
        c1 += " FACTURA: " + factura.nomfich + " IMPORTE: " + factura.totalConIva + "<br/>" + process.env.CLIENTE_CLIEN + "#!/top/facturas?facturaId=" + factura.facturaId + "&empresaId=" + factura.empresaId + "&clienteId=" + factura.clienteId +  "&agenteId=" + factura.agenteId +"<br/>";
        plantilla = factura.plantillaCorreoFacturasRep;
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
                nombreCliente: factura.nombreCliente,
                ficheros: [],
                facturas: []
            }
            c0 = factura.nombreCliente;
        }
        if (antEmpresa != factura.nombreEmpresa) {
            // nuevo correo, cada empresa manda el suyo
            correo.emisor = factura.correoEmpresa;
            antEmpresa = factura.nombreEmpresa;
        }
        c1 += " FACTURA: " + factura.nomfich + " IMPORTE: " + factura.totalConIva + "<br/>";
        plantilla = factura.plantillaCorreoFacturas;
        correo.ficheros.push(factura.pdf);
        if(factura.pdfs) {
            if(factura.pdfs.length > 0) {
                var pdfs = factura.pdfs
                pdfs.forEach(p => {
                    correo.ficheros.push(p);
                });
            }
        }
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
    //CREAMOSA PRIMERO EL DIRECTORIO DE LAS FACTURAS SI NO EXISTE
    if (!fs.existsSync(process.env.FACTURA_DIR)) {
        // Crear el directorio
        fs.mkdirSync(process.env.FACTURA_DIR);
        console.log(`Directorio creado: ${process.env.FACTURA_DIR}`);
      } else {
        console.log(`El directorio ya existe: ${process.env.FACTURA_DIR}`);
      }
    var con = getConnection();
    var facturas = null;
    var facturas2 = [];
    var pdfs = [];
    sql = "SELECT f.facturaId, f.serie, f.ano, f.numero, f.fecha, f.total, f.totalConIva, f.departamentoId,";
    sql += " e.nombre as nombreEmpresa, e.email as correoEmpresa, e.infFacturas, e.infFacCliRep, e.infFacCliObr, e.infFacCliAlq,";
    sql += "  e.plantillaCorreoFacturas, e.plantillaCorreoFacturasRep, e.asuntoCorreo, ";
    sql += " c.nombre as nombreCliente, c.emailFacturas as correoCliente,";
    sql += " CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich, p.refPresupuesto AS refPresupuesto";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId"; 
    sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
    sql += " LEFT JOIN contratos AS co ON co.contratoId = f.contratoId "
    sql += " LEFT JOIN partes AS p ON p.facturaId = f.facturaId";

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
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + " AND departamentoId != 7)"
    }
    sql += " GROUP BY f.facturaId";
    sql += " ORDER by e.nombre, c.nombre";
    //StiOptions.WebServer.url = "/api/streport";
    //var url = 
    //Stimulsoft.StiOptions.WebServer.url = "http://" + process.env.API_HOST + ":" + process.env.STI_PORT;
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
        async.forEachSeries(facturas, function (f, done2) {
            //buscamos los posibles partes en pdf de la factura
            buscarPdfsfactura(f, function(err, result) {
                if(err) return done2(err);
                if(result) f = result;
                done2(null);

            });
        }, function (err) {
            if (err) return callback(err);
            async.forEachSeries(facturas, function (f, done1) {
                    ioAPI.sendProgress("Procesando pdfs...", ++numReg, totalReg);
                    crearObjJson(f, function(err, obj) {
                        if (err) return callback(err, null);
                       /*  var resultado = JSON.stringify(obj);
                        fs.writeFile(process.env.REPORTS_DIR + "\\factura.json", resultado, function(err) {
                        if(err) return callback(err);
                        //return callback(null, true);
                        }); */
                        var report = new Stimulsoft.Report.StiReport();
                        var file = "";
                        if(f.departamentoId == 7) {
                            file = process.env.REPORTS_DIR + "\\" + f.infFacCliRep + "_json.mrt";
                        }else if (f.departamentoId == 8) {
                            file = process.env.REPORTS_DIR + "\\" + f.infFacCliObr + "_json.mrt";
                        } else if (f.departamentoId == 3) {
                            file = process.env.REPORTS_DIR + "\\" + f.infFacCliAlq + "_json.mrt";
                        } else {
                            file = process.env.REPORTS_DIR + "\\" + f.infFacturas + "_json.mrt";
                        }
                        report.loadFile(file);

                        var dataSet = new Stimulsoft.System.Data.DataSet("liq_ant");
                        dataSet.readJson(obj);
                        
                         // Remove all connections from the report template
                         report.dictionary.databases.clear();
                    
                         //
                        report.regData(dataSet.dataSetName, "", dataSet);
                        report.dictionary.synchronize();
                        /* var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
                        connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
                        connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
                        connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
                        report.dictionary.databases.list[0].connectionString = connectionString;
                        var pos = 0;
                        for (var i = 0; i < report.dataSources.list.length; i++) {
                            var str = report.dataSources.list[i].sqlCommand;
                            if (str.indexOf("pf.facturaId") > -1) pos = i;
                        }
                        var sql = report.dataSources.list[pos].sqlCommand;
                        report.dataSources.list[pos].sqlCommand = sql + " WHERE pf.facturaId = " + f.facturaId; */
                       
                        report.renderAsync(function () {
                                // Creating export settings
                                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                                // Creating export service
                                var service = new Stimulsoft.Report.Export.StiPdfExportService();
                                // Creating MemoryStream
                                var stream = new Stimulsoft.System.IO.MemoryStream();
                                service.exportTo(report, stream, settings);
            
                                var data = stream.toArray();
            
                                var buffer = new Buffer.from(data, "utf-8");
            
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

                    });
            }, function (err) {
                if (err) return callback(err);
                callback(null, facturas2);
            })
            
        });
    });
}

var buscarFacturas = function (dFecha, hFecha, clienteId, comercialId, empresaId, departamentoId, callback) {
    var con = getConnection();
    var facturas = null;
    sql = "SELECT f.facturaId, f.serie, f.ano, f.numero, f.fecha, f.total, f.totalConIva, f.departamentoId,";
    sql += " f.empresaId, f.clienteId, s.agenteId,";
    sql += " e.nombre as nombreEmpresa, e.email as correoEmpresa, e.infFacturas, e.infFacCliRep, e.infFacCliObr, e.infFacCliAlq,";
    sql += " e.plantillaCorreoFacturasRep, e.asuntoCorreo, ";
    sql += " c.nombre as nombreCliente, c.emailFacturas as correoCliente,";
    sql += " CAST(CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS CHAR) AS nomfich, p.refPresupuesto AS refPresupuesto";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId"; 
    sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
    sql += " LEFT JOIN partes AS p ON p.facturaId = f.facturaId";
    sql += " LEFT JOIN servicios as s ON s.servicioId = p.servicioId";
    

    // -- modificar sql según parámetros
    sql += " WHERE f.sel = 1 AND f.enviadaCorreo = 0 AND c.facturarPorEmail = 1";
    if (dFecha) {
        sql += " AND f.fecha >= '" + dFecha + " 00:00:00'";
    }
    if (hFecha) {
        sql += " AND f.fecha <= '" + hFecha + " 23:59:59'";
    }
    if (clienteId > 0) {
        sql += " AND f.clienteId = ?";
        sql = mysql.format(sql, clienteId);
    }
    if (comercialId > 0) {
        sql += " AND s.agenteId = ?";
        sql = mysql.format(sql, comercialId);
    }
    if (empresaId > 0) {
        sql += " AND f.empresaId = ?";
        sql = mysql.format(sql, empresaId);
    }
    if (departamentoId > 0) {
        sql += " AND f.departamentoId = " + departamentoId;
    }
    sql += " GROUP BY f.facturaId";
    sql += " ORDER by e.nombre, c.nombre";
 
    con.query(sql, function (err, result) {
        con.end();
        if (err) return callback(err, null);
        facturas = result;
        callback(null, facturas);
    });
}



var buscarPdfsfactura = (factura, done) => {
    factura.pdfs = [];
    if(factura.departamentoId != 7) return done(null, factura)
    var con = getConnection();
    var sql = ""
    var sql = "SELECT DISTINCT par.pdf";
    sql += " FROM facturas_lineas AS pfl";
    sql += " LEFT JOIN `partes_lineas` AS pl ON pl.`facturaLineaId` = pfl.`facturaLineaId`";
    sql += " LEFT JOIN `partes` AS par ON par.`parteId` = pl.`parteId`";
    sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId";
    sql += " WHERE pfl.facturaId = " + factura.facturaId;
    con.query(sql, function (err, result) {
        con.end();
        if(err) return done(err);
        if(result.length == 0) return done(null, factura);

        result.forEach(e => {
            if(e. pdf != null && e.pdf != '')  factura.pdfs.push(e.pdf);
        });
        return done(null, factura);
        

    });


}

var crearObjJson = function(f, callback) {
    var connection = getConnection();
    var id = f.facturaId
    var subSql = "cnt.direccion AS direccion2, cnt.codPostal AS codPostal2, cnt.poblacion AS poblacion2, cnt.provincia AS provincia2,";
    if(f.departamentoId == 7) subSql = " cl.direccion2 AS direccion2, cl.codPostal2 AS codPostal2, cl.poblacion AS poblacion2, cl.provincia AS provincia2,"
                    var obj = 
                        {
                            cabecera: "",
                            bases: "",
                            lineas: "",
                            imagenes: "",
                            opcion: ""
                        }
                    var sql = "SELECT pf.departamentoId, pf.facturaId, pf.ano, pf.numero, pf.serie,  DATE_FORMAT(pf.fecha,'%d-%m-%Y') AS fecha, pf.empresaId, pf.clienteId, ";
                    sql += "  pf.contratoClienteMantenimientoId,pf.importeAnticipo, pf.retenGarantias, pf.restoCobrar, pf.emisorNif, pf.emisorNombre, pf.emisorDireccion, pf.emisorCodPostal,";
                    sql += " pf.emisorPoblacion, pf.emisorProvincia, tpv1.nombre AS receptorTipoVia,pf.receptorNif, pf.receptorNombre, pf.receptorDireccion, pf.receptorCodPostal, pf.receptorPoblacion,";
                    sql += " pf.receptorProvincia,pf.total, pf.totalConIva, fp.nombre AS formaPago, pf.observaciones, pf.observacionesPago, pf.periodo, pf.porcentajeRetencion, pf.importeRetencion,";
                    sql += " fp.numeroVencimientos, fp.primerVencimiento, fp.restoVencimiento, cl.proId, tpv.nombre AS postalTipoVia, cl.direccion3 AS postalDireccion,";
                    sql += " cl.codPostal3 AS postalCodPostal, cl.poblacion3 AS postalPoblacion, cl.provincia3 AS postalProvincia,cl.iban,"
                    sql += " DATE_FORMAT(DATE_ADD(pf.fecha,INTERVAL fp.primerVencimiento DAY), '%d-%m-%Y') AS vencimiento, pf.formaPagoId,";
                    sql += " CONCAT(SUBSTR(cl.iban,1,20), '****')  AS cuenta,  e.email AS emisorCorreo,";
                    sql +=  subSql;
                    sql += " com.direccion AS direccionAgente, com.poblacion AS poblacionAgente, com.provincia AS provinciaAgente, com.codPostal AS codPostalAgente,"
                    sql += " com.nif AS nifAgente, com.nombre AS nombreAgente, tpv2.nombre AS agenteTipoVia,  cnt.referencia AS refOferta";
                    sql += " FROM facturas AS pf";
                    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formapagoId";
                    sql += " LEFT JOIN clientes AS cl ON cl.clienteId = pf.clienteId";
                    sql += " LEFT JOIN tipos_via AS tpv ON tpv.tipoViaId = cl.tipoViaId3";
                    sql += " LEFT JOIN tipos_via AS tpv1 ON tpv1.tipoViaId = cl.tipoViaId";
                    sql += " LEFT JOIN comerciales AS com ON com.comercialId = cl.comercialId";
                    sql += " LEFT JOIN tipos_via AS tpv2 ON tpv2.tipoViaId = com.tipoViaId";
                    sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = pf.contratoId";
                    sql += " LEFT JOIN ofertas AS of ON of.ofertaId = cnt.ofertaId";
                    sql += " LEFT JOIN empresas AS e ON e.empresaId = pf.empresaId"
                    sql += " WHERE pf.facturaId =" + id;
                    connection.query(sql, function (err, result) {
                        connection.end();
                        if (err)    return callback(err, null);
                        result[0].fecha = result[0].fecha.toString();
                        result[0].vencimiento = result[0].vencimiento.toString();
                        obj.cabecera = result[0];
                        connection = getConnection();
                        sql = "SELECT pfl.*, t.nombre AS tipoIva, ga.nombre AS grupo, par.numparte, ser.numservicio, u.abrev, pl.codigoArticulo, ser.direccionTrabajo,  par.refPresupuesto";
                        sql += "  FROM facturas_lineas AS pfl";
                        sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfl.tipoIvaId";
                        sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
                        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
                        sql += " LEFT JOIN partes_lineas AS pl ON pl.facturaLineaId = pfl.facturaLineaId"
                        sql += " LEFT JOIN partes AS par ON par.parteId = pl.parteId";
                        sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId";
                        sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId";
                        sql += " WHERE pfl.facturaId =" + id;
                        connection.query(sql, function (err, result2) {
                            connection.end();
                            if (err)    return callback(err, null);
                            obj.lineas = result2;
                            connection = getConnection();
                            sql = "SELECT pfb.*, t.nombre AS tipoIva, pfb.base AS baseImp ";
                            sql += " FROM facturas_bases AS pfb";
                            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfb.tipoIvaId";
                            sql += " WHERE pfb.facturaId =" + id;
                            connection.query(sql, function (err, result3) {
                                connection.end();
                                if (err)    return callback(err, null);
                                obj.bases = result3;
                                if(f.departamentoId == 7) {
                                    connection = getConnection();
                                    sql = "Select imagen, facturaId, numParte FROM partes";
                                    sql += " WHERE NOT imagen is NULL AND facturaId =" + id;
                                    connection.query(sql, function (err, result4) {
                                        connection.end();
                                        if (err)    return callback(err, null);
                                        if(result4.length == 0) {
                                            obj.opcion = { "sinImagen": true }; 
                                            obj.imagenes = result4
                                        } else {
                                            obj.opcion = { "sinImagen": false }; 
                                            obj.imagenes = result4;
                                        }
                                        return callback(null, obj);
                                    });
                                } else {
                                    return callback(null, obj);
                                }
                            });
                        });
                    });
}

var crearObjJsonVisor = function(f, callback) {
    var connection = getConnection();
    var id = f.facturaId
    var subSql = "cnt.direccion AS direccion2, cnt.codPostal AS codPostal2, cnt.poblacion AS poblacion2, cnt.provincia AS provincia2,";
    if(f.departamentoId == 7) subSql = " cl.direccion2 AS direccion2, cl.codPostal2 AS codPostal2, cl.poblacion AS poblacion2, cl.provincia AS provincia2,"
                    var obj = 
                        {
                            cabecera: "",
                            bases: "",
                            lineas: ""
                        }
                    var sql = "SELECT pf.facturaId, pf.ano, pf.numero, pf.serie,  DATE_FORMAT(pf.fecha,'%d-%m-%Y') AS fecha, pf.empresaId, pf.clienteId, ";
                    sql += "  pf.contratoClienteMantenimientoId,pf.importeAnticipo, pf.restoCobrar, pf.emisorNif, pf.emisorNombre, pf.emisorDireccion, pf.emisorCodPostal,";
                    sql += " pf.emisorPoblacion, pf.emisorProvincia, tpv1.nombre AS receptorTipoVia,pf.receptorNif, pf.receptorNombre, pf.receptorDireccion, pf.receptorCodPostal, pf.receptorPoblacion,";
                    sql += " pf.receptorProvincia,pf.total, pf.totalConIva, fp.nombre AS formaPago, pf.observaciones, pf.periodo, pf.porcentajeRetencion, pf.importeRetencion,";
                    sql += " fp.numeroVencimientos, fp.primerVencimiento, fp.restoVencimiento, cl.proId, tpv.nombre AS postalTipoVia, cl.direccion3 AS postalDireccion,";
                    sql += " cl.codPostal3 AS postalCodPostal, cl.poblacion3 AS postalPoblacion, cl.provincia3 AS postalProvincia,cl.iban,"
                    sql += " DATE_FORMAT(DATE_ADD(pf.fecha,INTERVAL fp.primerVencimiento DAY), '%d-%m-%Y') AS vencimiento, pf.formaPagoId,";
                    sql += " CONCAT(SUBSTR(cl.iban,1,20), '****')  AS cuenta,";
                    sql +=  subSql;
                    sql += " com.direccion AS direccionAgente, com.poblacion AS poblacionAgente, com.provincia AS provinciaAgente, com.codPostal AS codPostalAgente,"
                    sql += " com.nif AS nifAgente, com.nombre AS nombreAgente, tpv2.nombre AS agenteTipoVia,  cnt.referencia AS refOferta";
                    sql += " FROM facturas AS pf";
                    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formapagoId";
                    sql += " LEFT JOIN clientes AS cl ON cl.clienteId = pf.clienteId";
                    sql += " LEFT JOIN tipos_via AS tpv ON tpv.tipoViaId = cl.tipoViaId3";
                    sql += " LEFT JOIN tipos_via AS tpv1 ON tpv1.tipoViaId = cl.tipoViaId";
                    sql += " LEFT JOIN comerciales AS com ON com.comercialId = cl.comercialId";
                    sql += " LEFT JOIN tipos_via AS tpv2 ON tpv2.tipoViaId = com.tipoViaId";
                    sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = pf.contratoId";
                    sql += " LEFT JOIN ofertas AS of ON of.ofertaId = cnt.ofertaId";
                    sql += " WHERE pf.facturaId =" + id;
                    connection.query(sql, function (err, result) {
                        connection.end();
                        if (err)    return callback(err, null);
                        result[0].fecha = result[0].fecha.toString();
                        result[0].vencimiento = result[0].vencimiento.toString();
                        obj.cabecera = result[0];
                        connection = getConnection();
                        sql = "SELECT pfl.*, t.nombre AS tipoIva, ga.nombre AS grupo, par.numparte, ser.numservicio, u.abrev, pl.codigoArticulo, ser.direccionTrabajo,  par.refPresupuesto";
                        sql += "  FROM facturas_lineas AS pfl";
                        sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfl.tipoIvaId";
                        sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
                        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
                        sql += " LEFT JOIN partes_lineas AS pl ON pl.facturaLineaId = pfl.facturaLineaId"
                        sql += " LEFT JOIN partes AS par ON par.parteId = pl.parteId";
                        sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId";
                        sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId";
                        sql += " WHERE pfl.facturaId =" + id;
                        connection.query(sql, function (err, result2) {
                            connection.end();
                            if (err)    return callback(err, null);
                            obj.lineas = result2;
                            connection = getConnection();
                            sql = "SELECT pfb.*, t.nombre AS tipoIva, pfb.base AS baseImp ";
                            sql += " FROM facturas_bases AS pfb";
                            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfb.tipoIvaId";
                            sql += " WHERE pfb.facturaId =" + id;
                            connection.query(sql, function (err, result3) {
                                connection.end();
                                if (err)    return callback(err, null);
                                obj.bases = result3;
                                closeConnectionCallback(connection, callback);
                                return callback(null, obj);
                            });
                        });
                    });
}

//creacion de report json
var postCrearReportRep = function (id ,callback) {
    var connection = getConnection();
    var obj = 
        {
            cabecera: "",
            bases: "",
            lineas: ""
        }
    var sql = "SELECT pf.facturaId, pf.ano, pf.numero, pf.serie,  DATE_FORMAT(pf.fecha,'%d-%m-%Y') AS fecha, pf.empresaId, pf.clienteId, ";
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
        sql += " WHERE pf.facturaId =" + id;
    } 
    connection.query(sql, function (err, result) {
        if (err)    return callback(err, null);
        result[0].fecha = result[0].fecha.toString();
        result[0].vencimiento = result[0].vencimiento.toString();
        obj.cabecera = result[0];
        sql = "SELECT pfl.*, t.nombre AS tipoIva, ga.nombre AS grupo, par.numparte, ser.numservicio, u.abrev, pl.codigoArticulo, ser.direccionTrabajo";
        sql += "  FROM facturas_lineas AS pfl";
        sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfl.tipoIvaId";
        sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
        sql += " LEFT JOIN partes_lineas AS pl ON pl.facturaLineaId = pfl.facturaLineaId"
        sql += " LEFT JOIN partes AS par ON par.parteId = pl.parteId";
        sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId";
        sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId";
        if(id) {
            sql += " WHERE pfl.facturaId =" + id;
        } 
        connection.query(sql, function (err, result2) {
            if (err)    return callback(err, null);
            obj.lineas = result2;
            sql = "SELECT pfb.*, t.nombre AS tipoIva, pfb.base AS baseImp ";
            sql += " FROM facturas_bases AS pfb";
            sql += " LEFT JOIN tipos_iva AS t ON t.tipoIvaId = pfb.tipoIvaId";
            if(id) {
                sql += " WHERE pfb.facturaId =" + id;
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
                    correoAPI.sendCorreo(c, false, parametros, false, (err) => {
                        ioAPI.sendProgress("Enviado correos... ", ++numReg, totalReg);
                        resEnvio += c.nombreCliente + "(" + c.destinatario + ") // ";
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
            if(err) return done(err);
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


// putFactura
// Modifica el factura según los datos del objeto pasao
module.exports.putFactura2 = function (factura, callback) {
    var connection = getConnection();
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