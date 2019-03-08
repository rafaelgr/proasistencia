// facturasProveedores_db_mysql
// Manejo de la tabla facturas de proveedores en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");

var fs = require("fs"),
    path = require("path");

//  leer la configurción de MySQL

//var config2 = require("../../config.json");
var fs = require('fs');



var sql = "";
var Stimulsoft = require('stimulsoft-reports-js');

var ioAPI = require('../ioapi/ioapi');

var correoAPI = require('../correoElectronico/correoElectronico');
var conexion = require('../comun/comun')

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

// comprobarPrefactura
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarFacprove(facprove) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof facprove;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && facprove.hasOwnProperty("facproveId"));
    comprobado = (comprobado && facprove.hasOwnProperty("empresaId"));
    comprobado = (comprobado && facprove.hasOwnProperty("proveedorId"));
    comprobado = (comprobado && facprove.hasOwnProperty("fecha"));
    return comprobado;
}


// getFacturasProveedores
// lee todos los registros de la tabla facturas y
// los devuelve como una lista de objetos
module.exports.getFacturasProveedores = function (callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM facprove AS pf";
    sql += " LEFT JOIN facprove AS f ON f.facproveId = pf.facproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " ORDER BY pf.fecha DESC";
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        prefacturas = result;
        callback(null, prefacturas);
    });
}

module.exports.getFacturasContrato = function (contratoId, callback) {
    var connection = getConnection();
    var facprove = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion as dirTrabajo";
    sql += " FROM facprove AS pf";
    sql += " LEFT JOIN facprove AS f ON f.facproveId = pf.facproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
    sql += " LEFT JOIN empresas as c ON c.empresaId = cm.empresaId";
    sql += " LEFT JOIN facprove_serviciados AS fps ON fps.facproveId = pf.facproveId"
    sql += " WHERE fps.contratoId = ?";
    sql += " ORDER BY pf.fecha";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        facprove = result;
        callback(null, facprove);
    });
}

module.exports.getPrefacturasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion2 as dirTrabajo";
    sql += " FROM prefacturas AS pf";
    sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cm.clienteId";
    sql += " WHERE pf.contratoId = ?";
    sql += " AND pf.generada = 1"
    sql += " ORDER BY pf.fecha";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        prefacturas = result;
        callback(null, prefacturas);
    });
}

module.exports.getTipoCliente = function (contratoId, callback) {
    var connection = getConnection();
    sql = "SELECT con.clienteId as cliente, cli.tipoclienteId as tipoCliente FROM contratos AS con INNER JOIN clientes AS cli ON con.clienteId = cli.clienteId";
    sql += " WHERE con.contratoId = ?";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        } else {
            callback(null, result);
        }
    });

}

// getNuevaRefFacprove
// busca la siguiente id en la tabla
module.exports.getNuevaRefFacprove = function (fecha, callback) {
    var facprove = fnGetNumeroFacprove(fecha);
    return facprove;
}

// getNuevaRef
// obtine la referencIA cuando se cambia la empresa
module.exports.getNuevaRef = function (facprove, callback) {
    fnGetNumeroFacprove(facprove, function (err, res) {
        if (err) return callback(err);
        callback(null, res);
        
    });
}

module.exports.deletePrefacturasContratoGeneradas = function (contratoId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "DELETE FROM prefacturas";
    sql += " WHERE contratoId = ? AND generada = 1"
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null);
    });
}




