// facturasProveedores_db_mysql
// Manejo de la tabla facturas de proveedores en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");
var comun = require('../comun/comun.js');

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
    sql += " ORDER BY  pf.ano DESC, pf.ref ASC";
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

// getFacturasProveedoresReparaciones
// devuelve las facturas de reparaciones
module.exports.getFacturasProveedoresReparaciones = function (callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " CONCAT(COALESCE(pf.ano,' '),'-',COALESCE(CAST(pf.serie AS CHAR(50)),' '),'-',COALESCE(CAST(pf.numero AS CHAR(50)),' ')) AS numero,";
    sql += " fp.nombre AS formaPagoNombre";
    sql += " FROM facprove AS pf";
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
        facturas = result;
        callback(null, facturas);
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
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo, ant.numeroAnticipoProveedor as anticipo, f.antproveId, p.IBAN";
    sql += " FROM facprove AS pf";
    sql += " LEFT JOIN facprove AS f ON f.facproveId = pf.facproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " LEFT JOIN antprove as ant ON f.facproveId = ant.facproveId"
    sql += " LEFT JOIN proveedores as p ON p.proveedorId = pf.proveedorId"
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


module.exports.getFacPdf = function (dFecha, hFecha, empresaId, proveedorId, departamentoId, usuario, callback) {
    var con = getConnection();
    var facturas = null;
    sql = "SELECT pf.*, fp.nombre AS formaPagoNombre,";
    sql += " e.nombre as nombreEmpresa, e.email as correoEmpresa, e.infFacturas, e.infFacCliRep, e.plantillaCorreoFacturas, e.asuntoCorreo, ";
    sql += " pro.nombre as nombreProveedor, pro.correo as correoProveedor,";
    sql += " IF( pf.numeroFacturaProveedor IS NULL, CONCAT(REPLACE(pf.numeroFacturaProveedor2, '/', '-'), '@',pro.proveedorId), CONCAT(REPLACE(pf.numeroFacturaProveedor, '/', '-'), '@',pro.proveedorId)) AS nomfich";
    sql += " FROM facprove AS pf";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = pf.empresaId";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = pf.proveedorId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId"
    // -- modificar sql según parámetros
    sql += " WHERE TRUE"
    if (proveedorId != 0) {
        sql += " AND pf.proveedorId = " + proveedorId;
    }
    if (empresaId != 0) {
        sql += " AND pf.empresaId = " + empresaId;
    }
    if (dFecha) {
        sql += " AND pf.fecha >= '" + dFecha + " 00:00:00'";
    }
    if (hFecha) {
        sql += " AND pf.fecha <= '" + hFecha + " 23:59:59'";
    }
    if(departamentoId && departamentoId > 0) {
        sql += " AND pf.departamentoId =" + departamentoId;
    } else {
        sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+")"
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
            var file = process.env.REPORTS_DIR + "\\prefactpro_reparaciones.mrt";
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
            report.dataSources.items[pos].sqlCommand = sql + " WHERE pf.facproveId = " + f.facproveId;
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

                fs.writeFileSync(process.env.FACTURA_PROVEEDOR_EXPORTADOS_DIR + "\\" + f.nomfich + ".pdf", buffer);
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
    var sql = "UPDATE facprove SET ? WHERE facproveId = ?";
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
            if (doc && doc.oldFile) {
                renombraArchivo(doc);
            }
            callback(null, facprove); 
        }
    });
}


// putFacturaAntproveToNull
//establece a null erl antprove de una factura

module.exports.putFacturaAntproveToNull = function (facprove, callback) {

    var connection = getConnection();
    var sql = "UPDATE facprove SET ? WHERE facproveId = ?";
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
    restaFianza(id, function(err, result) {
        if(err) return callback(err);
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
    });
}

