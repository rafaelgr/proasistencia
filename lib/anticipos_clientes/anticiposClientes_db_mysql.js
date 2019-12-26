// anticiposClientes_db_mysql
// Manejo de la tabla anticipos de clientes en la base de datos
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
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
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
    sql += " LEFT JOIN empresas as c ON c.empresaId = cm.empresaId";
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
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
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
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
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
        sql += " AND pf.contratoId = " + contratoId
    }
    sql = mysql.format(sql, [clienteId, facturaId]);
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
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.clienteId = ? AND pf.contratoId = ? AND pf.antclienId NOT IN (SELECT antClienId FROM factura_antCliens)";
    sql = mysql.format(sql, [clienteId, contratoId]);
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




// postAnticipo
// crear en la base de datos la anttura de cliente pasada
module.exports.postAnticipo = function (antClien, callback) {
    antClien.antClienId = 0; // fuerza el uso de autoincremento
    if (!comprobarantClien(antClien)) {
        var err = new Error("El anticipo del cliente pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    antClien.antClienId = 0;
    fnGetNumeroantClien(antClien, function (err, res) {
        if (err) return callback(err);
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
    if(antClien.serie) {//si hay serie hay que actualizar el numero y la serie
        fnGetNumeroantClien(antClien, function (err, res) {
            if(res) {
                antClien = res;
                sql = "UPDATE antClien SET ? WHERE antClienId = ?";
                sql = mysql.format(sql, [antClien, antClien.antClienId]);
                connection.query(sql, function (err, result) {
                    connection.end();
                    if (err) {
                        return callback(err);
                    } 
                    callback(null, antClien);
                });
            }
        });
    } else {
        delete antClien.serie;//si la sertie es null no se actualiza
        sql = "UPDATE antClien SET ? WHERE antClienId = ?";
        sql = mysql.format(sql, [antClien, antClien.antClienId]);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            } 
            callback(null, result);
        });
    }
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
    var connection = getConnection();
    sql = "DELETE FROM factura_antcliens WHERE antClienId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, result);
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
        sql += "  AND fecha_recepcion >= ? AND fecha_recepcion <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    }
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT f.*, f.numeroAnticipoCliente AS vNum";
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
    sql += "ORDER BY f.fecha ASC, f.numeroAnticipoCliente ASC"
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        contabilidadDb.contabilizarAnticiposClientes(rows, function (err) {
            if (err) return done(err);
            done(null);
        });

    });
}

//------------------------VISADAS----------------
module.exports.getVisadasAnticipo = function (visada, callback) {
    var connection = getConnection();
    sql = "SELECT f.*, f.numeroAnticipoCliente AS vNum";
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
    var connection = getConnection();
    if (err) {
        return callback(err);
    }
    
    sql = "UPDATE antClien SET ? WHERE antClienId = ?";
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
    sql += " fp.nombre AS vFPago,  en.direccion as dirTrabajo, pf.numeroAnticipoCliente as vNum";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN antClien AS f ON f.antClienId = pf.antClienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
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
    sql += " fp.nombre AS vFPago,  en.direccion as dirTrabajo, pf.numeroAnticipoCliente as vNum";
    sql += " FROM antClien AS pf";
    sql += " LEFT JOIN antClien AS f ON f.antClienId = pf.antClienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
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
        facturas = result;
        callback(null, facturas);
    });
}

//------------------------VISADAS----------------
module.exports.getVisadasAnticipoUsuario = function (visada, usuarioId, departamentoId, callback) {
    var connection = getConnection();
    sql = "SELECT f.*, f.numeroAnticipoCliente AS vNum";
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
        sql += " order by f.fecha_recepcion DESC"
        sql = mysql.format(sql, visada);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
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

var fnGetNumeroantClien = function (antClien, done) {
    var con = getConnection();
    var ano = moment(antClien.fecha).year();
    sql = "SELECT MAX(numero) AS n FROM antClien";
    sql += " WHERE ano = ? AND empresaId = ?";
    sql = mysql.format(sql, [ano, antClien.empresaId]);
    con.query(sql, function (err, res) {
        con.end()
        if (err) return done(err);
        // actualizar los campos del objeto antClien
        antClien.numero = res[0].n +1;
        antClien.ano = ano;
        done(null, antClien);
    });
}