// getPreEmisionPrefacturas
// obtiene las prefacturas no prefacturadas entre las fechas indicadas
module.exports.getPreEmisionPrefacturas = function (dFecha, hFecha, clienteId, agenteId, tipoMantenimientoId, empresaId, callback) {
    var connection = getConnection();
    var prefacturas = null;
    // primero las marcamos por defeto como prefacturables
    var sql = "UPDATE prefacturas as pf,clientes as c, contratos as cm";
    sql += " SET pf.sel = 1";
    sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
    sql += " AND c.clienteId = pf.clienteId AND cm.contratoId = pf.contratoId";
    if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
    if (agenteId != 0) sql += " AND c.comercialId = " + agenteId;
    if (tipoMantenimientoId != 0) sql += " AND cm.tipoContratoId = " + tipoMantenimientoId;
    sql += " AND pf.facturaId IS NULL";
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        connection.end();
        if (err) return callback(err);
        sql = "SELECT pf.*,";
        sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
        sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
        sql += " fp.nombre AS vFPago,";
        sql += " c.comercialId as agenteId, cm.tipoContratoId, com.nombre as agente, cm.direccion as dirTrabajo";
        sql += " FROM prefacturas AS pf";
        sql += " LEFT JOIN prefacturas AS f ON f.prefacturaId = pf.prefacturaId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
        sql += " LEFT JOIN clientes as c ON c.clienteId = pf.clienteId";
        sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
        sql += " LEFT JOIN comerciales as com ON com.comercialId = c.comercialId";
        sql += " WHERE pf.fecha >= ? AND pf.fecha <= ?";
        if (clienteId != 0) sql += " AND pf.clienteId = " + clienteId;
        if (agenteId != 0) sql += " AND c.comercialId = " + agenteId;
        if (tipoMantenimientoId != 0) sql += " AND cm.tipoContratoId = " + tipoMantenimientoId;
        if (empresaId != 0) sql += " AND pf.empresaId = " + empresaId;
        sql += " AND pf.facturaId IS NULL";
        sql += " ORDER BY pf.fecha";
        sql = mysql.format(sql, [dFecha, hFecha]);
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            res.forEach(function (pf) {
                pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
            });
            prefacturas = res;
            callback(null, prefacturas);
        });
    });
}



// getFacturaProveedore
// busca  la factura con id pasado
module.exports.getFacturaProveedor = function (id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo, ant.numeroAnticipoProveedor as anticipo, f.antproveId";
    sql += " FROM facprove AS pf";
    sql += " LEFT JOIN facprove AS f ON f.facproveId = pf.facproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " LEFT JOIN antprove as ant ON f.facproveId = ant.facproveId"
    sql += " WHERE pf.facproveId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
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

// getFacturaProveedoreId
// busca  las facturas con id del proveedor pasado
module.exports.getFacturaProveedorId = function (id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS vNum,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM facprove AS pf";
    sql += " LEFT JOIN facprove AS f ON f.facproveId = pf.facproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.proveedorId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        callback(null, result);
    });
}


