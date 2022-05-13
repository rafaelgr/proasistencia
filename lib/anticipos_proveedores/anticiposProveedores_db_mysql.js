// anticiposProveedores_db_mysql
// Manejo de la tabla anticipos de proveedores en la base de datos
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

// comprobarPreanttura
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarAntprove(antprove) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof antprove;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && antprove.hasOwnProperty("antproveId"));
    comprobado = (comprobado && antprove.hasOwnProperty("empresaId"));
    comprobado = (comprobado && antprove.hasOwnProperty("proveedorId"));
    comprobado = (comprobado && antprove.hasOwnProperty("fecha"));
    return comprobado;
}


// getAnticiposProveedores
// lee  los registros de la tabla anticipos  que tienen alguna factura asociada y 
// los devuelve como una lista de objetos
module.exports.getAnticiposProveedores = function (callback) {
    var connection = getConnection();
    var anticipos = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antprove AS pf";
    sql += " LEFT JOIN antprove AS f ON f.antproveId = pf.antproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.facproveId IS NULL"
    sql += " ORDER BY pf.fecha DESC";
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        anticipos = result;
        callback(null, anticipos);
    });
}

module.exports.getAnticiposContrato = function (contratoId, esColaborador, callback) {
    var connection = getConnection();
    var antprove = null;
    sql = "SELECT pf.*, fps.importe AS importeServiciado, fp.nombre AS vFPago, cm.referencia AS ref";
    sql += " FROM antprove AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN antprove_serviciados AS fps ON fps.antproveId = pf.antproveId";
    sql += " LEFT JOIN contratos AS cm ON cm.contratoId = fps.contratoId";
    sql += " LEFT JOIN empresas AS c ON c.empresaId = cm.empresaId ";
    sql += " WHERE fps.contratoId = ?";
    sql += " AND esColaborador = ?"
    sql += " ORDER BY pf.fecha";
    sql = mysql.format(sql, [contratoId, esColaborador]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        antprove = result;
        callback(null, antprove);
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
// getAnticipoProveedore
// busca  la anttura con id pasado
module.exports.getAnticipoProveedor = function (id, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo, p.IBAN";
    sql += " FROM antprove AS pf";
    sql += " LEFT JOIN antprove AS f ON f.antproveId = pf.antproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " LEFT JOIN proveedores as p ON p.proveedorId = pf.proveedorId";
    sql += " WHERE pf.antproveId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

// getAnticipoProveedore
// busca  la anttura con id pasado
module.exports.getAnticipoPorNumero = function (numeroAnticipoProveedor, proId,callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antprove AS pf";
    sql += " LEFT JOIN antprove AS f ON f.antproveId = pf.antproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.numeroAnticipoProveedor = ? AND pf.proveedorId = ?";
    sql = mysql.format(sql, [numeroAnticipoProveedor, proId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

// getAnticipoProveedoreId
// busca  las anticipos con id del proveedor pasado que sean completos
module.exports.getAnticipoProveedorId = function (id, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antprove AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.proveedorId = ? AND pf.completo = 1 AND  pf.antproveId NOT IN (SELECT antproveId from facprove WHERE NOT antproveId IS NULL)";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

// getAnticipoProveedoreId
// busca  las anticipos con id del proveedor pasado que no estén vinculados
module.exports.getAnticipoProveedorIdIncompleto = function (id, departamentoId, callback) {
    var connection = getConnection();
    var opcion = " INNER ";
    if(departamentoId == 7) opcion = " LEFT ";
    var sql = "SELECT DISTINCT"; 
    sql += " pf.antproveId,";
    sql += " s.antproveServiciadoId,";
    sql += " pf.numeroAnticipoProveedor,";
    sql += " pf.emisorNombre,";
    sql += " pf.receptorNombre,";
    sql += " pf.fecha,";
    sql += " IF(pf.departamentoId = 7, pf.totalConIva, s.importe) AS totalConIva, ";
    sql += " fp.nombre AS vFPago, ";
    sql += " cm.referencia";
    sql += " FROM antprove AS pf ";
    sql +=  opcion + "JOIN `antprove_serviciados` AS s ON s.antproveId = pf.antproveId";
    sql += " LEFT JOIN `facprove_serviciados` AS s2 ON s2.contratoId = s.contratoId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId ";
    sql += " LEFT JOIN contratos AS cm ON cm.contratoId = s.contratoId ";
    sql += " LEFT JOIN empresas AS en ON en.empresaId = cm.empresaId ";
    sql += " WHERE pf.proveedorId = ? AND pf.departamentoId = ? AND pf.completo = 0 AND pf.antproveId NOT IN (SELECT antproveId FROM facprove_antproves)";
    sql = mysql.format(sql, [id, departamentoId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

// getAnticipoProveedorTodos
// busca  las anticipos con id del proveedor pasado que esten vinculados
module.exports.getAnticipoProveedorTodos = function (id, facproveId, departamentoId, callback) {
    var connection = getConnection();
    var opcion = " INNER ";
    if(departamentoId == 7) opcion = " LEFT "
    sql = "SELECT DISTINCT s.antproveServiciadoId, pf.antproveId, pf.numeroAnticipoProveedor, pf.emisorNombre, pf.receptorNombre, pf.fecha, ";
    sql +=" IF(pf.departamentoId = 7, pf.totalconIva, s.importe) AS totalConIva,  fp.nombre AS vFPago,  cm.referencia ";
    sql +=" FROM antprove_serviciados  AS s";
    sql +=" INNER JOIN facprove_antproves AS fa ON fa.antproveId = s.antproveId AND fa.antproveServiciadoId = s.antproveServiciadoId";
    sql +=" LEFT JOIN antprove AS pf ON pf.antproveId = s.antproveId ";
    sql +=" LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId  ";
    sql +=" LEFT JOIN contratos AS cm ON cm.contratoId = s.contratoId  ";
    sql +=" LEFT JOIN empresas AS en ON en.empresaId = cm.empresaId  ";
    sql +=" WHERE pf.proveedorId = ? AND fa.facproveId = ? AND pf.completo = 0";
    sql = mysql.format(sql, [id, facproveId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}




// getAnticiposAll
// lee todos los registros de la tabla anticipos y
// los devuelve como una lista de objetos
module.exports.getAnticiposAll = function (callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antprove AS pf";
    sql += " LEFT JOIN antprove AS f ON f.antproveId = pf.antproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " ORDER BY pf.fecha DESC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        facturas = result;
        callback(null, facturas);
    });
}

module.exports.vinculaAntProves = function (antProve, callback) {
    async.eachSeries(antProve, function (e, done) {
        var connection = getConnection();
        var sql;
        e.facproveAntproveId = 0 //forzamos el autoincremento
        sql = "INSERT INTO  facprove_antproves SET ?";
        sql = mysql.format(sql, e);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return done(err, null);
            }
            done(null, result);
        });

    }, function (err) {
        if (err) return callback(err);
        callback(null);
    });
}

// deleteFacturaAntCliens
module.exports.deleteFacturaAntProve = function (antprove, callback) {
    var connection = getConnection();
    sql = "DELETE FROM facprove_antproves WHERE antproveId = ?";
    sql = mysql.format(sql, [antprove.antproveId, antprove.antproveServiciadoId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}


// postAnticipo
// crear en la base de datos la anttura de proveedor pasada
module.exports.postAnticipo = function (antprove, callback) {
    antprove.antproveId = 0; // fuerza el uso de autoincremento
    if (!comprobarAntprove(antprove)) {
        var err = new Error("El anttura del proveedor pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    sql = "INSERT INTO antprove SET ?";
    sql = mysql.format(sql, antprove);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        antprove.antproveId = result.insertId;
        callback(null, antprove);
    });
}

// putAnticipo
// Modifica la anttura de proveedor según los datos del objeto pasado
// y guarda un documento adjunto a dicha anttura si este existe
module.exports.putAnticipo = function (id, antprove, callback) {
    /*if (!comprobarAntprove(antprove)) {
        var err = new Error("la anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }*/
    if (id != antprove.antproveId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    if (err) {
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE antprove SET ? WHERE antproveId = ?";
    sql = mysql.format(sql, [antprove, antprove.antproveId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        if(antprove.completo) return callback(null, antprove);//si el anticipo es completo no hacemos nada mas
        compruebaVinculado(antprove.antproveId, function(err, result) {
            if(err) return callback(err);
            if(!result) return callback(null, result);
            //si el anticipo está vinculado actualizamos el importe de la factura correspondiente
            actulizaFacturaVinculada(result.facproveId, function(err, result2) {
                if(err) return callback(err);
                callback(null, antprove);
            });
        });
    });
}

var compruebaVinculado = function (antproveId, done) {
    var con = getConnection();
    sql = "SELECT * FROM facprove_antproves";
    sql += " WHERE antproveId = ?";
    sql = mysql.format(sql, antproveId);
    con.query(sql, function (err, res) {
        con.end();
        if(err) return done(err);
        if(res.length > 0) return done(null, res[0]);
        return done(null, null);
    });
}

var actulizaFacturaVinculada = function (facproveId, done) {
    var con = getConnection();
    var sql = "SELECT COALESCE(SUM(totalConIva), 0) AS importeAnticipos FROM facprove_antproves fa";
    sql += " LEFT JOIN antprove AS a ON a.antproveId = fa.antproveId"
    sql += " WHERE  fa.facproveId = ?";
    sql = mysql.format(sql, facproveId);
    con.query(sql, function (err, res) {
        con.end();
        if(err) return done(err);
        var con2 = getConnection();
        sql = "UPDATE facprove SET importeAnticipo = ?, restoPagar = totalConIva - fianza - " + res[0].importeAnticipos;
        sql += " WHERE facproveId = ?";
        sql = mysql.format(sql, [res[0].importeAnticipos, facproveId]);
        con2.query(sql, function (err, res) {
            con2.end();
            if(err) return done(err);
            return done(null, 'OK');
        });
    });
}

module.exports.putAntProveAnticipoToNull = function (facprove, callback) {
    facprove.facproveId = null;
    var connection = getConnection();
    sql = "UPDATE antprove SET ? WHERE antproveId = ?";
    sql = mysql.format(sql, [facprove, facprove.antproveId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        } else {
            callback(null, result);
        }
    });
}


// deleteAnticipo
// Elimina el prefactura con el id pasado
module.exports.deleteAnticipo = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from antprove WHERE antproveId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}

module.exports.del = function (file, done) {
    var filename = path.join(__dirname, '../../public/ficheros/anticipos_proveedores/' + file);
    fs.unlinkSync(filename);
    done(null);
}

// deletePreanticiposContrato
// Elimina todas las prefacturas pertenecientes a un contrato.
module.exports.deletePreanticiposContrato = function (id, callback) {
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


module.exports.getAnticiposCliente = function (clienteId, callback) {
    var connection = comun.getConnectionDb(conta);
    var sql = "SELECT * FROM antClien WHERE clienteId = ?";
    sql = mysql.format(sql,clienteId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        if(result.length == 0) return callback(null, null);
        callback(null, result);
    })
}

/*
|---------------------------------------|
|                                       |
|  LINEAS FACTURA                    |
|                                       |
|---------------------------------------|
*/


// comprobarAnticipoLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarAnticipoLinea(antproveLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof antproveLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && antproveLinea.hasOwnProperty("antproveId"));
    comprobado = (comprobado && antproveLinea.hasOwnProperty("antproveLineaId"));
    comprobado = (comprobado && antproveLinea.hasOwnProperty("linea"));
    comprobado = (comprobado && antproveLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && antproveLinea.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && antproveLinea.hasOwnProperty("porcentaje"));
    comprobado = (comprobado && antproveLinea.hasOwnProperty("descripcion"));
    comprobado = (comprobado && antproveLinea.hasOwnProperty("cantidad"));
    comprobado = (comprobado && antproveLinea.hasOwnProperty("importe"));
    comprobado = (comprobado && antproveLinea.hasOwnProperty("totalLinea"));
    return comprobado;
}

// comprobarAnticipoReten
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.

function comprobarAnticiporeten(antproveReten) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof antproveReten;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && antproveReten.hasOwnProperty("antproveId"));
    comprobado = (comprobado && antproveReten.hasOwnProperty("antproveRetencionId"));
    comprobado = (comprobado && antproveReten.hasOwnProperty("baseRetencion"));
    comprobado = (comprobado && antproveReten.hasOwnProperty("porcentajeRetencion"));
    comprobado = (comprobado && antproveReten.hasOwnProperty("importeRetencion"));
    return comprobado;
}

// getNextAnticipoLine
// busca el siguiente número de línea de la anttura pasada
module.exports.getNextAnticipoLineas = function (id, callback) {
    var connection = getConnection();
    var anticipos = null;
    sql = "SELECT MAX(linea) as maxline FROM antprove_lineas"
    sql += " WHERE antproveId = ?;";
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

// getAnticipoLineas
// Devuelve todas las líneas de una anttura
module.exports.getAnticipoLineas = function (id, callback) {
    var connection = getConnection();
    var anticipos = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM antprove_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.antproveId = ?";
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

// getPreantturaLinea
// Devuelve la línea de anttura solcitada por su id.
module.exports.getAnticipoLinea = function (id, callback) {
    var connection = getConnection();
    var anticipos = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM antprove_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.antproveLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// postAnticipoLinea
// crear en la base de datos la linea de prefactura pasada
module.exports.postAnticipoLinea = function (antproveLinea, callback) {
    if (!comprobarAnticipoLinea(antproveLinea)) {
        var err = new Error("La linea de anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    antproveLinea.antproveLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO antprove_lineas SET ?";
    sql = mysql.format(sql, antproveLinea);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        antproveLinea.antproveLineaId = result.insertId;
        // actualizar las bases y cuotas
        fnActualizarBases(antproveLinea.antproveId, function (err, res) {
            if (err) {
                return callback(err);
            }
            fnActualizarRetenciones(antproveLinea.antproveId, function (err, res) {
                if (err) {
                    return callback(err);
                }
                callback(null, antproveLinea);
            });
            
        });
        
    });
}


// putAnticipoLinea
// Modifica la linea de anttura de proveedor según los datos del objeto pasado
module.exports.putAnticipoLinea = function (id, antproveLinea, callback) {
    if (!comprobarAnticipoLinea(antproveLinea)) {
        var err = new Error("La linea de prefactura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != antproveLinea.antproveLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE antprove_lineas SET ? WHERE antproveLineaId = ?";
    sql = mysql.format(sql, [antproveLinea, antproveLinea.antproveLineaId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(antproveLinea.antproveId, function (err, res) {
            if (err) {
                return callback(err);
            }
            
            fnActualizarRetenciones(antproveLinea.antproveId, function (err, res) {
                if (err) {
                    return callback(err);
                }
                callback(null, antproveLinea);
            });
        });
        
    });
}

// deleteAnticipoLinea
// Elimina la linea de prefactura con el id pasado
module.exports.deleteAnticipoLinea = function (id, antproveLinea, callback) {
    var connection = getConnection();
    sql = "DELETE from antprove_lineas WHERE antproveLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(antproveLinea.antproveId, function (err, res) {
            if (err) {
                return callback(err);
            }
            //actualizamos las retenciones
            fnActualizarRetenciones(antproveLinea.antproveId, function (err, res) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
}


// recalculo de línea de anttura
module.exports.recalculoLineasAnticipo = function (prefacturaId, coste, porcentajeBeneficio, porcentajeAgente, tipoClienteId, done) {
    var con = getConnection();
    // Buscamos la líneas de la anttura
    sql = " SELECT pf.coste as costeAnticipoCompleta, pfl.*";
    sql += " FROM antprove as pf";
    sql += " LEFT JOIN antprove_lineas as pfl ON pfl.antproveId = pf.antproveId";
    sql += " WHERE pf.antproveId = ?";
    sql = mysql.format(sql, prefacturaId);
    con.query(sql, function (err, lineas) {
        con.end();
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
            var porcentajeDelCoste = linea.coste / linea.costeAnticipoCompleta;
            var importeDelNuevoCoste = coste * porcentajeDelCoste;
            linea.coste = importeDelNuevoCoste;
            // Recalculamos el total de la línea en base a los nuevos datos
            linea.totalLinea = obtenerImporteAlClienteDesdeCoste(importeDelNuevoCoste, porcentajeBeneficio, porcentajeAgente, tipoClienteId);
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costeAnticipoCompleta;
            // Actualizamos la línea lo que actualizará de paso la anttura
            if (linea.antproveLineaId == null) return
            exports.putAnticipoLinea(linea.antproveLineaId, linea, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        }, function (err) {
            if (err) return done(err);
            done(null);
        });
    });

}

// getAnticipoRetenciones
// Devuelve todas las retenciones de una anttura
module.exports.getAnticipoRetenciones = function (id, callback) {
    var connection = getConnection();
    var anticipos = null;
    sql = "SELECT fr.*, tp.descripcion AS descripcion FROM antprove_retenciones AS fr";
    sql += " LEFT JOIN usuarios.wtiporeten AS tp ON tp.codigo = fr.codigoRetencion "
    sql += " WHERE fr.antproveId = ?";
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
    var anticipos = null;
    sql = "SELECT * FROM wtiporeten";
    sql += " WHERE codigo IN (0,1,3,8)";
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
    var anticipos = null;
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
// Actuliza la tabla de bases y cuotas de la anttura pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBases = function (id, callback) {
    fnBorraBases(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
        sql = "INSERT INTO antprove_bases (antproveId, tipoIvaId, porcentaje, base, cuota)";
        sql += " SELECT pl.antproveId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
        sql += " FROM";
        sql += " (SELECT antproveId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
        sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
        sql += " FROM antprove_lineas";
        sql += " WHERE antproveId = ?";
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
// Actuliza la tabla de Retenciones y cuotas de la anttura pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarRetenciones = function (id, callback) {
    fnBorraRetenciones(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = getConnection();
        sql = "INSERT INTO antprove_Retenciones (antproveId, baseRetencion, porcentajeRetencion, importeRetencion, codigoRetencion, cuentaRetencion)";
        sql += " SELECT pl.antproveId, COALESCE(pl.baseRetencion, 0), pl.porcentajeRetencion, pl.importeRetencion, pl.codigoRetencion, pl.cuentaRetencion";
        sql += " FROM";
        sql += " (SELECT antproveId, SUM(importeRetencion) AS importeRetencion,  porcentajeRetencion, ROUND(SUM(totalLinea),2) AS baseRetencion, codigoRetencion, cuentaRetencion";
        sql += " FROM antprove_lineas";
        sql += " WHERE antproveId = ?";
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
// Actuliza los campos de totales de la cabecera de anttura de proveedores
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotales = function (id, callback) {
    var connection = getConnection();
    sql = "UPDATE antprove AS pf,";
    sql += " (SELECT antproveId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM antprove_bases GROUP BY 1) AS pf2,";


    sql += " (SELECT antproveId, COALESCE(SUM(importeRetencion), 0 ) AS ir";
    sql += " FROM antprove_retenciones GROUP BY 1) AS pf4,";



    sql += " (SELECT antproveId, SUM(coste) AS sc";
    sql += " FROM antprove_lineas GROUP BY 1) AS pf3";
    sql += " SET pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c - pf4.ir,";
    sql += " pf.coste = pf3.sc, pf.importeRetencion = pf4.ir";
    sql += " WHERE pf.antproveId = ?";
    sql += " AND pf2.antproveId = pf.antproveId";
    sql += " AND pf3.antproveId = pf.antproveId";
    sql += " AND pf4.antproveId = pf.antproveId";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        //si no hay registros en antprove_retenciones actualizaremos directamente el importeRetencion = 0
        var connection2 = getConnection();
        sql = "SELECT COUNT(*) AS total FROM antprove_retenciones";
        sql += " WHERE antproveId = ?";
        sql = mysql.format(sql, id);
        connection2.query(sql, function (err, resultBis) {
            connection2.end();
            if (err) {
                return callback(err);
            }
            if(resultBis[0].total == 0){
                var connection3 = getConnection();
                sql = "UPDATE antprove SET importeRetencion = 0 WHERE antproveId = ? ";
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
// elimina las bases y cuotas de una anttura de proveedor
// antes de actualizarlas
var fnBorraBases = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM antprove_bases";
    sql += " WHERE antproveId = ?";
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
// elimina las retenciones de una anttura de proveedor
// antes de actualizarlas
var fnBorraRetenciones = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM antprove_retenciones";
    sql += " WHERE antproveId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// getAnticipoBases
// devuelve los regitros de bases y cutas de la 
// prefactura con el id pasado
module.exports.getAnticipoBases = function (id, callback) {
    var connection = getConnection();
    var anticipos = null;
    sql = "SELECT pb.*, ti.nombre as tipo";
    sql += " FROM antprove_bases as pb";
    sql += " LEFT JOIN tipos_iva as ti ON ti.tipoIvaId = pb.tipoIvaId"
    sql += " WHERE antproveId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};




/*
|---------------------------------------|
|                                       |
|  LINEAS SERVICIADAS                   |
|                                       |
|---------------------------------------|
*/

function comprobarAnticipoServiciada(serviciada) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof serviciada;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && serviciada.hasOwnProperty("antproveServiciadoId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("antproveId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("empresaId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("contratoId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("importe"));
    return comprobado;
}

module.exports.getserviciadasAnticipo = function (antproveId, callback) {
    var connection = getConnection();
    sql = "SELECT serv.antproveServiciadoId, emp.nombre as empresa, CONCAT(cont.referencia, ' / ', cont.direccion, ' / ', tpro.nombre) AS referencia, serv.importe";
    sql += " FROM antprove_serviciados AS serv";
    sql += " INNER JOIN empresas AS emp ON emp.empresaId = serv.empresaId";
    sql += " INNER JOIN contratos AS cont ON cont.contratoId = serv.contratoId";
    sql += " INNER JOIN tipos_proyecto AS tpro ON tpro.tipoProyectoId = cont.tipoProyectoId";
    sql += " WHERE antproveId = ?";
    sql = mysql.format(sql, antproveId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

module.exports.getserviciadaAnticipo = function (id, callback) {
    var connection = getConnection();
    sql = "SELECT * FROM antprove_serviciados";
    sql += " WHERE antproveServiciadoId = ?"
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
    serviciada.antproveServiciadoId = 0; // fuerza el uso de autoincremento
    if (!comprobarAnticipoServiciada(serviciada)) {
        var err = new Error("La Empresa serviciada de anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    sql = "INSERT INTO antprove_serviciados SET ?";
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
    sql = "UPDATE antprove_serviciados SET ? WHERE antproveServiciadoId = ?";
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
    sql = "DELETE FROM antprove_serviciados";
    sql += " WHERE antproveServiciadoId = ?"
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null);
    });
}




// getPreContaAnticipos
// obtiene las anticipos no contabilizadas entre las fechas indicadas
module.exports.getPreContaAnticipos = function (dFecha, hFecha, departamentoId, usuarioId, callback) {
    if(dFecha == "null" || hFecha == "null") {
        dFecha = 0;
        hFecha = 0;
    }
    var connection = getConnection();
    var anticipos = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "UPDATE antprove SET sel = 1";
    sql += " WHERE noContabilizar = 0";
    sql += " AND contabilizada = 0";
    if(departamentoId && departamentoId > 0) {
        sql += " AND departamentoId =" + departamentoId;
    } else {
        sql += " AND departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    if(dFecha && hFecha) {
        sql += "  AND fecha >= ? AND fecha <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    }
    connection.query(sql, function (err, res) {
        connection.end()
        if (err) return callback(err);
        connection = getConnection();
        sql = "SELECT f.*, f.numeroAnticipoProveedor AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo, pro.IBAN as IBAN"
        sql += "  FROM antprove AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
        sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = f.proveedorId";
        sql += " WHERE noContabilizar = 0";
        sql += " AND contabilizada = 0";
        if(departamentoId && departamentoId > 0) {
            sql += " AND f.departamentoId = "+ departamentoId;
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
        }
        if(dFecha && hFecha) {
            sql += " AND f.fecha >= ? AND f.fecha <= ?";
            sql = mysql.format(sql, [dFecha, hFecha]);
        }
        sql += " ORDER BY  f.fecha ASC";
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            anticipos = res;
            callback(null, anticipos);
        });
    });
}

// ----------------- CONTABILIZACION
module.exports.postContabilizarAnticipos = function (dFecha, hFecha, departamentoId, usuarioId,done) {
    var con = getConnection();
    if(dFecha == "null" || hFecha == "null") {
        dFecha = 0;
        hFecha = 0;
    }
    var listas = [];
    var sql = "SELECT f.*, ser.antproveId AS serviciada, SUM(ser.importe) AS totalServiciado";
    sql += " FROM antprove as f";
    sql += " LEFT JOIN antprove_serviciados AS ser ON ser.antproveId = f.antproveId";
    sql += " WHERE sel = 1 AND contabilizada = 0  AND noContabilizar = 0";
    if(departamentoId && departamentoId > 0) {
        sql += " AND f.departamentoId =" + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    if(dFecha && hFecha) {
        sql += "  AND f.fecha >= ? AND f.fecha <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    }
    sql += "  GROUP BY f.antproveId, serviciada  ORDER BY  f.fecha ASC"
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        var numantprove = [];//guardara los numeros de anttura de proveedor no contabilizados por no tener serviciadas
        for(var i=0; i < rows.length; i++) {
            if(rows[i].total != rows[i].totalServiciado && rows[i].departamentoId != 7 && rows[i].completo == 1){
                numantprove.push(rows[i].numeroAnticipoProveedor);
                rows.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
                i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
            }
        }
        listas.push(numantprove);
        if(rows.length > 0) {
             //eliminamos la propiedad serviciada para contabilizar la anttura
             for(var j = 0; j < rows.length; j++) {
                delete rows[j].serviciada
                delete rows[j].totalServiciado
            }
            contabilidadDb.contabilizarFacturasProveedorSoloPagos(rows, function (err, result) {
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
module.exports.getVisadasAnticipo = function (visada, callback) {
    var connection = getConnection();
    sql = "SELECT f.*, f.numeroAnticipoProveedor AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM antprove AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " WHERE visada = ?";
        sql += " order by f.fecha DESC, f.antproveId ASC"
        sql = mysql.format(sql, visada);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


// putAnticipo
// Modifica el anticipo de proveedor según los datos del objeto pasado
module.exports.putAnticipoVisada = function (id, antprove,  callback) {
    if (!comprobarAntprove(antprove)) {
        var err = new Error("la anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != antprove.antproveId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    if (err) {
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE antprove SET ? WHERE antproveId = ?";
    sql = mysql.format(sql, [antprove, antprove.antproveId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, antprove);
    });
}

//METODOS RELACIONADOS CON LOS DEPARTAMENTOS DE USUARIO

// getFacturasProveedoresUsuario
// lee los registros de la tabla facprove cuyo departamento tenga asignado el usuario logado y
// los devuelve como una lista de objetos
module.exports.getAnticiposProveedoresUsuario = function (usuarioId, departamentoId, esColaborador, callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antprove AS pf";
    sql += " LEFT JOIN antprove AS f ON f.antproveId = pf.antproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.esColaborador = " + esColaborador + " AND pf.facproveId IS NULL AND pf.antproveId NOT IN (SELECT antproveId FROM facprove_antproves WHERE NOT antproveId IS NULL)"
    if(departamentoId > 0) {
        sql += " AND pf.departamentoId = " + departamentoId;
    } else {
        sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    sql += " ORDER BY  pf.fecha DESC";
    sql = mysql.format(sql, usuarioId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        prefacturas = result;
        callback(null, prefacturas);
    });
}

// getAnticiposAll
// lee todos los registros de la tabla anticipos y
// los devuelve como una lista de objetos
module.exports.getAnticiposAllUsuario = function (usuarioId, departamentoId, esColaborador, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antprove AS pf";
    sql += " LEFT JOIN antprove AS f ON f.antproveId = pf.antproveId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    if(departamentoId > 0) {
        sql += " WHERE pf.departamentoId = " + departamentoId;
    } else {
        sql += " WHERE pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    sql += " AND pf.esColaborador = " + esColaborador;
    sql += " ORDER BY  pf.fecha DESC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        facturas = result;
        callback(null, facturas);
    });
}

//------------------------VISADAS----------------
module.exports.getVisadasAnticipoUsuario = function (visada, usuarioId, departamentoId, callback) {
    var connection = getConnection();
    sql = "SELECT f.*, f.numeroAnticipoProveedor AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM antprove AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " WHERE visada = ?";
        if(departamentoId > 0) {
            sql += " AND f.departamentoId = " + departamentoId;
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
        }
        sql += " order by f.fecha DESC"
        sql = mysql.format(sql, visada);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

//BORRAR ANTPROVE DESDE PARTE
module.exports.BorrarAntproveDesdeParte = function (numeroAntprove, proveedorId, done) {
    var con = getConnection();
    var sql = "";
    var antprove;
    // Transaccion general que protege todo el proceso
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // obtener el anticipo que se tiene que borrar
        sql = " SELECT * from antprove AS ant";
        sql += " INNER JOIN facprove_antproves AS fa ON fa.antproveId = ant.antproveId";
        sql += " WHERE ant.numeroAnticipoProveedor = ? AND ant.proveedorId = ?";
        sql = mysql.format(sql, [numeroAntprove, proveedorId]);
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function (err2) { done(err) });
            antprove = res[0];
            //se borra la vinculación del anticipo
            sql = " DELETE FROM facprove_antproves where antproveId = ?"
            sql = mysql.format(sql, antprove.antproveId);
            con.query(sql, function (err, res) {
                if (err) return con.rollback(function (err2) { done(err) });
                //se borra el anticipo
                sql = " DELETE FROM antprove where antproveId = ?"
                sql = mysql.format(sql, antprove.antproveId);
                con.query(sql, function (err, res) {
                    if (err) return con.rollback(function (err2) { done(err) });
                    //se actualizan los totales de la factura de proveedor
                  sql = " UPDATE facprove SET importeAnticipo = importeAnticipo-" + antprove.totalConIva +" , restoPagar = restoPagar+" + antprove.totalConIva +" WHERE facproveId = "+ antprove.facproveId;
                    con.query(sql, function (err, res) {
                        if (err) return con.rollback(function (err2) { done(err) });
                        con.commit(function (err) {
                            if (err) return con.rollback(function (err2) { done(err) });
                            con.end();
                            done(null, res);//todo correcto
                        });
                    });
                });

            });
              
        });
    });
}

module.exports.getAnticiposProveedor = function (proveedorId, callback) {
    var connection = getConnection();
    var sql = "SELECT * FROM antProve WHERE proveedorId = ?";
    sql = mysql.format(sql,proveedorId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, result);
    })
}

module.exports.getAnticiposProveedorServicio = function (servicioId, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo, if(fa.antproveId, 'true', 'false') as vinculado";
    sql += " FROM antprove AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " LEFT JOIN facprove_antproves as fa ON fa.antproveId = pf.antproveId";
    sql += " WHERE pf.servicioId = ?"
    sql += " ORDER BY pf.fecha DESC";
    sql = mysql.format(sql,servicioId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, result);
    });
}









