// anticiposClientes_db_mysql
// Manejo de la tabla anticipos de clientes en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
const mysql2 = require('mysql2/promise') ;
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
var conexion = require('../comun/comun');


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

// comprobarPreanttura
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarantClien(antClien) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof antClien;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && antClien.hasOwnProperty("antClienId"));
    comprobado = (comprobado && antClien.hasOwnProperty("empresaId"));
    comprobado = (comprobado && antClien.hasOwnProperty("clienteId"));
    comprobado = (comprobado && antClien.hasOwnProperty("fecha"));
    return comprobado;
}


// getAnticiposClientes
// lee  los registros de la tabla anticipos  que tienen alguna factura asociada y 
// los devuelve como una lista de objetos
module.exports.getAnticiposClientes = function (callback) {
    var connection = getConnection();
    var anticipos = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, en.direccion as dirTrabajo";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN antClien AS f ON f.antClienId = pf.antClienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = pf.empresaId";
    //sql += " WHERE pf.facturaId IS NULL"
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

module.exports.getAnticiposContrato = function (contratoId, callback) {
    var connection = getConnection();
    var antClien = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, c.direccion as dirTrabajo";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN antClien AS f ON f.antClienId = pf.antClienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
    sql += " LEFT JOIN empresas as c ON c.empresaId = pf.empresaId";
    sql += " LEFT JOIN antClien_serviciados AS fps ON fps.antClienId = pf.antClienId"
    sql += " WHERE fps.contratoId = ?";
    sql += " ORDER BY pf.fecha";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        antClien = result;
        callback(null, antClien);
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


// getAnticipoCliente
// busca  la anttura con id pasado
module.exports.getAnticipoCliente = function (id, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, en.direccion as dirTrabajo";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN antClien AS f ON f.antClienId = pf.antClienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = pf.empresaId";
    sql += " WHERE pf.antClienId = ?";
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

// getAnticipoCliente
// busca  la anttura con id pasado
module.exports.getAnticipoPorNumero = function (numeroAnticipoCliente, clienteId, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, en.direccion as dirTrabajo";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN antClien AS f ON f.antClienId = pf.antClienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = pf.empresaId";
    sql += " WHERE pf.numeroAnticipoCliente = ? AND pf.clienteId = ?";
    sql = mysql.format(sql, [numeroAnticipoCliente, clienteId]);
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


// getAnticipoClienteeId
// busca  las anticipos con id del cliente pasado
module.exports.getAnticipoClienteId = function (clienteId, contratoId, facturaId, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, en.direccion as dirTrabajo, pf.numeroAnticipoCliente as vNum";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.clienteId = ?  AND pf.antclienId IN (SELECT antClienId FROM factura_antCliens WHERE facturaId = ?)";
    if(contratoId > 0) {
        sql += " AND pf.contratoId = " + contratoId + " OR cm.clienteId IS NULL  AND pf.antclienId IN (SELECT antClienId FROM factura_antCliens WHERE facturaId = ?) ";
    }
    sql = mysql.format(sql, [clienteId, facturaId, facturaId]);
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

// getAnticipoClientePrefacturaeId
// busca  las anticipos con id del cliente pasado
module.exports.getAnticipoClientePrefacturaId = function (clienteId, contratoId, prefacturaAutoId, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, en.direccion as dirTrabajo, pf.numeroAnticipoCliente as vNum";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.clienteId = ?  AND pf.antclienId IN (SELECT antClienId FROM prefacturaauto_antCliens WHERE prefacturaAutoId = ?)";
    if(contratoId > 0) {
        sql += " AND pf.contratoId = " + contratoId + " OR cm.clienteId IS NULL  AND pf.antclienId IN (SELECT antClienId FROM prefacturaauto_antCliens WHERE prefacturaAutoId = ?) ";
    }
    sql = mysql.format(sql, [clienteId, prefacturaAutoId, prefacturaAutoId]);
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

// getAnticipoClienteeId
// busca  las anticipos con id del cliente pasado
module.exports.getAnticipoClienteIdNoVinculados = function (clienteId, contratoId, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, en.direccion as dirTrabajo, pf.numeroAnticipoCliente as vNum";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = pf.empresaId";
    sql += " WHERE (pf.clienteId = ?";
    sql = mysql.format(sql, clienteId);
    if(contratoId) {
        sql += " AND pf.contratoId = " + contratoId;
    }
    sql += " AND pf.antclienId NOT IN (SELECT antClienId FROM factura_antCliens))";
    if(!contratoId) {
        sql += " OR (cm.clienteId IS NULL AND pf.clienteId = ? AND pf.contratoId IS NULL AND pf.antclienId NOT IN (SELECT antClienId FROM factura_antCliens))";
        sql = mysql.format(sql, [clienteId, contratoId]);
    }
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
    sql += " fp.nombre AS vFPago,  en.direccion as dirTrabajo";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN antClien AS f ON f.antClienId = pf.antClienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = pf.empresaId";
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




// postAnticipo
// crear en la base de datos la anttura de cliente pasada
module.exports.postAnticipo = function (antClien, callback) {
    antClien.antClienId = 0; // fuerza el uso de autoincremento
    if (!comprobarantClien(antClien)) {
        var err = new Error("El anticipo del cliente pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    antClien.antClienId = 0;
    fnGetNumeroantClien(antClien, function (err, res) {
        if (err) return callback(err);
        var connection = getConnection();
        sql = "INSERT INTO antClien SET ?";
        sql = mysql.format(sql, antClien);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            antClien.antClienId = result.insertId;
            callback(null, antClien);
        });
    });
}

// putAnticipo
// Modifica la anttura de cliente según los datos del objeto pasado
// y guarda un documento adjunto a dicha anttura si este existe
module.exports.putAnticipo = function (id, antClien, callback) {
    /*if (!comprobarantClien(antClien)) {
        var err = new Error("la anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }*/
    if (id != antClien.antClienId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE antClien SET ? WHERE antClienId = ?";
    sql = mysql.format(sql, [antClien, antClien.antClienId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        compruebaVinculado(antClien.antClienId, function(err, result) {
            if(err) return callback(err);
            if(!result) return callback(null, result);
            //si el anticipo está vinculado actualizamos el importe de la factura correspondiente
            actulizaFacturaVinculada(result.facturaId, function(err, result2) {
                if(err) return callback(err);
                callback(null, 'OK');
            });
        });
    });
}

var compruebaVinculado = function (antClienId, done) {
    var con = getConnection();
    sql = "SELECT * FROM factura_antcliens";
    sql += " WHERE antClienId = ?";
    sql = mysql.format(sql, antClienId);
    con.query(sql, function (err, res) {
        con.end();
        if(err) return done(err);
        if(res.length > 0) return done(null, res[0]);
        return done(null, null);
    });
}

var actulizaFacturaVinculada = function (facturaId, done) {
    var con = getConnection();
    sql = "SELECT COALESCE(SUM(totalConIva), 0) AS importeAnticipos FROM factura_antcliens fa";
    sql += " LEFT JOIN antclien AS a ON a.antclienId = fa.antClienId"
    sql += " WHERE  fa.facturaId = ?";
    sql = mysql.format(sql, facturaId);
    con.query(sql, function (err, res) {
        con.end();
        if(err) return done(err);
        var con2 = getConnection();
        sql = "UPDATE facturas SET importeAnticipo = ?, restoCobrar = totalConIva - " + res[0].importeAnticipos;
        sql += " WHERE facturaId = ?";
        sql = mysql.format(sql, [res[0].importeAnticipos, facturaId]);
        con2.query(sql, function (err, res) {
            con2.end();
            if(err) return done(err);
            return done(null, 'OK');
        });
    });
}


module.exports.putAntProveAnticipoToNull = function (facprove, callback) {
    facprove.facturaId = null;
    var connection = getConnection();
    sql = "UPDATE antClien SET ? WHERE antClienId = ?";
    sql = mysql.format(sql, [facprove, facprove.antClienId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        } else {
            callback(null, result);
        }
    });
}

// deleteFacturaAntCliens
module.exports.deleteFacturaAntCliens = function (id, callback) {
    compruebaVinculado(id, function(err, result) {
        if(err) return callback(err);
        var connection = getConnection();
        sql = "DELETE FROM factura_antcliens WHERE antClienId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result2) {
            connection.end();
            if (err) return callback(err);
            if(!result) return callback(null, null);
            return callback(null, result);
        });
    });
}

// deleteFacturaAntClien
module.exports.deleteFacturaAntClien = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM factura_antcliens WHERE antclienId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}



// deleteAnticipo
// Elimina el prefactura con el id pasado
module.exports.deleteAnticipo = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from antClien WHERE antClienId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}

module.exports.actualizaVinculada = function (data, callback) {
    actulizaFacturaVinculada(data.facturaId, function(err, result) {
        if(err) return callback(err);
        callback(null, 'OK');
    });
}

module.exports.del = function (file, done) {
    var filename = path.join(__dirname, '../../public/ficheros/anticipos_clientes/' + file);
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



var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};



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
    var sql = "UPDATE antClien SET sel = 1";
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
        connection.end();
        if (err) return callback(err);
        connection = getConnection();
        sql = "SELECT f.*";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo, pro.IBAN as IBAN"
        sql += "  FROM antClien AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
        sql += " LEFT JOIN clientes AS pro ON pro.clienteId = f.clienteId";
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
        sql += " ORDER BY f.numeroAnticipoCliente, f.fecha ASC";
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            anticipos = res;
            anticipos.forEach(function (pf) {
                pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
            });
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
    var sql = "SELECT f.*";
    sql += " FROM antClien as f";
    sql += " WHERE sel = 1 AND contabilizada = 0 AND noContabilizar = 0";
    if(departamentoId && departamentoId > 0) {
        sql += " AND f.departamentoId =" + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    if(dFecha && hFecha) {
        sql += "  AND f.fecha >= ? AND f.fecha <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    }
    sql += " ORDER BY f.fecha ASC, f.numeroAnticipoCliente ASC"
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        contabilidadDb.contabilizarAnticiposClientes(rows, function (err, result) {
            if (err) return done(err);
            if(result.length > 0) {
                done(null, result)
            } else {
                done(null, 'OK');
            }
        });

    });
}

//------------------------VISADAS----------------
module.exports.getVisadasAnticipo = function (visada, callback) {
    var connection = getConnection();
    sql = "SELECT f.*";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM antClien AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " WHERE visada = ?";
        sql += " order by f.fecha DESC, f.antClienId ASC"
        sql = mysql.format(sql, visada);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        
        callback(null, result);
    });
}