module.exports.getFacPdf = function (dFecha, hFecha, empresaId, proveedorId, callback) {
    var con = getConnection();
    var facturas = null;
    sql = "SELECT f.facproveId, f.serie, f.ano, f.numero, f.numeroFacturaProveedor as numfact, f.fecha, e.nombre,";
    sql += " CONCAT(f.serie,'-',f.ano,'-',LPAD(f.numero, 6, '0')) AS nomfich";
    sql += " FROM facprove AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId";
    // -- modificar sql según parámetros
    sql += " WHERE TRUE"
    if (proveedorId != 0) {
        sql += " AND f.proveedorId = " + proveedorId;
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
    Stimulsoft.Base.StiLicense.key = process.env.STI_KEY
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    con.query(sql, function (err, result) {
        con.end();
        if (err) return callback(err, null);
        facturas = result;
        async.forEachSeries(facturas, function (f, done1) {
            var report = new Stimulsoft.Report.StiReport();
            var file = process.env.REPORTS_DIR + "\\" + "facturaProveedor_general.mrt";
            report.loadFile(file);
            var connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
            connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";"
            connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";"
            connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
            report.dictionary.databases.list[0].connectionString = connectionString;
            var pos = 0;
            for (var i = 0; i < report.dataSources.items.length; i++) {
                var str = report.dataSources.items[i].sqlCommand;
                if (str.indexOf("pf.facproveId") > -1) pos = i;
            }
            var sql = report.dataSources.items[pos].sqlCommand;
            report.dataSources.items[pos].sqlCommand = sql + " WHERE pf.facproveaId = " + f.facproveId;
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




// postFactura
// crear en la base de datos la factura de proveedor pasada
module.exports.postFactura = function (facprove, doc, callback) {
    facprove.facproveId = 0; // fuerza el uso de autoincremento
    if (!comprobarFacprove(facprove)) {
        var err = new Error("El factura del proveedor pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    fnGetNumeroFacprove(facprove, function (err, res) {
        if (err) return callback(err);
        //si se guarda un pdf con la factura se establece la propiedad con su nombre en la BBDD
        if (doc) {
            facprove.nombreFacprovePdf = facprove.ref + '.' + doc.ext;
            doc.ref = res.ref;
        }

        sql = "INSERT INTO facprove SET ?";
        sql = mysql.format(sql, facprove);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            //Se guarda el PDF de la factura si existe
            if (doc) {
                guardaArchivo(doc);
            }
            facprove.facproveId = result.insertId;
            callback(null, facprove);
        });
    });
}

// putFactura
// Modifica la factura de proveedor según los datos del objeto pasado
// y guarda un documento adjunto a dicha factura si este existe
module.exports.putFactura = function (id, facprove, doc, callback) {
    if (!comprobarFacprove(facprove)) {
        var err = new Error("la factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != facprove.facproveId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    if (err) {
        return callback(err);
    }
    if (doc) {
        facprove.nombreFacprovePdf = facprove.ref + '.' + doc.ext;
    }
    sql = "UPDATE facprove SET ? WHERE facproveId = ?";
    sql = mysql.format(sql, [facprove, facprove.facproveId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        } else {
            if (doc && !doc.oldFile) {
                doc.ref = facprove.ref;
                guardaArchivo(doc);
            }
            if(doc && doc.oldFile) {
                renombraArchivo(doc);
            }
        }
        callback(null, facprove);
    });
}


// putFacturaAntproveToNull
//establece a null erl antprove de una factura

module.exports.putFacturaAntproveToNull = function (facprove, callback) {
    
    var connection = getConnection();
    sql = "UPDATE facprove SET ? WHERE facproveId = ?";
    sql = mysql.format(sql, [facprove, facprove.facproveId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        } else {
            callback(null, result);
        }
    });
}


// deleteFactura
// Elimina el prefactura con el id pasado
module.exports.deleteFactura = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from facprove WHERE facproveId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

module.exports.del = function (file, done) {
    var filename = path.join(__dirname, '../../public/ficheros/facturas_proveedores/' + file);
    fs.unlinkSync(filename);
    done(null);
}

// deletePrefacturasContrato
// Elimina todas las prefacturas pertenecientes a un contrato.
module.exports.deletePrefacturasContrato = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from prefacturas WHERE contratoClienteMantenimientoId = ? AND generada = 1";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

/*
|---------------------------------------|
|                                       |
|  LINEAS FACTURA                    |
|                                       |
|---------------------------------------|
*/


// comprobarFacturaLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarFacturaLinea(facproveLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof facproveLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && facproveLinea.hasOwnProperty("facproveId"));
    comprobado = (comprobado && facproveLinea.hasOwnProperty("facproveLineaId"));
    comprobado = (comprobado && facproveLinea.hasOwnProperty("linea"));
    comprobado = (comprobado && facproveLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && facproveLinea.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && facproveLinea.hasOwnProperty("porcentaje"));
    comprobado = (comprobado && facproveLinea.hasOwnProperty("descripcion"));
    comprobado = (comprobado && facproveLinea.hasOwnProperty("cantidad"));
    comprobado = (comprobado && facproveLinea.hasOwnProperty("importe"));
    comprobado = (comprobado && facproveLinea.hasOwnProperty("totalLinea"));
    return comprobado;
}

// comprobarFacturaReten
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.

function comprobarFacturareten(facproveReten) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof facproveReten;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && facproveReten.hasOwnProperty("facproveId"));
    comprobado = (comprobado && facproveReten.hasOwnProperty("facproveRetencionId"));
    comprobado = (comprobado && facproveReten.hasOwnProperty("baseRetencion"));
    comprobado = (comprobado && facproveReten.hasOwnProperty("porcentajeRetencion"));
    comprobado = (comprobado && facproveReten.hasOwnProperty("importeRetencion"));
    return comprobado;
}

