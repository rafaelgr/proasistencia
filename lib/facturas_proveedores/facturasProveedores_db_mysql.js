// facturasProveedores_db_mysql
// Manejo de la tabla facturas de proveedores en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");

var fs = require("fs"),
    path = require("path");

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var config2 = require("../../config.json");
var fs = require('fs');

var sql = "";
var Stimulsoft = require('stimulsoft-reports-js');

var ioAPI = require('../ioapi/ioapi');

var correoAPI = require('../correoElectronico/correoElectronico');

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function (err) {
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
    sql += " ORDER BY pf.fecha";
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

module.exports.getTipoCliente = function(contratoId, callback){
    var connection = getConnection();
    sql = "SELECT con.clienteId as cliente, cli.tipoclienteId as tipoCliente FROM contratos AS con INNER JOIN clientes AS cli ON con.clienteId = cli.clienteId";
    sql += " WHERE con.contratoId = ?";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }else{
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
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM facprove AS pf";
    sql += " LEFT JOIN facprove AS f ON f.facproveId = pf.facproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
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
    Stimulsoft.StiOptions.WebServer.url = "http://" + config2.apiHost + ":" + config2.stiPort;
    //console.log("SSTISER: ", Stimulsoft.StiOptions.WebServer.url);
    //Stimulsoft.StiOptions.WebServer.url = "http://localhost:5000/api/streport";
    //Stimulsoft.StiOptions.WebServer.url = "http://localhost:9615";
    //Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../Localization/es.xml", true);
    Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHltN9ZO4D78QwpEoh6+UpBm5mrGyhSAIsuWoljPQdUv6R6vgv" +
        "iStsx8W3jirJvfPH27oRYrC2WIPEmaoAZTNtqb+nDxUpJlSmG62eA46oRJDV8kJ2cJSEx19GMJXYgZvv7yQT9aJHYa" +
        "SrTVD7wdhpNVS1nQC3OtisVd7MQNQeM40GJxcZpyZDPfvld8mK6VX0RTPJsQZ7UcCEH4Y3LaKzA5DmUS+mwSnjXz/J" +
        "Fv1uO2JNkfcioieXfYfTaBIgZlKecarCS5vBgMrXly3m5kw+YwpJ2v+cMXuDk3UrZgrdxNnOhg8ZHPg9ijHxqUomZZ" +
        "BzKpVQU0d06ne60j/liMH5KirAI2JCVfBcBvIcyliJos8LAWr9q/1sPR9y7LmA1eyS1/dXaxmEaqi5ubhLqlf+OS0x" +
        "FX6tlBBgegqHlIj6Fytwvq5YlGAZ0Cra05JhnKh/ohYlADQz6Jbg5sOKyn5EbejvPS3tWr0LRBH2FO6+mJaSEAwzGm" +
        "oWT057ScSvGgQmfx8wCqSF+PgK/zTzjy75Oh";
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    con.query(sql, function (err, result) {
        con.end();
        if (err) return callback(err, null);
        facturas = result;
        async.forEachSeries(facturas, function (f, done1) {
            var report = new Stimulsoft.Report.StiReport();
            var file = config2.reports_dir + "\\" + "facturaProveedor_general.mrt";
            report.loadFile(file);
            var connectionString = "Server=" + config2.report.host + ";";
            connectionString += "Database=" + config2.report.database + ";"
            connectionString += "UserId=" + config2.report.user + ";"
            connectionString += "Pwd=" + config2.report.password + ";";
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

                fs.writeFileSync(config2.factura_dir + "\\" + f.nomfich + ".pdf", buffer);
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
        if(doc){
            facprove.nombreFacprovePdf = facprove.ref +'.'+ doc.ext;
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
            if(doc){
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
        if(err){
            return callback(err);
        }
        if(doc){
            facprove.nombreFacprovePdf = facprove.ref +'.'+ doc.ext;
        }
        sql = "UPDATE facprove SET ? WHERE facproveId = ?";
        sql = mysql.format(sql, [facprove, facprove.facproveId]);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }else{
                if(doc){
                    doc.ref = facprove.ref;
                    guardaArchivo(doc);
                }
            }
            callback(null, facprove);
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
            callback(null, facproveLinea);
        })
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
            callback(null, facproveLinea);
        })
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
            callback(null);
        })
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
            if(linea.facproveLineaId == null) return
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
    if (tipoClienteId == 1){
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
    sql += " (SELECT facproveId, SUM(coste) AS sc";
    sql += " FROM facprove_lineas GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
    sql += " pf.coste = pf3.sc";
    sql += " WHERE pf.facproveId = ?";
    sql += " AND pf2.facproveId = pf.facproveId";
    sql += " AND pf3.facproveId = pf.facproveId";
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
        // con el año hay que obtener el número
        var ano = moment(facprove.fecha_recepcion).year();
        sql = "SELECT COALESCE(MAX(numero) + 1, 1) AS n FROM facprove";
        sql += " WHERE ano = ?";
        sql = mysql.format(sql, ano);
        con.query(sql, function (err, res) {
            con.end();
            if (err) return done(err);
            // actualizar los campos del objeto facprove
            facprove.numero = res[0].n;
            facprove.ano = ano;
            var referencia = estableceRef(facprove.numero, 7);
            facprove.ref = facprove.ano + referencia;
            done(null, facprove);
        })
    
}

var estableceRef = function (final, numdigitos) {
    var s1 = '-'  + final;
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
    fs.renameSync(fromFile, toFile);
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

module.exports.getserviciadasFactura = function(facproveId, callback) {
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

module.exports.getserviciadaFactura = function(id, callback){
    var connection = getConnection();
    sql = "SELECT * FROM facprove_serviciados";
    sql+= " WHERE facproveServiciadoId = ?"
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
}


module.exports.postServiciada = function(serviciada, callback) {
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

module.exports.putServiciada = function(id, serviciada, callback){
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

module.exports.deleteServiciadas = function(id, callback) {
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