// putAnticipo
// Modifica la anttura de Cliente según los datos del objeto pasado
module.exports.putAnticipoVisada = function (id, antClien,  callback) {
    if (!comprobarantClien(antClien)) {
        var err = new Error("la anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != antClien.antClienId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    if (err) {
        return callback(err);
    }
    var connection = getConnection();
    var sql = "UPDATE antClien SET ? WHERE antClienId = ?";
    sql = mysql.format(sql, [antClien, antClien.antClienId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, antClien);
    });
}

//METODOS RELACIONADOS CON LOS DEPARTAMENTOS DE USUARIO

// getAnticiposClientesUsuario
// lee los registros de la tabla antClien cuyo departamento tenga asignado el usuario logado y
// los devuelve como una lista de objetos
module.exports.getAnticiposClientesUsuario = function (usuarioId, departamentoId,callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago,  en.direccion as dirTrabajo";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN antClien AS f ON f.antClienId = pf.antClienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = pf.empresaId";
    //sql += " WHERE pf.facturaId IS NULL"
    if(departamentoId > 0) {
        sql += " WHERE pf.departamentoId = " + departamentoId;
    } else {
        sql += " WHERE pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    sql += " AND pf.antClienId NOT IN (SELECT antClienId from factura_antcliens  WHERE NOT antClienId IS NULL)"
    sql += " ORDER BY  pf.fecha DESC";
    sql = mysql.format(sql, usuarioId);
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

// getAnticiposAll
// lee todos los registros de la tabla anticipos y
// los devuelve como una lista de objetos
module.exports.getAnticiposAllUsuario = function (usuarioId, departamentoId, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago,  en.direccion as dirTrabajo";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN antClien AS f ON f.antClienId = pf.antClienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = pf.empresaId";
    if(departamentoId > 0) {
        sql += " WHERE pf.departamentoId = " + departamentoId;
    } else {
        sql += " WHERE pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    sql += " ORDER BY  pf.fecha DESC";
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


module.exports.getAnticiposCliente = function (clienteId, callback) {
    var connection = getConnection();
    var sql = "SELECT * FROM antClien WHERE clienteId = ?";
    sql = mysql.format(sql,clienteId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, result);
    })
}

//------------------------VISADAS----------------
module.exports.getVisadasAnticipoUsuario = function (visada, usuarioId, departamentoId, callback) {
    var connection = getConnection();
    sql = "SELECT f.*";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM antClien AS f";
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
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
        callback(null, result);
    });
}