// getNextFacturaLine
// busca el siguiente número de línea de la factura pasada
module.exports.getNextFacturaLineas = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT MAX(linea) as maxline FROM facprove_lineas"
    sql += " WHERE facproveId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
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
// Devuelve todas las líneas de una factura
module.exports.getFacturaLineas = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM facprove_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.facproveId = ?";
    sql += " ORDER by linea";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// getPrefacturaLinea
// Devuelve la línea de factura solcitada por su id.
module.exports.getFacturaLinea = function (id, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM facprove_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.facproveLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// postFacturaLinea
// crear en la base de datos la linea de prefactura pasada
module.exports.postFacturaLinea = function (facproveLinea, callback) {
    if (!comprobarFacturaLinea(facproveLinea)) {
        var err = new Error("La linea de factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    facproveLinea.facproveLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO facprove_lineas SET ?";
    sql = mysql.format(sql, facproveLinea);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        facproveLinea.facproveLineaId = result.insertId;
        // actualizar las bases y cuotas
        fnActualizarBases(facproveLinea.facproveId, function (err, res) {
            if (err) {
                return callback(err);
            }
            fnActualizarRetenciones(facproveLinea.facproveId, function (err, res) {
                if (err) {
                    return callback(err);
                }
                callback(null, facproveLinea);
            });
            
        });
        
    });
}


// putFacturaLinea
// Modifica la linea de factura de proveedor según los datos del objeto pasado
module.exports.putFacturaLinea = function (id, facproveLinea, callback) {
    if (!comprobarFacturaLinea(facproveLinea)) {
        var err = new Error("La linea de prefactura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != facproveLinea.facproveLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE facprove_lineas SET ? WHERE facproveLineaId = ?";
    sql = mysql.format(sql, [facproveLinea, facproveLinea.facproveLineaId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(facproveLinea.facproveId, function (err, res) {
            if (err) {
                return callback(err);
            }
            
            fnActualizarRetenciones(facproveLinea.facproveId, function (err, res) {
                if (err) {
                    return callback(err);
                }
                callback(null, facproveLinea);
            });
        });
        
    });
}

// deleteFacturaLinea
// Elimina la linea de prefactura con el id pasado
module.exports.deleteFacturaLinea = function (id, facproveLinea, callback) {
    var connection = getConnection();
    sql = "DELETE from facprove_lineas WHERE facproveLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(facproveLinea.facproveId, function (err, res) {
            if (err) {
                return callback(err);
            }
            //actualizamos las retenciones
            fnActualizarRetenciones(facproveLinea.facproveId, function (err, res) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
}


// recalculo de línea de factura
module.exports.recalculoLineasFactura = function (prefacturaId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, done) {
    var con = getConnection();
    // Buscamos la líneas de la factura
    sql = " SELECT pf.coste as costeFacturaCompleta, pfl.*";
    sql += " FROM facprove as pf";
    sql += " LEFT JOIN facprove_lineas as pfl ON pfl.facproveId = pf.facproveId";
    sql += " WHERE pf.facproveId = ?";
    sql = mysql.format(sql, prefacturaId);
    con.query(sql, function (err, lineas) {
        con.end();
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
            if (linea.facproveLineaId == null) return
            exports.putFacturaLinea(linea.facproveLineaId, linea, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        }, function (err) {
            if (err) return done(err);
            done(null);
        });
    });

}

// getFacturaRetenciones
// Devuelve todas las retenciones de una factura
module.exports.getFacturaRetenciones = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT fr.*, tp.descripcion AS descripcion FROM facprove_retenciones AS fr";
    sql += " LEFT JOIN usuarios.wtiporeten AS tp ON tp.codigo = fr.codigoRetencion "
    sql += " WHERE fr.facproveId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


// getTiposRetencion
// Devuelve todos los tipos de retencion de la tabla usuarios.wtiposreten
module.exports.getTiposRetencion = function (callback) {
    var connection = conexion.getConnectionDb('usuarios');
    var facturas = null;
    sql = "SELECT * FROM wtiporeten";
    sql += " WHERE codigo IN (0,1,3)";
    connection.query(sql, function (err, tipos) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, tipos);
    });
}

//  getTipoRetencion
// Devuelve un tipo de retencion de la tabla usuarios.wtiposreten
module.exports.getTipoRetencion = function (codigo, callback) {
    var connection = conexion.getConnectionDb('usuarios');
    var facturas = null;
    sql = "SELECT * FROM wtiporeten";
    sql += " WHERE codigo = ?";
    sql = mysql.format(sql, codigo);
    connection.query(sql, function (err, tipo) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, tipo[0]);
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
var fnActualizarRetenciones = function (id, callback) {
    fnBorraRetenciones(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
        sql = "INSERT INTO facprove_Retenciones (facproveId, baseRetencion, porcentajeRetencion, importeRetencion, codigoRetencion, cuentaRetencion)";
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
            fnActualizarTotales(id, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        });
    })
}