// deleteFacturaParte
// Elimina el factura con el id pasado y actuliza los partes asociados
module.exports.deleteFacturaParte = function (id, factura, callback) {
    var connection = getConnection();
    var facproveLineas;
    connection = getConnection();
    var sql = "UPDATE partes set fecha_factura_profesional = NULL, numero_factura_profesional = NULL WHERE facproveId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        connection = getConnection();
        sql = "DELETE from facprove WHERE facproveId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });


    /*connection = getConnection();
    sql = "SELECT facproveLineaId FROM facprove_lineas  WHERE facproveId = ?"//recuperamos las ids de las lineas asociadas a la facprove
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        if (err) return callback(err);
        facproveLineas = result;
        async.eachSeries(facproveLineas, function (facproveLinea, callback2) {//borramos las lineas de facprove
            deleteUnaFacproveLineaConParte(facproveLinea.facproveLineaId, factura, function (err, done) {
                if (err) return callback(err)
                callback2();
            });
        }, function (err) {
            if (err) return callback(err);//una vez borradas las lineas correspondientes de la factura borraos la factura de proveedor
            connection = getConnection();
            sql = "UPDATE partes set fecha_factura_profesional = NULL, numero_factura_profesional = NULL WHERE facproveId = ?";
            sql = mysql.format(sql, id);
            connection.query(sql, function (err, result) {
                closeConnectionCallback(connection, callback);
                if (err) {
                    return callback(err);
                }
                connection = getConnection();
                sql = "DELETE from facprove WHERE facproveId = ?";
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
}


var borraFacturasAsociadas = (facturas, done) => {
    var con = getConnection();
    var sql;
    async.eachSeries(facturas, function (factura, callback2) {
        if (factura != null) {
            sql = "UPDATE partes set fecha_factura_cliente = NULL, numero_factura_cliente = NULL  WHERE facturaId = ?";
            sql = mysql.format(sql, factura);
            con.query(sql, function (err) {
                if (err) return callback2(err);
                sql = "DELETE from facturas WHERE facturaId = ?;";
                sql = mysql.format(sql, factura);
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
        if (err) { return done(err); }
        return done(null, null);
    }
    );
}

module.exports.deleteFacproveLineaConParte = function (id, facproveLinea, callback) {
    deleteUnaFacproveLineaConParte(id, facproveLinea, function (err, done) {
        if (err) return callback(err)
        callback(null);
    });
}

// deleteFacproveLineaConParte
// elimina un linea de factura de proveedor de la base de datos y su correspondiente linea de factura, si existe.
var deleteUnaFacproveLineaConParte = function (id, facproveLinea, callback) {
    var articuloId;
    var parteId;
    var facturaIds = [];
    var facturaId;
    var facturaLineaId;
    var connection = getConnection();
    sql = "SELECT DISTINCT facturaId FROM partes  WHERE facproveId = ? AND facproveId IS NOT NULL";//primero recuperamos las ids de las facturas de proveedores de los partes, si las tiene
    sql = mysql.format(sql, facproveLinea.facproveId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                facturaIds.push(result[i].facturaId);
            }
            connection = getConnection();
            sql = "SELECT fl.articuloId,ar.codigoReparacion, fl.totalLinea, fl.facproveId, par.parteId";//si hay facturas de proveedores recuperamos la id del del artiulo
            sql += " FROM facprove_lineas AS fl"
            sql += " LEFT JOIN articulos AS ar ON ar.articuloId = fl.articuloId";
            sql += " LEFT JOIN partes AS par ON par.facproveId = fl.facproveId";
            sql += " LEFT JOIN partes_lineas AS pl ON pl.parteId = par.parteId"
            sql += " WHERE fl.facproveId = ? AND fl.facproveLineaId = ? AND pl.`importeProveedor` = fl.totalLinea"
            sql = mysql.format(sql, [facproveLinea.facproveId, id]);
            connection.query(sql, function (err, result) {
                closeConnectionCallback(connection, callback);
                if (err) {
                    return callback(err);
                }
                articuloId = result[0].articuloId;
                parteId = result[0].parteId;
                connection = getConnection();
                sql = "SELECT facturaLineaId, fl.facturaId FROM facturas_lineas AS fl";//recuperamos la linea del la factura que queremos borrar
                sql += " LEFT JOIN partes AS par ON par.facturaId = fl.facturaId";
                sql += "  WHERE  articuloId = ? AND fl.facturaId IN (?) AND par.parteId = ?"
                sql = mysql.format(sql, [articuloId, facturaIds, parteId]);
                connection.query(sql, function (err, result) {
                    closeConnectionCallback(connection, callback);
                    if (err) {
                        return callback(err);
                    }
                    if (result.length > 0) {//si existe la linea en la factura de proveedor
                        facturaLineaId = result[0].facturaLineaId;
                        facturaId = result[0].facturaId;
                        //borramos la linea
                        connection = getConnection();
                        sql = "DELETE from facprove_lineas WHERE facproveLineaId = ?";
                        sql = mysql.format(sql, id);
                        connection.query(sql, function (err, result) {
                            closeConnectionCallback(connection, callback);
                            if (err) {
                                return callback(err);
                            }
                            // actualizar las bases y cuotas
                            fnActualizarBases(facproveLinea.facproveId, function (err, res) {
                                if (err) {
                                    return callback(err);
                                }
                                connection = getConnection();//borramos la linea de facprove
                                sql = "DELETE from facturas_lineas WHERE facturaLineaId = ?";
                                sql = mysql.format(sql, facturaLineaId);
                                connection.query(sql, function (err, result) {
                                    closeConnectionCallback(connection, callback);
                                    if (err) {
                                        return callback(err);
                                    }
                                    // actualizar las bases y cuotas
                                    fnActualizarBasesFactura(facturaId, function (err, res) {
                                        if (err) {
                                            return callback(err);
                                        }
                                        //una vez borrada la linea comprobamos que la cabecera de la factura tenga lineas
                                        connection = getConnection();
                                        var sql2 = " SELECT * FROM facturas_lineas where facturaId = ?"
                                        sql2 = mysql.format(sql2, facturaId)
                                        connection.query(sql2, function (err, result) {
                                            closeConnectionCallback(connection, callback);
                                            if (err) return callback(err);
                                            if (result.length == 0) {
                                                connection = getConnection();
                                                sql2 = "UPDATE partes set fecha_factura_cliente = NULL, numero_factura_cliente = NULL  WHERE facturaId = ?";
                                                sql2 = mysql.format(sql2, facturaId);
                                                connection.query(sql2, function (err) {
                                                    closeConnectionCallback(connection, callback);
                                                    if (err) return callback(err);
                                                    connection = getConnection();
                                                    sql2 = " DELETE FROM facturas where facturaId = ?"
                                                    sql2 = mysql.format(sql2, facturaId)
                                                    connection.query(sql2, function (err, result) {
                                                        closeConnectionCallback(connection, callback);
                                                        if (err) return callback(err);
                                                        callback(null)
                                                    });

                                                });
                                            } else {
                                                callback(null);
                                            }
                                        });

                                    });
                                });
                            })
                        });
                    } else {//si no existe la linea de factura correspondiente solo boramos la de la facprove
                        connection = getConnection();
                        sql = "DELETE from facprove_lineas WHERE facproveLineaId = ?";
                        sql = mysql.format(sql, id);
                        connection.query(sql, function (err, result) {
                            closeConnectionCallback(connection, callback);
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
                });
            });

        } else {
            connection = getConnection();
            sql = "DELETE from facprove_lineas WHERE facproveLineaId = ?";
            sql = mysql.format(sql, id);
            connection.query(sql, function (err, result) {
                closeConnectionCallback(connection, callback);
                if (err) {
                    return callback(err);
                }
                // actualizar las bases y cuotas
                fnActualizarBases(facproveLinea.facproveLineaId, function (err, res) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                })
            });
        }
    });
}

// fnActualizarBasesFactura
// Actuliza la tabla de bases y cuotas de la factura pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBasesFactura = function (id, callback) {
    fnBorraBasesFactura(id, function (err, res) {
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
            fnActualizarTotalesFactura(id, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        });
    })
}

// fnActualizarTotalesFactura
// Actuliza los campos de totales de la cabecera de factura
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotalesFactura = function (id, callback) {
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

// fnBorraBasesFactura
// elimina las bases y cuotas de una factura
// antes de actualizarlas
var fnBorraBasesFactura = function (id, callback) {
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



module.exports.del = function (file, done) {
    var filename = path.join(__dirname, '../../public/ficheros/facturas_proveedores/' + file);
    fs.unlinkSync(filename);
    done(null);
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

// Arreglo para llamadas en las que falta el identificador de proveedor
// Hay que obtenerlo a partir del facproveId
function obtenerProveedorIdDesdeFacproveId(facproveId, done) {
    var connection = getConnection();
    sql = "SELECT * from facprove WHERE facproveId = ?;";
    sql = mysql.format(sql, facproveId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return done(err, null);
        } else if (result.length === 0) {
            return done(new Error('No existe factura de proveedor con id ' + facproveId));
        } else {
            done(null, result[0].proveedorId);
        }

    });
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
            // LLAMADA CON FALTA PARAMETRO [CORREGIDA VRS 2.2.43]
            obtenerProveedorIdDesdeFacproveId(facproveLinea.facproveId, function (err, res) {
                if (err) { return callback(err) }
                var proveedorId = res;
                fnActualizarRetenciones(facproveLinea.facproveId, proveedorId, function (err, res) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, facproveLinea);
                });
            })
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
    var sql = "UPDATE facprove_lineas SET ? WHERE facproveLineaId = ?";
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

            // LLAMADA CON FALTA PARAMETRO
            obtenerProveedorIdDesdeFacproveId(facproveLinea.facproveId, function (err, res) {
                if (err) { return callback(err); }
                var proveedorId = res;
                fnActualizarRetenciones(facproveLinea.facproveId, proveedorId, function (err, res) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, facproveLinea);
                });

            })
        });

    });
}


// putFacturaCabDesdeParte
// Modifica la cabecera de factura de proveedor  desde un parte modificado
module.exports.putFacturaCabDesdeParte = function (datos, callback) {
    var facproveId;
    var connection = getConnection();
    var sql = "SELECT";
    sql += " SUM(par.aCuentaProfesional) as contado";
    sql += " ,totalConIva-SUM(par.aCuentaProfesional)-importeAnticipo-fianza AS restoPagar"
    sql += " FROM partes AS par";
    sql += " LEFT JOIN facprove AS fac ON fac.facproveId = par.facproveId";
    sql += " WHERE par.facproveId = ?";
    sql += " GROUP BY par.facproveId";
    sql = mysql.format(sql, [datos.facproveId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        var obj = {
            contado: result[0].contado,
            restoPagar: result[0].restoPagar,
            formaPagoId: datos.formaPagoProfesionalId
        }
        connection = getConnection();
        sql = "UPDATE facprove SET ? WHERE facproveId = ?";
        sql = mysql.format(sql, [obj, datos.facproveId]);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    });
}

// putFacturaLineaDesdeParte
// Modifica la linea de factura de proveedor  desde una linea de parte modificada
module.exports.putFacturaLineaDesdeParte = function (datos, proveedorId, callback) {
    var facproveId;
    var connection = getConnection();
    var sql = "SELECT par.facproveId, pt.descripcion AS descripcion, pt.unidades AS cantidad,ar.articuloId AS articuloId,pt.tipoIvaProveedorId AS tipoIvaId, pt.ivaProveedor AS porcentaje, ar.unidadId,";
    sql += " pt.precioProveedor AS importe,  pt.importeProveedor AS coste, pt.importeProveedor AS totalLinea ,ga.nombre AS capituloLinea ";
    sql += " FROM partes AS par";
    sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
    sql += " LEFT JOIN partes_lineas AS pt ON pt.parteId = par.parteId"
    sql += " LEFT JOIN articulos AS ar ON ar.codigoReparacion = pt.codigoArticulo";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = ar.unidadId";
    sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoarticuloId = ar.grupoArticuloId"
    sql += " WHERE pt.facproveLineaId = ?";
    sql = mysql.format(sql, [datos.facproveLineaId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        facproveId = result[0].facproveId;
        delete result[0].facproveId;
        connection = getConnection();
        sql = "UPDATE facprove_lineas SET ? WHERE facproveLineaId = ?";
        sql = mysql.format(sql, [result[0], datos.facproveLineaId]);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            // actualizar las bases y cuotas
            fnActualizarBases(facproveId, function (err, res) {
                if (err) {
                    return callback(err);
                }
                // LLAMADA BUENA
                fnActualizarRetenciones(facproveId, proveedorId, function (err, res) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, result);
                });
            });

        });
    });
}

// postFacturaLineaDesdeParte
// Modifica la linea de factura  desde una linea de parte modificada
module.exports.postFacturaLineaDesdeParte = function (facproveId, lineaParteId, proveedorId, callback) {
    var connection = getConnection();
    sql = "SELECT par.facproveId, pt.descripcion AS descripcion, pt.unidades AS cantidad,ar.articuloId AS articuloId,pt.tipoIvaProveedorId AS tipoIvaId, pt.ivaProveedor AS porcentaje, ar.unidadId,";
    sql += " pt.precioProveedor AS importe,  pt.importeProveedor AS coste, pt.importeProveedor AS totalLinea ,ga.nombre AS capituloLinea ";
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
        sql = "SELECT MAX(linea) AS num from facprove_lineas WHERE facproveId = ?";
        sql = mysql.format(sql, facproveId);
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
            sql = "INSERT INTO facprove_lineas SET ?";
            sql = mysql.format(sql, [result[0]]);
            connection.query(sql, function (err, result2) {
                connection.end();
                if (err) {
                    return callback(err);
                }
                //actualizamos la linea del parte con la id de la lineas de factura acabada de crear
                connection = getConnection();
                sql = "UPDATE partes_lineas set facproveLineaId = ? WHERE parteLineaId = ?";
                sql = mysql.format(sql, [result2.insertId, lineaParteId]);
                connection.query(sql, function(err, result3) {
                    connection.end();
                    if(err) return callback(err);
                    // actualizar las bases y cuotas
                    fnActualizarBases(facproveId, function (err, res) {
                        if (err) {
                            return callback(err);
                        }
                        fnActualizarRetenciones(facproveId, proveedorId, function (err, res) {
                            if (err) {
                                return callback(err);
                            }
                            callback(null, res);
                        });
                    });

                });
            });
        });
    });
}
 
//creacion d e report json
module.exports.postCrearReport = function (dFecha, hFecha, proveedorId, empresaId, tipoIvaId, conta, orden, departamentoId, usuarioId, callback) {
    var connection = getConnection();
    var obj = 
        {
            libPro: ""
        }
    var sql = "SELECT  f.empresaId,  f.ref AS referencia, emp.nombre AS empresaNombre, f.facproveId,  f.fecha_recepcion, `numeroFacturaProveedor`,  COALESCE(`numregisconta`, 0) AS `numregisconta`,";
	sql += " `emisorNombre`,  ti.nombre AS tipoIva, f.totalConIva, pro.cuentaContable,  fb.porcentaje AS porcentaje,  IF(ti.nombre='SUPLIDOS', 0, fb.base)  AS basFact, fb.cuota, fr.`importeRetencion`,  IF(ti.nombre='SUPLIDOS', fb.base, 0)  AS suplidos";
    sql += " FROM facprove AS f";
    sql += " LEFT JOIN facprove_bases AS fb ON fb.facproveId = f.facproveId";
    sql += " LEFT JOIN facprove_retenciones AS fr ON (fr.facproveId = fb.facproveId AND fr.porcentajeRetencion <> 0)";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = f.proveedorId"
    sql += "  LEFT JOIN `tipos_iva` AS ti ON ti.tipoIvaId = fb.tipoIvaId";
    sql += " LEFT JOIN empresas AS emp ON emp.empresaId = f.empresaId";

    if(departamentoId && departamentoId > 0) {
        sql += " WHERE f.departamentoId =" + departamentoId;
    } else {
        sql += " WHERE f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
   
        if (proveedorId > 0) {
            sql += " AND f.proveedorId IN (" + proveedorId + ")";
        }
        if (empresaId) {
            sql += " AND f.empresaId IN (" + empresaId + ")";
        }
        if (dFecha) {
            sql += " AND f.fecha_recepcion >= '" + dFecha + " 00:00:00'";
        }
        if (hFecha) {
            sql += " AND f.fecha_recepcion <= '" + hFecha + " 23:59:59'";
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


        sql += " ORDER BY "+ orden+" ASC";

    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        obj.libPro = procesaResultado(result);
        /*   var resultado = JSON.stringify(obj);
        fs.writeFile(process.env.REPORTS_DIR + "\\listadoPro.json", resultado, function(err) {
            if(err) return callback(err);
            //return callback(null, true);
        });
         */
        callback(null, obj);
    });
 
}