module.exports.getFacturaAsociada = function (antClienId, callback) {
    var connection = getConnection();
    sql = "SELECT * FROM factura_antcliens WHERE antClienId = ?";
    sql = mysql.format(sql, antClienId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

//VINCULAR FACTURA A ANTICIPOS

module.exports.vinculaAntCliens = function (antCliens, callback) {
    async.eachSeries(antCliens, function (e, done) {
        var connection = getConnection();
        var sql;
        e.facturaAntclienId = 0 //forzamos el autoincremento
        sql = "INSERT INTO  factura_antcliens SET ?";
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

//BORRAR ANTCLIEN DESDE PARTE
module.exports.BorrarAntclienDesdeParte = function (parteLineaId, clienteId, done) {
    var con = getConnection();
    var sql = "";
    var antclien;
    // Transaccion general que protege todo el proceso
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // obtener el anticipo que se tiene que borrar
        sql = " SELECT * from antclien AS ant";
        sql += " INNER JOIN factura_antcliens AS fa ON fa.antClienId = ant.antClienId";
        sql += " WHERE ant.parteLineaId = ? AND ant.clienteId = ?";
        sql = mysql.format(sql, [parteLineaId, clienteId]);
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function () { done(err) });
            antclien = res[0];
            //se borra la vinculación del anticipo
            sql = " DELETE FROM factura_antcliens where antClienId = ?"
            sql = mysql.format(sql, antclien.antClienId);
            con.query(sql, function (err, res) {
                if (err) return con.rollback(function () { done(err) });
                //se borra el anticipo
                sql = " DELETE FROM antclien where antClienId = ?"
                sql = mysql.format(sql, antclien.antClienId);
                con.query(sql, function (err, res) {
                    if (err) return con.rollback(function () { done(err) });
                    //se actualizan los totales de la factura 
                  sql = " UPDATE facturas SET importeAnticipo = importeAnticipo-" + antclien.totalConIva +" , restoCobrar = restoCobrar+" + antclien.totalConIva +" WHERE facturaId = "+ antclien.facturaId;
                    con.query(sql, function (err, res) {
                        if (err) return con.rollback(function () { done(err) });
                        con.commit(function (err) {
                            if (err) return con.rollback(function (err) { done(err) });
                            con.end();
                            done(null, res);//todo correcto
                        });
                    });
                });

            });
              
        });
    });
}

module.exports.getAnticiposClienteServicio = function (servicioId, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, en.direccion as dirTrabajo, if(fa.antClienId, 'true', 'false') as vinculado";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN antClien AS f ON f.antClienId = pf.antClienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = pf.empresaId";
    sql += " LEFT JOIN factura_antcliens as fa ON fa.antClienId = pf.antClienId";
    sql += " WHERE pf.servicioId = ?"
    sql += " ORDER BY pf.fecha DESC";
    sql = mysql.format(sql,servicioId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, result);
    })
}

// postDescontabilizar
module.exports.postDescontabilizar = async (id) => {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            conn = await mysql2.createConnection(obtenerConfiguracion());
            sql = "UPDATE antClien SET contabilizada = 0 WHERE antClienId = ?";
            sql = mysql2.format(sql, id);
            const result = await conn.query(sql);
            conn.end();
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



var fnGetNumeroantClien = function (antClien, done) {
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
        antClien.ano = ano;
        antClien.numeroAnticipoCliente = 'ANT-'+ antClien.ano + "-" + antClien.numero;
        done(null, antClien);
    });
}