// fnActualizarTotales
// Actuliza los campos de totales de la cabecera de factura de proveedores
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotales = function (id, callback) {
    var connection = getConnection();
    sql = "UPDATE facprove AS pf,";
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

// fnBorraBases
// elimina las bases y cuotas de una factura de proveedor
// antes de actualizarlas
var fnBorraBases = function (id, callback) {
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


// fnBorraReyenciones
// elimina las retenciones de una factura de proveedor
// antes de actualizarlas
var fnBorraRetenciones = function (id, callback) {
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

// getFacturaBases
// devuelve los regitros de bases y cutas de la 
// prefactura con el id pasado
module.exports.getFacturaBases = function (id, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pb.*, ti.nombre as tipo";
    sql += " FROM facprove_bases as pb";
    sql += " LEFT JOIN tipos_iva as ti ON ti.tipoIvaId = pb.tipoIvaId"
    sql += " WHERE facproveId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// -- Obtener número de factura de proveedor
// La idea es devolver la factura de proveedor con los campos ano y numero.
//luego creamos la referencia concatenendo dichos campos. El numero constará de 6 digitos
//completados con ceros
var fnGetNumeroFacprove = function (facprove, done) {
    var con = getConnection();
    var ano = moment(facprove.fecha_recepcion).year();
    sql = "SELECT MAX(numero) AS n FROM facprove";
    sql += " WHERE ano = ? AND empresaId = ?";
    sql = mysql.format(sql, [ano, facprove.empresaId]);
    con.query(sql, function (err, res) {
        con.end()
        if (err) return done(err);
        // actualizar los campos del objeto facprove
        facprove.numero = res[0].n +1;
        facprove.ano = ano;
        var referencia = estableceRef(facprove.numero, 7);
        facprove.ref = facprove.ano  + '-' + facprove.empresaId + referencia;
        done(null, facprove);
    });
}



var estableceRef = function (final, numdigitos) {
    var s1 = '-' + final;
    var n1 = s1.length;
    var n2 = numdigitos - n1 + 1;
    var s2 = Array(n2).join('0');
    var ref = '-' + s2 + final;
    return ref;
}

var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};

var guardaArchivo = function (doc, done) {
    var fromFile = path.join(__dirname, '../../public/ficheros/uploads/' + doc.file);
    var toFile = path.join(__dirname, '../../public/ficheros/facturas_proveedores/' + doc.ref + "." + doc.ext);
    try {
        fs.renameSync(fromFile, toFile);
    } catch(err) {

    }
}

var renombraArchivo = function (doc, done) {
    var fromFile = path.join(__dirname, '../../public/ficheros/facturas_proveedores/' + doc.oldFile);
    var toFile = path.join(__dirname, '../../public/ficheros/facturas_proveedores/' + doc.file);
    try{
        fs.renameSync(fromFile, toFile);
    } catch(err) {
        
    }
}

/*
|---------------------------------------|
|                                       |
|  LINEAS SERVICIADAS                   |
|                                       |
|---------------------------------------|
*/

function comprobarFacturaServiciada(serviciada) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof serviciada;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && serviciada.hasOwnProperty("facproveServiciadoId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("facproveId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("empresaId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("contratoId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("importe"));
    return comprobado;
}

module.exports.getserviciadasFactura = function (facproveId, callback) {
    var connection = getConnection();
    sql = "SELECT serv.facproveServiciadoId, emp.nombre as empresa, CONCAT(cont.referencia, ' / ', cont.direccion, ' / ', tpro.nombre) AS referencia, serv.importe";
    sql += " FROM facprove_serviciados AS serv";
    sql += " INNER JOIN empresas AS emp ON emp.empresaId = serv.empresaId";
    sql += " INNER JOIN contratos AS cont ON cont.contratoId = serv.contratoId";
    sql += " INNER JOIN tipos_proyecto AS tpro ON tpro.tipoProyectoId = cont.tipoProyectoId";
    sql += " WHERE facproveId = ?";
    sql = mysql.format(sql, facproveId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

module.exports.getserviciadaFactura = function (id, callback) {
    var connection = getConnection();
    sql = "SELECT * FROM facprove_serviciados";
    sql += " WHERE facproveServiciadoId = ?"
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
}


module.exports.postServiciada = function (serviciada, callback) {
    serviciada.facproveServiciadoId = 0; // fuerza el uso de autoincremento
    if (!comprobarFacturaServiciada(serviciada)) {
        var err = new Error("La Empresa serviciada de factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    sql = "INSERT INTO facprove_serviciados SET ?";
    sql = mysql.format(sql, serviciada);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}

module.exports.putServiciada = function (id, serviciada, callback) {
    var connection = getConnection();
    sql = "UPDATE facprove_serviciados SET ? WHERE facproveServiciadoId = ?";
    sql = mysql.format(sql, [serviciada, id]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, 'OK');
    });
}

module.exports.deleteServiciadas = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM facprove_serviciados";
    sql += " WHERE facproveServiciadoId = ?"
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null);
    });
}

// getPreContaFacturas
// obtiene las facturas no contabilizadas entre las fechas indicadas
module.exports.getPreContaFacturas = function (dFecha, hFecha, callback) {
    var connection = getConnection();
    var facturas = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "UPDATE facprove SET sel = 1";
    sql += " WHERE fecha >= ? AND fecha <= ?";
    sql += " AND noContabilizar = 0";
    sql += " AND contabilizada = 0";
    sql = mysql.format(sql, [dFecha, hFecha]);
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT f.*, f.numeroFacturaProveedor AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo, pro.IBAN as IBAN"
        sql += "  FROM facprove AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
        sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = f.proveedorId";
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        sql += " AND noContabilizar = 0";
        sql += " AND contabilizada = 0";
        sql = mysql.format(sql, [dFecha, hFecha]);
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            facturas = res;
            callback(null, facturas);
        });
    });
}