var procesaResultado = (result) => {
    var antfacid = null;
    result.forEach(e => {
        e.duplicado = false;
        e.fecha_recepcion = moment(e.fecha_recepcion).format('DD/MM/YYYY'); 
        if(e.facproveId == antfacid) {
            e.importeRetencion = 0;
            e.duplicado = true;
            //e.basFact = 0;
            //e.cuota = 0;
            //totalConIva = 0;
        }
        antfacid = e.facproveId;
    });
    return result;
}


var fnActualizarFianza = function (facproveId, proveedorId, callback) {
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
        fnActualizarTotales(id, function (err, result) {
            if (err) return callback(err);
            callback(null);
        })
    });
}

var fnObtieneParametrosFianza = function (proveedorId, facproveId, callback) {
    var connection = getConnection();
    var sql2 = " SELECT pro.proveedorId, pro.fianza, fianzaAcumulada, retencionFianza, fc.fianza AS fianzaFacprove FROM proveedores AS pro ";
    sql2 += " INNER JOIN facprove AS fc ON fc.proveedorId = pro.proveedorId";
    sql2 += " WHERE pro.proveedorId = " + proveedorId + " AND facproveId = " + facproveId;

    connection.query(sql2, function (err, res) {
        connection.end();
        if (err) return callback(err);
        callback(null, res);
    });;
}

// deleteFacturaLinea
// Elimina la linea de facprove con el id pasado
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
            // LLAMADA CON FALTA PARAMETRO [CORREGIDA VRS 2.2.43]
            obtenerProveedorIdDesdeFacproveId(facproveLinea.facproveId, function (err, res) {
                if (err) { return callback(err); }
                var proveedorId = res;
                fnActualizarRetenciones(facproveLinea.facproveId, proveedorId, function (err, res) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            })
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
    sql = "SELECT *, codigo AS codigoRetencion FROM wtiporeten";
    sql += " WHERE codigo IN (0,1,3,8,9)";
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
    sql = "SELECT *, codigo AS codigoRetencion FROM wtiporeten";
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
        sql += " GROUP BY tipoIvaId, porcentaje) AS pl";
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
var fnActualizarRetenciones = function (id, proId, callback) {
    fnBorraRetenciones(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
        // VRS 2.2.43 Antes solo había un group by codigoRetencion (error para SQL)
        sql = "INSERT INTO facprove_retenciones (facproveId, baseRetencion, porcentajeRetencion, importeRetencion, codigoRetencion, cuentaRetencion)";
        sql += " SELECT pl.facproveId, COALESCE(pl.baseRetencion, 0), pl.porcentajeRetencion, pl.importeRetencion, pl.codigoRetencion, pl.cuentaRetencion";
        sql += " FROM";
        sql += " (SELECT facproveId, SUM(importeRetencion) AS importeRetencion,  porcentajeRetencion, ROUND(SUM(totalLinea),2) AS baseRetencion, codigoRetencion, cuentaRetencion";
        sql += " FROM facprove_lineas";
        sql += " WHERE facproveId = ?";
        sql += " GROUP BY codigoRetencion, porcentajeRetencion, codigoRetencion, cuentaRetencion) AS pl";
        sql += " ON DUPLICATE KEY UPDATE baseRetencion = pl.baseRetencion, importeRetencion = pl.importeRetencion, codigoRetencion = pl.codigoRetencion, cuentaRetencion = pl.cuentaRetencion";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            // Antes de volver actualizamos los totales y así está hecho
            fnActualizarTotales(id, proId, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        });
    })
}

// fnActualizarTotales
// Actuliza los campos de totales de la cabecera de factura de proveedores
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotales = function (id, proveedorId, callback) {
    fnObtieneParametrosFianza(proveedorId, id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var datosFianza = res[0];
        var porcen = datosFianza.retencionFianza / 100;

        var connection = getConnection();
        var sql = "UPDATE facprove AS pf,";
        sql += " (SELECT facproveId, SUM(base) AS b, SUM(cuota) AS c";
        sql += " FROM facprove_bases GROUP BY 1) AS pf2,";

        sql += " (SELECT facproveId, SUM(coste) AS sc";
        sql += " FROM facprove_lineas GROUP BY 1) AS pf3,";

        sql += " (SELECT facproveId, COALESCE(SUM(importeRetencion), 0 ) AS ir";
        sql += " FROM facprove_retenciones GROUP BY 1) AS pf4";


        sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c - pf4.ir,";
        sql += " pf.coste = pf3.sc, pf.importeRetencion = pf4.ir,";
        sql += " pf.restoPagar = (pf2.b + pf2.c) - (pf4.ir + pf.importeAnticipo + pf.fianza)";
       
        sql += " WHERE";
        sql += " pf.facproveId = ?";
        sql += " AND pf2.facproveId = pf.facproveId";
        sql += " AND pf3.facproveId = pf.facproveId";
        sql += " AND pf4.facproveId = pf.facproveId";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            if(result.affectedRows == 0) {
                var connection2 = getConnection();
                sql = "UPDATE facprove ";
                sql += " SET total = 0, totalConIva = 0,";
                sql += " coste = 0, importeRetencion = 0, fianza = 0, restoPagar = 0";
                sql += " WHERE facproveId = ?";
                sql = mysql.format(sql, id);
                connection2.query(sql, function (err, result) {
                    connection2.end();
                    fnObtenFianza(id, datosFianza, function(err, res)  {
                        if (err) {
                            return callback(err);
                        }
                         //si no hay registros en facprove_retenciones actualizaremos directamente el importeRetencion = 0
                        var connection4 = getConnection();
                        var sql4 = "SELECT COUNT(*) AS total FROM facprove_retenciones";
                            sql4 += " WHERE facproveId = ?";
                        sql4 = mysql.format(sql4, id);
                        connection4.query(sql4, function (err, resultBis) {
                        connection4.end();
                        if (err) {
                            return callback(err);
                        }
                        if (resultBis[0].total == 0) {
                            var connection5 = getConnection();
                            var sql5 = "UPDATE facprove SET importeRetencion = 0 WHERE facproveId = ? ";
                            sql5 = mysql.format(sql5, id);
                            connection5.query(sql5, function (err, resultado) {
                            connection5.end();
                                if (err) {
                                    return callback(err);
                                }else {
                                    callback(null)
                                }
        
                            });
                        } else {
                            callback(null);
                        }
                    });
             
        
                    });
                });
            } else {
                fnObtenFianza(id, datosFianza, function(err, res)  {
                    if (err) {
                        return callback(err);
                    }
                     //si no hay registros en facprove_retenciones actualizaremos directamente el importeRetencion = 0
                    var connection4 = getConnection();
                    var sql4 = "SELECT COUNT(*) AS total FROM facprove_retenciones";
                        sql4 += " WHERE facproveId = ?";
                    sql4 = mysql.format(sql4, id);
                    connection4.query(sql4, function (err, resultBis) {
                    connection4.end();
                    if (err) {
                        return callback(err);
                    }
                    if (resultBis[0].total == 0) {
                        var connection5 = getConnection();
                        var sql5 = "UPDATE facprove SET importeRetencion = 0 WHERE facproveId = ? ";
                        sql5 = mysql.format(sql5, id);
                        connection5.query(sql5, function (err, resultado) {
                        connection5.end();
                            if (err) {
                                return callback(err);
                            }else {
                                callback(null)
                            }
    
                        });
                    } else {
                        callback(null);
                    }
                });
         
    
                });
            }
        });
    });

}

// fnObtenfianza
// obtiene la fianza actualizada y actualiza el total acumulado del proveedor