// ----------------- CONTABILIZACION
module.exports.postContabilizarFacturas = function (dFecha, hFecha, done) {
    var con = getConnection();
    var sql = "SELECT f.*, ser.facproveId AS serviciada, SUM(ser.importe) AS totalServiciado";
    sql += " FROM facprove as f";
    sql += " LEFT JOIN facprove_serviciados AS ser ON ser.facproveId = f.facproveId";
    sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
    sql += " AND sel = 1 AND contabilizada = 0 GROUP BY f.facproveId, serviciada";
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        var numfacprove = [];//guardara los numeros de factura de proveedor no contabilizados por no tener serviciadas
        for(var i=0; i < rows.length; i++) {
            if(rows[i].total != rows[i].totalServiciado){
                numfacprove.push(rows[i].numeroFacturaProveedor);
                rows.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
                i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
            }
        }
        if(rows.length > 0) {
             //eliminamos la propiedad serviciada para contabilizar la factura
             for(var j = 0; j < rows.length; j++) {
                delete rows[j].serviciada
                delete rows[j].totalServiciado
            }
            contabilidadDb.contabilizarFacturasProveedor(rows, function (err, result) {
                if (err) return done(err);
                if(result) return done(null, result);
                done(null, numfacprove);
            });
        } else {
            done(null, numfacprove);
        }
    });
}

//------------------------VISADAS----------------
module.exports.getVisadasFactura = function (visada, callback) {
    var connection = getConnection();
    sql = "SELECT f.*, f.numeroFacturaProveedor AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo, COALESCE(ant.ref, '') AS refAnticipo";
        sql += "  FROM facprove AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
        sql += " LEFT JOIN antprove as ant ON ant.facproveId = f.facproveId"
        sql += " WHERE f.visada = ?";
        sql += " order by f.fecha DESC, f.facproveId ASC"
        sql = mysql.format(sql, visada);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


// putFactura
// Modifica la factura de proveedor según los datos del objeto pasado
module.exports.putFacturaVisada = function (id, facprove,  callback) {
    if (!comprobarFacprove(facprove)) {
        var err = new Error("la factura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != facprove.facproveId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    if (err) {
        return callback(err);
    }
    
    sql = "UPDATE facprove SET ? WHERE facproveId = ?";
    sql = mysql.format(sql, [facprove, facprove.facproveId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, facprove);
    });
}

//ACTUALIZACION DE LINEAS DESDE ANTPROVE



// postFactura
// crear en la base de datos la factura de proveedor pasada
module.exports.postLineasDesdeAntprove= function (facproveId, antproveId, callback) {
    var formateo;
    var connection = getConnection();
    sql = "SELECT * FROM antprove_lineas WHERE antproveId = ? ";
    sql = mysql.format(sql, antproveId);
    connection.query(sql, function (err, facprove_li) {
            if (err) {
                return callback(err);
            } else {
                if(facprove_li.length > 0){
                connection.beginTransaction(function (err) {
                    
                    for(var i =0; i< facprove_li.length; i++) {
                        facprove_li[i].facproveId = facproveId
                
                        delete facprove_li[i].antproveId;
                        delete facprove_li[i].antproveLineaId
                        
                    } 

                      
                        
                    formateo = formateaValores(facprove_li);
            
                    
                    sql = "INSERT INTO facprove_lineas ("+formateo[0]+") values ?";
                    //sql = mysql.format(sql, facprove_li[0]);
                    connection.query(sql,[formateo[1]],function (err, facprove_li) {
                        if (err) {
                            return  connection.rollback( function () {callback(err) });
                        } else {
                            
                            sql = "SELECT * FROM antprove_bases WHERE antproveId = ? ";
                            sql = mysql.format(sql, antproveId);
                            connection.query(sql, function (err, facprove_bases) {
                               
                                if (err) {
                                    return  connection.rollback( function () {callback(err) });
                                } else {
                                    for(var j = 0; j < facprove_bases.length; j++) {
                                        facprove_bases[j].facproveId = facproveId
                                        facprove_bases[j].facproveBaseId = 0;
                                        delete facprove_bases[j].antproveId;
                                        delete facprove_bases[j].antproveBaseId;
                                    }
                                    

                                    var formateo2 = formateaValores(facprove_bases);

                            
                                    
                                    var sql2 = "INSERT INTO facprove_bases ("+formateo2[0]+") values ? ";
                                    sql2 = mysql.format(sql2, [formateo2[1]]);
                                    connection.query(sql2, function (err, facprove_li) {
                                        
                                        if (err) {
                                            return  connection.rollback( function () {callback(err) });
                                        } else {
                                            
                                            sql = "SELECT * FROM antprove_retenciones WHERE antproveId = ? ";
                                            sql = mysql.format(sql, antproveId);
                                            connection.query(sql, function (err, facprove_reten) {
                                                
                                                if (err) {
                                                    return  connection.rollback( function () {callback(err) });
                                                } else {
                                                    for(var k = 0;k < facprove_reten.length; k++ ) {
                                                        facprove_reten[k].facproveId = facproveId
                                    
                                                        delete facprove_reten[k].antproveId;
                                                        delete facprove_reten[k].antproveRetencionId;
                                                    }
                                                    
                                                    var formateo3 = formateaValores(facprove_reten);
                                                    
                                                    var sql3 = "INSERT INTO facprove_retenciones ("+formateo3[0]+") values ? ";
                                                    sql3 = mysql.format(sql3, [formateo3[1]]);
                                                    connection.query(sql3, function (err, result) {
                                                        
                                                        if (err) {
                                                            return  connection.rollback( function () {callback(err) });
                                                        } else {
                                                            
                                                            sql = "SELECT * FROM antprove_serviciados WHERE antproveId = ? ";
                                                            sql = mysql.format(sql, antproveId);
                                                            connection.query(sql, function (err, facprove_serv) {
                                                                
                                                                if (err) {
                                                                    return  connection.rollback( function () {callback(err) });
                                                                } else {
                                                                    if(facprove_serv.length > 0) {
                                                                        for(var l = 0; l < facprove_serv.length; l++ ) {
                                                                            facprove_serv[l].facproveId = facproveId
                                                    
                                                                            delete facprove_serv[l].antproveId;
                                                                            delete facprove_serv[l].antproveServiciadoId;
                                                                        }
                                                                        var formateo4 = formateaValores(facprove_serv);
                                                                        var sql4 = "INSERT INTO facprove_serviciados ("+formateo4[0]+") values ? ";
                                                                        sql4 = mysql.format(sql4, [formateo4[1]]);
                                                                        connection.query(sql4, function (err, result) {
                                                                            
                                                                            if (err) {
                                                                                return  connection.rollback( function () {callback(err) });
                                                                            } else {
                                                                                connection.commit(function (err) {
                                                                                    if (err) return con.rollback(function () {callback(err) });
                                                                                    callback(null, result);
                                                                                })
                                                                            }
                                                                    });
                                                                    } else {
                                                                        connection.commit(function (err) {
                                                                            if (err) return con.rollback(function () {callback(err) });
                                                                            callback(null, result);
                                                                        })
                                                                    }
                                                                    
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
                
                
                } else {
                    return callback(null, null)
                }
            }
        });
    
}

var formateaValores = function(obj) {
    var valuesNestedArray  = Object.keys(obj[0]);
    var propiedades = JSON.stringify(valuesNestedArray);
    propiedades = propiedades.replace(/['"\[\]]+/g, '');
    propiedades = propiedades.replace(/['"]+/g, '');
    var values = []
    var intoValues = []
    var result = [];
                    
    for(var j =0; j< obj.length; j++) {
        intoValues = [];
        for(var i=0; i<valuesNestedArray.length; i++) {
            intoValues.push(obj[j][valuesNestedArray[i]])
        }
        values.push(intoValues);
    }

    result.push(propiedades);
    result.push(values);

    return result;
}


// postFactura
// crear en la base de datos la factura de proveedor pasada
module.exports.deleteLineasDesdeAntprove= function (facproveId, antproveId, callback) {
    var connection = getConnection();
    sql = "DELETE  FROM facprove_lineas WHERE facproveId = ? ";
    sql = mysql.format(sql, facproveId);
    connection.query(sql, function (err, result) {
            if (err) {
                return callback(err);
            } else {
                        sql = "DELETE  FROM facprove_bases WHERE facproveId = ? ";
                        sql = mysql.format(sql, facproveId);
                        connection.query(sql, function (err, result2) {
                            if (err) {
                                return callback(err);
                            } else {
                                        sql = "DELETE  FROM facprove_retenciones WHERE facproveId = ? ";
                                        sql = mysql.format(sql, facproveId);
                                        connection.query(sql, function (err, result3) {
                                            
                                            if (err) {
                                                return callback(err);
                                            } else {
                                                    sql = "DELETE FROM facprove_serviciados WHERE facproveId = ? ";
                                                    sql = mysql.format(sql, facproveId);
                                                    connection.query(sql, function (err, result4) {
                                                        connection.end();
                                                        if (err) {
                                                            return callback(err);
                                                        } else {    
                                                                return callback(null, result4)
                                                            }
                                                    });
                                                }
                                        });
                                    }
                        });
                    }
    });
        
}