var fnObtenFianza = function (id, datosFianza, callback) {
    var connection = getConnection();
    var porcen = datosFianza.retencionFianza/100;
     var sql = "SELECT  departamentoId, total*" + porcen + " AS nuevaFianza, totalConIva, ImporteAnticipo FROM facprove WHERE facproveId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            var nuevo = result[0]
            if(nuevo.departamentoId != 7) return callback();//solo fianzas en departamento de reparaciones.
            var nuevaAcumulada = datosFianza.fianzaAcumulada - datosFianza.fianzaFacprove;
              nuevaAcumulada = nuevaAcumulada + result[0].nuevaFianza;
            //
            if (nuevo.nuevaFianza > datosFianza.fianza) {//CASO SOBREPASAR LA FIANZA EN LA MISMA FACTURA
                    nuevo.nuevaFianza = datosFianza.fianza;
                    nuevaAcumulada = nuevo.nuevaFianza;
            }
            //
            if (nuevaAcumulada > datosFianza.fianza) {//CASO SOBREPASAR LA FIANZA EN MAS DE UNA FACTURA
                var cant = nuevaAcumulada-datosFianza.fianza
                var suma = datosFianza.fianzaAcumulada+cant
                if( suma > datosFianza.fianza) {
                    nuevaAcumulada = datosFianza.fianza;
                    nuevo.nuevaFianza = datosFianza.fianza-datosFianza.fianzaAcumulada;
                      nuevo.nuevaFianza = nuevo.nuevaFianza + datosFianza.fianzaFacprove
                } else {
                    nuevaAcumulada = nuevaAcumulada - cant;
                    nuevo.nuevaFianza = nuevo.nuevaFianza - cant;
                }
            }

            //actualizamos la fianza acumulada del proveedor
            var connection2 = getConnection();
            var sql2 = "UPDATE proveedores set fianzaAcumulada = " + nuevaAcumulada + " WHERE proveedorId = " + datosFianza.proveedorId;
            connection2.query(sql2, function (err, result) {
                connection2.end();
                if (err) {
                    return callback(err);
                }

                if(nuevo.nuevaFianza < 0) nuevo.nuevaFianza = 0;
                //SE CALCULA EL RESTO A PAGAR
                var restoPagar = nuevo.totalConIva-nuevo.nuevaFianza;
                restoPagar = restoPagar-nuevo.ImporteAnticipo;
                
                //actualizamos la nueva fianza an la facprove
                var connection3 = getConnection();
                if(nuevo.nuevaFianza == 0 && datosFianza.fianzaAcumulada == datosFianza.fianza) return callback(null);
                var sql3 = "UPDATE facprove set fianza = " + nuevo.nuevaFianza + ", restoPagar = " + restoPagar +  " WHERE facproveId = "+ id;
                connection3.query(sql3, function (err, result) {
                    connection3.end();
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
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
        facprove.numero = res[0].n + 1;
        facprove.ano = ano;
        var referencia = estableceRef(facprove.numero, 7);
        facprove.ref = facprove.ano + '-' + facprove.empresaId + referencia;
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
    } catch (err) {

    }
}

var renombraArchivo = function (doc, done) {
    var fromFile = path.join(__dirname, '../../public/ficheros/facturas_proveedores/' + doc.oldFile);
    var toFile = path.join(__dirname, '../../public/ficheros/facturas_proveedores/' + doc.file);
    try {
        fs.renameSync(fromFile, toFile);
    } catch (err) {

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
    var sql = "UPDATE facprove_serviciados SET ? WHERE facproveServiciadoId = ?";
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
module.exports.getPreContaFacturas = function (dFecha, hFecha, departamentoId, usuarioId, callback) {
    if (dFecha == "null" || hFecha == "null") {
        dFecha = 0;
        hFecha = 0;
    }
    var connection = getConnection();
    var facturas = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "UPDATE facprove SET sel = 0";

    sql += " WHERE noContabilizar = 0";
    sql += " AND contabilizada = 0";
    if (departamentoId && departamentoId > 0) {
        sql += " AND departamentoId =" + departamentoId;
    } else {
        sql += " AND departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
    }
    if (dFecha && hFecha) {
        sql += "  AND fecha_recepcion >= ? AND fecha_recepcion <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    }
    sql += " AND NOT fecha_recepcion IS NULL AND NOT numeroFacturaProveedor IS NULL AND NOT ref IS NULL"
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT f.*, f.numeroFacturaProveedor AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo, pro.IBAN as IBAN"
        sql += "  FROM facprove AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
        sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = f.proveedorId";
        sql += " WHERE noContabilizar = 0";
        sql += " AND contabilizada = 0";
        if (departamentoId && departamentoId > 0) {
            sql += " AND f.departamentoId = " + departamentoId;
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
        }
        if (dFecha && hFecha) {
            sql += " AND f.fecha_recepcion >= ? AND f.fecha_recepcion <= ?";
            sql = mysql.format(sql, [dFecha, hFecha]);
        }
        sql += " AND NOT f.fecha_recepcion IS NULL AND NOT f.numeroFacturaProveedor IS NULL AND NOT ref IS NULL"
        sql += " ORDER BY  f.fecha_recepcion ASC, f.ref ASC";

        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            facturas = res;
            callback(null, facturas);
        });
    });
}

// ----------------- CONTABILIZACION
module.exports.postContabilizarFacturas = function (dFecha, hFecha, departamentoId, usuarioId, done) {
    if (dFecha == "null" || hFecha == "null") {
        dFecha = 0;
        hFecha = 0;
    }
    var listas = [];
    var con = getConnection();
    var sql = "SELECT f.*, ser.facproveId AS serviciada, SUM(ser.importe) AS totalServiciado";
    sql += " FROM facprove as f";
    sql += " LEFT JOIN facprove_serviciados AS ser ON ser.facproveId = f.facproveId";
    sql += " WHERE sel = 1 AND contabilizada = 0 AND noContabilizar = 0";
    if (departamentoId && departamentoId > 0) {
        sql += " AND f.departamentoId =" + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")"
    }
    if (dFecha && hFecha) {
        sql += "  AND fecha_recepcion >= ? AND fecha_recepcion <= ?";

        sql = mysql.format(sql, [dFecha, hFecha]);
    }
    sql += " AND NOT f.fecha_recepcion IS NULL AND NOT f.numeroFacturaProveedor IS NULL AND NOT ref IS NULL"
    sql += " GROUP BY f.facproveId, serviciada  ORDER BY f.fecha_recepcion ASC, f.ref ASC"
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
        var numfacprove = [];//guardara los numeros de factura de proveedor no contabilizados por no tener serviciadas
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].total != rows[i].totalServiciado && rows[i].departamentoId != 7) {
                numfacprove.push(rows[i].numeroFacturaProveedor);
                rows.splice(i, 1);//eliminamos un elemto del array y modificamops su tamaño
                i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
            }
        }
        listas.push(numfacprove);
        if (rows.length > 0) {
            //eliminamos la propiedad serviciada para contabilizar la factura
            for (var j = 0; j < rows.length; j++) {
                delete rows[j].serviciada
                delete rows[j].totalServiciado
            }
            contabilidadDb.contabilizarFacturasProveedor(rows, function (err, result) {
                if (err) return done(err);
                listas.push(result);
                done(null, listas);
            });
        } else {
            done(null, listas);
        }
    });
}

//------------------------VISADAS----------------
module.exports.getVisadasFactura = function (visada, callback) {
    var connection = getConnection();
    sql = "SELECT f.*, f.numeroFacturaProveedor AS vNum";
    sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo, ant.numeroAnticipoProveedor AS numAnticipo";
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
module.exports.putFacturaVisada = function (id, facprove, callback) {
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

    var sql = "UPDATE facprove SET ? WHERE facproveId = ?";
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
module.exports.postLineasDesdeAntprove = function (facproveId, antproveId, callback) {
    var formateo;
    var connection1 = getConnection();
    var sql = "";
    sql = "SELECT coste, importeRetencion, 0 As restoPagar FROM antprove WHERE antproveId = ? ";
    sql = mysql.format(sql, antproveId);
    connection1.query(sql, function (err, facprove) {
        connection1.end();
        if(err) return callback(err);
        var connection2 = getConnection();
        sql = "UPDATE facprove SET ? WHERE facproveId = ?;"
        sql = mysql.format(sql, [facprove[0], facproveId]);
        connection2.query(sql, function (err, result) { 
            connection2.end();
            if(err) return callback(err);
            var connection = getConnection();
            sql = "SELECT * FROM antprove_lineas WHERE antproveId = ? ";
            sql = mysql.format(sql, antproveId);
            connection.query(sql, function (err, facprove_li) {
                if (err) {
                    return callback(err);
                } else {
                    if (facprove_li.length > 0) {
                        connection.beginTransaction(function (err) {
        
                            for (var i = 0; i < facprove_li.length; i++) {
                                facprove_li[i].facproveId = facproveId
        
                                delete facprove_li[i].antproveId;
                                delete facprove_li[i].antproveLineaId
        
                            }
                            formateo = formateaValores(facprove_li);
                            sql = "INSERT INTO facprove_lineas (" + formateo[0] + ") values ?";
                            //sql = mysql.format(sql, facprove_li[0]);
                            connection.query(sql, [formateo[1]], function (err, facprove_li) {
                                if (err) {
                                    return connection.rollback(function () { callback(err) });
                                } else {
        
                                    sql = "SELECT * FROM antprove_bases WHERE antproveId = ? ";
                                    sql = mysql.format(sql, antproveId);
                                    connection.query(sql, function (err, facprove_bases) {
        
                                        if (err) {
                                            return connection.rollback(function () { callback(err) });
                                        } else {
                                            for (var j = 0; j < facprove_bases.length; j++) {
                                                facprove_bases[j].facproveId = facproveId
                                                facprove_bases[j].facproveBaseId = 0;
                                                delete facprove_bases[j].antproveId;
                                                delete facprove_bases[j].antproveBaseId;
                                            }
        
        
                                            var formateo2 = formateaValores(facprove_bases);
        
        
        
                                            var sql2 = "INSERT INTO facprove_bases (" + formateo2[0] + ") values ? ";
                                            sql2 = mysql.format(sql2, [formateo2[1]]);
                                            connection.query(sql2, function (err, facprove_li) {
        
                                                if (err) {
                                                    return connection.rollback(function () { callback(err) });
                                                } else {
        
                                                    sql = "SELECT * FROM antprove_retenciones WHERE antproveId = ? ";
                                                    sql = mysql.format(sql, antproveId);
                                                    connection.query(sql, function (err, facprove_reten) {
        
                                                        if (err) {
                                                            return connection.rollback(function () { callback(err) });
                                                        } else {
                                                            for (var k = 0; k < facprove_reten.length; k++) {
                                                                facprove_reten[k].facproveId = facproveId
        
                                                                delete facprove_reten[k].antproveId;
                                                                delete facprove_reten[k].antproveRetencionId;
                                                            }
        
                                                            var formateo3 = formateaValores(facprove_reten);
        
                                                            var sql3 = "INSERT INTO facprove_retenciones (" + formateo3[0] + ") values ? ";
                                                            sql3 = mysql.format(sql3, [formateo3[1]]);
                                                            connection.query(sql3, function (err, result) {
        
                                                                if (err) {
                                                                    return connection.rollback(function () { callback(err) });
                                                                } else {
        
                                                                    sql = "SELECT * FROM antprove_serviciados WHERE antproveId = ? ";
                                                                    sql = mysql.format(sql, antproveId);
                                                                    connection.query(sql, function (err, facprove_serv) {
        
                                                                        if (err) {
                                                                            return connection.rollback(function () { callback(err) });
                                                                        } else {
                                                                            if (facprove_serv.length > 0) {
                                                                                for (var l = 0; l < facprove_serv.length; l++) {
                                                                                    facprove_serv[l].facproveId = facproveId
        
                                                                                    delete facprove_serv[l].antproveId;
                                                                                    delete facprove_serv[l].antproveServiciadoId;
                                                                                }
                                                                                var formateo4 = formateaValores(facprove_serv);
                                                                                var sql4 = "INSERT INTO facprove_serviciados (" + formateo4[0] + ") values ? ";
                                                                                sql4 = mysql.format(sql4, [formateo4[1]]);
                                                                                connection.query(sql4, function (err, result) {
        
                                                                                    if (err) {
                                                                                        return connection.rollback(function () { callback(err) });
                                                                                    } else {
                                                                                        connection.commit(function (err) {
                                                                                            if (err) return connection.rollback(function () { callback(err) });
                                                                                            connection.end()
                                                                                            callback(null, result);
                                                                                        })
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                connection.commit(function (err) {
                                                                                    if (err) return connection.rollback(function () { callback(err) });
                                                                                    connection.end()
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
        });
    });
}

var formateaValores = function (obj) {
    var valuesNestedArray = Object.keys(obj[0]);
    var propiedades = JSON.stringify(valuesNestedArray);
    propiedades = propiedades.replace(/['"\[\]]+/g, '');
    propiedades = propiedades.replace(/['"]+/g, '');
    var values = []
    var intoValues = []
    var result = [];

    for (var j = 0; j < obj.length; j++) {
        intoValues = [];
        for (var i = 0; i < valuesNestedArray.length; i++) {
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
module.exports.deleteLineasDesdeAntprove = function (facproveId, antproveId, callback) {
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


// CREACION DE FACTURA A PARTIR DE PARTE
module.exports.postCrearFactProDesdeParte = function (seleccionados, deFecha, aFecha, fechaFactura, done) {
    var con = getConnection();
    var numFact;
    var partesActualiza = [];
    var cabFacturas = [];

    var sql2 = "";
    var partes = [];
    var porSeparado;
    var parteId;
    var fechaFacturaAno;
    var empresaParteId;
    var tipoProvesionalId;
    var parId = [];

    deFecha = moment(deFecha, 'DD.MM.YYYY').format('DD/MM/YYYY');
    aFecha = moment(aFecha, 'DD.MM.YYYY HH:mm').format('DD/MM/YYYY');
    if (fechaFactura != "") {
        fechaFactura = moment(fechaFactura, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD');
        fechaFacturaAno = moment(fechaFactura, 'YYYY-MM-DD').format('YYYY');
    } else {
        fechaFactura = new Date();
        fechaFacturaAno = moment(fechaFactura, 'YYYY-MM-DD').format('YYYY');
    }
    var periodo = deFecha + "-" + aFecha;

    for (var i = 0; i < seleccionados.length; i++) {
        partes.push(seleccionados[i].parteId);
    }
    //OBTENEMOS LAS CABECERAS de las facturas que no tienen seleccionada la casilla de factura propia y de las que si la tienene
    sql2 = "(SELECT '" + fechaFacturaAno + "' AS ano, '" + fechaFactura + "' AS fecha, '" + fechaFactura + "' AS fecha_recepcion, par.proveedorId, '" + periodo + "' AS periodo,  par.parteId, par.factPropiaPro,";
    sql2 += " par.empresaParteId AS empresaParteId, par.tipoProfesionalId, ";
    sql2 += " IF(pro.empresaId IS NULL, par.empresaParteId, pro.empresaId) AS empresaId,";
    sql2 += " IF(pro.empresaId IS NULL,  emp.nombre,  emp2.nombre) AS receptorNombre,";
    sql2 += " IF(pro.empresaId IS NULL, emp.nif, emp2.nif) AS receptorNif,";
    sql2 += " IF(pro.empresaId IS NULL, emp.`direccion`,  emp2.`direccion`)  AS receptorDireccion,";
    sql2 += " IF(pro.empresaId IS NULL, emp.`poblacion`, emp2.`poblacion`) AS receptorPoblacion,";
    sql2 += " IF(pro.empresaId IS NULL, emp.`provincia`, emp2.`provincia`) AS receptorProvincia,";
    sql2 += " IF(pro.empresaId IS NULL, emp.`codPostal`, emp2.`codPostal`) AS receptorCodpostal,";
    sql2 += " pro.`nombre` AS emisorNombre, pro.`direccion` As emisorDireccion, pro.`nif` AS emisorNif, pro.`codPostal` AS emisorCodPostal,";
    sql2 += " pro.`poblacion` AS emisorPoblacion, pro.`provincia` AS emisorProvincia, pro.emitirFacturas,";
    sql2 += " par.formaPagoProfesionalId AS formaPagoId, SUM(par.`importe_profesional`) AS coste, SUM(par.`importe_profesional`) AS total,";
    sql2 += " SUM(par.importe_profesional_iva) AS totalConIva, 7 AS departamentoId, 0 AS importeAnticipo,";
    sql2 += " (SUM(par.importe_profesional_iva) - SUM(par.aCuentaProfesional)) AS restoPagar,";
    sql2 += " SUM(par.aCuentaProfesional) AS contado,";
    sql2 += "  1 AS tipoOperacionId"
    sql2 += " FROM servicios AS ser";
    sql2 += " LEFT JOIN partes AS par ON par.servicioId = ser.servicioId";
    sql2 += " LEFT JOIN proveedores AS pro ON par.proveedorId = pro.proveedorId";
    sql2 += " LEFT JOIN empresas AS emp ON emp.empresaId = par.empresaParteId";
    sql2 += " LEFT JOIN empresas AS emp2 ON emp2.empresaId = pro.empresaId";
    sql2 += " WHERE par.parteId IN (?) AND par.FactPropiaPro = 0";
    sql2 += "  GROUP BY par.proveedorId,  par.tipoProfesionalId, empresaId, par.formaPagoProfesionalId)";
    sql2 += " UNION"
    sql2 += "(SELECT '" + fechaFacturaAno + "' AS ano, '" + fechaFactura + "' AS fecha, '" + fechaFactura + "' AS fecha_recepcion, par.proveedorId, '" + periodo + "' AS periodo,  par.parteId, par.factPropiaPro,";
    sql2 += " par.empresaParteId AS empresaParteId,  par.tipoProfesionalId,"
    sql2 += " IF(pro.empresaId IS NULL, par.empresaParteId, pro.empresaId) AS empresaId,";
    sql2 += " IF(pro.empresaId IS NULL,  emp.nombre,  emp2.nombre) AS receptorNombre,";
    sql2 += " IF(pro.empresaId IS NULL, emp.nif, emp2.nif) AS receptorNif,";
    sql2 += " IF(pro.empresaId IS NULL, emp.`direccion`,  emp2.`direccion`)  AS receptorDireccion,";
    sql2 += " IF(pro.empresaId IS NULL, emp.`poblacion`, emp2.`poblacion`) AS receptorPoblacion,";
    sql2 += " IF(pro.empresaId IS NULL, emp.`provincia`, emp2.`provincia`) AS receptorProvincia,";
    sql2 += " IF(pro.empresaId IS NULL, emp.`codPostal`, emp2.`codPostal`) AS receptorCodpostal,";
    sql2 += " pro.`nombre` AS emisorNombre,  pro.`direccion` As emisorDireccion, pro.`nif` AS emisorNif, pro.`codPostal` AS emisorCodPostal,";
    sql2 += " pro.`poblacion` AS emisorPoblacion, pro.`provincia` AS emisorProvincia, pro.emitirFacturas,";
    sql2 += " par.formaPagoProfesionalId AS formaPagoId, par.`importe_profesional` AS coste, par.`importe_profesional` AS total,";
    sql2 += " par.importe_profesional_iva AS totalConIva, 7 AS departamentoId, 0 AS importeAnticipo,";
    sql2 += " (par.importe_profesional_iva - par.aCuentaProfesional) AS restoPagar,";
    sql2 += " par.aCuentaProfesional AS contado,";
    sql2 += " 1 AS tipoOperacionId"
    sql2 += " FROM servicios AS ser";
    sql2 += " LEFT JOIN partes AS par ON par.servicioId = ser.servicioId";
    sql2 += " LEFT JOIN proveedores AS pro ON par.proveedorId = pro.proveedorId";
    sql2 += " LEFT JOIN empresas AS emp ON emp.empresaId = par.empresaParteId";
    sql2 += " LEFT JOIN empresas AS emp2 ON emp2.empresaId = pro.empresaId";
    sql2 += " WHERE par.parteId IN (?) AND par.FactPropiaPro = 1)"
    sql2 = mysql.format(sql2, [partes, partes]);
    con.query(sql2, function (err, res) {
        if (err) return done(err);
        cabFacturas = res;
        // Transaccion general que protege todo el proceso
        con.beginTransaction(function (err) {
            if (err) return done(err);

            async.eachSeries(cabFacturas, function (sel, callback2) {
                var sql = "";

                porSeparado = sel.factPropiaPro;
                empresaParteId = sel.empresaId;
                empresaProId = sel.empresaId;
                parteId = sel.parteId;
                var lineaFactura = {
                    parteLineaId: 0,
                    facproveLineaId: 0,
                };
                var lineasObj = [];
                async.series([
                    function (callback) {
                        // obtener las referencias de las facturas
                        sql = "SELECT COALESCE(MAX(numero) +1, 1) AS n FROM facprove";
                        sql += " WHERE ano = ? AND empresaId = ?";
                        sql = mysql.format(sql, [fechaFacturaAno, sel.empresaId]);
                        con.query(sql, function (err, res) {
                            if (err) return callback(err);
                            
                            var numeroRef = estableceRef(res[0].n, 7);
                            sel.ref = fechaFacturaAno + "-" + sel.empresaId + numeroRef
                            sel.ano = fechaFacturaAno;
                            sel.numero = res[0].n;
                            callback(null);
                        });
                    },
                    function (callback) {
                        // obtener la serie del proveedor
                        sql = " SELECT COALESCE(serie, '') AS serie from proveedores where proveedorId = " + sel.proveedorId;
                        con.query(sql, function (err, res) {
                            sel.serie = res[0].serie
                            var numero = sel.serie + "-" + fechaFacturaAno + "-";
                            //obtenemora el numero
                            fnComprobarOrdenCorrecto(sel.serie, sel.ano, sel.fecha,  sel.proveedorId, function (err, res) {
                                var numCorte = sel.serie.length + 7; 
                                if (err) return callback(err);
                                sql = " SELECT MAX(SUBSTRING(numeroFacturaProveedor2, "+ numCorte +")+0 ) AS n  FROM facprove";
                                sql += " WHERE numeroFacturaProveedor2 like '" + numero + "%' AND proveedorId = " + sel.proveedorId;
                                con.query(sql, function (err, res) {
                                    if (err) return callback(err);
                                    if (res.length == 0 || res[0].n == null) {
                                        sel.numeroFacturaProveedor2 = numero + "1";
                                    } else {
                                        numero = numero + (res[0].n +1);
                                        sel.numeroFacturaProveedor2 = numero
                                        numFact = numero
                                    }
                                    callback(null);
                                }, null);
                            });
                        });
                    },
                    function (callback) {
                        //comprobamos si el proveedor quiere que emitamos factura por el
                        if(!sel.emitirFacturas) {
                            sel.numeroFacturaProveedor = null;
                            sel.fecha_recepcion2 = sel.fecha_recepcion;
                            sel.fecha_recepcion = null;
                        } else {
                            sel.numeroFacturaProveedor = sel.numeroFacturaProveedor2;
                            sel.fecha_recepcion2 = sel.fecha_recepcion;
                        }
                        //SE CREA LA CABECERA DE LA FACTURA
                        sel.facproveId = 0//forzamos el autoincremento

                        //borramos los campos adicioneles
                        delete sel.factPropiaPro;
                        delete sel.parteId;
                        delete sel.emitirFacturas;
                        delete sel.empresaParteId;
                        tipoProfesionalId = sel.tipoProfesionalId;
                        delete sel.tipoProfesionalId;
                        var sql2 = "INSERT INTO facprove SET ?"
                        sql2 = mysql.format(sql2, sel);
                        con.query(sql2, function (err, res) {
                            if (err) return callback(err);
                            sel.facproveId = res.insertId;
                            callback(null)
                        });
                    },
                    function (callback) {

                        //TRANSFORMAR LOS CAMPOS DEL PARTE_LINEA EN CAMPOS DE FACTURA_LINEA
                        var sql = " (SELECT pt.parteId, pt.parteLineaId, pt.descripcion AS descripcion, pt.unidades AS cantidad, ar.articuloId AS articuloId,pt.tipoIvaProveedorId AS tipoIvaId, pt.ivaProveedor AS porcentaje, ar.unidadId,";
                        sql += " pt.precioProveedor AS importe,  pt.importeProveedor AS coste, pt.importeProveedor AS totalLinea ,ga.nombre AS capituloLinea";
                        sql += " FROM partes AS par";
                        sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId"
                        sql += " LEFT JOIN partes_lineas AS pt ON pt.parteId = par.parteId"
                        sql += " LEFT JOIN articulos AS ar ON ar.codigoReparacion = pt.codigoArticulo";
                        sql += " LEFT JOIN unidades AS u ON u.unidadId = ar.unidadId";
                        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoarticuloId = ar.grupoArticuloId";
                        sql += " LEFT JOIN proveedores AS p ON p.proveedorId = par.proveedorId"
                       
                        sql += " WHERE par.proveedorId = ? AND par.tipoProfesionalId = ? AND p.empresaId = ? AND par.formaPagoProfesionalId = ? AND par.factPropiaPro = ? AND par.parteId IN (?)";
                        if (porSeparado == 1) {
                            sql += " AND par.parteId = " + parteId;
                        } else {
                            sql += " AND par.factPropiaPro = 0"
                        }
                        sql += " ORDER BY pt.parteLineaId)";
                        sql = mysql.format(sql, [sel.proveedorId, tipoProfesionalId, empresaProId, sel.formaPagoId, porSeparado, partes]);
                        con.query(sql, function (err, res) {
                            if (err) return callback(err);
                            lineasFactura = res
                            //procesamos las lineas
                            var cont = 0;

                            lineasFactura.forEach(function (l) {
                                lineaFactura = {
                                    parteLineaId: 0,
                                    facproveLineaId: 0,
                                };
                                parId.push(l.parteId); //guardamos las ids de los partes implicados en esta factura
                                delete l.parteId; //borramos la propiedad para que no de error al crear la linea
                                lineaFactura.parteLineaId = l.parteLineaId
                                lineasObj.push(lineaFactura); //guardanmos las ids de partelineaId y facproveLineaId para actualizar la linea del parte mas adelante
                                
                                cont++;
                                l.facproveLineaId = 0//forzamos autoincremento
                                l.facproveId = sel.facproveId;
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
                            var sql2 = "INSERT INTO facprove_lineas SET ?"
                            sql2 = mysql.format(sql2, f);
                            con.query(sql2, function (err, res) {
                                if (err) return done2(err);
                                f.facproveLineaId = res.insertId; //guardamos la id de la linea que acabamos de crear
                                f.parteLineaId = id // recuperomos la id del la linea del parte que nos servirá para los anticipos
                                //f.anticipo = anticipo // recuperomos el anticipo del la linea del parte que nos servirá para los anticipos
                                lineasObj[cont].facproveLineaId = f.facproveLineaId; //guardanmos las ids de partelineaId y facproveLineaId para actualizar la linea del parte mas adelante
                                cont++;
                                done2(null);

                            });
                        }, function (err) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        //SE CREAN LAS BASES
                        var sql = "INSERT INTO facprove_bases (facproveId, tipoIvaId, porcentaje, base, cuota)";
                        sql += " SELECT pl.facproveId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
                        sql += " FROM";
                        sql += " (SELECT facproveId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
                        sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
                        sql += " FROM facprove_lineas";
                        sql += " WHERE facproveId = ?";
                        sql += " GROUP BY tipoIvaId) AS pl";
                        sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
                        sql = mysql.format(sql, sel.facproveId);
                        con.query(sql, function (err, res) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function(callback) {
                        var sql = "INSERT INTO facprove_retenciones (facproveId, baseRetencion, porcentajeRetencion, importeRetencion, codigoRetencion, cuentaRetencion)";
                        sql += " SELECT pl.facproveId, COALESCE(pl.baseRetencion, 0), pl.porcentajeRetencion, pl.importeRetencion, pl.codigoRetencion, pl.cuentaRetencion";
                        sql += " FROM";
                        sql += " (SELECT facproveId, SUM(importeRetencion) AS importeRetencion,  porcentajeRetencion, ROUND(SUM(totalLinea),2) AS baseRetencion, codigoRetencion, cuentaRetencion";
                        sql += " FROM facprove_lineas";
                        sql += " WHERE facproveId = ?";
                        sql += " GROUP BY codigoRetencion, porcentajeRetencion, codigoRetencion, cuentaRetencion) AS pl";
                        sql = mysql.format(sql, sel.facproveId);
                        con.query(sql, function (err, result) {
                            if (err) {
                                return callback(err);
                            }
                            callback(null);
                        });
                    },
                    function (callback) {//SE ACTUALIZAN LOS TOTALES DE LA CABECERA
                        var sql = "UPDATE facprove AS pf,";
                        sql += " (SELECT facproveId, SUM(base) AS b, SUM(cuota) AS c";
                        sql += " FROM facprove_bases GROUP BY 1) AS pf2,";


                        sql += " (SELECT facproveId, COALESCE(SUM(importeRetencion), 0 ) AS ir";
                        sql += " FROM facprove_retenciones GROUP BY 1) AS pf4,";



                        sql += " (SELECT facproveId, SUM(coste) AS sc";
                        sql += " FROM facprove_lineas GROUP BY 1) AS pf3";
                        sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c - pf4.ir,";
                        sql += " pf.coste = pf3.sc, pf.importeRetencion = pf4.ir,";
                        sql += " pf.restoPagar = (pf2.b + pf2.c) - (pf4.ir + pf.importeAnticipo + pf.fianza)";
       
                        sql += " WHERE pf.facproveId = ?";
                        sql += " AND pf2.facproveId = pf.facproveId";
                        sql += " AND pf3.facproveId = pf.facproveId";
                        sql += " AND pf4.facproveId = pf.facproveId";
                        sql = mysql.format(sql, sel.facproveId);
                        con.query(sql, function (err, res) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function(callback) {
                        //se vinculan anticipos ya creados
                        //se obtienen las ids de los servicios que pertenecen al parte
                        var servicioId = [];
                        var sql5 = "SELECT DISTINCT servicioId from partes WHERE parteId IN (?)";                                          
                        sql5 = mysql.format(sql5, [parId]);
                        con.query(sql5, function (err, res) {
                            if (err) return callback(err);
                            for (var i = 0; i < res.length; i++) {
                                servicioId.push(res[i].servicioId);
                            }
                            //se comprueba que haya anticipos para los servicios
                            var sql = "SELECT *";
                            sql += " FROM antprove";
                            sql += " WHERE servicioId IN (?) AND proveedorId = ?"
                            sql = mysql.format(sql,[servicioId, sel.proveedorId]);
                            con.query(sql, function (err, result) {
                                if (err) return callback(err);
                                if(result.length > 0) {
                                    async.eachSeries(result, function (a, done2) {
                                        //comprobamos que el anticipo no esté ya vinculado
                                        var sql2 = "SELECT *";
                                        sql2 += " FROM facprove_antproves";
                                        sql2 += " WHERE antProveId = ?";
                                        sql2 = mysql.format(sql2, [a.antproveId]);
                                        con.query(sql2, function (err, result2) {
                                            if (err)  return done2(err, null);
                                            if (result2.length == 0) {
                                                //si no está vinculado lo vinculamos
                                                var obj = {
                                                    facproveAntproveId: 0,
                                                    antproveId: a.antproveId,
                                                    facproveId: sel.facproveId
                                                }
                                                var sql3 = "INSERT INTO facprove_antproves SET ?"
                                                sql3 = mysql.format(sql3, obj);
                                                con.query(sql3, function (err, res) {
                                                    if (err) return done2(err);
                                                    //actualizamos la factura a la que le hemos vinculado el anticipo
                                                    var sql4 = "UPDATE facprove SET importeAnticipo = ";
                                                    sql4 += " (SELECT tmp2.suma FROM (SELECT importeAnticipo+? AS suma FROM facprove WHERE facproveId = ?) AS tmp2),";
                                                    sql4 += " restoPagar = (SELECT tmp.resta FROM (SELECT restoPagar-? AS resta FROM facprove WHERE facproveId = ?) AS tmp)";
                                                    sql4 += " WHERE facproveId = ?";                                             
                                                    sql4 = mysql.format(sql4, [a.totalConIva, sel.facproveId, a.totalConIva, sel.facproveId, sel.facproveId]);
                                                    con.query(sql4, function (err, res) {
                                                        if (err) return done2(err);
                                                        done2(null);
                                                    });
                                                });
    
                                            } else {
                                                done2(null);
                                            }
                                        });
                                            
                                        }, function (err) {
                                            if (err) return callback(err);
                                            callback(null);
                                        });
                                } else {
                                    callback(null);
                                }
                            });
                        });
                    },

                    function (callback) {//SELECCIONAMOS LA ID DEL PARTE QUE SE TIENE QUE ACTUALIZAR
                        sql = " SELECT par.parteId";
                        sql += " FROM partes AS par";
                        sql += " LEFT JOIN servicios AS ser ON ser.servicioId = par.servicioId";
                        sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = par.proveedorId";
                        if (porSeparado == 1) {
                            sql += " WHERE par.parteId = " + parteId;
                        } else {
                            sql += " WHERE par.proveedorId = ? AND pro.empresaId = ? AND par.formaPagoProfesionalId = ? AND par.parteId IN (?)";
                            sql = mysql.format(sql, [sel.proveedorId, empresaParteId, sel.formaPagoId, partes]);
                        }
                        con.query(sql, function (err, res) {
                            if (err) return callback(err);
                            partesActualiza = res
                            callback(null);
                        });
                    },
                    function (callback) {//ACTUALIZAMOS EL PARTE CON EL NUMERO E ID DE LA FACTURA CORRESPONDIENTE 
                        var numfactu = sel.numeroFacturaProveedor;
                        if(!numfactu) {
                            numfactu = sel.numeroFacturaProveedor2;
                        }
                        async.eachSeries(partesActualiza, function (f, done3) {
                            var sql3 = "UPDATE partes SET numero_factura_profesional = ?, fecha_factura_profesional = ?, facproveId = ? WHERE parteId = ?"
                            sql3 = mysql.format(sql3, [ numfactu, fechaFactura, sel.facproveId, f.parteId ]);
                            con.query(sql3, function (err, res) {
                                if (err) return done3(err);
                                done3(null);

                            });
                        }, function (err) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {//ACTUALIZAMOS LAS LINAS DEL PARTE CON LAS IDS DE LAS LINEAS DE FACTURA  CORRESPONDIENTE 
                        //SE CREAN LAS lINEAS DE LA FACTURA
                        async.eachSeries(lineasObj, function (f, done2) {
                            var sql2 = "UPDATE partes_lineas SET facproveLineaId = ? WHERE parteLineaId = ? "
                            sql2 = mysql.format(sql2, [f.facproveLineaId, f.parteLineaId]);
                            con.query(sql2, function (err, res) {
                                if (err) return done2(err);
                                done2(null);

                            });
                        }, function (err) {
                            if (err) return callback(err);
                            callback(null);
                        });
                    },
                    function (callback) {
                        var fianza;
                        var fianzaAcumulada;
                        var retencionFianza;
                        var sql2;
                        var porcen
                        var acumulado;
                        var total
                        var restoPagar;
                        //recuperamos los parametros correspondientes a la fianza del proveedor

                        sql2 = " SELECT fianza, fianzaAcumulada, retencionFianza";
                        sql2 += " FROM proveedores";
                        sql2 += " WHERE proveedorId = ?";
                        sql2 = mysql.format(sql2, sel.proveedorId);
                        con.query(sql2, function (err, res) {
                            if (err) return callback(err);
                            //SE ACTULIZA LA FECHA DE LA ÚLTIMA REVISION DE LA FIANZA CON LA FECHA DE LA FACTURA
                            // Y LA FIANZA ACUMULADA CON EL 5% DE LA BASE DE LA FACTURA
                            fianzaAcumulada = res[0].fianzaAcumulada;
                            retencionFianza = res[0].retencionFianza;
                            fianza = res[0].fianza;
                            porcen = sel.coste * (retencionFianza / 100);
                            porcen = Math.round(porcen * 100) / 100;
                            acumulado = fianzaAcumulada + porcen;

                            if (fianzaAcumulada == fianza || fianzaAcumulada > fianza) {
                                callback(null);
                            } else {

                                if (acumulado == fianza || acumulado > fianza) {
                                    porcen = fianza - fianzaAcumulada;
                                }
                                total = fianzaAcumulada + porcen;
                                //actualizamos la factura del proveedor con la fianza
                                restoPagar = sel.totalConIva - porcen
                                var sql3 = "UPDATE facprove SET fianza = ?, ";
                                sql3 += " restoPagar = ?";
                                sql3 += " WHERE facproveId = ?";
                                sql3 = mysql.format(sql3, [porcen, restoPagar, sel.facproveId]);
                                con.query(sql3, function (err, res) {
                                    if (err) return callback(err);
                                    //SE ACTUALIZA LA FIANZA EN EL PROVEEDOR
                                    var sql4 = "UPDATE proveedores SET revisionFianza = ?, ";
                                    sql4 += " fianzaAcumulada = ?";
                                    sql4 += " WHERE proveedorId = ?";
                                    sql4 = mysql.format(sql4, [sel.fecha, total, sel.proveedorId]);
                                    con.query(sql4, function (err, res) {
                                        if (err) return callback(err);
                                        callback(null);
                                    }); 
                                });
                            }

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
            });
        });
    });
}

// fnComprobarOrderCorrecto:
// es llamada desde obtener numero de factura, porque es en ese momento cuando sabemos
// la serie correspondiente.
var fnComprobarOrdenCorrecto = function (serie, ano, fecha, proveedorId, done, con) {
    var passedConnection = true;
    var con = con;
    if (!con) {
        // si no nos han pasado una conexión la creamos.
        con = getConnection();
        passedConnection = false;
    }
    var sql = "SELECT * FROM facprove";
    sql += " WHERE ano = ? AND serie = ? AND fecha > ? AND proveedorId = ?"
    sql = mysql.format(sql, [ano, serie, fecha, proveedorId]);
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

var restaFianza = function (id, callback) {
    var con = getConnection();
    var sql = "SELECT f.proveedorId, f.fianza, p.fianzaAcumulada";
    sql += " FROM facprove AS f";
    sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId"
    sql += " WHERE facproveId = ?";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, res) {
        con.end();
        if(err) return callback(err);
        var infFact = res[0];
        if(infFact.fianza == 0) return callback(null, null);
        var nuevaAcumulada = infFact.fianzaAcumulada-infFact.fianza;
        var con2 = getConnection();
        sql = "UPDATE  proveedores set fianzaAcumulada = ?" 
        sql += " WHERE proveedorId = ?";
        sql = mysql.format(sql, [nuevaAcumulada, infFact.proveedorId]);
        con2.query(sql, function (err, result) {
            con2.end();
            if(err) return callback(err);
            callback(null, null);
        });
    });
}

var actualizaFianza = function (facprove, callback) {
    var con = getConnection();
    var fianza;
    var fianzaAcumulada;
    var retencionFianza;
    var sql2;
    var porcen
    var acumulado;
    var total
    var totalConIva;
    //recuperamos los parametros correspondientes a la fianza del proveedor
    sql2 = " SELECT fianza, fianzaAcumulada, retencionFianza";
    sql2 += " FROM proveedores";
    sql2 += " WHERE proveedorId = ?";
    sql2 = mysql.format(sql2, facprove.proveedorId);
    con.query(sql2, function (err, res) {
        if (err) return callback(err);
        //SE ACTULIZA LA FECHA DE LA ÚLTIMA REVISION DE LA FIANZA CON LA FECHA DE LA FACTURA
        // Y LA FIANZA ACUMULADA CON EL 5% DE LA BASE DE LA FACTURA
        fianzaAcumulada = res[0].fianzaAcumulada;
        retencionFianza = res[0].retencionFianza;
        fianza = res[0].fianza;
        porcen = facprove.coste * (retencionFianza / 100);
        porcen = Math.round(porcen * 100) / 100;
        acumulado = fianzaAcumulada + porcen;
        if (fianzaAcumulada == fianza || fianzaAcumulada > fianza) {
            callback(null);
        } else {
            if (acumulado == fianza || acumulado > fianza) {
                porcen = fianza - fianzaAcumulada;
            }
            total = fianzaAcumulada + porcen;
            var sql3 = "UPDATE proveedores SET revisionFianza = ?, ";
            sql3 += " fianzaAcumulada = ?";
            sql3 += " WHERE proveedorId = ?";
            sql3 = mysql.format(sql3, [facprove.fecha, total, facprove.proveedorId]);
            con.query(sql3, function (err, res) {
                if (err) return callback(err);
                //actualizamos la factura del proveedor con la fianza
                totalConIva = facprove.totalConIva - porcen
                var sql3 = "UPDATE facprove SET fianza = ?, ";
                sql3 += " totalConIva = ?";
                sql3 += " WHERE facproveId = ?";
                sql3 = mysql.format(sql3, [porcen, totalConIva, facprove.facproveId]);
                con.query(sql3, function (err, res) {
                    if (err) return callback(err);
                    //actualizamos la factura del proveedor con la fianza
                    callback(null);
                });
            });
        }

    });
}

//METODOS RELACIONADOS CON LOS DEPARTAMENTOS DE USUARIO

// getFacturasProveedoresUsuario
// lee los registros de la tabla facprove cuyo departamento tenga asignado el usuario logado y
// los devuelve como una lista de objetos
module.exports.getFacturasProveedoresUsuario = function (usuarioId, departamentoId, dFecha, hFecha, empresaId, callback) {
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
    sql += " WHERE pf.fecha >= '" + dFecha + "' AND pf.contabilizada = 0";
    if(hFecha != '' && hFecha != 'null') {
        sql +=  " AND pf.fecha <= '" + hFecha + "'";
    }
    if(departamentoId > 0) {
        sql += " AND pf.departamentoId = " + departamentoId;
    } else {
        sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    if(empresaId > 0) {
        sql += " AND pf.empresaId = " + empresaId
    }
    sql += " ORDER BY pf.ref DESC, pf.fecha_recepcion DESC, pf.fecha DESC";
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

module.exports.getVisadasFacturaUsuario = function (visada, usuarioId, departamentoId, callback) {
    var connection = getConnection();
    sql = "SELECT f.*, f.numeroFacturaProveedor AS vNum";
    sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo, ant.numeroAnticipoProveedor AS numAnticipo,";

    sql += " COUNT(f.facproveId) AS num,";
    sql += " cnt.referencia AS ref,";
    sql += " CONCAT(tp.nombre, ' ', cnt.direccion, '-', cnt.poblacion, ', ', cnt.provincia) AS direccionTrabajo,";

    sql += " (COALESCE(ROUND((COALESCE(ROUND(COALESCE(v.total, 0 )-r.IAR, 2), 0))/(COALESCE(cnt.total, 0)-cnt.importeAgente),2), 0))*100 AS impPorcen,";

    sql += " (COALESCE(ROUND((COALESCE(g.gasto, 0))/(COALESCE(cnt.coste, 0)), 2), 0))*100 AS costePorcen,";

    sql += " (COALESCE(ROUND(COALESCE(ROUND((COALESCE(v.total, 0 )-r.IAR)-g.gasto, 2), 0)";
    sql += "/COALESCE(((COALESCE(cnt.total, 0)-cnt.importeAgente)-cnt.coste), 0), 2), 0))*100 AS benPorcen";

    sql += " FROM facprove AS f";
    sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
    sql += " LEFT JOIN facprove_serviciados AS ser ON ser.facproveId = f.facproveId";
    sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = ser.contratoId";
    sql += " LEFT JOIN antprove as ant ON ant.facproveId = f.facproveId";
    sql += " LEFT JOIN tipos_via AS tp ON tp.tipoViaId = cnt.tipoViaId";
 

    sql += " LEFT JOIN";
    sql += " (SELECT"; 
    sql += " contratoId, SUM(total) AS total";
    sql += " FROM facturas GROUP BY contratoId) AS v ON v.contratoId = ser.contratoId";

    sql += " LEFT JOIN"; 
    sql += " (SELECT";
    sql += " contratoId, ROUND(SUM(COALESCE((totalAlcliente * porcentajeAgente) / 100, 0)), 2) AS IAR";
    sql += " FROM facturas GROUP BY contratoId) AS r ON r.contratoId = ser.contratoId";

    sql += " LEFT JOIN";
    sql += " (SELECT";
    sql += " contratoId, SUM(importe) AS gasto";
    sql += " FROM facprove_serviciados GROUP BY contratoId) AS g ON g.contratoId = ser.contratoId";



    sql += " WHERE f.visada = ?"
    if (departamentoId > 0) {
        sql += " AND f.departamentoId = " + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = " + usuarioId + ")";
    }
    sql += " GROUP BY f.facproveId"
    sql += " order by f.ref DESC, f.fecha_recepcion DESC"
    sql = mysql.format(sql, visada);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

module.exports.getTipoOperacion = function (callback) {
    var connection = getConnection();
    sql = "SELECT * FROM tipos_operaciones";
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        } else {
            callback(null, result);
        }
    });

}

module.exports.getFechaPagosConta = function (fecha, numfactu, empresaId, callback) {
    contabilidadDb.getContaEmpresa(empresaId, function (err, conta) {
        if (err) return done(err);
        var connection = comun.getConnectionDb(conta);
        var sql = "SELECT fecultpa FROM pagos WHERE numfactu = ? AND numserie = 1 AND fecfactu = ?";
        sql = mysql.format(sql,[numfactu, fecha]);
            connection.query(sql, function (err, result) {
                connection.end();
                if (err) return callback(err);
                if(result.length == 0) return callback(null, null);
                callback(null, result[0]);
            })
    });
}

//METODOS RELACIONADOS CON EL ENVÍO DE CORREOS

// getPreCorreoFacturas
// obtiene las facturas no enviadas entre las fechas indicadas
module.exports.getPreCorreoFacturas = function (dFecha, hFecha, ProveedorId, empresaId, departamentoId, usuarioId, callback) {
    var connection = getConnection();
    var facturas = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "UPDATE facprove SET sel = 0";
    sql += " WHERE fecha >= ? AND fecha <= ?"; 
    if(ProveedorId > 0) {
        sql += " AND ProveedorId = ?";
    }
    sql += " AND enviadaCorreo = 0";
    sql = mysql.format(sql, [dFecha, hFecha, ProveedorId]);
    if (departamentoId > 0) {
        sql += " AND departamentoId = " + departamentoId;
    } else {
        sql += " AND departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")";
    }
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT f.*, numeroFacturaProveedor AS vNum";
        sql += " , fp.nombre as formaPago"
        sql += "  FROM facprove AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN proveedores as pro ON pro.ProveedorId = f.ProveedorId";
        sql += " LEFT JOIN partes AS par ON par.facproveId = f.facproveId"
        sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
        sql += " AND f.enviadaCorreo = 0 AND NOT par.facproveId IS NULL";
        sql = mysql.format(sql, [dFecha, hFecha]);
        if (ProveedorId > 0) {
            sql += " AND f.ProveedorId = ?";
            sql = mysql.format(sql, ProveedorId);
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
        sql += " GROUP BY f.facproveId "

        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            facturas = res;
            callback(null, facturas);
        });
    });
}

module.exports.postPrepararCorreos = function (dFecha, hFecha, proveedorId, empresaId, departamentoId, usuarioId, done) {
    crearPdfsFactura(dFecha, hFecha, proveedorId,  empresaId, departamentoId, usuarioId, (err, facturas) => {
        if (err) return done(err);
        done(null, facturas);
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

var crearPdfsFactura = function (dFecha, hFecha, proveedorId, empresaId, departamentoId, usuarioId, callback) {
    var con = getConnection();
    var facturas = null;
    var facturas2 = [];
    sql = "SELECT pf.*,";
    sql += " e.nombre as nombreEmpresa, e.email as correoEmpresa, e.infFacturas, e.infFacCliRep, e.plantillaCorreoFacturas, e.asuntoCorreo, ";
    sql += " pro.nombre as nombreProveedor, pro.correo as correoProveedor,";
    sql += " IF( pf.numeroFacturaProveedor IS NULL, CONCAT(REPLACE(pf.numeroFacturaProveedor2, '/', '-'), '@',pro.proveedorId), CONCAT(REPLACE(pf.numeroFacturaProveedor, '/', '-'), '@',pro.proveedorId)) AS nomfich";
    sql += " FROM facprove AS pf";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = pf.empresaId";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = pf.proveedorId";
    sql += " LEFT JOIN partes AS par ON par.facproveId = pf.facproveId"
    // -- modificar sql según parámetros
    sql += " WHERE pf.sel = 1 AND pf.enviadaCorreo = 0 AND NOT par.facproveId IS NULL";
    if (dFecha) {
        sql += " AND pf.fecha >= '" + dFecha + " 00:00:00'";
    }
    if (hFecha) {
        sql += " AND pf.fecha <= '" + hFecha + " 23:59:59'";
    }
    if (proveedorId > 0) sql += " AND pf.proveedorId = " + proveedorId;

    if (empresaId > 0) sql += " AND pf.empresaId = " + empresaId;

    if (departamentoId > 0) {
        sql += " AND pf.departamentoId = ?";
        sql = mysql.format(sql, departamentoId);
    } else {
        sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")";
    }
    sql += " GROUP BY pf.facproveId";

    //StiOptions.WebServer.url = "/api/streport";
    Stimulsoft.StiOptions.WebServer.url =  "http://" + process.env.API_HOST + ":" + process.env.STI_PORT;
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
            var file = process.env.REPORTS_DIR + "\\prefactpro_reparaciones.mrt";
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
            report.dataSources.items[pos].sqlCommand = sql + " WHERE pf.facproveId = " + f.facproveId;
          
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


                try{
                    fs.writeFileSync(process.env.FACTURA_PROVEEDOR_EXPORTADOS_DIR + "\\" + f.nomfich + ".pdf", buffer);
                    f.pdf = process.env.FACTURA_PROVEEDOR_EXPORTADOS_DIR + "\\" + f.nomfich + ".pdf";
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

// crearCorreosAEnviar
var crearCorreosAEnviar = (dFecha, hFecha, facturas, done) => {
    var numReg = 0;
    var totalReg = facturas.length;
    var primerRegistro = true;
    var antEmpresa = "";
    var antProveedor = "";
    var asuntoCorreo = "";
    var plantilla = "";
    var c0 = "";
    var c1 = "";
    var correo = {};
    var correos = [];
    var numFact;
    facturas.forEach((factura) => {
        ioAPI.sendProgress("Procesando correos...", ++numReg, totalReg);
        if (antEmpresa != factura.nombreEmpresa) {
            // nuevo correo, cada empresa manda el suyo
            correo.emisor = factura.correoEmpresa;
            antEmpresa = factura.nombreEmpresa;
        }
        if (antProveedor != factura.nombreProveedor) {
            // nuevo proveedor, un correo por proveedor
            if (!primerRegistro) {
                // antes de guardar montamos la plantilla
                plantilla = plantilla.replace('{0}', c0);
                plantilla = plantilla.replace('{1}', c1);
                correo.cuerpo = plantilla;
                c0 = ""; c1 = ""; plantilla = "";

                // ya podemos guardar el correo anterior en la lista
                correos.push(correo);
            }
            antProveedor = factura.nombreProveedor;
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
                destinatario: factura.correoProveedor,
                asunto: asuntoCorreo,
                ficheros: [],
                facturas: []
            }
            c0 = factura.nombreProveedor;
        }
        numFact = factura.nomfich.split('@')
        c1 += " FACTURA: " + numFact[0] + " IMPORTE: " + factura.totalConIva + "<br/>";
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
                    correoAPI.sendCorreo(c, parametros, true, (err) => {
                        ioAPI.sendProgress("Enviado correos... ", ++numReg, totalReg);
                        resEnvio += c.facturas[0].nombreProveedor + "(" + c.facturas[0].correoProveedor + ") // ";
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
            var sql = "UPDATE facprove SET enviadaCorreo = 1 WHERE facproveId = ?";
            sql = mysql.format(sql, factura.facproveId);
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

// getFacturasAll
// lee todos los registros de la tabla facturas y
// los devuelve como una lista de objetos
module.exports.getFacturasAllUsuario = function (usuarioId, departamentoId, dFecha, hFecha, empresaId, callback) {
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
    if(departamentoId > 0) {
        sql += " WHERE pf.departamentoId = " + departamentoId + " AND pf.fecha >=  '" + dFecha + "'";
        if(hFecha != ''  && hFecha != 'null') {
            sql += " AND pf.fecha <= '" + hFecha + "'";
        }
        if(empresaId > 0) {
            sql += " AND pf.empresaId = " + empresaId
        }
    } else {
        sql += " WHERE pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +") AND pf.fecha >=  '" + dFecha + "'";
        if(hFecha != ''  && hFecha != 'null') {
            sql += " AND pf.fecha <= '" + hFecha + "'";
        }
        if(empresaId > 0) {
        sql += " AND pf.empresaId = " + empresaId
        }
    }
    sql += " ORDER BY pf.ref DESC, pf.fecha_recepcion DESC, pf.fecha DESC";
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




